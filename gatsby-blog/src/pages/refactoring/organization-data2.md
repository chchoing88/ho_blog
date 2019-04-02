---
title: 데이터 체계화2
date: "2019-04-01T10:00:03.284Z"
---

# 데이터 체계화

## 클래스의 단방향 연결을 양방향으로 전환 (Change Unidirectional Association to Bidirectional)

두 클래스가 서로의 기능을 사용해야 하는데 한 방향으로만 연결되어 있을 땐 역 포인터를 추가하고 두 클래스를 모두 업데이트할 수 있게 접근 한정자를 수정하자.

애초에 두 클래스를 설정할 때 한 클래스가 다른 클래스를 참조하게 해놓은 경우가 있을 수 있다. 나중에 이 포인터를 역방향으로 참조해야할 경우도 생긴다.

### 예제

`Order` 클래스가 `Customer` 클래스를 참조하는 간단한 프로그램이 있다.
이때 `Customer` 에는 `Order` 클래스를 참조하는 코드가 들어 있지 않다.

여기서는 `Customer`에는 `Order` 참조가 여러 개이므로 `Order` 클래스를 연결제어 객체로 택한다. 
`Order` 객체에 연결제어 기능을 구현하자.

```javascript
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
    if(this._customer !== null) this._customer.friendOrders().remove(this)
    // 이 객체의 포인터를 새 객체에 할당한 후 이 객체로의 포인터를 추가하게 해서 새 객체에 명령해야 한다.
    this._customer = customer
    if(this._customer !== null) this._customer.friendOrders().add(this)
  }
}

// 고객 한명이 여러 건의 주문을 할 수 있으므로 _orders는 HashSet으로 셋팅 
class Customer {
  constructor() {
    this._orders = new HashSet()
  }

  friendOrders() {
    return this._orders
  }

  // Customer 클래스를 거쳐서 연결을 변경하려면 
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

public 필드가 있을 땐 그 필드를 private로 만들고 필드용 읽기 메서드와 쓰기 메서드를 작성하자.
자바스크립트에는 아직 public, private가 없기 때문에 `_(언더바)`로 표시하자.

## 컬렉션 캡슐화 (Encapsulate Collection)

메서드가 컬렉션을 반환할 땐 그 메서드가 읽기전용 뷰를 반환하게 수정하고 추가 메서드와 삭제 메서드를 작성하자. 

클래스에 여러 인스턴스로 구성된 컬렉션이 들어 있는 경우를 흔히 볼 수 있다. 그 컬렉션은 배열, 리스트, 세트, 벡터중 하나일텐데
그럴 땐 십중팔구 컬렉션을 읽고 쓸 수 있는 평범한 읽기 메서드와 쓰기 메서드가 있기 마련이다. 

그러나 컬렉션은 다른 종류의 데이터와는 약간 다른 읽기/쓰기 방식을 사용해야 한다. 
읽기 메서드에서는 컬렉션 객체 자체를 반환해선 안된다. 왜냐하면 컬렉션 참조 부분이 컬렉션의 내용을 조작해도 그 컬렉션이 든 클래스는 무슨 일이 일어나는지는 모르기 때문이다. 
이로 인해 컬렉션 참조 코드에게 그 객체의 데이터 구조가 지나치게 노출된다. 갑싱 여러개인 속성을 읽는 읽기 메서드는 컬렉션 조작이 불가능한 형식을 반환하고 
불필요하게 자세한 컬렉션 구조 정보는 감춰야 한다. 

그리고 컬렉션 쓰기 메서드는 절대 있으면 안 되므로, 원소를 추가하는 메서드와 삭제하는 메서드를 대신 사용해야 한다. 

## 예제

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
for(let p of iter) {
  if(p.done) break
  if(p.value.isAdvaned()) count++
}

```

`setCourses` 메서드에서 해당 참조 값을 여러군데에서 쓰이고 이 메서드가 많이 사용된다면 
이 메서드 내용을 추가/삭제 기능의 코드로 바꿔야 한다. 
즉, 쓰기 메서드 내용을 추가 메서드 내용으로 바꿔주면 된다. 
이렇게 하면 컬렉션을 지닌 객체가 컬렉션의 원소 추가와 삭제를 통제할 수 있다.

또한 `getCourses`의 읽기 메서드는 수정이 불가한 객체로 바꿔줘야 하는데 자바스크립트에서는 그 객체를 복사한 다른 객체를
내보내 줘서 `this._courses`에 영향이 없도록 해야한다.


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
    for(let p of iter) {
      if(p.value.isAdvaned()) count++
    }
  }
}

```

추가적으로 고급과정을 알아내는 코드의 경우에도 `Person` 클래스 데이터만 사용하므로 응당 `Person` 클래스로 옮겨 마땅하다.


## 분류 부호를 클래스로 전환 (Replace Type Code with Class)

기능에 영향을 미치는 숫자형 분류 부호가 든 클래스가 있을 땐 그 숫자를 새 클래스로 바꾸자.

분류부호 이름을 상징적인 것으로 정하면 코드가 상당히 이해하기 쉬워진다.
문제는 상징적 이름은 단지 별명에 불과하다는 점이다. 

분류부호가 switch 문안에 사용되어 다른 기능을 수행하거나 메서드를 호출할 땐 클래스로 전환하면 안된다. 
switch 문에는 임의로 클래스를 사용할 수 없으며 오직 정수 타입만 사용 가능하므로 클래스로 전환은 실패를 맞게 된다. 

### 예제 

다음과 같은 코드가 있다고 하자.

```javascript
class Person {
  static O = 0
  static A = 1
  static B = 2
  static AB = 3



}
```

## 분류 부호를 하위클래스로 전환 (Replace Type Code with Subclasses)

## 분류 부호를 상태/전략 패턴으로 전환 (Replace Type Code with State/Strategy)

## 하위클래스를 필드로 전환(Replace Subclass with Fields)
