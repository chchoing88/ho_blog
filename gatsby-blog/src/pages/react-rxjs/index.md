---
title: React with RxJS
date: "2020-01-14T10:00:03.284Z"
---

# React with RxJS

## 동기

- class로 store를 구성하고 이 store 값들을 RxJS로 React에 주입 하자.
- RxJS로 store의 데이터를 필요한 컴포넌트로 바로 전달 하자.

## 배경

### React 컴포넌트를 update 할 수 있는 트리거들

- function Component 의 hooks (useState, useEffect, useReducer 등등..)
- class Component 의 setState 메서드
- forceUpdate() 메서드

### RxJS의 Subject

- `Subject` 는 `EventEmitter` 와 같다. 
- 여러 관찰자에게 멀티 캐스팅 하는 유일한 방법.
- `Subject` 는 `observable` 이고 `observer` 다. 
- `Subject` 는 `observable` 과 많은 `observer` 들 사이에서 bridge/proxy 형태로 행동할수 있다. 
- 이 행동은 다수의 `observer` 들에게 같은 `observable` 실행을 공유 할수가 있다.
- 뒤 늦게 `subscribe` 를 하면 가장 최근 방출된 값을 가져올 수 있다.

## data의 흐름

- 전역에서 필요한 `state`는 외부에서 관리한다. 
- 이 `state`가 변하는걸 알리기 위해 `Observable`로 만들어 준다. (`BehaviorSubject`)
- 관찰이 필요한 react function Component에서는 `BehaviorSubject`(이때는 `Observable` 역할) 값을 구독하고 해당 값을 `useState`로 관리한다. ( 이를 도와줄 custom Hooks를 만든다. : `useObservable` )
- `state`가 새롭게 바뀌었을 때 `setState` 로 `useState`의 `state` 변경함으로써 react function Component 에서 업데이트가 발생 되게 된다. 
- 전역 `state` 값을 바꾸기 위해서는 `BehaviorSubject`(이때는 `Observer` 역할) 값을 가지고 `next(value)` 메서드를 호출한다.

## 관련 코드 

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

## 추가 고민

- 다양한 종류의 rxjs 의 operation 조합을 pipe로 따로 관라하자.
- 어느 때고 필요하다면 구독을 취소 시킬 수 있어야 한다.

## 참고 

- [https://www.bitovi.com/blog/rxjs-with-react-pt-1](https://www.bitovi.com/blog/rxjs-with-react-pt-1)

## 전체 코드

- [https://github.com/chchoing88/ts-react](https://github.com/chchoing88/ts-react)