---
title: 일반화 처리
date: "2019-04-22T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript 로 전환하였습니다.

일반화 관련 리팩토링 기법은 별도로 분류할 수 있다. 일반화는 주로 상속 계층구조나 상속 계층의 위나 아래로, 즉 상위클래스나 하위클래스로 메서드를 옮기는 기법이다.

## 필드 상향

```
classDiagram

Employee <|-- Salesman
Employee <|-- Engineer
Salesman : string name
Engineer : string name
```

위 상황을 아래 처럼 수정하자.

```
classDiagram

Employee <|-- Salesman
Employee <|-- Engineer
Employee : string name
```

두 하위클래스에 같은 필드가 들어 있을 땐 필드를 상위 클래스로 옮기자.

각각의 하위클래스를 따로 개발중이거나 리팩토링을 적용해서 연결할 경우, 여러 하위클래스에 중복된 기능이 들어 있는 경우가 많다.
특히 특정한 몇 개의 필드가 중복될 수 있다. 중복된 필드는 이름이 서로 비슷할 때도 있다. 어느 필드가 무슨 용도로 쓰이는지 알려면,
필드를 살펴보면서 다른 메서드에 어떤 식으로 사용되는지 보면 된다. 중복된 필드가 서로 비슷한 방식으로 사용된다면 그 필드를 일반화 화면 된다.
일바화란 상위클래스로 옮기는 작업을 말한다.

여기서 만약 필드가 private 이면 상위클래스 필드를 protected 로 수정해서 하위클래스가 참조할 수 있게 하자.

## 메서드 상향

기능이 같은 메서드가 여러 하위클래스에 들어 있을땐 그 메서드를 상위클래스로 옮기자.

메서드 상향을 적용해야 할 가장 단순한 상황은 메서드의 내용이 마치 복사해서 붙여 넣은 것처럼 서로 같을 때다.
메서드 상향은 다른 리팩토링 단계를 마친 후 적용하는 것이 일반적이다. 다른 클래스에 들어 있는 두 개의 메서드가 매개변수로 전환되어 결국 실제론 같은 메서드가 될 수도 있다. 이럴 때 가장 작은 단계는 각 메서드를 따로따로 매개변수로 전환한 후 상위클래스로 옮기면 된다.

메서드를 매개변수로 전환 -> 메서드 안의 로직은 비슷하고 어떤 특정한 값만 다를때 그 값을 매개변수로 전달 받는 메서드를 하나 작성하자. 여기서 추가 메서드가 생겨날 수도 있고 2 개의 메서드가 하나의 메서드로 합쳐질 수 도 있다. ( 메서드 호출 단순화 참조 )

메서드 상향을 실시해야 할 특수한 상황은 하위클래스 메서드가 상위클래스 메서드를 재정의함에도 불구하고 기능이 같을 때다.

### 예제

```javascript
class Customer {
  constructor(){
    this.lastBillData
  }

  addBill()

}

// 일반 고객
class RegularCustomer extends Customer {
  // 상위로 올려 보낼 메서드
  createBill(date) {
    const chargeAmount = this.chargeFor(this.lastBillDate, date)
    this.addBill(data, charge)
  }
  // 하위 클래스마다 로직이 다 다르다.
  chargeFor() {

  }
}

// 단골 고객...
class PreferredCustomer extends Customer {

}
```

이때 `createBill` 메서드는 그냥 상위클래스로 올려보낼 수 없다. 왜냐하면 `this.chargeFor` 메서드가 하위클래스 마다 다르기 때문이다. 이때, 하위 메서드에서 `chargeFor` 메서드를 구현하지 않는다면 문제가 생길 수 있다.
그래서 자바에서는 `Custom` 클래스에 `abstract chargeFor` 메서드를 정의하지만 javascript 에서는 그냥 상위 클래스에 정의한다.

## 생성자 내용 상향

하위클래스마다 거의 비슷한 내용의 생성자가 있을 땐 상위클래스에 생성자를 작성하고, 그 생성자를 하위클래스의 메서드에서 호출하자.

개발자는 여러 하위클래스에 같은 기능의 메서드가 든 것을 발견하면 우선적으로 공통적인 부분을 메서드로 빼낸 후 상위클래스로 옮길 생각을 하게 된다.
그러나 하위클래스는 대체로 공통적인 기능이 생성 기능이다. 이럴 땐 하위클래스에서 생성자 메서드를 작성하고 상위클래스로 올려서 하위클래스들이 호출하게 해야한다. `super()`
대부분 공통적인 기능은 생성자 내용 전체다. 생성자는 상속이 불가능하기 때문에 메서드 상향(메서드를 부모에게 정의한다.)을 적용할 수 없다.

### 예제

```javascript
// as-is
class Manager extends Employee {
  constructor(name, id, grade) {
    this._name = name
    this._id = id
    this._grade = grade
  }
}

// to-be
class Manager extends Employee {
  constructor(name, id, grade) {
    super(name, id)
    this._grade = grade
  }
}
```

나중에 공통적인 코드가 발견될 땐 조금 달라진다. 아래와 같은 코드가 있다고 하자.

```javascript
class Employee {
  constructor(name, id) {
    this._name = name
    this._id = id
  }
  isPriviliged() {}
  assignCar() {}
}

class Manager extends Employee {
  constructor(name, id, grade) {
    super(name, id)
    this._grade = grade
    if (isPriviliged) this.assignCar() // 모든 하위클래스의 공통 기능
  }

  isPriviliged() {
    return this._grade > 4
  }
}
```

여기서 `assingCar` 메서드의 기능은 상위클래스 생성자 안으로 옮길 수 없다. 왜냐하면 `grade`가 `_grade` 필드에 대입된 후 실행되어야 하기 때문이다.
따라서 메서드 추출과 메서드 상향을 적용해야 한다.

```javascript
class Employee {
  initialize() {
    if (this.isPriviliged()) this.assignCar()
  }
}

class Manager extends Employee {
  constructor(name, id, grade) {
    super(name, id)
    this._grade = grade
    this.initialize()
  }
}
```

## 메서드 하향

상위클래스에 있는 기능을 일부 하위클래스만 사용할 땐 그 기능을 관련된 하위클래스 안으로 옮기자.
메서드 하향은 메서드 상향과는 반대되는 기법이다. 이 기법은 상위 클래스의 기능을 특정 하위클래스로 옮겨야 할 때 사용한다.

## 필드 하향

일부 하위클래스만이 사용하는 필드가 있을 땐 그 필드를 사용하는 하위클래스로 옮기자.
필드 하향은 필드 상향과 정반대다. 이 기법은 필드가 상위클래스엔 필요 없고 하위클래스에만 필요할 때 사용하자.

## 하위클래스 추출

일부 인스턴스에만 사용되는 기능이 든 클래스가 있을 땐 그 기능 부분을 전담하는 하위클래스를 작성하자.

```
classDiagram

JobItem : getTotalPrice
JobItem : getUnitPrice
JobItem : getEmployee
```

위 상황을 아래 처럼 수정하자.

```
classDiagram

JobItem <|-- LaborItem
JobItem : getTotalPrice
JobItem : getUnitPrice

LaborItem : getUnitPrice
LaborItem : getEmployee
```

하위클래스 추출은 주로 클래스의 기능을 그 클래스의 일부 인스턴스만 사용할 때 적용한다.
이 기법 대신 클래스 추출을 사용할 수 ㅇㅆ다. 이 두 기법은 위임이냐 상속이냐의 차이이다. 하위클래스 추출기법이 보통은 더 간단하지만 단점이 있다.
첫째, 객체가 생성된 후에는 객체의 클래스 기반 기능을 수정할 수 없다. 클래스 기반 기능을 수정하려면 단순히 다른 각종 컴포넌트를 연결해서 클래스 추출을 실시하면 된다.
둘째, 하위클래스를 사용해서 한가지 변형만을 표현할 수도 있다. 클래스가 다양하게 변하게 하려면 하나가 아닌 모두를 대상으로 위임을 적용해야 한다.

### 예제

동네 정비소에서 작업 종류별 가격을 구하는 JobItem 클래스는 다음과 같다.

```javascript
class JobItem {
  constructor(unitPrice, quantity, isLabor, employee) {
    this._unitPrice = unitPrice
    this._quantity = quantity
    this._isLabor = isLabor
    this._employee = employee
  }

  getTotalPrice() {}

  getUnitPrice() {
    return this._isLabor ? this._employee.getRate() : this._unitPrice
  }

  getQuantity() {}

  getEmployee() {}
}

class Employee {
  constructor(rate) {
    this._rate = rate
  }

  getRate() {}
}
```

위 클래스에서 LaborItem 하위클래스를 추출하자. 그래야 하는 이유는 기능과 데이터 중 일부가 LaborItem 클래스에만 사용되기 때문이다.

```javascript
class LaborItem extends JobItem {
  constructor(unitPrice, quantity, isLabor, employee) {
    super(unitPrice, quantity, isLabor, employee)
  }
}
```

하지만 생성자가 지저분해진다. LaborItem 에 어떤 인자들은 필요하고 어떤 인자들은 필요하지 않다.
또한 isLabor 의 경우에는 Labor 인지 아닌지에 대한 정보를 위한 값이기 때문에 재정의 상수 메서드로 따로 빼둔다.
unitPrice 필드의 경우 Labor 는 0 의 값으로 고정이다.
employee 필드는 내려간 하위 클래스 에서만 값이 설정되게 생성자를 정리하자.
밖의 호출 중 LaborItem 의 생성자가 대신 호출되어야 할 경우들을 찾아서 다음과 같이 수정하자.

```javascript
const j1 = new LaborItem(10, kent)

class JobItem {
  constructor(unitPrice, quantity, isLabor) {
    this._unitPrice = unitPrice
    this._quantity = quantity
    this._isLabor = isLabor
    // this._employee = employee
  }

  isLabor() {
    return false
  }

  // getUnitPrice() {
  //   return this._isLabor ? this._employee.getRate() : this._unitPrice
  // }
  getUnitPrice() {
    return this._unitPrice
  }
}

class LaborItem extends JobItem {
  constructor(quantity, employee) {
    super(0, quantity, true)
    this._employee = employee
  }

  isLabor() {
    return true
  }

  getUnitPrice() {
    return this._employee.getRate()
  }
}
```

getUnitPrice 메서드의 경우에는 조건문을 재정의로 전환을 적용해야 한다. (여기서 조건문에 해당되는 각 로직들을 해당 조건 타입의 클래스에게 해당 메서드를 재 정의 함으로써 조건문을 분리시킬 수 있는 기법이다.)
일부 데이터를 사용하는 메서드들을 하위클래스로 내린 후 데이터에 필드 하향을 적용하자. 어떤 메서드가 그 데이터를 사용해서 개발자가 그 메서드를 사용할 수 없다면,
추가로 메서드 하향이나 조건문을 재정의로 전환을 실시해야 한다.
unitPrice 필드는 근로(labor)와 관련 없는 항목들에만 사용되므로 JobItem 을 대상으로 하위클래스 추출을 다시 실시해서 PartsItem 클래스를 만들면 된다.
작업을 완료하면 JobItem 클래스는 abstract 타입이 된다.

## 상위클래스 추출

## 인터페이스 추출

## 계층 변합

## 템플릿 메서드 형성

## 상속을 위임으로 전환

## 위임을 상속으로 전환
