---
title: React Context 와 Hooks 설계
date: "2019-12-11T10:00:03.284Z"
---

# React Context 와 Hooks를 어떻게 설계 할 것인가?

React 16 버젼으로 올라오면서 Context 와 Hooks를 이용해서 store를 대체 할 수 있다는데 어떻게 쓰면 성능을 신경쓰면서 사용 할 수 있을지에 대한 고민 글입니다.

Context 나 Hooks에 대한 설명은 생략합니다.

참고 : Component 구조는 Atomic 구조로 짠다고 생각하면 됩니다. 

`atoms > molecules > organisms > template + pages`


## Hooks 와 Context의 역할

Hooks의 가장 큰 장점 중 하나는 **상태와 관련된 로직을 재사용** 할 수 있다는 것입니다. 따라서 **컴포넌트와 무관하게 관련된 상태와 로직**을 Hooks로 구현을 하도록 합니다. 특히 `custom Hooks` 를 만들어 재 활용 할 수 있다는 장점이 있습니다. 

Hooks의 단점을 꼽자면 Hooks을 가지고 있는 컴포넌트 하위로는 props로 데이터나 메서드를 내려 보낼 순 있지만 

Context는 **일정한 범위에 속한 컴포넌트 트리 간 데이터 공유** 를 쉽게 할 수 있도록 고안 된 API입니다. 필요한 컴포넌트에 일일이 props로 전달하지 않아도 Context 가 가지고 있는 값을 공유 받을 수 있다는게 가장 큰 장점입니다.

따라서 이러한 장점과 Atomic 한 Component가 만났을 때, 다음과 같이 정의 내릴 수 있을 것입니다.

- 하나의 기능에 대한 상태와 메서드들은 하나의 `custom Hooks`로 묶어 둡니다. 
- Atomic 관점에서 기능의 응집도가 높은 단위는 `organisms` 또는 `molecules` 단위가 될 수 있습니다. 
- `organisms` 과 하나의 `custom Hooks` 의 관계는 1 대 N 이 될 수 있습니다.
- `molecules` 와 하나의 `custom Hooks` 의 관계는 1 대 1 관계를 유지 합니다. 
- `Context.Provider` 로 `Context` 범위 설정은 여러 기능에서 상태를 공유해야 하는 상황인 `organisms` 또는 `pages` 단위에 매칭이 되어야 합니다.
- `Context.Provider` 는 합성 패턴을 사용하기에 여러 `Context.Provider` 를 겹쳐 사용하면 최상위 `Context.Provider`의 변경으로 인해 하위 `Context.Provider`를 포함한 `children` 컴포넌트들이 호출(Reconciliation - component가 호출되서 리턴된 Element가 이전 Element와 같은지 비교) 될 수 있으므로 주의 해야 합니다. ( 호출 자체가 비용이 많지는 않지만 Virtual Dom인 React Element를 새롭게 만들어내는 불필요한 작업을 하게 될 수도 있습니다. 사실 중요한건 React Element가 이전과 바뀌지 않게 유지하는 것입니다. )
- `pages` 단위에서는 가급적 두개 이상의 `Context.Provider`를 사용하지 않도록 `지향` 합니다.
- `organisms` 단위에서는 `useContext`로 해당 `Context` 값을 참조해 오도록 합니다. 그러기 위해선 `pages` 에서 `Context.Provider`로 주입된 값이나 `Container` 컴포넌트를 만들어 `Context.Provider`로 `organisms`을 감싸주어야 합니다.

## Hooks 사용

- Hooks는 함수형 컴포넌트에서 `상태에 따른 관련 메서드들의 응집도를 높이고 재사용성`을 위해 사용됩니다. 비교 대상은 class component에서 흔히 life cycle에 따라 관련 로직들이 흩어져 있는 모습을 볼수가 있습니다.
- 서로 연관된 상태와 기능을 가진 `custom Hooks` 를 제작해 특정 component(View)에 의존하지 않는 별도의 Hooks로 만들면 **재사용성**에 도움이 됩니다.

### 예시) 탭 UI

```javascript
import React, { useState, useMemo } from 'react'

const useTab = (tabDataList) => {
  const [tabList, setTabList] = useState(tabDataList) // [{id: 'merlin', name: 'merlin', content: <Merlin/>, actived: true}]
 
  // tab을 추가 하려 할때
  const addTabList = (tabData) => {
    setTabList([
      ...tabList,
      tabData
    ])
  }
  // 탭 눌렀을때 
  const onHandleTabClick = (tabId) => {
    // tabName 이 맞는게 있으면 그걸 true 바꾸고 나머지 false
    // 맞는게 없으면 그대로 두자.
    let newTabList = tabList
  
      if(newTabList.some(tabData => tabData.id === tabId)) {
        newTabList = tabList.map((tabData, index) => {
          tabData.actived = (tabData.id === tabId)
        
          return tabData
      })
    }
    setTabList(newTabList)
    
  }

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
    initTabList
  }
}
```

```javascript
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

- `Context` 는 단독 기능으론 관계가 없지만 서로 엮어서 기능을 해야할때 서로 가지고 있는 상태나 메서드를 **공유**해야 할 필요성이 있을 때 사용합니다.
- `Context` 에서 가지고 있는 `state`는 일반 객체가 아닌 일반 객체를 `useMemo` 감싼 객체 또는 `useState` 로 관리 합니다.
- `Context` 안에서도 자주 쓰는 기능이 있을 경우에는 `custom Hooks` 로 빼두어서 해당 `custom Hooks`를 state 관리용으로 사용합니다.


### 예시 






## 참고

- [React Hooks와 Context를 이용한 설계 패턴](https://www.huskyhoochu.com/react-pattern-hooks-and-contexts/)