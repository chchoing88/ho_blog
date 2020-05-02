---
title: (리팩토링) 데이터 체계화1
date: "2019-03-27T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript 로 전환하였습니다.

여기서는 데이터 연동을 더 간편하게 해준다.
객체지향 언어는 구형 언어의 단순 데이터 타입으론 불가능했던 것까지 할 수 있는 새로운 타입을 정의할 수 있어서 좋다.

배열이 데이터 구조 역할을 할 때는 배열을 객체로 전환을 실시하면 그 데이터 구조가 더 선명해진다.

## 필드 자체 캡슐화 (Self Encapsulate Field)

필드에 직접 접근하던 중 그 필드로의 결합에 문제가 생길땐 그 필드용 읽기/쓰기 메서드를 작성해서 두 메서드를 통해서만 필드에 접근하게 만들자.
필드 자체 캡슐화를 실시해야 할 가장 절실한 시점은 상위클래스 안의 필드에 접근하되 이 변수 접근을 하위클래스에서 계산된 값으로 재정의해야 할 때이다.

### 예제

```javascript
class IntRange {
  constructor(low, high) {
    this._low = low
    this._high = high
  }

  includes(arg) {
    return arg >= this._low && arg <= this._high
  }

  grow(factor) {
    this._high = this._high * factor
  }

  // 읽기 / 쓰기 메서드를 활용하자.
  getLow() {
    return this._low
  }
  setLow(arg) {
    this._log = arg
  }

  setLow(low) {
    this._low = low
  }

  setHigh(high) {
    this._high = high
  }
}
```

특히 생성자안에서 쓰기 메서드를 사용할 때 주의하자.
대체로 객체가 생성된 후에 속성을 변경하려고 쓰기 메서드를 사용하게 된다. 이 쓰기 메서드에는 초기화 코드가 아닌 다른 기능이 추가 됐을 수 있다고 전제할 수 있다.
하여 이럴땐 생성자나 별도의 초기화 메서드를 따로 작성하자.

```javascript
class IntRange {
  constructor(low, high) {
    initialize(low, high)
  }

  initialize(low, high) {
    this._low = low
    this._high = high
  }

  includes(arg) {
    // return arg >= this._low && arg <= this._high
    return arg >= this.getLow() && arg <= this.getHigh()
  }

  grow(factor) {
    // this._high = this._high * factor
    this.setHigh(this.getHigh() * factor)
  }

  getLow() {
    return this._low
  }

  getHigh() {
    return this._high
  }

  setLow(low) {
    this._low = low
  }

  setHigh(high) {
    this._high = high
  }
}
```

이렇게 해두면 다음과 같은 하위 클래스가 생길 때 편리해진다.

```javascript
class CappedRange extends IntRange {
  constructor(low, high, cap) {
    super(low, high)
    this._cap = cap
  }

  getCap() {
    return this._cap
  }

  // 재정의
  // 상위 클래스 안의 필드에 접근하되 이 변수 접근을 하위클래스에서 계산된 값으로 재정의해야 할때!!
  getHigh() {
    return Math.min(super.getHigh(), this.getCap())
  }
}
```

IntRange 의 기능을 전부 재정의하면 기능을 하나도 수정하지 않고 cap 을 계산에 넣을 수 있다.

## 데이터 값을 객체로 전환 (Replace Data Value with Object)

데이터 항목에 데이터나 기능을 더 추가해야 할 때는 데이터 항목을 객체로 만들자.

예를 들어 한동안은 전화번호를 문자열로 표현해도 상관없지만 시간이 더 흐르면 형식화, 지역번호 추출 등을 위한 특수한 기능이 필요해진다.
한두 항목은 객체 안에 메서드를 넣어도 되겠지만, 금세 중복코드나 잘못된 소속이라는 코드 구린내가 난다.

### 예제

```javascript
class Order {
  constructor(customer: String) {
    this._customer = customer
  }

  getCustomer() {
    return this._customer
  }

  setCustomer(arg) {
    this._customer = arg
  }
}
```

각 Order 인스턴스에는 Sting customer 가 들어있었다. 하여 우리가 Customer 를 객체로 바꿀 때에는 Customer 는 값 객체로 만들어야 한다. 규칙에 따라 값 객체는 변경불가여야 한다. 매번 새롭게 메모리를 할당받는 객체가 되어야 한다는 말이다. 참고로 원시 객체는 변경 불가한 녀석들이다.

```javascript
// Order 객체는 주문 고객을 문자열로 저장한다.
// 이때 문자열이 아닌 객체로 전환하게 되면 주소나 신용등급 같은 데이터를 저장할 장소와 이 정보를 이용하는 유용한 기능이 생긴다.
class Order {
  constructor(customerName){
    //this._customer = customer
    this._customer = new Customer(customerName)
  }

  // 메서드 이름을 더 간단명료하게 수정하자.
  //getCustomer() => getCustomerName
  getCustomerName()
    //return this._customer
    return this._customer.getName()
  }

  // 쓰기 메서드 - 값 객체이기 때문에 기존의 this._customer를 수정하는 것이 아닌 새로운 인스턴스를 만든다.
  // 매개변수도 꼭 수정하자.
  setCustomer(customerName) {
    //this._customer = arg
    this._customer = new Customer(customerName)
  }
}

// 위 코드를 사용하는 일부 코드는 다음과 같다.
numberOfOrdersFor(orders=[], cusomter='') {
  let result = 0
  const iter = orders[Symbol.iterator]()
    for (let p of iter) {
      if(p.value.getCustomerName() === customer) {
        result++
      }
    }
  return result
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

여기서 `Order` 클래스의 쓰기 메서드 `setCustomer`는 새 `Customer` 인스턴스를 생성하는데, 기존의 문자열 속성이 값 객체였으므로 위의 코드로 인해
`Customer`도 값 객체가 되었다. 즉, 각 `Order` 객체에 대응하는 `Customer` 객체가 존재한다. 규칙에 따라 값 객체는 변경불가(immutable)여야 한다. 그래야만 위험한 왜곡 버그를 피할 수 있다.

처음에 Order 가 customer 를 String(immutable value)타입으로 가지고 있었기 때문에 다른 쪽에서 이런식으로 활용 했을 수 있다.

```javascript
const value = order.getCustomer() // merlin
const changeValue = value.addPrefix('hoho') // hoho merlin

console.log(order.getCustomer()) // merlin

// but getCustomer가 객체로 리턴된다면..그리고 그 객체에서 addPrefix라는 메서드가 존재한다면
// 예기치 못한 버그가 튀어나올 것이다.

const value = order.getCustomer() // {name : merlin}
const changeValue = value.addPrefix('hoho') // hoho merlin

console.log(order.getCustomer()) // hoho merlin
```

여기서 추가적인 리팩토링을 실시한다면 그건 당연히 기존 `Customer` 객체를 매개변수로 받는 쓰기 메서드와 새 생성자를 추가하는 작업일 것이다.

`Customer`에 신용등급과 주소 같은것을 추가하려면 지금 할 수는 없다. 왜냐하면 `Customer`는 *값 객체*로 취급되기 때문이다.
이런 속성을 추가하려면 `Customer`에 값을 참조로 전환을 적용해서 한 고객의 모든 주문이 하나의 `Customer` 객체를 사용하게 해야한다.

또한 개념상 동일한 고객을 나타내는 객체긴 하다. 개념상 동일한 고객에 주문이 여러개 있을 경우 하나의 Customer 객체만 사용하게끔 이것을 수정해야 한다.

#### 여기서 값 객체란 (VO: Value Object)

OOP 에서는 다양한 것들을 객체로 만들 수 있다. 객체로 만들 수 있는 것중에 어떤 '값'도 포함할 수 있다. 잔고, 색상, 좌표 등 값 객체로 표현 될 수 있다.
값 객체는 하나의 공통점이 있다. 값은 어디에 있든 같다. 빨간색이 여기에 있던 저기에 있던 같은 빨간색이라는 것이다.
일반적인 경우 어떤 대상이 있다면 그 대상이 어떤 이름을 가지고 있든 간에 같다고 생각한다.

예를들어 내가키우는 강아지 이름이 '멀린' 혹은 '몰링' 이라 불린다고 하자. 하지만 다르게 불려도 다 내가 키우는 강아지 이다.
다르게 생각하면 같은 '멀린' 이라도 다른 강아지를 가리킨다면 다른 강아지가 되는 것이다.

일반적인 객체는 객체가 생성되는 순간 독립된 객체가 된다. 값 객체가 같은 값을 가지고 있다고 하더라도 다른 객체이기 때문에 같지 않다고 하는 것이다. 이런 개념을 참조 객체라고 한다.

여기서 값 객체 같음을 표현하는 방법은 동일과 동등을 이해해야 한다.
동일은 객체가 참조하는 것 다시말해 대상이 같다는 것을 의미 (=== 연산자)
동등은 객체가 참조하는 대상의 속성 값 혹은 동등하게 하는 조건이 같음을 의미 (equal 메서드)

따라서 값 객체라는 것은 equal 메서드로 확인했을때 같음을 의미한다.

값 객체는 변하지않고 항상 새로운 값 객체를 리턴하게 만들어야 한다.
값 객체를 사용하면 객체의 참조 문제가 해결될 수 있다.
값 객체를 사용하면 참조 변수 A 와 B 가 C 라는 객체를 참조하고 있을 때, B 에 조작 연산을 가하여도 A 에는 아무런 변화가 생기지 않는다.

## 값을 참조로 전환 (Change Value to Reference)

클래스에 같은 인스턴스가 많이 들어 있어서 이것들을 하나의 객체로 바꿔야 할 땐 그 객체를 참조 객체로 전환하자.
위 예제에서 한 고객에 주문이 여러 개 있을 경우에는 하나의 Customer 객체만 사용하게끔 이것을 수정해야 한다.
즉, 이 예제에서는 고객 이름 하나당 한 개의 Customer 객체만 있어야 한다.

아래 예제는 Order 의 인스턴스 \_customer 변수에 Customer 객체의 참조값을 가지고 있는것을 뜻한다.

### 예제

```javascript
class Customer {
  constructor(name) {
    this._name = name
  }

  getName() {
    return this._name
  }
}

class Order {
  constructor(customName) {
    this._customer = new Customer(customerName)
  }

  getCustomerName() {
    return this._customer.getName()
  }
}


// 위 코드를 사용하는 일부 코드는 다음과 같다.
numberOfOrdersFor(orders=[], cusomter='') {
  let result = 0
  const iter = orders[Symbol.iterator]()
    for (let p of iter) {
      if(p.value.getCustomerName() === customer) {
        result++
      }
    }
  return result
}
```

이때 `Customer`는 값 객체다. 각 `Order` 인스턴스에는 고유한 `Customer` 객체가 들어있다.
개념상 동일한 고객에 주문이 여러 개 있을 경우 하나의 `Customer` 객체만 사용하게끔 이것을 수정해야 한다.
즉, 이 예제에서 고객 이름 하나당 한 개의 `Customer` 객체만 있어야 한다.

우선 `Customer`의 생성자를 팩토리 메서드로 전환을 하자 이렇게 하면 생성 절차를 제어할 수 있다.

```javascript
// Customer 인스턴스에 접근할 방법을 정해야 한다. 이때 별도의 객체를 사용하자.
const _instances = {
  _store: {},
  put(name, customer) {
    this._store[name] = customer
  },
  get(name) {
    return this._store[name]
  },
}

// 팩토리 메서드를 정의하자.
class Customer {
  constructor(name) {
    this._name = name
  }

  // static으로
  // 생성자를 팩토리 메서드로 전환
  // 메서드 네이밍 변경 create -> getNamed
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

여기서 합성관계란 부분 객체가 전체 객체에 속하는 관계인데전체 객체가 없어지면 부분 객체도 없어지는 관계이다.

```
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

또 다른 관계로는 집약관계라는것이 있는데 이것은 한 객체가 다른 객체를 포함하는 것이다.
전체 객체가 메모리에서 사라진다 해도 부분객체는 사라지지 않는다.

```javascript
// 컴퓨터가 사라지면 메인보드랑 cpu 객체도 사라진다.
class Computer {
  constructor(mainboard, cpu) {
    this.mb = mainboard
    this.c = cpu
  }
}
```

참조 객체를 사용한 작업이 복잡해지는 순간이 참조를 값으로 바꿔야 할 시점이다. 참조 객체는 어떤 식으로든 제어되어야 한다.
값 객체는 분산 시스템이나 병렬 시스템에 주로 사용된다.
*값 객체는 변경할 수 없어야 한다*는 주요 특성이 있다. 하나에 대한 질의를 호출하면 항상 결과가 같아야 한다.

### 예제

```javascript
class Currency {
  // 생성자가 private 라고 가정하자.
  constructor(code) {
    this._code = code
    this._currencies = {
      USD: new Currency('USD'),
    }
  }

  getCode() {
    return this._code
  }

  static get(code) {
    return this._currences[code]
  }
}

// 사용분
const usd = Currency.get('USD')
```

위 클래스는 참조 객체이므로 사용할 인스턴스를 가져오려면 사용분 과 같이 주어진 code 에 Currency 의 동일 인스턴스를 반환하는 메서드를 사용해야 한다.
Currency 클래스에는 여러 인스턴스가 들어있다. 생성자만 사용하는것은 불가능하다. 그래서 private 이다.

```javascript
new Currency('USD').equals(new Currency('USD')) // false 반환
```

이것을 값 객체로 변환하려면 그 객체가 변경불가(immutable)인지 확인해야 한다.
변경불가가 아니면 값이 변경 가능할 경우 별칭 문제가 발생하므로 이 방법을 사용하지 말자.

```javascript
class Currency {
  constructor(code) {
    this._code = code
  }

  equals(arg) {
    if( arg instanceOf Currency ) return false
    const other = arg
    return (this._code.equals(other._code))
  }

  hasCode() {
  return _code.hashCode()
  }

  getCode() {
    return this._code
  }
}
```

여기서는 객체를 값으로 가지고 있기 때문에 같은 필드의 값을 가지고 있어도 같다고 볼수가 없다. 이런 문제점을 안고 있기에 변경 불가한 값을 지니고 있어야 한다.
즉, 아래 결과에 참이 나와야 한다.

```javascript
new Currency('USD').equals(new Currency('USD'))
```

그렇기에 equals 메서드를 정의해야 한다. 이때, hashCode 메서드도 정의해야 한다.
간단히 하려면 equals 메서드에 사용되는 필드의 해시코드를 가져다가 XOR 비트 연산을 수행해서 코드를 작성한다.

여기서 XOR 연산은 입력값이 같지 않으면 '1'이 출력이 된다. 이는 두 입력 중 하나만이 배타적으로 참일 경우에만 일어난다.

이제 Currency 인스턴스를 원하는 수만큼 생성할 수 있다. 다음과 같이 Currency 클래스와 팩토리 메서드에 있는 모든 컨트롤러 기능을 삭제하고 생성자만 사용해도 된다.
그 생성자를 이제 public 으로 만들 수 있다.

## 배열을 객체로 전환 (Replace Array with Object)

배열을 구성하는 특정 원소가 별의별 의미를 지닐 땐 그 배열을 각 원소마다 필드가 하나씩 든 객체로 전환하자.

배열은 데이터 정리에 흔히 사용되는 구조다. 그러나 배열은 비슷한 객체들의 컬렉션을 일정 순서로 담는 용도로만 사용해야 한다. 그러나 간혹 배열에 각양각색의 것이 무수히 들어있는 것을 보게 된다.
객체를 사용하면 필드명과 메서드명을 사용하여 이러한 정보를 전달할 수 있으므로 기억하거나 주석을 갱신할 필요가 없다. 그런 정보를 캡슐화하고 객체에 기능을 추가할 수도 있다.

### 예제

아래 예제는 스포츠 팀의 이름, 승수, 패수를 배열에서 객체로 바꿔보는 실습이다.

```javascript
const row = ['리버풀', '15', '3']

// 위 배열을 객체로 바꾸자.

class Performance {
  constructor(name, win, lose) {
    this._name = name
    this._win = win
    this._lose = lose
  }

  getName() {}

  setName() {}
}
```

## 관측 데이터 복제 (Duplicate Observed Data)

도메인 데이터는 GUI 컨트롤 안에서만 사용 가능한데, 도메인 메서드가 그 데이터에 접근해야 할 땐그 데이터를 도메인 객체로 복사하고, 양측의 데이터를 동기화하는 관측 인터페이서 observer 를 작성하자.

계층구조가 체계적인 시스템은 비즈니스 로직 처리 코드와 사용자 인터페이스 처리 코드가 분리되어 있다.

* 비슷한 비즈니스 로직을 여러 인터페이스가 처리해야 하는 경우라서
* 비즈니스 로직까지 처리하려면 사용자 인터페이스가 너무 복잡해지니까
* GUI 와 분리된 도메인 객체가 더욱 유지보수하기 쉬우니까
* 두 부분을 서로 다른 개발자가 다루게 할 수 있으니까

## 예제

아래 예제에서 해볼 예제는 세 개의 텍스트 필드중 하나의 값을 변경하면 다른 필드 값도 바뀌는 UI 가 있다고 하자.
여기서 start 필드나 end 필드 값을 바꾸면 length 필드 값이 계산되어 바뀌고 length 필드 값을 바꾸면 end 필드 값이 계산되어 바뀌는 UI 이다.

우선 첫번째로 여러가지 혼재되어있는 코드를 볼수있다.

```javascript
// ui 코드와 비즈니스 코드가 산재하고 있는 클래스
class IntervalWindow {
  constructor() {
    this._startFieldElem
    this._endFieldElem
    this._lengthFieldElem
  }

  // 3가지 필드는 포커스를 잃으면 반응하게 설정되어 있다.
  focusLost(event) {
    const target = event.target
    if (target === this._startFieldElem) {
      // 스타트 input 필드에서 초첨을 잃었을때 반응하자.
      this.startFieldFocusLost(event)
    } else if (target === this._endFieldElem) {
      this.endFieldFocusLost(event)
    } else if (target === this._lengthFieldElem) {
      this.lengthFieldFocusLost(event)
    }
  }

  // 3가지의 이벤트 핸들러들..
  startFieldFocusLost(event) {
    if (isNotInteger(this._startFieldElem.value)) this._startFieldElem.value = 0
    calculateLength()
  }

  endFieldFocusLost(event) {
    if (isNotInteger(this._endFieldElem.value)) this._endFieldElem.value = 0
    calculateLength()
  }

  lengthFieldFocusLost(event) {
    if (isNotInteger(this._lengthFieldElem.value))
      this._lengthFieldElem.value = 0
    calculateEnd()
  }

  calculateLength() {
    try {
      const start = parseInt(this._startFieldElem.value)
      const end = parseInt(this._endFieldElem.value)
      const length = end - start

      this._lengthFieldElem.value = partInt(length)
    } catch (e) {
      new error('잘못된 숫자 형식이다.')
    }
  }

  calculateEnd() {
    // calculateLength 비슷.
  }
}
```

위 코드에서 할일은 GUI 코드와 로직 코드를 분리 하는 것이다.
즉, `calculateLength` , `calculateEnd` 메서드를 별도의 도메인 클래스로 옮겨야한다. 그러려면 start, end, length 변수를 IntervalWindow 클래스를 거치지 않고 참조해야 한다.
유일한 방법은 start, end, length 변수 데이터를 도메인 클래스로 복사하고 그 데이터를 GUI 클래스의 데이터와 동기화 하는 것이다. 이 작업을 관측 데이터 복제라고 한다.

여기서 `Observable (Subject)_신문사`는 `observer_구독자`들을 관리하고 모든 `observer`가 `Observable (Subject)`를 관찰할수 있다.
또한 `observer` 은 subscribe 와 unsubscribe 의 메서드를 지닌 인터페이스이다. `Observable (Subject)`에서 state 가 변화가 생겼을때 그 관찰자들에게 통지해준다.

`Observer`는 `Observable (Subject)` 가 변화가 생겼을때 실행될 함수 같은 것이다.

아래 예제에서는 `Interval` 클래스에는 비즈니스 로직이 `IntervalWindow`에는 UI 로직이 들어가있다.

```javascript
// 도메인 클래스 ( )
class Interval extends Observable {
  constructor() {
    this._end
  }

  getEnd() {
    return this._end
  }

  setEnd(value) {
    this._end = value
    this.setChanged()
    this.notifyObservers() // observer들의 update 메서드 실행
  }
}

// IntervalWindow 클래스 안에는 다음과 같이 넣자.
// this._subject //( Inverval 의 인스턴스를 담고있을 것이다. )

// 위 상황처럼 구현을 하려면 IntervalWindow 클래스에 Observer 클래스를 상속 구현하게 만들어야 한다.

class IntervalWindow extends Observer {
  constructor() {
    this._endFieldElem
    this._subject = new Interval()
    this._subject.addObserver(this)
    update(_subject, null)
  }

  endFieldFocusLost(event) {
    this.setEnd(this._endFieldElem.value)

    if (isNotInteger(this._endFieldElem.value)) this._endFieldElem.value = 0
    calculateLength()
  }

  // 여기서 update 함수는 Interval 클래스에서 notifyObservers 메서드가 실행되었을때 실행된다.
  update(observable, arg) {
    this._endFieldElem.value = this._subject.getEnd()
  }

  getEnd() {
    return this._subject.getEnd()
  }

  setEnd(value) {
    // this._endField.value = value
    this._subject.setEnd(value)
  }
}
```

지금껏 end 필드에 수행한 과정을 start 필드와 length 필드에도 그대로 적용하자. `메서드 이동` 기법으로
calculateEnd 메서드와 calculateLength 메서드를 Interval 클래스로 옮기자. 그러면 모든 도메인 기능과 데이터는 도메인 클래스에 들어 있게 되어 GUI 코드와 분리된다.
