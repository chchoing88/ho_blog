---
title: (리팩토링) 메서드 호출 단순화
date: "2019-04-15T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript 로 전환하였습니다.

객체에서 가장 중요한 것은 인터페이스다. 이해와 사용이 쉬운 인터페이스를 작성하는 기술이야 말로 좋은 객체지향 소프트웨어 개발에 꼭 필요하다.

## 메서드 변경

메서드명을 봐도 기능을 알 수 없을땐 메서드명을 직관적인 이름으로 바꾸자.

중요한 부분은 복잡한 과정을 여러 작은 메서드로 잘게 쪼개는 것이다. 또한 메서드 명을 잘 지어야한다.
메서드명만 봐도 그 메서드의 의도를 한눈에 알 수 있어야 한다.
메서드 기능을 설명하기 위해 넣는 주석을 떠올린 후 그 주석을 메서드명으로 바꾸면 이러한 메서드명을 쉽게 정할 수 있다.

### 예제

전화번호를 가져오는 메서드는 다음과 같다.

```javascript
getTelephoneNumber() {
  return `( ${this._officeAreaCode} ) ${this._officeNumber}`
}
```

앞의 메서드명을 `getOfficeTelephoneNumber`로 변경해야 한다고 가정하자. 우선 새 매서드를 작성하고 위의 메서드 내용을 새로 작성한 메서드로 복사하자.
그리고 원본 메서드를 다음과 같이 새 메서드를 호출하게 수정하자.

```javascript
class Person {
  getTelephoneNumber() {
    this.getOfficeTelephoneNumber()
  }

  getOfficeTelephoneNumber() {
    return `( ${this._officeAreaCode} ) ${this._officeNumber}`
  }
}
```

이제 원본 메서드 호출 부분을 찾아서 새 메서드 호출로 바꾸자. 모두 수정했으면 원본 메서드를 삭제해도 된다.

## 매개변수 추가

메서드가 자신을 호출한 부분의 정보를 더 많이 알아야 할 땐객체에 그 정보를 전달할 수 있는 매개변수를 추가하자.

기존 매개변수 세트를 살펴보자.

* 그 객체 중 하나에 필요한 정보를 요청할 수 있나?
* 그럴수 없다면 필요한 정보를 가져오는 메서드를 그런 객체에 추가하는것이 합리적인가?
* 필요한 정보는 무슨 용도로 사용되는가?
* 그 정보 이용 기능이 해당 정보가 들어있는 다른 객체에 있어야 하나?

기존 매개변수 세트를 살펴보면서 새 매개변수를 추가하면 어떻게 될지 생각해보자.

## 매개변수 삭제

메서드가 어떤 매개변수를 더 이상 사용하지 않을 땐 그 매개변수를 삭제하자.

재정의 메서드에 주의해야한다. 이런 상황에서 그 메서드의 다른 재정의 메서드에서 매개변수가 사용되진 않는지 살펴봐야한다.

## 상태 변경 메서드와 값 반환 메서드를 분리

값 반환 기능과 객체 상태 변경 기능이 한 메서드에 들어 있을 땐 질의 메서드와 변경 메서드로 분리하자.

값을 반환하는 모든 메서드는 눈에 띄는 부작용이 없어야 한다는 규칙을 따르는 것이 좋다.
값을 반환하는 메서드가 있는데 그 메서드에 부작용이 있다면 상태 변경 부분과 값 반환 부분을 별도의 메서드로 각각 분리해야 한다.

흔히 사용되는 최적화 방법은 반복되는 호출 성능을 개선하고자 필드에 들어있는 반환 값을 캐시에 저장하는 방식이다.
이렇게 하면 객체의 상태가 캐시를 통해 변경되지만, 그 변경사항이 눈에 띄지 않는다. 연속되는 어떠한 질의라도 항상 같은 결과를 반환하게 된다.

### 예제

보안 시스템의 침입자가 이름을 알려주고 경고 메세지를 보내는 함수는 다음과 같다. 이 함수의 규칙은 침입자가 둘 이상일 때도 경고가 한번만 송신되어야 한다는 점이다.

```javascript
foundMiscreant(people=[]) {
  for(let i = 0; i< people.length; i++) {
    if(people[i].equals('Don')) {
      sendAlert()
      return 'Don'
    }

    if(people[i].equals('John')) {
      sendAlert()
      return 'John'
    }
  }

  return ''
}

// 위 메서드를 호출하는 메서드는 다음과 같다.

checkSecurity(people=[]) {
  const found = foundMiscreant(people)
  someLaterCode(found)
}
```

위 `foundMiscreant` 메서드에서 값 반환 코드를 상태 변경 코드와 분리하려면 우선 변경 메서드와 같은 값을 반환하되 부작용이 없는 적절한질의 메서드를 다음과 같이 작성하자.

```javascript
foundPerson(people=[]) {
  for(let i = 0; i< people.length; i++) {
    if(people[i].equals('Don')) {
      return 'Don'
    }

    if(people[i].equals('John')) {
      return 'John'
    }
  }
  return ''
}

checkSecurity(people=[]) {
  foundMiscreant(people) // 변경 메서드
  const found = foundPerson(people) // 값 반환 메서드
  someLaterCode(found)
}
```

`foundMiscreant` 메서드는 아무것도 반환하지 않는 메서드로 만들자. 그리고 `foundMiscreant` 이 메서드 네이밍을 `sendAlert` 로 변경중복되는 코드 발생도 알고리즘 전환을 적용하자.

```javascript
// 상태 변경 메서드
// foundMiscreant -> sendAlert
sendAlert(people=[]) {

  // 중복코드 발생
  // for(let i = 0; i< people.length; i++) {
  //   if(people[i].equals('Don')) {
  //     sendAlert()
  //     return
  //   }

  //   if(people[i].equals('John')) {
  //     sendAlert()
  //     return
  //   }
  // }
  if(! this.foundPerson(people).equals('')) {
    sendAlert()
  }
}

foundPerson(people=[]) {
  for(let i = 0; i< people.length; i++) {
    if(people[i].equals('Don')) {
      return 'Don'
    }

    if(people[i].equals('John')) {
      return 'John'
    }
  }
  return ''
}

checkSecurity(people=[]) {
  foundMiscreant(people) // 변경 메서드
  const found = foundPerson(people) // 값 반환 메서드
  someLaterCode(found)
}
```

## 메서드를 매개변수로 전환

여러 메서드가 기능은 비슷하고 안에 든 값만 다를 땐 서로 다른 값을 하나의 매개변수로 전달받는 메서드를 하나 작성하자.

여러 메서드를 대체할 수 있는 매개변수 메서드를 작성하자.

기능은 비슷하지만 몇가지 값에 따라 결과가 달라지는 메서드가 여러 개 있을때 각 메서드를 전달된 매개변수에 따라 다른 작업을 처리하는 하나의 메서드로 만들면 편리하다.
이렇게 수정하면 중복코드가 없어지고 매개변수 추가를 통해 다양한 것을 처리할 수 있어서 유연하다.

### 예제

간단한 예제는 다음과 같다

```javascript
class Employee {
  tenPercentRaise() {
    this.salary *= 1.1
  }

  fivePercentRaise() {
    this.salary *= 1.05
  }

  // 하나로 만들자.
  raise(factor) {
    this.salary *= 1 + factor
  }
}
```

조금 더 복잡한 예제

```javascript
baseCharge() {
  let result = Math.min(lastUsage(), 100) * 0.03
  if(lastUsage() > 100) {
    result += (Math.min(lastUsage(), 200) - 100) * 0.05
  }
  if(lastUsage() > 200) {
    result += (lastUsage() -200) * 0.07
  }

  return new Dollars(result)
}
```

다음과 같이 수정하자.

```javascript
baseCharge() {
  let result = Math.min(lastUsage(), 100) * 0.03
  // if(lastUsage() > 100) {
  //   result += (Math.min(lastUsage(), 200) - 100) * 0.05
  // }
  result += this.usageInRange(100,200) * 0.05
  // if(lastUsage() > 200) {
  //   result += (lastUsage() -200) * 0.07
  // }
  result += this.usageInRange(200, Number.MAX_VALUES) * 0.07

  return new Dollars(result)
}

usageInRange(start, end) {
  if( lastUsage() > start) return Math.min(lastUsage(), end) - start
  else return 0
}
```

매개변수로 전달받을 수 있는 몇 개의 값을 기준으로 반복되는 코드를 찾는 것이 요령이다.

## 매개변수를 메서드로 전환

매개변수로 전달된 값에 따라 메서드가 다른 코드를 실행할 땐 그 매개변수로 전달될 수 있는 모든 값에 대응하는 메서드를 각각 작성하자.

이 기법은 일반적으로 한 매개변수의 값이 여러 개가 될 수 있을때 조건문 안에서 각 값을 검사하여 다른 기능을 수행하는 메서드에 적용된다.
호출하는 부분은 매개변수에 값을 지정하여 무엇을 수행할지 판단해야 하므로, 여러 메서드를 작성하고 조건문은 없애는게 좋다.

### 예제

전달받은 매개변수를 토대로 Employee 의 하위 클래스를 작성하면 다음과 같다. 이런 형태의 코드는 주로 생성자를 팩토리 메서드로 전환을 실시하면 얻어진다.

```javascript
class Employee {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  static create(type) {
    switch (type) {
      case ENGINEER:
        return new Engineer()
      case SALESMAN:
        return new Salesman()
      case MANAGER:
        return new Manager()
      default:
    }
  }
}
```

위 상황에서 메서드는 팩토리 메서드라서 생성자를 조건문을 재정의로 전환 기법을 적용할 수 없다. 왜냐하면 객체를 아직 작성하지 않았기 때문이다.

```javascript
class Employee {
  static create(type) {
    // 이렇게 호출이 되고 해당 타입에 따라 실행하는 로직은 하위 클래스로 빼두어야 하는데
    // Employee.create() 를 호출할 상황에서는 Employtee 내부에 this._type이라는 객체 즉, 직업군에 해당하는 객체를
    // 따로 생성하지 않았기 때문에 조건문을 재정의 기법을 사용하기가 어렵다.
    this._type.create()
  }
}
```

새 하위 클래스가 별로 많지 않을 것 같으므로 명시적 인터페이스가 적절하다.

```javascript
class Employee {
  static createEngineer() {
    return new Engineer()
  }

  static createSalesman() {
    return new Salesman()
  }

  static createManager() {
    return new Manager()
  }
}
```

위 처럼 작성하면 `create` 메서드는 삭제가능하고 상수들 역시 삭제 가능하다.
원본 `create` 메서드를 호출하는 부분을 다음과 같이 수정하자.

```javascript
// as-is
const kent = Empolyee.create(ENGINEER)
// to-be
const kent = Empolyee.createEngineer()
```

## 객체롤 통째로 전달

객체에서 가져온 여러 값을 메서드 호출에서 매개변수로 전달할 땐 그 객체를 통째로 전달하게 수정하자.

객체가 한 객체에 든 여러 값을 메서드 호출할 때 매개변수로 전달하고 있다면 이 리팩토링 기법을 적용해야 한다.
이럴 땐 호출된 객체가 나중에 새 데이터 값을 필요로 할 때마다 이 메서드를 호출하는 모든 부분을 찾아서 수정해야 한다는 문제가 있다.

객체를 통째로 전달하는 방식에도 단점은 있다. 값을 전달할 때 호출되는 객체가 그 값들에 의존하게 되지만 값이 추출된 객체에는 의존하지 않게 된다는 점이다.
통 객체를 전달하면 통 객체와 호출된 객체가 서로 의존하게 된다.

호출하는 객체가 자체의 데이터 값 여러개를 매개변수로 전달하는 코드를 흔히 보게 된다. 이럴 땐 적절한 속성 접근 메서드가 있고 의존성에 대한 걱정이 없다면,
호출하면서 여러개의 데이터 값 대신 this 를 전달하면 된다.

### 예제

하루 동안의 최고기온과 최저기온을 기록하는 Room 객체는 다음과 같다. 이 온도 범위를 미리 정의한 난방 계획의 온도 범위와 비교해야한다.

```javascript
class Room {
  withinPlan(plan) {
    const low = this.daysTempRange().getLow()
    const high = this.daysTempRange().getHigh()
    return plan.withinRange(low, high)
  }
}

class HeatingPlan {
  constructor() {
    this._range
  }
  // 범위 정보를 low, high 개개인으로 넘기고 있다.
  withinRange(low, high) {
    return low >= this._range.getLow() && high <= this._range.getHigh()
  }
}
```

범위 정보를 일일이 전달할 것이 아니라 범위 객체를 통째로 전달하면 된다.

```javascript
class Room {
  withinPlan(plan) {
    // HeatingPlan
    // const low = this.daysTempRange().getLow()
    // const high = this.daysTempRange().getHigh()
    return plan.withinRange(this.daysTempRange())
  }
}

class HeatingPlan {
  constructor() {
    this._range = new TempRange(10, 30)
  }

  withinRange(roomRange) {
    // TempRange
    // return (low >= this._range.getLow() && high <= this._range.getHigh())
    return this._range.includes(roomRange)
  }
}

class TempRange {
  includes(arg) {
    // TempRange
    return arg.getLow() >= this.getLow() && arg.getHigh() <= this.getHigh()
  }
}
```

## 매개변수 세트를 메서드로 전환

객체가 A 메서드를 호출해서 그 결과를 B 메서드에 매개변수로 전달하는데,
결과를 매개변수로 받는 B 메서드도 직접 A 메서드를 호출할 수 있을 땐매개변수를 없애고 A 메서드를 B 메서드가 호출하게 하자.

전달할 매개변수를 줄이려면 같은 계산을 수신 메서드도 할 수 있는지 검사해야 한다.
객체가 자신의 메서드를 호출하지만 호출한 메서드의 매개변수가 계산에 전혀 사용되지 않는다면,
그 계산을 별도의 메서드로 만들고 매개변수를 삭제할 수 있다. 호출하는 객체를 참조하는 다른 객체에 있는 메서드를 호출할 떄도 마찬가지다.

### 예제

할인 주문 예제이다.

```javascript
getPrice() {
  const basePrice = this._quantity * this._itemPrice
  let discountLevel
  // 할인 등급 계산 부분
  if(this._quantity > 100) discountLevel = 2
  else discountLevel = 1
  // 할인 등급 계산 부분
  const finalPrice = this.discountePrice(basePrice, discountLevel)
  return fianlPrice
}

discountePrice(basePrice, discountLevel) {
  if(discountLevel === 2) return basePrice * 0.1
  else return basePrice * 0.05
}
```

할인 등급 계산 부분을 메서드(`getDiscountLevel`)로 추출하자. 그리고 임시변수인 `discountLevel`를 삭제시켜 보자.

```javascript
getPrice() {
  const basePrice = this._quantity * this._itemPrice
  // getDiscountLevel 생성 및 임시변수 삭제
  // this.getDiscountLevel 계산을 this.discountPrice 메서드도 할 수 있다.
  // let discountLevel = this.getDiscountLevel()

  // const finalPrice = this.discountePrice(basePrice, discountLevel)
  const finalPrice = this.discountePrice(basePrice)
  return fianlPrice
}

getDiscountLevel() {
  if(this._quantity > 100) return 2
  else 1
}

discountePrice(basePrice) {
  // discountLevel 변수보단 직접 쓰게 만들자.
  if(this.getDiscountLevel() === 2) return basePrice * 0.1
  else return basePrice * 0.05
}
```

`getBasePrice()` 메서드를 만들어서 나머지 `basePrice` 변수도 없애보자.

```javascript
getPrice() {
  // return this.discountePrice()
  // 메서드 내용이 간단하기 때문에 discountePrice 메서드를 따로 사용 안했다.
  if(this.getDiscountLevel() === 2) return this.getBasePrice() * 0.1
  else return this.getBasePrice() * 0.05
}

getDiscountLevel() {
  if(this._quantity > 100) return 2
  else 1
}

// discountePrice(basePrice) {
//   if(this.getDiscountLevel() === 2) return this.getBasePrice() * 0.1
//   else return this.getBasePrice() * 0.05
// }

getBasePrice() {
  return this._quantity * this._itemPrice
}
```

## 매개변수 세트를 객체로 전환

여러 개의 매개변수가 항상 붙어 다닐 땐 그 매개변수들을 객체로 바꾸자.

특정 매개변수들이 늘 함께 전달되는 경우를 흔히 볼 수 있다. 즉, 항상 쌍으로 붙어다니는 매개변수가 있을 것이다. 이럴땐 여러 메서드가 한 클래스나 여러 클래스에서 이 매개변수 집합을 사용할 가능성이 있다.
이런 클래스들은 데이터 뭉치이므로 그 모든 데이터가 든 객체로 바꿀 수 있다.
데이터를 그룹으로 묶으려면 이 매개변수들을 객체로 바꾸는 것이 좋다. 이 리팩토링 기법을 실시하면 매개변수 세트가 짧게 줄어서 좋다. 새 객체에 정의된 속성 접근 메서드로 인해 코드의 일관성도 개선되고, 결과적으로 코드를 알아보거나 수정하기도 쉬워진다.

더불어 매개변수를 한 덩이로 만들면 기능을 새 클래스로 옮길 수 있어서 훨씬 좋다. 메서드 안에 매개변수 값에 대한 공통적인 조작을 넣는 경우가 많다. 이 동작을 새 객체로 옮기면 상당량의 중복 코드를 없앨 수 있다.

### 예제

Entry 클래스는 단순히 데이터 클래스다.
Account 클래스엔 입금액 컬렉션이 들어 있고, 두 날짜 사이의 계좌 입출금 현황을 알아내는 메서드가 들어 있다.

```javascript
class Entry {
  constructor(value, chargeDate) {
    this._value = value
    this._chargeDate chargeDate
  }

  getDate() {
    return this._chargeDate
  }

  getValue() {
    return this._value
  }
}

class Account {
  constructor(){
    this._entries
  }

  getFlowBetween(start, end) {
    let result = 0
    const e = this._entries.elements()
    for(let p of e) {
      const each = p.value
      if(each.getDate().equals(start) || each.getDate().equals(end) || (each.getDate().after(start) && each.getDate().before(end))) {
        result += each.getValue()
      }
    }
    return result
  }
}

// 클라이언 코드
const flow = anAccount.getFlowBetween(startDate, endDate)
```

대체할 매개변수 그룹에 해당하는 새 클래스를 작성하고, 그 클래스를 변경 불가로 만들자.
그 클래스는 범위를 처리하는 단순 데이터 클래스를 선언하자.
`DateRange` 클래스는 변경불가로 만들어야 한다.

```javascript
class DateRange {
  constructor(start, end) {
    this._start = start
    this._end = end
  }

  getStart() {
    return this._start
  }

  getEnd() {
    return this._end
  }
}
```

이 `DateRange` 클래스를 이용하면 다음과 같이 고칠 수 있다.

```javascript
class Entry {
  //위 코드와 동일
}

class DateRange {
  constructor(start, end) {
    this._start = start
    this._end = end
  }

  getStart() {
    return this._start
  }

  getEnd() {
    return this._end
  }

  includes(arg) {
    return (
      arg.equals(this._start ||
      arg.equals(this._end) ||
      (arg.after(this._start) &&
        arg.before(this._end))
    )
  }
}

class Account {
  constructor() {
    this._entries
  }

  // DateRange range 매개변수
  getFlowBetween(range) {
    let result = 0
    const e = this._entries.elements()
    for (let p of e) {
      const each = p.value
      // 조건문 안쪽 코드도 DateRange 코드쪽으로 보내자.
      // 메서드 추출과 메서드 이동을 적용하면 코드가 다음과 같아진다.
      if (range.includes(each.getDate())) {
        result += each.getValue()
      }
    }
    return result
  }
}

// 클라이언 코드
const flow = anAccount.getFlowBetween(new DtateRange(startDate, endDate))
```

## 쓰기 메서드 제거

생성할 때 지정한 필드 값이 절대로 변경되지 말아야 할 땐 그 필드를 설정하는 모든 쓰기 메서드를 삭제하자.

쓰기 메서드가 있다는건 필드 값을 변경할 수 있다는 얘기다. 객체가 생성된 후에는 필드가 변경되지 말아야 한다면, 쓰기 메서드를 작성하지 않아야 한다.
그렇게 하면 확실히 의도가 달성되고 필드가 수정될 가능성을 차단할 수 있다.

java 에서는 final 과 private 키워드들이 존재하지만 자바스크립트에서는 존재하지 않기에 네이밍 규칙으로써 이를 표현해본다.

### 예제

간단한 예를 들어보자. 생성할때 지정한 필드 값이 절대로 변경되지 말아야 한다.

```javascript
class Account {
  constructor(id) {
    this.setId(id)
  }

  setId(id) {
    this._id = id
  }
}
```

위와 같은 코드가 있다고 할때 `this._id`는 private 한 변수이다. 이를 절대 변하지 않도록 상수화 시킨다면

```javascript
// set 메서드를 만들어 두지 않는다.
function accountContainer() {
  let ID
  return class Account {
    constructor(id) {
      ID = id
    }

    getId() {
      return ID
    }
  }
}
```

문제는 여기서 매개변수로 계산을 수행할때 이다. 계산식이 복잡하거나 그럴땐 별도의 메서드를 두고 호출해야한다.
이때 메서드 이름은 의도가 확살히 드러나게 정해야 한다.

```javascript
function accountContainer() {
  let ID
  return class Account {
    constructor(id) {
      initializeId(id)
    }

    getId() {
      return ID
    }

    initializeId(id) {
      ID = 'ZZ' + id
    }
  }
}
```

이번에는 하위클래스가 상위 클래스의 private 변수를 초기화 하는 예이다.

```javascript
function accountContainer() {
  let ID
  return class Account {
    constructor(id) {
      initializeId(id)
    }

    getId() {
      return ID
    }

    initializeId(id) {
      ID = 'ZZ' + id
    }
  }
}

const Acc = accountContainer()

class interestAccount extends Acc {
  constructor(id, rate) {
    // 상위 클래스 생성자 이용.
    super(id)

    // 또는 관련 메서드 이용.
    this.initializeId(id)

    this._interest = rate
  }
}
```

## 메서드 은폐

메서드가 다른 클래스에 사용되지 않을 땐 그 메서드의 반환 타입을 private 로 만들자.
다른 클래스가 그 메서드를 사용한다면 개방도를 높여야 한다. 하지만 메서드의 개방도를 어떨 때 낮춰야 할지를 판단하기는 비교적 어렵다.

javascript 에서는 메서드도 \_(underbar)를 이용해서 private 를 표시해두자.

## 생성자를 팩토리 메서드로 전환

객체를 생성할 때 단순환 생성만 수행하게 해야 할 땐 생성자를 팩토리 메서드로 교체하자.

이 리팩토링을 해야할 가장 확실한 상황은 분류 부호를 하위클래스로 바꿀 때 발생한다. 분류 부호를 사용해 작성한 객체가 있는데 현 시점에서 하위클래스가 필요해졌다.
어느 하위 클래스를 사용할지는 분류 부호에 따라 달라진다. 하지만 생성자는 요청된 객체의 인스턴스 반환만 할 수 있다. 따라서 생성자를 팩토리 메서드로 바꿔야 한다.

생성자가 너무 제한되는 다른 상황에서도 팩토리 메서드를 사용할 수 있다. 팩토리 메서드는 값을 참조로 전환을 실시하기 위해 꼭 필요하다.
팩토리 메서드는 매개변수의 숫자와 타입을 벗어나는 다른 생성 동작을 나타낼 때도 사용할 수 있다.

### 예제

사원 급여 시스템 예제를 다시 보자.

```javascript
class Employee {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  constructor(type) {
    this._type = type
  }
}
```

각 분류 부호에 해당하는 Employee 클래스의 하위 클래스를 작성하려 한다. 이를 위해 팩토리 메서드를 작성한다.

```javascript
class Employee {
  static create(type) {
    return new Employee(type)
  }
}

// 클라 코드
const eng = Employee.create(Employee.ENGINEER)
```

### 예제: 문자열을 사용하는 하위클래스 작성

나중에 분류 부호를 하위클래스로 전환을 적용해서 분류 부호를 Employee 의 하위클래스로 전환할 경우, 팩토리 메서드를 사용하면 이 하위클래스를 클라이언트가볼 수 없게 은폐할 수 있다.

한가지 단점은 switch 문이 생긴다는 것이다.

```javascript
class Employee {
  static create(type) {
    switch (type) {
      case ENGINEER:
        return new Engineer()
      case SALESMAN:
        return new Salesman()
      case MANAGER:
        return new Manager()
      default:
    }
  }
}
```

이럴 땐 문자열을 받아서 자동으로 객체를 생성해주는 녀석을 하나 만들어서 사용할 수 있을 듯 싶다.

```javascript
class Employee {
  static create(name) {
    try {
      // 사실 자바스크립트에선 이런 메서드가 없다.
      return Class.forName(name).newInstance()
    } catch (e) {
      throw new Error('')
    }
  }
}

// as-is
Employee.create(ENGINEER)
// to-be
Employee.create('Engineer')
```

위와 같은 방법은 오타로 인한 에러가 발생할 수 있고 하위 클래스 이름이 클라이언트에 노출된다는 것이다.

### 예제: 메서드를 사용하는 하위클래스 작성

이 방법은 변하지 않는 두세 개의 하위클래스만 있을 때 사용가능하다.

```javascript
class Person {
  static createMale() {
    return new Male()
  }

  static createFemale() {
    return new Female()
  }
}

const kent = Person.createMale()
```

## 에러 부호를 예외 통지로 교체

메서드가 에러를 나타내는 특수한 부호를 반환할 땐 그 부호 반환 코드를 예외 통지 코드로 바꾸자.

에러 코드를 만났을 때 프로그램을 중단되게 할 수 있다. 하지만 이것은 비행기를 놓쳤다고 자살하는 것이나 다를 바 없다.
물론 소프트웨어를 중단시키는 방식에도 장점은 있다. 프로그램 충돌이 사소하고 사용자도 인내심이 많아면 프로그램을 중단시키는 방법이 괜찮지만, 그보다 중요한 프로그램이라면좀 더 확실한 방법이 필요하다.

문제는 프로그램에서 에러를 찾는 코드 부분에 반드시 그 에러를 처리하는 기능이 들어 있는 것은 아니란 점이다.
에러 찾기 루틴은 에러를 발견하면 자신을 호출한 부분에 그것을 알리며, 호출한 부분이 그 에러를 상위 호출 코드로 보낼 수도 있다.

예전 시스템은 과거 어떤 루틴의 성공이나 실패를 표시하기 위해 반환 코드를 사용하는데 (ex, -1 , 0)
예외는 에러 처리를 일반적인 처리와 확실히 분리시키기 때문에 좋다. 예외와 일반로직의 관심사가 분리되는 것이다.

호출 전에 호출하는 부분이 조건을 검사해야 한다면 미확인 예외로 하자.
예외가 확인된 것이면 새 예외를 작성하거나 기존 예외를 사용하자.

__개발자의 실수에 의해 발생되는 예외__ 들은 __미확인 예외__ 들이다. 즉, 컴파일러가 체크되지 않는 예외를 말한다. 예를 들어 0으로 나눠서 에러가 발생한다거나 배열범위 등이 있겠다. 이런것들은 개발자가 조금만 더 신경쓰면 예외가 발생하지 않는 예외들이다. <br/>
__사용자의 실수와 같은 외적인 요인에 의해 발생하는 예외__ 들은 __확인된 에러__ 들이다. 컴파일러가 체크하는 예외를 말한다. 예를들어 존재하지 않는 파일의 이름을 사용자가 입력할때 발생한다. 

checked 예외(`확인 예외`) 는 컴파일 단계에서 확인되며 반드시 처리해야 하는 예외입니다.
Unchecked 예외(`미확인 예외`) 는 실행 단계에서 확인되며 명시적인 처리를 강제하지는 않는 예외입니다.

### 예제

```javascript
class Account {
  withdraw(amount) {
    if (amount > this._balance) {
      return -1
    } else {
      this._balance -= amount
      return 0
    }
  }
}
```

위 코드가 예외를 사용하게 수정하려면 우선 확인된 예외와 미확인 예외 중 어느것을 사용할지 정해야 한다.
이 결정은 출금 전의 잔액 검사하는 기능을 호출 코드가 담당하는지 출금 메서드가 담당하는지에 따라 달라진다.

호출부의 책임인 경우에는 인출하기 전에 잔액 검사(미확인 예외)를 인출 루틴의 책임인 경우에는 인터페이스에 예외를 선언한다.(확인 예외)
미확인 예외라면, 호출하는 부분에서 메서드를 호출하기 전에 검사를 한다. 
확인된 예외라면, 호출하는 부분에서 try 블록안에서 메소드를 호출하도록 조정한다. 

여기서 계좌 잔액 검사가 호출 부분에서 이뤄진다면 withdraw 메서드에 잔액보다 큰 금액을 전달하면서 호출하는 건 프로그래밍 에러다.
즉 호출하는 사람, 사용하는 사람의 에러다. 이 프로그래밍 에러, 즉 버그는 __미 확인 예외__ 를 사용해야 한다.
잔액검사가 withdraw 메서드에서 이뤄진다면 예외를 반드시 인터페이스 안에 선언해야 한다.

### 예제: 미확인 예외

*미확인 예외를 사용* 하는 메서드를 사용하는 경우
호출하는 쪽에서 검사를 담당할 것이다. 반환 코드를 사용하는 부분이 없어야 한다. 그건 프로그래머 에러이기 때문이다.

```javascript
// 잔액 검사를 호출하는 부분에서 이뤄진다.
// as-is
if (account.withdraw(amount) === -1) {
  handleOverdrawn()
} else {
  doTheUsalThing()
}

// 위 코드를 다음과 같이 수정해야 한다.
// canWithdraw 메서드로 확인한다.
// to-be
if (!account.canWithdraw(amount)) {
  handleOverdrawn()
} else {
  account.withdraw(amount)
  doTheUsalThing()
}
```

이제 에러코드를 삭제하고 에러 상황에 대한 예외를 통지해야 한다.
기능은 정의에 따른다는 점에서 예외적이므로 다음과 같이 조건 검사에 감시 절을 넣어야 한다.
조건이 특이한 조건이라면 그 조건을 검사해서 조건이 true 일때 반환하는 이런 식의 검사를 감시절 guard clause 이라고 한다.

```javascript
class Account {
  withdraw(amount) {
    // 감시 절
    if (amount > this._balance) throw new Error('액수가 너무 큽니다.')
    this._balance -= amount
  }
}

// 어셜션을 넣어서 한결 정확하게 표현
class Account {
  withdraw(amount) {
    // 감시 절
    Assert.isTrue('잔액이 충분합니다', amount <= this._balance)
    this._balance -= amount
  }

  canWithdraw() {

  }
}

Assert {
  static isTrue(comment, test) {
    if(!test) {
      throw new Error('어셜션 실패' + comment)
    }
  }
}
```

### 예제: 확인된 예외

*확인된 예외를 사용* 하는 메서드에선 처리방법이 약간 다르다. 해당 메서드 사용자로 하여금 에러를 잡도록 유도한다.
메서드를 만들 당시 호출해보지 않은 상태에서 확인되는 예외일때 예외를 발생한다.
`withdraw` 메서드 안쪽에서 검사를 하고 예외를 발생시키기 때문에 호출하는 부분에서는 `try...catch`를 이용해서 예외를 잡아내야 한다.

```javascript
// 새 예외 객체 작성
class BalanceException extends Exception {}

// 호출부분을 다음과 같이 수정하자.
try {
  account.withdraw(amount)
  doTheUsalThing()
} catch(e) {
  handleOverdrawn()
}

// 그 다음 예외를 사용하게 하자.
withdraw() {
  if (amount > this._balance) throw new BalanceException();
  this._balance -= amount
}
```

`미확인 예외`일 땐 호출 부분이 메서드 호출 전에 적절한 검사를 하게 하자.
`확인된 예외`일 땐 호출 부분이 try 절 안에서 메서드를 호출하게 하자.

요즘엔 확인된 예외를 사용하면 OCP(Open Closed Principle)을 위반하게 된다. 메소드에서 확인된 예외를 던졌는데 catch 블록이 세 단계 위에 있다면 그 사이 메소드 선언부를 고쳐야 한다. 이는 캡슐화를 깨버리는 현상이 발생하는 원인이 되기때문에 미확인 예외를 사용하라고 권장함.
최하위 함수를 변경해 새로운 오류를 던진다 -> 선언부에 throws 절 추가 -> 연쇄 수정 발생

결과적으로 최하위 함수에서 던지는 예외를 알아야 하므로 캡슐화가 깨진다.

## 예외 처리를 테스트로 교체

호출 부분에 사전 검사 코드를 넣으면 될 상황인데 예외 통지를 사용했을 땐 호출 부분이 사전 검사를 실시하게 수정하자.

__예외 처리는 예외적 기능, 즉 예기치 못한 에러에 사용해야 한다.__ 예외 처리를 조건문 대용으로 사용해선 안된다.
호출 부분이 메서드를 호출하기 전에 당연히 조건을 검사할 것으로 예상한다면, 개발자는 테스트를 작성해야 하고 호출 부분은 그 테스트를 사용해야 한다.

### 예제

각종 리소스를 관리하는 객체를 사용하겠다. 데이터베이스 접속이 좋은 예다.
리소스 관리 객체는 두개의 리소스 풀이 들어 있다. 하나는 가용 리소스 풀이고 또 하나는 할당 리소스 풀이다.
클라이언트가 리소스를 요청하면 리소스 관리 객체는 리소스를 넘겨주고 가용 풀에 있던 리소스를 할당 풀로 전달한다.

클라이언트가 리소스를 해제하면 관리 객체는 거꾸로 할당 풀의 리소스를 가용 풀로 전달한다.
클라이언트가 리소스를 요청했는데 사용 가능한 리소스가 없다면 관리 객체는 새 리소스를 생성한다.

```javascript
class ResourcePool {
  constructor() {
    this._available // stack
    this._allocated // stack
  }

  getResource() {
    let result
    try {
      result = this._available.pop()
      this._allocated.push(result)
      return result
    } catch (e) {
      result = new Resource()
      this._allocated.push(result)
      return result
    }
  }
}
```

여기서 __리소스 고갈은 예기치 못한 일이 아니므로__ 예외 처리를 사용하면 안된다.

```javascript
class ResourcePool {
  constructor() {
    this._available // stack
    this._allocated // stack
  }

  getResource() {
    let result

    if (this._available.isEmpty()) {
      result = new Resource()
      this._allocated.push(result)
      return result
    } else {
      result = this._available.pop()
      this._allocated.push(result)
      return result
    }
  }
}
```

조건문의 공통 실행 코드 빼내기를 적용한다.

```javascript
class ResourcePool {
  constructor() {
    this._available // stack
    this._allocated // stack
  }

  getResource() {
    let result

    if (this._available.isEmpty()) {
      result = new Resource()
    } else {
      result = this._available.pop()
    }
    this._allocated.push(result)
    return result
  }
}
```
