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
      const length = maxValue + 1; // 배열 크기 - 1부터 시작이니
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
