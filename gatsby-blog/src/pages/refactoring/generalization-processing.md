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
이 기법 대신 클래스 추출을 사용할 수 있다. 이 두 기법은 위임이냐 상속이냐의 차이이다. 하위클래스 추출기법이 보통은 더 간단하지만 단점이 있다.
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

  getTotalPrice() {
    this.getUnitPrice() * this._quantity
  }

  getUnitPrice() {
    return this._isLabor ? this._employee.getRate() : this._unitPrice
  }

  getQuantity() {
    return this._quantity
  }

  getEmployee() {
    return this._employee
  }
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

하지만 생성자가 지저분해진다. `LaborItem` 에 어떤 인자들은 필요하고 어떤 인자들은 필요하지 않다.
또한 `isLabor` 필드의 경우에는 `Labor` 인지 아닌지에 대한 정보를 위한 값이기 때문에 재정의 상수 메서드로 따로 빼둔다.
`unitPrice` 필드의 경우 Labor 는 0 의 값으로 고정이다.
`employee` 필드는 내려간 하위 클래스 에서만 값이 설정되게 상위클래스 생성자를 정리하자.
밖의 호출 중 `LaborItem` 의 생성자가 대신 호출되어야 할 경우들을 찾아서 다음과 같이 수정하자.

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

  // 기존 조건문.
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

`getUnitPrice` 메서드의 경우에는 조건문을 재정의로 전환을 적용해야 한다. (여기서 조건문에 해당되는 각 로직들을 해당 조건 타입의 클래스에게 해당 메서드를 재 정의 함으로써 조건문을 분리시킬 수 있는 기법이다.)
일부 데이터를 사용하는 메서드들을 하위클래스로 내린 후 데이터에 필드 하향을 적용하자. 어떤 메서드가 그 데이터를 사용해서 개발자가 그 메서드를 사용할 수 없다면,
추가로 메서드 하향이나 조건문을 재정의로 전환을 실시해야 한다.
`unitPrice` 필드는 근로(labor)와 관련 없는 항목들에만 사용되므로 `JobItem` 을 대상으로 하위클래스 추출을 다시 실시해서 `PartsItem` 클래스를 만들면 된다.
작업을 완료하면 `JobItem` 클래스는 `abstract` 타입이 된다.

## 상위클래스 추출

기능이 비슷한 두 클래스가 있을 땐 상위클래스를 작성하고 공통된 기능들을 그 상위클래스로 옮기자.

중복된 코드의 한 형태는 비슷한 작업을 같은 방식이나 다른 방식으로 수행하는 두 클래스다. 
객체에는 상속을 이용하여 이전 상황을 단순화해주는 기본 메커니즘이 있다. 그러나 클래스 몇개를 다 작성하기 전까지 공통점을 눈치채지 못할 때가 많은데,
이럴 때는 나중에 상속 구조로 만들어야 한다. 

상위클래스 추출을 적용할 수 없을땐 클래스 추출을 적용하면 된다. 두 클래스가 기능뿐 아니라 인터페이스도 같다면 상속 방식이 더 간단하다.
상위클래스 추출을 적용한게 잘못된 선택이였다면, 나중에 상속을 위임으로 전환을 실시하면 된다.

### 예제

`Employee` 클래스와 `Department` 클래스가 있다.

```javascript
class Employee {
  constructor(name, id, annualCost) {
    this._name = name
    this._id = id
    this._annualCost = annualCost
  }

  getAnnualCost() {
    return this._annualCost
  }
  getId() {
    return this._id
  }
  getName() {
    return this._name
  }
}

class Department {
  constructor(name) {
    this._name = name
    this._staff // 사원 컬렉션 ( java new Vector )
  }

  getTotalAnnualCost() {
    const e = this.getStaff() // iterator
    let result = 0
    for( let p of e) {
      each = e.value
      result += each.getAnnualCost()
    }

    return result
  }

  getHeadCount() {
    return this._staff.size()
  }
  getStaff() {
    return this._staff.elements()
  }
  addStaff(employee) {
    this._staff.addElement(employee)
  }
  getName() {
    return this._name
  }
}
```

위 코드에서 두 클래스는 공통된 부분이 두가지다.
첫번째, 사원과 부서는 둘다 이름이 있다는 점이다.  
두번째, 계산 메서드가 약간 다르긴 하지만 두 클래스 모두 연간 경비가 있다. 

새 상위 클래스를 만들어서 두 클래스를 하위클래스로 넣자.

`Department.getTotalAnnualCost` 메서드와 `Employee.getAnnualCost` 메서드는 기능(목적) 이 같으므로 이름이 같아야 한다. 하여 이 두 메서드의 이름을
`getAnnualCost`으로 같게 하자.

`getAnnualCost` 메서드의 내용이 다르므로 상향을 적용할 수는 없다. 하지만 상위클래스의 선언을 통해서 오류가 나는것을 방지할 순 있다. (자바에선 abstract로 선언으로 하위클래스에서 구현을 하도록 강제 할 수있다.)

여기서 `Department` 클래스와 `Employee` 클래스를 컴포지트의 패턴으로 취급을 할 수도 있다. 이러면 `_staff` 필드의 이름을 더 적절한 것으로 수정했을 것이다. 그러면 `addStaff`도 이름을 변경했을 것이다. 왜냐하면 `_staff`는 이제 `Vector` 클래스를 쓰는 것이 아닌 추상 인터페이스의 타입(`Node`)을 지니게 되므로 `_childNode` 이정도가 될듯 싶다.

여기서 컴포지트의 패턴이란 예로 디렉토리 구조를 구성하는 예를 생각해보자. 디렉토리 안에는 파일과 또다른 디렉토리를 구성해야한다. 
이때 디렉토리와 파일을 동일 취급을 위한 공통인터페이스를 작성하고 디렉토리 클래스는 또 다른 디렉토리 또는 파일을 포함하고 관리할 수 있는 메서드를 만든다.

Node인터페이스, File, Directory 클래스를 비유로 든다면 
- Component는 모든 표현하는 추상적인 인터페이스. Node 인터페이스
- Leaf는 Component로 지정된 인터페이스를 구현한 것. File 클래스
- Composition은 Composite 요소는 Component 요소를 자식으로 가집니다. 따라서 Component 요소를 관리하기 위한 메소드들을 추가적으로 구현해줘야 한다. Directory 클래스

개별적인 객체들과 객체들의 집합간의 처리 방법의 차이가 없을 경우 사용하면 된다. 여기서 컴포지트의 의미는 일부 또는 그룹을 표현하는 객체들을 트리 구조로 구성한다는 겁니다. 

만약에 이렇게 컴포지트 패턴으로 작성하게 되면 `Department.headCount` 메서드도 재귀 메서드로 만들어야 한다. 왜냐하면 `this._staff`엔 `size` 메서드가 없을거기 때문이다. 이럴 경우에는 `Employee` 클래스에 단순히 1을 반환하는 `headCount`메서드를 작성하고, 부서에 속한 사원수를 합산하는 로직을 `Department.headCount` 에 넣으면 될듯 싶다.


```javascript
// 상위 클래스
class Party() {
  // protected
  constructor(name) {
    this._name = name
  }

  getName() {
    return this._name
  }
}

class Employee extends Party{
  constructor(name, id, annualCost) {
    super(name)
    this._id = id
    this._annualCost = annualCost
  }
}

class Department extends Party{
  constructor(name) {
    super(name)
  }

  // getTotalAnnualCost() {
  getAnnualCost() {}
    const e = this.getStaff() // iterator
    let result = 0
    for( let p of e) {
      each = e.value
      result += each.getAnnualCost()
    }

    return result
  }

  getHeadCount() {
    return this._staff.size()
  }
}
```

## 인터페이스 추출

클래스 인터페이스의 같은 부분을 여러 클라이언트가 사용하거나, 두 클래스에 인터페이스의 일부분이 공통으로 들어 있을 땐 공통 부분을 인터페이스로 빼내자. 
인터페이스 추출은 공통된 코드를 빼내는 것이 아니라 공통된 인터페이스만 빼내는 기법이다.
인터페이스 추출을 적용하면 중복 코드의 구린내가 날 수도 있따. 이 구린내를 줄이려면 클래스 추출을 적용해서 기능을 컴포넌트에 넣고 그 컴포넌트로 위임하면 된다. 
컴포넌트는 각각 독립된 모듈을 뜻한다.

클래스를 사용한다는 건 주로 클래스의 담당 기능 전반을 사용함을 뜻한다. 하지만 여러 클라이언트가 클래스 기능 중 특정 부분만 사용할 때도 있고, 
한 클래스가 각 요청을 처리할 수 있는 특정한 클래스들과 공조해야 할 때도있다.

일부분만 사용하는 경우와 특정 기능의 여러 클래스를 함께 사용하는 경우엔, 클래스 기능 중 사용되는 부분을 분리해서 시스템을 사용할 때 사용되는 부분을 확실히 알 수 있게 하는 것이 좋다. 
그렇게 하면 해당 기능들이 어떤 기능들이 어떤 식으로 나뉘는지 더욱 쉽게 알 수 있다. 또한 새 클래스들이 해당 부분을 보조해야 할 경우엔 해당 부분에 무슨 클래스가 적절할지 정확히 알아내기가 더 쉽다.

클래스가 서로 다른 상황에서 서로 다른 역할을 담당할 때 인터페이스를 사용하면 좋다. 각 역할마다 인터페이스 추출을 적용하자. 클래스 밖으로 빼낸 인터페이스, 즉 그 클래스가 서버에서 하는 작업을 기술해야 할 때도 인터페이스를 사용하면 좋다. 나중에 다른 종류의 서버를 허용해야 할 땐 단지 그 인터페이스를 상속구현하기만 하면 된다. 

### 예제 

TimeSheet 클래스는 사원비를 산출한다. 이를 위해 TimeSheet 클래스는 사원 평점과 특수 기술 보유 여부를 알아야 한다. 
`charge`메서드에 emp 가 Employee 타입으로 보이게 된다면 Employee의 모든 기능을 다 사용할 수 있는 것으로 간주 될것이다. 
하여, Employee 클래스의 기능 중 `Billable` 기능만 사용됨을 보이고자 보여야 한다. 

안타깝게도 자바스크립트에서는 반환 값의 타입을 따로 지정을 하지 않기에 주석으로 처리를 해주면 좋을꺼 같다.

```javascript
//interface
class Billable {
  getRate(){}
  hasSpecialSkill()
}

/**
 * @param {Billable} emp
 */

class Employee extends Billable{
  charge(emp, days) { 
    const base = emp.getRate() * days
    if(emp.hasSpecialSkill()) {
      return base * 1.05
    } else return base
  }
}
  
```

## 계층 병합

상위클래스와 하위클래스가 거의 다르지 않을 땐 둘을 합치자.

## 템플릿 메서드 형성

하위클래스 안의 두 메서드가 거의 비슷한 단계들을 같은 순서로 수행할 땐 그 단계들을 시그니처가 같은 두 개의 메서드로 만들어서 두 원본 메서드를 같게 만든 후, 
두 메서드를 상위클래스로 옮기자.

상속은 중복된 기능을 없애는 강력한 수단이다. 하위클래스에 들어 있는 두 메서드가 비슷하다면 둘을 합쳐서 하나의 상위클래스로 만드는 것이 좋다.
그러나 두 메서드가 완전히 똑같지 않다면 어떻게 해야 할까? 그래도 중복된 부분은 가능한 전부 없애고 차이가 있는 필수 부분만 그대로 둬야 한다. 

두 메서드가 똑같지는 않지만 거의 비슷한 단계를 같은 순서로 수행하는 경우가 제일 흔하다. 이럴 땐 그 순서를 상위클래스로 옮기고 재정의를 통해 각 단계가 고유의 작업을 다른 방식으로 수행하게 하면 된다. 
이런 메서드를 템플릿 메서드라고 한다. 

### 예제

```javascript
class Site {

}

class ResidentialSite extends Site {
  getBillableAmount(){
    const base = this._units * this._rate * 0.5
    const tax = base * Site.TAX_RATE * 0.2
    return base + tax
  }
}
class LifelineSite extends Site {
  getBillableAmount(){
    const base = this._units * this._rate
    const tax = base * Site.TAX_RATE
    return base + tax
  }
}

```

위 코드를 아래처럼 바꾼다. 이때 

```javascript
class Site {
  getBillableAmount() {
    return this.getBaseAmount() + this.getTaxAmount()
  }
  getBaseAmount() {}
  getTaxAmount() {}
}

class ResidentialSite extends Site {
  getBaseAmount() {
    return this._units * this._rate * 0.5
  }
  getTaxAmount() {
    return base * Site.TAX_RATE * 0.2
  }
}
class LifelineSite extends Site {
  getBaseAmount() {
    return this._units * this._rate
  }
  getTaxAmount() {
    return base * Site.TAX_RATE 
  }
 
}
```

이 기법의 핵심은 메서드 추출로 두 메서드의 다른 부분을 추출해서 다른 코드를 비슷한 코드와 분리하는 것이다. 추출할 때마다 내용은 다르고 시그니처는 같은 메서드를 작성하자. 
여기서 시그니처는 위 예제에서 `getBillableAmount` 메서드 이다.


## 상속을 위임으로 전환

하위클래스가 상위클래스 인터페이스의 일부만 사용할 때나 데이터를 상속받지 않게 해야 할 땐 
상위클래스에 필드를 작성하고, 모든 메서드가 그 상위클래스에 위임하게 수정한 후 하위클래스를 없애자.

상속은 훌륭한 기능이지만 간혹 적합하지 않을 때도 있다. 주로 한 클래스에서부터 상속을 시작했다가, 나중에 가서 대부분의 상위클래스 작업이 하위클래스엔 별로 적절하지 않음을 깨닫는다. 이것은 클래스의 기능이 인터페이스에 제대로 반영되지 않았거나, 하위클래스로 적절하지 않은 많은 데이터를 상속하게 작성했거나 상위클래스의 protected 메서드가 하위클래스에 사용되지 않기 때문일 수 있다. 

상속 대신 위임을 이용하면 위임받은 클래스의 일부만 사용하려는 의도가 더욱 확실해진다. 인터페이스의 어느 부분을 사용하고 어느 부분을 무시할지를 개발자가 제어할 수 있다. 단지 위임하는 메서드를 추가로 작성하면 된다. 

쉽게 상속은 `extends`를 통해서 상위클래스에서 하위클래스로 상속하는 것이고 위임은 해당 클래스에 위임받을 클래스 인스턴스를 지니고 있는 것이다. 

### 예제

```javascript
class MyStack extends Vector {
  push(element) {
    this.insertElementAt(element,0) // Vector에 있는 메서드
  }

  pop() {
    const result = this.firstElement()
    this.removeElementAt(0)
    return result
  }
}
```

위의 클래스를 사용하는 부분을 보다가, 클라이언트가 스택으로 네 개의 메서드 push, pop, size, isEmpty만 호출함을 발견했다.
size와 isEmpty 메서드는 Vector 클래스에서 상속된다. 

이것을 위임으로 바꾸게 되면 `this._vector`에 위임받을 Vector 인스턴스를 담아두자.

```javascript
class MyStack {
  constructor() {
    this._vector = new Vector()
  }

  push(element) {
    this._vector.insertElementAt(element,0)
  }

  pop() {
    const result = this._vector.firstElement()
    this._vector.removeElementAt(0)
    return result
  }

  size() {
    return this._vector.size()
  }

  isEmpty() {
    return this._vector.isEmpty()
  }
}
```

## 위임을 상속으로 전환

위임을 이용 중인데 인터페이스 전반에 간단한 위임으로 도배하게 될 땐 위임 클래스를 대리 객체의 하위클래스로 만들자.
예를 들어 `Employee` 클래스 안에 `Person` 클래스 인스턴스를 가지고 있다면(위임상태) 이 `Employee` 클래스를 `Person(대리 객체)`의 하위클래스로 만들자.

두 가지 주의사항을 염두에 두자. `위임하려는 클래스(Person)`의 모든 메서드를 사용하는 게 아닐 경우엔 위임을 상속으로 전환을 적용해선 안된다.
왜냐하면 하위클래스는 반드시 상위클래스의 인터페이스를 따라야 하기 때문이다. 

위임 메서드가 거치적 거리면 다른 방법도 있다. _과잉 중개 메서드 제거_를 적용해서 클라이언트가 대리를 직접 호출하게 하는 것이다. 
여기서 _과잉 중개 메서드 제거_란 `A 클래스`에서 `B 클래스`를 숨기기 위해 대신해서 작업을 도왔다면 이제 그냥 `A 클래스`에서 `B클래스`를 내보내는 메서드를 만들어 `getB` 클라이언트가 직접 호출하게 만드는 기법이다.

하위클래스 추출(하위클래스를 만드는 것)을 적용해서 공통 인터페이스를 분리한 후 새 클래스에서 상속받으면 된다. 비슷한 방법으로 인터페이스 추출을 적용해도 된다.

또 한가지 주의할 상황은 위임상황에서 대리 객체를 둘 이상의 객체가 사용하고 변경 가능할 때다. **이럴 땐 데이터를 더 이상 공유할 일이 없어서 위임을 상속으로 바꿀 수 없다.**
데이터 공유는 상속으로 되돌릴 수 없는 작업이다. 반면, 객체가 변경 불가일 땐 바로 복사할 수도 있고 다른 부분에선 모르기 때문에 데이터 공유가 문제되지 않는다.

### 예제

`Employee 클래스`는 간단한 `Person 객체`에 위임한다.

```javascript
class Employee {
  constructor () {
    this._person = new Person()
  }

  getName() {
    return this._person.getName()
  }

  setName(arg) {
    return this._person.setName(arg)
  }
  toSting(){
    return `사원 : ${this._person.getLastName()}`
  }
}

class Person {
  constructor() {
    this._name
  }

  getName() {
    return this._name
  }

  setName(arg) {
    this._name = arg
  }

  getLastName() {
    return this._name.substring(this._name.lastIndexOf(' ') + 1)
  }
}
```

위와 같은 코드를 상위클래스 - 하위클래스 관계로 전환하자.

```javascript
class Employee extends Person {
  //...
}
```