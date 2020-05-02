---
title: '[algorithms] Queue'
date: '2020-03-27T10:00:03.284Z'
---

## 큐의 동작

- 큐에 요소를 삽입하는 동작을 인큐(enqueue)
- 큐에서 요소를 삭제하는 동작을 데큐(dequeue)
- 인큐는 큐에 끝부분에 요소를 추가하며, 데큐는 큐의 앞부분에서 요소를 삭제한다.
- 피크(peek)는 큐의 앞부분에 있는 요소를 확인할 수 있다. 또한 요소를 반환하지는 않는다.
- length 프로퍼티를 이용하면 큐에 얼마나 많은 요소가 저장되어 있는지 확인 할 수 있다.

## 큐 구현

```typescript
class Queue<T> {
  dataStore: T[];

  constructor(dataStore?: T[]) {
    this.dataStore = dataStore || [];
  }

  get length() {
    return this.dataStore.length;
  }

  enqueue(element: T) {
    this.dataStore.push(element);
  }

  dequeue() {
    return this.dataStore.shift();
  }

  // 큐의 앞부분의 요소를 확인한다.
  front() {
    return this.dataStore[0];
  }

  // 큐의 끝부분의 요소를 확인한다.
  back() {
    return this.dataStore[this.dataStore.length - 1];
  }

  toString() {
    return this.dataStore.join("\n");
  }

  // 큐가 비었는지 안비었는지 확인한다.
  empty() {
    if (this.dataStore.length === 0) return true;
    return false;
  }

  [Symbol.iterator]() {
    let position = -1;
    const dataList = this.dataStore;
    const length = this.length;
    return {
      next() {
        position = position + 1;
        return {
          value: dataList[position],
          done: position >= length
        };
      }
    };
  }
}

```

## 예제

1. 큐로 데이터 정렬하기 (기수정렬)

기수 정렬은 두 번의 과정을 걸쳐 데이터를 정렬한다. 우리는 0 부터 99 사이의 정수 데이터를 사용한다.
첫 번째 과정에서는 1의 자리 숫자를 기준으로 숫자를 정렬하고 , 두 번째 과정에서는 10의 자리 숫자를 기주능로 데이터를 정렬한다.

```typescript
type DigitType = 1 | 10;
const sampleList = [10, 29, 40, 50, 32, 54, 34, 56, 23, 97, 78];

// digit 정렬 기준 자릿수
function distribute(targetList: number[], digit: DigitType) {
  const result: Queue<number>[] = new Array(10).fill(1).map(_ => new Queue());

  targetList.forEach(num => {
    if (digit === 1) {
      const rest = num % 10;
      result[rest].enqueue(num);
    } else {
      const rest = Math.floor(num / 10);
      result[rest].enqueue(num);
    }
  });

  return result;
}

function collect(queueList: Queue<number>[]) {
  return queueList.flatMap(queue => {
    // return queue.dataStore
    const queueDataList = [];
    for (const value of queue) {
      queueDataList.push(value);
    }
    return queueDataList;
  });
}

const firstQueue = distribute(sampleList, 1);
const firstCollectList = collect(firstQueue);
const secondQueue = distribute(firstCollectList, 10);
const result = collect(secondQueue);

console.log("sampleList", sampleList);
console.log("result", result);
```

2. 우선순위 큐

보통 큐에서 요소를 삭제할 때는 먼저 삽입한 요소부터 삭제된다. 하지만 이러한 선입선출 방식이 아닌 우선순위와 같은 다른 기준으로 요소를 삭제해야하는 경우도 있다. 이럴때는 우선순위 큐라는 자료구조를 이용한다.

```typescript
// 기존 queue 에서 dequeue를 수정해 준다.
// 다음과 같은 큐에 들어갈 element가 있다고 가정하자.

class Job {
  name: string
  code: number

  constructor(name:string, code:number) {
    this.name = name;
    this.code = code;
  }
}

const queue = new Queue<Job>()

// 기존 큐에서 dequeue는 다음과 같이 수정해 준다.
class Queue {
  // (...)
  dequeue() {
     const targetIndex = this.dataStore.reduce((resultIndex, elem, index) => {
      if(resultIndex > elem.code) {
        return index
      }
      return resultIndex
    },0)
  }
}

```
