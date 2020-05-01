---
title: advanced algorithms
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

### 배낭 문제

## 탐욕 알고리즘

- 문제를 해결하는 좋은 해결책을 찾아가는 기법입니다.
