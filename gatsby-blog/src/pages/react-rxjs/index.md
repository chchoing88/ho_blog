---
title: React with RxJS
date: "2020-01-14T10:00:03.284Z"
---


## 동기

- react와 rxjs를 함께 사용할 때 어떻게 사용 할 수 있을까?

## React 컴포넌트를 update 할 수 있는 트리거들

- function Component 의 hooks (useState, useEffect, useReducer 등등..)
- class Component 의 setState 메서드
- forceUpdate() 메서드

## React hooks 역할

- 상태값의 저장
- component의 lifecycle에 대한 반응
- 상태 변화에 따른 재 렌더링 유발

## RxJS의 Subject

- `Subject` 는 `EventEmitter` 와 같다.
- 여러 관찰자에게 멀티 캐스팅 하는 유일한 방법.
- `Subject` 는 `observable` 이고 `observer` 다.
- `Subject` 는 `observable` 과 많은 `observer` 들 사이에서 bridge/proxy 형태로 행동할수 있다.
- 이 행동은 다수의 `observer` 들에게 같은 `observable` 실행을 공유 할수가 있다.
- 뒤 늦게 `subscribe` 를 하면 가장 최근 방출된 값을 가져올 수 있다.

## store를 외부로 따로 관리할 경우

### data의 흐름

- 전역에서 필요한 `state`는 외부에서 관리한다.
- 이 `state`가 변하는걸 알리기 위해 `Observable`로 만들어 준다. (`BehaviorSubject`)
- 관찰이 필요한 react function Component에서는 `BehaviorSubject`(이때는 `Observable` 역할) 값을 구독하고 해당 값을 `useState`로 관리한다. ( 이를 도와줄 custom Hooks를 만든다. : `useObservable` )
- `state`가 새롭게 바뀌었을 때 `setState` 로 `useState`의 `state` 변경함으로써 react function Component 에서 업데이트가 발생 되게 된다. 
- 전역 `state` 값을 바꾸기 위해서는 `BehaviorSubject`(이때는 `Observer` 역할) 값을 가지고 `next(value)` 메서드를 호출한다.

### 예시 코드

```javascript
// hooks (useObservable)
import { useState, useEffect } from "react";
import * as Rx from "rxjs";

function useObservable<T>(observable: Rx.Observable<T>) {
  const [state, setState] = useState();

  useEffect(() => {
    const sub = observable.subscribe(setState);
    return () => sub.unsubscribe();
  }, [observable]);

  return state;
}

// 종료 시점, pipe,

export default useObservable;
```

```javascript
// store
import { ITodoItem, ITodoStore } from "../types";
import { BehaviorSubject } from "rxjs";

class TodoItem implements ITodoItem {
  todo: string;
  isActive: boolean;

  constructor(todo: string, isActive: boolean) {
    this.todo = todo;
    this.isActive = isActive;
  }
}

class TodoStore implements ITodoStore {
  todoList$: BehaviorSubject<ITodoItem[]>;

  constructor(todoList: ITodoItem[]) {
    this.todoList$ = new BehaviorSubject(todoList);
  }

  // action
  addTodo = ({ todo, isActive }: ITodoItem) => {
    const newTodo = new TodoItem(todo, isActive);
    const newTodoList = [...this.todoList$.value, newTodo];

    this.todoList$.next(newTodoList);
  };
}

const TODO_LIST: ITodoItem[] = [
  { todo: "typescript 학습하기", isActive: false }
];

const todoStore: ITodoStore = new TodoStore(TODO_LIST);

export default todoStore;

```

```javascript
// react function component
// Todo
import React from "react";
import TodoList from "./TodoList";
import useObservable from "../hooks/useObservable";
import todoStore from "../store/TodoStore";
import { ITodoItem } from "../types";

function Todo() {
  const todoList = useObservable<ITodoItem[]>(todoStore.todoList$);

  return <TodoList todoList={todoList}></TodoList>;
}

export default Todo;

```

```javascript
// TodoList
import React from "react";
import TodoItem from "./TodoItem";
import { ITodoItem } from "../types";

type TodoListProps = {
  todoList: ITodoItem[];
};

function TodoList({ todoList }: TodoListProps) {
  return (
    <ul>
      {todoList.map((todoItem: ITodoItem) => (
        <TodoItem key={todoItem.todo} todoItem={todoItem}></TodoItem>
      ))}
    </ul>
  );
}

TodoList.defaultProps = {
  todoList: []
};

export default TodoList;
```

```javascript
// TodoItem
import React from "react";
import { ITodoItem } from "../types";

type TodoItemProps = {
  todoItem: ITodoItem;
};

function TodoItem({ todoItem }: TodoItemProps) {
  return <li>{todoItem.todo}</li>;
}

export default TodoItem;

```

## store를 외부로 따로 두지 않고 hooks로 관리 할 경우

### React hooks 규칙

상태를 저장하는 custom hooks 을 만들 경우 내부에는 rxjs 코드가 없도록 유지합니다. 이유는 이런 hooks들은 rxjs의 디펜던시를 두지 않고 재 사용성을 특징으로 만들기 위함입니다.

대신 rxjs를 다뤄야 하는 custom hooks는 따로 만듭니다.

### rxjs 역할

- hooks에 저장된 상태에 따른 비동기 처리와 같은 side effect(부수효과) 처리 로직
ex) API 호출, location 허용

### side effect를 rxjs로 다룰때의 장점

- 언제 발생될지 모르는 데이터 또는 연속된 데이터 스트림을 다루기에 용이
ex) 연속된 같은 API 호출에서 가장 최신 호출의 데이터를 가져와서 view에 반영

- 여러 side effect를 모아서 일괄 처리에 용이
ex) 여러 API 호출의 응답이 다 모였을 때 view 반영 및 에러처리

### 예시 코드

```ts
// useTab.ts

import { useState, useCallback, useMemo } from "react";
import { ITabItem } from "types";
import { setActiveByID } from "utils";

function useTab<T>(tabDataList: ITabItem<T>[]) {
  const [tabList, setTabList] = useState<ITabItem<T>[]>(tabDataList);
  // Computed 한 값
  // 현재 탭 객체
  const currentTabData = useMemo(() => {
    const activeIndex = tabList.findIndex(tabData => tabData.isActive);
    return tabList[activeIndex];
  }, [tabList]);

  // 탭 눌렀을때
  const onHandleTabClick = useCallback(
    (tabId: T): void => {
      if (currentTabData.id !== tabId) {
        setTabList(setActiveByID<ITabItem<T>, T>(tabId));
      }
    },
    [currentTabData]
  );

  return {
    currentTabData,
    tabList,
    onHandleTabClick
  };
}

export default useTab;
```

```ts
// useApiObservable.ts

import { useState, useEffect, useRef } from "react";
import { Observable, Subject } from "rxjs";

import { switchMap, tap, filter } from "rxjs/operators";
import { IAPIResponse } from "types";

function useApiObservable<T>(
  api$: (value: T) => Observable<IAPIResponse>
): [IAPIResponse, Subject<T>] {
  const [state, setState] = useState<IAPIResponse>({
    success: null,
    error: null,
    isLoading: false
  });

  const { current: subject$ } = useRef(new Subject<T>());

  useEffect(() => {
    const sub = subject$
      .pipe(
        filter(triggerData => triggerData !== null),
        tap(_ =>
          setState(beforeState => ({
            success: beforeState.success,
            error: beforeState.error,
            isLoading: true
          }))
        ),
        switchMap(value => api$(value))
      )
      .subscribe(setState);

    return () => sub.unsubscribe();
  }, [subject$, api$]);

  // return { ...state, subject$ };
  return [state, subject$];
}

export default useApiObservable;
```

```ts
// 사용
 const { tabList, onHandleTabClick, currentTabData } = useTab(
    TAB_OCCUPANCY_LIST
  );
  const [occupancyState, subject$] = useApiObservable<
    IOccupancyApiFetchParameter
  >(occupancyApi.fetch);

  // currentTabData가 변경 되었을 때 api 스트림에 값 방출
  useEffect(() => {
    subject$.next({
      type: currentTabData.id
    });
  }, [subject$, currentTabData]);
```

## 추가적으로 고려해야 할 점

- 다양한 종류의 rxjs 의 operation 조합을 pipe로 따로 관리하자.
- 어느 때고 필요하다면 구독을 취소 시킬 수 있어야 한다.

## 참고

- [https://www.bitovi.com/blog/rxjs-with-react-pt-1](https://www.bitovi.com/blog/rxjs-with-react-pt-1)

## 전체 코드 (store 외부에 두었을 때만)

- [https://github.com/chchoing88/ts-react](https://github.com/chchoing88/ts-react)