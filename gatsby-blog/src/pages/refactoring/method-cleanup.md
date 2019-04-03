---
title: 메서드 정리
date: "2019-03-27T10:00:03.284Z"
---



해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript로 전환하였습니다.

## 메서드 추출 (Extract Method)

어떤 코드를 그룹으로 묶어도 되겠다고 판단될때 그 코드를 빼내어 목적을 잘 나타내는 직관적 이름의 메서드로 만들자.

### 예제: 지역변수 사용 안하는 경우

```javascript
const testObj = {
  printOwing(){
    const e = order.elements()
    const outstanding = 0.0

    // 배너 추출
    // console.log('----- banner -----')
    this.printBanner()
  }

  printBanner(){
    console.log('----- banner -----')
  }
}
```

### 예제: 지역변수 사용하는 경우

메서드 안에서 지역변수가 읽히기만 하고 변경되지 않을때, 이럴 땐 지역변수를 그냥 매개변수로 전달하면 된다.

```javascript
const testObj = {
  printOwing(){
    const e = order.elements()
    const outstanding = 0.0

    // 세부내역 출력
    // console.log('고객명' + _name)
    // console.log('외상액' + outstanding)
    this.printDetails(_name, outstanding)

  }

  printDetails(name, outstanding){
    console.log('고객명' + _name)
    console.log('외상액' + outstanding)
  }
}
```

### 예제: 지역변수를 다시 대입하는 경우

복잡한 경우는 지역변수로의 값 대입이다. 이럴 때는 임시변수만 생각하면 되는데 두가지만 생각하자.
첫번째는 임시변수가 추출한 코드 안에서만 사용되는 경우, 이럴땐 그냥 임시변수를 추출한 코드로 옮기면 된다.
두번째는 임시변수가 추출한 코드 코드 밖에서 사용되는 경우, 추출한 코드에서 임시변수의 변경된 값을 반환하게 하자.

```javascript
const testObj = {
  printOwing(){
    // const e = order.elements()
    const outstanding = 0.0
    outstanding = this.getOutstanding(outstanding)
    // 외상액 계산 : e는 추출될 코드 안에서만 사용, each는 코드 안에서만 사용, outstanding은 반환하자.
    // while(e.hasMore()){
      // const each = e.next()
      // outstanding += each.getAmount()
    // }

    this.printDetails(_name, outstanding)

  }
  getOutstanding(initialValue){
    const e = order.elements()
    const result = initialValue

    while(e.hasMore()){
      const each = e.next()
      result += each.getAmount()
    }
    return result
  }
}
```

변수를 두개 이상 반환해야 할땐, 최선의 방법은 여러 개의 메서드를 만드는 방법을 사용하고 출력 매개변수 기느잉 있다면 출력 매개변수를 사용하면 된다.

## 메서드 내용 직접 삽입 (Inline Method)

메서드 기능이 너무 단순해서 메서드명만 봐도 너무 뻔할 땐 그 메서드의 기능을 호출하는 메서드에 넣어버리고 그 메서드는 삭제하자.
만약 그 메서드가 하위 클래스에 재정의 되어있다면 해당 작업을 실시하지 말자. 없어진 메서드를 재정의 하는 일이 생겨선 안된다.

### 예제

```javascript
const testObj = {
  getRating() {
    // return (this.moreThanFiveLateDeliveries)? 2 : 1
    reutnr(deliveris > 5) ? 2 : 1
  },

  // moreThanFiveLateDeliveries() {
  //   return deliveris > 5
  // }
}
```

## 임시변수 내용 직접 삽입 (Inline Temp)

간단한 수식을 대입받는 임시변수로 인해 다른 리팩토링 기법 적용이 힘들 땐 그 임시변수를 참조하는 부분을 전부 수식으로 치환하자.

```javascript
//const basePrice = order.basePrice()
//return (basePrice > 1000)

return order.basePrice() > 1000
```

## 임시변수를 메서드 호출로 전환 (Replace Temp with Query)

수식의 결과를 저장하는 임시변수가 있을 땐, 그 수식을 빼내어 메서드로 만든후, 임시변수 참조 부분을 전부 수식으로 교체하자.
새로 만든 메서드는 다른 메서드에서도 호출 가능하다.
단, 값이 여러번 대입되는 임시변수가 있으면 이 방법을 고려해봐야한다.

반복문이 들어있는 메서드를 추출해서 임시변수 대신 그 메서드를 사용한다면 여러번 호출로 인한 성능이 염려될 수도 있다.
다른 성능 문제처럼 당장은 느려질 수 있어도 대체로 문제없다. 최적화 과정에서 그 문제를 해결하면 된다.

### 예제

```javascript
// 리펙토링 하기 전
const testObj = {
  getPrice() {
    const basePrice = quantity * itemPrice
    let discountFactor
    if( basePrice > 1000 ) discountFactor = 0.95
    else discountFactor = 0.98
    return basePrice * discountFactor
  }
}

// 리펙토링 한 후
const testObj = {
  getPrice() {
    return this.basePrice() * this.discountFactor()
  }
  basePrice(){
    return quantity * itemPrice
  }
  discountFactor(){
    if(basePrice() > 1000) return 0.95
    return 0.98
  }
}
```

## 직관적 임시변수 사용 (Introduce Explaining Variable)

사용된 수식이 복잡할 땐 수식의 결과나 수식의 일부분을 용도에 부합하는 직관적 이름의 임시변수에 대입하자.
그 외에도 긴 알고리즘에서 임시변수를 사용해서 계산의 각 단계를 설명할 수 있을 때도 사용한다.

이 방법을 사용하기 보다는 메서드 추출을 사용하려 노력하자.

## 임시변수 분리 (Split Temporary Variable)

루프 변수나 값 누적용 임시변수(i = i+ 수식)가 아닌 임시변수에 여러번 값이 대입될 땐 각 대입마다 다른 임시변수를 사용하자.
임시변수는 긴 코드의 계산 결과를 나중에 간편히 참조할 수 있게 저장하는 용도로 사용된다.
이런 변수에 값이 두번 이상 대입된다는 건 그 변수가 메서드 안에서 여러 용도로 사용된다는 반증이다.

```javascript
// 리펙토링 하기 전
let temp = 2 * (height * width)
console.log(temp)
temp = height * width
console.log(temp)

// 리펙토링 후
let perimeter = 2 * (height * width)
console.log(perimeter)
let area = height * width
console.log(area)
```

## 매개변수로의 값 대입 제거 (Remove Assignments to Parameters)

매개변수로 값을 대입하는 코드가 있을땐 매개변수 대신 임시변수를 사용하게 수정하자.
**매개변수로의 값 대입** 이란 만약 foo 라는 객체를 매개변수로 전달 했을때 foo 의 값을 다른 객체 참조로 변경한다는 의미이다.
즉, foo 에 다른 객체를 할당을 하는 것은 하지 절대로 하지 말아야 한다.

## 메서드를 메서드 객체로 전환 (Replace Method with Method Object)

지역변수 때문에 메서드 추출을 적용할 수 없는 긴 메서드가 있을땐 그 메서드 자체를 객체로 전환해서 모든 지역변수를 객체의 필드로 만들자.
그런 다음 그 메서드를 객체 안의 여러 메서드로 쪼개면 된다.

```javascript
class Account {
  // 상당히 복잡한 gamma 메서드
  gamma(inputValue, qunatity, yearToData) {
    const importantValue1 = inputValue * quantity + this.delta()
    const importantValue2 = inputValue * yearToData + 100
    if (yearToData - importantValue1 > 100) {
      importantValue2 -= 20
    }
    const importantValue3 = importantValue2 * 7

    //.. 기타 작업들
    return importantValue3 - 2 * importantValue1
  }
}
```

gamma 라는 메서드 대신 객체를 새로 생성하자.

```javascript
class Account {
  gamma() {
    return new Gamma(this, inputValue, quantity, yearToData).compute()
  }
}

class Gamma {
  constructor(account, inputValue, quantity, yearToData) {
    this.account = account
    this.inputValue = inputValue
    this.quantity = quantity
    this.yearToData = yearToData
  }

  computed() {
    const importantValue1 = inputValue * quantity + this.account.delta()
    const importantValue2 = inputValue * yearToData + 100
    if (yearToData - importantValue1 > 100) {
      importantValue2 -= 20
    }
    const importantValue3 = importantValue2 * 7

    //.. 기타 작업들
    // 여기서 추가로 메서드를 추출할 수 있다.
    this.importantThing()
    return importantValue3 - 2 * importantValue1
  }

  importantThing() {
    // .. 중요 로직
  }
}
```

## 알고리즘 전환 (Substitute Algorithm)

알고리즘을 더 분명한 것으로 교체해야 할땐 해당 메서드의 내용을 새 알고리즘으로 바꾸자.
이렇게 하려면 먼저 메서드를 최대한 잘게 쪼개야 한다. 길고 복잡한 알고리즘은 수정하기 어려우므로, 우선 간단한 알고리즘으로 교체해야만 수정 작업이 편해진다.
