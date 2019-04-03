---
title: 조건문 간결화
date: "2019-04-03T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript로 전환하였습니다.

## 조건문 쪼개기 (Decompose Conditional)

복잡한 조건문(if-then-else)이 있을땐 if, tehn, eles 부분을 각각 메서드로 빼내자.

```javascript
// bad
if(data.before(SUMMER_START) || data.after(SUMMER_END)) {
  charge = quantity * _winterRate + _winterServiceCharge
} else {
  charge = quantity * _summerRate
}

// good
if(notSummer(date)) {
  charge = winterCharge(quantity)
} else {
  charge = summerCharge(quantity)
}
```

큰 덩어리의 코드를 잘게 쪼개고 각 코드 조각을 용도에 맞는 이름의 메서드 호출로 바꾸면 코드의 용도가 분명히 드러난다. 
이 과정을 조건문의 if절, then절, else절 각각에 대해 수행하면 더 큰장점을 얻을 수 있다. 

## 중복 조건식 통합 (Consolidate Conditional Expression)

여러 조건 검사식의 결과가 같을 땐 하나의 조건문으로 합친 후 메서드로 빼내자.

서로 다른 여러 개의 조건 검사식이 있는데 조건에 따른 결과가 모두 같을 때가 간혹 있다. 이럴 때는 논리 연산자 AND와 OR을 사용해서 여러 조건 검사를 하나로 합쳐야 한다. 
조건문을 합쳐야 하는 이유는 두가지 이다. 
첫째, 조건식을 합치면 여러 검사를 OR 연산자로 연결해서 실제 하나의 검사 수행을 표현해서 무엇을 검사하는지 더 확실히 이해할 수 있다.
둘째, 이러한 조건식 통합 리팩토링 기법을 실시하면 메서드 추출을 적용할 수 있는 기반이 마련된다. 

조건 검사식이 독립적이고 하나의 검사로 인식되지 말아야 할 땐 이방법을 사용하지 말자. 

### 예제: 논리합(OR) 연산자

```javascript

```

## 조건문의 공통 실행 코드 뺴내기 (Consolidate Duplicate Conditional Fragments)

## 제어 플래그 제거 (Remove Control Flag)

## 여러 겹의 조건문을 감시 절로 전환 (Replace Nested Conditional with Guard Clauses)

## 조건문을 재정의로 전환 (Replace Conditional with Polymorphism)

## Null 검사를 널 객체에 위임 (Introduce Null Object)

## 어설션 넣기 (Introduce Assertion)