---
title: 데이터 체계화
date: "2019-03-27T10:00:03.284Z"
---

# 데이터 체계화

## 필드 자체 캡슐화 (Self Encapsulate Field)

필드에 직접 접근하던 중 그 필드로의 결합에 문제가 생길땐 그 필드용 읽기/쓰기 메서드를 작성해서 두 메서드를 통해서만 필드에 접근하게 만들자.
필드 자체 캡슐화를 실시해야 할 가장 절실한 시점은 상위클래스 안의 필드에 접근하되 이 변수 접근을 하위클래스에서 계산된 값으로 재정의해야 할 때이다.

### 예제
```javascript
class IntRange {
  constructor(){
    this._low
    this._high
  }

  getLow(){
    return _low
  }
  setLow(arg) {
    this._log = arg
  }
}
```

특히 생성자안에서 쓰기 메서드를 사용할 때 주의하자. 
대체로 객체가 생성된 후에 속성을 변경하려고 쓰기 메서드를 사용하게 된다. 이 쓰기 메서드에는 초기화 코드가 아닌 다른 기능이 추가 됐을 수 있다고 전제할 수 있다. 
하여 이럴땐 생성자나 별도의 초기화 메서드를 따로 작성하자. 

```javascript
class IntRange {
  constructor(low, high){
    init(low, high)
  }

  init(low, high) {
    this._low = low
    this._high = high
  }
}
```

## 데이터 값을 객체로 전환 (Replace Data Value with Object)

데이터 항목에 데이터나 기능을 더 추가해야 할 때는 데이터 항목을 객체로 만들자. 

예를 들어 한동안은 전화번호를 문자열로 표현해도 상관없지만 시간이 더 흐르면 형시고하, 지역번호 추출 등을 위한 특수한 기능이 필요해진다.
한두 항목은 객체 안에 메서드를 넣어도 되겠지만, 금세 중복코드나 잘못된 소속이라는 코드 구린내가 난다. 

각 Order 인스턴스에는 교유한 Customer 객체가 들어있다. 이때 Customer는 값 객체다.
개념상 동일한 고객을 나타내는 객체긴 하다. 개념상 동일한 고객에 주문이 여러개 있을 경우 하나의 Customer 객체만 사용하게끔 이것을 수정해야 한다. 

###예제

```javascript
// Order 객체는 주문 고객을 문자열로 저장한다. 
// 이때 문자열이 아닌 객체로 전환하게 되면 주소나 신용등급 같은 데이터를 저장할 장소와 이 정보를 이용하는 유용한 기능이 생긴다.
class Order {
  constructor(customerName){
    //this._customer = customer
    this._customer = new Customer(customerName)
  }

  // 메서드 이름을 더 간단명료하게 수정하자.
  //getCustomer() {
  getCustomerName()
    //return this._customer
    return this._customer.getName()
  }
  
  // 매개변수도 꼭 수정하자.
  setCustomer(customerName) {
    //this._customer = arg
    this._customer = new Customer(customerName)
  }
}

// customer 를 객체로 만들자.
class Customer {
  constructor(name) {
    this._name = name
  }

  getName() {
    return this._name
  }
}
```

## 값을 참조로 전환 (Change Value to Reference)

클래스에 같은 인스턴스가 많이 들어 있어서 이것들을 하나의 객체로 바꿔야 할 땐 그 객체를 참조 객체로 전환하자.
위 예제에서 한 고객에 주문이 여러 개 있을 경우에는 하나의 Customer 객체만 사용하게끔 이것을 수정해야 한다. 
즉, 이 예제에서는 고객 이름 하나당 한 개의 Customer 객체만 있어야 한다.

아래 예제는 Order 의 인스턴스 _customer 변수에 Customer 객체의 참조값을 가지고 있는것을 뜻한다.

###예제 
```javascript

// Customer 인스턴스에 접근할 방법을 정해야 한다. 이때 별도의 객체를 사용하자. 
const _instances = {
  _store: {},
  put(name, customer) {
    this._store[name] = customer
  },
  get(name) {
    return this._store[name]
  }
}

// 팩토리 메서드를 정의하자.
class Customer {

  constructor(name) {
    this._name = name
  }

  // static으로 
  // 메서드 변경 create -> getNamed
  static getNamed(name) {
    // 새로 생성하는 것이 아닌 미리 생성해둔 customer 인스턴스를 반환하게 하자.
    // return new Customer(name)
    return _instances.get(name)
  }

  // 고객들을 미리 설정하자고 하자.
  static loadCustomers() {
    new Customer('ho').store()
    new Customer('merlin').store()
    new Customer('gogo').store()
  }

  store() {
    _instances.put(this.getName(), this)
  }
}

// 그 다음, 생성자 호출을 팩토리 메서드 호출로 수정
class Order {
  constructor(customerName) {
    this._customer = Customer.getNamed(customerName) // static 메서드
  }
}
```

## 참조를 값으로 전환 (Change Reference to Value)

참조 객체가 작고 수정할 수 없고 관리하기 힘들 땐 그 참조 객체를 값 객체로 만들자.
즉, 합성관계로 만드는 것이다. 

여기서 합성관계란 부분 객체가 전체 객체에 속하는 관계인데 
전체 객체가 없어지면 부분 객체도 없어지는 관계이다.

```mermaid
Computer *-- Mainboard
```

```javascript
// 컴퓨터가 사라지면 메인보드랑 cpu 객체도 사라진다. 
class Computer {
  constructor() {
    this.mb = new Mainboard()
    this.c = new CPU()
  }
}
```

또 다른걸로는 집약관계라는것이 있는데 이것은 한 객체가 다른 객체를 포함하는 것이다.
전체 객체가 메모리에서 사라진다 해도 부분객체는 사라지지 않는다.

```javascript
// 컴퓨터가 사라지면 메인보드랑 cpu 객체도 사라진다. 
class Computer {
  constructor(mainboard , cpu) {
    this.mb = mainboard
    this.c = cpu
  }
}
```



참조 객체를 사용한 작업이 복잡해지는 순간이 참조를 값으로 바꿔야 할 시점이다. 참조 객체는 어떤 식으로든 제어되어야 한다. 
값 객체는 분산 시스템이나 병렬 시스템에 주로 사용된다. 
값 객체는 변경할 수 없어야 한다는 주요 특성이 있다. 하나에 대한 질의를 호출하면 상항 결과가 같아야 한다. 

###예제
```javascript
// Currency는 참조 객체이다.
// Currency 에는 여러 인스턴스가 들어있다고 가정하자. 생성자만 사용하는 것은 불가능하다. 
class Currency {
  constructor() {
    this._code
  }

  getCode() {
    return this._code
  }

  static get(code) {
    return _instances.get(code)
  }
}

// 위 참조객체에서 사용할 인스턴스를 가져오려면 다음과 같이 한다. 
const usd = Currency.get('USD')

// 이것을 값 객체로 변환하려면 그 객체가 변경불가인지 확인해야한다. 
// 


```

## 배열을 객체로 전환 (Replace Array with Object)

## 관측 데이터 복제 (Duplicate Observed Data)

## 클래스의 단방향 연결을 양방향으로 전환 (Change Unidirectional Association to Bidirectional)

## 클래스의 양방향 연결을 단방향으로 전환 (Change Bidirectional Association to Unidirectional)

## 마법 숫자를 기호 상수로 전환 (Replace Magic Number with Symbolic Constant)

## 필드 캡슐화 (Encapsulate Field)

## 컬렉션 캡슐화 (Encapsulate Collection)

## 레코드를 데이터 클래스로 전환 (Replace Record with Data Class)

## 분류 부호를 클래스로 전환 (Replace Type Code with Class)

## 분류 부호를 하위클래스로 전환 (Replace Type Code with Subclasses)

## 분류 부호를 상태/전략 패턴으로 전환 (Replace Type Code with State/Strategy)

## 하위클래스를 필드로 전환(Replace Subclass with Fields)
