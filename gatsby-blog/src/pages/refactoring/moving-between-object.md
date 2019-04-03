---
title: 객체 간의 기능 이동
date: "2019-03-27T10:00:03.284Z"
---



해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript로 전환하였습니다.

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

## 대리 객체 은폐 (Hide Delegate)

클라이언트가 객체의 대리 클래스를 호출할 땐 대리 클래스를 감추는 메서드를 서버에 작성하자.

캡슐화란 객체가 시스템의 다른 부분에 대한 정보의 일부만 알 수 있게 은폐하는 것을 뜻한다. 객체를 캡슐화하면 무언가를 변경할 때 그 변화를 전달해야 할 객체가 줄어들므로 변경하기 쉬워진다.

클라이언트가 서버 객체의 필드 중 하나에 정의된 메서드를 호출할 때 그 클라이언트는 이 대리 객체에 관해 알아야 한다. 대리 객체가 변경될 때 클라이언트도 변경해야할 가능성이 있기 때문이다. 이런 의존성을 없애려면, 대리 객체를 감추는 간단한 위임 메서드를 서버에 두면 된다.

아래에서 서버에 해당하는 것은 `Person`객체이다. 대리 객체는 `Department` 이다.

### 예제

```javascript
class Person {
  constructor() {
    this._department // Department
  }

  getDepartment() {
    return this._department
  }

  setDepartment(arg) {
    this._department = arg
  }
}

class Department {
  constructor(manager) {
    this._chargeCode
    this._manager = manager // Person
  }

  getManager() {
    return this._manager
  }
}
```

위와 같은 코드가 있다고 했을때 어떤 사람의 팀장이 누군지 알아내려면 먼저 부서를 알아내고 나서 알아내야 한다.
`manager = john.getDepartment().getManager()`
이런 의존성을 줄이려면 Department 클래스를 클라이언트가 알 수 없게 감춰야 한다. 그러려면 Person 클래스에 다음과 같이 간단히 위임 메서드를 작성한다.

```javascript
getManager() {
  return _department.getManager()
}
```

## 과잉 중개 메서드 제거 (Remove Middle Man)

클래스에 자잘한 위임이 너무 많을 땐 대리 객체를 클라이언트가 직접 호출하게 하자.

대리 객체 은폐 기법의 장점을 얻는 대신 단점도 생긴다. 클라이언트가 대리 개체의 새 기능을 사용해야 할 때마다 서버에 간단한 위임 메서드를추가해야 한다는 점이다. 여기서 서버 클래스는 그저 중개자에 불과하므로, 이때는 클라이언트가 대리 객체를 직접 호출하게 해야 한다.

```javascript
class Person {
  getDepartment() {
    return _department
  }
}

manager = john.getDepartment().getManager()
```

## 외래 클래스에 메서드 추가 (Introduce Foreign Method)

사용 중인 서버 클래스에 메서드를 추가해야 하는데 그 클래스를 수정할 수 없을 땐 클라이언트 클래스 안에 서버 클래스의 인스턴스를 첫번째 인자로 받는 메서드를 작성하자.

원본 클래스가 수정 가능하다면 그 기능의 메서드를 추가하면 된다. 하지만 원본 클래스를 수정할 수 없다면 그 메서드를 클라이언트 클래스 안에 작성해야 한다.

### 예제

대금 결제일을 연기하는 원본 코드는 다음과 같다. 여기서 `previousEnd`가 서버 클래스이다.

```javascript
const newStart = new Date(previousEnd.getYear(), previousEnd.getMonth(), previousEnd.getDate() + 1)

// 우변 코드를 뺴내어 메서드로 만들자.
const newStart = nextDay(previousEnd)
nextDay(arg) {
  return new Date(arg.getYear(), arg.getMonth(), arg.getDate() + 1)
}
```

## 국소적 상속확장 클래스 사용

사용 중인 서버 클래스에 여러 개의 메서드를 추가해야 하는데 클래스를 수정할 수 없을 땐 새 클래스를 작성하고 그 안에 필요한 여러 개의 메서드를 작성하자.
이 상속확장 클래스를 원본 클래스의 하위 클래스나 래퍼 클래스로 만들자.

클래스 제작자도 신이 아니므로 개발자에게 필요한 메서드가 전부 든 클래스를 만드는건 불가능에 가깝다. 원본 클래스를 수정하는 것이 불가능할 때가 대부분이다.
필요한 메서드 수가 3 개 이상이면 필요한 메서드들을 적당한 곳에 모아둬야 한다.

### 예제: 하위 클래스 사용

```javascript
class Client {
  nextDay(date) {
    // Date 객체를 받아서 이용하는 메서드
    return new Date(date.getYear(), date.getMonth(), date.getDate() + 1)
  }
}

// 위의 Client에 메서드를 두지말고 Date를 상속받아서 내가 필요한 메서드를 옮겨두자.
class MfDateSub extends Date {
  constructor(dateString) {
    super(dateString)
  }

  nextDay() {
    // 더이상 date 객체를 받지 않아도 사용가능하다.
    return new Date(this.getYear(), this.getMonth(), this.getDate() + 1)
  }
}
```
