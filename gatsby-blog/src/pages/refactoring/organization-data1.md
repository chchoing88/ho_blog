---
title: 데이터 체계화1
date: "2019-03-27T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript로 전환하였습니다.

여기서는 데이터 연동을 더 간편하게 해준다. 
객체지향 언어는 구형 언어의 단순 데이터 타입으론 불가능했던 것까지 할 수 있는 새로운 타입을 정의할 수 있어서 좋다. 

배열이 데이터 구조 역할을 할 때는 배열을 객체로 전환을 실시하면 그 데이터 구조가 더 선명해진다. 

## 필드 자체 캡슐화 (Self Encapsulate Field)

필드에 직접 접근하던 중 그 필드로의 결합에 문제가 생길땐 그 필드용 읽기/쓰기 메서드를 작성해서 두 메서드를 통해서만 필드에 접근하게 만들자.
필드 자체 캡슐화를 실시해야 할 가장 절실한 시점은 상위클래스 안의 필드에 접근하되 이 변수 접근을 하위클래스에서 계산된 값으로 재정의해야 할 때이다.

### 예제

```javascript
class IntRange {
  constructor() {
    this._low
    this._high
  }

  getLow() {
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
  constructor(low, high) {
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

각 Order 인스턴스에는 교유한 Customer 객체가 들어있다. 이때 Customer 는 값 객체다.
개념상 동일한 고객을 나타내는 객체긴 하다. 개념상 동일한 고객에 주문이 여러개 있을 경우 하나의 Customer 객체만 사용하게끔 이것을 수정해야 한다.

### 예제

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

아래 예제는 Order 의 인스턴스 \_customer 변수에 Customer 객체의 참조값을 가지고 있는것을 뜻한다.

### 예제

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

여기서 합성관계란 부분 객체가 전체 객체에 속하는 관계인데전체 객체가 없어지면 부분 객체도 없어지는 관계이다.

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
  constructor(mainboard, cpu) {
    this.mb = mainboard
    this.c = cpu
  }
}
```

참조 객체를 사용한 작업이 복잡해지는 순간이 참조를 값으로 바꿔야 할 시점이다. 참조 객체는 어떤 식으로든 제어되어야 한다.
값 객체는 분산 시스템이나 병렬 시스템에 주로 사용된다.
값 객체는 변경할 수 없어야 한다는 주요 특성이 있다. 하나에 대한 질의를 호출하면 상항 결과가 같아야 한다.

여기서는 객체를 값으로 가지고 있기 때문에 같은 필들의 값을 가지고 있어도 같다고 볼수가 없다. 이런 문제점을 안고 있기에변경 불가한 값을 지니고 있어야 한다.

즉, 아래 결과에 참이 나와야 한다.

```javascript
new Currency('USD').equals(new Currency('USD'))
```

그렇기에 equals 메서드를 정의해야 한다. 이때, hashCode 메서드도 정의해야 한다.
간단히 하려면 equals 메서드에 사용되는 필드의 해시코드를 가져다가 XOR 비트 연산을 수행해서 코드를 작성한다.

여기서 XOR 연산은 입력값이 같지 않으면 '1'이 출력이 된다. 이는 두 입력 중 하나만이 배타적으로 참일 경우에만 일어난다.

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

  getName() {

  }

  setName() {

  }
}
```

## 관측 데이터 복제 (Duplicate Observed Data)

도메인 데이터는 GUI 컨트롤 안에서만 사용 가능한데, 도메인 메서드가 그 데이터에 접근해야 할 땐
그 데이터를 도메인 객체로 복사하고, 양측의 데이터를 동기화하는 관측 인터페이서 observer를 작성하자.

계층구조가 체계적인 시스템은 비즈니스 로직 처리 코드와 사용자 인터페이스 처리 코드가 분리되어 있다. 

 - 비슷한 비즈니스 로직을 여러 인터페이스가 처리해야 하는 경우라서
 - 비즈니스 로직까지 처리하려면 사용자 인터페이스가 너무 복잡해지니까
 - GUI와 분리된 도메인 객체가 더욱 유지보수하기 쉬우니까
 - 두 부분을 서로 다른 개발자가 다루게 할 수 있으니까

## 예제 

아래 예제에서 해볼 예제는 세 개의 텍스트 필드중 하나의 값을 변경하면 다른 필드 값도 바뀌는 UI 가 있다고 하자.
여기서 start 필드나 end 필드 값을 바꾸면 length 필드 값이 계산되어 바뀌고 length 필드 값을 바꾸면 end 필드 값이 계산되어 바뀌는 UI 이다.

우선 첫번째로 여러가지 혼재되어있는 코드를 볼수있다. 

```javascript
class IntervalWindow {
    constructor() {
      this._startFieldElem
      this._endFieldElem
      this._lengthFieldElem
    }

    // 3가지 필드는 포커스를 잃으면 반응하게 설정되어 있다. 
    focusLost(event) {
      const target = event.target
      if( target === this._startFieldElem ) {
        // 스타트 input 필드에서 초첨을 잃었을때 반응하자.
        this.startFieldFocusLost(event)
      } else if(target === this._endFieldElem) {
        this.endFieldFocusLost(event)
      } else if(target === this._lengthFieldElem) {
        this.lengthFieldFocusLost(event)
      }
    }

    startFieldFocusLost(event) {
      if(isNotInteger(this._startFieldElem.value)) this._startFieldElem.value = 0
      calculateLength()
    }
    
    endFieldFocusLost(event) {
      if(isNotInteger(this._endFieldElem.value)) this._endFieldElem.value = 0
      calculateLength()
    }

    lengthFieldFocusLost(event) {
      if(isNotInteger(this._lengthFieldElem.value)) this._lengthFieldElem.value = 0
      calculateEnd()
    }

    calculateLength() {
      try {
        const start = parseInt(this._startFieldElem.value)
        const end = parseInt(this._endFieldElem.value)
        const length = end - start

        this._lengthFieldElem.value = partInt(length)
      } catch(e) {
        new error('잘못된 숫자 형식이다.')
      }
    }

    calculateEnd() {
      // calculateLength 비슷.
    }
    
}
```

위 코드에서 할일은 GUI 코드와 로직 코드를 분리 하는 것이다. 
즉, `calculateLength` , `calculateEnd` 메서드를 별도의 도메인 클래스로 옮겨야한다. 그러려면 start, end, length  변수를 IntervalWindow 클래스를 거치지 않고 참조해야 한다. 
유일한 방법은 start, end, length 변수 데이터를 도메인 클래스로 복사하고 그 데이터를 GUI 클래스의 데이터와 동기화 하는 것이다. 이 작업을 관측 데이터 복제라고 한다. 

여기서 `Observable (Subject)`는 `observer`들을 관리하고 모든 `observer`가 `Observable (Subject)`를 관찰할수 있다.
또한 subscribe 와 unsubscribe의 메서드를 지닌 인터페이스이다. `Observable (Subject)`에서 state가 변화가 생겼을때 그 관찰자들에게 통지해준다.

`Observer`는 `Observable (Subject)` 가 변화가 생겼을때 실행될 함수 같은 것이다. 

아래 예제에서는 `Interval` 클래스에는 비즈니스 로직이 `IntervalWindow`에는 UI 로직이 들어가있다. 

```javascript
// 도메인 클래스 ( )
class Interval extend Observable {
  constructor(){
    this._end
  }

  getEnd() {
    return this._end
  }

  setEnd(value) {
    this._end = value
    this.setChanged()
    this.notifyObservers()
  }
}

// IntervalWindow 클래스 안에는 다음과 같이 넣자.
// this._subject //( Inverval 의 인스턴스를 담고있을 것이다. )

// 위 상황처럼 구현을 하려면 IntervalWindow 클래스에 Observer 클래스를 상속 구현하게 만들어야 한다. 

class IntervalWindow extends Observer {

  constructor () {
    this._endFieldElem
    this._subject = new Interval()
    this._subject.addObserver(this)
    update(_subject, null)
  }

  endFieldFocusLost(event) {
    this.setEnd(this._endFieldElem.value)

    if(isNotInteger(this._endFieldElem.value)) this._endFieldElem.value = 0
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

