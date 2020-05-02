---
title: '[algorithms] List'
date: '2020-03-26T10:00:03.284Z'
---

## 용어

- 리스트 : 순서가 있는 일련의 데이터 집합
- 요소 : 리스트에 저장된 각 데이터 항목
- 길이 : 리스트에 저장된 요소의 수

## 동작

- append : 리스트 끝에 추가
- insert : 기존 요소 뒤 또는 요소의 앞 부분에 삽입
- remove : 요소를 삭제
- clear : 리스트의 모든 요소를 삭제
- toString : 요소 출력
- getElement : 현재 요소의 값만 출력
- next : 리스트의 현재 요소에서 다음 요소로 이동
- prev : 현재 요소에서 이전 요소로 이동
- moveTo(n) : n번째 위치로 한번에 이동
- currPos : 리스트의 현재 위치를 가리킨다.

## 코드

```typescript
class List<T> {
  listSize: number;
  pos: number;
  dataStore: T[];

  constructor() {
    this.listSize = 0;
    this.pos = 0;
    this.dataStore = []; // 리스트 요소를 저장할 빈 배열 초기화
  }

  get Length() {
    return this.listSize;
  }

  clear() {
    this.dataStore = [];
    this.listSize = 0;
    this.pos = 0;
  }

  findIndex(element: T) {
    return this.dataStore.findIndex(elem => elem === element);
  }

  insert(newElement: T, afterElement: T) {
    const startAt = this.findIndex(afterElement);
    if (startAt > -1) {
      this.dataStore.splice(startAt + 1, 0, newElement);
      this.listSize = this.listSize + 1;
      return true;
    }

    return false;
  }

  append(element: T) {
    this.dataStore[this.listSize++] = element;
  }

  remove(element: T) {
    const foundAt = this.findIndex(element);
    if (foundAt > -1) {
      this.dataStore.splice(foundAt, 1);
      this.listSize = this.listSize - 1;
      return true;
    }

    return false;
  }

  front() {
    this.pos = 0;
  }

  end() {
    this.pos = this.listSize - 1;
  }

  prev() {
    if (this.pos > 0) {
      this.pos = this.pos - 1;
    }
  }

  next() {
    if (this.pos < this.listSize - 1) {
      this.pos = this.pos + 1;
    }
  }

  currPos() {
    return this.pos;
  }

  moveTo(position: number) {
    this.pos = position;
  }

  getElement() {
    return this.dataStore[this.pos];
  }

  // 리스트에 특정 element가 있는지 판단.
  contains(element: T) {
    return !!this.dataStore.find(elem => elem === element);
  }

  // 현재 리스트의 모든 요소보다 클 때만 삽입하는 함수 (숫자는 큰값, 문자는 알파벳순으로 나중을 의미)
  isBigElementThanEveryListElement(element: T) {
    return this.dataStore.every(elem => {
      if (typeof elem === "string" && typeof element === "string") {
        return element.toLowerCase() > elem.toLowerCase();
      }

      return element > elem;
    });
  }
}
```
