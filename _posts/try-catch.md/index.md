---
title: Using JavaScript’s Try-Catch Statement
date: "2019-06-07T10:00:03.284Z"
---

이 글은 [https://www.impressivewebs.com/javascript-try-catch/](https://www.impressivewebs.com/javascript-try-catch/) 의 번역 본입니다.

내가 javascript app 들을 개발할때 꽤 도움이 되는 한가지 기술은 Javascript `try-catch` 문이라고 믿는다. ( 또는 `try-catch-finally` 라고도 불리운다. ) 나는 지난 년도에 try-catch 와 친해지게 되었는데, 비록 많이 쓴적은 없다. 그러다. 여러 환경에서 유용하다는 점을 발견했다.

이 기사는 `try-catch` 를 설명하고 어떻게 사용하는지와 어떻게 web application 을 만들때 유저를 덜 화나게 만들 수 있는지를 알아볼 것이다.

## Basic Syntax and Definition

`try-catch` 문은 ECMA-262 3 판에서 예외 처리하는 방법으로 소개 되어졌다. 이 문법은 Java 프로그래밍 언어와 흡사하다.
여기 기본적으로 어떻게 사용되어지는 지 볼수 있다.

```js
try {
  // code that might cause an error goes here
} catch (error) {
  // error message or other response goes here
}
```

`try` 위치에는 error 를 던질 법한 어떤 코드가 와도 관계없다. 다른말로 하면, 모든 중요한 코드는 try 섹션 안에 위치 시켜야 한다.

`catch` 위치 또한 코드를 위치 시킬수 있지만, 이 위치는 application 의 동작엔 치명적이지 않는다. 그래서 만약 `try-catch`문이 함께 제거 된다면 `try` 파트안에 코드는 그대로 일 것이다. 하지만 `catch`문 안에 있는 코드는 제거가 될 것이다.

만약 `try` 파트에서 에러가 발생이 된다면 `try` 영역에서 빠져나와 `catch` 영역으로 넘어가 실행된다. `catch` 영역에서는 error 정보가 담긴 Javascript 객체를 받게 된다. `error` 식별자는 필요하다. 하지만 어떤 커스텀한 네임을 줄 순 있다. 예를 들면 다음 예제는 위 예제와 같다.

```js
try {
  // code that might cause an error goes here
} catch (watermelon) {
  // error message or other response goes here
}
```

위 예제에서 "error" 식별자는 "watermelon"으로 바뀌었다. 하지만 이건 같은 결과를 나타낸다. 명확하게 "watermelon"은 비생산적이다. 그러나 이것은 간단하게 이름이 유연하다는것을 증명하는 셈이다. 꼭 필요한건 아니다.

## Outputting the Exact Error That Occurred

`error` 객체는 `message`라는 프로퍼티를 호출할 수 있다. 이것은 에러 발생의 디테일한 정보를 가리킨다. 그래서 다음과 같은 방법으로 커스텀 에러를 확인할 수 있다.

```js
try {
  doSomething() // this function doesn't exist
} catch (error) {
  alert(error.message)
}
```

만약 위 코드가 동작할때, 브라우저는 alert 메세지를 “doSomething is not defined” 라고 나타낼것이다.
error 객체는 또한 `name` 이란 프로퍼티도 호출할 수있다. 이것은 error 를 좀 더 기술적인 관점에서 설명을 해준다. 하지만 실제로 그리 사용하진 않는다. 이 두개의 프로퍼티들은 크로스 브라우저에서 호환가능한 것들이다. 다른 브라우저들은 커스텀 프로퍼티들을 제공한다. 그 예로 파이어 폭스에서 제공하는 `lineNumber` 이다. 하지만 그장 최고는 `message` 프로퍼티 이다. 그것은 가장 호환성이 좋고 실용적인 것이기 때문입니다.

## The Optional “finally” Clause

`try-catch` 문을 사용하면 `finally` 절을 포함 할 수도 있습니다. `finally` 섹션의 코드는 무슨일이 있어도 실행됩니다. 이것은 `try` 섹션에서 사실이 아니기 때문에 유용합니다. 디버깅을 목적으로 (또는 다른 이유로) 오류가 발생하더라도 특정 코드 섹션을 실행해야 할 수 있습니다. 이러한 코드는 finally 섹션에 배치해야합니다. try 섹션이나 catch 섹션에서 finally 섹션이 실행되지 못하게하는 어떤 것도 없습니다. 각 섹션에 다른 return 문이있는 경우에도 마지막 return 문 (finally 섹션의 문) 만 실제로 "반환"됩니다.

다음 예제를 보십시요.

```js
function testReturn() {
  try {
    return 'bananas'
  } catch (error) {
    return 'oranges'
  } finally {
    return 'watermelons'
  }
}

alert(testReturn())
```

경고 메시지는 "bananas"(오류가 없으므로)라고 표시해야하지만 실제로는 "watermelons"을 출력합니다. 왜냐하면 finally 절은 오류와 상관없이 항상 실행되기 때문입니다. 물론 이것은 return 문의 특성 때문에 발생합니다. try 섹션은 여전히 ​​ 실행되지만 try 절의 반환은 finally 절의 반환에 의해 무시됩니다.

다음은 약간 수정 된 동일한 코드입니다.

```js
function testReturn() {
  try {
    alert('bananas')
  } catch (error) {
    return 'oranges'
  } finally {
    return 'watermelons'
  }
}

alert(testReturn())
```

이제 출력은 두 개의 경고문이됩니다. 첫 번째는 "bananas"이고 두 번째는 "watermelons"입니다. 재정의 된 return 문으로 인해 발생하는 문제를 방지하려면 try 및 finally 절에 return 문이 모두 포함되어 있지 않은지 확인하십시오. 그렇지 않으면 finally 반환 만 실제로 "반환"됩니다.

## When Should You Use try-catch?

`try-catch` 문은 유저로 부터 에러를 감추길 원한다거나 사용자의 이익을 위해서 custom error 들을 생성하길 원한다면 언제나 사용하는게 좋습니다. 만약 아직도 언제 `try-catch`문이 실행되어야 하는지 모르겠다면, 브라우저의 일반적인 에러 핸들링 메카니즘은 disable 될것입니다.

대형 응용 프로그램을 빌드 할 때 이점을 볼 수 있습니다.
모든 응용 프로그램의 흐름에서 가능한 모든 상황을 디버깅하는 것은 종종 시간이 많이 걸리고 많은 에러 가능성이 우연히 간과 될 수 있습니다. 물론 적절한 버그 테스트를 통해 어떤 영역도 간과해서는 안됩니다. 그러나 try-catch 문은 개발 중에 예상하지 못한 비정상적인 상황에서 실패 할 수있는 코드 영역에서 멋진 대체 기능으로 작동합니다.

try-catch 문이 제공하는 또 다른 이점은 과도하게 이해할 수 없는 사용자가 지나치게 기술적인 오류 메시지를 숨기는 것입니다.

try-catch 를 사용하는 가장 좋은시기는 어떤 이유에서 건 제어가 불가능한 오류가 의심되는 코드 부분에 있습니다.

## When Should try-catch be Avoided?

당신이 만약 error 가 발생될것을 알고 있다면 `try-catch`를 사용하지 말아야 한다. 왜냐하면 이런 경우에 이 문제를 아마 감추지 않고 디버그 하길 원할 것이기 때문이다. `try-catch` 문은 오류가 발생할 것으로 의심되는 코드 섹션에서만 실행되어야하며, 압도적 인 수의 상황으로 인해 오류가 발생할 것인지 또는 언제 발생될 것인지 완전히 확인할 수 없다. 후자의 경우`try-catch` 사용이 적절해 보일 것입니다.

## Are There Performance Issues with try-catch?

간단히 말하면 답은 yes 입니다. [MSDN 의 이 기사](<https://docs.microsoft.com/en-us/previous-versions/dotnet/articles/ms973839(v=msdn.10)>)에서는 캐치 부분이 실제로 실행될 때만 성능에 영향을 미쳤다고 말합니다.

[이 기사](https://stackoverflow.com/questions/1350264/try-catch-performance)에 대한이 반응은 그렇지 않다는 것을 암시합니다.

[An article on the Opera Developer Community](https://dev.opera.com/articles/efficient-javascript/?page=2) 기사에서는 `try-catch-finally`는 성능에 중요한 함수 안에서는 피하라고 권장합니다.

마지막으로, `try-catch` 구문은 좋지만, 제약들을 받는다. [bit of info on try-catch in relation to performance](https://books.google.co.uk/books?id=ED6ph4WEIoQC&lpg=PP1&dq=javascript+performance&pg=PA23&hl=ko#v=onepage&q&f=false), in Nicholas Zakas’ new book, High Performance JavaScript.

뭐가 정확하다고 확신할순 없지만 가장 적절한 상황안에서 사용한다면 퍼포먼스 hits 는 최소한으로 영향을 미칠 것이다.

전체적으로 try-catch 는 여러 가지 상황에서 유용 할 수 있습니다. 특히 개발자가 제어 할 수없는 상황을 만들 수있는 대규모 응용 프로그램을 만들 때 유용합니다.

## 느낀점

에러가 어떻게 터지는지는 알지만 언제 터질지 또는 에러가 진짜 발생될지 모른다면 try-catch 문을 사용해서 (확인된 예외) 예외를 처리하자. ( 사용자의 잘못된 조작으로 인한 예외 - 잘못된 파일을 선택 했을 경우, 서버 api 의 예측 못한 에러로 인한 예외 )
반면, 에러가 언제 터질지 ( 특히 타입 체크 - 잘못된 타입이 들어왔을 경우 ) 알수 있다면 try-catch 문을 사용하지 말자.
특히 catch 문은 특별히 간결하게 사용하자.
try 문을 하나의 트랜젝션으로 보고 일관성을 지킬 수 있는 작업 단위로 바라보자.
