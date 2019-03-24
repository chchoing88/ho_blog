---
title: 객체 간의 기능 이동
date: "2019-03-27T10:00:03.284Z"
---

# 객체 간의 기능 이동

**기능을 어디에 넣을지 판단** 하는것은 중요하다.
기능을 넣을 적절한 위치를 찾는 문제는 메서드 이동과 필드 이동을 실시해서 기능을 옮기면 해결된다. 이때, 필드 이동 부터 실시한후 메서드 이동을 실시하는것이 좋다.

클래스가 방대해지는 원인은 대개 기능이 너무 많기 때문이다. 이럴때 클래스 추출을 실시해서 이런 많은 기능을 일부 분리해야한다.

이 밖에 다양한 기능들을 알아보자.

## 메서드 이동 (Move Method)

메서드가 자신이 속한 클래스보다 다른 클래스 기능을 더 많이 이용할 땐그 메서드가 제일 많이 이용하는 클래스 안에서 비슷한 내용의 새 메서드를 작성하자.
기존 메서드는 간단한 대리 메서드로 전환하든이 아예 삭제하자.

메서드를 옮길지 확신이 서지 않을 때는 다른 메서드를 살펴본다. 다른 메서드를 옮길지를 판단하는 것이 대체로 더 쉽게 마련이다.

## 필드 이동 (Move Field)

어떤 필드가 자신이 속한 클래스보다 다른 클래스에서 더 많이 사용될 때는대상 클래스 안에 새 필드를 선언하고 그 필드 참조 부분을 전부 새 필드 참조로 수정하자.

### 예제: 필드 캡슐화

```javascript
class Account {
  constructor() {
    // this._interestRate
  }

  interestForAmount_days() {
    //return this._interestRate * 10
    return _type.getInterestRate() * 10
  }
}

// _interest 필드를 AccountType 클래스로 옮기려 한다.

class AccountType {
  constructor() {
    // private
    this._interestRate
  }

  setInterestRate(arg) {
    this._interestRate = arg
  }

  getIntersetRate() {
    return this._interestRate
  }
}
```

### 예제: 필드 자체 캡슐화

많은 메서드가 interestRate 필드를 사용한다면 다음과 같이 필드 자체 캡슐화를 실시한다.

```javascript
class Account {
  constructor() {
    this._interestRate
  }

  interestForAmount_days() {
    return getInterestRate() * 10
  }

  getInterestRate() {
    return this._interestRate
  }

  setInterestRate(arg) {
    this._interestRate = arg
  }
}
```

## 클래스 추출 (Extract Class)

두 클래스가 처리해야 할 기능이 하나의 클래스에 들어 있을 땐 새 클래스를 만들고 기존 클래스의 관련 필드와 메서드를 새 클래스로 옮기자.
주로 함께 변화하거나 서로 유난히 의존적인 데이터의 일부분도 클래스로 떼어내기 좋다.
이것을 판단하는 좋은 방법은 데이터나 메서드를 하나 제거하면 어떻게 될지, 다른 필드와 메서드를 추가하는 건 합리적이지 않은지 자문해보는 것이다.

```javascript
class Person {
  _officeTelephone = new TelephoneNumber()

  getName() {
    return _name
  }
  // getTelephoneNumber() {
  //   return _officeAreaCode + _officeNumber
  // }

  // getOfficeAreaCode() {
  //   return _officeAreaCode
  // }

  //....
}
```

위와 같은 `Person` 클래스에서 Telephone 관련한 부분들은 `TelephoneNumber` 객체로 떼어내자. 그 후 관련 메서드 들도 옮기자.
그 후에 생각해야 할 것은 새로운 클래스를 클라이언트에 어느 정도 공개할지 결정하자.

## 클래스 내용 직접 삽입 (Inline Class)

클래스에 기능이 너무 적을땐 그 클래시의 모든 기능을 다른 클래스로 합쳐 넣고 원래의 클래스는 삭제하자.

주로 클래스의 기능 대부분을 다른 곳으로 옮기는 리팩토리응ㄹ 실시해서 남은 기능이 거의 없어졌을 때 나타난다. 이럴 때는 이 작은 클래스를 가장 많이 사용하는 다른 클래스를 하나 고른후, 이 클래스를 거기에 합쳐야 한다.

위에서 `Person` 객체의 기능이 많이 줄었다면 `TelephoneNumber` 클래스의 클라이언트를 찾아서 `Person` 클래스의 인터페이스를 사용하도록 다음과 같이 수정하자.

```javascript
const martin = new Person()
martin.getOfficeTelephone.setAreaCode('181')

// Todo
const martin = new Person()
martin.setAreaCode('181')
```
