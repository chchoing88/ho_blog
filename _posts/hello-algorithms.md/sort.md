---
title: "[algorithms] Sort"
date: "2020-04-28T10:00:03.284Z"
---

## 버블 정렬

- 버블 정렬은 가장 느린 정렬 알고리즘 가운데 하나 입니다.
- 배열의 데이터를 정렬할 때 배열의 한쪽 끝에서 다른 쪽 끝으로 버블처럼 값이 떠오른다는 의미에서 버블 정렬이라는 이름이 유래했습니다.
- 어떤 데이터 집합을 오름차순으로 정렬하면 큰 값은 배열의 오른쪽으로 이동해야 하고 작은 값은 배열의 왼쪽으로 이동해야 합니다.
- 배열의 데이터를 여러 번 반복적으로 탐색하면서 인접한 값을 서로 비교해 왼쪽 값이 오른쪽 값보다 크다면 두 값을 서로 바꿔야 합니다.
- 한번 버블 정렬 될때마다 맨 끝의 숫자가 정렬이 된것 입니다.
- 맨 마지막 element를 빼고 다시 버블 정렬을 시작합니다. 남은 element가 1개 이상일때까지 반복합니다.
- 저울을 맨 앞에다가 두고 좌우에 있는 숫자를 비교해서 왼쪽에 있는 값이 오른쪽에 있는 값보다 크다면 swap 시켜 줍니다.

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
      // 정렬할 타겟 인덱스 outer
      // outer for 문이 한번 돌때마다 outer 자리는 가장 큰 값이 자리 잡게 되면서 정렬이 된다.
      for (let i = 0; i < outer; i++) {
        // 양쪽 저울을 비교해가면서 큰 숫자를 오른쪽으로 보낸다.
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
- 즉, 선형 탐색을 통해서 첫번째 자리를 기준으로 가장 작은 숫자가 오게 만들고, 두번째 자리는 그 이후 숫자에서 가장 작은 숫자가 오게 만듭니다.
- 반복적으로 작은 숫자를 정렬이 될 타겟 index에 오게 만듭니다.

```typescript
// 선택 정렬
// 첫번째 자리에 제일 작은 숫자가 오게 한 다음
// 두번째 자리에 제일 작은 숫자가 오도록 계속 정렬한다.
selectionSort() {
  for (let pos = 0; pos < this.dataStore.length - 1; pos++) {
    // pos는 정렬 될 인덱스 타겟이 됩니다.
    // minPos 작은 수가 저장되어있는 index
    // 정렬 될 인덱스가 가장 작은수라고 가정하고
    let minPos = pos;
    for (let i = pos + 1; i < this.dataStore.length; i++) {
      // pos 인덱스에 들어있는 값보다 작은 값을 찾아냅니다.
      if (this.dataStore[i] < this.dataStore[minPos]) {
        minPos = i;
      }
    }
    // 찾아낸 값을 swap 시킵니다.
    this.swap(this.dataStore, pos, minPos);
  }
}
```

## 삽입 정렬

- 사람이 자료를 숫자나 문자순으로 정렬할 때 사용하는 방법과 비슷하다.
- 외부 루프는 배열의 요소를 하나씩 반복하며, 내부 루프는 외부 루프에서 선택한 요소를 배열의 다음 요소와 비교한다. 외부 루프에서 선택한 요소가 내부 요소에서 선택한 요소보다 작으면 배열 요소를 오른쪽으로 시프트해서 내부 루프 요소를 삽입할 공간을 마련한다.
- 처음에는 왼쪽 끝의 숫자를 정렬이 끝났다고 간주합니다.
- 두번째 원소부터 앞에 있는 원소들과 비교해서 정렬을 하는 방법이 삽입 정렬입니다.

```typescript
// 삽입 정렬
// 두번째 요소부터 시작해서 ( 첫번째 요소는 자동 삽입 되었다고 생각하고 )
// 선택된 요소 왼쪽에 있는 요소들을 전부 비교해서 자신이 있어야 할 자리를 선정합니다.
// 이때 무조건 전부 비교하지 않고 하나씩 정렬해서 넣기 때문에 이전 요소가 큰지 안 큰지만 보면 된다.
insertionSort() {
  for (let pos = 1; pos < this.dataStore.length; pos++) {
    // pos 이전 요소들 확인
    const targetValue = this.dataStore[pos];
    let tempPos = pos;
    // 왼쪽 끝에 도달하거나 자신 보다 작은 숫자가 나타나면 반복을 중지합니다.
    while (tempPos > 0 && this.dataStore[tempPos - 1] > targetValue) {
      // this.dataStore[tempPos - 1] : 이전 요소들
      // 이전 요소가 더 크다면 이전 요소를 오른쪽으로 하나씩 땡깁니다.
      this.dataStore[tempPos] = this.dataStore[tempPos - 1];
      // 하나씩 줄여가면서 이전 요소를 비교해 갑니다. 이전 요소가 타겟 요소보다 작으면 끝냅니다.
      tempPos = tempPos - 1;
    }

    this.dataStore[tempPos] = targetValue;
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
let h = 1;
// 초기 시퀀스 h 값
while (h < N / 3) {
  h = 3 * h + 1;
}
// 시퀀스 한번 루프 돌고 나서...
// 다음 시퀀스 구하는 공식
h = (h - 1) / 3;

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

- 정렬된 서브리스트를 서로 합병하여(머지) 최종적으로 정렬된 큰 리스트를 만드는 과정에서 유래 했습니다.
- 쉽게는 두 개의 정렬된 서브배열을 준비한 다음 두 배열을 비교하면서 가장 작은 요소를 세 번째 배열로 삽입합니다.
- 이때, 머지 정렬은 별도의 서브 배열의 저장공간이 필요합니다.
- 함수가 호출될때마다 절반씩 잘라서 재귀적으로 함수를 호출하고 맨 끝에 작은 조각부터 2개씩 병합해서 정렬된 배열을 머지해 나가는 방법 입니다.
- 시간 복잡도는 O(n log n) 이 됩니다.
- 파티션이 낱개가 될 때 까지 쪼개지니 n번 호출에 한번 호출당 검색해야 할 데이터 양이 절반씩 줄어드니 log n 입니다.

### 하양식 머지 정렬

- 머지 정렬은 보통 재귀 알고리즘으로 구현해야 하지만 자바스크립트 언어가 처리할 수 있는 것보다 더 깊은 재귀가 필요하므로 자바스크립트에서는 하양식이 아닌 상향식 머지 정렬 기법을 이용해야 합니다.
- 처음에는 수열을 반씩 분할해 나갑니다. 모두 분할이 끝났을 때 분할한 각 그룹을 병합해 나갑니다.

### 상향식 머지 졍렬

- 비재귀 또는 반복 방식으로 구현한 머지 정렬을 `상향식 머지 정렬`이라고 합니다.
- 상향식 머지 정렬에서는 먼저 정렬할 데이터를 한 개의 요소를 갖는 여러 배열로 분할합니다. 그리고 이들 배열의 left 배열과 right 배열을 합치면서 최종적으로 정렬된 데이터를 포함하는 하나의 배열이 만들어질 때까지 이 과정을 반복합니다.
- 제일 먼저 left 1개 right 1개를 가지고 merge 정렬을 진행하고 left, right 의 배열 갯수를 2의 배수씩 들려서 left 2개 right 2개 를 가지고 다시 merge 정렬을 진행합니다.
- merge 정렬시에는 항상 각 left, right 배열의 왼쪽 값부터 비교해 가면서 merge 정렬을 진행합니다.
- 최종적으로는 더이상 쪼갤 수 없을때까지 이 작업을 반복합니다.

```typescript
// 가장 먼저 배열을 하나씩 쪼개서 (상향식)
// 쪼갠 배열들을 머지 시켜야 합니다.
mergeSort() {
  let step = 1; // 쪼갤 단위
  // 쪼갤 단위가 dataStore 보다 짧을때 계속 수행
  while (step < this.dataStore.length) {
    // 처음 시작 left, right 그룹의 배열의 시작 인덱스
    let leftStart = 0;
    let rightStart = step;

    // left, right 를 step 으로 쌍을 만들 수 있을 때
    while (rightStart + step <= this.dataStore.length) {
      this.mergeArray(
        this.dataStore,
        leftStart,
        leftStart + step - 1,
        rightStart,
        rightStart + step - 1
      );
      // 그다음 leftStart, rightStart
      leftStart = rightStart + step;
      rightStart = leftStart + step;
    }
    // 나머지 left, right 쌍을 만들 수 없을 때
    if (rightStart < this.dataStore.length) {
      this.mergeArray(
        this.dataStore,
        leftStart,
        leftStart + step - 1,
        rightStart,
        this.dataStore.length - 1
      );
    }

    step = step * 2;
  }
}

// 두 정렬된 그룹의 배열의 각 첫번째 요소를 가지고
// 작은수 부터 배치하여 머지합니다.
mergeArray(
  arr: number[],
  leftStart: number,
  leftStop: number,
  rightStart: number,
  rightStop: number
) {
  // 임시 배열 복사 생성
  const tempArray = arr.map((item) => item);

  // 각 배열의 첫 번째 인덱스 부터 비교하기 위해서
  let part1 = leftStart;
  let part2 = rightStart;

  // 다시 arr에 정렬된것을 할당
  for (let i = leftStart; i <= rightStop; i++) {
    if (part2 > rightStop) {
      // part2 가 rightStop 보다 커진다면 우측 배열은 정렬이 끝난 것이다
      arr[i] = tempArray[part1];
      part1++;
    } else if (part1 > leftStop) {
      // part1 이 rightStart가 같아지거나 커진다면 왼쪽 배열은 정렬이 끝난 것이다
      arr[i] = tempArray[part2];
      part2++;
    } else {
      if (tempArray[part1] <= tempArray[part2]) {
        // 왼쪽 배열의 값이 작아서 먼저 정렬이 된다.
        // 왼쪽 배열의 인덱스를 오른쪽으로 이동시켜 준다.
        arr[i] = tempArray[part1];
        part1++;
      } else {
        // 오른쪽 배열의 값이 작아서 먼저 정렬이 된다.
        // 오른쪽 배열의 인덱스를 오른쪽으로 이동시켜 준다.
        arr[i] = tempArray[part2];
        part2++;
      }
    }
  }
}
```

## 퀵 정렬

- 리스트를 두 개의 서브리스트로 나누는 피벗을 선택합니다. 이 피벗은 정렬의 기준이 될 것입니다.
- 피벗을 기준으로 작은 값은 피벗의 왼쪽으로 큰 값은 피벗의 오른쪽으로 오도록 모든 요소를 정렬시킵니다.
- 피벗을 기준으로 분류된 각각의 서브리스트에 1, 2번 과정을 반복한다.
- 왼쪽 부분이 피벗보다 크다면 잠시 멈췄다가 오른쪽 부분을 살펴 봅니다. 오른쪽 수가 피벗보다 작다면 잠시 멈춰서 멈췄던 왼쪽 값과 오른쪽 값을 스왑시킵니다.
- 위 동작은 start point 와 end point가 교차 되면 한번 정렬이 완성된것입니다.
- 이 순서를 재귀적으로 호출합니다. 왼쪽 배열부터 정렬을 해서 합쳐오면 다시 오른쪽 부분을 정렬해서 최종적으로 합칩니다.
- 시간 복잡도는 O(n log n) 이 됩니다.

```typescript
// 퀵 정렬
// 피벗을 기준으로 왼쪽과 오른쪽을 나눠서 정렬을 시작합니다
quickSort() {
  this.dataStore = this.qSort(this.dataStore);
}

qSort(list: number[]): number[] {
  // 정렬할 데이터가 없으면 빈 배열을 리턴합니다
  if (list.length === 0) {
    return [];
  }

  if (list.length === 1) {
    return list;
  }

  const [lesser, greater, pivot] = this.partition(list);
  const sortLesser = this.qSort(lesser);
  const sortGreater = this.qSort(greater);

  return sortLesser.concat(pivot, sortGreater);
}

partition(list: number[]): number[][] {
  // 물리적으로 가운데 값을 피벗으로 잡는다
  const pivot = Math.floor((list.length - 1) / 2);
  const lesser: number[] = [];
  const greater: number[] = [];

  for (let i = 0; i < list.length; i++) {
    if (i !== pivot) {
      if (list[i] < list[pivot]) {
        lesser.push(list[i]);
      } else {
        greater.push(list[i]);
      }
    }
  }

  return [lesser, greater, [list[pivot]]];
}
```

## 힙 정렬

- `heap` 이라는 자료 구조를 이용해서 정렬을 하는 것을 말합니다.
- `heap` 은 트리 구조 하나로 `우선순위 큐(priority queue)`를 구현할 때 사용됩니다.
- `heap` 은 자식 노드의 숫자는 반드시 부모의 숫자보다 커야 한다는 규칙이 있습니다. 이는 반대로 구현해도 상관 없습니다. (역순 : 자식 노드 숫자는 부모 노드 숫자보다 작아야 한다.)
- 추가 되는 수는 먼저 가장 후미에 저장이 됩니다. 그 이후 부모와 비교해 가면서 추가된 값이 부모 보다 작으면 swap을 진행합니다. 이는 root 에 도달할 때까지 계속 진행됩니다.
- 삭제 되는 수는 root에 있는 값이 삭제가 됩니다. 그리고 가장 후미에 있는 값이 root 에 대체가 됩니다.
- 가장 후미에 있는 값이 root로 들어왔을때, 이번엔 자식들의 가장 작은 수와 비교해서 root 값이 더 크다면 swap 시켜줍니다. 이는 가장 마지막 노드에 도달할 때까지 계속 진행됩니다.
- 보통은 이 `heap` 자료 구조를 배열에 매핑해서 사용하기도 합니다.

```typescript
class Heap {
  dataStore: number[];
  constructor() {
    this.dataStore = [];
  }

  swap(arr: any[], index1: number, index2: number) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
  }

  insert(value: number) {
    // 1. 가장 후미에 넣는다.
    let lastIndex = this.dataStore.length;
    this.dataStore[lastIndex] = value;

    // 2. 부모와 값을 비교한다.
    // 2-1. 초기 부모 인덱스를 찾는다.
    let parentIndex = parseInt(`${(lastIndex - 1) / 2}`);
    // 3. 부모 노드가 있고, 후미에 있는 값이 부모 보다 작다면 swap
    while (
      parentIndex >= 0 &&
      this.dataStore[lastIndex] < this.dataStore[parentIndex]
    ) {
      this.swap(this.dataStore, parentIndex, lastIndex);
      lastIndex = parentIndex;
      parentIndex = parseInt(`${(lastIndex - 1) / 2}`);
    }
  }

  delete(dataList = this.dataStore) {
    let rootIndex = 0;
    // 초기 자식의 인덱스를 구한다.
    let leftIndex = rootIndex * 2 + 1;
    let rightIndex = rootIndex * 2 + 2;

    // 1. root에 있는걸 꺼낸다.
    if (dataList.length === 0) {
      return false;
    }
    const del = dataList[rootIndex];

    // 2. 가장 후미에 있는 값을 root에 할당해준다.
    const lastData = dataList.pop() as number;
    if (dataList.length > 0) {
      dataList[rootIndex] = lastData;
    }

    // 3. 자식이 있고(왼쪽 자식만 있어도 수행), 자식의 가장 작은 값이 root의 값보다 작다면 swap()
    while (dataList[leftIndex]) {
      const rightValue = dataList[rightIndex];
      const leftValue = dataList[leftIndex];
      let minValueIndex = leftIndex;

      if (rightValue) {
        // 두 자식간의 최소값을 가진 인덱스를 구해야 한다.
        // 나중에 swap 해야하기 때문에
        minValueIndex = rightValue < leftValue ? rightIndex : leftIndex;
      }
      // root 값이 자식들의 최소값보다 크다면 swap, 작다면 break;
      if (dataList[rootIndex] <= dataList[minValueIndex]) {
        break;
      } else {
        this.swap(dataList, rootIndex, minValueIndex);
        rootIndex = minValueIndex;
        leftIndex = rootIndex * 2 + 1;
        rightIndex = rootIndex * 2 + 2;
      }
    }

    return del;
  }

  sort() {
    const result: number[] = [];
    const length = this.dataStore.length;
    const tempDataList = Array.prototype.slice.apply(this.dataStore);
    for (let i = 0; i < length; i++) {
      const del = this.delete(tempDataList);
      if (del) {
        result.push(del);
      }
    }

    return result;
  }
}

const heap = new Heap();
heap.insert(5);
heap.insert(3);
heap.insert(7);
heap.insert(4);
heap.insert(2);
heap.insert(6);
heap.insert(1);
console.log("heap", heap);
console.log("heap sort", heap.sort()); // (7) [1, 2, 3, 4, 5, 6, 7]
```
