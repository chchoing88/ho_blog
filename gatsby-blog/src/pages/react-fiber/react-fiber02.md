---
title: React Fiber (작성중..)
date: "2019-07-19T10:00:03.284Z"
---

[이글](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)을 번역 및 분석 한 글입니다. 잘못된 번역 및 생략된 번역이 있을 수 있습니다.

# Inside Fiber: in-depth overview of the new reconciliation algorithm in React

React 는 유저인터페이스를 만들기 위한 라이브러리 이다. React 의 코어는 component 의 state 변화를 추적하고 해당 state 를 화면에 갱신해주는 것이다. 우리는 React 안에서 이러한 프로세스를 **reconciliation** 으로 알고있다.

우리가 setState 메서드를 호출하고 프레임워크가 state 또는 props 가 변했는지 체크하고 UI 에 그려진 component 를 다시 렌더링한다.

React 의 문서에는 이 메커니즘의 좋은 설명을 제공하고있다. React 엘리먼트의 역할, 라이프사이클 메서드 그리고 render 메서드 그리고 children 컴포넌트에 적용된 diffing 알고리즘을 설명하고 있다. render 메서드를 통해 리턴된 immutable 한 React elements 트리들이 공통적으로 "vitual DOM" 으로 알고있다. 이 용어는 초기에 사람들에게 React 을 설명하는 데 도움이되었습니다.

하지만 그것은 혼란을 야기하기도합니다. 그리고 React 문서 어디에도 사용하지 않습니다.

이 글에서는 "vitual DOM"을 React element 들의 트리 라고 부르겠습니다.

게다가 React element 들의 트리, 프레임워크에서는 state 를 유지하는 용도로 항상 내부 instance 들의 트리를 가지고 있습니다.(components, DOM nodes, 기타등등..)
16 버전부터는 React 가 내부 인스턴스 트리와 Fiber 라는 코드 이름을 관리하는 알고리즘을 새로운 구현 했습니다.

## Setting the background

여기 아주 간단한 어플리케이션이 있습니다. 이것을 이 시리즈에서 계속 사용할 예정입니다. 간단하게 숫자를 증가시키는 button 하나가 있습니다.

![button-example01.gif](./button-example01.gif)

그리고 여기 구현이 있다.

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

[여기서](https://stackblitz.com/edit/react-t4rdmh?source=post_page---------------------------) 동작해볼 수 있다. 보는것과 같이 아주 2 개의 render 메서드에서 button 과 span child element 를 반환하는 간단한 컴포넌트이다.
button 을 클릭하자마자 component 의 state 는 내부 handler 에 의해 업데이트가 된다. 그 결과로 text 가 span element 에 업데이트가 된다.

React 는 reconciliation 동안 다양한 수행을 한다. 예를 들면 첫 렌더링 과 state 가 update 동안 높은 수준의 React 수행 작업이 있다.

* ClickCounter 의 state 안 있는 count 프로퍼티가 업데이트가 된다.
* ClickCounter 의 children 과 그것들의 props 들을 비교, 탐색한다.
* span element 위해 props 를 update 한다.

여기서 reconciliation 동안 다른 수행들은 다음과 같이 부른다. 라이프 사이클 메서드 또는 refs 의 update.
이런 모든 작업들은 Fiber 아키텍쳐에서 일괄적으로 "work" 라고 부른다. 이런 work 타입은 대게 React element 의 타입과 관계가 있다. 예를 들면 class component 는 React 가 instance 를 만들게 해주어야 한다. 반면에 함수 컴포넌트 들의 경우에는 그렇지 않아도 된다. 알다싶이 React 안에는 여러 종류의 element 들이 있다. 예를 들어, class 컴포넌트 , 함수 컴포넌트, host 컴포넌트 (DOM nodes) , 포탈 등등. 이런 React 타입은 createElement 함수의 첫번째 매개변수에 의해 정의도니다.
이 함수는 render 메서드안에서 element 를 생성하기 위해 사용된다.

활동의 탐구와 주요 fiber 알고리즘을 탐구하기 전에 먼저 React 에서 내부적으로 사용하는 데이터 구조에 익숙해 지도록합시다.

## From React Elements to Fiber nodes

React 의 모든 컴포넌트들은 우리가 render 메서드에서 리턴되는 view 라고 불리우거나 또는 템플릿이라고 UI 표현을 가지고 있습니다. 여기 우리의 ClickCounter 컴포넌트를 위한 템플릿이 있습니다.

```html
<button key="1" onClick={this.onClick}>Update counter</button>
<span key="2">{this.state.count}</span>
```

### React Elements

오직 템플릿은 JSX 컴파일러를 통해 거치면 React element 들이 잔뜩 생깁니다. 이것은 React 컴포넌트의 render 메서드에서 리턴되는 것으로 HTML 이 아닙니다. 우리는 JSX 를 사용하지 않을거라서 ClickCounter 컴포넌트의 render 메서드는 다음과 같이 작성될 수 있을 것입니다.

```javascript
class ClickCounter {
    ...
    render() {
        return [
            React.createElement(
                'button',
                {
                    key: '1',
                    onClick: this.onClick
                },
                'Update counter'
            ),
            React.createElement(
                'span',
                {
                    key: '2'
                },
                this.state.count
            )
        ]
    }
}
```

render 메서드 안에서 React.createElement 를 호출하는 것은 2 개의 데이터 구조를 생성할 것입니다.

```javascript
[
    {
        $$typeof: Symbol(react.element),
        type: 'button',
        key: "1",
        props: {
            children: 'Update counter',
            onClick: () => { ... }
        }
    },
    {
        $$typeof: Symbol(react.element),
        type: 'span',
        key: "2",
        props: {
            children: 0
        }
    }
]
```

여기서 $$typeof 의 프로퍼티를 React 가 추가해서 React elements 요소로 고유하게 식별됨을 알 수 있습니다.
그리고 나서 element 의 설명인 type, key 그리고 props 를 가지고 있습니다. 이 값들은 React.createElement 에 전달되는 값입니다. 주의할점은 어떻게 React 가 text 컨텐츠를 span 과 button 의 children 에 표현하는가 입니다. 그리고 어떻게 click handler 가 button element prosp 의 한 부분이 되었는가 입니다. React element 의 ref 같은 다른 필드들은 이 글에서 벗어나는 것들입니다.

ClickCounter 를 위한 React element 는 어떤 props 나 key 를 가지고 있지 않습니다.

```javascript
{
    $$typeof: Symbol(react.element),
    key: null,
    props: {},
    ref: null,
    type: ClickCounter
}
```

### Fiber nodes

모든 render 메서드에서 리턴된 React element 들로 부터 나온 data 를 reconciliation 하는 동안에 fiber node 들의 트리들이 합쳐지게 된다. 그래서 모든 React element 들은 fiber node 를 지니게 된다. React element 들과 다르게, fibers 은 매 render 마다 재 생성되지 않는다. 이것은 변할 수 있는 components 와 DOM 을 가지고 있는 data 구조이다.

우리는 이전에 React element 타입이 프레임워크의 다른 수행을 요한다고 했었다. 우리의 샘플 어플리케이션에서 ClickCounter 클래스 컴포넌트는 라이프 사이클 메서드 과 render 메서드를 호출한다. 반면에 span host 컴포넌트(DOM node)는 DOM 변화만 수행하게 된다. 그래서 각 React element 는 해당 타입에 맞게 Fiber node 로 변하게 된다. 이것은 완료해야 할 작업을 설명하게 됩니다.

**Fiber 를 몇몇 해야하는 작업의 데이터 구조 다른말로 하면 작업의 단위로 생각할 수 있다. Fiber 의 아키텍쳐 또한 작업을 추적, 스케쥴, 일지정지, 중단 할수 있는 편리한 방법을 제공합니다.**

첫 타임에 React element 가 fiber node 로 변화할때, React 는 element 부터 나온 data 를 [createFiberFromTypeAndProps](https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js?source=post_page---------------------------#L414) 에서 사용해서 fiber 를 생성하게 된다.

순서대로 React 가 업데이트 진행중일때 fiber node 를 재사용하고 단지 관련있는 React element 로 부터 데이터를 사용해서 필요한 프로퍼티들만 업데이트 한다.
React 는 또한 node 를 key props 를 기반으로 계층안에서 움직이거나 만약 관련 React element 가 render 메서드를 통해 더이상 리턴되지 않는다면 node 를 삭제할 필요가 있을것이다.

> [ChildReconciler](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactChildFiber.js?source=post_page---------------------------#L239) 함수를 통해서 모든 활성화된 모든 리스트들과 React 동작을 위한 fiber nodes 들에 관련한 함수들을 확인할 수 있습니다.

React 는 각 element 에 대한 fiber 를 생성하고 그들의 elements 의 트리를 가지고 있기 때문에 우리는 fiber nodes 트리를 가질 수 있습니다. 우리 샘플 케이스의 경우에는 다음과 같이 표현할 수 있습니다.

![fiber tree](./fiberNode01.png)

모든 fiber 노드들은 linked list 로 연결이 되어있습니다. fiber node 에 child, sibling 그리고 return 이라는 프로퍼티를 사용해서 연결이 되어있습니다.
왜 이런 방식으로 작업이 되었는지 좀 더 설명을 원한다면 다음 글을 먼저 읽어 보십시요 [The how and why on React’s usage of linked list in Fiber](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7?source=post_page---------------------------)

### Current and work in progress trees

첫번째 렌더링 아후에 React 는 UI 렌더링에 필요한 어플리케이션의 state 를 반영한 fiber 트리를 갖게 된다. 이 트리는 대게 **current**라고 불리운다. ( 한번 그려진 녀석들을 반영한 트리를 current 라고 함 ). React 가 current 를 tree 를 update 시작하면 그것은 **workInProgress** 트리 라고 불리운다. 이것은 스크린에 뿌려지게 될 미래의 state 를 반영합니다.

모든 작업은 workInProgress 트리의 fiber 에서 수행됩니다. React 가 `current` 트리를 통과함에 따라 기존의 각 파이버 노드에 대해 workInProgress 트리를 구성하는 대체 노드를 만듭니다. 이런 노드는 render 메서드에서 리턴된 React element 에서 나온 data 를 사용해서 만들게 됩니다. 업데이트가 처리되고 모든 관련 작업이 완료되면, React 는 스크린에 뿌려질 대체 트리를 가지고 있을 것입니다. 이 `workInProgress` 트리가 render 되고나면 그것은 다시 `current` 트리가 됩니다.

React 코어의 원리중 하나는 일관성입니다. [여기참조](https://overreacted.io/ko/react-as-a-ui-runtime/). React 는 항상 한번에 DOM 을 update 합니다. 이것은 결과를 부분적으로 보여주지 않습니다. `workInProgress`트리는 사용자에게 표시되지 않는 "초안"으로 사용되며, 그래서 React 는 맨 먼저 모든 컴포넌트들을 처리한 뒤에 그것들의 변화를 스크린에 반영할 수 있습니다.

```javascript
// updateHostComponent
function updateHostComponent(current, workInProgress, renderExpirationTime) {...}
```

각 fiber 노드는 **alternate** 필드안에 다른 트리로 부터 나온 해당 fiber node 의 짝을 들고 있습니다. `current` 트리의 노드는 `workInProgress` 트리의 노드를 가리키고 그 반대의 경우도 마찬가지입니다.

### Side-effects

우리는 React 컴포넌트를 state 와 props 를 사용해서 UI 표현을 계산하는 함수라고 생각 할 수 있습니다. DOM 을 변경하거나 라이프 사이클 메소드를 호출하는 것과 같은 다른 모든 활동은 side-effect 또는 단순히 effect 로 간주되어야합니다. Effect 는 [문서](https://reactjs.org/docs/hooks-overview.html?source=post_page---------------------------#%EF%B8%8F-effect-hook)에도 언급되어 있습니다.

> 이전에 데이터 가져 오기, 구독 또는 수동으로 React 구성 요소에서 DOM 을 변경했을 것입니다. 우리는 이 작업들을 "side effect" 또는 짧게 "effect" 라고 불렀습니다. 왜냐하면 그것들은 다른 컴포넌트에 영향을 미칠수 있고 렌더링 동안에 수행 할 수 없기 때문입니다.

대부분의 state 및 props 업데이트가 side-effects 을 초래하는 방법을 확인할 수 있습니다. effects 를 적용하는 것이 일종의 작업의 타입이기 때문에 fiber 노드는 업데이트 외에도 효과를 추적하는 편리한 메커니즘입니다. 각 fiber 노드는 그것과 연관된 effect 를 가질 수 있습니다. fiber 노드들은 effectTag 필드에 인코딩됩니다.

따라서 Fiber 의 effects 는 기본적으로 업데이트가 처리 된 후 인스턴스에 대해 수행해야하는 작업을 정의합니다. host component 들 (DOM 요소)의 경우 작업은 요소 추가, 업데이트 또는 제거로 구성됩니다. 클래스 컴포넌트의 경우 React 는 ref 를 업데이트하고 `componentDidMount` 및 `componentDidUpdate` 라이프 사이클 메소드를 호출해야 할 수 있습니다. 다른 유형의 fiber 들에 해당하는 다른 effects 도 있습니다.

### Effects list

React 프로세스는 업데이트를 신속하게 처리하고 몇 가지 흥미로운 기술을 사용하여 그 수준의 성능을 달성합니다. **그 중 하나는 신속한 반복을 위해 효과가있는 fiber 노드의 선형 목록을 작성하는 것입니다.** 선형 목록 반복은 트리보다 훨씬 빠르며 side-effects 없는 노드에 시간을 할애 할 필요가 없습니다.

이 리스트의 목표는 DOM 업데이트 또는 이와 관련된 다른 effects 가있는 노드를 표시하는 것입니다. 이 목록은 `finishedWork` 트리의 하위 집합이며 `current` 및 `workInProgress` 트리에서 사용되는 `child` 속성 대신 `nextEffect` 속성을 사용하여 연결됩니다.

Dan Abramov 는 effects list 에 대한 비유를 제시했습니다. 그는 크리스마스 트리에 모든 effectful 한 노드를 묶어놓은 "크리스마스 불빛"이 감겨져있는 것으로 생각하는 것을 좋아합니다. 이것을 시각화하기 위해 강조 표시된 노드가 할 일이있는 다음과 같은 fiber 노드 트리를 상상해 봅시다. 예를 들어, 업데이트로 인해 `c2`가 DOM 에 삽입되고, `d2`와 `c1`은 속성을 변경하고, `b2`는 라이프 사이클 메소드를 실행합니다. 이 effect list 는 React 가 나중에 다른 노드를 건너 뛸 수 있도록 그들을 연결합니다 :

![updateFiberTree](./updateFiberTree.png)

여기서 effects 를 가진 노드들이 어떻게 연결되어있는지 볼수 있다. 이런 노드들을 탐색할때 React 는 어디서 list 의 시작인지 알기 위해서 `firstEffect` 포인터를 사용합니다.
그래서 위 다이어그램은 아래처럼 선형 리스트로 표현될 수 있습니다.

![effectList](./effectList.png)

보시다시피 React 는 children 부터 parents 까지 순서대로 효과를 적용합니다.

### Root of the fiber tree

모든 React 애플리케이션에는 컨테이너 역할을 하는 하나 또는 이상의 DOM 요소가 있습니다. 여기서는 ID 가 `container`인 div 가 이 경우에 해당됩니다.

```javascript
const domContainer = document.querySelector('#container')
ReactDOM.render(React.createElement(ClickCounter), domContainer)
```

React 는 각 컨테이너들에 대한 [fiber root](https://github.com/facebook/react/blob/0dc0ddc1ef5f90fe48b58f1a1ba753757961fc74/packages/react-reconciler/src/ReactFiberRoot.js?source=post_page---------------------------#L31) 객체를 만듭니다. DOM 요소에 대한 참조를 사용하여 액세스 할 수 있습니다.

여기서 `fiber root`는 아마 `domContainer(ID #container)`를 가리키는 fiber 일 것이다.

```javascript
// DOM 레퍼런스에 접근해서 fiberRoot에 접근 할 수있다.
const fiberRoot = query('#container')._reactRootContainer._internalRoot
```

이 fiber root 는 React 가 fiber tree 에 대한 참조를 보유하고있는 곳입니다. 그 fiber tree 참조 값은 fiber root 의 `current` 속성에 저장됩니다 :
여기서 `HostRoot`는 `ClickCounter` 가 될것이다.

```javascript
const hostRootFiberNode = fiberRoot.current
```

fiber 트리는 HostRoot 인 [특별한 타입](https://github.com/facebook/react/blob/cbbc2b6c4d0d8519145560bd8183ecde55168b12/packages/shared/ReactWorkTags.js?source=post_page---------------------------#L34)의 fiber 노드로 시작합니다. 그것은 내부적으로 생성이 되고 가장 최상위 컴포넌트의 부모 역할을 합니다.
이것은 `HostRoot`에서 `stateNode` 속성을 통해 `FiberRoot`로 연결되는 링크가 있습니다.

```javascript
// fiberRoot.current === hostRootFiberNode
// hostRootFiberNode.stateNode === fiberRoot
fiberRoot.current.stateNode === fiberRoot // true
```

fiber root 를 통해 최상위 `HostRoot` fiber 노드에 액세스하여 fiber 트리를 탐색 할 수 있습니다. 또는 다음과 같이 구성 요소 인스턴스에서 개별 fiber 노드를 가져올 수 있습니다.

```javascript
// 컴포넌트 인스턴스에서 fiber node를 가져올 수 있다.
compInstance._reactInternalFiber
```

### Fiber node structure

rmfjgekaus `ClickCounter` 컴포넌트에서 생성된 fiber nodes 의 구조를 살펴보자.

```javascript
{
    stateNode: new ClickCounter,
    type: ClickCounter,
    alternate: null,
    key: null,
    updateQueue: null,
    memoizedState: {count: 0},
    pendingProps: {},
    memoizedProps: {},
    tag: 1,
    effectTag: 0,
    nextEffect: null
}
```

그리고 `span` DOM element :

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    alternate: null,
    key: "2",
    updateQueue: null,
    memoizedState: null,
    pendingProps: {children: 0},
    memoizedProps: {children: 0},
    tag: 5,
    effectTag: 0,
    nextEffect: null
}
```

fiber node 에 꽤 많은 필드들이 있습니다. 여기서 이전 섹션에서 봤던 필드 `alternate`, `effetTag` 그리고 `nextEffect`s 의 목적을 설명했었다. 그렇다면 나머지들은 왜 이것들이 필요한지 보자.

#### stateNode

컴포넌트의 클래스 인스턴스 DOM 노드 또는 fiber node 와 관련된 다른 React element 타입의 참조값을 지니고 있다.
일반적으로 이 프로퍼티는 fiber 와 관련된 local state 를 유지하는데 사용된다고 말할 수 있습니다.

#### type

이 fiber 와 관련된 함수나 클래스를 정의한다. 클래스 컴포넌트들의 경우 type 은 생성자 함수를 가리키고 DOM element 들의 경우에는 특별한 HTML 태그를 가리킨다. 이 필드는 fiber 노드가 어떤 엘리먼트와 관련있는지 이해하는데 종종 사용된다.
