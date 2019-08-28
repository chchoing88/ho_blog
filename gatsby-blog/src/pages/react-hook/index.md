---
title: React Hooks
date: "2019-07-18T10:00:03.284Z"
---

[이글](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/)을 번역 및 분석 한 글입니다. 잘못된 번역이 있을 수 있습니다.

## Deep dive: How do React hooks really work?

### What are Closures?

클로져들은 JS 의 기본 컨셉입니다. 클로져는 다음과 같이 정의 내릴수 있습니다.
클로져는 함수가 해당 렉시컬 범위에서 벗어나도 실행 되었을때 그것의 렉시컬 범위를 기억하고 있는 것이다.

이들은 렉시컬 스코핑의 컨셉과 밀접하게 관련되어 있습니다.

```javascript
// Example 0
function useState(initialValue) {
  var _val = initialValue // _val is a local variable created by useState
  function state() {
    // state is an inner function, a closure
    return _val // state() uses _val, declared by parent funciton
  }
  function setState(newVal) {
    // same
    _val = newVal // setting _val without exposing _val
  }
  return [state, setState] // exposing functions for external use
}
var [foo, setFoo] = useState(0) // using array destructuring
console.log(foo()) // logs 0 - the initialValue we gave
setFoo(1) // sets _val inside useState's scope
console.log(foo()) // logs 1 - new initialValue, despite exact same call
```

여기 우리가 만든 useSate hook 이 있습니다. 이 함수 안에는 2 개의 내부 함수가 존재합니다, state, setState.
state 는 상단에 정의 내린 \_val 의 로컬 변수가 리턴되는 함수이고 setState 는 로컬변수에 전달받은 파라미터로 셋팅한다.

여기 state 의 실행문은 getter 함수이다. 여기서 중요한 것은 foo 와 setFoo 를 사용하여 내부 변수 \_val 에 액세스하고 조작 할 수 있다는 것입니다. 그것들은 useState 의 범위에 대한 액세스를 유지하며 그 참조를 클로저라고합니다. React 와 다른 프레임 워크의 컨텍스트에서, 이것은 상태처럼 보입니다.

### Usage in Function Components

새롭게 작성된 useState 클론을 유사한 환경에서 적용해봅시다. 우리는 Counter 컴포넌트를 만들것입니다.

```javascript
// Example 1
function Counter() {
  const [count, setCount] = useState(0) // same useState as above
  return {
    click: () => setCount(count() + 1),
    render: () => console.log('render:', { count: count() }),
  }
}
const C = Counter()
C.render() // render: { count: 0 }
C.click()
C.render() // render: { count: 1 }
```

여기 DOM 을 렌더링하는 대신에 우리의 state 를 console.log 로 표현해봅시다.

그리고 Counter 컴포넌트의 API 를 노출해서 이벤트 핸들러를 적용하는 대신에 스크립트내에서 동작할 수 있도록 해봅시다. 이런 디자인은 컴포넌트 랜더링과 유저액션에 따른 반응을 시뮬레이션 해볼수 있습니다.

### Stale Closure ( 부실한 클로저 )

우리가 진짜 리액트 API 에 메칭하길 원한다면 우리 state 는 함수가 아니라 변수 여야 한다. 만약 간단하게 \_val 함수로 감싸지 않고 노출시킨다면 버그가 생길 것입니다.

```javascript
// Example 0, revisited - this is BUGGY!
function useState(initialValue) {
  var _val = initialValue
  // no state() function
  function setState(newVal) {
    _val = newVal
  }
  return [_val, setState] // directly exposing _val
}
var [foo, setFoo] = useState(0)
console.log(foo) // logs 0 without needing function call
setFoo(1) // sets _val inside useState's scope
console.log(foo) // logs 0 - oops!!
```

이것은 부실 클로즈 문제의 한가지 형식입니다. 우리가 foo 를 디스트럭쳐링을 useState 의 output 으로 할때, 그것은 초기 useState 호출 시점의 \_val 을 참조합니다.... 그리곤 다신 변하지 않습니다. 이것은 우리가 원하는것이 아닙니다. 우리는 일반적으로 현재의 state 가 반영된 컴포넌트가 필요합니다. 함수 호출 대신에 변수만 있는 동안에!! 이 두가지 목표는 정 반대처럼 보입니다.

### Closure in Modules

우리는 우리의 useState 수수께끼를 해결할 수 있습니다 ... 우리의 closure 를 다른 closure 안으로 이동하십시오!

```javascript
// Example 2
const MyReact = (function() {
  let _val // hold our state in module scope
  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    useState(initialValue) {
      _val = _val || initialValue // assign anew every run
      function setState(newVal) {
        _val = newVal
      }
      return [_val, setState]
    },
  }
})()
```

여기에서 모듈 패턴을 사용해서 작은 React 복제본을 만들었습니다. React 와 마찬가지로, 이 함수는 Component 상태를 추적합니다. ( 이 예제에서는 \_val 의 상태와 함께 하나의 component 만 추적합니다. ) 이 디자인을 사용하면 MyReact 가 함수 component 를 "렌더링" 할 수 있으므로 매번 올바른 클로져로 내부 \_val 값을 할당 할 수 있습니다.

이제 더 많은 React 훅을 알아보자.

### Replicating useEffect

지금까지, 우리는 useState 를 알아보았다. 이것은 첫번째 기본적인 React Hook 이다. 다음으로 중요한건 useEffect 이다. setSate 와는 다르게 useEffect 는 비동기적으로 실행되므로 클로저에 문제가 발생할 가능성이 커집니다.

우리는 지금까지 구축 한 React 의 작은 모델을 이것을 포함하도록 확장 할 수 있습니다.

```javascript
// Example 3
const MyReact = (function() {
  let _val, _deps // hold our state and dependencies in scope
  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const hasChangedDeps = _deps
        ? !depArray.every((el, i) => el === _deps[i])
        : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        _deps = depArray
      }
    },
    useState(initialValue) {
      _val = _val || initialValue
      function setState(newVal) {
        _val = newVal
      }
      return [_val, setState]
    },
  }
})()

// usage
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  MyReact.useEffect(
    () => {
      console.log('effect', count)
    },
    [count]
  )
  return {
    click: () => setCount(count + 1),
    noop: () => setCount(count),
    render: () => console.log('render', { count }),
  }
}
let App
App = MyReact.render(Counter)
// effect 0
// render {count: 0}
App.click()
App = MyReact.render(Counter)
// effect 1
// render {count: 1}
App.noop()
App = MyReact.render(Counter)
// // no effect run
// render {count: 1}
App.click()
App = MyReact.render(Counter)
// effect 2
// render {count: 2}
```

디펜던시들을 추적하기 위해서(의존성이 바뀌면 useEffect 가 다시 실행되기 때문에), 우리는 \_deps 를 도입한다.

### Not Magic, just Arrays

우리는 꽤 멋진 useState 와 useEffect 함수들을 복제해냈다. 하지만 이 두 함수는 심하게 싱글턴으로 구현이 되어있다. 이말인 즉슨, 오직 한개만 존재할수 있거나 버그가 발생할수 있다는 것이다.

우리는 state 와 effect 들의 임의의 갯수를 받게끔 확장할 필요가 있다.

다행스럽게도 React Hooks 는 마법이 아니며 배열에 불과합니다. 그래서 우리는 hooks 라는 배열을 가질것이며 이제 겹칠일이 없기 때문에 \_val 과 \_deps 를 없앨 수 있습니다.

```javascript
// Example 4
const MyReact = (function() {
  let hooks = [],
    currentHook = 0 // array of hooks, and an iterator!
  return {
    render(Component) {
      const Comp = Component() // run effects
      Comp.render()
      currentHook = 0 // reset for next render
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHook] // type: array | undefined
      const hasChangedDeps = deps
        ? !depArray.every((el, i) => el === deps[i])
        : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHook] = depArray
      }
      currentHook++ // done with this hook
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue // type: any
      const setStateHookIndex = currentHook // for setState's closure!
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    },
  }
})()
```

여기서는 setStateHookIndex 사용법에 유의하십시오. 아무 것도 보이지 않지만 setState 가 currentHook 변수를 덮지 않도록 방지하는 데 사용됩니다! 
`setState`에서 사용해야 할 인덱스를 가둬둔다고 생각하면 된다. 
setStateHookIndex 를 사용하지 않으면 setState 함수가 `newState => (hooks[currentHook] = newState)` 가 되게 되는데 여기서 currentHook 은 실행될때 참조 되므로 `App.type('bar')` 실행시때, currentHook 이 0 일때 실행하게 되어서 엉뚱한 state 변화를 초래하게 된다.

hooks 배열에는 useState 때 사용하는 state 값이 , useEffect 때는 디펜던시 값이 존재한다. 특히 useState 에서 나오는 setState 함수에는 변화해야 할 값의 인덱스가 저장되어있는 인덱스를 각 함수마다 지니고 있다.

```javascript
// Example 4 continued - in usage
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  const [text, setText] = MyReact.useState('foo') // 2nd state hook!
  MyReact.useEffect(
    () => {
      console.log('effect', count, text)
    },
    [count, text]
  )
  return {
    click: () => setCount(count + 1),
    type: txt => setText(txt),
    noop: () => setCount(count),
    render: () => console.log('render', { count, text }),
  }
}
let App
App = MyReact.render(Counter)
// effect 0 foo
// render {count: 0, text: 'foo'}
App.click()
App = MyReact.render(Counter)
// effect 1 foo
// render {count: 1, text: 'foo'}
App.type('bar')
App = MyReact.render(Counter)
// effect 1 bar
// render {count: 1, text: 'bar'}
App.noop()
App = MyReact.render(Counter)
// // no effect run
// render {count: 1, text: 'bar'}
App.click()
App = MyReact.render(Counter)
// effect 2 bar
// render {count: 2, text: 'bar'}
```

그래서 기본 원리는 hooks 의 배열과 각 hook 이 호출될때 증가하거나 컴포넌트가 render 될때 reset 되는 인덱스를 지니고 있는 것이다.

또한 custom hooks 도 쉽게 얻을 수있다.

```javascript
// Example 4, revisited
function Component() {
  const [text, setText] = useSplitURL('www.netlify.com')
  return {
    type: txt => setText(txt),
    render: () => console.log({ text }),
  }
}
function useSplitURL(str) {
  const [text, setText] = MyReact.useState(str)
  const masked = text.split('.')
  return [masked, setText]
}
let App
App = MyReact.render(Component)
// { text: [ 'www', 'netlify', 'com' ] }
App.type('www.reactjs.org')
App = MyReact.render(Component)
// { text: [ 'www', 'reactjs', 'org' ] }}
```

이것은 진정으로 "매직이 아닌" hook 이 되는 방식입니다. Custom Hooks 는 React 또는 우리가 구축 한 작은 복제품과 같은 프레임 워크가 제공하는 기본 요소에서 벗어납니다.

### Deriving(파생) the Rules of Hooks

여기에서 첫 번째 Hooks 규칙의 첫 번째 레벨 인 Call Hooks 를 쉽게 이해할 수 있습니다.
우리는 currentHook 변수로 React 의 호출 순서 의존성을 명시 적으로 모델링했습니다. 우리의 구현을 염두에두고 규칙의 설명 전체를 읽고 모든 일들을 완전히 이해할 수 있습니다.


두 번째 규칙 인 "React Functions 로부터의 Call Hooks"는 우리 구현의 필수 결과는 아니지만 코드의 어떤 부분이 Stateful 논리에 의존하는지 명확하게 구분하는 것이 좋습니다. (좋은 부작용으로 첫 번째 규칙을 따르는 툴링을 작성하는 것이 더 쉬워지며 루프 및 조건 내부의 일반 JavaScript 함수와 같은 상태 저장 함수를 래핑하여 실수로 자신을 쏠 수 없습니다. 규칙 2 는 규칙 1 을 따르는 데 도움이됩니다.)

여기서 리액트는 훅의 호출 순서에 의존을 하기 때문에 어떤 상태가 어떤 useState 호출에 대응하는지 알 수 있다. 또한 훅이 컴포넌트의 최상위 레벨에서 호출되어야만 하는 이유이기도 하다. 
[왜 호출 순서에 의존을 하는가?](https://overreacted.io/why-do-hooks-rely-on-call-order/)

### Conclusion

이 시점에서 우리는 가능한 한 많이 hook 을 작성해봤습니다. [하나의 라이너로 useRef 를 구현](https://www.reddit.com/r/reactjs/comments/aufijk/useref_is_basically_usestatecurrent_initialvalue_0/)하거나 [렌더링 함수가 실제로 JSX 를 사용하여 DOM 에 마운트하거나](https://www.npmjs.com/package/vdom) 또는 28 줄의 React Hooks 복제본에서 생략 한 기타 중요한 세부 사항을 만들 수 있습니다. 그러나 상황에 따라 클로저를 사용하여 경험을 쌓고 React Hooks 가 작동하는 방식을 설명하는 유용한 정신 모델을 얻었기를 바랍니다.
