---
title: '[algorithms] advanced'
date: '2020-05-01T10:00:03.284Z'
---

## 동적 프로그래밍

- 동적 프로그래밍은 재귀와 상반되는 기법으로 알려져 있습니다. 재귀에서는 위에서 아래로 내려가면서 점차 작아지는 문제를 모두 해결하는 방식인 반면, 동적프로그래밍에서는 아래에서 위로 해결하면서 결과를 모아 큰 전체 문제를 해결하는 방식입니다.
- 재귀 기법으로 해결할 수 있는 대부분의 프로그래밍 문제는 동적 프로그래밍으로도 해결할 수 있습니다.

### 피보나치 예제

피보나치는 이전의 두 숫자를 더해서 다음 숫자를 만들 수 있습니다.
재귀를 이용해서 다음과 같이 구현할 수 있습니다.

```typescript
function recurFib(n) {
  if(n < 2) {
    return n;
  } else {
    return recurFib(n-1) + recurFib(n-2);
  }
}
```

이미 계산한 값을 컴파일러가 기억할 수 있다면 더 효율성을 높일 수 있습니다.
동적 프로그래밍에서는 가장 간단한 하위 문제부터 해결하면서 좀 더 복잡한 상위 문제로 나아갑니다.

```typescript
function dynFib(n) {
  // 초기화
  const val = new Array(n).fill(0);

  if(n === 1 || n === 2) {
    return 1;
  } else if(n > 2) {
    val[1] = 1;
    val[2] = 1;
    for (let i = 3; i <= n; i++) {
      val[i] = val[i-1] + val[i-2];
    }
  }

  return val[n]
}
```

반복 기법을 이용해서도 피보나치를 계산 할 수 있다.

```typescript
function iterFib(n) {
  let last = 1; // 첫번째
  let nextLast = 1; // 두번째
  let result = 1;

  for(let i = 3; i <= n; i++) {
    result = last + nextLast;
    last = nextLast;
    nextLast = result;
  }

  return result;
}
```

### 가장 긴 공통 문자열 찾기

- 두 개의 문자열에서 가장 긴 공통 문자열을 찾는 문제입니다.
- 이차원 배열을 이용해서 각 문자열을 비교하고 두 배열의 같은 위치에서 같은 문자를 발견하면 이차원 배열의 해당 행과 열에 위치한 요소를 1 증가시킵니다.
- 문자열을 비교하면서 얼마나 많은 글자가 일치했는지 변수에 저장합니다.
- 알고리즘이 끝나면 일치한 횟수를 저장한 변수와 인덱스 변수를 이용해 가장 긴 공통 문자열을 반환합니다.

```typescript
function Isc (word1: string, word2: string) {
  const icsArr: number[][] = [];
  let max = 0;
  let index = 0;

  // 초기화
  for (let i = 0; i <= word1.length; i++) {
    icsArr[i] = [];
    for (let j = 0; j <= word2.length; j++) {
      icsArr[i][j] = 0;
    }
  }
  

  // 계산
  // i === 0 || j === 0 인 곳은 0으로 셋팅해준다
  for (let i = 1; i <= word1.length; i++) {
    for (let j = 1; j <= word2.length; j++) {
      if(word1[i-1] === word2[j-1]) {
        // 단어가 같으면 카운트를 해줍니다.
        icsArr[i][j] = icsArr[i-1][j-1] + 1;

        // 카운트 한 값이 max 보다 크다면 max 값을 업데이트 하고
        // 그 인덱스를 index에 저장해둔다
        if(max < icsArr[i][j]) {
          max = icsArr[i][j];
          index = i;
        }
      }
    }
  }

  // 출력
  if(max === 0) {
    return '';
  }

  if(max > 0) {
    let str = '';
    console.log(icsArr)
    // index - max : 연속된 max 값을 가지는 해당 index에 max를 빼면 시작 인덱스를 얻을 수 있다
    for (let i = index-max; i <= max; i++) {
      str += word1[i];
    }
    return str;
  }
}

console.log(Isc('abbcc', 'dbbcc'))
//              a, b, b, c, c
// 0: (6)   [0, 0, 0, 0, 0, 0]
// 1: (6) d [0, 0, 0, 0, 0, 0]
// 2: (6) b [0, 0, 1, 1, 0, 0]
// 3: (6) b [0, 0, 1, 2, 0, 0]
// 4: (6) c [0, 0, 0, 0, 3, 1]
// 5: (6) c [0, 0, 0, 0, 1, 4]
```

### 배낭 문제: 재귀

우리가 금고 털이범이라고 가정 했을때 우리가 가지고 있는 배낭의 크기는 한정되어 있다. 이때, 금고 안에 물건은 크기나 값이 모두 다르다고 했을때, 값어치가 나가는 물건 위주로 배낭을 채워야 합니다.

여기 예제에서는 금고에 다섯 개의 물건이 있다고 합니다. 각 물건의 크기는 3,4,7,8,9 이고 각각의 값어치는 4,5,10,11,13 이라고 합니다. 배낭에는 16 크기의 물건을 담을 수 있다고 합니다. 이때, 배낭에 넣을 수 있는 가장 값어치 있는 물건을 구해보자.

```javascript
function max(a,b) {
  return (a > b)? a : b
}

// capacity : 가방용량
// size: 보물의 무게가 든 배열
// value: 값어치든 배열
// n : 총 보물 남아 있는 갯수
function knapsack(capacity, size, value, n) {
  if(n === 0 | capacity === 0) { // 보물 갯수나 가방 용량이 없으면 0 리턴
    return 0
  }

  if(size[n-1] > capacity) { // 가방의 남은 무게보다 보물의 무게가 크다면 다음 보물로 넘어간다.
    return knapsack(capacity, size, value, n-1)
  } else { // 해당 보물을 가방에 담고 값어치가 높은지 이 보물을 안담고 그 다음 보물들을 담는게 값어치가 높은치 비교한다.
    return max(value[n-1] + knapsack(capacity-size[n-1], size, value, n-1),
    knapsack(capacity, size, value, n-1))
  }
}

const value = [4,5,10,11,13];
const size = [3,4,7,8,9];
const capacity = 16;
const n = 5;
console.log(kanpsack(capacity, size, value, n))
```

재귀는 맨 아래에서부터 걷어 올리는 느낌이다. 즉, 일단 다 풀어놨다가 오르면서 정리를 하는 느낌이랄까.
가장 첫번째 보석부터 size를 판별한 후 값어치를 더한 값어치와 그 보석을 넣지 않았을때(가방 무게가 그만큼 줄지 않아서 다른 보석을 넣을 가능성이 있음)의 값어치를 비교해서 큰 값을 가져옵니다.
위 코드는 다음과 움직인다.

```javascript
knapsack(16, size, value, 5)
max(13 + knapsack(7, size, value, 4), knapsack(16, size, value, 4))
max(13 + knapsack(7, size, value, 3), knapsack(16, size, value, 4))
max(13 + max(10 + knapsack(0, size, value, 2), knapsack(7, size, value, 2)), knapsack(16, size, value, 4))
// (....)
```

보면 알다 시피 상당히 많은 재귀를 돌아야 하는 것을 알 수 있습니다.

### 배낭 문제: 동적 프로그래밍

동적 프로그래밍 기법에서는 최정 해법에 도달할 때까지 중간 결과를 저장할 임시 배열 저장소가 필요합니다.

```javascript
function max(a,b) {
  return (a > b)? a : b;
}

// capacity : 가방용량
// size: 보물의 무게가 든 배열
// value: 값어치든 배열
// n : 총 보물 남아 있는 갯수
function dKnapsack(capacity, size, value, n) {
  // 가방 무게와 보석의 갯수가 늘어날때마다 가장 값어치 있는 값을 저장하는 배열
  // 1차 배열 주얼리 갯수
  // 2차 배열 가방 용량
  const K = [];
  
  for(let i = 0; i <= n; i++) {
    K[i] = [] // 초기화
  }

  // jewelry: 주얼리 갯수
  // bagCapacity: 가방 용량
  for(let jewelry = 0; jewelry <= n; jewelry++) {
    for(let bagCapacity = 0; bagCapacity <= capacity; bagCapacity++) {
      if(jewelry === 0 || bagCapacity === 0) {
        K[jewelry][bagCapacity] = 0
      } else if (size[jewelry - 1] <= bagCapacity) {
        // 해당 보석의 사이즈가 가방 무게보다 작거나 같으면 보석을 가방에 담아보자.
        // 해당 보석을 가방에 담는다고 했을때 값어치 리스트에서 값어치를 가져오고 ( value[jewelry - 1] )
        // 해당 보석을 담기 전 가방의 값어치를 ( K[jewelry - 1][bagCapacity - size[jewelry - 1]] )
        // K[이전 주얼리 갯수][가방무게 - 현재 주얼리 무게]
        // 더한 값어치를 이전 보석까지 담은 최선의 값어치와 비교한다.
        // 해당 결과 저장
        K[jewelry][bagCapacity] = max(
          value[jewelry - 1] + K[jewelry - 1][bagCapacity - size[jewelry - 1]],
          K[jewelry - 1][bagCapacity]
        )
      } else {
        // 해당 보석의 사이즈가 가방 무게보다 나간다면 담지 못하므로 같은 가방의 무게에 이전 보석까지 담은게 최선의 값어치가 된다.
        K[jewelry][bagCapacity] = K[jewelry - 1][bagCapacity]
      }
    }
  }
  console.log(K)
  return K[n][capacity]
}

const value = [4,5,10,11,13];
const size = [3,4,7,8,9];
const capacity = 16;
const n = 5;
dKnapsack(capacity, size, value, n)

// 0: (17) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 1: (17) [0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
// 2: (17) [0, 0, 0, 4, 5, 5, 5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
// 3: (17) [0, 0, 0, 4, 5, 5, 5, 10, 10, 10, 14, 15, 15, 15, 19, 19, 19]
// 4: (17) [0, 0, 0, 4, 5, 5, 5, 10, 11, 11, 14, 15, 16, 16, 19, 21, 21]
// 5: (17) [0, 0, 0, 4, 5, 5, 5, 10, 11, 13, 14, 15, 17, 18, 19, 21, 23]
```

## 탐욕 알고리즘

- 문제를 해결하는 좋은 해결책을 찾아가는 기법입니다.
