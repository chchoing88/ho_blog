---
title: (읽기 쉬운 자바스크립트) null 비교 금지
date: "2019-05-02T10:00:03.284Z"
---

변수에 필요한 값이 할당되었는지 확인할 때 `null`과 비교하는 방법은 흔히 잘못 사용하는 패턴이다.

```javascript
var Controller = {
  process: function(items) {
    if(items !== null) {
      items.sort()
      items.forEach(function(itme) {
        // do Something...
      })
    }
  }
}
```

위 코드는 items 변수에 sort() 와 forEach() 를 사용하는 것을 보아 items 변수가 배열이라는 전제하에 작성한 코드인 듯합니다. 
코드 의도는 명확하지만, items 변수가 배열이 아니면 로직을 수행할 수 없습니다. 

변수를 단순히 null과 비교하면 변수 값에 대한 정보가 부족해 로직을 계속 진행해도 안전한지 알 수 없습니다. 다행이 자바스크립트는 변수에 원하는 값이 할당되었는지 확인하는 방법을 다양하게 제공합니다.

## 기본 데이터 타입 알아내기

- typeof를 문자열에 사용하면 'string'을 반환합니다.
- typeof를 숫자에 사용하면 'number'을 반환합니다.
- typeof를 불린에 사용하면 'boolean'을 반환합니다.
- typeof를 undefined에 사용하면 'undefined'을 반환합니다.

typeof 연산자는 선언되지 않은 변수에 사용해도 에러가 발생하지 않습니다. 선언한 변수이든, 선언하지 않은 변수이든 값이 undefined이면 둘다 'undefined'로 반환합니다.

null은 변수에 값이 할당되었는지 확인할 때 사용하면 안됩니다. 단순히 변수를 null 값으로만 비교하면 무슨 값을 원하는지 알 수 없습니다. 
단, null 비교가 허용되는 예외 사항이 있는데 기대 하는 값이 정말 null 이라면 null을 직접 사용해도 됩니다. 여기서 null 값과 비교할 때는 반드시 비교 연산자로 === 또는 !== 을 사용해야 합니다.

```javascript
var element = document.getElementyById('my-div')
if( element !== null ) {
  element.className = 'found'
}
```

위 코드에서는 조건에 맞는 DOM 요소가 없으면 document.getElementById() 메서드는 실제로 null을 반환합니다. 이 메서드는 확실히 null을 반환하거나 요소를 반환합니다. 
null은 기대하던 값중 하나이므로 !== 연산자를 사용해 null 과 비교해도 됩니다. 

## 객체 참조 타입 알아내기

참조 타입이 무엇인지 판단하려면 `instanceof` 연산자를 사용합니다.

```javascript
값 instanceof todtjdwkaud
```

```javascript
// Date 객체인지 확인
if(value instanceof Date) {
  console.log(value.getFullYear())
}

if(value instanceof Error) {
  throw valeu
}
```

`instanceof` 연산자는 객체를 생성할 때 사용한 생성자뿐만 아니라 프로토타입 체인도 같이 검사를 합니다.

```javascript
var now = new Date()

console.log(now instanceof Object) // true
console.log(now instanceof Date) // true
```

### 함수 알아내기

```javascript
function myFunc() {}

// 권장
console.log(typeof myFunc === 'function') // true

// IE 하위에는 querySelectorAll typeof로 확인시 'object'로 뜸
// DOM 메서드 인지 확인
if('querySelectorAll' in document) {
  images = document.querySelectorAll('img')
}
```

### 배열 알아내기

프레임 간 배열을 전달할 때 instanceof Array를 사용하면 결과 값이 잘못 나온다. 각 프레임이 각각 Array 생성자를 가지고 있고 한 프레임의 인스턴스는 다른 프레임에서 인식할 수 없기 때문이다. 
그래서 더글라스 크락포드는 덕 타이핑을 권장했는데, 이는 sort() 메서드가 있는지만 확인하는 방법이다.

```javascript
// arrays 덕 타이핑
function isArray(value) {
  return typeof value.sort === 'function'
})
```

배열 타입인지 정확하게 알아내기 위해서는 수많은 검사를 해야하지만 Kangax라고 알려진 유리 자이체프는 다음과 같은 명쾌한 해결책을 내놨다.

```javascript
function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]'
})
```

### 프로퍼티 알아내기 

객체에 프로퍼티가 있는지 확인할 때 보통 null이나 undefined를 자주 사용한다.
하지만 이는 버그를 유발 할 수 있다.

프로퍼티가 존재하는지 확인할 때는 in 연산자를 사용하는 것이 가장 좋다.
상속받는 프로퍼티는 제외하고 객체 인스턴스에 프로퍼티가 있는지 검사하려면 hasOwnProperty() 메서드를 사용한다. 
참고로 IE8 이하 버전의 DOM 객체는 Object를 상속받지 않아 hasOwnProperty() 메서드가 없다. 

```javascript
if('related' in object){
  if(object.hasOwnProperty('related')) {
    // do Something..
  }
}
```

