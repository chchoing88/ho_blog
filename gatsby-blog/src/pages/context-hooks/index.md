---
title: React Context 와 Hooks 설계
date: "2019-12-11T10:00:03.284Z"
---

React 16 버젼으로 올라오면서 Context 와 Hooks를 이용해서 store를 대체 할 수 있다는데 Atomic 구조와 어떻게 쓰면 성능을 신경쓰면서 사용 할 수 있을지에 대한 고민 글입니다.
React Context 와 Hooks를 사용하면 zero configuration 의 장점이 있습니다.

컴포넌트는 함수형 컴포넌트로 만듭니다.

Atomic 구조 : `atoms > molecules > organisms > template + pages`

## Hooks 와 Context의 역할

Hooks의 가장 큰 장점 중 하나는 **상태와 관련된 로직을 재사용** 할 수 있다는 것입니다. 따라서 **컴포넌트와 무관하게 관련된 상태와 로직**을 Hooks로 구현을 하도록 합니다. 특히 `custom Hooks` 를 만들어 재 활용 할 수 있다는 장점이 있습니다. 

Hooks의 단점을 꼽자면 Hooks을 가지고 있는 컴포넌트 하위로는 props로 데이터나 메서드를 내려 보낼 순 있지만 자식 컴포넌트가 부모 컴포넌트에게 영향을 미치기란 어렵다. 즉, 공유하기가 어려움.

Context는 **일정한 범위에 속한 컴포넌트 트리 간 데이터 공유** 를 쉽게 할 수 있도록 고안 된 API입니다. 필요한 컴포넌트에 일일이 props로 전달하지 않아도 Context 가 가지고 있는 값을 공유 받을 수 있다는게 가장 큰 장점입니다.


## Atomic 과 Hooks, Context가 만났을때 사용 정의

- 하나의 기능에 대한 상태와 메서드들은 하나의 `custom Hooks`로 묶어 둡니다. 
- Atomic 관점에서 기능의 응집도가 높은 단위는 `organisms` 또는 `molecules` 단위가 될 수 있습니다. 
- `organisms` 과 하나의 `custom Hooks` 의 관계는 1 대 N 이 될 수 있습니다.
- `molecules` 와 하나의 `custom Hooks` 의 관계는 1 대 1 관계를 유지 합니다. 
- `Context.Provider` 로 `Context` 범위 설정은 여러 기능에서 상태를 공유해야 하는 상황인 `organisms` 또는 `pages` 단위에 매칭이 되어야 합니다.
- `pages` 단위 에서 `Context.Provider`로 공유가 필요한 값을 주입 합니다. 이때, 자주 변경이 이러나는 `Provider` 를 제일 안쪽에 위치시키도록 합니다.
- `organisms` 단위에서는 `useContext`로 해당 `Context` 값을 참조해 오도록 합니다. 

> `Context.Provider` 의 value 가 바뀌면 `useContext` 로 구독하고 있는 컴포넌트는 한번씩 호출을 하게 된다. (Reconciliation - component가 호출되서 리턴된 Element가 이전 Element와 같은지 비교) ( 호출 자체가 비용이 많지는 않지만 Virtual Dom인 React Element를 새롭게 만들어내는 불필요한 작업을 하게 될 수도 있습니다. 사실 중요한건 React Element가 이전과 바뀌지 않게 유지하는 것입니다. )

## 언제 Hooks 와 Context를 쓸까?

- 기본적으로 상태가 필요한 기능은 `Hooks` 를 사용합니다.
- **재사용**이 필요한 기능에 대해서는 `custom Hooks`를 만들어 다양한 컴포넌트에서 사용합니다.
- 상태가 **전역** 관리되어져야 할때와 서로 다른 컴포넌트 끼리의 **공유** 가 필요할 시에는 `Context`를 사용합니다.

## Hooks 사용

- Hooks는 함수형 컴포넌트에서 `상태에 따른 관련 메서드들의 응집도를 높이고 재사용성`을 위해 사용됩니다. ( 비교 대상은 class component에서 흔히 life cycle에 따라 관련 로직들이 흩어져 있는 모습을 볼수가 있습니다. )
- 서로 연관된 상태와 기능을 가진 `custom Hooks` 를 제작해 특정 component(View)에 의존하지 않는 별도의 Hooks로 만들면 **재사용성**에 도움이 됩니다.
- `computed` 한 값은 `useMemo`로 상태값을 저장해 두고, `action` 을 공유해야 하는 함수의 경우에는 `useCallback` 을 사용해서 매번 함수가 새로 만들어 지는걸 방지 합니다.
- `setState` 의 리턴된 배열이 [`상태`, `set함수`]라 했을 때 두번째 `set함수`를 사용할 때는 **함수형 업데이트** (`setXXX(preState => newState)`)를 이용하면 `상태` 값에 의존적이지 않아도 됩니다. 


### 예시) 탭 UI

```javascript
// hooks/ui.js
import React, { useState, useMemo, useCallback } from 'react'

const useTab = (tabDataList) => {
  const [tabList, setTabList] = useState(tabDataList) // [{id: 'merlin', name: 'merlin', content: <Merlin/>, actived: true}]
 
  // action 하는 함수들
  // tab을 추가 하려 할때
  const addTabList = useCallback((tabData) => {
    // 함수형 업데이트 
    setTabList(tabList => [
      ...tabList,
      tabData
    ])
  }, [])


  // 탭 눌렀을때 
  const onHandleTabClick = useCallback((tabId) => {
    // tabName 이 맞는게 있으면 그걸 true 바꾸고 나머지 false
    // 맞는게 없으면 그대로 두자.
    // 함수형 업데이트
    setTabList(tabList => {
      if(tabList.some(tabData => tabData.id === tabId)) {
        return tabList.map((tabData, index) => {
          tabData.actived = (tabData.id === tabId)
          return tabData
        })
      }
      return tabList
    })
  }, [])

  // Computed 한 값
  // 현재 탭 index 
  const currentTabIndex = useMemo(() => {
    return tabList.findIndex(tabData => tabData.actived)
  }, [tabList])
  // 전체 탭 갯수 
  const tabLength = useMemo(() => {
    return tabList && tabList.length || 0
  }, [tabList])


  return {
    currentTabIndex,
    tabLength,
    tabList,
    onHandleTabClick,
    initTabList,
    addTabList
  }
}

export { useTab }
```

```javascript
// TabWrapper.js
import React from 'react'
import { useTab } from 'hooks/ui'

const TabWrapper = () => {
  const {
    currentTabIndex,
    tabLength,
    tabList,
    onHandleTabClick,
    initTabList
    } = useTab([
    {id: 'merlin', name: 'merlin', content: <Merlin />, actived: true},
    {id: 'ho', name:'ho', content: <Ho />, actived: false}
  ])

  return (
    <>
      <TabList activedIndex={currentTabIndex} onClickTab={onHandleTabClick}>
      <TabContents activedTabContent={tabList.content}>
    </>
  )
}
```


## Context 사용

- `Context.Provider` 는 합성 패턴을 이용해서 만들어 줍니다.
- `Context` 는 단독 기능으론 관계가 없지만 서로 엮어서 기능을 해야할때 서로 가지고 있는 상태나 메서드를 **공유** 해야 할 필요성이 있을 때 사용합니다.
- `Context` 안에서도 자주 쓰는 기능이 있을 경우에는 `custom Hooks` 로 빼두어서 해당 `custom Hooks`를 `state` 관리용으로 사용합니다.
- `Context.Provider` 의 `value props`에 넘기는 값은 별도의 `Provider 컴포넌트`를 만들어 그 컴포넌트 안에 `state`를 유지하게 만들어 줍니다. 
- `Provider 컴포넌트` 안의 `state` 값은 `useState` 를 이용해서 관리합니다. 
  - 일반 객체롤 상태관리를 할 경우 Provider 컴포넌트가 호출될 때마다 이전 객체를 유지하지 못합니다. 매 새로운 객체가 만들어지게 됩니다.
  - 일반 객체를 상태관리를 했을 경우 상태가 변경되었을때 React의 재 렌더링을 진행하라는 신호를 주지 못하게 됩니다. 
- `Provider 컴포넌트` 의 `state`의 변경을 위한 메서드 공유가 필요한 경우 에는 별도의 객체를 만들어 `useMemo`로 매 호출마다 객체가 바뀌지 않게 막아줍니다. (적절한 디펜던시를 걸어주어서 디펜던시가 바뀌었을 때만 변경이 되도록 합니다.)

### 기본 포멧 예시

- TodoList 에서 'done', 'doing', 'todo' 의 리스트 갯수를 Header 에서 보여주어야 한다면 TodoList 정보를 `Context`로 관리 `Pages` 단위의 범주로 설정해야 합니다.

```javascript
// Context 기본 포멧
// TodoContext.js
import React, { useState, createContext } from 'react'

const TodoContext = createContext()

const TodoProvider = ({}) => {
  // 상태
  const [todoList, setTodoList] = useState([])
  // 액션
  const addTodo = () => {}
  const removeTodo = () => {}

  // Bad!!
  // const store = {
  //   name: 'merlin',
  //   setName: () => {}
  // }
  
  // (...)

  const todoStore = useMemo(() => ({
    todoList,
    addTodo,
    removeTodo,
  }), [todoList])

  return <TodoContext.Provider value={todoStore}>{children}</TodoContext.Provider>
}


export { TodoProvider }
export default TodoContext
```

- TodoProvider 컴포넌트 안에서 사용하는 Hooks들의 로직이 **재사용이 필요하거나 로직이 복잡해질때는 custom Hooks로 빼둡니다.**

```javascript
// useTodo.js
import React, { useState, useMemo } from 'react'

const useTodo = () => {
  const [todoList, setTodoList] = useState([])
  const addTodo = () => {}
  const removeTodo = () => {}

  // (...)

  const todoStore = useMemo(() => ({
    todoList,
    addTodo,
    removeTodo,
  }), [todoList])

  return TodoStore
}
```

```javascript
// TodoContext.js
import React, { useState, createContext } from 'react'
import useTodo from 'useTodo'

const TodoContext = createContext()

const TodoProvider = ({}) => {
  const todoStore = useTodo()

  return <TodoContext.Provider value={todoStore}>{children}</TodoContext.Provider>
}


export { TodoProvider }

export default TodoContext
```

### organisms 컴포넌트 범위에서 provider를 하면서 organisms 내에서 useContext를 사용하지 않고 재사용할 수 있도록 props로 받는 컴포넌트를 만들고 싶다면? (필요시)

```javascript
// util.js
// Context value 값을 어떻게 매핑할지 정의하는 함수와 적용할 컴포넌트를 인자로 받아 새로운 컴포넌트를 만들어 주는 HOC

export const createWithProvider = (
  Context,
  Provider
) => mapContextToProps => WrappedComponent => {

  const UseContextComponent = props => {
    const contextValue = mapContextToProps(useContext(Context))
    return <WrappedComponent {...contextValue} {...props}></WrappedComponent>
  }

  const withProvier = props => {
    return (
      <Provider>
        <UseContextComponent {...props}></UseContextComponent>
      </Provider>
    )
  }

  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'component'
  withProvier.displayName = displayName

  return withProvier
}
```

```javascript
// TodoContext.js

import React, { useState, createContext } from 'react'
import useTodo from 'useTodo'

const TodoContext = createContext()

const TodoProvider = ({}) => {
  const todoStore = useTodo()

  return <TodoContext.Provider value={todoStore}>{children}</TodoContext.Provider>
}
// Context value 값을 어떻게 매핑할지 정의하는 함수와 적용할 컴포넌트를 인자로 받아 새로운 컴포넌트를 만들어 주는 HOC
const withTodoProvider = createWithProvider(TodoContext, TodoProvider)

export { TodoProvider, withTodoProvider }

export default TodoContext
```

```javascript
// TodoContainer.js

import Todo from '../organisms/todo/Todo'
import { withTodoProvider } from '../../context/TodoContext'

// Todo organism의 props에 Context value 값을 매핑
export default withTodoProvider(({ todoList, actions }) => ({
  todoList,
  actions,
}))(Todo)

```

## React.memo 를 사용한 컴포넌트 리렌더링 방지

- `React.memo`는 higher order component로 props의 얕은 비교를 통해 리 렌더링 성능을 올립니다.
- 함수형 컴포넌트의 `props` 변경이 없다면 컴포넌트의 호출을 막아 불필요한 리 렌더링(실제 DOM에 그려지는 것이 아닌 컴포넌트 호출로 새로운 React Element 생성) 되는 것을 방지하여 렌더링 성능을 최적화 시킬 수 있습니다.
- `Atomic` 컴포넌트 단위에선 `molecules` 컴포넌트 단위에서 `React.memo`를 사용할 수 있도록 합니다. 또는 성능을 실제로 개선할 수 있는 상황에서 사용합니다.

```javascript
import React, {memo} from 'react'

const TodoItem = ({todoList, onClick}) => {
  return (
    <div>TodoItem</div>
  )
}

export default memo(TodoItem)
```

- 일반적인 얕은 비교가 아닌 `React.memo`에서 두번째 파라미터에 `propsAreEqual` 이라는 함수를 사용하여 특정 값들만 비교를 하는 것도 가능합니다. 리턴 값이 `true`(이전 props랑 다음에 들어오는 props가 같은 경우)면 리렌더링을 방지하고 `false` 면 리 렌더링을 실행합니다.

```javascript
import React, {memo} from 'react'

const TodoItem = ({todoList, onClick}) => {
  return (
    <div>TodoItem</div>
  )
}

export default memo(TodoItem, (prevProps, nextProps) => prevProps.todoList === )
```

## 참고

- [React Hooks와 Context를 이용한 설계 패턴](https://www.huskyhoochu.com/react-pattern-hooks-and-contexts/)