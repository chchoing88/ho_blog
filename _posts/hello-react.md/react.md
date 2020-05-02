---
title: React 정리
date: "2019-11-20T10:00:03.284Z"
---

## 리액트가 동작하는 방법 (요약)

- react는 모든 요소를 생성해서 해당 되는 dom에 밀어 넣는다.
- react는 소스코드에 처음부터 HTML을 넣지 않고, HTML에서 HTML을 추가하거나 제거하는 법을 알고있다.
- 빈 HTML을 로드한 다음에 react가 HTML을 밀어 넣게 된다.
- react에서는 virtual DOM이라는게 있고 react가 이걸 만들어내서 HTML을 만들어 낸다. 소스코드에는 찾아 볼 수 없다.

## Element

- Element는 DOM 노드 또는 다른 컴포넌트와 관련하여 화면에 표시할 내용을 설명하는 일반 개체입니다.

```javascript
// element의 형태

{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      children: 'OK!'
    }
  }
}
```

## Component

- component는 대문자로 시작해야 한다.
- component는 2가지 형태( class , function) 으로 존재 할 수 있다.
- class component 는 React.Component를 상속받아 render 메서드를 지닌 형태이다.
- class component , function component 이 둘다 입력으로 props를 받고 산출물로 element tree를 반환한다.
- component가 입력으로 props를 받으면 부모 컴포넌트가 type 으로 해당 component 와 그것의 props를 element로 리턴했다는 것이다.
- react는 Component를 가져와서 브라우저가 이해할 수 있는 평범한 일반 HTML로 만들어 준다.
- **react는 Component를 이용해서 Element를 만듭니다. (컴포넌트는 엘리먼트를 만들어주는 함수 또는 클래스 입니다.)**
- component는 재사용이 가능하게 만들 수 있다. 이 말은 component를 계속 반복해서 사용할 수 있다는 것이다.

## instance

- class component 에서 사용되는 this로 참조하는 값이다.
- instance는 local state를 저장하고 lifecycle event에 반응하기에 적합하다.

## JSX

- React는 component와 동작하고 모든 것은 component이다.
- 우리의 목적은 component를 보기 좋게 만드는 것이다.
- component가 data를 보여주게 하는 것이다.
- component는 HTML을 반환하는 함수이다.
- react는 component를 사용해서 HTML처럼 작성하려는 경우에 필요하다.
- javascript와 HTML 사이의 이러한 조합을 JSX라고 부른다.
- component를 만들고 사용하는데 있어서 React에서 만든 JSX 라는 것을 사용하게 된다.
- jsx는 babel을 통해서 createElement 함수로 바뀌고 실행된다.

## Props

- 부모 component에서 자식 component로 정보를 보낼때 React Element의 props 객체에 정보를 실어서 보내게 된다.
- PropTypes 으로 props의 타입을 체크 할 수 있다.

```javascript
// Food component에서는 인자로 props 객체를 받을 수 있다.
const Food = ({name}) => {
	return (
		<div>I like {name}</div
	)
}

const somethingComponent = () => (
	<Food name="kimchi"/>
)

// 위 문법은 아래와 같이 변형된다.
const somethingComponent = () => ({
	type: Food,
	props: {
		name: "kimchi"
	}
})
```

### render prop

- render props에 함수를 넘겨주면 그 해당 함수에 인자로 내가 생성한 데이터를 넣어주겠다. 그 데이터가 필요한 컴포넌트를 자유롭게 렌더링 해라
- render prop은 무엇을 렌더링할지 컴포넌트에 알려주는 함수이다.
- render 대신에 children을 이용해서 사용할 수도 있다.
- 이 테크닉은 자주 사용되지 않기 때문에, API를 디자인할 때 children은 함수 타입을 가지도록 propTypes를 지정하는 것이 좋습니다.

```javascript
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};

<Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>

// Mouse 컴포넌트는 데이터를 생성. render에 넘겨주는 함수의 인자(mouse)에 데이터를 넘겨주면
// Cat 컴포넌트에서 해당 데이터를 이용해서 view
```

## State

- 동적 데이터와 함께 작업할때 만들어지는 데이터, 변하는 데이터 즉, 다이나믹한 데이터들의 종류를 말한다.
- state는 class component에 존재한다.
- `react`는 자동적으로 모든 `class component의 render 메서드`를 실행 하고자 한다.
- `state`는 object이고 class component에는 data를 넣을 공간이 있다. 그리고 이 데이터는 변한다.
- 바꿀 데이터를 state 안에 넣는다.
- `state`를 직접적으로 바꾼다면 React는 `render function` 을 `refresh` 하지 않는다. 이 말의 의미는 state의 상태를 변경할때 React가 `render function` 을 호출하길 원한다는 뜻이다.
- `setState` 메서드를 이용해서 state를 변경하면 React는 state를 refresh 하고 또한 render function 을 호출해준다.
- `setState`로 `state`를 변경하고 새로 Render가 필요할때 사용합니다.
- `state`를 변경하고자 할때 직접적으로 변경하는 것이 아니라 `setState` 메서드를 사용해서 변경합니다.
- `setState`를 호출하게 되면 React의 스케쥴에 등록을 하게 되고 현재 클래스컴포넌트의 인스턴스와 `setState`의 인자로 넘겼던 `partialState`를 인자로 넘기게 됩니다. 이때 `partialState`는 `fiber`에 담겨져 있다가 `reconciliation`이 끝나고 나면 state에 `Object.assign`으로 적용이 됩니다. ( 즉, 바로 state가 변경되지 않습니다. 중요한건 `reconciliation`이 끝나고 `state` 가 한번에 반영이 된다는 것입니다. )
- 그렇기 때문에 `setState` 를 연속으로 호출이 되면 전에 `setState` 호출 해서 얻은 결과가 뒤에 `setState` 에 반영이 되지 않는 것입니다. 그래서 `state`에 객체 대신에 함수 인자를 전달하는게 좋습니다. 

```javascript
this.state = 1
this.setState({
  likes: this.state.likes + 1
});

this.setState({
  likes: this.state.likes + 1
});

// this.state = 2
```

- setState에서 this.state를 직접 참조(의존)하기 보다는 현재 state를 받는 함수 형태로 넘기는게 좋다. ( setState(currentState => currentState + 1) )

## Life Cycle

- life cycle method는 react가 component를 생성하는 그리고 없애는데 호출되는 메서드 이다.
- component가 생성될 때, render 전에 호출되는 몇가지 function 이 있다.
- mount, update, unmount 때에 따라 호출되는 method가 있다.
- mount
    - `contstructor()` : 컴포넌트를 새로 만들 때마다 호출되는 클래스 생성자 메서드 입니다.
    - `static getDerivedStateFromProps()` : 컴포넌트가 인스턴스화 된 후, 새 props를 받았을 때 호출된다. props에 있는 값을 state에 넣을 때 사용하는 메서드 입니다.
    - `render()` : 우리가 준비한 UI를 렌더링하는 메서드 입니다. 
    - `componentDidMount()` : 컴포넌트가 웹 브라우저상에 나타난 후 호출하는 메서드입니다.
- update
    - `static getDerivedStateFromProps()` : 이 메서드는 마운트 과정에서도 호출되며, 업데이트가 시작하기 전에도 호출됩니다. props의 변화에 따라 state 값에도 변화를 주고 싶을 때 사용합니다.
    - `shouldComponentUpdate()` : 컴포넌트가 리렌더링을 해야 할지 말아야 할지를 결정하는 메서드 입니다. 이 메서드에서는 true 혹은 false 값을 반환하며, true을 반환하면 다음 라이프사이클 메서드를 계속 실행하고, false를 반환하면 작업을 중지합니다. 즉, 컴포넌트가 리렌더링 되지 않습니다. 만약 특정 함수에서 this.forceUpdate() 함수를 호출하면 이 과정을 생략하고 바로 render 함수를 호출합니다.
    - `render()` : 컴포넌트를 리렌더링 합니다.
    - `getSnapshotBeforeUpdate()` : DOM이 업데이트 직전에 호출된다. (이 라이프 사이클은 많이 필요하지 않지만, 렌더링되는 동안 수동으로 스크롤 위치를 유지해야할 때와 같은 경우에는 유용할 수 있다)
    - `componentDidUpdate()` : 컴포넌트의 업데이트 작업이 끝난 후 호출하는 메서드 입니다.
- unmount
    - `componentWillUnmount()` : 컴포넌트가 웹 브라우저상에서 사라지기 전에 호출하는 메서드 입니다.

## Composition

- 컴포넌트에서 다른 컴포넌트를 `children` 이나 `props` 로 받아서 구성할 수 있다.
- 일반적인 컴포넌트에서 특수한 경우인 경우를 고려해야하는 경우 더 "구체적인" 컴포넌트가 "일반적인" 컴포넌트를 렌더링하고 구체적인 내용은 `props` 를 통해 내용을 구성한다.
- 가끔은 상위 컴포넌트에서 하위 컴포넌트에 필요한 데이터를 `props` 로 해당 하위컴포넌트에 전달할때 depth가 너무 깊으면 힘들어지니 상위 컴포넌트에서 데이터를 포함한 해당 하위 컴포넌트를 품고 `props` 로 전달해서 render 하면 더 편할 때가 있다. 다 편한건 아니다.

## Reconciliation (재조정)

- 컴포넌트를 호출 => 새로운 `React Element` 반환 => 새로운 `Element와` 이전 `Element` 비교 => 변화 감지
- 컴포넌트가 `React Element` 새로 만들면 기존 `Dom` 에 그려졌던 `Element`랑 비교
- 변화가 생긴 컴포넌트를 기준으로 그 컴포넌트가 반환한(리턴한) `React Element`를 이전(DOM에 그려졌던 Element)과 비교
- 비교된 결과가 이전 인스턴스가 없었던 것이라면 새로운 `element`를 바탕으로 새롭게 append 시도
- 비교된 결과가 새로운 `element`가 없다면 이전 `instance`를 실제 DOM에서 삭제
- 배교된 결과가 타입이 다르다면 새로운 element를 바탕으로 `replace` 시도 ( 자식까지 모두 )
- 새로운 `element type` 이 `dom type`이면 `dom property` 들을 update 진행
- 새로운 `element type` 이 컴포넌트라면 (class, function) 컴포넌트의 `render()` 메서드 또는 `return` 결과의 `React Element` 들을 가지고 다시 `reconcile` 진행

### 변화 감지

아래 다음과 같은 경우 자식들을 모두 instantiate 해서 한방에 부모 DOM에 append 또는 replace 합니다.

- 타입이 다를때
- 새로 생겨나야 할때

Reconciliation 할 때 경우의 수는 다음과 같습니다.

- 없으면 새로 만들고 ( 자식 까지 새로 만들어서 만듬 ) appendChild - 한방
- 있었던건데 없어지면 지우고 ( 자식 밑으로 삭제 ) removeChild - 한방
- 타입이 다르면 새로 만들어서 ( 자식 까지 만들어서 ) replaceChild - 한방
- DOM Element 인데 type이 같으면 update 하고 기존 dom 활용
- React Component 이면 render() 해서 reconcilation 재귀

## Context API

- 하나의 액션으로 해당하는 컴포넌트만 바꾸는게 아닌 다른 여러 컴포넌트도 바꾸고 싶다.  ( one to many 관계 )
- context를 이용하면 단계마다 일일이 props를 넘겨주지 않고도 컴포넌트 트리 전체에 데이터를 제공할 수 있습니다.
- context의 주된 용도는 다양한 레벨에 네스팅된 많은 컴포넌트에게 데이터를 전달하는 것입니다.
- 같은 데이터를 모든 하위 컴포넌트에게 널리 "방송"이 필요할 때는 context가 유용하다.
- React 컴포넌트인 Provider는 context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할을 합니다.
- Consumer는 context 변화를 구독하는 React 컴포넌트입니다. 함수 컴포넌트안에서 context를 읽기 위해서 쓸 수 있습니다. Context.Consumer의 자식은 함수여야합니다. 이 함수는 context의 현재값을 받고 React 노드를 반환합니다.
- useContext를 쓰면 컴포넌트 함수 자체는 실행이 된다. 실제로 return 부분이 실행된다면 그게 실제로 re-rendering 되는 것이기 때문에 return 에 있는 부분만 캐싱을 해줘야 한다. useMemo 사용 ( 참고 : [https://www.youtube.com/watch?v=Y7m9RKmD0UQ](https://www.youtube.com/watch?v=Y7m9RKmD0UQ) )

## React Hooks

- 함수형 컴포넌트에서도 상태 관리를 할 수 있는 useState. 렌더링 직후 작업을 설정하는 useEffect 등의 기능을 제공하여 기존의 함수형 컴포넌트에서 할 수 없었던 다양한 작업을 할 수 있게 해 줍니다.
- useState는 함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해줍니다.
- useEffect는 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있는 Hook이다.
클래스형 컴포넌트의 componentDidMount와 componentDidUpdate를 합친 형태로 보아도 무방하다.
- useEffect는 기본적으로 DOM 렌더링되고 난 직후마다 실행되며, 두 번째 파라미터 배열에 무엇을 넣는지에 따라 실행되는 조건이 달라진다.
- 컴포넌트가 언마운트되기 전이나 업데이트 되기 직전에 어떠한 작업을 수행하고 싶다면 useEffect에서 cleanup 함수를 반환해 주어야 합니다.
- useEffect 사용할시 관계 없는 로직일때는 분리해서 넣으십쇼. Hooks은 무엇을 하는지에 따라 코드를 분리 시켜줄수 있습니다.
- effect는 다음 effect가 발생할때 마다 default로 이전 effect를 clean up 해줄 수 있다. effect 의 return 으로 함수를 적어둔다면 리엑트는 자동으로 정리를 해야할때(다음 effect 함수가 실행되기 이전에) 이 함수를 실행 시킵니다.
- useEffect가 발동되면 해당되는 함수 컴포넌트는 무조건 다시 호출이 됩니다.
- useEffect의 두번째 인자로 빈 배열(`[]`)을 넣는다면 mount시와 unmount시에만 호출이 됩니다. 그래서 update시에 effect 함수 호출을 건너뛸 수 있습니다.
- 만약 useEffect의 두번째 인자로 빈 배열(`[]`)을 넣는다면 effect 안에 있는 state와 props는 항상 초기값을 가리킬 것입니다.

### useEffect 는 왜 매 업데이트 시 마다 호출이 될까?

우리 컴포넌트에서 this.props에서 친구의 온라인 유무 상태를 받아온다고 생각해보자. componentDidMount와 componentWillMount시에 친구 ID를 사용해서 로직을 구현할 것이다. 근데 만약 props가 변경되어 친구가 변경 되었다면, 다른 친구의 온라인 상태를 표현해 줄것입니다.

또한 unMount시에 없는 친구 ID를 사용하기에 에러가 나기 충분하다. 그래서 사용자는 componentDidUpdate 에 추가 로직을 잊지 않고 넣어주어야 합니다.

훅을 사용하면 이런 류의 버그 걱정을 덜어줄 수 있습니다.

```javascript
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

```javascript
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
```

### 디펀던시 리스트에서 함수를 생략해도 안전한가요?

일반적으로는 안전하지 못합니다.

특히 해당 함수가 props를 참조하고 있다면 bug가 일어날 수 있습니다.
왜냐하면 props가 바뀌면 해당 함수를 호출하지 않기 때문입니다.
해당 함수를 생략하려면 오직 그 함수가 props나 state 그것에 파생된 값을 참조하고 있지 않을때만 안전합니다.

```javascript
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 This is not safe (it calls `doSomething` which uses `someProp`)
}
```

effect 함수 밖 함수에 의해 사용되는 state나 props를 인지하긴 힘듭니다. 그렇기 때문에 보통 effect가 필요한 함수를 안쪽에 선언할 것입니다. 그러면 컴포넌트 스코프의 어떤 값들이 effect에 의존적인지 알아보기 쉬울 것입니다.

```javascript
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (our effect only uses `someProp`)
}
```

만약에 컴포넌트 스코프에 있는 어떠한 값도 사용하지 않는다면 빈배열로 넣는것은 안전할 것입니다.

만약에 몇몇 이유로 effect 안에 함수를 이동시키기 없다면 몇몇 선택지가 있습니다.

- **해당 함수를 컴포넌트 밖으로 빼려고 노력을 하십시요.** 이런 경우에는 컴포넌트의 props, state 를 참조하고 있지 않다는 보장이 생기기 때문에 디펜던시 리스트에 있을 필요가 없습니다.

- 만약 함수가 순수함수이고 렌더링 도중에 불려도 안전하다면 **effect 밖에서 호출 하십시요.** 그리고 effect에 리턴 된 값을 의존하게 하십시요.

- 마지막은, `useCallback` 로 감싼 정의된 **함수를 effect 디펜던시에 추가** 하십시요. 이것은 useCallback에 걸어둔 디펜던시가 변경되지 않는다면 매 render 시 마다 변경되지 않음을 보장할 수 있습니다.

```javascript
function ProductPage({ productId }) {
  // ✅ Wrap with useCallback to avoid change on every render
  const fetchProduct = useCallback(() => {
    // ... Does something with productId ...
  }, [productId]); // ✅ All useCallback dependencies are specified

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct }) {
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ All useEffect dependencies are specified
  // ...
}
```

위 예제는 `ProductPage`의 `productId` prop의 변화가 `ProductDetails` 컴포넌트의 refetch를 발동 시킨다는 것을 보장합니다.

### Hooks 규칙

1. 리액트 함수의 제일 상단에 작성해야합니다.

- 조건문, 내부 함수, 반복문 안에 사용하지 않습니다.

2. 리액트 함수 안에서만 사용합니다.

- custom 함수 안에서는 예외적으로 호출 할 수 있습니다.

## React Render

React and the Virtual DOM 참고 동영상:  [https://www.youtube.com/watch?v=BYbgopx44vo](https://www.youtube.com/watch?v=BYbgopx44vo)

### version 1

- 중첩된 `Element`를 그릴수 있는 `render` 함수를 두게 된다. 여기서 `render` 는 재귀 함수를 통해 만들 수 있다.
- 초기 생각해 볼 수 있는 `render`는 계속 `DOM`을 `append`를 시키는 것이다.
- 진화된 `render`는 `root parent`에 `child`가 있다면 기존에 돔을 교체하는 `replaceChild` 를 시키는 것이다.

### version 2

- 위에서 문제는 모든 `dom`을 재 생성하기 때문에 마지막 `root parent`만 `replace`를 시킨다는 것이다. 재사용 할 수 있는 dom은 그대로 두는게 효율적일 것이다.
- 이때 `Reconciliation`이 등장한다. 새로 생성한 `element tree`와 이전 `render`된 `element tree`를 비교해서 달라진 곳만 `update`를 시킨다.
- 기존 그려졌던 `element`의 type 비교와 더불어 dom 의 재사용을 위한 새로운 개념인 `instance : {dom, element, childInstances }` 라는것을 도입
- `reconcile` 함수의 역할은 `parentDom`, 이전의 그려졌던 `instance`, 새로운 `element` 받아서 조건(새로 생성, 업데이트, 삭제)에 맞게끔 `dom` 에 그려 준다.
  - 이전에 그려놓은 `instance` 가 없다면 새로 `instance` 를 만들고 만들어진 dom 을 `append` 시킨다.
  - 새로 그려지는 `element` 가 `null` 이라면 매칭되는 `parentDom` 에서 자식들을 삭제한다.
  - 이전에 그려놓은 `instance` 의 `element type` 과 새로 그릴려는 `element type` 이 같고 `DOM Element` 라면 이전에 그려 놓은 `instance 의 dom` 에 prop 만 업데이트를 하게 됩니다. 그리고 나서 해당 `instance` 의 `children` 을 `reconcil` 을 한다. 여기서 따로 `reconcileChildren` 함수가 존재하는 이유는 `children` 이 배열 타입이기 때문이다.
  - 이전에 그려놓은 `instance` 의 `element type` 과 새로 그릴려는 `element type` 이 같고 `Component Element` 라면 컴포넌트의 인스턴스인 `public instance` 자체는 변하지 않는다. ( 때문에 컴포넌트의 state는 유지 된다. ) 그리곤 업데이트 전 라이프사이클이 호출이 되어 props가 업데이트 되고 `render()` 를 호출하게 되어 컴포넌트의 이전 엘리먼트 트리와 다음 엘리먼트 트리에 대해 diff 알고리즘을 재귀적으로 적용한다.
  - 그 외 모든 경우에는 `parenDom` 기준으로 `reconcilation` 새롭게 `instance` 를 만들어서 replace 한다.
- 이렇게 진행이 되면 다음과 같은 문제가 또 발생할 수 있다.
    - 모든 변화에 전체 virtual DOM tree를 reconciliation을 진행할 수 밖에 없다.
    - State가 글로벌 하게 존재하게 된다.
    - State를 컴포넌트 안으로 넣어 보자.
- 그래서 `class Component`가 탄생하게 된다. 이 `class 컴포넌트`의 인스턴스는 기존의 `instance` 개념과 차별을 두기 위해 `public instance`라고 명명한다.
- `public instance`에는 `setState` 메서드를 통해서 `reconciliation을` 진행하고 기존에 그려졌던 `instance를` 지니고 있기 때문에 전체가 아닌 자기 자신을 기준으로 해서 자식들로만 `reconcile` 을 할 수 있는 장점을 얻을 수 있다.

### version 3

- 여기서 또 다른 문제점을 해결하기 위해 `Fiber` 라는게 도입
- 여기서 `reconciliation` 로직은 재귀를 통해서 `Element tree` 구조의 변화를 감지하고 최종적으로 DOM을 그려낸다. 이 비용이 높아지면 브라우저의 메인 쓰레드를 잡아 먹기 때문에 동시에 다른 비싼 비용들의 로직들을 처리 해 낼수가 없다. ( 버벅이는 현상이 나타남 )
- 기존의 재귀 용법에서 `iterator`, 즉 반복문 형태로 구조를 바꾸고(tree구조를 선형적으로 바꾸게 됨) react 스케쥴링을 통해서 cpu가 idle인 경우일 때 일부 `reconcile을` 처리하고 이 반복이 모두 완료가 되었을 때, DOM에 그리게 되는 형식이다.
- 정리하면 숫자를 증가하는 버튼을 한번 눌렀을 때, 즉, 뷰 업데이트가 이뤄지길 원할 때, `update` 큐에 업데이트 정보(해당 instance와 업데이트할 state)가 들어가게 되고 해당 `update` 를 빼와서 새로운 `fiber tree` 만들게 된다. 이때 `cpu의 idle 타임`을 보면서 이벤트가 발생한 컴포넌트에서 부터 선형트리 구조를 만들면서 `update` 정보를 수집하게 된다.
- 만약에, 큐에 들어간 작업들 중에서 더 빠르게 끝나는 작업이 있다면 `cpu의 idle 타임`을 보고 그 작업부터 완료 되서 스크린에 보여 지게 될것이다.

## 참고

- [cheetsheets](https://devhints.io/react)