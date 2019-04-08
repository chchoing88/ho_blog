---
title: 조건문 간결화
date: "2019-04-03T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript로 전환하였습니다.

## 조건문 쪼개기 (Decompose Conditional)

복잡한 조건문(if-then-else)이 있을땐 if, tehn, eles 부분을 각각 메서드로 빼내자.

```javascript
// bad
if(data.before(SUMMER_START) || data.after(SUMMER_END)) {
  charge = quantity * _winterRate + _winterServiceCharge
} else {
  charge = quantity * _summerRate
}

// good
if(notSummer(date)) {
  charge = winterCharge(quantity)
} else {
  charge = summerCharge(quantity)
}
```

큰 덩어리의 코드를 잘게 쪼개고 각 코드 조각을 용도에 맞는 이름의 메서드 호출로 바꾸면 코드의 용도가 분명히 드러난다. 
이 과정을 조건문의 if절, then절, else절 각각에 대해 수행하면 더 큰장점을 얻을 수 있다. 

## 중복 조건식 통합 (Consolidate Conditional Expression)

여러 조건 검사식의 결과가 같을 땐 하나의 조건문으로 합친 후 메서드로 빼내자.

서로 다른 여러 개의 조건 검사식이 있는데 조건에 따른 결과가 모두 같을 때가 간혹 있다. 이럴 때는 논리 연산자 AND와 OR을 사용해서 여러 조건 검사를 하나로 합쳐야 한다. 
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

이럴때 조건문이 여러 개 있고 모두 같은 값 0을 반환한다. 조건문이 이렇게 순차적일 땐 다음과 같이 논리합 연산자인 ||로 연결한 하나의 조건문으로 만들 수 있다. 

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
if(onVacation())
  if(lengthOfService() > 10) 
    return 1
return 0.5
```

이 코드에서 겹친 조건문을 논리곱 연산자로 다음과 같이 연결할 수 있다.

```javascript
if(onVacation() && lengthOfService() > 10) return 1
else return 0.5
```

조건식 안의 루틴이 단순히 조건을 검사해서 값을 반환할 땐 다음과 같이 삼항연산자를 사용해서 그 루틴을 한줄의 return 문으로 만들자.

```javascript
return (onVacation() && lengthOfService() > 10) ? 1 : 0.5
```

## 조건문의 공통 실행 코드 뺴내기 (Consolidate Duplicate Conditional Fragments)

조건문의 모든 절에 같은 실행 코드가 있을 땐 같은 부분을 조건문 밖으로 빼자.

### 예제

```javascript
// bad
if(isSpecialDeal()) {
  total = price * 0.95
  send()
} else {
  total = price * 0.98
  send()
}

// good
if(isSpecialDeal()) {
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

found는 결과를 나타내기도 하고 제어 플래그 역할도 한다. 이럴땐 found 변수를 알아내는 코드를 메서드로 빼내자.

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

위 코드에서 `payAmount` 메서드를 EmployeeType 클래스로 옮기고 Employee 클래스의 데이터가 필요하므로 Employee 클래스를 인자로 전달해야한다. 

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
  
  payAmount(emp) { // emp는 Employee 인스턴스 
    switch (this.getTypeCode()) {
      case EmployeeType.ENGINEER:
        return emp.getMonthlySalary()
        break
      case EmployeeType.SALESMAN:
        return emp.getMonthlySalary() + emp.getCommission()
        break
      case EmployeeType.MANAGER:
        return emp.getMonthlySalary() + emp.getBonus()
        break
      default:
    }
  }

  getTypeCode() {}

  
}
```

이제 case 문의 ENGINEER 절 코드를 Engineer 코드로 복사하자.
그리고 EmployeeType 클래스에 payAmount 메서드는 추상 메서드로 선언하자.

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

  payAmount(emp) { // emp는 Employee 인스턴스 
    return emp.getMonthlySalary()
  }
}


class Salesman extends EmployeeType {
  getTypeCode() {
    return EmployeeType.ENGINEER
  }

  payAmount(emp) { // emp는 Employee 인스턴스 
    return emp.getMonthlySalary() + emp.getCommission()
  }
}

class Manager extends EmployeeType {
  getTypeCode() {
    return EmployeeType.ENGINEER
  }

  payAmount(emp) { // emp는 Employee 인스턴스 
    return emp.getMonthlySalary() + emp.getBonus()
  }
}
```



## Null 검사를 널 객체에 위임 (Introduce Null Object)

## 어설션 넣기 (Introduce Assertion)