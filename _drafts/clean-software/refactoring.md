# 리팩토링

- 리팩토링은 하고 있는 일에 주의를 기울이고 최선을 다하고 있음을 확실히 하는것에 관한 내용이며, 그냥 동작하게 만드는 것과 올바르게 동작하게 만드는 것의 차이에 관한 내용이다.
- 마틴 파울러 형님의 리팩토링 정의는 "외부 행위를 바꾸지 않으면서 내부 구조를 개선하는 방법으로, 소프트웨어 시스템을 변경하는 프로세스" 라고 정의했다.
- 소프트웨어 모듈에는 세 가지 기능이 있다.
  - 첫번째는 실행 중에 동작하는 기능, 이 기능은 그 모듈의 존재 이유가 된다.
  - 두번째는 변경 기능이다. 대부분의 모듈이 변경 과정을 겪게 되고, 가능한 한 간단하게 그런 변경을 할 수 있도록 만드는 것이 개발자의 책임이다.
  - 세번째는 그것을 읽는 사람과 의사소통하는 기능이다. 모듈은 특별한 훈련 없이도 개발자가 쉽게 읽고 이해할 수 있어야 한다.
- 읽기 쉽고 변경하기 쉬운 모듈을 만들기 위해서는 단순한 원칙과 패턴 이상의 그 무엇이 필요한데 바로 주의력과 훈련이다. 그리고 열정이 필요하다.

## 소수 생성기: 리팩토링의 간단한 예

> 소수란? 정확히 2개의 약수를 가진 수를 소수라고 합니다.

- 이 알고리즘은 아주 간단합니다.
  - 2부터 시작하는 정수 배열을 받는다.
  - 2의 배수를 모두 지운다.
  - 지워지지 않은 다음 정수를 찾아 그 배소를 모두 지운다.
  - 최대값의 제곱근 값을 넘을 때까지 이 과정을 계속한다.

```javascript
// GeneratePrimes.js
class GeneratePrimes {
  /**
   *
   * @param {Number} maxValue 생성 한계 값
   * @returns {Array<Number>}
   */
  static generatePrimes(maxValue) {
    if (maxValue >= 2) {
      // 유효한 경우에만
      // 선언
      const length = maxValue + 1; // 배열 크기 -  0 ~ 5는 6개
      const verifyPrimes = new Array(length).fill(true); // 배열을 true 값으로 초기화한다.

      // 알려진 비소수를 제거
      verifyPrimes[0] = verifyPrimes[1] = false;

      // 체로 걸러내기
      for (let i = 2; i < Math.sqrt(length) + 1; i++) {
        if (verifyPrimes[i]) {
          // i 가 지워지지 않았으면 그 배수를 지운다.
          for (let j = 2 * i; j < length; j++) {
            verifyPrimes[j] = false; // 배수는 소수가 아니다.
          }
        }
      }

      // 지금까지 몇 개의 소수가 있는가?
      let count = 0;
      for (let i = 0; i < length; i++) {
        if (verifyPrimes[i]) {
          count++; // 발견된 개수를 센다.
        }
      }

      // 소스를 결과 집합에 넣는다.
      const primes = new Array(count);
      for (let i = 0, j = 0; i < length; i++) {
        if (verifyPrimes[i]) {
          // 소수이면
          primes[j++] = i;
        }
      }

      return primes;
    } else {
      return [];
    }
  }
}
```

```javascript
// Test GeneratePrimes.js

function testPrimes() {
  const nullArray = GeneratePrimes.generatePrimes(0);
  expect(nullArray.length).toBe(1);

  const minArray = GeneratePrimes.generatePrimes(2);
  expect(minArray.length).toBe(1);
  expect(minArray[0]).toBe(2);

  const threeArray = GeneratePrimes.generatePrimes(3);
  expect(threeArray.length).toBe(2);
  expect(threeArray[0]).toBe(2);
  expect(threeArray[0]).toBe(3);

  const centArray = GeneratePrimes.generatePrimes(100);
  expect(threeArray.length).toBe(25);
  expect(threeArray[24]).toBe(97);
}

```

- 첫번째 리팩토링
  - 메인 함수를 3개의 독립된 함수로 나누자.
    - 모든 변수를 초기화하고 체를 기본상태로 설정한다.
    - 체로 걸러내는 동작을 실제로 실행한다.
    - 체로 걸러낸 결과를 정수 배열에 넣는다.
  - 3개의 함수로 추출해내는 작업 때문에, 함수의 몇몇 변수는 static 필드로 승격해야 한다.

- 두번째 리팩토링
  - 함수를 의미있는 이름으로 바꾼다.
  - 내부 구조를 좀 더 읽기 쉽게 재배열했다.

```javascript
class PrimesGenerator {
  static verifyPrimes;
  static result;

  static generatePrimes(maxValue) {
    if (maxValue < 2) {
      return [];
    } else {
      PrimesGenerator.initializeArrayOfIntegers(maxValue);
      PrimesGenerator.corssOutMultiples();
      PrimesGenerator.putUncrossedIntegersIntoResult();

      return PrimesGenerator.result;
    }
  }

  static putUncrossedIntegersIntoResult() {
    // 지금까지 몇 개의 소수가 있는가?
    let count = 0;
    for (let i = 0; i < PrimesGenerator.verifyPrimes.length; i++) {
      if (PrimesGenerator.verifyPrimes[i]) {
        count++; // 발견된 개수를 센다.
      }
    }

    // 소스를 결과 집합에 넣는다.
    PrimesGenerator.primes = new Array(count);
    for (let i = 0, j = 0; i < PrimesGenerator.verifyPrimes.length; i++) {
      if (PrimesGenerator.verifyPrimes[i]) {
        // 소수이면
        PrimesGenerator.result[j++] = i;
      }
    }
  }

  static corssOutMultiples() {
    // 체로 걸러내기
    for (
      let i = 2;
      i < Math.sqrt(PrimesGenerator.verifyPrimes.length) + 1;
      i++
    ) {
      if (PrimesGenerator.verifyPrimes[i]) {
        // i 가 지워지지 않았으면 그 배수를 지운다.
        for (let j = 2 * i; j < PrimesGenerator.verifyPrimes.length; j++) {
          PrimesGenerator.verifyPrimes[j] = false; // 배수는 소수가 아니다.
        }
      }
    }
  }

  static initializeArrayOfIntegers(maxValue) {
    // 선언
    PrimesGenerator.verifyPrimes = new Array(maxValue + 1).fill(true); // 배열을 true 값으로 초기화한다.
    // 알려진 비소수를 제거
    PrimesGenerator.verifyPrimes[0] = PrimesGenerator.verifyPrimes[1] = false;
  }
}
```

- 세번째 리팩토링
  - boolean 의 값은 is 라는 접두어로 의미있는 이름으로 만들자.
  - 복잡한 수식들을 각각의 의미 있는 함수로 떼내어 읽기가 편하도록 하자.

```javascript
class PrimesGenerator {
  static isCrossed;
  static result;

  static generatePrimes(maxValue) {
    if (maxValue < 2) {
      return [];
    } else {
      PrimesGenerator.initializeArrayOfIntegers(maxValue);
      PrimesGenerator.crossOutMultiples();
      PrimesGenerator.putUncrossedIntegersIntoResult();

      return PrimesGenerator.result;
    }
  }

  static initializeArrayOfIntegers(maxValue) {
    // 선언
    PrimesGenerator.isCrossed = new Array(maxValue + 1); // 배열을 true 값으로 초기화한다.
    // 알려진 비소수를 제거
    for (let i = 2; i < PrimesGenerator.isCrossed.length; i++) {
      PrimesGenerator.isCrossed[i] = false;
    }
  }

  static crossOutMultiples() {
    const maxPrimeFactor = PrimesGenerator.calcMaxPrimeFactor();
    for (let i = 2; i <= maxPrimeFactor; i++) {
      if (PrimesGenerator.notCrossed(i)) {
        // 안빠진게 있다면
        PrimesGenerator.crossOutMultiplesOf(i);
      }
    }
  }

  static calcMaxPrimeFactor() {
    // p가 소수일때, p의 모든 배수를 지운다.
    // 따라서 지워지는 모든 배수는 인수로 p와 q를 갖는다.
    // 'p > 배열 크기의 sqrt(제곱근)' 일 경우, q는 1보다 클 수 없다.
    // 따라서 p는 이 배열의 가장 큰 소인수이고,
    // 루프 횟수의 한계 값이기도 하다.
    const maxPrimeFactor = Math.sqrt(PrimesGenerator.isCrossed.length) + 1;
    return parseInt(maxPrimeFactor, 10);
  }

  static notCrossed(i) {
    return PrimesGenerator.isCrossed[i] === false;
  }

  static crossOutMultiplesOf(i) {
    for (
      let multiple = 2 * i;
      multiple < PrimesGenerator.isCrossed.length;
      multiple += 1
    ) {
      PrimesGenerator.isCrossed[j] = true; // 배수는 소수가 아니다.
    }
  }

  static putUncrossedIntegersIntoResult() {
    // 지금까지 몇 개의 소수가 있는가?
    let count = 0;
    for (let i = 0; i < PrimesGenerator.isCrossed.length; i++) {
      if (PrimesGenerator.isCrossed[i]) {
        count++; // 발견된 개수를 센다.
      }
    }

    // 소스를 결과 집합에 넣는다.
    PrimesGenerator.primes = new Array(count);
    for (let i = 0, j = 0; i < PrimesGenerator.isCrossed.length; i++) {
      if (PrimesGenerator.isCrossed[i]) {
        // 소수이면
        PrimesGenerator.result[j++] = i;
      }
    }
  }
}
```

- 마지막 리팩토링
  - `putUncrossedIntegersIntoResult` 함수
    - 계산의 두부분으로 나눠서 잡다한 정리 작업을 수행한다.

```javascript
class PrimesGenerator {
  static isCrossed;
  static result;

  static generatePrimes(maxValue) {
    if (maxValue < 2) {
      return [];
    } else {
      PrimesGenerator.initializeArrayOfIntegers(maxValue);
      PrimesGenerator.crossOutMultiples();
      PrimesGenerator.putUncrossedIntegersIntoResult();

      return PrimesGenerator.result;
    }
  }

  static initializeArrayOfIntegers(maxValue) {
    // (...)
  }

  static crossOutMultiples() {
    // (...)
  }

  static calcMaxPrimeFactor() {
   // (...)
  }

  static notCrossed(i) {
    // (...)
  }

  static crossOutMultiplesOf(i) {
    // (...)
  }

  static putUncrossedIntegersIntoResult() {
    // 소스를 결과 집합에 넣는다.
    PrimesGenerator.primes = new Array(
      PrimesGenerator.numberOfUncrossedIntegers()
    );
    for (let i = 0, j = 0; i < PrimesGenerator.isCrossed.length; i++) {
      if (PrimesGenerator.notCrossed(i)) {
        // 소수이면
        PrimesGenerator.result[j++] = i;
      }
    }
  }

  static numberOfUncrossedIntegers() {
    // 지금까지 몇 개의 소수가 있는가?
    let count = 0;
    for (let i = 0; i < PrimesGenerator.isCrossed.length; i++) {
      if (PrimesGenerator.notCrossed(i)) {
        count++; // 발견된 개수를 센다.
      }
    }

    return count;
  }
}
```

### 최종 점검

- 이제 모든 프로그램이 읽을 수 있는 총체로서 제대로 결합되어 있는지 확인한다.
- `initializeArrayOfIntegers` 에 해당하는 이름이 적당하지 않다. 초기화 되고 있는 것은 사실 정수 배열이 아닌 불리언 값의 배열이다.
  - 위 메서드의 실제 하는 일은 모든 정수를 지워지지 않은 상태로 만든 다음에 배수를 지워나갈 수 있게 만드는 것이다.
  - 따라서 `uncrossIntegersUpTo` 로 이름을 바꾼다.
- 불리언 배열인 `isCrossed` 도 적당하지 않다는 사실을 꺠닫고 `crossedOut`으로 바꾼다.
- `calcMaxPrimeFactor` 에서는 제곱근 값이 꼭 소수라는 보장은 없다. 따라서 지금까지의 주석은 틀린 것이다. 또한 +1 도 진짜 루프 횟수의 한계 값은 배열 크기의 제곱근보다 작거나 같은 가장 큰 소수가 되므로 제거한다.


```javascript
/**
 * 이 클래스는 사용자가 지정한 최댓값까지의 소수를 생성한다.
 * 사용한 알고리즘은 에라토스테네스의 체다.
 * 2부터 시작하는 정수 배열을 받는다.
 * 지워지지 않은 첫 번째 정수를 찾아 그 배수를 모두 지운다.
 * 이것을 배열에 더 이상의 배수가 없을 때까지 계속한다.
 */
class PrimesGenerator {
  static corssedOut;
  static result;

  static generatePrimes(maxValue) {
    if (maxValue < 2) {
      return [];
    } else {
      PrimesGenerator.uncrossIntegersUpTo(maxValue);
      PrimesGenerator.crossOutMultiples();
      PrimesGenerator.putUncrossedIntegersIntoResult();

      return PrimesGenerator.result;
    }
  }

  static uncrossIntegersUpTo(maxValue) {
    // 선언
    PrimesGenerator.corssedOut = new Array(maxValue + 1); // 배열을 true 값으로 초기화한다.
    // 알려진 비소수를 제거
    for (let i = 2; i < PrimesGenerator.corssedOut.length; i++) {
      PrimesGenerator.corssedOut[i] = false;
    }
  }

  static crossOutMultiples() {
    const limit = PrimesGenerator.determineIterationLimit();
    for (let i = 2; i <= limit; i++) {
      if (PrimesGenerator.notCrossed(i)) {
        // 안빠진게 있다면
        PrimesGenerator.crossOutMultiplesOf(i);
      }
    }
  }

  static determineIterationLimit() {
    // 배열에 있는 모든 배수는 배열 크기의 제곱근보다 작거나 같은 소인수를 갖는다.
    // 그러므로 소인수보다 큰 숫자의 배수는 지울 필요가 없다.
    const maxPrimeFactor = Math.sqrt(PrimesGenerator.corssedOut.length);
    return parseInt(maxPrimeFactor, 10);
  }

  static notCrossed(i) {
    return PrimesGenerator.corssedOut[i] === false;
  }

  static crossOutMultiplesOf(i) {
    for (
      let multiple = 2 * i;
      multiple < PrimesGenerator.corssedOut.length;
      multiple += 1
    ) {
      PrimesGenerator.corssedOut[j] = true; // 배수는 소수가 아니다.
    }
  }

  static putUncrossedIntegersIntoResult() {
    // 소스를 결과 집합에 넣는다.
    PrimesGenerator.primes = new Array(
      PrimesGenerator.numberOfUncrossedIntegers()
    );
    for (let i = 0, j = 0; i < PrimesGenerator.corssedOut.length; i++) {
      if (PrimesGenerator.notCrossed(i)) {
        // 소수이면
        PrimesGenerator.result[j++] = i;
      }
    }
  }

  static numberOfUncrossedIntegers() {
    // 지금까지 몇 개의 소수가 있는가?
    let count = 0;
    for (let i = 0; i < PrimesGenerator.corssedOut.length; i++) {
      if (PrimesGenerator.notCrossed(i)) {
        count++; // 발견된 개수를 센다.
      }
    }

    return count;
  }
}
```

- exhaustive 한 테스트

```javascript
function testExhaustive() {
  for (let i = 2; i < 500; i++) {
    verifyPrimeList(PrimeGenerator.generatePrimes(i))
  }
}

function verifyPrimeList(list) {
  for (let i = 0; i < list.length; i++) {
    verifyprime(list[i])
  }
}

function verifyPrime(n) {
  for(let factor = 2; factor < n; factor++) {
    expect(n % factor !== 0).toBe(true)
  }
}
```

## 결론

- 한 번만 호출되는 함수를 추출해낼 경우 성능에 부정적인 영향을 주는 건 아닌지 걱정하는 사람도 있지만, 향상된 가독성이 몇 나노초 단위의 가치가 있다고 생각한다.
- 성능의 손해를 무시할 수 있다고 가정하고, 그것이 틀렸다는 것이 증명될 때까지 기다려보라고 조언하고 싶다.
- 리팩토링의 목표는 매일 코드를 청소하는 것이다. 최소한의 노력으로 시스템을 확장하고 수정할 수 있기를 바란다. 이를 위한 가장 중요한 요소는 코드의 깔끔함이다.
