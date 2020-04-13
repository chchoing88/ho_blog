---
title: algorithm Hashing
date: '2020-03-30T10:00:03.284Z'
---

## 해싱 개요

- 해싱은 데이터를 단시간에 삽입하거나 저장된 데이터를 가져올 때 주로 사용하는 기법이다.
- 해싱은 해시 테이블이라는 자료 구조를 이용한다.
- 해싱을 이용하면 데이터를 빠르게 삽입하고, 삭제하고, 가져올 수 있지만, 최솟값이나 최댓값 찾기 등 검색 동작은 효율이 떨어진다.
- 검색이 필요한 상황이라면 이진 탐색 트리 같은 자료구조를 사용하는 것이 좋다.
- 해시 테이블 자료구조는 배열을 이용한다.
- 키(key)라 불리는 데이터 요소로 배열에 저장된 데이터 요소를 참조할 수 있다.
- 해시 함수는 각 키를 자체 배열 요소로 저장한다. 되도록 키가 한 곳에 집중되지 않도록 저장하는 것이 좋다.
- 해시 함수에서는 두 키의 해시 결과(해시 함수 수행 결과)가 같은 값일 때도 있다. 이를 충돌(collision) 이라 한다.
- 해시 테이블에 사용할 배열의 크기는 소수(prime number) 여야 한다.

## 해시 테이블 클래스

### 심플 해싱

- 정수키를 가진 해시 테이블이라면 배열의 크기로 나눈 나머지를 반환(모듈로:modulo 연산)하는 해시 함수를 이용할 수 있다. 이때, 키가 모두 0으로 끝나며 배열의 크기가 10인 상황(320 % 10)에서는 이런 간단한 해시 함수를 사용할 수 없다. 따라서 배열의 길이는 소수로 만들어 주는 것이 유리하다.

- 해싱 결과 값이 항상 테이블 범위 안에 있게 하기 위해선 다음과 같이 모듈로 연산을 해야 한다. (n % table.length)

```typescript
class HashTable {
  table: string[];

  constructor() {
    this.table = new Array(137);
  }

  simpleHash(data: string) {
    // 각 문자의 아스키 값의 합을 얻어 해시 값을 계산한다.
    const total = data.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    console.log(`Hash value: ${data} -> ${total}`);
    // 계산 결과가 항상 해당 테이블 범위 안에 있게 하기 위해 모듈러 연산을 사용한다.
    return total % this.table.length;
  }

  // 배열에 실제로 저장된 이름을 출력한다.
  showDistro() {
    this.table
      .filter(data => {
        return !!data;
      })
      .forEach((data, index) => console.log(`${index}: ${data}`));
  }

  // 실제 해시테이블에 데이터를 저장할 수 있도록 한다.
  put(key: string, data: string) {
    // const pos = this.simpleHash(data);
    const pos = this.betterHash(key);
    this.table[pos] = data;
  }

  get(key: string) {
    return this.table[this.betterHash(key)];
  }
}
```

### 호너의 메소드 해시 함수

호너의 메소드를 이용하려면 결과에 소수를 곱하는 과정을 추가해야 한다.

```typescript
// 호너의 메서드 알고리즘을 사용해서 충돌이 안나게끔 해싱 함수를 만들자.
  betterHash(data: string) {
    const H = 37;
    const total = data.split("").reduce((acc, char) => {
      return H * acc + char.charCodeAt(0);
    }, 0);
    console.log(`Hash value: ${data} -> ${total}`);

    const hashKey = total % this.table.length;
    return hashKey;
  }
```

## 충돌 처리

모든 키가 해시 테이블에 저장될 수 있게 충돌을 처리하는 분리된 체인, 선형 조사 라는 두가지 충돌 해결 방법을 설명합니다.

### 분리된 체인

해시된 키를 저장할 배열을 만든 다음 해시 테이블의 각 배열 요소에 빈 배열을 할당하는 방식이다. 즉, 2차 배열을 만드는 것이다.

```javascript
const tables = [
  60: [David], // key: David, data: David
  68: [Jennifer],
  69: [Mike],
  70: [Donnie, Jonathan]
  78: [Cynthia, Danny]
  88: [Raymond, Clayton]
]
```

```typescript
class HashTable {
  table: string[][];

  constructor() {
    this.table = new Array(137);
    // 충돌처리 - 분리된 체인
    for (let i = 0; i < this.table.length; i++) {
      this.table[i] = new Array();
    }
  }

  simpleHash(data: string) {
    // 각 문자의 아스키 값의 합을 얻어 해시 값을 계산한다.
    const total = data.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    console.log(`Hash value: ${data} -> ${total}`);
    // 계산 결과가 항상 해당 테이블 범위 안에 있게 하기 위해 모듈러 연산을 사용한다.
    return total % this.table.length;
  }

  // 호너의 메서드 알고리즘을 사용해서 충돌이 안나게끔 해싱 함수를 만들자.
  betterHash(data: string) {
    const H = 37;
    const total = data.split("").reduce((acc, char) => {
      return H * acc + char.charCodeAt(0);
    }, 0);
    console.log(`Hash value: ${data} -> ${total}`);

    const hashKey = total % this.table.length;
    return hashKey;
  }

  // 배열에 실제로 저장된 이름을 출력한다.
  showDistro() {
    this.table
      .filter((dataList) => {
        return !!dataList[0];
      })
      .forEach((data, index) => console.log(`${index}: ${data}`));
  }

  put(key: string, data: string) {
    // const pos = this.simpleHash(data);
    const pos = this.betterHash(key);
    // this.table[pos] = data;
    const tableKeyPoint = this.table[pos];
    const tableKeyPointLength = tableKeyPoint.length;

    if (tableKeyPointLength === 0) {
      tableKeyPoint[0] = data;
    } else {
      tableKeyPoint[tableKeyPointLength - 1] = data;
    }
  }

  get(key: string) {
    return this.table[this.betterHash(key)];
  }
}
```

### 선형 조사

선형 조사는 오픈 주소법 해싱(open-addressing hashing)이라 불리는 일반적인 해싱 기법이다.
오픈 주소법에는 충돌이 발생하면 해시 테이블의 다음 요소가 비어 있는지 확인한 후 다음 요소가 비어 있으면 비어 있는 요소에 키를 저장합니다.

대부분의 해시 테이블에는 비어 있는 공간이 많이 있으므로 비어있는 공간을 이용해 키를 저장한다는 것이 선형 조사 기법의 핵심입니다.

```javascript
// key 저장
const tables = [
  60: David, // key: David, data: David
  68: Jennifer,
  69: Mike,
  70: Donnie, //Jonathan
  71: Jonathan,
  78: Cynthia, //Danny]
  79: Danny,
  88: Raymond, Clayton
  89: Clayton
]
// Data 저장
const values = [
  60: David, // key: David, data: David
  68: Jennifer,
  69: Mike,
  70: Donnie, //Jonathan
  71: Jonathan,
  78: Cynthia, //Danny]
  79: Danny,
  88: Raymond, Clayton
  89: Clayton
]
```

```typescript
class HashTable {
  table: string[][];

  constructor() {
    this.table = new Array(137); // 해싱된 키를 저장하고
    // 선형 조사
    this.values = []; // values에 키에 해당하는 데이터를 저장한다.
  }
  put(key: string, data: string) {
      // const pos = this.simpleHash(data);
      const pos = this.betterHash(key);

      if(this.table[pos] === undefined) {
        this.table[pos] = key;
        this.values[pos] = data;
      } else {
        while(this.table[pos] !== undefined) {
          pos++;
        }
        this.table[pos] = key;
        this.values[pos] = data;
      }
    }

  get(key: string) {
    const pos = this.betterHash(key);
    if(pos > -1) {
      for(let i = pos; this.table[pos] !== undefined; i++) {
        if(this.table[pos] === key) {
          return this.values[pos];
        }
      }
    }
    return undefined;
  }
}
```
