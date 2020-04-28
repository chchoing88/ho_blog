---
title: Order Algorithms
date: '2020-04-28T10:00:03.284Z'
---

## 버블 정렬

- 버블 정렬은 가장 느린 정렬 알고리즘 가운데 하나 입니다.
- 배열의 데이터를 정렬할 때 배열의 한쪽 끝에서 다른 쪽 끝으로 버블처럼 값이 떠오른다는 의미에서 버블 정렬이라는 이름이 유래했습니다.
- 어떤 데이터 집합을 오름차순으로 정렬하면 큰 값은 배열의 오른쪽으로 이동해야 하고 작은 값은 배열의 왼쪽으로 이동해야 합니다.
- 배열의 데이터를 여러 번 반복적으로 탐색하면서 인접한 값을 서로 비교해 왼쪽 값이 오른쪽 값보다 크다면 두 값을 서로 바꿔야 합니다.
- 한번 버블 정렬 될때마다 맨 끝의 숫자가 정렬이 된것 입니다.
- 맨 마지막 element를 빼고 다시 버블 정렬을 시작한다. 남은 element가 1개 이상일때까지 반복한다.

```typescript
// 배열을 생성하는 테스트 베드 클래스

class CArray {
  dataStore: number[];
  numElements: number;
  pos: number;

  constructor(numElements: number) {
    this.pos = 0; // 빈공간
    this.dataStore = [];
    this.numElements = numElements;

    for (let i = 0; i < numElements; i++) {
      this.dataStore[i] = i;
    }
    this.pos = numElements;
  }

  setData() {
    for (let i = 0; i < this.numElements; i++) {
      // Math.random() : 0 ~ 1
      // 0 ~ 1 * 101 => 1 ~ 100 임의수 생성
      this.dataStore[i] = Math.floor(Math.random() * (this.numElements + 1));
    }
  }

  clear() {
    this.dataStore.forEach((i) => (i = 0));
    this.pos = 0;
  }

  insert(element: number) {
    this.dataStore[this.pos++] = element;
  }

  toString() {
    let retstr = "";
    this.dataStore.forEach((i, index) => {
      retstr += `${i} `;
      if (index > 0 && index % 10 === 0) {
        retstr += `\n`;
      }
    });

    return retstr;
  }

  swap(arr: any[], index1: number, index2: number) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
  }

  // 버블 정렬
  // 한번 버블 정렬 될때마다 맨 끝의 숫자가 정렬이 된것이다.
  // 맨 마지막 element를 빼고 다시 버블 정렬을 시작한다.
  // 남은 element가 1개 이상일때까지 반복한다.
  bubbleSort() {
    for (let outer = this.dataStore.length - 1; outer > 1; outer--) {
      for (let i = 0; i < outer; i++) {
        if (this.dataStore[i] > this.dataStore[i + 1]) {
          this.swap(this.dataStore, i, i + 1);
        }
      }
    }
  }
}
```

## 선택 정렬

- 선택 정렬은 배열의 처음 요소부터 차례로 값을 비교합니다.
- 모든 요소의 비교가 끝난 시점에는 가장 작은 요소가 배열의 첫번째로 옵니다.
- 다음에는 두 번째 자리에 올 요소를 정렬하는 식입니다. 배열의 마지막 요소가 자기 위치로 올 때까지 반복합니다.
- 외부 루프는 배열의 첫 번째 요소에서 마지막 요소를 반복합니다. 내부 루프는 배열 요소의 두 번째 요소에서 마지막 요소를 반복하면서 외부 루프가 가리키는 현재 요소보다 작은 요소가 있는지 확입합니다.
- 즉, 첫번째 자리를 기준으로 가장 작은 숫자가 오게 만들고, 두번째 자리는 그 이후 숫자에서 가장 작은 숫자가 오게 만듭니다.

```typescript
// 선택 정렬
// 첫번째 자리에 제일 작은 숫자가 오게 한 다음
// 두번째 자리에 제일 작은 숫자가 오도록 계속 정렬한다.
selectionSort() {
  for (let pos = 0; pos < this.dataStore.length - 1; pos++) {
    // minPos 작은 수가 저장되어있는 index
    let minPos = pos;
    for (let i = pos + 1; i < this.dataStore.length; i++) {
      if (this.dataStore[i] < this.dataStore[minPos]) {
        minPos = i;
      }
    }
    this.swap(this.dataStore, pos, minPos);
  }
}
```

## 삽입 정렬

- 사람이 자료를 숫자나 문자순으로 정렬할 때 사용하는 방법과 비슷하다.
- 외부 루프는 배열의 요소를 하나씩 반복하며, 내부 루프는 외부 루프에서 선택한 요소를 배열의 다음 요소와 비교한다. 외부 루프에서 선택한 요소가 내부 요소에서 선택한 요소보다 작으면 배열 요소를 오른쪽으로 시프트해서 내부 루프 요소를 삽입할 공간을 마련한다.
- 두번째 원소부터 앞에 있는 원소들과 비교해서 정렬을 하는 방법이 삽입 정렬입니다.

```typescript
// 삽입 정렬
// 두번째 요소부터 시작해서 ( 첫번째 요소는 자동 삽입 되었다고 생각하고 )
// 선택된 요소 왼쪽에 있는 요소들을 전부 비교해서 자신이 있어야 할 자리를 선정합니다.
// 이때 무조건 전부 비교하지 않고 하나씩 정렬해서 넣기 때문에 이전 요소가 큰지 안큰지만 보면 된다.
insertionSort() {
  for (let pos = 1; pos < this.dataStore.length; pos++) {
    // pos 이전 요소들 확인
    const targetElement = this.dataStore[pos];
    let tempPos = pos;
    while (tempPos > 0 && this.dataStore[tempPos - 1] > targetElement) {
      // 이전 요소가 더 크다면 하나씩 땡긴다.
      this.dataStore[tempPos] = this.dataStore[tempPos - 1];
      tempPos = tempPos - 1;
    }

    this.dataStore[tempPos] = targetElement;
  }
}
```

## 쉘 정렬

- 쉘 정렬의 핵심은 삽입 정렬 처럼 근접한 요소가 아니라 멀리 떨어진 요소와 현재 요소를 비교한다는 점이다.
- 삽입 정렬에 비해 좀 더 효율적으로 멀리 떨어진 요소를 제자리로 이동시킬 수 있다.
- 데이터 집합의 각 요소를 반복해서 작업하면서 각 요소 간의 거리는 점점 줄어든다. 마지막에는 결국 인접한 요소를 비교한다.
- 쉘 정렬에서는 가장 먼저 요소가 얼마나 멀리 떨어져 있는가를 가리키는 갭 시퀀스를 정의해야 한다.
- 정적 시퀀스로는 마신 시우라(Marcin Ciura)가 소개한 갭 시퀀스를 이용한다. 마신 시우라 갭 시퀀스는 701, 301, 132, 57, 23, 10, 4, 1 이다.
- 동적 시퀀스로는 로버드 세지윅(Robert Sedgewick) 은 쉘 정렬에서 사용할 갭 시퀀스를 동적으로 계산합니다.

```javascript
// 동적 시퀀스 공식

const N = this.dataStore.length;
let h = 1
// 초기 시퀀스 h 값
while(h < N/3) {
  h = 3 * h + 1;
}
// 시퀀스 한번 루프 돌고 나서...
// 다음 시퀀스 구하는 공식
h = (h-1) / 3;

// ex N = 10 => [4, 1] 시퀀스
```

```typescript
shellSort() {
  const N = this.dataStore.length;
  let h = 1;
  // 초기 시퀀스 설정
  while (h < N / 3) {
    h = 3 * h + 1;
  }

  // 시퀀스 별로 정렬
  while (h >= 1) {
    // 시퀀스 부터 시작해서 하나씩 오른쪽으로 이동해서 확인한다.
    for (let i = h; i < N; i++) {
      // 왼쪽 시퀀스 사이즈 만큼 떨어진 값과 비교한다.
      // 왼쪽에 시퀀스 만큼 떨어진 값이 크다면 바꾸고 다시 왼쪽 시퀀스 만큼 떨어진 값과 비교한다.
      for (
          let j = i; // 초기 시퀀스 설정
          j >= h && this.dataStore[j] < this.dataStore[j - h]; // j 값이 시퀀스 만큼 있고 왼쪽 값이 작다면ㄴ
          j = j - h // 시퀀스 만큼 떨어진 왼쪽 값 확인
        ) {
          this.swap(this.dataStore, j, j - h);
        }ㄴ
    }

    // 다음 시퀀스 구하는 공식
    h = (h - 1) / 3;
  }
}
```

## 머지 정렬

- 

## 퀵 정렬


