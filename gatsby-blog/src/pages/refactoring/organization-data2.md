---
title: (리팩토링) 데이터 체계화2
date: "2019-04-01T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript 로 전환하였습니다.

## 클래스의 단방향 연결을 양방향으로 전환 (Change Unidirectional Association to Bidirectional)

두 클래스가 서로의 기능을 사용해야 하는데 한 방향으로만 연결되어 있을 땐 역 포인터를 추가하고 두 클래스를 모두 업데이트할 수 있게 접근 한정자를 수정하자.

애초에 두 클래스를 설정할 때 한 클래스가 다른 클래스를 참조하게 해놓은 경우가 있을 수 있다. 나중에 이 포인터를 역방향으로 참조해야할 경우도 생긴다.

### 예제

`Order` 클래스가 `Customer` 클래스를 참조하는 간단한 프로그램이 있다.
이때 `Customer` 에는 `Order` 클래스를 참조하는 코드가 들어 있지 않다.

여기서는 `Customer`에는 `Order` 참조가 여러 개이므로 `Order` 클래스를 연결제어 객체로 택한다.
`Order` 객체에 연결제어 기능을 구현하자.

```javascript
// 연결제어 객체
class Order {
  constructor() {
    this._customer
  }

  getCustomer() {
    return this._customer
  }

  setCustomer(customer) {
    //this._customer = customer
    // 다른 객체에 이 객체의 포인터를 제거하도록 전달하고
    if (this._customer !== null) this._customer.friendOrders().remove(this)
    // 이 객체의 포인터를 새 객체에 할당한 후 이 객체로의 포인터를 추가하게 해서 새 객체에 명령해야 한다.
    this._customer = customer
    if (this._customer !== null) this._customer.friendOrders().add(this)
  }
}

// 고객 한명이 여러 건의 주문을 할 수 있으므로 _orders는 Set 셋팅
// Customer에는 Order 참조가 여러개
class Customer {
  constructor() {
    this._orders = new Set()
  }

  friendOrders() {
    // 연결을 변경할 때 Order에 의해서만 사용되어야 함
    return this._orders
  }

  // Customer 클래스를 거쳐서 연결을 변경하려면 Customer 클래스 안에 제어 메서드 호출 코드를 넣으면 된다.
  addOrder(order) {
    order.setCustomer(this)
  }
}
```

만약 하나의 주문을 여러고객이 할 수 있다면 연결이 다대다가 되므로 다음과 같이 된다.

```javascript
class Order {
  constructor() {
    // 하나의 주문에 여러고객에 있을수 있으니.
    this._customers = new Set()
  }

  // 연결 제어 메서드
  addCustomer(customer) {
    customer.friendOrders().add(this)
    this._customers.add(customer)
  }

  removeCustomer(customer) {
    customer.friendOrders().remove(this)
    this._customers.remove(customer)
  }
}

class Customer {
  addOrder(order) {
    order.addCustomer(this)
  }

  removeOrder(order) {
    order.removeCustomer(this)
  }
}
```

## 클래스의 양방향 연결을 단방향으로 전환 (Change Bidirectional Association to Unidirectional)

두 클래스가 양방향으로 연결되어 있는데 한 클래스가 다른 클래스의 기능을 더 이상 사용하지 않게 됐을 땐 불필요한 방향의 연결을 끊자.

양방향 연결로 인해 두 클래스는 서로 종속된다. 한 클래스를 수정하면 다른 클래스도 변경된다. 종속성이 많으면 시스템의 결합력이 강해져서 사소한 수정에도 예기치 못한각종 문제가 발생한다.

### 예제

이전 예제와 같이 양방향으로 연결된 Customer 와 Order 클래스는 다음과 같다.

```javascript
class Order {
  constructor(customer) {
    this._customer = customer
  }

  getCustomer() {
    return this._customer
  }

  // 이전에 맺었던 customer와의 관계는 끊고 새로운 customer와 관계를 맺는다.
  setCustomer(arg) {
    // Customer
    if (this._customer !== null) this._customer.friendOrder().remove(this)
    this._customer = arg
    if (this_customer !== null) this._customer.friendOrder().add(this)
  }
}

class Customer {
  constructor() {
    this._order = new Set()
  }

  addOrder(arg) {
    // Order
    arg.setCustomer(this)
  }

  friendOrder() {
    // 연결을 변경할 때 Order 클래스를 통해서만 사용되어야 함
    return this._order
  }
}
```

위 코드를 보면 customer 가 먼저 있어야만 order 가 있음을 알 수 있다.
따라서 Order 클래스에서 Customer 클래스로 가는 연결을 끊어야 한다. 즉, Order 클래스에 Customer 객체를 참조하는 코드를 빼야한다.
한 명령을 Customer 객체에 하나의 매개변수로 전달하는 방법을 사용할 때가 많다. 이것을 간단한 예로 들면 다음과 같다.

```javascript
class Order {
  getDiscountedPrice() {
    // customer를 참조하는 코드.
    return getGrossPrice() * (1 - this._customer.getDiscount())
  }
}

// as-is
class Order {
  getDiscountedPrice(customer) {
    // 매개변수로 전환
    return getGrossPrice() * (1 - customer.getDiscount())
  }
}
```

위 코드는 기능이 Customer 클래스를 통해 호출될 때 특히 효과가 있다. 왜냐하면 기능 자체를 하나의 인자로 전달하는 것이 수월하기 때문이다.

```javascript
class Customer {
  getPriceFor(order) {
    Assert.isTrue(this._order.contains(order))
    return order.getDiscountedPrice()
  }
}
```

따라서 위 코드를 아래처럼 수정하면 된다.

```javascript
class Customer {
  getPriceFor(order) {
    Assert.isTrue(this._order.contains(order))
    // customer 의 인스턴스인 this를 넘긴다.
    return order.getDiscountedPrice(this)
  }
}
```

또는 속성 읽기 메서드를 수정해서 필드를 사용하지 않고 customer 를 가져오게 할 수도 있다. 이렇게 하면 Order.getCustomer 메서드의 코드에 다음과 같이 알고리즘 전환을적용할 수 있다.

```javascript
class Order {
  // Customer 인스턴스들을 모조리 가져와서 내 Order가 들었나 안들었나 확인
  getCustomer() {
    const iter = Customer.getInstances()[Symbol.iterator]()
    for (let i of iter) {
      const each = i.value
      if (each.containsOrder(this)) return each
    }

    return null
  }
}
```

## 마법 숫자를 기호 상수로 전환 (Replace Magic Number with Symbolic Constant)

특수 의미를 지닌 리터럴 숫자가 있을 땐 의미를 살린 이름의 상수를 작성한 후 리터럴 숫자를 그 상수로 교체하자.

### 예제

```javascript
// bad
const potentialEnergy = (mass, height) => {
  return mass * 9.81 * height
}

// good
const GRAVITATIONAL_CONSTANT = 9.81
const potentialEnergy = (mass, height) => {
  return mass * GRAVITATIONAL_CONSTANT * height
}
```

## 필드 캡슐화 (Encapsulate Field)

public 필드가 있을 땐 그 필드를 private 로 만들고 필드용 읽기 메서드와 쓰기 메서드를 작성하자.
자바스크립트에는 아직 public, private 가 없기 때문에 `_(언더바)`로 표시하자.

## 컬렉션 캡슐화 (Encapsulate Collection)

메서드가 컬렉션을 반환할 땐 그 메서드가 읽기전용 뷰를 반환하게 수정하고 추가 메서드와 삭제 메서드를 작성하자.

클래스에 여러 인스턴스로 구성된 컬렉션이 들어 있는 경우를 흔히 볼 수 있다. 그 컬렉션은 배열, 리스트, 세트, 벡터중 하나일텐데그럴 땐 십중팔구 컬렉션을 읽고 쓸 수 있는 평범한 읽기 메서드와 쓰기 메서드가 있기 마련이다.

그러나 컬렉션은 다른 종류의 데이터와는 약간 다른 읽기/쓰기 방식을 사용해야 한다.
읽기 메서드에서는 컬렉션 객체 자체를 반환해선 안된다. 왜냐하면 컬렉션 참조 부분이 컬렉션의 내용을 조작해도 그 컬렉션이 든 클래스는 무슨 일이 일어나는지는 모르기 때문이다.
이로 인해 컬렉션 참조 코드에게 그 객체의 데이터 구조가 지나치게 노출된다. 갑싱 여러개인 속성을 읽는 읽기 메서드는 컬렉션 조작이 불가능한 형식을 반환하고불필요하게 자세한 컬렉션 구조 정보는 감춰야 한다.

그리고 컬렉션 쓰기 메서드는 절대 있으면 안 되므로, 원소를 추가하는 메서드와 삭제하는 메서드를 대신 사용해야 한다.

### 예제

아래 예제에서는 한 사람이 여러 과정을 수강한다. 수강 과정을 나타내는 Course 클래스는 다음과 같이 아주 간단하다.

```javascript
class Course {
  constructor(name, isAdvanced) {
    //...
  }

  isAdvanced() {
    // return boolean
  }
}

class Person {
  constructor() {
    this._courses = new Set()
  }

  getCourses() {
    return this._courses
  }

  setCourses(courses) {
    this._courses = courses
  }

  addCourse(course) {
    this._courses.add(course)
  }

  removeCourse(course) {
    this._courses.remove(course)
  }
}

// 위 처럼 코드가 있을때 우리는 아래처럼 사용할 수 있겠다.
const kent = new Person()
const s = new Set()
s.add(new Course('스몰토크 프로그래밍', false))
s.add(new Course('싱글몰트 음미하기', true))
kent.setCourses(s)
const refact = new Course('리펙토링', true)
kent.addCourse(refact)

// 고급과정을 알아내는 코드
const iter = kent.getCourses()[Symbol.iterator]()
let count = 0
for (let p of iter) {
  if (p.done) break
  if (p.value.isAdvaned()) count++
}
```

`setCourses` 메서드에서 해당 참조 값을 여러군데에서 쓰이고 이 메서드가 많이 사용된다면이 메서드 내용을 추가/삭제 기능의 코드로 바꿔야 한다.
즉, 쓰기 메서드 내용을 추가 메서드 내용으로 바꿔주면 된다.
이렇게 하면 컬렉션을 지닌 객체가 컬렉션의 원소 추가와 삭제를 통제할 수 있다.

또한 `getCourses`의 읽기 메서드는 수정이 불가한 객체로 바꿔줘야 하는데 자바스크립트에서는 그 객체를 복사한 다른 객체를내보내 줘서 `this._courses`에 영향이 없도록 해야한다.

```javascript
class Person {
  constructor() {
    this._courses = new Set()
  }

  // 읽
  getCourses() {
    //return this._courses
    return clone(this._courses)
  }

  // 쓰기 메서드는 절대 있으면 안된다.
  // setCourses(courses) {
  //   this._courses = courses
  // }

  // 추가내용으로 바꾸자.
  initializeCourses(courses) {
    const iter = courses[Symbol.iterator]()
    for (let p of iter) {
      this.addCourse(p.value)
    }
  }

  addCourse(course) {
    this._courses.add(course)
  }

  removeCourse(course) {
    this._courses.remove(course)
  }

  numberOfAdvancedCourses() {
    const iter = this.getCourses()[Symbol.iterator]()
    let count = 0
    for (let p of iter) {
      if (p.value.isAdvaned()) count++
    }
  }
}
```

추가적으로 고급과정을 알아내는 코드의 경우에도 `Person` 클래스 데이터만 사용하므로 응당 `Person` 클래스로 옮겨 마땅하다.

## 분류 부호를 클래스로 전환 (Replace Type Code with Class)

기능에 영향을 미치는 숫자형 분류 부호가 든 클래스가 있을 땐 그 숫자를 새 클래스로 바꾸자.

분류부호 이름을 상징적인 것으로 정하면 코드가 상당히 이해하기 쉬워진다.
문제는 상징적 이름은 단지 별명에 불과하다는 점이다.

_숫자형 분류부호를 클래스로 빼내면 컴파일러는 그 클래스 안에서 종류 판단을 수행할 수 있다._
그 클래스 안에 팩토리 메서드를 작성하면 유효한 인스턴스만 생성되는지와 그런 인스턴스가 적절한 객체로 전달되는지를 정적으로 검사할 수 있다. 그 전까지 Person 클래스 메서드 들은 int 타입만 받아왔었는데 이 기법을 사용하면 명시적으로
`BloodGroup` 타입을 받는지 확인할 수 있다.

분류 부호가 클래스로 만드는 건 _분류 부호가 순수한 데이터일 때만_ 실시해야 한다. 다시말해, 분류부호가 switch 문안에 사용되어 다른 기능을 수행하거나 메서드를 호출할 땐 클래스로 전환하면 안된다.

switch 문에는 임의로 클래스를 사용할 수 없으며 오직 정수 타입만 사용 가능하므로 클래스로 전환은 실패를 맞게 된다.
더 중요한건, 모든 switch 문은 `조건문을 재정의로 전환` 기법을 적용해 전부 없애야 한다는 사실이다.

조건문을 재정의로 전환 기법을 실시하려면 우선 `분류 부호를 하위 클래스로 전환`이나 `분류 부호를 상태/전략 패턴으로 전환`기법을 적용해서 분류 부호부터 처리해야 한다.

### 예제

다음과 같은 코드가 있다고 하자.
`Person` 클래스엔 다음과 같이 분류 부호로 나타낸 혈액형 그룹이 들어 있다.

여기서 특징은 분류 부호 클래스는 데이터 클래스로써만 사용 된다는 것이고 Person 클래스 안에서도 데이터를 저장만 하고 그 데이터에 따른 어떠한 다른 부가 로직도 보이지 않는다는 것이다.

```javascript
class Person {
  static O = 0
  static A = 1
  static B = 2
  static AB = 3

  constructor(bloodGroup) {
    this._bloodGroup = bloodGroup
  }

  setBloodGroup(bloodGroup) {
    this._bloodGroup = bloodGroup
  }

  getBloodGroup() {
    return this._bloodGroup
  }
}
// 사용하는 코드
const thePerson = new Person(Person.A)
thePerson.getBloodGroup()
thePerson.setBloodGroup(Person.AB)
```

먼저 혈액형 그룹을 판단할 `BloodGroup` 클래스를 작성하고, 분류 부호 숫자가 든 인스턴스를 생성하자.

```javascript
class BloodGroup {
  static O = new BloodGroup(0)
  static A = new BloodGroup(1)
  static B = new BloodGroup(2)
  static AB = new BloodGroup(3)
  static _values = [O, A, B, AB]

  constructor(code) {
    this._code = code
  }

  getCode() {
    return this._code
  }

  static code(arg) {
    return _values[arg]
  }
}
// 이제 BloodGroup을 사용하게 변경하자.
class Person {
  // 삭제
  // static O = BloodGroup.O.getCode()
  // static A = BloodGroup.A.getCode()
  // static B = BloodGroup.B.getCode()
  // static AB = BloodGroup.AB.getCode()

  constructor(bloodGroup) {
    this._bloodGroup = bloodGroup
  }

  // 삭제
  // setBloodGroup(bloodGroup) {
  //   // this._bloodGroup = bloodGroup
  //   this._bloodGroup = BloodGroup.code(bloodGroup)
  // }
  // 삭제
  // 메서드 이름 변경
  // getBloodGroupCode() {
  //   return this._bloodGroup.getCode()
  // }

  getBloodGroup() {
    return this._bloodGroup
  }
}

const thePerson = new Person(BloodGroup.A)
thePerson.getBloodGroup().getCode()
thePerson.setBloodGroup(BloodGroup.AB)
```

## 분류 부호를 하위클래스로 전환 (Replace Type Code with Subclasses)

클래스 기능에 영향을 주는 변경불가 분류 부호가 있을 땐 분류 부호를 하위클래스로 만들자.

클래스 기능에 영향을 주지 않는 분류 부호가 있을 땐 분류 부호를 클래스 전환 기법을 실시하면 된다. 그러나 분류 부호가 클래스 기능에 영향을 준다면 재정의를 통해 조금씩 다른 기능을 처리하는 것이 최선이다.

분류 부호가 클래스 기능에 영향을 미치는 현상은 case 문 같은 조건문이 있을 때 주로 나타난다. 그런 조건문은 switch 문 아니면 if-then-else 문이다. 어느 조건문이든 분류 부호의 값을 검사해서 그 값에 따라 다른 코드를 실행한다.
이런 조건문은 `조건문을 재정의로 전환`을 실시해서 재정의로 바꿔야 한다.

이런 기법이 효과를 보려면 분류부호를 다형화된 기능이 든 상속 구조로 고쳐야 한다.

이 기법의 장점은 클래스 사용 부분에 있던 다형적인 기능 관련 데이터가 클래스 자체로 이동한다는 데 있다. 변형된 새 기능을 추가할땐 하위클래스만 하나 추가하면 되기 때문이다. 다형성, 즉 재정의를 이용하지 않는다면 조건문을 전부 찾아서 일일이 수정해야 한다.

### 예제

아래 Employee 클래스의 분류 부호인 `this._type` 변수를 없애고 각 타입들을 하위클래스로 빼는데 목적이 있다. 왜냐하면 Employee 클래스 로직에는 저 타입에 따른 여러가지 다른 코드를 실행하는 코드들이 얽힐 것이기 때문이다.
그래서 각 타입에 따른 코드 실행은 각 하위 클래스에 정리하도록 한다.

```javascript
class Employee {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  // Employee 클래스의 생성자 메서드가 분류 부호를 매개변수로 받으니까,
  // 그 생성자 메서드를 다음과 같이 팩토리 메서드로 바꿔야 한다.
  static create(type) {
    return new Employee(type)
  }

  constructor(type) {
    this._type = type // 분류 부호
  }

  getType() {
    return this._type
  }
}

// 사용

const engineer = Employee.create(Employee.ENGINEER)
```

먼저 `분류부호 ENGINNER` 변수를 `Engineer` 하위클래스로 만들자. 다음과 같이 하위클래스를 작성하고 `ENGINEER 분류 부호`에 해당하는 재정의 메서드를 작성하자.

```javascript
// 하위클래스 Engineer
class Engineer extends Employee {
  // 재정의 메서드
  getType() {
    return Employee.ENGINEER
  }
}

// 적절한 객체를 생성하게 팩토리 메서드도 다음과 같이 고친다.

class Employee {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  static create(type) {
    if (type === ENGINEER) return new Engineer()
    else return new Employee(type)
  }
}

// 위 식으로 나머지 분류 부호도 한번에 하나씩 하위클래스로 수정하자.
// 한번더 정리하면 Employee 클래스의 분류부호 필드를 삭제하고 팩토리 메서드는 다음과 같다.

class Employee {
  // Employee 클래스의 분류 부호 필드를 삭제
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  // 불가피하게 인스턴스를 생성할 때만 딱 한번 사용
  static create(type) {
    switch (type) {
      case ENGINEER:
        return new Engineer() // 하위 클래스
        break
      case SALESMAN:
        return new Salesman()
        break
      case MANAGER:
        return new Manager()
        break
      default:
    }
  }
  // abstract 타입
  getType() {}
}

// 사용
const engineer = Employee.create(Employee.ENGINEER)
```

하위클래스를 작성했으면 `메서드 하향`과 `필드하향`을 실시해서 Employee 클래스의 특정 분류 부호에만 관련된 모든 메서드와 필드를 특정 부호에 해당하는 하위클래스로 옮겨야 한다.

## 분류 부호를 상태/전략 패턴으로 전환 (Replace Type Code with State/Strategy)

분류 부호가 클래스의 기능에 영향을 주지만 하위클래스로 전환할 수 없을 땐 그 분류 부호를 상태 객체로 만들자.

_분류 부호가 객체 수명주기 동안 변할 때나 다른 이유로 하위 클래스로 만들 수 없을 때 사용한다._ 이 기법은 상태 패턴이나 전략 패턴중 하나를 사용한다.
조건문을 재정의로 전환으로 하나의 알고리즘을 단순화해야할 때는 전략이 더 적절하며, 상태별 데이터를 이동하고 객체를 변화하는 상태로 생각할 때는 상태 패턴이 더 적절하다.

여기서 말하는 상태/전략 패턴이란 전략을 설정하는 부분 따로 실행하는 부분 따로 두고 전략을 설정해두면 실행하기 전까지 자유롭게 전략을 바꿔나갈수 있는 방법이다.
간단한 예시를 들면

```javascript
class Strategy {
  constructor() {
    this._strategy = null
  }

  setStrategy(s) {
    this._strategy = s
  }

  getStrategyState() {
    return this._strategy.getState()
  }
}
// 전략 상태를 따로 빼둔다.
class StrategyState {
  static LAND = 0
  static SHIP = 1

  getState() {}
}

class LandStrategyState extends StrategyState {
  getState() {
    return StrategyState.LAND
  }
}

class ShipStrategyState extends StrategyState {
  getState() {
    return StrategyState.SHIP
  }
}

const s = new Strategy()
// 전략을 바꿀 수 있다.
s.setStrategy(new LandStrategyState())
s.setStrategy(new ShipStrategyState())
s.getStrategyState()
```

### 예제

```javascript
class Employee {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  constructor(type) {
    this._type = type
  }

  // 앞의 코드를 사용해 조건별로 기능을 실행하는 코드이다.
  payAmount() {
    switch (this._type) {
      case ENGINEER:
        return this._monthlySalary
        break
      case SALESMAN:
        return this._monthlySalary + this._commission
        break
      case MANAGER:
        return this._monthlySalary + this._bonus
        break
      default:
    }
  }
}
```

여기서는 분류부호가 수시로 변하므로 하위클래스로 만들 수 없다. 우선 분류 부호를 자체 캡슐화해야 한다.

```javascript
class Employee {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  constructor(type) {
    // this._type = type
    this.setType(type)
  }

  getType() {
    return this._type
  }

  setType(type) {
    this._type = type
  }

  // 앞의 코드를 사용해 조건별로 기능을 실행하는 코드이다.
  payAmount() {
    switch (this.getType()) {
      case ENGINEER:
        return this._monthlySalary
        break
      case SALESMAN:
        return this._monthlySalary + this._commission
        break
      case MANAGER:
        return this._monthlySalary + this._bonus
        break
      default:
    }
  }
}
```

이제 상태 클래스 `EmployeeType`을 선언하자.

```javascript
// 상태 클래스 선언
class EmployeeType {
  // abstract
  getTypeCode() {}
}

class Engineer extends EmployeeType {
  getTypeCode() {
    return Employee.ENGINEER
  }
}

class Manager extends EmployeeType {
  getTypeCode() {
    return Employee.MANAGER
  }
}

class Salesman extends EmployeeType {
  getTypeCode() {
    return Employee.SALESMAN
  }
}

// 상태 클래스를 사용하자.
class Employee {
  //...
  getType() {
    // 이제 _type은 EmployeeType의 인스턴스다.
    return this._type.getTypeCode()
  }
  // EmployeeType 인 상태 클래스를 사용하다 보니 setType 메서드에 스위치 문이 생겼다.
  // 이 switch 문은 분류가 변할 때만 실행된다.
  // 생성자를 팩토리 메서드로 전환 기법을 실시해서 각 경우별 팩토리 메서드를 작성하는 방법도 있다.
  setType(type) {
    switch (type) {
      case ENGINEER:
        this._type = new Engineer()
        break
      case SALESMAN:
        this._type = new Salesman()
        break
      case MANAGER:
        this._type = new Manager()
        break
      default:
    }
  }
}
```

여기서 switch 문을 리팩토링 해보자.
분류 부호 정의를 EmployeeType 으로 복사하고, EmployeeType 에 대한 팩토리 메서드를 작성한 후, Employee 클래스의 쓰기 메서드를 수정하자.

```javascript
class Employee {
  // 여기에 정의 내렸던 분류 부호 정의를 삭제
  // EmployeeType 클래스 참조를 넣자.
  // ...
  constructor(type) {
    // this._type = type
    this.setType(type)
  }

  getType() {
    // 이제 _type은 EmployeeType의 인스턴스다.
    return this._type.getTypeCode()
  }

  setType(type) {
    this._type = EmployeeType.newType(type)
  }

  // 이제 payAmount 메서드에 `조건문을 재정의로 전환 기법`을 적용할 수 있다.
  payAmount() {
    switch (this.getType()) {
      case EmployeeType.ENGINEER:
        return this._monthlySalary
        break
      case EmployeeType.SALESMAN:
        return this._monthlySalary + this._commission
        break
      case EmployeeType.MANAGER:
        return this._monthlySalary + this._bonus
        break
      default:
    }
  }
}

class EmployeeType {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  getTypeCode() {} // 추상 클래스

  static newType(type) {
    switch (type) {
      case ENGINEER:
        return new Engineer()
        break
      case SALESMAN:
        return new Salesman()
        break
      case MANAGER:
        return new Manager()
        break
      default:
    }
  }
}

// 사용
const engineer = new Employee(EmployeeType.ENGINEER)
engineer.payAmount()
```

이것으로 payAmout 메서드에 `조건문을 재정의로 전환기법`을 적용할 수 있게 됐다.

## 하위클래스를 필드로 전환(Replace Subclass with Fields)

여러 하위클래스가 상수 데이터를 반환하는 메서드만 다를 땐 각 하위 클래스의 메서드를 상위클래스 필드로 전환하고 하위클래스는 전부 삭제하자.

기능을 추가하거나 기능을 조금씩 달리할 하위클래스를 작성하자. 다형적인 기능의 한 형태는 상수 메서드다. 상수 메서드는 하드코딩된 값을 반환하는 메서드다.
상수 메서드는 읽기 메서드에 각기 다른 값을 반환하는 하위클래스에 넣으면 유용하다.

상위클래스 안에 읽기 메서드를 정의하고 그 읽기 메서드를 하위클래스에서 다양한 값으로 구현하자.
하위클래스를 상수메서드로만 구성한다고 해서 그만큼 효용성이 커지는것은 아니다. 상위클래스 안에 필드를 넣고 그런 하위클래스는 완전히 삭제하면 된다.

### 예제

아래 Male 하위클래스와 Female 하위클래스는 하드코딩된 상수 메서드 반환만 다르다.
이렇게 기능이 충실하지 못한 하위클래스는 삭제하자.

```javascript
// 상위 클래스
class Person {
  isMale() {}
  getCode() {}
}

class Male extends Person {
  isMale() {
    return true
  }
  getCode() {
    return 'M'
  }
}

class Female extends Person {
  isMale() {
    return false
  }
  getCode() {
    return 'F'
  }
}
```

우선 생성자를 팩토리 메서드로 전환을 실시한다.

```javascript
class Person {
  constructor(isMale, code) {
    this._isMale = isMale
    this._code = code
  }

  static createMale() {
    // return new Male()
    return Person(true, 'M')
  }

  static createFemale() {
    // return new Female()
    return Person(false, 'F')
  }

  isMale() {
    return this._isMale
  }

  getCode() {
    return this._code
  }
}

// 불필요한 하위 클래스들 삭제
// class Male extends Person {
//   constructor(){
//     super(true, 'M')
//   }
// }

// class Female extends Person {
//   constructor(){
//     super(false, 'F')
//   }
// }

// 사용분
const kent = Person.createMale()
```
