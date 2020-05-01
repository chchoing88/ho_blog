---
title: Search Algorithms
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


