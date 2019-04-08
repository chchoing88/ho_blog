---
title: 조건문 간결화
date: "2019-04-03T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript 로 전환하였습니다.

## 조건문 쪼개기 (Decompose Conditional)

복잡한 조건문(if-then-else)이 있을땐 if, tehn, eles 부분을 각각 메서드로 빼내자.

```javascript
// bad
if (data.before(SUMMER_START) || data.after(SUMMER_END)) {
  charge = quantity * _winterRate + _winterServiceCharge
} else {
  charge = quantity * _summerRate
}

// good
if (notSummer(date)) {
  charge = winterCharge(quantity)
} else {
  charge = summerCharge(quantity)
}
```

큰 덩어리의 코드를 잘게 쪼개고 각 코드 조각을 용도에 맞는 이름의 메서드 호출로 바꾸면 코드의 용도가 분명히 드러난다.
이 과정을 조건문의 if 절, then 절, else 절 각각에 대해 수행하면 더 큰장점을 얻을 수 있다.

## 중복 조건식 통합 (Consolidate Conditional Expression)

여러 조건 검사식의 결과가 같을 땐 하나의 조건문으로 합친 후 메서드로 빼내자.

서로 다른 여러 개의 조건 검사식이 있는데 조건에 따른 결과가 모두 같을 때가 간혹 있다. 이럴 때는 논리 연산자 AND 와 OR 을 사용해서 여러 조건 검사를 하나로 합쳐야 한다.
조건문을 합쳐야 하는 이유는 두가지 이다.
첫째, 조건식을 합치면 여러 검사를 OR 연산자로 연결해서 실제 하나의 검사 수행을 표현해서 무엇을 검사하는지 더 확실히 이해할 수 있다.
둘째, 이러한 조건식 통합 리팩토링 기법을 실시하면 메서드 추출을 적용할 수 있는 기반이 마련된다.

조건 검사식이 독립적이고 하나의 검사로 인식되지 말아야 할 땐 이방법을 사용하지 말자.

### 예제: 논리합(OR) 연산자

다음과 같은 상태의 코드가 있다.

```javascript
disabilityAmount() {
  if(this._seniority < 2) return 0
  if(this._monthsDisabled > 12) return 0
  if(this._isPartTime) return 0
  // 장애인 공제액 산출
}
```

이럴때 조건문이 여러 개 있고 모두 같은 값 0 을 반환한다. 조건문이 이렇게 순차적일 땐 다음과 같이 논리합 연산자인 ||로 연결한 하나의 조건문으로 만들 수 있다.

```javascript
disabilityAmount() {
  if(this._seniority < 2 || this._monthsDisabled > 12 || this._isPartTime) return 0
  // 장애인 공제액 산출
}
```

이제 조건문을 보면 이 조건이 무엇을 찾으려는 것인지 한눈에 알 수 있게 메서드 추출을 적용하자.

```javascript
disabilityAmount() {
  if(this.isNotEligibleForDisability()) return 0
  // 장애인 공제액 산출
}

isNotEligibleForDisability() {
  return (this._seniority < 2 || this._monthsDisabled > 12 || this._isPartTime)
}
```

### 예제: 논리곱(AND) 연산자

연산자 && 으로도 마찬가지로 여러 조건문을 하나로 연결할 수 있다.

```javascript
if (onVacation()) if (lengthOfService() > 10) return 1
return 0.5
```

이 코드에서 겹친 조건문을 논리곱 연산자로 다음과 같이 연결할 수 있다.

```javascript
if (onVacation() && lengthOfService() > 10) return 1
else return 0.5
```

조건식 안의 루틴이 단순히 조건을 검사해서 값을 반환할 땐 다음과 같이 삼항연산자를 사용해서 그 루틴을 한줄의 return 문으로 만들자.

```javascript
return onVacation() && lengthOfService() > 10 ? 1 : 0.5
```

## 조건문의 공통 실행 코드 뺴내기 (Consolidate Duplicate Conditional Fragments)

조건문의 모든 절에 같은 실행 코드가 있을 땐 같은 부분을 조건문 밖으로 빼자.

### 예제

```javascript
// bad
if (isSpecialDeal()) {
  total = price * 0.95
  send()
} else {
  total = price * 0.98
  send()
}

// good
if (isSpecialDeal()) {
  total = price * 0.95
} else {
  total = price * 0.98
}
send()
```

## 제어 플래그 제거 (Remove Control Flag)

논리 연산식의 제어 플래그 연할을 하는 변수가 있을땐 그 변수를 break 문이나 return 문으로 바꾸자.

### 예제: 간단한 제어 플래그를 break 문으로 교체

```javascript
  checkSecurity(people) {
    let found = false
    for(let i = 0; i < people.length; i++) {
      if(!found) {
        if(people[i].equals('Don')) {
          sendAlert()
          found = true
        }

        if(people[i].equals('John')) {
          sendAlert()
          found = true
        }
      }
    }
  }
```

여기서 제어 플래그는 found 변수에 true 값을 대입하는 부분이 제어 플래그다. 그 부분들을 한번에 한 부분씩 break 문으로 바꾸자.

```javascript
checkSecurity(people) {
  for(let i = 0; i < people.length; i++) {
    if(people[i].equals('Don')) {
      sendAlert()
      break
    }
    if(people[i].equals('John')) {
      sendAlert()
      break
    }
  }
}
```

### 예제: 제어 플래그를 return 문으로 교체

제어 플래그를 결괏값으로 사용하게 변형한 코드는 다음과 같다.

```javascript
  checkSecurity(people) {
    let found = ''
    for(let i = 0; i < people.length; i++) {
      if(!found) {
        if(people[i].equals('Don')) {
          sendAlert()
          found = 'Don'
        }

        if(people[i].equals('John')) {
          sendAlert()
          found = 'John'
        }
      }
    }

    someLaterCode(found)
  }
```

found 는 결과를 나타내기도 하고 제어 플래그 역할도 한다. 이럴땐 found 변수를 알아내는 코드를 메서드로 빼내자.

```javascript
checkSecurity(people) {
  let found = foundMiscreant(people)
  someLaterCode(found)
 }

checkSecurity(people) {
  for(let i = 0; i < people.length; i++) {

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
```

## 여러 겹의 조건문을 감시 절로 전환 (Replace Nested Conditional with Guard Clauses)

메서드에 조건문이 있어서 정상적인 실행 경로를 파악하기 힘들 땐 모든 특수한 경우에 감시 절을 사용하자.

여러 겹의 조건문을 감시 절로 전환기법의 핵심은 강조 부분이다. if-then-else 문을 사용하면 if 절과 else 절의 비중이 동등하다.
따라서 코드를 보는 사람은 if 절과 else 절의 비중이 같다고 판단하게 된다.
그와 달리, 감시 절은 "이것은 드문 경우이니 이 경우가 발생하면 작업을 수행한 후 빠져나와라" 하고 명령한다.
메서드의 이탈점을 하나만 사용해서 더 명확해진다면 그렇게 해야겠지만, 그렇지 않을 때는 굳이 한 개의 이탈점을 고집하지 말자.

### 예제

사망직원, 해고직원, 은퇴직원의 경우 특수 규칙이 적용되는 급여 정산 시스템을 실행한다고 가정하자.

```javascript
getPayAmount() {
  let result
  if(this._isDead) result = deadAmount()
  else {
    if(this._isSeparated) result = separatedAmount()
    else {
      if(this._isRetired) result = retiredAmount()
      else result = normalPayAmount()
    }
  }

  return result
}
```

조건문으로 인해 정상적인 실행 경로를 알기가 쉽지 않다. 이럴 땐 감시 절을 사용하면 코드를 이해하기 쉬워진다.

```javascript
getPayAmount() {
  if(this._isDead) return deadAmount()
  if(this._isSeparated) return separatedAmount()
  if(this._isRetired) return retiredAmount()
  return normalPayAmount()
}
```

### 예제: 조건문을 역순으로 만들기

```javascript
getAdjustedCapital() {
  let result = 0.0
  if(this._capital > 0.0) {
    if(this._intRate > 0.0 && this._duration > 0.0) {
      result = (this._income / this._duration) * ADJ_FACTOR
    }
  }
  return result
}
```

다음과 같이 변형한다.

```javascript
getAdjustedCapital() {
  if(this._capital <= 0.0) return 0.0
  if(this.intRate <= 0.0 || this._duration <= 0.0) return 0.0
  return (this._income / this._duration) * ADJ_FACTOR
}
```

## 조건문을 재정의로 전환 (Replace Conditional with Polymorphism)

객체 타입에 따라 다른 기능을 실행하는 조건문이 있을 땐 조건문의 각 절을 하위클래스의 재정의 메서드 안으로 옮기고, 원본 메서드는 abstract 타입으로 수정하자.

객체 관련 전문용어 중 가장 웅대한 표현은 다형성이다. 재정의의 본질은 타입에 따라 기능이 달라지는 여러 객체가 있을 때 일일이 조건문을 작성하지 않아도 다형적으로 호출되게 할 수 있다는 것이다.
그래서 분류 부호에 따라 다른 코드를 실행하는 switch 문이나 문자열에 따라 다른 코드를 실행하는 it-then-else 문은 객체지향 프로그램에서 별로 사용하지 않는다.

이런 조건문 덩어리가 프로그램의 여러 곳에 있을 때 가장 큰 효과를 볼 수 있다. 새 타입을 추가하려면 모든 조건문을 찾아서 수정해야 한다. 그러나 하위클래스를 사용하면 새 하위클래스를 작성하고 적당한 메서드만 넣으면 된다. 클래스 사용 부분은 그 하위클래스를 알 필요가 없어서 시스템 내부의 의존성이 줄어들고 수정이 쉬워진다.

### 예제

사원 월급 예제를 보자. `분류 부호를 상태/전략 패턴으로 전환` 예제를 참고하자.
Employee 클래스의 payAmount 메서드의 switch 문을 리펙토링 해보자.

```javascript
class Employee {
  // 여기에 정의 내렸던 분류 부호 정의를 삭제
  // EmployeeType 클래스 참조를 넣자.
  // ...
  getType() {
    // 이제 _type은 EmployeeType의 인스턴스다.
    return this._type.getTypeCode()
  }

  setType(type) {
    this._type = EmployeeType.newType(type)
  }

  // 이제 payAmount 메서드에 조건문을 재정의로 전환 기법을 적용할 수 있다.
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
```

위 코드에서 `payAmount` 메서드를 `EmployeeType` 클래스로 옮기고 Employee 클래스의 데이터가 필요하므로 Employee 클래스를 인자로 전달해야한다.

```javascript
class Employee {
  payAmount() {
    return this._type.payAmount(this)
  }

  getType() {
    // 이제 _type은 EmployeeType의 인스턴스다.
    return this._type.getTypeCode()
  }

  setType(type) {
    this._type = EmployeeType.newType(type)
  }
}

class EmployeeType {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  payAmount(emp) {
    // emp는 Employee 인스턴스
    switch (this.getTypeCode()) {
      case ENGINEER:
        return emp.getMonthlySalary()
        break
      case SALESMAN:
        return emp.getMonthlySalary() + emp.getCommission()
        break
      case MANAGER:
        return emp.getMonthlySalary() + emp.getBonus()
        break
      default:
    }
  }
}
```

위의 코드에서 `payAmount`메서드를 정리해보자. 하나씩 case 문의 ENGINEER 절 코드를 `Engineer` 클래스로 코드를 복사하자.
그리고 `EmployeeType` 클래스에 payAmount 메서드는 추상 메서드로 선언하자.

```javascript
class Employee {
  payAmount() {
    return this._type.payAmount(this)
  }

  getType() {
    // 이제 _type은 EmployeeType의 인스턴스다.
    return this._type.getTypeCode()
  }

  setType(type) {
    this._type = EmployeeType.newType(type)
  }
}

class EmployeeType {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  payAmount(emp) {} // 추상메서드로 남겨두자.

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

class Engineer extends EmployeeType {
  getTypeCode() {
    return EmployeeType.ENGINEER
  }

  payAmount(emp) {
    // emp는 Employee 인스턴스
    return emp.getMonthlySalary()
  }
}

class Salesman extends EmployeeType {
  getTypeCode() {
    return EmployeeType.ENGINEER
  }

  payAmount(emp) {
    // emp는 Employee 인스턴스
    return emp.getMonthlySalary() + emp.getCommission()
  }
}

class Manager extends EmployeeType {
  getTypeCode() {
    return EmployeeType.ENGINEER
  }

  payAmount(emp) {
    // emp는 Employee 인스턴스
    return emp.getMonthlySalary() + emp.getBonus()
  }
}
```

## Null 검사를 널 객체에 위임 (Introduce Null Object)

null 값을 검사하는 코드가 계속 나올 땐 null 값을 널 객체로 만들자.

### 예제

공공설비 업체는 공공 설비 서비스를 이용하는 주택가와 아파트 단지 등의 지역을 파악하고 있다. 한 지역에 있는 고객은 반드시 하나다.

```javascript
class Site {
  constructor() {
    this._customer
  }

  getCustomer() {
    return this._customer
  }
}

class Customer {
  getName() {} // return
  getPlan() {} // return BillingPlan 객체
  getHistory() {} // return PaymentHistory 객체
}

class PaymenHistory {
  getWeeksDelinquentInLastYear() {}
}

// 위와 같은 코드가 있을때 클라이언트는 다음과 같은 데이터에 접근가능하다.
// 하지만 고객이 없는 지역도 있기에 Customer 클래스를 사용하는 코드에 다음과 같은 null 처리를 해야한다.

const customer = site.getCustomer()
let plan

if (customer === null) plan = BillingPlan.basic()
else plan = customer.getPlan()

// ...

let customerName
if (customer === null) customerName = 'occupant'
else customerName = customer.getName()

// ...

let weeksDelinquent
if (customer === null) weeksDelinquent = 0
else weeksDelinquent = customer.getHistory().getWeeksDelinquentInLastYear()
```

이때 모든 부분에서 null 검사해서 null 을 발견할 때마다 같은 작업을 수행해야 할 수도 있다. 따라서 널 객체가 필요하다.

```javascript
class NullCustomer extends Customer {
  isNull() {
    return true
  }
}

class Customer {
  isNull() {
    return false
  }

  // 팩토리 메서드
  static newNull() {
    return new NullCustomer()
  }
}

// 이때부터 null이 예상될 때마다 새 널 객체를 반환하고 foo === null 형태의 null 검사 코드를
// foo.isNull() 형태의 코드로 수정하자.

class Site {
  getCustomer() {
    return this._customer === null ? Cusomer.newNull() : this._customer
  }
}

// 클라이언트는 아래와 같이 코드를 작성한다.
const customer = site.getCustomer()
let plan

if (customer.isNull()) plan = BillingPlan.basic()
else plan = cusomter.getPlan()

// ...

let customerName
if (customer.isNull()) customerName = 'occupant'
else customerName = customer.getName()

// ...

let weeksDelinquent
if (customer.isNull()) weeksDelinquent = 0
else weeksDelinquent = customer.getHistory().getWeeksDelinquentInLastYear()
```

아직 장점이 와 닿지 않는다. 그 장점은 `NullCustomer`로 기능을 옮기고 조건문을 삭제해야 느낄 수 있다. 이 과정은 한번에 하나씩 실시하면 된다.
`NullCustomer` 클래스에 적합한 name 읽기 메서드를 추가하자.

```javascript
class NullCustomer {
  isNull() {
    return true
  }

  getName() {
    return 'occupant'
  }

  setPlan(arg) {}

  getHistory() {
    return PaymentHistory.newNull() // 여기서 아래 NullPaymentHistory 객체를 반환.
  }
}
// 이렇게 작성하면 클라이언트 코드에서 다음과 같이 바뀔 수 있다.
// 조건문 코드는 삭제해도 된다. 한줄로만 작성이 가능하다.
customerName = customer.getName()

// 변경 메서드들도 다음과 같이 처리할 수 있다.
if (!customer.isNull()) {
  customer.setPlan(BillingPlan.special())
}
// 위와 같은 코드는 아래처럼 바꿀 수 있다.
customer.setPlan(BillingPlan.special())

// 아래와 같은 코드는 어떻게 하면 처리 할 수 있을까?
let weeksDelinquent
if (customer.isNull()) weeksDelinquent = 0
else weeksDelinquent = customer.getHistory().getWeeksDelinquentInLastYear()

// NullPaymentHistory 라는 클래스를 만든다.
class NullPaymentHistory extends PaymentHistory {
  getWeeksDelinquentInLastYear() {
    return 0
  }
}
// 위 처럼 작성해놓으면 조건문을 삭제할 수 있다.
// 널 객체가 다른 널 객체를 반환하는 일은 자주 있다.
let weeksDelinquent = customer.getHistory().getWeeksDelinquentInLastYear()
```

이 리팩토링 기법을 실시할 때 null 이 여러 종류일 수도 있따. customer 가 없는 것은 입주하지 않은 새 건물과 같고 미지의 customer 가 있는 것은 누군가 살지만 그게 누구인지 모르는 것과 같다.
이렇게 다른 두 null 상황에 대한 클래스를 각각 작성하면 된다.

## 어설션 넣기 (Introduce Assertion)

일부 코드가 프로그램의 어떤 상태를 전제할 땐 어설션을 넣어서 그 전제를 확실하게 코드로 작성하자.

특정 조건이 참일 때만 코드의 일부분이 실행되는 경우가 많다. 객체를 사용할 때 적어도 하나의 필드엔 값이 들어있다고 가정할 수 있다.
그런 전제는 대개 코드로 작성되어 있지 않고 알고리즘을 두루 살펴야 알 수 있고, 가끔은 주석으로 처리되어 있을 때도 있다. 이런 전제는 어설션을 넣어 명확히 드러나게 하는 것이 좋다.

어설션이란 항상 참으로 전제되는 조건문을 뜻한다. 어설션이 실패하면 그건 프로그래머가 오류를 범한 것이다. 그래서 어셜션이 실패할 경우 반드시 예외를 통지하게 해야 한다.
어셜션은 대개 제품화 단계에서 삭제한다.

### 예제

간단한 개발 비용 한도 코드는 다음과 같다. 직원에게는 개인별 경비 한도를 부여할 수 있다.
직원이 주요 프로젝트를 맡게 된다면 해당 주요 프로젝트에 대한 경비 한도를 사용할 수 있다.
직원에게 경비 한도와 주요 프로젝트가 모두 주어질 필요는 없지만, 둘 중 하나는 반드시 주어져야 한다.
경기 한도를 사용하는 코드에서는 이 전제가 당연하다.

```javascript
class Employee {
  static NULL_EXPENSE = -1.0

  constructor() {
    this._expenseLimit = NULL_EXPENSE
    this._primaryProject
  }

  getExpenseLimit() {
    return this._expenseLimit !== NULL_EXPENSE
      ? this._expenseLimit
      : this._primaryProject.getMemeberExpenseLimit()
  }

  withinLimit(expenseAmount) {
    return expenseAmount <= this.getExpenseLimit()
  }
}
```

위 코드에서 직원에게 프로젝트나 개인 경비 한도 중 하나가 주어져 있따는 명시적 가정이 들어있다. 이런 어셜션은 다음과 같이 코드로 확실히 나타내야 한다.

```javascript
getExpenseLimit() {
  Assert.isTrue(this._expenseLimit !== NULL_EXPENSE || this._primaryProject !== null)
  return (this._expenseLimit !== NULL_EXPENSE) ? this._expenseLimit : this._primaryProject.getMemeberExpenseLimit()
}
// Assert 메서드의 매개변수로 전달하는 모든 표현식이 그대로 실행되는 문제가 있기에 그 표현식을 실행하지 않기 위해선 다음과 같은 코드를 작성한다.
// Assert.ON 상수가 false일 경우 뒤 표현식은 실행되지 않는다.
getExpenseLimit() {
  Assert.isTrue(Assert.ON && this._expenseLimit !== NULL_EXPENSE || this._primaryProject !== null)
  return (this._expenseLimit !== NULL_EXPENSE) ? this._expenseLimit : this._primaryProject.getMemeberExpenseLimit()
}
```

Assert 클래스엔 용도를 알기 쉬운 이름으로 된 각종 메서드가 들어 있어야 한다. isTrue 메서드 외에도 equals 메서드나 shouldNeverReachHere 메서드를 넣을 수도 있다.
