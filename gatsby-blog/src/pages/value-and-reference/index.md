---
title: Javascript의 Value와 Reference Types 이해
date: "2019-04-07T10:00:03.284Z"
---

자바스크립트는 메모리에 있는 데이터 구조의 전체 접근 권한을 주지 않는다.
하지만 언어차원에서 reference types 는 존재한다.
value 와 reference types 의 혼합은 원하지 않은 사이드 이펙트나 버그를 유발하기도 한다.
value 와 reference types 를 이해는 강력한 프로그래밍을 작성하는데 중요한 역활을 한다.

이 기사는 자바스크립트의 value 와 reference types 를 입문단계에서 소개한다.

### Value and Reference types

Numbers, booleans, strings, null and undefined 은 원시타입들이다. 모든 원시 타입들은 값에 의해 전달된다. Objects, arrays, and functions 들은 참조로 전달된다.

Strings 은 자바스크립트에서 특별한 존재이다. 다른 많은 언어와 달리 string 은 character 의 배열처럼 정의 되지 않는다. 무엇보다 character 타입이 자바스크립트에는 존재하지 않는다. Strings 는 변화하지 않는 데이터 타입으로 문자 배열처럼 보이게 하는 인터페이스를 지니고 있다. 실제로 문자열을 수정하면 새로운 불변의 값이 생겨난다.

다음 콘솔로그의 결과를 함께 알아보자.

```javascript
var people = [{ name: 'John Hill', age: 22 }, { name: 'Jack Chill', age: 27 }]

var getInitials = function(name) {
  // Reusing the name argument makes little sense in general.
  // We are making this assignment here for demonstrating
  // the difference between value types and reference types.
  name = name
    .split(' ')
    .map(function(word) {
      return word.charAt(0)
    })
    .join('')
  console.log(name)
  return name
}

var increaseAge = function(person) {
  person.age += 1
}

var addPerson = function(people, name, age) {
  people.push({ name: name, age: age })
}

// Part 1: getInitials
console.log(getInitials(people[0].name))
console.log(people[0].name)

// Part 2: increaseAge
increaseAge(people[1])
console.log(people[1].age)

// Part 3: addPerson
addPerson(people, 'Jim Gordon', 32)
console.table(people)
```

**Question**: 무엇이 콘솔에 기록이 될까?
**Answer**:

* 첫번째 파트에서 name 의 이니셜들은 `getInitials` 함수에 의해서 구성이 된다. 문자열 값은 함수에 복사 되서 전달됩니다. 이 복사된 값은 함수 안에서 접근되고 수정됩니다. 이 수정들은 원본 `people[0].name` 에 영향을 끼치지 않는다.
* `increaseAge` 함수는 객체를 받는다. 이 객체들은 reference types 이기 때문에 `person`의 레퍼런스 값이 복사되어서 전달된다. 이 객체 레퍼런스의 멤버들을 수정할때, 이 변화들은 함수 실행 이후로도 유지된다. 이러한 변경 사항은 각 참조를 통해 액세스 할 수 있다.
* Arrays 들도 reference types 이다. array 에 element 를 추가하면 이 변화는 계속 지속이 된다.

```javascript
JH
JH
John Hill
28

(index)  name  age
0  "John Hill"  22
1  "Jack Chill"  28
2  "Jim Gordon"  32
```

정리:

* `console.table`은 나이스한 로깅 유틸리티이다. 이것은 모던 브라우저에서 object 를 배열의 테이블 처럼 표시해준다.

### 실수: value type 을 reference type 으로 다루다.

`increaseAge` 메서드를 잘못 사용하는 경우이다.

```javascript
function increaseAge(age) {
  age += 1
}
console.log('Before:', people[0].age)
increaseAge(people[0].age)
console.log('After:', people[0].age)
```

이 `increaseAge`를 실행시켜도 나이는 22 로 유지된다. 원시 타입은 값으로 전달되기 때문이다. 복사된 값의 변화는 원본에 아무런 영향을 끼치지 않는다. 항상 변화되길 원한다면 array 나 object 로 원하는 필드를 감싸야 한다.

다른 예는 person 을 다른 person 으로 변화시키려는 시도이다.
`replacePerson` 함수는 3 가지의 매개변수를 받는다. person 을 새로운 name 과 age 를 가지고 변화시키는 로직이 있다.

```javascript
function replacePerson(person, name, age) {
  person = { name: name, age: age }
}
replacePerson(people[1], 'Jack Newtown', 35)
console.table(people)
```

이 함수는 person 매개변수에 새로운 값을 할당받았으므로 people 객체에 아무것도 하지 않는다. people 데이터 구조는 그대로 유지된다. 함수 안에 있는 person 은 완전히 새로운 객체를 할당받게 됩니다. 함수가 종료후 이 새로운 객체는 버려지게 됩니다.

### 실수: reference type 을 value type 으로 다루다.

고객이 슈퍼마켓에 들어가서 츄잉껌을 구입한다고 가정하자. 고객은 또한 빈병을 부지런히 수집했으며 1000 유로 바우처에 가치가 있는 4000 병을 현금으로 바꿔 왔다. 계산원이 지불금을 수락 할 수있는 충분한 자금이 있는지 확인하고 있다. 이 검사는 boolean 결과를 반환하는 canChange 함수에 의해 수행된다.

```javascript
var shopTransaction = {
  items: [{ name: 'Astro Mint Chewing Gum' }],
  price: 1,
  amountPaid: 1000,
}

var cashier = {
  units: [500, 200, 100, 50, 20, 10, 5, 2, 1],
  quantity: [0, 0, 5, 4, 5, 10, 10, 20, 9],
}

function canChange(shopTransaction, cashier) {
  var amount = shopTransaction.amountPaid - shopTransaction.price
  for (var i = 0; i < cashier.units.length; ++i) {
    var unit = cashier.units[i]
    while (amount >= unit && cashier.quantity[i] > 0) {
      amount -= unit
      cashier.quantity[i] -= 1
    }
  }
  return amount === 0
}
console.log(canChange(shopTransaction, cashier))
console.log(cashier.quantity)
```

이 함수는 우리가 기대하는 값을 반환하지만 여전히 문제가 있다. `canChange` 함수를 실행하면 side effect 이 발생하여 모든 기록이 cashier 에서 사라졌다. 왜?

문제는 `cashier`이 참조 유형이라는 것이다. cashier 내부의 필드에 대한 모든 변경 사항은 함수 종료 후에도 유지된다.

가능한 해결책은 새로운 변수를 생성하고이를 `cashier.quantity[i]`와 동일시하는 것이다. 이것은 우리가 원시 타입을 다루고 있기 때문에 `cashier.quantity[i]`의 값을 메모리의 새로운 위치에 복사 할 것이다.

```javascript
function canChange(shopTransaction, cashier) {
  var amount = shopTransaction.amountPaid - shopTransaction.price
  for (var i = 0; i < cashier.units.length; ++i) {
    var unit = cashier.units[i]
    var currentQuantity = cashier.quantity[i]
    while (amount >= unit && currentQuantity > 0) {
      amount -= unit
      currentQuantity -= 1
    }
  }
  return amount == 0
}
```

이론적으로, 값을 변경하기위해 지원하지 않는 함수에서 모든 참조 유형을 깊이 복제 할 수도 있다. 깊은 복제는 말은 쉽지만 그렇지 않다. 우리는 다음 기사에서 다양한 유형의 복제를 탐색 할 것이다.

### 요약

기본 유형은 값으로 전달 된다. 배열, 객체 및 함수는 참조로 전달된다. 두 가지를 섞어 본 적이 있다면 위의 예를 살펴봐야 합니다. 예제에서 이야기 한 이야기를 함수가 가질 수있는 여러 유형의 인수와 연관 시켜야 한다. 실수를 피하기 위해 이러한 개념이 자연스럽게 나타날 때까지 계속 연습하자.
