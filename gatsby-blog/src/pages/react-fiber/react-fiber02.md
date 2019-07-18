---
title: React Fiber (작성중..)
date: "2019-07-19T10:00:03.284Z"
---

[이글](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)을 번역 및 분석 한 글입니다. 잘못된 번역 및 생략된 번역이 있을 수 있습니다.

## Inside Fiber: in-depth overview of the new reconciliation algorithm in React

React 는 유저인터페이스를 만들기 위한 라이브러리 이다. React 의 코어는 component 의 state 변화를 추적하고 해당 state 를 화면에 갱신해주는 것이다. 우리는 React 안에서 이러한 프로세스를 **reconciliation** 으로 알고있다.

우리가 setState 메서드를 호출하고 프레임워크가 state 또는 props 가 변했는지 체크하고 UI 에 그려진 component 를 다시 렌더링한다.

React 의 문서에는 이 메커니즘의 좋은 설명을 제공하고있다. React 엘리먼트의 역할, 라이프사이클 메서드 그리고 render 메서드 그리고 children 컴포넌트에 적용된 diffing 알고리즘을 설명하고 있다. render 메서드를 통해 리턴된 immutable 한 React elements 트리들이 공통적으로 "vitual DOM" 으로 알고있다. 이 용어는 초기에 사람들에게 React 을 설명하는 데 도움이되었습니다.

하지만 그것은 혼란을 야기하기도합니다. 그리고 React 문서 어디에도 사용하지 않습니다.

이 글에서는 "vitual DOM"을 React element 들의 트리 라고 부르겠습니다.

게다가 React element 들의 트리, 프레임워크에서는 state 를 유지하는 용도로 항상 내부 instance 들의 트리를 가지고 있습니다.(components, DOM nodes, 기타등등..)
16 버전부터는 React 가 내부 인스턴스 트리와 Fiber 라는 코드 이름을 관리하는 알고리즘을 새로운 구현 했습니다.

### Setting the background

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

### From React Elements to Fiber nodes

React 의 모든 컴포넌트들은 우리가 render 메서드에서 리턴되는 view 라고 불리우거나 또는 템플릿이라고 UI 표현을 가지고 있습니다. 여기 우리의 ClickCounter 컴포넌트를 위한 템플릿이 있습니다.

```html
<button key="1" onClick={this.onClick}>Update counter</button>
<span key="2">{this.state.count}</span>
```

#### React Elements

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
