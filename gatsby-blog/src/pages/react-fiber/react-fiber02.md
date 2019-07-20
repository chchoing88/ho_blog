---
title: React Fiber part2
date: "2019-07-19T10:00:03.284Z"
---

[이글](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)을 번역 및 분석 한 글입니다. 잘못된 번역 및 생략된 번역이 있을 수 있습니다.

# Inside Fiber: in-depth overview of the new reconciliation algorithm in React

React 는 유저인터페이스를 만들기 위한 라이브러리 이다. React 의 코어는 component 의 state 변화를 추적하고 해당 state 를 화면에 갱신해주는 것이다. 우리는 React 안에서 이러한 프로세스를 **reconciliation** 으로 알고있다.

우리가 setState 메서드를 호출하고 프레임워크가 state 또는 props 가 변했는지 체크하고 UI 에 그려진 component 를 다시 렌더링한다.

React 의 문서는 React 엘리먼트, 라이프사이클 메서드 그리고 render 메서드 그리고 children 컴포넌트에 적용된 diffing 알고리즘 역활에 대해 좋은 설명을 제공하고 있습니다. render 메서드를 통해 리턴된 immutable 한 React elements 트리들이 공통적으로 "vitual DOM" 으로 알고있다. 이 용어는 초기에 사람들에게 React 을 설명하는 데 도움이되었습니다. 하지만 그것은 혼란을 야기하기도합니다. 그리고 React 문서 어디에도 사용하지 않습니다.

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

모든 작업은 `workInProgress` 트리의 fiber 에서 수행됩니다. React 가 `current` 트리를 통과함에 따라 기존의 각 fiber 노드에 대해 `workInProgress` 트리를 구성하는 alternate 노드를 만듭니다. 이런 노드는 render 메서드에서 리턴된 React element 에서 나온 data 를 사용해서 만들게 됩니다. 업데이트가 처리되고 모든 관련 작업이 완료되면, React 는 스크린에 뿌려질 alternate 트리를 가지고 있을 것입니다. 이 `workInProgress` 트리가 render 되고나면 그것은 다시 `current` 트리가 됩니다.

React 코어의 원리중 하나는 일관성입니다. [여기참조](https://overreacted.io/ko/react-as-a-ui-runtime/). React 는 항상 한번에 DOM 을 update 합니다. 이것은 결과를 부분적으로 보여주지 않습니다. `workInProgress`트리는 사용자에게 표시되지 않는 "초안"으로 사용되며, 그래서 React 는 맨 먼저 모든 컴포넌트들을 처리한 뒤에 그것들의 변화를 스크린에 반영할 수 있습니다.

```javascript
// updateHostComponent
function updateHostComponent(current, workInProgress, renderExpirationTime) {...}
```

각 fiber 노드는 **alternate** 필드안에 다른 트리로 부터 나온 해당 fiber node 의 짝을 들고 있습니다. `current` 트리의 노드는 `workInProgress` 트리의 노드를 가리키고 그 반대의 경우도 마찬가지입니다.

### Side-effects

우리는 React 컴포넌트를 state 와 props 를 사용해서 UI 표현을 계산하는 함수라고 생각 할 수 있습니다. DOM 을 변경하거나 라이프 사이클 메소드를 호출하는 것과 같은 다른 모든 활동은 side-effect 또는 단순히 effect 로 간주되어야합니다. Effect 는 [문서](https://reactjs.org/docs/hooks-overview.html?source=post_page---------------------------#%EF%B8%8F-effect-hook)에도 언급되어 있습니다.

> 이전에 데이터 가져 오기, 구독 또는 수동으로 React 구성 요소에서 **DOM 을 변경**했을 것입니다. 우리는 이 작업들을 "side effect" 또는 짧게 "effect" 라고 불렀습니다. 왜냐하면 그것들은 다른 컴포넌트에 영향을 미칠수 있고 렌더링 동안에 수행 할 수 없기 때문입니다.

대부분의 state 및 props 업데이트가 side-effects 을 초래하는 방법을 확인할 수 있습니다. effects 를 적용하는 것이 일종의 작업의 타입이기 때문에 fiber 노드는 업데이트 외에도 효과를 추적하는 편리한 메커니즘입니다. 각 fiber 노드는 그것과 연관된 effects 를 가질 수 있습니다. 그것들을 effectTag 필드에 인코딩됩니다.

따라서 Fiber 의 effects 는 기본적으로 업데이트가 처리 된 후 인스턴스에 대해 수행해야하는 [작업](https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/shared/ReactSideEffectTags.js?source=post_page---------------------------)을 정의합니다. host component 들 (DOM 요소)의 경우 작업은 요소 추가, 업데이트 또는 제거로 구성됩니다. 클래스 컴포넌트의 경우 React 는 ref 를 업데이트하고 `componentDidMount` 및 `componentDidUpdate` 라이프 사이클 메소드를 호출해야 할 수 있습니다. 다른 유형의 fiber 들에 해당하는 다른 effects 도 있습니다.

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

#### tag

fiber 의 타입을 정의한다. 그것은 어떤 일을 해야하는지를 결정하기 위한 reconciliation 알고리즘으로 사용된다. 이전에 언급했듯이, 작업은 React element 의 타입에따라 달라집니다. 함수 [createFiberFromTypeAndProps](https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js?source=post_page---------------------------#L414) React element 를 관련된 fiber 노드 타입과 매핑시켜준다.
우리 어플리케이션 안에서 `ClickCounter` 컴포넌트의 `tag` 프로퍼티는 `1` 이다. 이것은 `ClassComponent`를 뜻하고 `span` 엘리먼트의 `5`의 경우에는 `HostComponent`를 가리킨다.

#### updateQueue

state 업데이트들, 콜백함수들과 DOM update 들의 queue.

#### memoizedState

결과를 만드는데 사용된 fiber 의 State. 업데이트 처리 할 때 현재 화면에 렌더링 된 state 를 반영합니다.

#### memoizedProps

이전 렌더링 동안 출력을 생성하는 데 사용 된 fiber 의 Props.

#### pendingProps

React element 들의 새로운 데이터로 업데이트된 Props 그리고 child components 또는 DOM elements 에 적용해야합니다.

#### key

React 가 어떤 아이템이 변경되었는지, list 에서 추가되었거나 삭제되었는지 알아챌수 있게 해주는 children 그룹에 포함된 특별한 식별자. 여기에 설명 된 React 의 "목록 및 키"기능과 관련이 있습니다.

완성된 fiber node 는 [여기](https://github.com/facebook/react/blob/6e4f7c788603dac7fccd227a4852c110b072fe16/packages/react-reconciler/src/ReactFiber.js?source=post_page---------------------------#L78)서 확인해볼수 있다. 여기서는 위의 설명에서 여러 필드를 생략했습니다.
특히, 이전 글에서 설명한 트리 데이터 구조를 구성하는 포인터인 `child`, `siblig` 그리고 `return` 을 건너 뛰었습니다. 그리고 `expiredTime`, `childExpirationTime` 및 `mode` 와 같은 카테고리는 `Sceduler`에만 해당됩니다.

## General algorithm

React 는 **렌더링**과 **커밋**의 두 가지 주요 단계로 작업을 수행합니다.

첫 번째 렌더링 단계에서 React 는 `setState` 또는 `React.render`를 통해 예약 된 구성 요소에 업데이트를 적용하고 UI 에서 업데이트해야 하는 항목을 파악합니다.

초기 렌더링 인 경우 React 는 `render` 메소드에서 반환 된 각 요소에 대해 새 fiber 노드를 만듭니다. 다음 업데이트에서는 기존 React 요소의 fiber 가 다시 사용되고 업데이트됩니다.

**단계의 결과는 side-effects 으로 표시된 fiber 노드의 트리입니다.** effects 는 다음 `커밋` 단계에서 수행해야하는 작업을 설명합니다.

이 단계에서 React 는 effects 로 표시된 fiber 트리를 가져 와서 인스턴스에 적용합니다. effects 목록을 검토하고 사용자가 볼 수있는 DOM 업데이트 및 기타 변경 사항을 수행합니다.

**첫 번째 `렌더링` 단계에서 작업을 비동기 적으로 수행 할 수 있다는 것을 이해하는 것이 중요합니다.**

React 는 사용 가능한 시간에 따라 하나 이상의 fiber 노드를 처리 할 수 있습니다. 그런 다음 작업을 숨기고 일부 이벤트에 양보합니다. 그런 다음 중단 된 부분부터 계속됩니다.

그러나 때로는 완료된 작업을 무시하고 처음부터 다시 시작해야 할 수도 있습니다. 이러한 일시 중지는 이 단계에서 수행 한 작업으로 인해 DOM 업데이트와 같은 사용자가 볼 수있는 변경 사항이 발생하지 않음으로 인해 가능합니다. **반대로 다음 커밋 단계는 항상 동기식입니다.**

이는 이 단계에서 수행 된 작업이 사용자에게 표시되는 변경 사항 (예 : DOM 업데이트.) 그렇기 때문에 React 가 단일 패스로 이를 수행해야합니다.

라이프 사이클 메소드 호출은 React 가 수행하는 작업의 한 유형입니다.
일부 메서드는 `렌더링` 단계에서 호출되고 다른 메서드는 `커밋` 단계에서 호출됩니다. 첫 번째 `렌더링` 단계를 수행 할 때 호출되는 라이프 사이클 목록은 다음과 같습니다.

* [UNSAFE_]componentWillMount (deprecated)
* [UNSAFE_]componentWillReceiveProps (deprecated)
* getDerivedStateFromProps
* shouldComponentUpdate
* [UNSAFE_]componentWillUpdate (deprecated)
* render

보는 것과 같이 `렌더링` 단계에서 실행되는 일부 몇몇 레거시 라이프 사이클 메서드는 버젼 16.3 에서 `UNSAFE`라고 표시됩니다. 그것들은 문서에서 레거시 라이프 사이클이라고 불리워집니다. 그것들은 미래에 16.x 에서 지원이 중단되며 UNSAFE 접두사가 없는 해당 항목은 17.0 에서 제거됩니다. 이 변경 사항과 제안 된 마이그레이션 경로에 대한 자세한 내용은 [여기](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html?source=post_page---------------------------)를 참조하십시오.

이 이유가 궁금 하신가요?

`렌더링` 단계에서는 DOM 업데이트와 같은 부작용이 발생하지 않으므로 React 는 구성 요소를 비동기 적으로 업데이트를 처리 할 수 ​​ 있음을 알았습니다. (잠재적으로 여러 스레드에서 업데이트를 처리 할 수도 있습니다.) 그러나 UNSAFE 로 표시된 라이프 사이클은 종종 오해되고 미묘하게 오용되었습니다. 개발자는 새로운 비동기 렌더링 방식에 문제를 일으킬 수있는 부작용이있는 코드를 이러한 메서드에 넣는 경향이있었습니다. UNSAFE 접두사가 없는 항목만 제거되지만 곧 나오는 동시 모드 (선택 해제 할 수 있음)에 여전히 문제가 발생할 수 있습니다.

두 번째 커밋 단계에서 실행 된 라이프 사이클 메소드 목록은 다음과 같습니다.

* getSnapshotBeforeUpdate
* componentDidMount
* componentDidUpdate
* componentWillUnmount

이러한 메소드는 동기적인 `커밋` 단계에서 실행되기 때문에 부작용이 포함되어 DOM 에 접할 수 있습니다.
자 이제 우리는 tree 를 탐색하고 작업을 수행하는 데 사용되는 일반화 된 알고리즘을 살펴볼 배경을 가지고 있습니다.

## Render phase

reconciliation 알고리즘은 항상 [renderRoot](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L1132) 함수를 사용하여 최상위 `HostRoot` 파이버 노드에서 시작합니다. 그러나, React 는 완료되지 않은 작업이있는 노드를 찾을 때까지 이미 처리 된 fiber 노드에서 벗어납니다 (건너 뜁니다). 예를 들어, 컴퍼넌트 트리의 `setState` 를 깊게 들어가있는 component 에서 호출하면, React 는 위에서부터 시작 합니다만, `setState` 메소드를 호출 한 컴퍼넌트에 도착할 때까지, 부모를 신속하게 스킵합니다.

### Main steps of the work loop

모든 fiber 노드는 [작업 루프](https://github.com/facebook/react/blob/f765f022534958bcf49120bf23bc1aa665e8f651/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L1136)에서 처리됩니다. 다음은 루프의 동기 부분 구현입니다.

```javascript
function workLoop(isYieldy) {
  if (!isYieldy) {
    while (nextUnitOfWork !== null) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
  } else {...}
}
```

위의 코드에서 `nextUnitOfWork`는 할 일이 있는 `workInProgress` 트리에서 fiber 노드에 대한 참조를 보유합니다. React 가 Fibers 트리를 탐색하면서 이 변수를 사용하여 완료되지 않은 다른 fiber 노드가 있는지를 확인합니다. 현재 fiber 처리 된 후 변수는 트리의 다음 fiber 노드에 대한 참조 또는 null 을 포함합니다. 이 경우 React 는 작업 루프를 종료하고 변경 사항을 커밋 할 준비가 됩니다.

트리를 탐색하고 작업을 시작하거나 완료하는 데 사용되는 4 가지 주요 기능이 있습니다.

* [performUnitOfWork](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L1056)
* [beginWork](https://github.com/facebook/react/blob/cbbc2b6c4d0d8519145560bd8183ecde55168b12/packages/react-reconciler/src/ReactFiberBeginWork.js?source=post_page---------------------------#L1489)
* [completeUnitOfWork](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L879)
* [completeWork](https://github.com/facebook/react/blob/cbbc2b6c4d0d8519145560bd8183ecde55168b12/packages/react-reconciler/src/ReactFiberCompleteWork.js?source=post_page---------------------------#L532)

그들이 어떻게 사용되는지를 보여주기 위해 다음과 같은 fiber 트리 탐색 애니메이션을 살펴보십시오. 데모 용으로 이러한 함수의 단순화 된 구현을 사용했습니다. 각 기능은 fiber 노드를 처리하고 React 가 트리 아래로 가면서 현재 활성화 된 fiber 노드가 변경된 것을 볼 수 있습니다. 비디오에서 알고리즘이 한 브랜치에서 다른 브랜치로 어떻게 이동하는지 명확하게 볼 수 있습니다. parents 에 가기 전에 먼저 children 위한 일을 마친다.

![fiber Traversiong](./FiberTraversing.gif)

> 곧은 수직 연결은 sibling 를 의미하는 반면 구부러진 연결은 children 를 나타냅니다. b1 에는 자식이없고 b2 에는 자식 c1 이 하나 있습니다.

다음은 재생을 일시 중지하고 현재 노드와 기능 상태를 검사 할 수있는 비디오에 대한 [링크](https://vimeo.com/302222454?source=post_page---------------------------)입니다. 개념적으로, 당신은 "시작"을 구성 요소로 "들어가는 것"으로, "완료"는 "단계적으로"수행하는 것으로 생각할 수 있습니다. 이 함수들이하는 일을 설명하면서 [예제](https://stackblitz.com/edit/js-ntqfil?file=index.js&source=post_page---------------------------)와 구현을 가지고 놀 수도 있습니다.

`performUnitOfWork`와 `beginWork`의 처음 두 함수를 살펴 보겠습니다.

```javascript
function performUnitOfWork(workInProgress) {
  // children에 대한 포인터 또는 null
  let next = beginWork(workInProgress)
  if (next === null) {
    next = completeUnitOfWork(workInProgress)
  }
  return next
}

function beginWork(workInProgress) {
  console.log('work performed for ' + workInProgress.name)
  return workInProgress.child
}
```

`performUnitOfWork` 함수는 `workInProgress` 트리에서 fiber 노드를 받고 `beginWork` 함수를 호출하여 작업을 시작합니다. 이 기능은 fiber 대해 수행해야하는 모든 작업을 시작하는 기능입니다. 이 증명을 위해, 우리는 단순히 작업이 완료되었음을 나타내기 위해 fiber 의 이름을 기록합니다. **`beginWork` 함수는 항상 루프에서 처리 할 다음 children 에 대한 포인터 또는 null 을 반환합니다.**

다음 자식이 있으면 `workLoop` 함수의 `nextUnitOfWork` 변수에 할당됩니다. 그러나 자식이 없으면 React 는 분기의 끝에 도달 했으므로 현재 노드를 완료 할 수 있음을 알게됩니다. **노드가 완성되면 siblings 를 위한 작업을 수행 한 후 그 부모에게 역 추적해야합니다.** 이 작업은 `completeUnitOfWork` 함수에서 수행됩니다.

```javascript
function completeUnitOfWork(workInProgress) {
  while (true) {
    let returnFiber = workInProgress.return
    let siblingFiber = workInProgress.sibling

    nextUnitOfWork = completeWork(workInProgress)

    if (siblingFiber !== null) {
      // If there is a sibling, return it
      // to perform work for this sibling
      return siblingFiber
    } else if (returnFiber !== null) {
      // If there's no more work in this returnFiber,
      // continue the loop to complete the parent.
      workInProgress = returnFiber
      continue
    } else {
      // We've reached the root.
      return null
    }
  }
}

function completeWork(workInProgress) {
  console.log('work completed for ' + workInProgress.name)
  return null
}
```

함수의 요지가 커다란 `while`루프 라는 것을 알 수 있습니다. React 는 `workInProgress` 노드에 children 이 없을 때 이 함수(`completeUnitOfWork`)로 들어갑니다. 현재 fiber 에 대한 작업을 마친 후 sibling 가 있는지 확인합니다. 발견되면 React 가 함수를 종료하고 형제에게 포인터를 반환합니다. `nextUnitOfWork` 변수에 할당되고 React 가 이 sibling 로 시작하는 분기에 대한 작업을 수행합니다. 이 시점에서 React 는 이전 siblings 를 위한 작업만 완료했다는 것을 이해하는 것이 중요합니다. 상위 노드에 대한 작업을 완료하지 않았습니다. **자식 노드로 시작하는 모든 분기가 완료되면 부모 노드와 백 트랙에 대한 작업이 완료됩니다.**

구현에서 볼 수 있듯이 `performUnitOfWork` 와 `completeUnitOfWork` 는 모두 반복 작업을 위해 주로 사용되는 반면, 주요 작업은 `beginWork` 및 `completeWork` 함수에서 수행됩니다. 이 시리즈의 다음 기사에서는 `ClickCounter` component 및 `span` 노드에 대해 React 가 `beginWork` 및 `completeWork` 함수 에 수행되는 것에 대해 알아 봅니다.

## Commit phase

이 단계는 [completeRoot](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L2306) 함수로 시작합니다. 여기서 React 는 DOM 을 업데이트하고 사전 및 사후 mutation 라이프 사이클 메소드를 호출합니다.

React 가 이 단계에 이르면 2 개의 tree 와 effects list 가 있습니다. 첫 번째 tree 는 현재 화면에 렌더링 된 상태를 나타냅니다. 그런 다음 `렌더링` 단계 동안 만들어진 `alternate` 트리가 있습니다. 소스에서 `finishedWork` 또는 `workInProgress` 라고하며 화면에 반영되어야하는 상태를 나타냅니다. 이 `alternate` 트리는 `child` 및 `sibling` 포인터를 통해 current 트리와 비슷하게 연결됩니다.

그런 다음 effects list - `nextEffect` 포인터를 통해 연결된 `finishedWork` 트리의 노드 하위 집합입니다. effects list 은 `렌더링 단계(render phase)`를 실행 한 결과임을 기억하십시오. 전체 렌더링의 포인트는 삽입, 업데이트 또는 삭제해야 할 노드와 호출되는 라이프 사이클 메소드가 필요한 components 를 결정하는 것이 었습니다. 이것이 effects list 에서 우리에게 알려줍니다. **그리고 그것은 정확히 커밋 단계에서 반복되는 노드 집합입니다.**

> 디버깅을 위해 `current` 트리는 fiber 루트의 `current` 속성을 통해 액세스 할 수 있습니다. `finishedWork` 트리는 `current` 트리의 `HostFiber` 노드의 `alternate` 프로퍼티를 통해 엑세스 할 수 있습니다.

커밋 단계에서 실행되는 주요 기능은 `commitRoot`입니다. 기본적으로 다음과 같은 작업을 수행합니다.

* `Snapshot` effect 태그가 지정된 노드에서 `getSnapshotBeforeUpdate` 라이프 사이클 메소드를 호출합니다.
* `Deletion` effect 태그가 지정된 노드에서 `componentWillUnmount` 라이프 사이클 메소드를 호출합니다.
* 모든 DOM 삽입, 업데이트 및 삭제를 수행합니다.
* 완성 된 `작업 트리(finishedWork)`를 현재로 설정합니다.
* `Placement` effect 태그가 지정된 노드에서 `componentDidMount` 라이프 사이클 메소드 호출
* `Update` effect 태그가 지정된 노드에서 `componentDidUpdate` 라이프 사이클 메서드를 호출합니다.

pre-mutation 메소드인 `getSnapshotBeforeUpdate` 를 호출 한 후, React 는 트리 내의 모든 side-effects 커밋합니다. 두 번에 걸쳐 그것을 합니다. 첫 번째 단계는 모든 DOM (host) 삽입, 업데이트, 삭제 및 참조 해제를 수행합니다.
그런 다음 React 는 `finishedWork` 트리를 `workInProgress` 트리를 `current` 트리로 표시하는 `FiberRoot` 에 지정합니다.

이 작업은 커밋 단계의 첫 번째 단계 이후에 수행되며, 따라서 이전 트리는 `componentWillUnmount` 중에는 current 이지만 두 번째 단계 이전에는 finished work 는 `componentDidMount / Update` 동안 current 상태가 됩니다.
두 번째 단계에서는 React 가 다른 모든 라이프 사이클 메소드 및 ref 콜백을 호출합니다. 이러한 메소드는 별도의 단계로 실행되므로 전체 트리에서 모든 배치, 업데이트 및 삭제는 이미 호출되었습니다.

위에서 설명한 단계를 실행하는 함수의 요지는 다음과 같습니다.

```javascript
function commitRoot(root, finishedWork) {
  commitBeforeMutationLifecycles()
  commitAllHostEffects()
  root.current = finishedWork
  commitAllLifeCycles()
}
```

각 하위 함수는 effects list 을 반복하고 effect 의 type 을 확인하는 루프를 구현합니다. 함수의 목적과 관련된 효과를 발견하면 그것을 적용합니다.

## Pre-mutation lifecycle methods

예를 들어, effects tree 를 반복하고 노드에 `Snapshot effect`가 있는지 확인하는 코드는 다음과 같습니다.

```javascript
function commitBeforeMutationLifecycles() {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag
    if (effectTag & Snapshot) {
      const current = nextEffect.alternate
      commitBeforeMutationLifeCycles(current, nextEffect)
    }
    nextEffect = nextEffect.nextEffect
  }
}
```

클래스 구성 요소의 경우이 effect 는 `getSnapshotBeforeUpdate` 라이프 사이클 메소드를 호출하는 것을 의미합니다.

## DOM updates

[commitAllHostEffects](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L376) 는 React 가 DOM 업데이트를 수행하는 함수입니다. 이 함수는 기본적으로 노드에 대해 수행해야하는 작업 유형을 정의하고 실행합니다.

```javascript
function commitAllHostEffects() {
    switch (primaryEffectTag) {
        case Placement: {
            commitPlacement(nextEffect);
            ...
        }
        case PlacementAndUpdate: {
            commitPlacement(nextEffect);
            commitWork(current, nextEffect);
            ...
        }
        case Update: {
            commitWork(current, nextEffect);
            ...
        }
        case Deletion: {
            commitDeletion(nextEffect);
            ...
        }
    }
}
```

React 가 `commitDeletion` 함수에서 삭제 프로세스의 일부로 `componentWillUnmount` 메소드를 호출한다는 것은 흥미롭습니다.

## Post-mutation lifecycle methods

[commitAllLifecycles](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L465) 는 React 가 나머지 모든 라이프 사이클 메소드 인 `componentDidUpdate` 및 `componentDidMount` 를 호출하는 함수입니다.
