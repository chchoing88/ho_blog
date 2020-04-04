---
title: React 뒤로가기 시 이전 상태 유지를 위한 history
date: "2020-04-04T10:00:03.284Z"
---

React SPA 구축시 뒤로가기 눌렀을때 이전 상태를 유지하도록 해야하는 일이 생겼었다. 이때, 어떻게 구축 했었는지를 기록해보자.

별도의 써드파티의 state management는 사용하지 않았다.

## 1차 도전 (Context)

history 의 정보는 어느 컴포넌트에나 적용이 될 수 있어야 하기 때문에 Context가 떠올랐습니다.

history 정보에 필요했던 것들은 다음과 같았습니다.

- preItemsCount : 해당 페이지의 items들을 몇개까지 불러왔는지 파악.
- scrollTop : 해당 페이지의 어느 스크롤까지 위치 했었는지 파악.
- pageName : 어느 페이지의 정보인지 파악.

추가적으로 어느 히스토리를 사용해야 할지 currentIndex 도 두었었지만 이것은 해당 컴포넌트에게 어느 히스토리를 사용할지 맡겨두기로 했습니다. ( 처음엔 이 currentIndex 가 변할때마다 자꾸 렌더링이 시도 되는 현상 때문에 고생했습니다. )

```typescript
import React, { createContext, Dispatch, useReducer, useContext } from "react";

type HistoryContextProviderProps = {
  children: React.ReactNode;
};
export interface IHistoryItem {
  preItemsCount: number;
  scrollTop: number;
  pageName: string;
}
export interface IHistoryState {
  historyList: IHistoryItem[];
  // currentIndex: number;
}

type Action = { type: "PUSH"; historyItem: IHistoryItem } | { type: "POP" };
export type HistoryDispatch = Dispatch<Action>;

const HistoryStateContext = createContext<IHistoryState>({
  historyList: []
  // currentIndex: -1
});

const HistoryDispatchContext = createContext<HistoryDispatch | undefined>(
  undefined
);

function historyReducer(state: IHistoryState, action: Action) {
  switch (action.type) {
    case "PUSH":
      return {
        ...state,
        historyList: state.historyList.concat([action.historyItem])
        // currentIndex: state.currentIndex + 1
      };
    case "POP":
      return {
        ...state
        // currentIndex: state.currentIndex < 0 ? -1 : state.currentIndex - 1
      };
    default:
      return state;
  }
}

export function HistoryContextProvider({
  children
}: HistoryContextProviderProps) {
  const [historyState, dispatch] = useReducer(historyReducer, {
    historyList: []
    // currentIndex: -1
  });

  return (
    <HistoryDispatchContext.Provider value={dispatch}>
      <HistoryStateContext.Provider value={historyState}>
        {children}
      </HistoryStateContext.Provider>
    </HistoryDispatchContext.Provider>
  );
}

export function useHistoryState() {
  const state = useContext(HistoryStateContext);
  return state;
}

export function useHistoryDispatch() {
  const dispatch = useContext(HistoryDispatchContext);
  if (!dispatch) throw new Error("HistoryDispatchContext value not found");
  return dispatch;
}
```

## 1차 도전의 문제

위 코드는 나름 잘 동작은 하였지만 제가 생각한대로 동작하지 않았습니다.

이유는 다음과 같았습니다.

currentIndex 도 마찬가지지만 이 history Context의 historyList 에 컴포넌트가 unmount 될시에 적제가 되도록 작성해 두었습니다.
그리곤 페이지 이동이 끝난 상태에서 historyList를 참고하도록 하였습니다.

하지만 Context의 상태 값을 변경 한다는 것은 Consumer 들이 다시 리 렌더링을 뜻하는 것이고, 마운트 될때 Context의 상태 변경 해둔 것이 마운트 된 이후에 historyList에 적용 과 리 렌더링이 되면서 예상과는 다르게 움직 였었습니다.

정리하면 다음과 같은 문제가 발생했습니다.

- 불필요한 리 렌더링
- 2번 리렌더링 (페이지 이동 + Context 상태변경)이 되면서 같은 페이지에서 다른 history를 참고 하고 있음

## 2차 도전 (static store + Context)

1차 문제를 해결하기 위해서 Context 상태 변경에 의한 렌더링을 피해야만 된다는 생각을 했습니다.

그래서 history store를 **유일한 객체**로 만들어야 겠다는 생각을 했고, 이 객체가 변해도 React가 반응하지 않아야 되도록 별도의 store를 만들었습니다.

또한 이 history store 의 메서드와 프로퍼티들을 props로 타고 내려 보내는 것이 아닌 필요한 곳에 쉽게 사용할 수 있도록 Context를 혼합 했습니다.

다음은 history store 객체 입니다.

```typescript
export interface IHistoryItem {
  preItemsCount: number;
  scrollTop: number;
  pageName: string;
}

class HistoryStore {
  historyList: IHistoryItem[];
  // currentIndex: number;

  constructor() {
    this.historyList = [];
    // this.currentIndex = -1;
  }

  // get currentHistory() {
  //   if (this.currentIndex < 0) {
  //     return null;
  //   }
  //   return this.historyList[this.currentIndex - 1];
  // }

  getRecentPageHistory(pageName: string) {
    const matchPageNameHistoryList = this.historyList.filter(
      history => history.pageName === pageName
    );
    if (matchPageNameHistoryList.length > -1) {
      return matchPageNameHistoryList[matchPageNameHistoryList.length - 1];
    }

    return null;
  }

  isMatchPageNameHistory(pageName: string) {
    return this.historyList.some(history => history.pageName === pageName);
  }

  pushHistory(historyItem: IHistoryItem) {
    this.historyList.push(historyItem);
    // this.currentIndex = this.currentIndex + 1;
  }
}

export default HistoryStore;
```

초반에는 `currentIndex` 를 두어서 위에서 했던 것처럼 컴포넌트들이 어떤 히스토리를 봐야 하는지 알려주는 지표로써 사용을 하려고 했지만 후반부에는 그것 보다는 현재 접속한 pageName에서 historyList 에서 일치된 가장 최근 pageName의 history를 빼와서 적용하도록 하였습니다.

다음은 이런 히스토리를 다양한 뎁스의 컴포넌트에서 사용할 수 있도록 Context를 수정하였습니다.

```typescript
import React, { createContext, useContext } from "react";

import HistoryStore from "staticStore/HistoryStore";

type HistoryContextProviderProps = {
  children: React.ReactNode;
};

const historyStore = new HistoryStore();

const HistoryStateContext = createContext<HistoryStore>(historyStore);

export function HistoryContextProvider({
  children
}: HistoryContextProviderProps) {
  return (
    <HistoryStateContext.Provider value={historyStore}>
      {children}
    </HistoryStateContext.Provider>
  );
}

export function useHistoryStore() {
  const state = useContext(HistoryStateContext);
  return state;
}
```

Context는 훨씬 간단해 졌습니다.

## 정리

생각을 하다하다 몇번의 도전만에 예상대로 움직이긴 했습니다. 이 방법 말고도 React SPA에서 react-router-dom의 location props의 state를 이용해볼까도 생각했지만 복잡한 state를 location에 다루기에는 투머치(?) 한 생각이 들어서 따로 빼는 방식을 생각해보았습니다.

추가적으로 다른 방식들이 있는지 고민을 추가적으로 해보아야 겠습니다.
