---
title: build-react
date: "2018-06-03T10:00:03.284Z"
---

이 글은 아래 링크에 있는 글을 참조 했습니다.
[참조](https://engineering.hexacta.com/didact-learning-how-react-works-by-building-it-from-scratch-51007984e5c5)

## Rendering DOM element

우리가 render 할 때 필요한게 뭔지 설명하는 plain JS object 를 하나 만들 것이다.
이것을 우리는 element 라고 부를 것이다. 여기서는 `type` 과 `props`라는 2 개의 프로퍼티가 요구된다.
`type`은 기본 string 또는 function 이 될 수 있고, props 는 비어있을 수 있는 객체가 될것이다. null 은 오지 않는다. 여기서 props 는 children 이라는 프로퍼티도 가질 것이다. children 은 배열로 구성될 것이다.

예를 들면 아래와 같다.

```js
const element = {
  type: 'div',
  props: {
    id: 'container',
    children: [
      { type: 'input', props: { value: 'foo', type: 'text' } },
      { type: 'a', props: { href: '/bar' } },
      { type: 'span', props: {} },
    ],
  },
}
```

위 객체는 아래 dom 을 설명하는 것이 된다.

```html
<div id="container">
  <input value="foo" type="text">
  <a href="/bar"></a>
  <span></span>
</div>
```

보통 element 를 위 처럼 만들지 않고 `createElement`를 사용해서 만들기에 우리도 하나 만들어 볼 것이다.
그러기 전에 해당 element 를 받았을때 실제 dom 에 render 하는 함수를 만들어 보자.

```js
function render(element, parentDom) {
  const { type, props } = element
  const dom = document.createElement(type)
  const childElement = props.children || []

  childElement.forEach(childElement => render(childElement, dom))
  parentDom.appendChild(dom)
}

render(element, document.getElementById('root'))
```

위에서 빠뜨린 부분이 있다면 프로퍼티들과 이벤트 리스너이다. 빠뜨린 부분들을 다시 작성해 보자.

```js
function render(element, parentDom) {
  const { type, props } = element
  const dom = document.createElement(type)

  // start
  const isListener = name => name.startWith('on')
  Object.keys(props)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, props[name])
    })

  const isAttribute = name => !isListener(name) && name != 'children'
  Object.keys(props)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = props[name]
    })

  // end

  const childElement = props.children || []
  childElement.forEach(childElement => render(childElement, dom))
  parentDom.appendChild(dom)
}
```

다음은 DOM 의 Text Nodes 를 render 하는 방법이다.
여기서 Text Node 를 표현하는 방법은 children 배열에 element 객체가 아닌 plain text 가 들어간 경우가 되겠다.

```js
const reactElement = {
  type: 'span',
  props: {
    children: ['Foo'],
  },
}
```

하지만 여기서 children 배열에 type 과 props 가 들어간 객체만 온다는 룰을 가지고 있으면 우린 더 적은 if 문을 만들 수 있을 것이다. 해서 text 타입은 "TEXT ELEMENT" 라고 props 에는 nodeValue 라는 프로퍼티를 갖게 만들자.

```js
const textElement = {
  type: 'span',
  props: {
    children: [
      {
        type: 'TEXT_ELEMENT',
        props: { nodeValue: 'Foo' },
      },
    ],
  },
}
```

여기서 우리가 정의한 text element 대로 render 하는 함수를 다시 수정해보자. 여기서 달라지는 점이 있다면 일반 dom type 일 경우에는 `createElement` 의 dom api 를 썼을텐데 text 는 `createTextNode` 라는 dom api 를 사용하자.

```js
function render(element, parentDom) {
  const { type, props } = element

  // Create DOM element
  const isTextElement = type === 'TEXT ELEMENT'
  const dom = isTextElement
    ? document.createTextNode('')
    : document.createElement(type)

  // Add event listeners
  const isListener = name => name.startsWith('on')
  Object.keys(props)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, props[name])
    })

  // Set properties
  // 여기서 nodeValue도 셋팅한다.
  const isAttribute = name => !isListener(name) && name !== 'children'
  Object.keys(props)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = props[name]
    })

  // Render children
  const childElements = props.children || []
  childElements.forEach(childElement => render(childElement, dom))

  // Append to parent
  parentDom.appendChild(dom)
}
```

## Element creation and JSX

위 Element 를 좀 더 쉽게 만들기 위해 JSX 를 사용하면 쉽게 읽히면서도 쉽게 표현이 된다. 여기서 JSX 는 우리가 DOM 에 무엇을 표현하고 싶은지를 설명해주는 한 방법이다.

바벨을 사용한다면 JSX 표현은 다음과 같이 변경된다.

```js
const element = (
  <div id="container">
    <input value="foo" type="text" />
    <a href="/bar">bar</a>
    <span onClick={e => alert('Hi')}>click me</span>
  </div>
)
```

[try it on babel REPL](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=react&targets=&browsers=&builtIns=false&debug=false&code=%2F**%20%40jsx%20createElement%20*%2F%0A%0Aconst%20element%20%3D%20%28%0A%20%20%3Cdiv%20id%3D%22container%22%3E%0A%20%20%20%20%3Cinput%20value%3D%22foo%22%20type%3D%22text%22%20%2F%3E%0A%20%20%20%20%3Ca%20href%3D%22%2Fbar%22%3Ebar%3C%2Fa%3E%0A%20%20%20%20%3Cspan%20onClick%3D%7Be%20%3D%3E%20alert%28%22Hi%22%29%7D%3Eclick%20me%3C%2Fspan%3E%0A%20%20%3C%2Fdiv%3E%0A%29%3B)

```js
const element = createElement(
  'div',
  { id: 'container' },
  createElement('input', { value: 'foo', type: 'text' }),
  createElement('a', { href: '/bar' }, 'bar'),
  createElement('span', { onClick: e => alert('Hi') }, 'click me')
)
```

그래서 우린 createElement 함수를 만들어 줄 것이다. 첫번째 인자는 type 인자이고 두번째 인자는 props 이다. 그리고 나머지 인자들은 children 이다.
createElement 함수는 props 객체를 만들어주고 두번째 인자의 값들을 전부 할당해 주어야 한다. 또, children 프로퍼티는 두번째 이후로 오는 인자들을 배열로 만들어서 props 의 children 에 셋팅해준다. 그리고 type 과 props 를 반환하면 된다.

```js
function createElement(type, props, ...args) {
  const props = Object.assign({}, config)
  const hasChildren = args.length > 0
  props.children = hasChildren ? [].concat(...args) : []
  return { type, props }
}
```

위 createElement 함수에서 text node 에 해당하는게 하나 빠져있다. 위 함수대로 작동을 한다면 아래 span 의 text node 의 경우에 그냥 string 값이 들어갈 것이다.

아까 우린 위에서 text node 도 `{ type: TEXT_ELEMENT, props: {nodeValue: 'test'}}` 로 만들어 주기로 했었다. 해서 createElement 를 수정해야 한다.

```js
const spanElement = createElement(
  'span',
  { onClick: e => alert('Hi') },
  'click me'
)

spanElement = {
  type: 'span',
  props: {
    onClick: e => alert('Hi'),
    children: ['click me'], // [{type: TEXT_ELEMTN, props: {nodeValue: 'click me'}}]
  },
}
```

수정해 보자.

```js
const TEXT_ELEMENT = 'TEXT ELEMENT'

function createElement(type, config, ...args) {
  const props = Object.assign({}, config)
  const hasChildren = args.length > 0
  const rawChildren = hasChildren ? [].concat(...args) : []
  // children 배열을 돌면서 textElement는 TEXT ELEMENT 타입으로 변환해서 넣어준다.
  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c => (c instanceof Object ? c : createTextElement(c)))
  return { type, props }
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value })
}
```

## Instances, reconciliation and virtual DOM

이번에는 DOM 을 어떻게 업데이트 시키는지에 대해서 포커스를 두자.
우선 setState 를 설명하기 전까지 dom update 를 할수 있는 방법은 달라진 element 를 가지고 render 함수를 반복해서 시키는 방법이다.

기존 render 는 실제 DOM 을 만들어서 appendChild 를 하는 방식이라서 update 에 적합하지가 않다.
그래서 처음으로 바꿔야 할 부분은 dom 을 replace 하는 작업이고, render 함수 마지막 부분에 parent dom 이 child dom 을 가지고 있는지 확인한다. 만약 그렇다면 새로운 element 로 만든 dom 을 replace 해준다.

```js
function render(element, parentDom) {
  // ...
  // Create dom from element
  // ...

  // Append or replace dom
  if (!parentDom.lastChild) {
    parentDom.appendChild(dom)
  } else {
    parentDom.replaceChild(dom, parentDom.lastChild)
  }
}
```

하지만 좀 더 복잡한 케이스에서는 모든 child node 들을 재 생성 하는 퍼포먼스 비용이 만족스럽지 않는다.
그래서 우린 현재 새로 생성한 elements tree 와 이전 render 를 호출했을 때 사용되었던 element tree 를 비교해서 달라진 곳만 update 시켜야 한다.

### Virtual DOM and Reconciliation

React 에서는 이 "diffing" 프로세싱을 **reconciliation** 이라 부릅니다. 우리도 이와같이 하기 위해서 이전 render 에 사용 되었던 element tree 구조를 보관할 필요가 있고 이것을 새로운 element tree 구조와 비교할 것입니다. 다른말로 하면 우리의 virtual DOM 버젼을 계속 유지해 나갈 것이다.

virtual DOM 안에 있는 노드들은 무엇을 해야 할까요? 이미 그것은 element 로 사용을 하고 있고 element 들은 `props.children` 프로퍼티를 이미 가지고 있다. 이 프로퍼티는 tree 구조 처럼 element 들 탐색을 가능하게 한다. 하지만 여기서 2 가지 문제점이 있는데, 하나는 reconciliation 을 좀 더 쉽게 진행하기 위해서 각 노드의 virtual DOM 에 실제 DOM reference 를 가지고 있어야 한다는 점이다. 두번째 문제는 우리는 나중에 본인만의 state 를 갖고 있는 Components 를 지원해야하고 element 들이 그것을 다루지 못하게 해야한다.

### Instances

그래서 우리는 새로운 용어인 Instances 를 소개하겠다. instance 는 DOM 에 렌더링 된 element 를 나타냅니다. 또한 element, dom, 그리고 childInstances 를 지닌 plain 객체 입니다. childInstances 는 element children 의 instancese 들을 지닌 배열입니다.

각 DOM 노드는 매칭된 instance 를 가지고 있을 것입니다. reconciliation 알고리즘의 한가지 목표는 가능한한 많이 instance 를 creating 또는 removing 을 피하는 것입니다.
여기서 instance 를 creating 그리고 removing 한다는 것은 DOM tree 를 수정해야 한다는 의미 일 것입니다.
instance 를 재사용할수록 DOM 트리를 수정하는 횟수가 줄어 듭니다.

### Refactoring

여기서 우리 render 함수를 reconciliation 알고리즘을 적용해보고, element 를 주어지면 instance 를 생성하는 instantiate 함수를 추가해보자.

```js
let rootInstance = null

function render(element, container) {
  const prevInstance = rootInstance
  const nextInstance = reconcile(container, prevInstance, element)
  rootInstance = nextInstance
}

function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // 초기 render 시
    const newInstance = instantiate(element)
    parentDom.appendChild(newInstance.dom)
    return newInstance
  } else {
    // update render 시
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  }
}

function instantiate(element) {
  const { type, props } = element

  // Create DOM element
  const isTextElement = type === 'TEXT ELEMENT'
  const dom = isTextElement
    ? document.createTextNode('')
    : document.createElement(type)

  // Add event listeners
  const isListener = name => name.startsWith('on')
  Object.keys(props)
    .filter(isListener)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, props[name])
    })

  // Set properties
  const isAttribute = name => !isListener(name) && name != 'children'
  Object.keys(props)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = props[name]
    })

  // Instantiate and append children
  const childElements = props.children || []
  const childInstances = childElements.map(instantiate)
  const childDoms = childInstances.map(childInstance => childInstance.dom)
  childDoms.forEach(childDom => dom.appendChild(childDom))

  const instance = { dom, element, childInstances }
  return instance
}
```

이전과 코드는 같지만, 여기서 다른점은 마지막으로 호출한 render 에서 나온 instance 를 저장하고 있다는점이다.
dom nodes 를 재사용하기 위해서는, dom 프로퍼티들을 update 할 방법이 필요하다. ( className, style, onCLick, etc...) 그래서 dom 프로퍼티를 update 하는 함수를 작성해보자.

```js
function instantiate(element) {
  const { type, props } = element

  // Create DOM element
  const isTextElement = type === 'TEXT ELEMENT'
  const dom = isTextElement
    ? document.createTextNode('')
    : document.createElement(type)

  updateDomProperties(dom, [], props)

  // Instantiate and append children
  const childElements = props.children || []
  const childInstances = childElements.map(instantiate)
  const childDoms = childInstances.map(childInstance => childInstance.dom)
  childDoms.forEach(childDom => dom.appendChild(childDom))

  const instance = { dom, element, childInstances }
  return instance
}

function updateDomProperties(dom, prevProps, nextProps) {
  const isEvent = name => name.startsWith('on')
  const isAttribute = name => !isEvent(name) && name != 'children'

  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // Remove attributes
  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = null
    })

  // Set attributes
  Object.keys(nextProps)
    .filter(isAttribute)
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}
```

`updateDomProperties` 함수는 이전 프로퍼티들을 모두 제거하고 새로운 것들을 추가한다. 만약 프로퍼티가 바뀌지 않았다면 바꾸지 않는다. 그래서 많은 불필요한 업데이트를 할 것입니다. 그러나 간단하게하기 위해 지금은 그대로 두겠습니다.

### Reusing DOM nodes

reconciliation 알고리즘은 DOM nodes 를 가능하면 재 사용하는 것이라고 말했다. 그래서 type 이 같다면 해당 DOM node 를 재사용할 것이다. ( 프로퍼티만 update 할것이다. )

```js
function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // Create instance
    const newInstance = instantiate(element)
    parentDom.appendChild(newInstance.dom)
    return newInstance
  } else if (instance.element.type === element.type) {
    // Update instance
    // 여기서 instance dom은 기존에 render 되었던 Real dom 이다.
    // instance에 Real dom을 재사용해서 프로퍼티들만 update 시켜준다.
    updateDomProperties(instance.dom, instance.element.props, element.props)
    instance.element = element
    return instance
  } else {
    // Replace instance
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  }
}
```

### Children Reconciliation

reconcile 함수에서 가장 중요한 작업을 놓쳤습니다. children 을 실행시키지 않았다는 점이다.
Children reconciliation 은 주요 기술중 하나이다. 여기서는 이전과 현재 tree 구조에서 children 을 매칭 하기 위해 key 라는 추가 프로퍼티가 요구됩니다.
여기서는 오직 같은 children 배열에서 같은 위치의 children 끼리만 비교하겠습니다. 이것이 의미하는 바는 children 순서가 달라지면 DOM nodes 를 재사용하지 못한다는 비용이 든다는 점입니다.

Children reconciliation 을 실행하기 위해선 이전 child instances 인 `instance.childInstances` 와 새로운 element 의 children `element.props.children`을 매칭시킬 것입니다. 그리곤 재귀적으로 reconcil 함수를 호출할 것입니다. 또한 reconcile 에서 리턴된 모든 instances 들을 유지해서 childInstances 를 업데이트 할 수 있습니다.

```js
function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // Create instance
    const newInstance = instantiate(element)
    parentDom.appendChild(newInstance.dom)
    return newInstance
  } else if (instance.element.type === element.type) {
    // Update instance
    // 타입이 같을때 dom을 재사용한다.
    updateDomProperties(instance.dom, instance.element.props, element.props)
    // 그리곤 children에 대해서 reconcile을 적용한다.
    // children 은 배열이기 때문에 배열 처리를 위한 reconcileChildren 함수를 활용한다.
    instance.childInstances = reconcileChildren(instance, element)
    instance.element = element
    return instance
  } else {
    // Replace instance
    // 부모가 기존 인스턴스에서 새로운 인스턴스로 replace 한다면 그 부모 children 들도 새로 instance를 생성한다.
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  }
}

function reconcileChildren(instance, element) {
  const dom = instance.dom
  const childInstances = instance.childInstances
  const nextChildElements = element.props.children || []
  const newChildInstances = []
  const count = Math.max(childInstances.length, nextChildElements.length)
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i] // 이미 그려져 있는 children instance들.
    const childElement = nextChildElements[i] // 새로 그려야 할 children element들
    const newChildInstance = reconcile(dom, childInstance, childElement)
    newChildInstances.push(newChildInstance)
  }
  return newChildInstances
}
```

위 코드에서 reconcile 함수 안에서 instance 를 새로 생성하는 경우 ( 맨 처음 render 가 된다거나 type 이 바뀌는 replace 의 경우) 해당 부모의 자식(children) 들도 새로이 instance 를 생성한다. 즉, 부모가 instance 가 만들어지면 그 자식들도 새롭게 instance 를 만든다. 자식이 type 이 같더라도 부모가 바뀌었기 때문에 재 사용하지 못한다. <br/>

대신에 부모 element 의 type 이 같아서 dom 을 재사용 할때는 자식들을 하나하나 reconcile 처리 해준다. 이때, 자식도 type 이 같다면 재사용 가능.

### Removing DOM nodes

만약에 `nextChildElements`가 `childInstances` 보다 length 가 더 길다면 reconcileChildren 함수는 reconcile 함수를 호출할 때 instance 를 `undifined`로 해서 호출할 것이다. 그러면 `if(instance == null)` 에 걸려서 새로운 instance 를 생성할 것이다. 반면에 반대가 된다면 어떨까?

`childInstances`가 `nextChildElements` 보다 length 가 더 길다면 reconcile 함수에서 childElement 인자를 `undefined`를 보낼 것이다. 이때 reconcile 함수에서는 `element.type` 체크시 에러가 발생하게 된다.

dom 이 제거되는걸 고려하지 않았기 때문이다. 그래서 두가지를 체크 할 것이다. 하나는 reconcile 함수에서 element 가 null 인 경우와 reconcileChildren 함수에서 newChildInstance 가 null 인 경우를 필터해줄 것이다.

```js
function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // Create instance
    const newInstance = instantiate(element)
    parentDom.appendChild(newInstance.dom)
    return newInstance
  } else if (element == null) {
    // Remove instance
    // element가 null 이라는건 새로운 수정사항이 dom을 삭제했다는 것이다.
    // 그래서 그에 매칭 되는 instance.dom 을 제거해주자.
    parentDom.removeChild(instance.dom)
    // 여기서 null 을 리턴해주기 때문에 reconcileChildren 함수에서 null을 filter 처리 한다.
    return null
  } else if (instance.element.type === element.type) {
    // Update instance
    updateDomProperties(instance.dom, instance.element.props, element.props)
    instance.childInstances = reconcileChildren(instance, element)
    instance.element = element
    return instance
  } else {
    // Replace instance
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  }
}

function reconcileChildren(instance, element) {
  const dom = instance.dom
  const childInstances = instance.childInstances
  const nextChildElements = element.props.children || []
  const newChildInstances = []
  const count = Math.max(childInstances.length, nextChildElements.length)
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i]
    const childElement = nextChildElements[i]
    const newChildInstance = reconcile(dom, childInstance, childElement)
    newChildInstances.push(newChildInstance)
  }
  // reconcile 함수에서 childElement가 null인 경우에 dom이 제거됬다고 간주하고 null 을 반환할 것이다.
  return newChildInstances.filter(instance => instance != null)
}
```

## Components and State

위 코드에서는 몇몇 가지 문제사항이 있었다. 

- 모든 변화는 전체 가상 DOM 트리에 대한 조정을 트리거합니다.
- State가 글로벌하게 존재합니다.
- state가 변화 된 후 render 함수를 좀 더 명시적으로 호출해야 합니다.

Components 는 이러한 이슈를 해결하는데 도움을 줄수 있습니다.

- JSX를 이용해 Custom tag를 정의 할 수 있습니다.
- lifecycle 이벤트에 Hook을 걸수 있습니다. 

먼저해야 할 일은 컴포넌트가 확장 될 Component 기본 클래스를 제공하는 것입니다. 우리는 구성 요소 상태를 업데이트하는 데 사용할 `partialState`를 받는 `setState` 메서드와 props 매개 변수가있는 생성자가 필요합니다.

```js
class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
  }
}
```

어플리케이션 코드에서는 이 클래스를 상속받을 것입니다. 그 후에 div 와 span 같이 `<MyComponent>` 처럼 사용할 것입니다.
여기서 중요한건 우리가 만들었던 `createElement` 수정이 필요 없습니다. element `type`으로 class 컴포넌트를 받고 `props`를 다룰것입니다.
그래서 여기선 이 element를 받았을때 component instance( public instances라고 부릅니다.)를 생성해주는 함수를 만들 필요가 있습니다.
