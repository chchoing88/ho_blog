---
title: React Fiber part3
date: "2019-07-22T10:00:03.284Z"
---

[이글](https://medium.com/react-in-depth/in-depth-explanation-of-state-and-props-update-in-react-51ab94563311)을 번역 및 분석 한 글입니다. 잘못된 번역 및 생략된 번역이 있을 수 있습니다.

# In-depth explanation of state and props update in React

이전 기사 인 [Inside Fiber: in-depth overview of the new reconciliation algorithm in React](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e?source=post_page---------------------------) 에서는 이 기사에서 설명 할 업데이트 프로세스의 기술적 세부 사항을 이해하는 데 필요한 기반을 마련했습니다.

필자는 이 기사에서 사용할 주요 데이터 구조 및 개념, 특히 fiber 노드, current 및 work-in-progress 트리, side-effects 및 effects list 에 대해 설명했습니다. 또한 주요 알고리즘에 대한 높은 수준의 개요를 제공하고 렌더링 및 커밋 단계의 차이점을 설명했습니다. 그것을 읽지 않았다면 거기에서 시작하는 것이 좋습니다.

또한 화면에 렌더링 된 숫자를 단순히 증가시키는 버튼을 사용하여 샘플 애플리케이션을 소개했습니다.

[여기](https://stackblitz.com/edit/react-jwqn64?source=post_page---------------------------)에서 해볼 수 있습니다. 이는 render 메소드에서 두 개의 하위 요소 button 및 span 을 반환하는 간단한 구성 요소로 구현됩니다. 버튼을 클릭하면 구성 요소의 상태가 핸들러 내부에서 업데이트됩니다. `span` 요소에 대한 텍스트 업데이트 결과는 다음과 같습니다.

```javascript
class ClickCounter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState(state => {
      return { count: state.count + 1 }
    })
  }

  componentDidUpdate() {}

  render() {
    return [
      <button key="1" onClick={this.handleClick}>
        Update counter
      </button>,
      <span key="2">{this.state.count}</span>,
    ]
  }
}
```

여기에서는 `componentDidUpdate` 라이프 사이클 메서드를 구성 요소에 추가했습니다. 이것은 React 가 `커밋 단계`에서 이 메서드를 호출하는 [effects](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)를 추가하는 방법을 보여주기 위해 필요합니다.

이 글에서는 React 프로세스 state 업데이트 및 effects list 작성 방법을 알려 드리고자 합니다. `렌더링` 및 `커밋 단계`의 고급 기능에서 진행중인 작업을 살펴 ​​ 봅니다.
특히, 우리는 React `completeWork`에서 어떻게 작동하는지 볼것입니다.

* `ClickCounter`의 `state`에서 `count` 속성을 업데이트합니다.
* `render` 메서드를 호출하여 children 목록을 가져 와서 비교를 수행합니다.
* `span` 요소에 대한 props 을 업데이트합니다.

그리고, `commitRoot`에서 React :

* `span` 요소의 `textContent` 속성을 업데이트합니다.
* `componentDidUpdate` 라이프 사이클 메소드를 호출합니다.

그러나 그 전에 `click` 핸들러에서 `setState`를 호출 할 때 작업 일정을 빠르게 살펴 보겠습니다.

**React 를 사용하기 위해 그걸 알 필요는 없습니다. 이 기사는 React 가 내부적으로 어떻게 작동하는지에 대한 것입니다.**

## Render phase

### Scheduling updates

버튼을 클릭하면 `click` 이벤트가 트리거되고 React 는 button props 로 전달한 콜백함수를 실행합니다. 우리의 응용 프로그램에서는 단순히 카운터를 증가시키고 상태를 업데이트합니다.

```javascript
class ClickCounter extends React.Component {
    ...
    handleClick() {
        this.setState((state) => {
            return {count: state.count + 1};
        });
    }
}
```

모든 React component 에는 component 와 React 코어 사이의 다리 역할을하는 연결된 `updater`가 있습니다. 이를 통해 setState 가 ReactDOM, React Native, 서버 측 렌더링 및 테스트 유틸리티에 의해 다르게 구현 될 수 있습니다.

[여기](https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react/src/ReactBaseClasses.js)참조

```javascript
Component.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.'
  )
  this.updater.enqueueSetState(this, partialState, callback, 'setState')
}
```

```javascript
const classComponentUpdater = {
  isMounted,
  enqueueSetState(inst, payload, callback) {
    const fiber = ReactInstanceMap.get(inst);
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);

    const update = createUpdate(expirationTime);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      if (__DEV__) {
        warnOnInvalidCallback(callback, 'setState');
      }
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
  ...
}
```

이 글에서는 Fiber reconciler 를 사용하는 ReactDOM 의 updater 객체 구현을 살펴 보겠습니다. `ClickCounter` 구성 요소의 경우 [`classComponentUpdater`](https://github.com/facebook/react/blob/6938dcaacbffb901df27782b7821836961a5b68d/packages/react-reconciler/src/ReactFiberClassComponent.js?source=post_page---------------------------#L186)입니다. 이는 Fiber 의 인스턴스를 검색하고, 업데이트를 대기열에 넣어두고, 작업을 예약하는(scheduling) 역할을합니다.

업데이트가 대기열에 있으면 기본적으로 업데이트 큐에 추가되어 fiber 노드에서 처리됩니다. 여기서는 `ClickCounter` 구성 요소에 해당하는 Fibre 노드의 구조는 다음과 같습니다.

```javascript
{
    stateNode: new ClickCounter,
    type: ClickCounter,
    updateQueue: {
         baseState: {count: 0}
         firstUpdate: {
             next: {
                 payload: (state) => { return {count: state.count + 1} }
             }
         },
         ...
     },
     ...
}
```

보시다시피 `updateQueue.firstUpdate.next.payload`의 함수는 `ClickCounter` 구성 요소의 `setState`에 전달한 콜백함수입니다. `렌더링 단계`에서 처리해야하는 첫 번째 업데이트를 나타냅니다.

### Processing updates for the ClickCounter Fiber node

[이전 기사의 작업 루프 장](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)에서는 `nextUnitOfWork` 전역 변수의 역할에 대해 설명했습니다. 특히, 이 변수는해야 할 일이있는 `workInProgress` 트리에서 Fibre 노드에 대한 참조를 보유하고 있음을 나타냅니다. React 가 Fibers 트리를 탐색하면서이 변수를 사용하여 완료되지 않은 다른 Fiber 노드가 있는지 확인합니다.

`setState` 메소드가 호출되었다고 가정 해 보겠습니다. React 는 `setState`의 콜백을 `ClickCounter` fiber 노드의 `updateQueue` 프로퍼티에 추가하고 작업 일정을 조정합니다. React 는 `렌더링 단계`에 들어갑니다. [renderRoot](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L1132) 함수를 사용하여 최상위 `HostRoot` Fibre 노드에서부터 이동을 시작합니다. 그러나 작업이 완료되지 않은 노드를 찾을 때까지 이미 처리 된 fiber 노드를 벗어납니다 (건너 뜁니다). 이 시점에서 해야 할 작업이 하나만있는 Fibre 노드가 있습니다. 그것은 `ClickCounter` Fiber 노드입니다.

모든 작업은 `alternate` 필드에 저장되는 이 Fiber 노드의 복제본에서 수행됩니다. alternate 노드가 아직 작성되지 않은 경우 React 는 갱신을 처리하기 전에 `createWorkInProgress` 함수에서 사본을 생성합니다. 변수 nextUnitOfWork 가 alternate `ClickCounter` Fibre 노드에 대한 참조를 보유한다고 가정 해 봅시다.

### beginWork

첫째, 우리의 Fiber 는 [beginWork](https://github.com/facebook/react/blob/cbbc2b6c4d0d8519145560bd8183ecde55168b12/packages/react-reconciler/src/ReactFiberBeginWork.js?source=post_page---------------------------#L1489) 함수에 들어갑니다.

> 이 함수는 트리의 모든 Fiber 노드에 대해 실행되기 때문에 `렌더링 단계`를 디버그하려는 경우 중단 점을 넣는 것이 좋습니다. 나는 이것을 자주하고 fiber 노드의 타입을 점검하여 필요한 곳에 중단점을 고정시킵니다.

`beginWork` 함수는 기본적으로 tag 에 의해 Fibre 노드에 대해 수행해야하는 작업 유형을 결정한 다음 해당 함수를 실행하여 작업을 수행하는 큰 `switch` 문입니다. `CountClicks`의 경우 클래스 구성 요소이므로 이 분기가 수행됩니다.

```javascript
function beginWork(current$$1, workInProgress, ...) {
    ...
    switch (workInProgress.tag) {
        ...
        case FunctionalComponent: {...}
        case ClassComponent:
        {
            ...
            return updateClassComponent(current$$1, workInProgress, ...);
        }
        case HostComponent: {...}
        case ...
}
```

우리는 `updateClassComponent` 함수를 사용합니다. component, 작업 재개 중 첫 번째 렌더링인지 또는 React 업데이트 인지 여부에 따라 React 는 인스턴스를 만들고 해당 component 를 mount 하거나 단순히 업데이트합니다.

```javascript
function updateClassComponent(current, workInProgress, Component, ...) {
    ...
    const instance = workInProgress.stateNode;
    let shouldUpdate;
    if (instance === null) {
        ...
        // In the initial pass we might need to construct the instance.
        constructClassInstance(workInProgress, Component, ...);
        mountClassInstance(workInProgress, Component, ...);
        shouldUpdate = true;
    } else if (current === null) {
        // In a resume, we'll already have an instance we can reuse.
        shouldUpdate = resumeMountClassInstance(workInProgress, Component, ...);
    } else {
        shouldUpdate = updateClassInstance(current, workInProgress, ...);
    }
    return finishClassComponent(current, workInProgress, Component, shouldUpdate, ...);
}
```

### Processing updates for the ClickCounter Fiber

우리는 이미 `ClickCounter` 컴포넌트의 인스턴스를 가지고 있으므로 [`updateClassInstance`](https://github.com/facebook/react/blob/6938dcaacbffb901df27782b7821836961a5b68d/packages/react-reconciler/src/ReactFiberClassComponent.js?source=post_page---------------------------#L976)로 들어갑니다. 그곳이 React 가 클래스 component 에 대한 대부분의 작업을 수행하는 곳입니다. 다음은 실행 순서대로 함수에서 수행 된 가장 중요한 연산입니다.

* `UNSAFE_componentWillReceiveProps()` hook (더 이상 사용되지 않음) 호출
* `updateQueue`에서 업데이트를 처리하고 새 상태를 생성합니다. `updateQueue.firstUpdate.next.payload` 에 들어가있는 콜백함수
* 이 새로운 상태로 `getDerivedStateFromProps`를 호출하고 결과를 얻습니다.
* `shouldComponentUpdate`를 호출하여 component 가 업데이트하려고하는지 확인합니다. `false`의 경우,이 컴퍼넌트와 그 아이의 렌더링을 호출하는 것을 포함 해, 모든 렌더링 처리를 스킵합니다. 그렇지 않으면 업데이트 진행합니다.
* `UNSAFE_componentWillUpdate` 호출 (더 이상 사용되지 않음)
* `componentDidUpdate` 라이프 사이클 hook 트리거를 effect 에 추가합니다.

> `componentDidUpdate`를 호출하는 효과는 `렌더링 단계`에서 추가되지만 메서드는 다음 `커밋 단계`에서 실행됩니다.

* component 인스턴스에서 `state` 및 `props` 을 업데이트합니다.

> `render` 메서드 output 은 대개 `state` 및 `props`에 따라 다르기 때문에 `state` 및 `props` 는 `render` 메서드가 호출되기 전에 component 인스턴스에서 업데이트해야합니다. 우리가 그렇게하지 않으면, 매번 동일한 출력을 반환 할 것입니다.

다음은 함수의 단순화 된 버전입니다.

```javascript
function updateClassInstance(current, workInProgress, ctor, newProps, ...) {
    const instance = workInProgress.stateNode;

    const oldProps = workInProgress.memoizedProps;
    instance.props = oldProps;
    if (oldProps !== newProps) {
        callComponentWillReceiveProps(workInProgress, instance, newProps, ...);
    }
    // updateQueue.firstUpdate.next.payload
    let updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null) {
        processUpdateQueue(workInProgress, updateQueue, ...);
        newState = workInProgress.memoizedState;
    }

    applyDerivedStateFromProps(workInProgress, ...);
    newState = workInProgress.memoizedState;

    const shouldUpdate = checkShouldComponentUpdate(workInProgress, ctor, ...);
    if (shouldUpdate) {
        instance.componentWillUpdate(newProps, newState, nextContext);
        workInProgress.effectTag |= Update;
        workInProgress.effectTag |= Snapshot;
    }

    instance.props = newProps;
    instance.state = newState;

    return shouldUpdate;
}
```

위의 스니펫에서 일부 보조 코드를 제거했습니다. 예를 들어 lifecycle 메서드를 호출하거나 트리거하기 위해 effect 에 추가하기 전에 React 는 `typeof` 연산자를 사용하여 component 가 메서드를 구현되었는지 확인합니다. 예를 들어, React 가 effect 를 추가하기 전에 `componentDidUpdate` 메소드를 검사하는 방법은 다음과 같습니다.

```javascript
if (typeof instance.componentDidUpdate === 'function') {
  workInProgress.effectTag |= Update
}
```

이제는 `렌더링 단계`에서 `ClickCounter` Fiber 노드에 대해 어떤 작업이 수행되는지 알았습니다. 이제 이러한 작업이 fiber 노드에서 값을 변경하는 방법을 살펴 보겠습니다. React 가 시작되면 `ClickCounter` component 의 Fibre 노드는 다음과 같습니다.

```javascript
{
    effectTag: 0,
    elementType: class ClickCounter,
    firstEffect: null,
    memoizedState: {count: 0},
    type: class ClickCounter,
    stateNode: { // instance
        state: {count: 0}
    },
    updateQueue: {
        baseState: {count: 0},
        firstUpdate: {
            next: {
                payload: (state, props) => {…}
            }
        },
        ...
    }
}
```

작업이 완료되면 다음과 같은 Fiber 노드가 생깁니다.

```javascript
{
    effectTag: 4, // 변경 Update
    elementType: class ClickCounter,
    firstEffect: null,
    memoizedState: {count: 1}, // 변경
    type: class ClickCounter,
    stateNode: { // instance
        state: {count: 1} // 변경
    },
    updateQueue: {
        baseState: {count: 1}, // 변경
        firstUpdate: null,
        ...
    }
}
```

**잠시 시간을내어 프로퍼티 값의 차이점을 관찰하십시오.**

업데이트가 적용되면 `memoizedState` 및 `updateQueue`의 `baseState`에서 속성 수의 값이 1 로 변경됩니다. React 는 또한 `ClickCounter` component 인스턴스의 상태를 업데이트했습니다.
이 시점에서 큐에 더 이상 업데이트가 없으므로 `firstUpdate`는 null 입니다.

그리고 중요하게도 우리는 `effectTag` 속성을 변경했습니다. 그것은 더 이상 `0`이 아니며, 값은 `4`입니다. 이진수에서는 `100`입니다. 이는 세 번째 비트가 설정됨을 의미합니다. 이는 `Update` [`side-effect tag`](https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/shared/ReactSideEffectTags.js?source=post_page---------------------------)의 비트입니다.

```javascript
export const Update = 0b00000000100
```

결론적으로 부모 `ClickCounter` Fibre 노드에서 작업 할 때 React 는 사전 변이(pre-mutation) 생명주기 메소드를 호출하고 state 를 업데이트하고 관련 부작용(side-effects)을 정의합니다.

### Reconciling children for the ClickCounter Fiber

완료되면 React 가 [`finishClassComponent`](https://github.com/facebook/react/blob/340bfd9393e8173adca5380e6587e1ea1a23cefa/packages/react-reconciler/src/ReactFiberBeginWork.js?source=post_page---------------------------#L355)로 들어갑니다. 여기서 React 는 컴포넌트 인스턴스의 `render` 메소드를 호출하고 해당 diffing 알고리즘을 component 가 리턴 한 children 에 적용합니다. 고급 개요는 문서에 설명되어 있습니다. [다음](https://reactjs.org/docs/reconciliation.html?source=post_page---------------------------#the-diffing-algorithm)은 관련 부분입니다.

> 같은 유형의 두 개의 React DOM 요소를 비교할 때 React 는 두 속성을 보고 동일한 기본 DOM 노드를 유지하고 변경된 속성 만 업데이트합니다.

그러나 우리가 더 깊이 파고 들면 실제로 Fiber 노드와 React elements 를 비교한다는 것을 알 수 있습니다. 그러나 프로세스가 매우 정교하기 때문에 지금은 자세하게 설명하지 않겠습니다. 나는 child reconciliation 의 과정에 초점을 둔 별도의 글을 쓸 것입니다.

> 스스로 세부 사항을 배우고 싶다면 [reconcileChildrenArray](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactChildFiber.js?source=post_page---------------------------#L732) 함수를 확인하십시오. 우리의 어플리케이션에서는 `render` 메소드가 React 요소의 배열을 반환하기 때문에 `reconcileChildrenArray` 함수를 확인하십시오.

이 시점에서 이해해야 할 중요한 두 가지가 있습니다. **먼저**, React 가 child reconciliation 를 진행할 때 `render` 메소드에서 반환 된 **child React elements 에 대한 Fibre 노드를 만들거나 업데이트 해야합니다.** `finishClassComponent` 함수는 현재 Fibre 노드의 `첫 번째 자식에 대한 참조`를 반환합니다. `nextUnitOfWork`에 할당되고 나중에 작업 루프(work loop)에서 처리됩니다. **둘째**, React 는 parent 에 대한 수행 한 작업의 일부로 **children 의 props 을 업데이트**합니다. 이를 위해 `render` 메소드에서 반환 된 React 요소의 데이터를 사용합니다.

예를 들어, React 가 `ClickCounter` fiber 에 대한 children 을 reconciles 하기 전에 `span` 요소에 해당하는 Fibre 노드가 다음과 같이 표시됩니다.

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    key: "2",
    memoizedProps: {children: 0},
    pendingProps: {children: 0},
    ...
}
```

보시다시피, `memoizedProps` 및 `pendingProps`의 `children` 속성은 모두 `0`입니다. 여기에 `span` 요소에 대한 `render` 에서 반환 된 React 요소의 구조가 있습니다.

```javascript
// ClickCounter 의 render 메서드 호출 후에 리턴된 span element
{
  $$typeof: Symbol(react.element)
  key: '2'
  props: {
    children: 1
  }
  ref: null
  type: 'span'
}
```

보시다시피, **Fibre 노드의 props 과 반환 된 React element 에는 차이점이 있습니다.** alternate fiber 노드를 만드는 데 사용되는 `createWorkInProgress` 함수에서 **React 는 React element 에서 업데이트 된 프로퍼티를 fiber 노드로 복사합니다.**

따라서 React 가 `ClickCounter` component 에 대한 children 을 reconciling 한 후에는 `span` Fiber 노드에 `pendingProps`가 업데이트됩니다. 그들은 React 요소의 값과 일치합니다 :

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    key: "2",
    memoizedProps: {children: 0},
    pendingProps: {children: 1}, // 업데이트
    ...
}
```

나중에 React 가 `span` fiber 노드에 대한 작업을 수행 할 때 그것들을 `memoizedProps`에 복사하고 DOM 을 업데이트하기 위해 effects 를 추가합니다.

React 가 렌더링 단계에서 `ClickCounter` fiber 노드에 대해 수행하는 모든 작업이 그것입니다. 버튼은 `ClickCounter` component 의 첫 번째 자식이므로 `nextUnitOfWork` 변수에 할당됩니다. 그걸로 끝내야 할 것이 없으므로, React 는 Fibre 노드의 형제로 이동할 것입니다. [여기](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e?source=post_page---------------------------)에 설명 된 알고리즘에 따르면 노드의 형제 이동 로직은 `completeUnitOfWork` 함수에서 발생합니다.

여기서 `button` 컴포넌트는 `beginWork()` 수행 후 별도의 자식이 없으므로 null 이 리턴될 것이다.
null 이 리턴되면 곧바로 `completeUnitOfWork` 메서드로 들어가서 `completeWork` 메서드를 진행하게 된다.
그 후에 `sibling` 을 리턴하는데 그것이 `span` 태그이다.

### Processing updates for the Span fiber

그래서 변수 `nextUnitOfWork`는 `span` fiber 의 alternate 을 가리키고 React 가 작업을 시작합니다. `ClickCounter`에 대해 수행 된 단계와 유사하게 `beginWork` 함수로 시작합니다.

`span` 노드가 `HostComponent` 타입이기 때문에, 이번에는 switch 문에서 React 가이 분기를 취합니다 :

```javascript
function beginWork(current$$1, workInProgress, ...) {
    ...
    switch (workInProgress.tag) {
        case FunctionalComponent: {...}
        case ClassComponent: {...}
        case HostComponent:
          return updateHostComponent(current, workInProgress, ...);
        case ...
}
```

[`updateHostComponent`](https://github.com/facebook/react/blob/cbbc2b6c4d0d8519145560bd8183ecde55168b12/packages/react-reconciler/src/ReactFiberBeginWork.js?source=post_page---------------------------#L686) 함수에서 끝납니다. 클래스 구성 요소에 대해 호출 된 `updateClassComponent` 함수와의 병렬을 볼 수 있습니다. functional component 의 경우 `updateFunctionComponent` 가됩니다. 이러한 모든 기능은 [`ReactFiberBeginWork.js`](https://github.com/facebook/react/blob/1034e26fe5e42ba07492a736da7bdf5bf2108bc6/packages/react-reconciler/src/ReactFiberBeginWork.js?source=post_page---------------------------) 파일에서 찾을 수 있습니다.

### Reconciling children for the span fiber

여기서는 `updateHostComponent`의 `span` 노드에 아무런 중요한 일도 일어나지 않습니다.

### Completing work for the Span Fiber node

`beginWork` 가 끝나면 노드는 `completeWork` 함수로 들어갑니다. 하지만 그 전에 React 는 span fiber 에 `memoizedProps`을 업데이트 해야합니다. `ClickCounter` 구성 요소에 대해 자식을 reconciling 할 때 React span fibre 노드의 `pendingProps`가 업데이트 되었음을 ​​ 기억할 수 있습니다.

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    key: "2",
    memoizedProps: {children: 0},
    pendingProps: {children: 1},
    ...
}
```

따라서 `beginWork` 가 span fiber 에 대해 완료되면 React `pendingProps` 가 `memoizedProps` 와 일치합니다.

```javascript
function performUnitOfWork(workInProgress) {
    ...
    next = beginWork(current$$1, workInProgress, nextRenderExpirationTime);
    workInProgress.memoizedProps = workInProgress.pendingProps;
    ...
}
```

그런 다음 기본적으로 `beginWork` 에서 본 것과 비슷한 switch 문인 `completeWork` 함수를 호출합니다.

```javascript
function completeWork(current, workInProgress, ...) {
    ...
    switch (workInProgress.tag) {
        case FunctionComponent: {...}
        case ClassComponent: {...}
        case HostComponent: {
            ...
            updateHostComponent(current, workInProgress, ...);
        }
        case ...
    }
}
```

우리의 span Fibre 노드는 HostComponent 이므로 `updateHostComponent` 함수를 실행합니다. 이 함수에서 React 는 기본적으로 다음을 수행합니다.

* DOM 업데이트를 준비합니다.
* span fiber 의 updateQueue 에 그것들을 추가한다.
* DOM 을 업데이트하는 effect 추가

이러한 작업을 수행하기 전에 span fiber 노드는 다음과 같습니다.

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    effectTag: 0
    updateQueue: null
    ...
}
```

작업이 완료되면 다음과 같이 보입니다.

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    effectTag: 4, // update
    updateQueue: ["children", "1"],
    ...
}
```

`effectTag` 및 `updateQueue` 필드의 차이점을 확인하십시오. 그것은 더 이상 `0`이 아니며, 값은 `4`입니다. 이진수에서는 `100`입니다. 이는 세 번째 비트가 설정됨을 의미합니다. 이는 업데이트 side-effect tag 의 비트입니다. 이것은 다음 `커밋 단계`에서 React 가 이 노드에 대해 수행해야하는 유일한 작업입니다. `updateQueue` 필드는 업데이트에 사용될 페이로드를 보유합니다.

React 가 `ClickCounter` 와 그 children 을 처리하면 `렌더링 단계`가 완료됩니다. 완성 된 대체 트리를 `FiberRoot` 의 `finishedWork` 속성에 할당 할 수 있습니다. 이것은 새로운 tree 가 화면에 뿌려져야 합니다. `렌더링 단계` 직후에 바로 처리하거나 나중에 React 가 브라우저에 의해 주어진 시간에 선택 될 수 있습니다.

### Effects list

우리의 경우 `span` 노드와 `ClickCounter` 컴포넌트는 side effects 가 있으므로 React 는 `Span` Fiber 노드에 대한 링크를 `HostFiber` 의 `firstEffect` 속성에 추가합니다.
React 는 [`completeUnitOfWork`](https://github.com/facebook/react/blob/d5e1bf07d086e4fc1998653331adecddcd0f5274/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L999) 함수에서 effects list 을 작성합니다. 다음은 `span` 노드의 텍스트를 업데이트의 effect 를 가진 Fiber tree 와 `ClickCounter`에서 hooks 를 호출하는 트리의 예입니다.

![effect-linearList01](./effect-linearList01.png)

다음은 효과가있는 노드의 선형 목록입니다.

![effect-linearList02](./effect-linearList02.png)

## Commit phase

이 단계는 [`completeRoot`](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L2306) 함수로 시작합니다. 작업을하기 전에 `FiberRoot` 의 `finishedWork` 속성을 `null` 로 설정합니다.

```
root.finishedWork = null;
```

첫 번째 `렌더링 단계`와 달리 `커밋 단계`는 항상 동기식이므로 `HostRoot`를 안전하게 업데이트하여 커밋 작업이 시작되었음을 나타낼 수 있습니다.

커밋 단계에서는 React 가 DOM 을 업데이트하고 post mutation lifecycle 메서드 인 `componentDidUpdate` 를 호출합니다. 이를 위해 이전 `렌더링 단계`에서 생성 한 effects list 을 검토하고 적용합니다.

우리는 `span` 및 `ClickCounter` 노드의 `렌더링 단계`에서 다음과 같은 effect 를 정의했습니다.

```javascript
{ type: ClickCounter, effectTag: 5 }
{ type: 'span', effectTag: 4 }
```

`ClickCounter` 의 효과 태그 값은 `5` 또는 2 진수로 `101`이며 클래스 구성 요소의 경우 기본적으로 `componentDidUpdate` 라이프 사이클 메소드로 변환되는 업데이트 작업을 정의합니다. 또한 최하위 비트는 렌더링 단계에서이 fiber 노드에 대한 모든 작업이 완료되었음을 알리기 위해 설정됩니다.
`span` 에 대한 효과 태그의 값은 `4` 또는 2 진수로 `100`이며 host component DOM 업데이트의 `update` 작업을 정의합니다. `span` 요소의 경우, React 는 요소의 `textContent`를 업데이트해야합니다.

### Applying effects

React 가 어떻게 그 effects 를 적용하는지 봅시다. effects 를 적용하는 데 사용되는 `commitRoot` 함수는 세 가지 하위 함수로 구성됩니다.

```javascript
function commitRoot(root, finishedWork) {
  commitBeforeMutationLifecycles()
  commitAllHostEffects()
  root.current = finishedWork
  commitAllLifeCycles()
}
```

각 하위 함수는 effects list 을 반복하고 effects 타입을 확인하는 루프를 구현합니다. 함수의 목적과 관련된 effect 를 발견하면 적용합니다. 여기서는 `ClickCounter` 구성 요소에서 `componentDidUpdate` 라이프 사이클 메서드를 호출하고 `span` 요소의 텍스트를 업데이트합니다.
첫 번째 함수 인 [`commitBeforeMutationLifeCycles`](https://github.com/facebook/react/blob/fefa1269e2a67fa5ef0992d5cc1d6114b7948b7e/packages/react-reconciler/src/ReactFiberCommitWork.js?source=post_page---------------------------#L183) 는 `Snapshot` effect 를 찾고 `getSnapshotBeforeUpdate` 메서드를 호출합니다. 그러나 `ClickCounter` 구성 요소에 이 메서드를 구현하지 않았으므로 React 는 렌더링 단계에서 effect 를 추가하지 않았습니다. 그래서 우리의 경우이 함수는 아무 것도하지 않습니다.

### DOM updates

다음 React 는 `commitAllHostEffects` 함수로 이동한다. 여기서 React 가 `span` 요소의 텍스트를 `0`에서 `1`로 변경합니다. 클래스 구성 요소에 해당하는 노드에 DOM 업데이트가 없으므로 `ClickCounter` fiber 에는 아무 작업도 수행되지 않습니다.
함수의 요지는 올바른 effect 의 타입를 선택하고 해당 작업을 적용한다는 것입니다. 여기서는 `span` 요소의 텍스트를 업데이트 해야하므로 여기에서 `Update` 분기를 가져옵니다.

```javascript
function updateHostEffects() {
    switch (primaryEffectTag) {
      case Placement: {...}
      case PlacementAndUpdate: {...}
      case Update:
        {
          var current = nextEffect.alternate;
          commitWork(current, nextEffect);
          break;
        }
      case Deletion: {...}
    }
}
```

`commitWork` 로 이동하면 결국 `updateDOMProperties` 함수로 들어간다. 렌더 단계 동안 Fibre 노드에 추가 된 `updateQueue` 페이로드를 가져 와서 `span` 요소의 `textContent` 속성을 업데이트합니다.

```javascript
function updateDOMProperties(domElement, updatePayload, ...) {
  for (let i = 0; i < updatePayload.length; i += 2) {
    // updateQueue: ["children", "1"],
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    if (propKey === STYLE) { ...}
    else if (propKey === DANGEROUSLY_SET_INNER_HTML) {...}
    else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else {...}
  }
}
```

DOM 업데이트가 적용된 후 React 는 `finishedWork` 트리를 `HostRoot` 에 할당합니다. alternate 트리를 현재(current)로 설정합니다.

```javascript
root.current = finishedWork
```

### Calling post mutation lifecycle hooks

마지막 남은 기능은 [`commitAllLifecycles`](https://github.com/facebook/react/blob/d5e1bf07d086e4fc1998653331adecddcd0f5274/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L479) 입니다. 여기서 React 는 post mutational lifecycle methods 를 호출합니다. 렌더링 단계에서 React 는 `Update` effect 를 ClickCounter 구성 요소에 추가했습니다. 이것은 `commitAllLifecycles` 함수가 찾고 `componentDidUpdate` 메서드를 호출하는 effects 중 하나입니다.

```javascript
function commitAllLifeCycles(finishedRoot, ...) {
    while (nextEffect !== null) {
        const effectTag = nextEffect.effectTag;

        if (effectTag & (Update | Callback)) {
            const current = nextEffect.alternate;
            commitLifeCycles(finishedRoot, current, nextEffect, ...);
        }

        if (effectTag & Ref) {
            commitAttachRef(nextEffect);
        }

        nextEffect = nextEffect.nextEffect;
    }
}
```

함수는 또한 [refs](https://reactjs.org/docs/refs-and-the-dom.html?source=post_page---------------------------)를 업데이트하지만, 우리는 이 기능을 가지고 있지 않기 때문에 사용되지 않을 것이다. 이 메소드는 [`commitLifeCycles`](https://github.com/facebook/react/blob/e58ecda9a2381735f2c326ee99a1ffa6486321ab/packages/react-reconciler/src/ReactFiberCommitWork.js?source=post_page---------------------------#L351) 함수에서 호출됩니다.

```javascript
function commitLifeCycles(finishedRoot, current, ...) {
  ...
  switch (finishedWork.tag) {
    case FunctionComponent: {...}
    case ClassComponent: {
      const instance = finishedWork.stateNode;
      if (finishedWork.effectTag & Update) {
        if (current === null) {
          instance.componentDidMount();
        } else {
          ...
          instance.componentDidUpdate(prevProps, prevState, ...);
        }
      }
    }
    case HostComponent: {...}
    case ...
}
```

React 가 처음 렌더링 된 구성 요소에 대해 `componentDidMount` 메소드를 호출하는 함수임을 알 수 있습니다.
그리고 그게 다야!
