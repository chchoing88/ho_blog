---
title: Under the hood of React Hooks
date: "2019-07-18T10:00:03.284Z"
---

[이글](https://medium.com/the-guild/under-the-hood-of-reacts-hooks-system-eb59638c9dba)을 번역 및 분석 한 글입니다. 잘못된 번역이 있을 수 있습니다. 또한 예전 코드들이 많으므로 참고만 해야 합니다. 현재 코드랑 다른점이 많이 있습니다.

# Under the hood of React’s hooks system

우리는 모두 그것에 대해 들었습니다. React 16.7 의 새로운 훅 시스템은 커뮤니티에서 많은 이야기가 나옵니다. 우리는 모두 그것을 시도하고 그것을 테스트하고, 그리고 그것의 잠재력에 대해 정말로 흥분했습니다. 후크에 대해 생각할 때 그것들은 다소 마술적입니다. 어떻게 든 React 는 인스턴스를 노출하지 않고도이 구성 요소를 관리합니다 (`this` 키워드를 사용하지 않아도 됨). 그래서 도대체 어떻게 React 가 그렇게합니까?

오늘 나는 React 의 후크 구현에 대해 더 자세히 이해할 수 있기를 바랍니다. 마법 같은 기능의 문제점은 복잡한 스택 추적으로 뒷받침되기 때문에 문제가 발생하면 문제를 디버그하는 것이 더 어렵다는 것입니다. 따라서, React 의 새로운 후크 시스템에 대한 깊은 지식을 갖게되면 문제가 발생하면 이를 신속하게 해결할 수 있을 것입니다.

> 시작하기 전에 저는 제가 React 의 개발자 / 유지자가 아니며 제 말을 아주 작은 알갱이로 가야한다고 말하고 싶습니다. 나는 React 's hooks 시스템의 구현에 깊이 깊이 잠긴했지만, 꼭 이것이 React 가 실제로 어떻게 작동 하는지를 보장 할 수는 없습니다. 필자는 필자의 말을 React 의 소스 코드에서 증명과 참조로 뒷받침했으며 가능한 한 견고하게 주장하려고 노력했습니다.

![https://miro.medium.com/max/684/1*R-oovJm4IQBLDjZy6DvbBg.png](https://miro.medium.com/max/684/1*R-oovJm4IQBLDjZy6DvbBg.png)

우선, React 의 범위 내에서 후크가 호출 되도록하는 메커니즘을 살펴 보겠습니다. 오른쪽 컨텍스트에서 호출되지 않으면 후크가 의미가 없다는 것을 알 수 있기 때문입니다.

## The dispatcher

디스패처는 후크 기능을 포함하는 공유 객체입니다. ReactDOM 의 렌더링 단계를 기반으로 동적으로 할당되거나 정리되며 사용자가 React 구성 요소 외부의 후크에 액세스하지 못하게합니다. (see [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberDispatcher.js?source=post_page---------------------------#L24)).

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

렌더링 작업이 끝나면 디스패처를 무효화하여 ReactDOM 렌더링주기 밖에서 후크가 실수로 사용되는 것을 방지합니다. 이것은 사용자가 어리석은 일을하지 않도록 보장하는 메커니즘입니다. (see [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L1376)).

```javascript
// 1376줄 ReactFiberScheduler.js
// We're done performing work. Time to clean up.

ReactCurrentOwner.currentDispatcher = null
```

디스패처는 `resolveDispatcher()` 함수를 사용하여 각각의 모든 후크 호출에서 해결됩니다. 앞에서 말했듯이, React 의 렌더링주기 밖에서는 의미가 없어야하고, React 는 경고 메시지를 출력해야합니다 : _"후크는 함수 구성 요소의 본체 내부에서만 호출 할 수 있습니다"_ (see [implementation](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react/src/ReactHooks.js?source=post_page---------------------------#L17)).

Dispatcher 실행을 간단하게 표현하면 아래와 같다.

```javascript
let currentDispatcher
const dispatcherWithoutHooks = {
  /* ... */
}
const dispatcherWithHooks = {
  /* ... */
}

function resolveDispatcher() {
  if (currentDispatcher) return currentDispatcher
  throw Error("Hooks can't be called")
}

function useXXX(...args) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useXXX(...args)
}

function renderRoot() {
  currentDispatcher = enableHooks ? dispatcherWithHooks : dispatcherWithoutHooks
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

이제는 간단한 캡슐화 메커니즘을 살펴 보았으므로 이 기사의 핵심 인 후크로 넘어 가고자 한다. 여기서 나는 새로운 개념을 소개하고자 합니다.

## The hooks queue

후크는 호출 순서로 함께 연결된 노드로 표시됩니다. 후크가 단순히 만들어지지 않고 남겨지기 때문에 그들은 그렇게 표현됩니다. 그들은 그들이 존재하는 것을 가능하게하는 메커니즘을 가지고 있습니다. 후크(hook)에는 구현에 뛰어 들기 전에 마음에 새겨야 할 필요한 몇 가지 프로퍼티들 있습니다.

* 초기 상태값은 초기 렌더링에서 생성됩니다.
* 상태를 즉시 업데이트 할 수 있습니다.
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

훅에는 몇 가지 추가 속성이 있지만 훅의 작동 방식을 이해하는 열쇠는`memoizedState` 와 `next` 내에 있습니다. 나머지 프로퍼티들은 `useReducer()` 훅에 의해 특별히 사용되어 `디스패치 된 액션`과 `기본 상태들(base states)`를 캐싱하므로 다양한 경우 fallback 처럼 이런 감소 프로세스가 반복 될 수 있습니다 :

* `baseState` - reducer 에 주어질 상태 객체.
* `baseUpdate` -`baseState`를 생성 한 가장 최근의 dispatch 된 액션입니다.
* `queue` - dispatch 된 액션의 대기열(queue), reducer 를 통해 처리되길 기다리는 액션들이다.

```javascript
// https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js?source=post_page---------------------------#L367
do {
  // Process this render phase update. We don't have to check the
  // priority because it will always be the same as the current
  // render's.
  const action = update.action
  newState = reducer(newState, action)
  update = update.next
} while (update !== null)
```

> 여기서 reducer 는 action 과 payload state 를 받아서 새로운 state 를 반환하는 순수함수라 할 수 있겠다. baseUpdate 는 액션이라고 보면 될것이다.

불행하게도 저는 거의 모든 경우를 재현 할 수 없었기 때문에 reducer hook 을 잘 이해할 수 없었습니다. 그래서 정교하게 느껴지지 않을 것입니다. 나는 단지 reducer 구현이 너무 일관성이 없기 때문에 [implementation](https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js?source=post_page---------------------------#L380) 에서 구현 자체의 주석 중 하나가 "(이것이) 원하는 의미론이 맞는지 확실치 않다(TODO: Not sure if this is the desired semantics, but it's what we do for gDSFP. I can't remember why.)" 라고 말합니다. 그래서 어떻게 확신해야합니까?!

따라서 각각의 모든 컴포넌트 호출 이전에 후크로 돌아가서, [`prepareHooks()`](https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js#L123)라는 이름의 함수가 호출됩니다. current fiber 와 hooks 큐(대기열) 안에 있는 그것의 첫 번째 후크 노드는 전역 변수에 저장됩니다. 이런 방식으로, 우리가 후크 함수 (`useXXX ()`)를 호출 할 때마다 어떤 컨텍스트에서 실행되는지를 알 수 있습니다.

> prepareHooks() 이 함수가 보이지 않는다. prepareToUseHooks() 이 함수인거 같다.

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
function prepareHooks(recentFiber: Fiber | null, workInProgressFiber: Fiber) {
  currentlyRenderingFiber = workInProgressFiber // 현재 작업중인 Fiber
  currentHook = recentFiber.memoizedState // 이미 render된 Fiber의 memoizedState를 currentHook에 할당.
}

// Source: https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/react-reconciler/src/ReactFiberHooks.js:148
function finishHooks() {
  currentlyRenderingFiber.memoizedState = workInProgressHook
  currentlyRenderingFiber = null
  workInProgressHook = null
  currentHook = null
}

// Source: https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js#L332
function resolveCurrentlyRenderingFiber() {
  if (currentlyRenderingFiber) return currentlyRenderingFiber
  throw Error("Hooks can't be called")
}
// Source: https://github.com/facebook/react/blob/5f06576f51ece88d846d01abd2ddd575827c6127/packages/react-reconciler/src/ReactFiberHooks.js#L267
function createWorkInProgressHook() {
  workInProgressHook = currentHook ? cloneHook(currentHook) : createNewHook()
  currentHook = currentHook.next
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
  Component(props) // 3. 컴포넌트 호출
  finishHooks() // 5. Hooks 마무리
}
```

업데이트가 완료되면, [`finishHooks()`](https://github.com/facebook/react/tree/5f06576f51ece88d846d01abd2ddd575827c6127/react-reconciler/src/ReactFiberHooks.js:148?source=post_page---------------------------) 이 호출 될 것입니다. 여기서 후크 대기열의 첫 번째 노드에 대한 참조가 `memoizedState` 속성의 렌더링 된 fiber 에 저장됩니다. 즉, 후크 대기열과 그 상태를 외부 적으로 처리 할 수 ​​ 있습니다.

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

```javascript
export function useReducer() {
  currentlyRenderingFiber = resolveCurrentlyRenderingFiber()
  workInProgressHook = createWorkInProgressHook()
  let queue: UpdateQueue<A> | null = (workInProgressHook.queue: any)

  // ...
  const dispatch: Dispatch<A> = (queue.dispatch = (dispatchAction.bind(
    null,
    currentlyRenderingFiber,
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
