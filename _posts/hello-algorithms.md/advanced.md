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

최적의 정답이 이차원 배열의 마지막 셀에 저장되어 있습니다.
이 기법에서는 어떤 항목을 선택해야 할지를 알려주진 않지만, 크기가 16이 돼야 한다는 조건과 값이 23이 돼야 한다는 조건을 이용해 세 번째 항목과 다섯 번째 항목을 선택할 수 있다는 결론에 도달할 수 있습니다.

## 탐욕 알고리즘

- 문제를 해결하는 좋은 해결책을 찾아가는 기법입니다. (이 선택이 나중 선택에 어떤 영향을 줄 것인지 전혀 고려하지 않음)
- 탐욕 알고리즘에는 '최상'의 해법을 선택하다 보면 결구 끄것이 전체 문제를 해결하는 '최상'의 선택이 될 것이라는 전제가 깔려있습니다.

### 동전 거스름돈 문제

상점에서 어떤 물건을 샀는데 거스름돈이 63센트라고 가정해보자. 탐욕 알고리즘에 따르면 점원은 2개의 쿼터(quarter), 한개의 다임(dime), 세 개의 페니(penny)를 건넬 것입니다.
이것이 하프 달러(half dollar)를 사용하지 않고 63센트를 거슬러주는 최소한의 코인입니다.
( 1달러 : 100센트, 하프달러는 50센트: 더이상 발행 안함, 쿼터는 25센트, 다임은 10센트, 니켈은 5센트, 페니는 1센트 )

```javascript
// 하프달러는 없다고 생각하자.
// 단위가 높은 화폐인 쿼터로 거스름돈을 완성하면서 coins 배열에 저장한다.
// 남은 거스름돈이 쿼터보다 작아지면 다음으로 작은 화폐 단위인 다임으로 이동해 가능한 많은 다임을 활용한다.
// 사용한 다임의 수도 coins 배열에 저장한다.
// 이와 같이 니켈, 페니를 이용해서 거스름돈을 만들어 냅니다.
const QUARTER = 0.25;
const DIME = 0.1;
const NICKEL = 0.05;
const PENNY = 0.01;
function makeChange(originAmt, coins) {
  // 쿼터로 나눴을때 originAmt가 크다는것은 originAmt가 0.25 값보다 크다는 것을 의미한다.
  if(originAmt % QUARTER < originAmt) {
    coins[3] = parseInt(originAmt / QUARTER); // 몫을 coins에 저장
    originAmt = originAmt % QUARTER;
  }

  if(originAmt % DIME < originAmt) {
    coins[2] = parseInt(originAmt / DIME); // 몫을 coins에 저장
    originAmt = originAmt % DIME;
  }

  if(originAmt % NICKEL < originAmt) {
    coins[1] = parseInt(originAmt / NICKEL); // 몫을 coins에 저장
    originAmt = originAmt % NICKEL;
  }
  coins[0] = parseInt(originAmt / PENNY);
};

const originAmt = 0.63;
const coins = [];
makeChange(originAmt, coins)
console.log(coins)

// [3, empty, 1, 2]
// 0.01 * 3 + 0.1 + 0.25 * 2 = 0.63
```

### 배낭 문제: 탐욕 알고리즘

배낭에 추가할 물건이 기본적으로 연속적일 때만 탐욕 알고리즘을 적용할 수 있습니다. 즉, 개별적으로 셀 수 없는 물건만 사용해야 합니다. 연속적인 물건을 이용하면 단위 부피를 단위 가격으로 나누어 물건의 값을 계산할 수 있습니다. 따라서 가장 값어치가 높은 물건부터 물건이 고갈되거나 배낭이 찰 때까지 먼저 넣은 다음 두 번째로 값어치가 높은 물건을 넣는 순의 전략을 이용할 수 있습니다. 예를 들어 TV 반 개를 배낭에 넣을 수 없기 때문에 탐욕 알고리즘에서는 셀 수 없는 연속적인 물건만 제대로 계산할 수 있습니다. 즉, 덩어리 진 것, 쪼갤 수 있는 것들이 탐욕 알고리즘을 적용할 수 있을 것입니다.

연속적인 물건을 담는 배낭 문제를 분수(fractional) 배낭 문제라고 합니다. 분수 배낭 문제의 알고리즘은 다음과 같이 풉니다.

1. 배낭의 용량을 W 물건의 가치를 v, 물건의 무게는 w다.
2. 항목의 값어치는 v/W 비율로 평가합니다.
3. 값어치가 높은 물건부터 고려합니다.
4. 가능한 한 많은 물건을 추가 합니다.

| 물건 | A  | B   | C  | D  |
|------|----|-----|----|----|
| 값   | 50 | 140 | 60 | 60 |
| 무게 | 5  | 20  | 10 | 12 |
| 비율 | 10 | 7   | 6  | 5  |

가방 무게는 30 입니다.

```javascript
// 이걸 하기 전에 무게와 값어치 배열을 비율에 따라 내림차순으로 정렬을 해야 합니다.
function ksack(values, weights, capacity) {
  let loadedWeight = 0; // 가방에 쌓이는 무게
  let index = 0;
  let loadedValue = 0; // 가방에 쌓인 값어치

  while((loadedWeight < capacity) && (index < values.length)) { // 가방에 용량이 남았거나 물건 순회를 다했을 경우 탈출
    if(weights[index] <= (capacity - loadedWeight)) { // 물건의 무게가 남아있는 가방 무게보다 적게 나간다면 담자!!
      loadedValue = loadedValue + values[index];
      loadedWeight = loadedWeight + weights[index];
    } else {
      // 물건의 무게가 남아있는 가방 무게보다 더 무겁다면 그 물건을 쪼개서 꽉 채워보자.
      const ratio = (capacity - loadedWeight) / weights[index];
      loadedValue = loadedValue + (ratio * values[index]);
      loadedWeight = loadedWeight + weights[index];
    }
    index = index + 1;
  }

  return loadedValue;
}

const itmes = ['A', 'B', 'C', 'D'];
const values = [50, 140, 60, 60];
const weight = [5, 20, 10, 12];
const capacity = 30;
console.log(ksack(values, weight, capacity));
```

여기서는 물건 A, B를 모두 담고 물건 C는 반만 담는 것이 최적의 답입니다.
