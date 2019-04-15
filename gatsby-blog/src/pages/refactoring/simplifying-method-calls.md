---
title: 메서드 호출 단순화
date: "2019-04-15T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript로 전환하였습니다.

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

- 그 객체 중 하나에 필요한 정보를 요청할 수 있나?
- 그럴수 없다면 필요한 정보를 가져오는 메서드를 그런 객체에 추가하는것이 합리적인가?
- 필요한 정보는 무슨 용도로 사용되는가?
- 그 정보 이용 기능이 해당 정보가 들어있는 다른 객체에 있어야 하나?

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

위 `foundMiscreant` 메서드에서 값 반환 코드를 상태 변경 코드와 분리하려면 우선 변경 메서드와 같은 값을 반환하되 부작용이 없는 적절한 
질의 메서드를 다음과 같이 작성하자.

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

`foundMiscreant` 메서드는 아무것도 반환하지 않는 메서드로 만들자. 그리고 `foundMiscreant` 이 메서드 네이밍을 `sendAlert` 로 변경
중복되는 코드 발생도 알고리즘 전환을 적용하자.

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

### 메서드를 매개변수로 전환 

여러 메서드가 기능은 비슷하고 안에 든 값만 다를 땐 서로 다른 값을 하나의 매개변수로 전달받는 메서드를 하나 작성하자.

기능은 비슷하지만 몇가지 값에 따라 결과가 달라지는 메서드가 여러 개 있을때 각 메서드를 전달된 매개변수에 따라 다른 작업을 처리하는 하나의 메서드로 만들면 편리하다.
이렇게 수정하면 중복코드가 없어지고 매개변수 추가를 통해 다양한 것을 처리할 수 있어서 유연하다.

### 예제

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

전달받은 매개변수를 토대로 Employee의 하위 클래스를 작성하면 다음과 같다. 이런 형태의 코드는 주로 생성자를 팩토리 메서드로 전환을 실시하면 얻어진다.

```javascript
class Employee {
  static ENGINEER = 0
  static SALESMAN = 1
  static MANAGER = 2

  static create(type){
    switch(type) {
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

## 객체롤 통쨰로 전달

## 매개변수 세트를 메서드로 전환

## 매개변수 세트를 객체로 전환

## 쓰기 메서드 제거

## 메서드 은폐

## 생성자를 팩토리 메서드로 전환

## 하양 타입 변환을 캡슐화

## 에러 부호를 예외 통지로 교체

## 예외 처리를 테스트로 교체 