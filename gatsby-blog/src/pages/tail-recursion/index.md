---
title: 꼬리 재귀
date: "2019-05-16T10:00:03.284Z"
---

자바스크립트는 재귀 깊이가 너무 깊어지면 오류가 발생한다. 호출 스택을 펼쳐서 재귀 호출을 루프처럼 펼쳐주는 기법을 사용하면 이런 오류를 막을 수 있다.

컴파일러는 _꼬리 재귀(tail recursion)_ 이라는 특별한 형태의 재귀 호출을 스택 깊이를 키우지 않고 처리하도록 최적화해줄 수 있다.
컴파일러가 최적화를 제공하지 않으면 _트램폴린(trampoline)_ 과 _스트림(stream)_ 등의 기법을 사용해 재귀를 수동으로 최적화할 수 있고, 스택이나 리스트 등의 데이터 구조와 함께 재귀를 루프로 바꾸는 일반적인 규칙을 활용하면 재귀를 기계적으로 루프로 바꿀 수 있다.

> 여기서 stack 이란 ? 함수를 호출한 후에 원래 자리로 돌아오려면, 원래 자리를 어딘가에 저장해둬야 하는데, 그 어딘가가 바로 Stack 이다.

피보나치 수열과 단순한 합을 구하는 재귀함수에서 문제는 두가지 이다.

1. 피보나치 수열은 재귀 호출을 두겹으로 호출하기 때문에 함수 호출 횟수가 많다.
2. 단순한 합을 구하는 재귀함수에서는 stack 의 깊이가 너무 깊어진다.

```javascript
// 단순 합을 재귀로 해결한 예제.
function sum(n) {
  if (n < 2) return n
  return n + sum(n - 1)
}
```

첫번 째 문제는 한겹으로 재귀를 호출 할 수 있다면 함수 호출을 줄일 수 있을 것이다.
두번 째 문제의 해결책은 두가지가 있을 수 있는데 다음과 같다.

* stack 을 쓰지 말자. 즉, 함수 호출을 하지말자.
* stack 을 쓰되 누적해서 쓰지말고 있는걸 재활용하자.

피보나치 수열에서 해결은 _반복 단계별 계산 결과를 반복이 끝날 때까지 어떤 변수(여기서는 previousFibo)에 계속 저장한다._ 방식으로 해결이 된다.
피보나치 수열을 재귀가 아닌 반복문을 이용해서 풀어보자. 바로 해결이 될 것이다.

프로그램이 stack 을 쓰는 이유는 함수 실행 후 돌아갈 원래 자리를 stack 에 저장을 하기 때문이다.
그렇다면 왜 원래 자리로 돌아가는가??

바로 _원래 자리에서 해야 할 일이 남아있기 때문이다._
바꿔 말하면, _원래 자리에서 해야할 일이 남아있지 않다면 돌아갈 원래 자리를 Stack 에 추가로 저장할 필요가 없다._

```javascript
function fibonacci(n) {
  if (n < 2) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

`fibonacci(n - 1)`를 호출한 후에 바로 리턴하는 것이 아니라 다시 한 번 `fibonacci(n - 2)`를 실행해서 두 값을 더한 후에 리턴한다. 다시 말해, 원래 자리로 돌아와서 해야할 일이 남아있으므로 돌아올 원래 자리의 정보를 Stack 에 추가해서 저장해야 한다.

그렇다면 원래 자리에서 해야할 일을 남겨두지 않는 방법은 무엇인가? 그 방법이 바로 Tail Call(꼬리 호출)이다.

```javascript
function a() {
  var v = 0
  return b(v)
}
function b(n) {
  return n + 1
}
a()
```

_Tail Call 은 함수를 호출해서 값을 반환 받은 후 아무 일도 하지 않고 바로 반환하게 하기 위해 논리적으로 가장 마지막(꼬리) 위치에서 함수를 호출하는 방식을 말한다._
_Tail Call 방식을 적용하려면 두 겹인 재귀 호출을 한 겹으로 줄여야만 한다._

즉, 반환 받은 후 아무일도 하지 않게끔 하는 Tail Call 방식으로 짜는 것까지는 프로그래머가 할 수 있는 일이지만, Tail Call 방식으로 짰다고 해도 그런 코드를 돌리는 실행 환경에서는 내부적으로 여전히 Stack 을 새로 만들어 추가하는 비효율적인 방식으로 동작할 수도 있다.

> tail Call 방식으로 짜여지면 Stack 을 새로 만들지 않고 이미 있는 Stack 속의 값만 대체해서 Stack 을 재사용하는 방식으로 동작하도록 최적화 할 수 있다. 이러한 최적화를 Tail Call Optimization(또는 Tail Call Elimination)이라고 하며 언어의 실행 환경에서 지원해줘야 한다.

Tail Recursion 의 경우에는 *Tail Call 의 특별한 경우로서 Tail Call 로 호출하는 함수가 자기 자신인 경우*에 해당한다.
이제 Tail Recursion 으로 fibonacci 수를 구하는 코드를 짜보자. 앞에서 재귀 호출 방식을 반복 방식으로 바꾸는 작업을 직접 해봤다면 크게 어렵지 않을 것이다.

```javascript
function fibonacciTailRecursion(n, previousFibo, previousPreviousFibo) {
  var currentFibo
  if (n < 2) return n * previousFibo

  // 이번 호출의 피보나치 수를 구하고
  currentFibo = previousFibo + previousPreviousFibo

  // 다음번 재귀 호출을 위해 앞의 피보나치 수를 앞의앞의 피보나치 수로 한 칸 미루고
  previousPreviousFibo = previousFibo

  // 다음번 재귀 호출을 위해 현재의 피보나치 수를 앞의 피보나치 수로 한 칸 미룬다.
  previousFibo = currentFibo

  return fibonacciRecursion(n - 1, previousFibo, previousPreviousFibo)
}
```

```javascript
function fibonacciTailRecursion(n, previousFibo, previousPreviousFibo) {
  if (n < 2) return n * previousFibo
  return fibonacciTailRecursion(
    n - 1,
    previousFibo + previousPreviousFibo,
    previousFibo
  )
}
```

재귀 호출을 반복이나 Tail Recursion 방식으로 구현하려면 다음의 사항을 꼭 기억하자.
반복이나 꼬리 호출 단계별 계산 결과를 어딘가에 계속 저장한다.

반복 방식에서는 previousFibo 이 반복문 외부에서 선언되었고, Tail Recursion 방식에서는 previousFibo 이 함수의 파라미터로 사용된다는 점만 다를 뿐, 반복이나 꼬리 호출 단계별 계산 결과를 어딘가에 저장해둔다는 점은 똑같다.

인터프리터 / 컴파일러는 호출 스택에서 과거 함수 호출을 제거하여 재귀를 최적화합니다. 하지만 자바 스크립트에서 꼬리 재귀는 인식되지 않고 여전히 호출 스택에 배치가 되는 문제점을 가지고 있다.

## Trampoline

일반적인 Tail Recursion 에서는 tail position 에서 함수 스스로를 계속 호출을 하고 그 결과를 바로 다시 자기 자신 함수의 결과로 넘겨서 호출하곤 했었다.
이때 컴파일러가 tail positon 호출을 위한 optimizations 이 안되어 있다면 스택은 계속 쌓여만 간다.

Tail Recursion 으로 짠 factorial

```javascript
function factorial(n) {
  var recur = function(result, n) {
    if (n === 1) return result

    return recur(result * n, n - 1)
  }
  return recur(1, n)
}
// So factorial(4) = recur(1, 4) = recur(4 * 1, 3) = recur(4 * 3, 3) = recur(12 * 2, 2) = recur(24 * 1, 1) = 24.
```

위 코드에서 `factorial(100000000)` 실행시키면 Maximum call stack size exceeded 에러가 발생한다.

그래서 한가지 방법중에 하나가 trampoline 이라고 불리는 패턴이다.
만약 위에서 말한 계속 호출하는 방식이 아닌 호출할 함수를 리턴해준다면, 우리는 tramploine 을 사용해서 계속적으로 실행할 수 있다.

trampoline 자바스크립트에서 tail recursion 을 실행시켜주는 helper function 이다.
보통 다른 문서들에서 thunk 와 tramploining 이란 단어를 들어 봤을 것이다.
`thunk`는 아직 호출되지 않는 함수를 말한다. 즉, 다른 함수에 대한 호출을 래핑하는 함수이다. 간단하게는 currying 과 binding 에서 이런 기능을 볼 수 있다.
`trampoline function`에 thunk 를 전달을 하면 bound function 이 나오고, 해당 인자 값과 함께 while-loop 를 통해서 bound function 이 더 이상 함수가 아닐때 까지 그것의 recursive function 을 호출한다.

```javascript
function trampoline(fn) {
  while (fn && fn instanceof Function) {
//continue if fn is not undefined/null and if it is still a
//function
    fn = fn(); // recur.bind(null,1*4,3) 을 실행.. 이 함수도 thunk 함수이다. 함수 호출 이후에 함수를 리턴함으로
  }
//we call the function and assign the result of called previous fn
//to new fn
  return fn;
//when we are done return fn when fn is the result and no longer
//function.
}
function factorial(n) {
  var recur = function(result, n) {
    if (n === 1)
      return result;
    return recur.bind(null, result * n, n — 1);
  }
  return trampoline(recur(1, n));
}
```

위 예에서 `factorical(4)` 를 호출한다고 가정을 해보고 호출을 따라가보자.
여기서 위에서 설명한 `thunk 함수`는 `recur 함수`이다.
`recur(1,n)` 을 trampoline 함수에 인자로 넘겼을 때, `recur(1,4)` 를 호출 후에 우리는 사실 `recur.bind(null,1*4,3)` 을 넘기게 됩니다.
while 반복문은 recur 가 undefined/null 이지 않고, 함수인지를 체크한다. 여기서 recur 이 bounded 되고 나서도 recur 함수는 Function object 의 인스턴스로 여전히 남아있게 된다.

```javascript
console.log(recur.bind(null, 1 * 4, 3)) // [Function: bound recur]
```

루프에 2 가지 상태를 확인한 후에 fn 을 호출한다. 그리곤 그것의 결과를 다시 fn 에 할당한다.
그러면 fn 은 `recur.bind(null,4*3,2)` 가 된다. 이 루프는 `recur.bind(null,12*2,1)` 이 될때까지 동작하게 된다. 그리곤 24 를 리턴한다. 여기서 24 값은 undefined/null 이 아니다, 그래서 while 루프 상태값에서 통과가 되지만 24 값은 function 이 아니기에 while 루프가 중지된다. trampoline 함수는 결국 24 인 fn 을 반환하게 된다.

이 과정에서 우리는 함수 호출을 쌓을 필요가 없습니다. 각 함수가 호출되어 바운드 함수를 반환 한 다음 호출 스택에서 제거됩니다. 그런 다음 trampoline 의 while 루프를 사용하여 바운드 함수를 호출하여 각 재귀 적 단계로 건너 뛰게 됩니다.

while 문을 돌면서 fn 이 함수가 아닌 값으로 떨어질때까지 호출하고 리턴하고를 반복한다. fn 을 만들때에는 해당 조건이 완성되지 않았을 때는 계속 함수를 리턴하도록 해준다.

결과적으로 같이 `factorial(100000000)`을 실행할 경우에 call stack 에러가 뜨지 않는다.

## 예시

트리 구조로 되어있는 것을 flat 하게 만들자.

예시

```javascript
const tree = {
  name: 'root',
  children: [
    {
      name: 'subtree1',
      children: [{ name: 'child1' }, { name: 'child2' }],
    },
    { name: 'child3' },
    {
      name: 'subtree2',
      children: [
        {
          name: 'child1',
          children: [{ name: 'child4' }, { name: 'child5' }],
        },
        { name: 'child6' },
      ],
    },
  ],
}
```

맨 처음에는 재귀 함수를 사용했었다.

재귀 함수가 퍼포먼스 측면에서 느린건 잘 모르겠으나 자바스크립트에서 stack 이 overflow 날 위험이 있다.
브라우저 쪽에서 tail call optimization 을 지원한다면 stack 이 과다하게 차지 않아도 될듯 싶은데 아직은 그런 기능이 없는거 같다.

< 처음 짠 재귀 함수 >

```javascript
const makeFlatTreeStructureData = (treeData = []) => {
  const result = []

  function insertItem(root) {
    root.forEach(item => {
      if (item) {
        result.push(item)
        if (item.child && item.child.length > 0) {
          insertItem(item.child)
        }
      }
    })
  }

  insertItem(treeData)

  return result
}
```

여기서 stack 이 overflow 나지 않게 트릭을 하나 쓸수 있는데 바로 trampoline 패턴이다.
근데 이 trampoline 패턴의 방식은 큰 약점이 있는데 그것은 느리다는 것이다.

각 재귀 마다 새로운 함수를 만들어내고 많은 재귀는 당연히 많은 함수를 만든다는 것이다.
그래서 이방식은 오류를 방지할 순 있지만 느리다는게 최대 단점이다.

참조: [https://marmelab.com/blog/2018/02/12/understanding-recursion.html](https://marmelab.com/blog/2018/02/12/understanding-recursion.html)

참고로 아직 trampoline 방식으로 구현을 어떻게 해야할지 구현을 못해봤다. ( 5 월 16 일 )

구현을 따로 해봐야 할 꺼 같다.

```javascript
// trampoline 방식
// 재귀 함수를 스택을 늘리지 않고 호출 할 수 있게끔 하는 helper 함수.
const trampoline = fn => {
  while (fn && fn instanceof Function) {
    //continue if fn is not undefined/null and if it is still a
    //function
    fn = fn()
  }
  //we call the function and assign the result of called previous fn
  //to new fn
  return fn
  //when we are done return fn when fn is the result and no longer
  //function.
}

// 구현..
```

마지막으로 할 수 있는 방법은 이 재귀 적인 로직을 iteration 로직으로 바꾸는 방법이다.

우선 stack 에 처음 해당 데이터를 넣는다. shift 로 첫번째 요소를 제거하고 반환시킨다.
그럼 처음에는 root 가 나올것이다. root 를 result 결과에 넣어두고 child 가 존재하면 root 자리에 있었던 곳에 child 를 다 풀어서 stack 에 쌓아둔다. 그리고 다시 stack 에서 가장 첫번째껄 확인한다.

만약 아래와 같은 간단한 구조였다면

```javascript
    const data = {
    	id: 'us'
    	child: [
    		{id:'kor', child:[
    			{id: 'ab'},
    			{id: 'cd'}
    		]},
    		{id:'jp'},
    	]
    }

    // stack의 움직임
    // 1.
    [data]
    // data를 result에 넣어두고 data있었던 자리에 child를 풀어서 다시 스택에 넣는다.
    [{id:'kor'...},{id: 'jp'...}]

    // 2.
    // 첫번째 데이터(id:'kor')를 빼내어서 다시 result에 넣어두고 child가 있기에 다시 풀어서 stack에 넣는다.
    [{id:'ab'}, {id:'cd'}, {id:'jp'..}]

    // 지금까지의 result는
    [{id:'us'}, {id:'kor'}]

    // 이렇게 해서 순서대로 flat하게 만들 수 있다.
```

< iteration 로직 >

```javascript
// 중첩된 데이타를 재귀를 피하고 iteration logic으로 풀어서 함.
const getFlatDataListFromNestedData = nestedData => {
  const stack = [nestedData] // add the initial tree to the stack
  const result = [] // initialize the result accumulator

  while (stack.length) {
    const currentTree = stack.shift() // 첫번째 요소 제거 후 반환
    if (currentTree) result.push(currentTree) // 첫번째 요소가 존재하면 push
    if (currentTree.child) {
      stack.unshift(...currentTree.child) // 해당 첫번째 요소에 child가 존재하면 그 첫번째 요소 자리에 child으로 다시 매꾼다.
    }
  }

  return result
}

const getFlatDataListFromNestedDataList = (rootTreeDataList = []) => {
  return rootTreeDataList.flatMap(getFlatDataListFromNestedData)
}
```

## 참고

[https://medium.com/@cukejianya/functional-js-trampolines-tails-88723b4da320](https://medium.com/@cukejianya/functional-js-trampolines-tails-88723b4da320)
[https://homoefficio.github.io/2015/07/27/%EC%9E%AC%EA%B7%80-%EB%B0%98%EB%B3%B5-Tail-Recursion/](https://homoefficio.github.io/2015/07/27/%EC%9E%AC%EA%B7%80-%EB%B0%98%EB%B3%B5-Tail-Recursion/)
[https://www.datchley.name/recursion-tail-calls-and-trampolines/](https://www.datchley.name/recursion-tail-calls-and-trampolines/)
[https://marmelab.com/blog/2018/02/12/understanding-recursion.html](https://marmelab.com/blog/2018/02/12/understanding-recursion.html)
