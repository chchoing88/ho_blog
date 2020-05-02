---
title: '[algorithms] Search'
date: '2020-05-01T10:00:03.284Z'
---

## 검색 알고리즘

- 리스트에서는 순차 검색(sequential search)과 이진 검색(binary search) 두 가지 방법으로 데이터를 검색할 수 있습니다.
- 리스트의 항목이 임의의 순서로 저장되어 있을 때는 순차 검색을 사용합니다.
- 리스트의 항목이 정렬되어 있을 때는 이진 검색을 이용합니다.
- 이진 검색이 순차 검색보다 효율성을 좋지만, 이진 검색을 수행하려면 리스트의 데이터를 정렬하는 데도 시간을 소비함을 감안해야 합니다.

## 순차 검색

- 리스트에서 데이터를 찾는 가장 단순한 방법 입니다. 리스트의 처음 요소부터 찾는 요소가 발견 될때까지 계속 다음 요소를 찾는 것입니다.

```typescript
function seqSearch(arr: number[], data: number) {
  for (let i = 0; i < arr.length; ++i) {
    if(arr[i] === data) {
      return true;
    }
  }
  return false;
}
```

- 참과 거짓이 아니라 발견된 위치를 반환하도록 순차 검색 함수를 고칠 수 있습니다.

```typescript
function seqSearch(arr: number[], data: number) {
  for (let i = 0; i < arr.length; ++i) {
    if(arr[i] === data) {
      return i;
    }
  }
  return -1;
}
```

- Array.indexOf() 함수보다 속도가 느리므로 실용성은 없습니다.

### 최솟값과 최댓값 검색

배열에서 최솟값을 찾는 알고리즘

1. 배열의 첫 번째 요소를 최솟값으로 간주해 변수에 저장한다.
2. 배열의 두 번째 요소부터 루프를 돌면서 현재 최솟값과 크기를 비교한다.
3. 배열 요소가 현재 최솟값보다 작다면 현재 요소를 새로운 최솟값으로 간주하고 변수에 저장한다.

```typescript
function findMin(arr: number[]) {
  let min = arr[0]

  for(let i = 1; i < arr.length; ++i) {
    if( arr[i] < min ) {
      min = arr[i];
    }
  }

  return min;
}
```

최댓값을 찾는 로직도 다를 바 없다.

```typescript
function findMax(arr: number[]) {
  let max = arr[0]

  for(let i = 1; i < arr.length; ++i) {
    if( arr[i] > max ) {
      max = arr[i];
    }
  }

  return max;
}
```

### 자체 정렬 데이터

- 자주 검색하는 데이터를 데이터 집합의 앞부분에 저장함으로써 검색 속도를 높일 수 있는 기법입니다.
- 프로그램이 실행되면서 자체적으로 정렬되는 데이터를 자체 정렬 데이터 (self-organized data)라 합니다.

```typescript
function seqSearch(arr: number[], data: number) {
  
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === data) {
      // if( i > 0 ) {
        // 찾는 데이터가 가장 첫번째에 있지 않다면 하나씩 앞으로 옮긴다.
        // swap(arr, i, i-1);
      if(i > (arr.length * 0.2)) {
        // 데이터 집합의 시작지점으로부터 20 퍼센트에 해당하지 않는 데이터면 위치를 바꾸는 방식을 이용
          swap(arr, i , 0)
      }
      return true
    }
  }
  return falses
}

function swap(arr: number[], index: number, index1: number) {
  const temp = arr[index]
  arr[index] = arr[index1]
  arr[index1] = temp
}
```

## 이진 검색

- 데이터가 정렬된 상황에서는 순차 검색보다는 이진 검색이 더 효율적이다.
- 숫자를 선택할 때 상대방의 대답에 따라 제시한 숫자보다 큰쪽이나 작은 쪽 범위에서 중간값(midpoint)을 다시 제시하는 방법을 활용할 수 있습니다.

```typescript
function binSearch(arr: number[], data: number) {
 let upperBound = arr.length - 1; // 상위 경계 (높은 수)
 let lowerBound = 0; // 하위 경계 (낮은수)

 while(lowerBound <= upperBound) { // 상위 경계가 크다면 계속 돕니다.
  const mid = Math.floor((upperBound + lowerBound) / 2);
  if(arr[mid] < data) {
    // 물리적인 중간값을 설정하고 이 중간값보다 찾는 값이 크다면 하위 경계를 중간값 + 1 로 셋팅합니다.
    lowerBound = mid + 1;
  } else if(arr[mid] > data) {
    // 물리적인 중간값을 설정하고 이 중간값보다 찾는 값이 작다면 상위 경계를 중간값 - 1 로 셋팅합니다.
    upperBound = mid - 1;
  } else {
    // 그 외 arr[mid] 값이 data 와 같다면 해당 인덱스를 반환합니다.
    return mid
  }
 }
  
  return -1; // 발견하지 못한다면ㄴ
}
```
