---
title: Under the hood of React Hooks 
date: "2019-07-30T10:00:03.284Z"
---

[이글](https://medium.com/the-guild/under-the-hood-of-reacts-hooks-system-eb59638c9dba)을 번역 및 분석 한 글입니다. 잘못된 번역이 있을 수 있습니다. 또한 예전 코드들이 많으므로 참고만 해야 합니다. 현재 코드랑 다른점이 많이 있습니다.

# Under the hood of React’s hooks system

우리는 모두 그것에 대해 들었습니다. React 16.7 의 새로운 훅 시스템은 커뮤니티에서 많은 이야기가 나옵니다. 우리는 모두 그것을 시도하고 그것을 테스트하고, 그리고 그것의 잠재력에 대해 정말로 흥분했습니다. 후크에 대해 생각할 때 그것들은 다소 마술적입니다. 어떻게 든 React 는 인스턴스를 노출하지 않고도이 구성 요소를 관리합니다 (`this` 키워드를 사용하지 않아도 됨). 그래서 도대체 어떻게 React 가 그렇게합니까?

오늘 나는 React 의 후크 구현에 대해 더 자세히 이해할 수 있기를 바랍니다. 마법 같은 기능의 문제점은 복잡한 스택 추적으로 뒷받침되기 때문에 문제가 발생하면 문제를 디버그하는 것이 더 어렵다는 것입니다. 따라서, React 의 새로운 후크 시스템에 대한 깊은 지식을 갖게되면 문제가 발생하면 이를 신속하게 해결할 수 있을 것입니다.

> 시작하기 전에 저는 제가 React 의 개발자 / 유지자가 아니며 제 말을 아주 작은 알갱이로 가야한다고 말하고 싶습니다. 나는 React 's hooks 시스템의 구현에 깊이 깊이 잠긴했지만, 꼭 이것이 React 가 실제로 어떻게 작동 하는지를 보장 할 수는 없습니다. 필자는 필자의 말을 React 의 소스 코드에서 증명과 참조로 뒷받침했으며 가능한 한 견고하게 주장하려고 노력했습니다.

![https://miro.medium.com/max/684/1*R-oovJm4IQBLDjZy6DvbBg.png](https://miro.medium.com/max/684/1*R-oovJm4IQBLDjZy6DvbBg.png)

우선, React 의 범위 내에서 후크가 호출 되도록하는 메커니즘을 살펴 보겠습니다. 오른쪽 컨텍스트에서 호출되지 않으면 후크가 의미가 없다는 것을 알 수 있기 때문입니다.

## The dispatcher

디스패처는 후크 기능을 포함하는 공유 객체입니다. ReactDOM 의 렌더링 단계를 기반으로 동적으로 할당되거나 정리되며 사용자가 React 구성 요소 외부의 후크에 접근하지 못하게 합니다. (see [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberDispatcher.js?source=post_page---------------------------#L24)).

```javascript
// ReactFiberDispatcher.js
import {
  useCallback,
  useContext,
  useEffect,
  useImperativeMethods,
  useLayoutEffect,
  useMemo,
  useMutationEffect,
  useReducer,
  useRef,
  useState,
} from './ReactFiberHooks'

export const Dispatcher = {
  readContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeMethods,
  useLayoutEffect,
  useMemo,
  useMutationEffect,
  useReducer,
  useRef,
  useState,
}
```

후크는 올바른 디스패처로 간단하게 전환하여 루트 구성 요소를 렌더링하기 전에 `enableHooks` 플래그에 의해 활성화 / 비활성화됩니다. 이는 기술적으로 런타임에 후크를 활성화 / 비활성화 할 수 있음을 의미합니다. React 16.6.X 에는 실험 기능이 구현되어 있지만 실제로는 사용할 수 없습니다. (see [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L1211)).

```javascript
// 1211줄 ReactFiberScheduler.js
if (enableHooks) {
  ReactCurrentOwner.currentDispatcher = Dispatcher
} else {
  ReactCurrentOwner.currentDispatcher = DispatcherWithoutHooks
}
```

렌더링 작업(여기서 렌더링 작업이라 하면 fiber를 구성하고 아직 스크린에 반영하지 않은 작업상태를 뜻한다.)이 끝나면 디스패처를 무효화하여 ReactDOM 렌더링주기 밖에서 후크가 실수로 사용되는 것을 방지합니다. 이것은 사용자가 어리석은 일을 하지 않도록 보장하는 메커니즘입니다. (see [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L1376)).

```javascript
// 1376줄 ReactFiberScheduler.js
// We're done performing work. Time to clean up.
ReactCurrentOwner.currentDispatcher = null
```

dispatcher는 `resolveDispatcher()` 함수를 사용하여 각각의 모든 후크 호출에서 resolve됩니다. 앞에서 말했듯이, React 의 렌더링주기 밖에서는 의미가 없어야하고, React 는 경고 메시지를 출력해야합니다 : _"후크는 함수 구성 요소의 본체 내부에서만 호출 할 수 있습니다"_ (see [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react/src/ReactHooks.js?source=post_page---------------------------#L17)).

Dispatcher 실행을 간단하게 표현하면 아래와 같습니다.

매 `renderRoot` 에서만 `currentDispatcher` 가 할당되며 render가 모두 끝나면 `currentDispatcher` 을 null 처리 해서 외부 에서 `useXXX`를 호출 했을시 error 가 나게 했다.

```javascript
let currentDispatcher
const dispatcherWithoutHooks = {
  /* ... */
}
const dispatcherWithHooks = {
  /* ... */
}

function resolveDispatcher() { // 적절한 dispatcher를 리턴해준다.
  if (currentDispatcher) return currentDispatcher
  throw Error("Hooks can't be called")
}

function useXXX(...args) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useXXX(...args)
}

function renderRoot() {
  currentDispatcher = enableHooks ? dispatcherWithHooks : dispatcherWithoutHooks // root render하기 전에 알맞는 dispatcher 셋팅
  performWork()
  currentDispatcher = null
}
```

실제 React github 코드 상에선 아래와 같이 표현하고 있다. (예전 코드)

```javascript
// 16줄 ReactFiberScheduler.js
function resolveDispatcher() {
  const dispatcher = ReactCurrentOwner.currentDispatcher
  invariant(
    dispatcher !== null,
    'Hooks can only be called inside the body of a function component.'
  )
  return dispatcher
}
```

```javascript
// 54줄 ReactFiberScheduler.js
export function useState<S>(initialState: (() => S) | S) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useState(initialState)
}
```

이제는 간단한 `캡슐화 메커니즘`을 살펴 보았으므로 이 기사의 핵심 인 후크로 넘어 가고자 한다. 여기서 나는 새로운 개념을 소개하고자 합니다.

## The hooks queue

React 뒤에서, hooks는 호출 순서로 함께 연결된 노드로 표시됩니다. 후크는 단순히 생성된 다음 혼자 남겨지는 것이 아니기 때문에 그렇게 표현됩니다. 그들은 그들이 있는 그대로가 될 수 있도록 하는 메커니즘을 가지고 있다. 후크(hook)에는 구현에 뛰어 들기 전에 염두해야 할 필요한 몇 가지 프로퍼티들 있습니다.

* hook의 초기 상태값은 초기 렌더링시에 생성됩니다.
* hook의 상태는 즉시 업데이트 할 수 있습니다.
* React 는 다음번 렌더링에서 hook 의 상태를 기억할 것입니다.
* React 는 호출 순서에 따라 올바른 상태를 제공합니다.
* React 는 이 hook 이 어떤 fiber 에 속하는지 알 수 있습니다.

따라서 component 의 상태를 보는 방식을 다시 생각 해야합니다. 지금까지 우리는 마치 평범한 object 인 것처럼 그것에 대해 생각해 왔습니다.

```javascript
// React state - the old way
{
  foo: 'foo',
  bar: 'bar',
  baz: 'baz',
}
```

그러나 후크를 처리 할 때 각 노드가 하나의 상태 모델을 나타내는 큐로 간주 되어야합니다.

```javascript
// React state - the new way
{
  memoizedState: 'foo',
  baseUpdate: {
    expirationTime: '만료시간',
    action: '업뎃에 필요한 액션',
    next: '다음 업뎃?'
  },
  queue: {
    last: '마지막에 업데이트 했던 작업',
    dispatch: ''
  },
  next: {
    memoizedState: 'bar',
    next: {
      memoizedState: 'baz',
      next: null
    }
  }
}
// 이것은 흡사 배열과 비슷할 수 있을거 같다.
// ['foo', 'bar', 'baz'] iterator
// ['foo', 'bar', 'baz'][Symbol.iterator]()
```

단일 훅 노드의 스키마는 [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js?source=post_page---------------------------#L243).에서 볼 수 있습니다.

```javascript
type Update<A> = {
  expirationTime: ExpirationTime,
  action: A,
  next: Update<A> | null,
};

type UpdateQueue<A> = {
  last: Update<A> | null,
  dispatch: any,
};

export type Hook = {
  memoizedState: any,

  baseState: any,
  baseUpdate: Update<any> | null,
  queue: UpdateQueue<any> | null,

  next: Hook | null,
};

// ReactFiberHooks.js
function createHook(): Hook {
  return {
    memoizedState: null,

    baseState: null,
    queue: null,
    baseUpdate: null,

    next: null,
  }
}
```

훅에는 몇 가지 추가 속성이 있지만 훅의 작동 방식을 이해하는 열쇠는 `memoizedState` 와 `next` 내에 있습니다. 나머지 프로퍼티들은 `useReducer()` 훅에 의해 특별히 사용되어 `디스패치 된 액션(dispatched actions)`과 `기본 상태들(base states)`를 캐싱하므로 다양한 경우를 대비하여 reduction process가 반복 될 수 있습니다 :

* `baseState` - reducer 에 주어진 상태 객체.
* `baseUpdate` -`baseState`를 생성 한 가장 최근의 dispatch 된 액션입니다. (ex. [state, setState] = useState(0); setState(액션))
* `queue` - dispatch 된 액션의 대기열(queue), reducer 를 통해 처리되길 기다리는 액션들이다.

각 함수형 `fiber`마다 memoizedState field 에 `hook`을 지니고 있다.

```javascript

// Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.
let firstCurrentHook: Hook | null = null;
let currentHook: Hook | null = null;
let firstWorkInProgressHook: Hook | null = null;
let workInProgressHook: Hook | null = null;

// https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js?source=post_page---------------------------#L367
export function useReducer<S, A>(
  reducer: (S, A) => S,
  initialState: S,
  initialAction: A | void | null,): [S, Dispatch<A>] {
  
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber();
  workInProgressHook = createWorkInProgressHook();
  let queue: UpdateQueue<A> | null = (workInProgressHook.queue: any);
  // .. 생략..

  // 업데이트 시
  // // 재 렌더시 (isReRender) - workInProgressHook에 next가 존재할 경우 
  const dispatch: Dispatch<A> = (queue.dispatch: any);
  // 재 렌더가 아닐 경우


  // 첫 렌더시 
  workInProgressHook.memoizedState = workInProgressHook.baseState = initialState;
  queue = workInProgressHook.queue = {
    last: null,
    dispatch: null,
  };
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any)); // action 만 나중에 받게끔 dispatch를 bind 시킴.
  return [workInProgressHook.memoizedState, dispatch];

}



// useState에서 사용하는 reducer에는 basicStateReducer 사용
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action
}

```

> 여기서 reducer 는 action 과 payload state 를 받아서 새로운 state 를 반환하는 순수함수라 할 수 있겠다. baseUpdate 는 액션이라고 보면 될것이다.

불행하게도 거의 모든 경우를 재현 할 수 없었기 때문에 reducer hook 을 잘 이해할 수 없었습니다. 그래서 정교하게 느껴지지 않을 것입니다. 나는 단지 reducer 구현이 너무 일관성이 없기 때문에 [implementation](https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js?source=post_page---------------------------#L380) 에서 구현 자체의 주석 중 하나조차도 "(이것이) 원하는 의미론이 맞는지 확실치 않다(TODO: Not sure if this is the desired semantics, but it's what we do for gDSFP. I can't remember why.)" 라고 말합니다. 그래서 어떻게 확신해야합니까?!

후크로 돌아가서, 각각의 모든 컴포넌트 호출 이전에,  [`prepareHooks()`](https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js#L123)라는 이름의 함수가 호출됩니다. **이 함수안에서는 current fiber 와 hooks 큐(대기열) 안에 있는 그것의 첫 번째 hook 노드는 전역 변수에 저장됩니다. 이런 방식으로, 우리가 후크 함수 (`useXXX ()`)를 호출 할 때마다 어떤 컨텍스트에서 실행되는지를 알 수 있습니다.**

> `prepareHooks()` 이 함수가 보이지 않는다. `prepareToUseHooks()` 이 함수인거 같다.

다음은 Hooks 대기열이 실행되는 간단한 코드 형식이다.

```typescript
type Update<A> = {
  expirationTime: ExpirationTime
  action: A
  next: Update<A> | null
}

type UpdateQueue<A> = {
  last: Update<A> | null
  dispatch: any
}
type Hook = {
  memoizedState: any

  baseState: any
  baseUpdate: Update<any> | null
  queue: UpdateQueue<any> | null

  next: Hook | null
}

// The work-in-progress fiber. I've named it differently to distinguish it from
// the work-in-progress hook.
let currentlyRenderingFiber: Fiber | null = null
// Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.
let workInProgressHook: Hook | null = null
let currentHook: Hook | null = null

// Source: https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js#L123
// 2. 전역에 셋팅
function prepareHooks(current: Fiber | null,
  workInProgress: Fiber,
  nextRenderExpirationTime: ExpirationTime,) {
     
  renderExpirationTime = nextRenderExpirationTime;
  currentlyRenderingFiber = workInProgress; // 현재 작업중인 Fiber
  firstCurrentHook = current !== null ? current.memoizedState : null; // 이미 render된 Fiber(current)의 memoizedState를 firstCurrentHook 할당.
}

// Source: https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/react-reconciler/src/ReactFiberHooks.js:148
function finishHooks() {
  currentlyRenderingFiber.memoizedState = firstWorkInProgressHook
  
  currentlyRenderingFiber = null;
  firstCurrentHook = null;
  currentHook = null;
  firstWorkInProgressHook = null;
  workInProgressHook = null;
}

// Source: https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js#L332
function resolveCurrentlyRenderingFiber() {
  if (currentlyRenderingFiber) return currentlyRenderingFiber
  throw Error("Hooks can't be called")
}
// Source: https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js#L267
function createWorkInProgressHook() {
  // workInProgressHook 가 존재하고 next가 존재하지 않으면 hook을 새로 만들어서 workInProgressHook = workInProgressHook.next = hook;
  // workInProgressHook 가 존재하고 next가 존재하면 workInProgressHook = workInProgressHook.next;
  // workInProgressHook 가 존재하지 않고 firstWorkInProgressHook가 존재하지 않으면 firstWorkInProgressHook = workInProgressHook;
  // 기존 fiber에 등록된 훅이 있으면 그 훅을 복사해서 사용하고 그게 아니라면 새로운 훅을 생성한다. 
  workInProgressHook = currentHook ? cloneHook(currentHook) : createNewHook()
  currentHook = currentHook !== null ? currentHook.next : null;
  return workInProgressHook
}

// 4. 컴포넌트 안에서 호출되는 useXXX 함수.
function useXXX() {
  const fiber = resolveCurrentlyRenderingFiber() // update 될 fiber 리턴.
  const hook = createWorkInProgressHook() //현재 렌더링된 fiber의 memoizedState
  // ...
}

function updateFunctionComponent(
  recentFiber,
  workInProgressFiber,
  Component,
  props
) {
  prepareHooks(recentFiber, workInProgressFiber) // 1. 훅 준비
  Component(props) // 3. 컴포넌트 호출 - 여기서 useXXX 호출할 것이다.
  finishHooks() // 5. Hooks 마무리
}
```

업데이트가 완료되면, [`finishHooks()`](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/react-reconciler/src/ReactFiberHooks.js:148?source=post_page---------------------------) 이 호출 될 것입니다. 여기서 후크 대기열(hooks queue)의 첫 번째 노드에 대한 참조가 렌더링 된 fiber 의 `memoizedState` 속성에 저장됩니다. 즉, 후크 대기열과 그 상태를 외부 적으로 처리 할 수 ​​있습니다.

컴퍼넌트의 메모 상태의 외부 읽기.

```javascript
const ChildComponent = () => {
  useState('foo')
  useState('bar')
  useState('baz')

  return null
}

const ParentComponent = () => {
  const childFiberRef = useRef()

  useEffect(() => {
    let hookNode = childFiberRef.current.memoizedState

    assert(hookNode.memoizedState, 'foo')
    hookNode = hooksNode.next
    assert(hookNode.memoizedState, 'bar')
    hookNode = hooksNode.next
    assert(hookNode.memoizedState, 'baz')
  })

  return <ChildComponent ref={childFiberRef} />
}
```

가장 일반적인 것부터 시작하여 개별적인 고리에 대해 더 구체적으로 이야기 해 봅시다.

## State hooks

놀랍지만 `useState` 훅 뒤에선 `useReducer` 를 사용하고 단순히 미리 정의 된 reducer 핸들러를 제공합니다 (see [implementation](https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js?source=post_page---------------------------#L339)). 즉, `useState` 에 의해 리턴 된 결과는 실제로 reducer 상태(state)와 action 디스패처(dispatcher)입니다. 상태 후크가 사용하는 reducer 핸들러를 살펴 보시기 바랍니다.

```javascript
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action
}

export function useState<S>(
  initialState: (() => S) | S
): [S, Dispatch<BasicStateAction<S>>] {
  return useReducer(
    basicStateReducer,
    // useReducer has a special case to support lazy useState initializers
    (initialState: any)
  ) // return [state, dispatchState]
}

// dispatchState(value) => basicStateReducer 함수의 action에 value 값이 할당되고 action은 함수가 아니기에
// 바로 action이 리턴되고 state에 할당된다.

// 그럼 만약에 dispatchState((state) => state + 10) 이라고 하면 될까??? 된다.!!!
// <button onClick={() => setCount((count) => count+10)}>increse</button>
```

`useReducer()` 함수는 간단하게 이렇게 작성될 수 있다. [useReducer](https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js?source=post_page---------------------------#L346)

아래 함수에서 `useState`호출시 `useReducer`를 호출 후 리턴 배열이 리턴이 되는데 이때 `dispatch`가 `dispatchAction` 함수의 binding 된 함수이다. 이때 바인딩 되는 인자들은 현재 렌더링 될 fiber 를 가지고 있게 되는데 그렇다면 우리가 `dispatch` 함수를 호출 할 때마다 어떤 fiber 와 연관되어있는지 알게 되는 것이다. 그래서 해당 fiber 에서부터 reconcile 을 하는거 같다.

```javascript
export function useReducer() {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber()
  workInProgressHook = createWorkInProgressHook()
  let queue: UpdateQueue<A> | null = (workInProgressHook.queue: any)

  // ...
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber, // workInTree Fiber
    queue
  ): any))
  return [workInProgressHook.memoizedState, dispatch]
}

function dispatchAction<A>(fiber: Fiber, queue: UpdateQueue<A>, action: A) {
  //...
  scheduleWork(fiber, expirationTime)
}
```

예상대로 액션 디스패처에 새로운 상태를 직접 제공 할 수 있습니다. Dispatcher 에게 _액션 함수를 제공하여 이전 상태를 받고 새 상태를 반환 할 수도 있습니다 ._

즉, 구성 요소 트리 아래로 `state setter`(useState 에서 리턴된 배열의 두번째 함수)를 보내면 다른 props 없이 상위 구성 요소의 현재 상태(current state)에 대해 변형을 실행할 수 있습니다. 예 :

```javascript
const ParentComponent = () => {
  const [name, setName] = useState()

  return <ChildComponent toUpperCase={setName} />
}

const ChildComponent = props => {
  useEffect(
    () => {
      props.toUpperCase(state => state.toUpperCase())
    },
    [true]
  )

  return null
}
```

마지막으로, 구성 요소의 라이플 사이클에 중요한 영향을 미치는 effect hooks 작동 방식을 알아보자.


## Effect hooks

이펙트 후크는 약간 다르게 동작하고 내가 설명하고 싶은 추가 로직 레이어를 가지고 있습니다. 다시 한 번, 구현에 들어가기 전에 effect hook의 프로퍼티들에 대해 염두에 두어야 할 사항이 있습니다.

- hook은 렌더링 시간 동안 생성되지만 페인팅 후에 실행됩니다.
- 그렇게되면, 그들은 다음 페인팅 직전에 파괴 될 것입니다.
- 그들은 정의 순서대로 호출됩니다.

_"페이팅"이라는 용어를 사용하고 "렌더링" 단어는 사용하하지 않았습니다. 이 두 가지가 다른데, 나는 최근의 [_React Conf_](https://conf.reactjs.org/?source=post_page---------------------------)에서 잘못된 용어를 사용하는 것을 많이 바왔다.! 공식 [_React docs_](https://reactjs.org/docs/hooks-reference.html?source=post_page---------------------------#useeffect) "렌더링이 화면에 적용 된 후"라고 말합니다. 이것은 "페인팅"과 비슷합니다. render 메서드는 파이버 노드를 생성하지만 아직 아무것도 그리지 않습니다 ._

따라서 이러한 효과를 유지해야하는 추가 대기열이 있어야하며 페인팅 후에 처리해야합니다. 일반적으로 말하자면, fiber는 effect node들을 포함하는 대기열을 보유하고 있습니다. 각 effect는 다른 유형이므로 적절한 단계에서 다루어야합니다.

-   mutation이 일어나기 전에 `getSnapshotBeforeUpdate()` 인스턴스를 호출한다.  (see  [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L646)).
-  all the host 삽입, 업데이트, 삭제 그리고 참조해제를 수행한다.  (see  [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L687)).
- 모든 라이프 사이클 및 참조 콜백을 수행하십시오. 라이프 사이클은 별도의 실행으로 발생하므로 전체 트리에서 모든 배치, 업데이트 및 삭제가 이미 호출되었습니다. 이 실행은 또한 렌더러 관련 초기 효과를 트리거합니다. (see  [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L732)).
- `useEffect()`  hook에 의해 스케쥴된 Effect - 구현에 기반한 "수동효과" 라고도 합니다. [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L779)  (어쩌면 우리는 React 커뮤니티에서이 용어를 사용해야 할까?).

hook effects에 관해서는 fiber의 `updateQueue` 라는 속성에 저장해야하며 각 효과 노드(effect node)는 다음 스키마를 가져야합니다 ((see  [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js?source=post_page---------------------------#L477)):

```typescript
function pushEffect(tag, create, destroy, inputs) {
  const effect: Effect = {
    tag,
    create,
    destroy,
    inputs,
    // Circular
    next: (null: any),
  }; 

  return effect;
}
```

-   `tag`  - 효과의 동작을 지시하는 이진수입니다 (곧 자세히 설명 할 것입니다).
-   `create`  - painting 이후에 실행해야하는 콜백입니다.
-   `destroy`  - 초기 렌더링 전에 실행되어야하는`create ()`에서 반환 된 콜백.
-   `inputs`  - effect를 파괴하고 재생성 해야하는지 여부를 결정하는 값 집합입니다.
-   `next`  - Component에서 정의 된 다음 효과에 대한 참조입니다.

`tag` 프로퍼티 외에, 다른 프로퍼티는 이해하기 쉽고 간단합니다. 후크를 잘 연구했다면 React가 `useMutationEffect()` 와 `useLayoutEffect()`와 같은 몇 가지 특수 효과 후크를 제공한다는 것을 알 수 있습니다. 이 두 가지 효과는 내부적으로 `useEffect()` 를 사용합니다. 이것은 본질적으로 effect node를 만드는 것을 의미하지만, 다른 태그 값을 사용하여 effect node를 만듭니다.

태그는 이진 값의 조합으로 구성됩니다. (see  [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactHookEffectTags.js?source=post_page---------------------------)):

```javascript
const NoEffect = /*             */ 0b00000000;
const UnmountSnapshot = /*      */ 0b00000010;
const UnmountMutation = /*      */ 0b00000100;
const MountMutation = /*        */ 0b00001000;
const UnmountLayout = /*        */ 0b00010000;
const MountLayout = /*          */ 0b00100000;
const MountPassive = /*         */ 0b01000000;
const UnmountPassive = /*       */ 0b10000000;
```
React에 의해 지원되는 후크 효과 유형.

이 이진 값의 가장 일반적인 경우는 파이프 라인 (`|`)을 사용하여 비트를 그대로 단일 값에 추가하는 것입니다. 그런 다음 태그가 특정 동작을 구현하는지 여부를 앰퍼샌드 ( '&`)를 사용하여 확인할 수 있습니다. 결과가 0이 아니면 태그가 지정된 동작을 구현 함을 의미합니다.

```javascript
const effectTag = MountPassive | UnmountPassive
assert(effectTag, 0b11000000)
assert(effectTag & MountPassive, 0b10000000)
```
React의 바이너리 디자인 패턴을 사용하는 방법을 보여주는 예제.

다음은 React가 해당 태그와 함께 지원하는 후크 효과 유형입니다. (see  [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js:520?source=post_page---------------------------)):

-   Default effect —  `UnmountPassive | MountPassive`.
-   Mutation effect —  `UnmountSnapshot | MountMutation`.
-   Layout effect —  `UnmountMutation | MountLayout`.

행동 구현을 위한 React 검사 방법은 다음과 같습니다. (see  [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberCommitWork.js?source=post_page---------------------------#L309)):

```javascript
if ((effect.tag & unmountTag) !== NoHookEffect) {
  // Unmount
}
if ((effect.tag & mountTag) !== NoHookEffect) {
  // Mount
}
```
React가 구현 한 실제 스냅 샷.

그래서, 우리가 방금 배운 효과에 따라, 실제로 우리는 특정 fiber에 효과를 외부 적으로 주입 할 수 있습니다 :

```javascript
function injectEffect(fiber) {
  const lastEffect = fiber.updateQueue.lastEffect

  const destroyEffect = () => {
    console.log('on destroy')
  }

  const createEffect = () => {
    console.log('on create')

    return destroy
  }

  const injectedEffect = {
    tag: 0b11000000,
    next: lastEffect.next,
    create: createEffect,
    destroy: destroyEffect,
    inputs: [createEffect],
  }

  lastEffect.next = injectedEffect
}

const ParentComponent = (
  <ChildComponent ref={injectEffect} />
)
```
효과 주입의 예.

