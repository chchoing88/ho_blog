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

React 에서는 위에서 말한 달라진 곳을 비교하는것 이 "diffing" 프로세싱을 **reconciliation** 이라 부릅니다. 우리도 이와같이 하기 위해서 이전 render 에 사용 되었던 element tree 구조를 보관할 필요가 있고 이것을 새로운 element tree 구조와 비교할 것입니다. 다른말로 하면 우리의 virtual DOM 버젼을 계속 유지해 나갈 것이다.

virtual DOM 안에 있는 노드들은 무엇을 해야 할까요? 이미 그것은 element 로 사용을 하고 있고 element 들은 `props.children` 프로퍼티를 이미 가지고 있다. 이 프로퍼티는 tree 구조 처럼 element 들 탐색을 가능하게 한다. 하지만 여기서 2 가지 문제점이 있는데, 하나는 reconciliation 을 좀 더 쉽게 진행하기 위해서 각 노드의 virtual DOM 에 실제 DOM reference 를 가지고 있어야 한다는 점이고, element 들을 immutable 하게 유지해야 한다. 두번째 문제는 우리는 나중에 본인만의 state 를 갖고 있는 Components 를 지원해야하고 element 들이 그것을 다루지 못하게 해야한다.

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
  // 부모 real DOM, 이전 instance , 새로운 element
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

// 인스턴스의 childInstance가 배열이기 때문에 이 배열을 돌면서 reconcile 처리.
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

* 모든 변화에 전체 virtual DOM tree 를 reconciliation 을 진행합니다.
* State 가 글로벌하게 존재합니다.
* state 가 변화 된 후 render 함수를 좀 더 명시적으로 호출해야 합니다.

Components 는 이러한 이슈를 해결하는데 도움을 줄수 있습니다.

* JSX 를 이용해 Custom tag 를 정의 할 수 있습니다.
* lifecycle 이벤트에 Hook 을 걸수 있습니다.

먼저해야 할 일은 컴포넌트가 확장 될 Component 기본 클래스를 제공하는 것입니다. 우리는 구성 요소 상태를 업데이트하는 데 사용할 `partialState`를 받는 `setState` 메서드와 props 매개 변수가있는 생성자가 필요합니다.

```js
class Component {
  constructor(props) {
    this.props = props
    this.state = this.state || {}
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState)
  }
}
```

어플리케이션 코드에서는 이 클래스를 상속받을 것입니다. 그 후에 div 와 span 같이 `<MyComponent>` 처럼 사용할 것입니다.
여기서 중요한건 우리가 만들었던 `createElement` 수정이 필요 없습니다. element `type`으로 class 컴포넌트를 받고 `props`를 다룰것입니다.
그래서 여기선 이 element 를 받았을때 component instance( public instances 라고 부릅니다.)를 생성해주는 함수를 만들 필요가 있습니다.

```js
function createPublicInstance(element, internalInstance) {
  const { type, props } = element
  const publicInstance = new type(props)
  publicInstance.__internalInstance = internalInstance
  return publicInstance
}
```

public instance 생성을 하면서 internal instance(virtual DOM) 의 레퍼런스를 추가적으로 가지고 있을것입니다. 이것은 오직 public instance state 가 변경 되었을때 해당 instance sub-tree 업데이트 하는데 필요합니다.

```js
class Component {
  constructor(props) {
    this.props = props
    this.state = this.state || {}
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState)
    updateInstance(this.__internalInstance)
  }
}

function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode
  const element = internalInstance.element
  reconcile(parentDom, internalInstance, element)
}
```

`instantiate` 함수도 update 가 필요합니다. components 들은 public instace 로 생성하고 component 의 `render` 함수를 child element 를 얻기 위해 호출해준다. 그리곤 해당 element 를 다시 `instantiate` 함수로 호출해준다.

```js
function instantiate(element) {
  const { type, props } = element
  const isDomElement = typeof type === 'string'

  if (isDomElement) {
    // Instantiate DOM element
    const isTextElement = type === TEXT_ELEMENT
    const dom = isTextElement
      ? document.createTextNode('')
      : document.createElement(type)

    updateDomProperties(dom, [], props)

    const childElements = props.children || []
    // childElements 는 배열로 들어오기 때문에 map 돌리면서 instantiate 함수 호출해줌.
    const childInstances = childElements.map(instantiate)
    const childDoms = childInstances.map(childInstance => childInstance.dom)
    childDoms.forEach(childDom => dom.appendChild(childDom))

    const instance = { dom, element, childInstances }
    return instance
  } else {
    // element.type이 class 일 경우.
    // Instantiate component element
    const instance = {}
    const publicInstance = createPublicInstance(element, instance)
    const childElement = publicInstance.render()
    // child 인스턴스가 하나임.
    const childInstance = instantiate(childElement)
    const dom = childInstance.dom

    Object.assign(instance, { dom, element, childInstance, publicInstance })
    return instance
  }
}
```

component elements 에 해당하는 internal instance 과 dom element 들은 다르다. Component internal instance 들은 오직 하나의 child(render 함수에서 리턴되는) 만 가지고 있다. 그래서 internal instance 들은 dom instances 들이 가지고 있는 배열인 `childInstances` 대신에 childInstance 프로퍼티 하나를 가지고 있다. 또한, component internal instance 들은 public instance 를 가지고 있을 필요가 있다. 그래야 render 함수가 reconciliation 하는 동안 불려질수 있기 때문이다.

한가지 놓친것이 있다면 component instance 의 reconciliation 를 다루는 것이다. 그래서 우린 reconciliation algorithm 에 한가지 케이스를 더 추가할 것이다. children reconciliation 을 다루지 않아도 되는 한가지 child 만 가지고 있는 component instance 가 주어졌을때, 우린 public instance 의 props 를 update 시키고 child 를 re-render 시켜주면 된다.

```js
function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // Create instance
    const newInstance = instantiate(element)
    parentDom.appendChild(newInstance.dom)
    return newInstance
  } else if (element == null) {
    // Remove instance
    parentDom.removeChild(instance.dom)
    return null
  } else if (instance.element.type !== element.type) {
    // Replace instance
    const newInstance = instantiate(element)
    parentDom.replaceChild(newInstance.dom, instance.dom)
    return newInstance
  } else if (typeof element.type === 'string') {
    // Update dom instance
    updateDomProperties(instance.dom, instance.element.props, element.props)
    instance.childInstances = reconcileChildren(instance, element)
    instance.element = element
    return instance
  } else {
    //Update composite instance
    instance.publicInstance.props = element.props
    const childElement = instance.publicInstance.render()
    const oldChildInstance = instance.childInstance
    const childInstance = reconcile(parentDom, oldChildInstance, childElement)
    instance.dom = childInstance.dom
    instance.childInstance = childInstance
    instance.element = element
    return instance
  }
}
```

이게 전부이다. 이 코드를 사용해서 활용한 예제이다. : [codepen](https://codepen.io/pomber/pen/RVqBrx)

## Fiber: Incremental reconciliation

리액트 16 버젼이 출시 되었다. 그것은 리액트의 코드 대부분을 재 작성해야 할 필요가 생긴 새로운 내부적인 아키텍쳐를 가지고 있다.
이것은 예전 아키텍처로는 개발하기 힘든 일부 기능이 선적되었음을 의미합니다. 또한 이 시리즈에서 작성한 대부분의 코드는 현재 가치가 없다는 것을 의미합니다.

이제는 16 에서 사용하는 새로운 아키텍쳐를 사용해서 다시 코드를 작성해볼 예정이다. 특히, 구조, 변수들, 함수이름들을 리액트 코드베이스로 부터 가져와서 작성할 것입니다.
여기서 우리가 건들지 않아도 되는 API 는 다음과 같습니다.

* createElemetn()
* render() (오직 DOM 을 rendering 하는 함수)
* Component ( setState() 메서드를 포함한. context 나 life cycle 은 미포함)

이제 왜 우리가 예전 코드를 다시 작성해야 하는지를 설명하겠다.

### Why Fiber

브라우저의 메인 쓰레드는 시간을 많이 쓰는 무엇인가로 인해 매우 바쁘게 움직있다고 할때, 매우 중요한 task 들은 끝날때 까지 기다려야 한다.

이런 문제를 위해서 몇가지 데모를 준비했다. [데모](https://pomber.github.io/incremental-rendering-demo/react-sync.html)에서 행서들이 도는걸 유지하기 위해서 메인 쓰레드는 매 16ms 마다 사용가능 하도록 유지 시켜주어야 한다. 만약 이 메인쓰레드가 다른 무엇인가로 blocked 당했다고 한다면 여기서 매 200ms 라고 하자. 메인 쓰레드가 다시 자유로워 질때 까지 행성들이 멈춰있고 해당 프레임이 사라지는걸 확인 할 수 있을 것이다.

무엇이 메인 쓰레드 즉, 몇 에니메이션을 부드럽고 UI 응답을 유지하기 위해 예비의 마이크로 초도 둘수없게 바쁘게 하는가?

reconciliation 코드를 기억하는가? 한번 reconciliation 코드를 실행하면 멈추지 않는다. 메인 스레드가 다른 작업을 수행해야하는 경우 reconciliation 코드는 대기해야합니다. 그리고 이 reconciliation 코드는 많은 재귀 호출로 인해서 지연될 수 있는 코드 입니다. 이런이유로 우리는 해당 코드를 재귀 호출을 루프로 교체가능한 새로운 데이터 구조를 사용하는 reconciliation 코드를 재 작성해야 합니다.

### Scheduling micro-tasks

우린 이제 work 를 작은 단위로 나눌 필요가 있다. 짧은 시간동안 동작하기 위해서 짧은 단위로 나눈다. 메인 스레드가 더 우선 순위가 높은 작업을 수행하게하고 보류중인 작업이 있으면 작업을 끝내기 위해 다시 돌아옵니다.
이 작업을 돕기 위해서 `requestIdelCallback()` 함수를 이용 할 것입니다. 이것은 callback 함수를 큐에 넣어 두는데 이것은 브라우저가 idle 타임에 호출이 되고, 얼만큼 이용가능한 시간인지 설명해주는 `deadline` 파라미터를 포함하고 있다.

```js
const ENOUGH_TIME = 1 // milliseconds

let workQueue = []
let nextUnitOfWork = null

function schedule(task) {
  workQueue.push(task)
  requestIdleCallback(performWork)
}

// requestIdleCallback 인자로 들어갈 함수
// 이 함수는 브라우저가 idle 시점에 호출되고
// deadline 파라미터로 적절한 시간이 남았는지를 확인해서 해당 로직을 수행한다.
function performWork(deadline) {
  if (!nextUnitOfWork) {
    nextUnitOfWork = workQueue.shift()
  }

  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  if (nextUnitOfWork || workQueue.length > 0) {
    requestIdleCallback(performWork)
  }
}
```

실제 작업은 `performUnitOfWork` 함수에서 일어납니다. `performUnitOfWork` 안에 우리의 reconciliation code 를 작성할 필요가 있습니다. `performUnitOfWork` 함수는 작업 조각을 동작시켜야 합니다. 그리곤 다음에 작업을 다시 시작하는 데 필요한 모든 정보를 반환해야 햡니다.
<br />
이런 작업의 조각을 추적하기위해 fiber들을 사용할 것입니다.

### The fiber data structure

우리는 render 를 원하는 각 컴포넌트에 대해 fiber 를 생성할 것입니다. `nextUnitOfWork` 는 우리가 원하는 다음 작업인 next fiber 를 위한 참조 값입니다. `performUnitOfWork` 는 fiber 대해 작업하고 완료가 되면 새로운 fiber 를 리턴한다.
<br />
fiber 는 어떻게 생겼는가?

```js
let fiber = {
  tag: HOST_COMPONENT,
  type: 'div',
  parent: parentFiber,
  child: childFiber,
  sibling: null,
  alternate: currentFiber,
  stateNode: document.createElement('div'),
  props: { children: [], className: 'foo' },
  partialState: null,
  effectTag: PLACEMENT,
  effects: [],
}
```

이것은 보통의 오래된 자바스크립트 객체이다.
<br />
우리는 `parents`, `child` 그리고 `sibling` 프로퍼티를 fiber들의 tree 를 구축하기 위해 사용할 것이다.
이것들은 component 의 tree 를 설명해줄것이다.
<br />
`stateNode`는 component instance 에 대한 참조 값이다. 이 값으론 DOM element 또는 유저가 정의한 class component 의 instance 를 가질 수 있다.
<br />
예를 들면,

![fiber01.png](./fiber01.png)

위 예제에서 우리가 지원할 서로 다른 3 가지 종류의 컴포넌트들을 볼수 있다.

* `b`,`p` 그리고 `i` 를 위한 fiber 들은 **host components** 대표한다. 이들의 식별자는 tag 에 `HOST_COMPONENT` 라고 지칭 할것이다. `type`은 string(html element 의 태그) 이 될것이다. `props`는 속성값과 해당 element 의 이벤트 리스너가 되겠다.
* `Foo` fiber 는 **class component** 를 대표한다. 이것의 `tag`는 `CLASS_COMPONENT` 가 될 것이고, `type`은 유저가 정의한 `Didact.Component`를 상속한 `class` 의 참조값이 될것이다.
* `div`를 위한 fiber 는 **host root** 를 대표한다. 이것은 위에서 언급한 host component 과 유사한데 그 이유는 DOM element 를 지니고 있기 때문이다. 그러나 이 host root 는 트리의 root 가 되어서 특별하게 다뤄질 것이다. `tag`는 `HOST_ROOT`가 될것이다. 이 fiber 의 stateNod 는 `Didact.render()`로 전달 받은 DOM node 이다.

다른 중요한 프로퍼티는 `alternate` 이다. 이것은 대부분의 시간동안 두가지의 fiber tree 를 가지기에 필요하다.
**한가지 tree 는 우리가 이미 render 한 DOM 에 관한 것이고, 이것을 우린 current tree 또는 old tree 라고 부를 것이다. 또 다른 하나는 우리가 `setState()` 또는 `Didact.render()` 호출을 통해서 새로운 update 작업을 할때 생성되는 tree 이다. 이것을 우린 _work-in-progress tree_ 라고 부를 것이다.**

work-in-progress tree는 old tree를 갖는 어떤 fiber와 공유하지 않습니다. 일단 work-in-progress tree를 완성하고나면 DOM을 변화 시키고, 다시 이 work-in-progress tree가 old tree 가됩니다.

그래서 `alternate`를 work-in-progress tree fiber들과 그것과 일치하는 old tree로 부터 나온 fiber들을 연결하기 위해 사용합니다. fiber와 그것의 `alternate`는 같은 `tag`, `type` 그리고 `stateNode`를 공유합니다. 때때론 새로운 rendering 작업이 있을떈 fiber들은 `alternate`를 안가지고 있을 수 있다. 

마지막으로, `effects`리스트와 `effectTag`를 갖습니다.  work-in-progress tree 안에서 DOM이 변화할 필요가 있는 fiber를 찾았을때 `effectTag`를 `PLACEMENT`, `UPDATE` 또는 `DELETION`으로 설정합니다. 모든 DOM 변화를 손쉽게 처리하기 위해 `effects`에 나열된 `effectTag`가 있는 모든 fibers (fiber하위 트리의 목록)의 목록을 유지합니다.

### Didact call hierarchy

우리가 작성하려고하는 코드의 흐름을 이해하려면이 다이어그램을 살펴보십시오.

![fiber02.png](./fiber02.png)

`render()` 및 `setState()` 에서 시작하여 `commitAllWork()` 에서 끝나는 흐름을 따릅니다.


### Old code

대부분의 코드를 재 작성해야 한다고 이야기 했었었다. 하지만 먼저 수정하지 않은 코드를 리뷰해보자.

우리가 작성한 `createElement()` 함수는 변할 필요가 없다. 우린 계속 같은 element들을 유지할 것이기 때문이다. 여기서 element는 `type`,`props` 그리고 `children`을 가진 평범한 자바스크립트 객체였다.

우린 노드의 DOM 프로퍼티를 update 하기 위해 `updateDomProperties()` 도 작성했었다. 또 DOM element들을 생성하기 위해 `createDomElement()` 함수도 추출했습니다. 이 두 함수 모두 [이곳](https://gist.github.com/pomber/c63bd22dbfa6c4af86ba2cae0a863064)에서 볼수 있습니다. 

base class 인 `Component` 도 작성했었습니다. 여기서 `setState()`가 `scheduleUpdate()` 를 호출하게 만들고 `createInstance()` 가 instance에 fiber를 참조하도록 만듭시다.

```js
class Component {
  constructor(props) {
    this.props = props || {};
    this.state = this.state || {};
  }

  setState(partialState) {
    scheduleUpdate(this, partialState);
  }
}

function createInstance(fiber) {
  const instance = new fiber.type(fiber.props);
  instance.__fiber = fiber;
  return instance;
}
```

이 코드로 시작하고 나머지는 처음부터 다시 작성하지 않습니다.

![fiber03.png](./fiber03.png)

`Component` 클래스와 `createElement()` 외에도 `render()`와 `setState()`라는 두 개의 공용 함수가 있으며 `setState()`가 `scheduleUpdate()`를 호출하는 것을 보았습니다.
`render()` 및 `scheduleUpdate()` 도 비슷합니다. 이 두 함수들은 새 업데이트 할것을 받고 대기열(큐)에 넣습니다.

```js
// Fiber tags
const HOST_COMPONENT = "host";
const CLASS_COMPONENT = "class";
const HOST_ROOT = "root";

// Global state
const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

// render 함수 
// 아래서 render 함수라는건 이 함수를 가리킴
// 이 render는 처음에 딱 한번 실행함.
function render(elements, containerDom) {
  updateQueue.push({
    from: HOST_ROOT,
    dom: containerDom,
    newProps: { children: elements }
  });
  requestIdleCallback(performWork);
}

function scheduleUpdate(instance, partialState) {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance: instance,
    partialState: partialState
  });
  requestIdleCallback(performWork);
}
```

`updateQueue` 배열을 사용해서 update 준비중인것들을 추적합니다. 매 `render()` 또는 `scheduleUpdate()` 호출은 새로운 업데이트를 `updateQueue` 큐에 넣는다.
각 업데이트들의 업데이트 정보는 다르고 이것을 우리가 나중에 `resetNextUnitOfWork()` 에서 어떻게 사용할지 볼수 있을것이다.

업데이트를 큐에 넣고 나서, `performWork()`에 대한 지연 호출을 트리거합니다.

![fiber04.png](./fiber04.png)

```js
const ENOUGH_TIME = 1; // milliseconds

function performWork(deadline) {
  workLoop(deadline);
  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork);
  }
}

function workLoop(deadline) {
  if (!nextUnitOfWork) {
    resetNextUnitOfWork();
  }
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
}
```
여기 우리가 앞서 보았던 `performUnitOfWork()` 패턴을 사용합니다.

`requestIdleCallback()`은  deadline 파라미터를 함께 가진 타겟 함수를 호출합니다. `performWork()` deadline 을 받아서 `workLoop()` 로 전달해줍니다. `workLoop()` returns 후에, `performWork()` 작업 준비가 되었는지 체크를 합니다. 만약 준비가 됬다면, 자기 자신을 새로운 지연 호출로 스케쥴링 시킵니다.

`workLoop()` 은 시간을 주시하는 함수입니다. 만약 deadline이 너무 가깝다면, 루프 작업은 멈추고 다음 업데이트 해야할 작업을 남겨둡니다. 그래서 다시 다음 타임에 재개 될 수 있도록 합니다.

> deadline.timeRemaining()이 다른 작업 단위를 실행하기에 충분한지 아닌지 확인하기 위해 ENOUGH_TIME (1ms 상수, React와 동일)을 사용합니다. performUnitOfWork ()가 그 이상을 수행하면 마감 시간이 초과됩니다. 최종 기한은 브라우저의 제안 일 뿐이므로 몇 밀리 초 동안 오버런하는 것은 그렇게 나쁘지 않습니다.

`performUnitOfWork ()`는 업데이트를위한 work-in-progress 트리를 만들고 DOM에 적용해야 할 변경 사항을 찾아 낼 것입니다. **이것은 한 번에 한 fiber씩 점진적으로 이루어질 것입니다.**

`performUnitOfWork()`가 현재 업데이트에 대한 모든 작업을 완료하면 null을 반환하고 보류중인 DOM 변경 사항을 `pendingCommit`에 남겨 둡니다. 마지막으로 `commitAllWork()`는 `pendingCommit` 에서 `effects`를 받아 DOM을 변경합니다.

`commitAllWork()`는 루프 외부에서 호출됩니다. `performUnitOfWork()`에서 수행 된 작업은 DOM을 변경하지 않으므로 분할하는 것이 좋습니다. 반면에, `commitAllWork()`는 DOM을 돌연변이시킬 것이고 일관성없는 UI를 피하기 위해 한번에 모두 완료되어야합니다.

우리는 여전히 어디서 `nextUnitOfWork`를 처음으로 불러오는지 보지 못했습니다.

![fiber05.png](./fiber05.png)

업데이트를 받아서 첫 번째 `nextUnitOfWork`로 변환하는 함수는 `resetNextUnitOfWork()` 입니다.

```js
function resetNextUnitOfWork() {
  const update = updateQueue.shift();
  if (!update) {
    return;
  }

  // Copy the setState parameter from the update payload to the corresponding fiber
  if (update.partialState) {
    update.instance.__fiber.partialState = update.partialState;
  }

  // 그런 다음 old fiber tree의 root를 찾습니다.
  const root =
    update.from == HOST_ROOT
      ? update.dom._rootContainerFiber
      : getRoot(update.instance.__fiber);

 // 새로운 fiber
 // 새로운 work-in-progress tree의 root
  nextUnitOfWork = {
    tag: HOST_ROOT,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root
  };
}

function getRoot(fiber) {
  let node = fiber;
  while (node.parent) {
    node = node.parent;
  }
  return node;
}
```

`resetNextUnitOfWork()`는 대기열에서 첫 번째 업데이트를 가져 와서 시작합니다.

update 객체에 컴포넌트 인스턴스에 속해있는 fiber에 저장시켜둔 `partialState`가있는 경우 나중에 컴포넌트의 `render()`를 호출 할 때 사용할 수 있습니다.

그런 다음 old fiber tree의 root를 찾습니다. `render()`가 처음 호출 된 시점부터 업데이트가 발생하면 루트가 없으므로 `root`가 `null`이 됩니다. `render()`에 대한 후속 호출에서 오는 경우 DOM 노드의 `_rootContainerFiber` 속성에서 루트를 찾을 수 있습니다. 그리고 업데이트가 `setState()`에서 오는 경우 부모가없는 fiber가 발견 될 때까지 인스턴스 fiber에서 위로 이동해야합니다.

그런 다음 `nextUnitOfWork`에 새 fiber를 할당합니다. **이 fiber는 새로운 work-in-progress tree의 root입니다.**

old root가 없다면, `stateNode`는 `render()` 호출할때 매개 변수로 받은 DOM 노드입니다. `props` 는 update객체의 `newProps`가됩니다 : element(render()의 다른 매개 변수)들을 가지고있는 children 프로퍼티를 가진 객체. `alternate`은 null이 될 것입니다.

old root가 있다면 stateNode는 이전 루트의 DOM 노드가됩니다. 소포는 다시 newProps가 null이 아니면 그렇지 않으면 이전 루트에서 소품을 복사합니다. 대체는 이전 루트가됩니다.

이제 우리는 작업 중 트리의 근원을 가지고 나머지 부분을 만들기 시작합시다.