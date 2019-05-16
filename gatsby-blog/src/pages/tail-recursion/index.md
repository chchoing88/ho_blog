---
title: 꼬리 재귀
date: "2019-05-16T10:00:03.284Z"
---

자바스크립트는 재귀 깊이가 너무 깊어지면 오류가 발생한다. 호출 스택을 펼쳐서 재귀 호출을 루프처럼 펼쳐주는 기법을 사용하면 이런 오류를 막을 수 있다. 

컴파일러는 _꼬리 재귀(tail recursion)_ 이라는 특별한 형태의 재귀 호출을 스택 깊이를 키우지 않고 처리하도록 최적화해줄 수 있다.
컴파일러가 최적화를 제공하지 않으면 _트램폴린(trampoline)_ 과 _스트림(stream)_ 등의 기법을 사용해 재귀를 수동으로 최적화할 수 있고, 스택이나 리스트 등의 데이터 구조와 함께 재귀를 루프로 바꾸는 일반적인 규칙을 활용하면 재귀를 기계적으로 루프로 바꿀 수 있다. 


> 여기서 stack 이란 ? 함수를 호출한 후에 원래 자리로 돌아오려면, 원래 자리를 어딘가에 저장해둬야 하는데, 그 어딘가가 바로 Stack이다. 

피보나치 수열과 단순한 합을 구하는 재귀함수에서 문제는 두가지 이다.

1. 피보나치 수열은 재귀 호출을 두겹으로 호출하기 때문에 함수 호출 횟수가 많다.
2. 단순한 합을 구하는 재귀함수에서는 stack의 깊이가 너무 깊어진다.

첫번 째 문제는 한겹으로 재귀를 호출 할 수 있다면 함수 호출을 줄일 수 있을 것이다.
두번 째 문제의 해결책은 두가지가 있을 수 있는데 다음과 같다.
 
  - stack을 쓰지 말자. 즉, 함수 호출을 하지말자.
  - stack을 쓰되 누적해서 쓰지말고 있는걸 재활용하자.

 
피보나치 수열에서 해결은 _반복 단계별 계산 결과를 반복이 끝날 때까지 어떤 변수(여기서는 previousFibo)에 계속 저장한다._ 방식으로 해결이 된다.
피보나치 수열을 재귀가 아닌 반복문을 이용해서 풀어보자. 바로 해결이 될 것이다.

프로그램이 stack을 쓰는 이유는 함수 실행 후 돌아갈 원래 자리를 stack에 저장을 하기 때문이다.
그렇다면 왜 원래 자리로 돌아가는가??

바로 _원래 자리에서 해야 할 일이 남아있기 때문이다._
바꿔 말하면, _원래 자리에서 해야할 일이 남아있지 않다면 돌아갈 원래 자리를 Stack에 추가로 저장할 필요가 없다._

```javascript
function fibonacci(n) {
    if (n < 2)
        return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

`fibonacci(n - 1)`를 호출한 후에 바로 리턴하는 것이 아니라 다시 한 번 `fibonacci(n - 2)`를 실행해서 두 값을 더한 후에 리턴한다. 다시 말해, 원래 자리로 돌아와서 해야할 일이 남아있으므로 돌아올 원래 자리의 정보를 Stack에 추가해서 저장해야 한다.

그렇다면 원래 자리에서 해야할 일을 남겨두지 않는 방법은 무엇인가? 그 방법이 바로 Tail Call(꼬리 호출)이다.

```javascript
function a() {
    var v = 0;
    return b(v);
}
function b(n) {
    return n + 1;
}
a();
```

_Tail Call은 함수를 호출해서 값을 반환 받은 후 아무 일도 하지 않고 바로 반환하게 하기 위해 논리적으로 가장 마지막(꼬리) 위치에서 함수를 호출하는 방식을 말한다._
_Tail Call 방식을 적용하려면 두 겹인 재귀 호출을 한 겹으로 줄여야만 한다._

> tail Call 방식으로 짜여지면 Stack을 새로 만들지 않고 이미 있는 Stack 속의 값만 대체해서 Stack을 재사용하는 방식으로 동작하도록 최적화 할 수 있다. 이러한 최적화를 Tail Call Optimization(또는 Tail Call Elimination)이라고 하며 언어의 실행 환경에서 지원해줘야 한다.

Tail Recursion의 경우에는 _Tail Call의 특별한 경우로서 Tail Call로 호출하는 함수가 자기 자신인 경우_에 해당한다.
이제 Tail Recursion으로 fibonacci 수를 구하는 코드를 짜보자. 앞에서 재귀 호출 방식을 반복 방식으로 바꾸는 작업을 직접 해봤다면 크게 어렵지 않을 것이다.

```javascript
function fibonacciTailRecursion(n, previousFibo, previousPreviousFibo) {
    if (n < 2)
        return n * previousFibo;
    return fibonacciTailRecursion(n - 1,
                                  previousFibo + previousPreviousFibo,
                                  previousFibo);
}
```
재귀 호출을 반복이나 Tail Recursion 방식으로 구현하려면 다음의 사항을 꼭 기억하자.
반복이나 꼬리 호출 단계별 계산 결과를 어딘가에 계속 저장한다.

인터프리터 / 컴파일러는 호출 스택에서 과거 함수 호출을 제거하여 재귀를 최적화합니다. 하지만 자바 스크립트에서 꼬리 재귀는 인식되지 않고 여전히 호출 스택에 배치가 되는 문제점을 가지고 있다.


## Trampoline

일반적인 Tail Recursion 에서는 tail position에서 함수 스스로를 계속 호출을 하고 그 결과를 바로 다시 자기 자신 함수의 결과로 넘겨서 호출하곤 했었다. 
이때 컴파일러가 tail positon 호출을 위한 optimizations 이 안되어 있다면 스택은 계속 쌓여만 간다. 

그래서 한가지 방법중에 하나가 trampoline 이라고 불리는 패턴이다. 
만약 위에서 말한 계속 호출하는 방식이 아닌 호출할 함수를 리턴해준다면, 우리는 tramploine을 사용해서 계속적으로 실행할 수 있다. 

trampoline 자바스크립트에서 tail recursion을 실행시켜주는 helper function 이다.
보통 다른 문서들에서 thunk 와 tramploining 이란 단어를 들어 봤을 것이다.
`thunk`는 아직 호출되지 않는 함수를 말한다. 즉, 다른 함수에 대한 호출을 래핑하는 함수이다. 간단하게는 currying 과 binding에서 이런 기능을 볼 수 있다. 
`trampoline function`에 thunk를 전달을 하면 bound function 이 나오고, 해당 인자 값과 함께 while-loop를 통해서 bound function 이 더 이상 함수가 아닐때 까지 그것의 recursive function 을 호출한다. 

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
`recur(1,n)` 을 trampoline 함수에 인자로 넘겼을 때, 우리는 사실 `recur.bind(null,1*4,3)` 을 넘기게 됩니다. 
while 반복문은 recur가 undefined/null 이지 않고, 함수인지를 체크한다. 여기서 recur이 bounded 되고 나서도 recur 함수는 Function object의 인스턴스로 여전히 남아있게 된다. 

```javascript
console.log(recur.bind(null, 1 * 4, 3)) // [Function: bound recur]
```

루프에 2가지 상태를 확인한 후에 fn을 호출한다. 그리곤 그것의 결과를 다시 fn에 할당한다. 
그러면 fn은 `recur.bind(null,4*3,2)` 가 된다. 이 루프는 `recur.bind(null,12*2,1)` 이 될때까지 동작하게 된다. 그리곤 24를 리턴한다. 

이 과정에서 우리는 함수 호출을 쌓을 필요가 없습니다. 각 함수가 호출되어 바운드 함수를 반환 한 다음 호출 스택에서 제거됩니다. 그런 다음 trampoline의 while 루프를 사용하여 바운드 함수를 호출하여 각 재귀 적 단계로 건너 뜁니다. 

## 참고 
[https://medium.com/@cukejianya/functional-js-trampolines-tails-88723b4da320](https://medium.com/@cukejianya/functional-js-trampolines-tails-88723b4da320)
[https://homoefficio.github.io/2015/07/27/%EC%9E%AC%EA%B7%80-%EB%B0%98%EB%B3%B5-Tail-Recursion/](https://homoefficio.github.io/2015/07/27/%EC%9E%AC%EA%B7%80-%EB%B0%98%EB%B3%B5-Tail-Recursion/)
[https://www.datchley.name/recursion-tail-calls-and-trampolines/](https://www.datchley.name/recursion-tail-calls-and-trampolines/)