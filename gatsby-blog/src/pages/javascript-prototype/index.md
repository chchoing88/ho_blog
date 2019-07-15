---
title: Prototype in JavaScript
date: "2019-07-15T10:00:03.284Z"
---

# Prototype in JavaScript: it’s quirky, but here’s how it works

번역 : [https://www.freecodecamp.org/news/prototype-in-js-busted-5547ec68872/](https://www.freecodecamp.org/news/prototype-in-js-busted-5547ec68872/)

다음 네 줄은 대부분의 JavaScript 개발자를 혼란스럽게합니다.

```
Object instanceof Function//true
```

```
Object instanceof Object//true
```

```
Function instanceof Object//true
```

```
Function instanceof Function//true
```

자바 스크립트의 Prototype 은 가장 마음이 떨리는 개념 중 하나이지만이를 피할 수는 없습니다. 아무리 무시해도 JavaScript 가 실행되는 동안 prototype 퍼즐이 발생합니다.

그럼 한번 직면해보자.

기본 사항부터 JavaScript 에는 다음과 같은 데이터 유형이 있습니다.

1. undefined
2. null
3. number
4. string
5. boolean
6. object

처음 5 가지는 기본 데이터 유형입니다. 이들은 boolean 과 같은 유형의 값을 저장하며 true 또는 false 가 될 수 있습니다.

마지막 "객체"는 키 - 값 쌍의 집합으로 설명 할 수있는 참조 유형입니다 (그러나 훨씬 더 많습니다).

자바 스크립트에서 새로운 객체들은 `toString ()` 및 `valueOf ()`와 같은 일반적인 메소드를 제공하는 **Object constructor function** (또는 객체 리터럴`{}`)을 사용하여 만들어집니다.

JavaScript 의 함수는 **"called" ** 을 할 수있는 특별한 객체입니다. 우리는 그것들을 만들고 **Function constructor function** (또는 함수 리터럴)을 사용합니다. 이 ** 생성자 **가 함수뿐만 아니라 객체이기 때문에 닭이 먼저냐 달걀이 먼저냐 수수께끼가 같은 모든 사람들을 혼란스럽게하는 것과 같은 방식으로 항상 나를 혼란스럽게합니다.

프로토 타입으로 시작하기 전에 JavaScript 에서 두 가지 프로토 타입이 있음을 분명히하고 싶습니다.

1. **prototype :** JavaScript 로 작성한 모든 기능의 속성으로 지정된 특수 객체입니다. 여기서는 분명히 설명 하겠지만, JavaScript 가 제공하는 내부 함수 (및`bind`에 의해 반환 된 함수)에는 필수 항목이 아닌 모든 함수에 대해 이미 존재합니다. 이`prototype`은 (`new` 키워드를 사용하여) 그 함수에서 새로 생성 된 객체의`[[Prototype]]`(아래 참조)이 가리키는 것과 동일한 객체입니다.
2. **[[Prototype]] :** 이것은 객체에서 읽혀지는 일부 속성을 사용할 수 없는 경우 실행중인 컨텍스트가 액세스하는 모든 객체의 숨겨진 속성입니다. 이 속성은 단순히 객체가 만들어진 함수의 `프로토 타입` 에 대한 참조입니다. 스크립트에는 **getter-setter** (다른 날 주제)라는 **proto**를 사용하여 액세스 할 수 있습니다.이 프로토 타입에 액세스하는 다른 새로운 방법이 있지만 간단히하기 위해 `[[Prototype]]` `__proto__`을 사용합니다.

```
var obj = {}
var obj1 = new Object()
```

위의 두 문장은 새로운 객체를 만드는 데 사용될 때 equal 문이지만, 이 명령문 중 하나를 실행할 때 많은 일이 발생합니다.

새로운 객체를 만들면 그것은 비어 있습니다. 사실 그것은`Object` 생성자의 인스턴스이기 때문에 비어 있지 않으며 새로 생성 된 객체의 `__proto__`가 가리키는 `Object`의`prototype` 참조를 가져옵니다.

![https://cdn-media-1.freecodecamp.org/images/h04OjQTCA9CyQ5yXzbwg2-HYnz8RbCTUvtc6](https://cdn-media-1.freecodecamp.org/images/h04OjQTCA9CyQ5yXzbwg2-HYnz8RbCTUvtc6)

`Object` 생성자 함수의 `prototype`을 살펴보면 `obj.` 의 `__proto__`와 똑같습니다. 실제로 그들은 같은 객체를 가리키는 두 포인터입니다.

![](https://cdn-media-1.freecodecamp.org/images/2hy0s7jdEw-W66w8dWxo-8Ck2nBIBMWixr9t)

```
obj.__proto__ === Object.prototype//true
```

함수의 모든 `프로토 타입 (prototype)` 은 함수 자체에 대한 포인터 인 `생성자 (constructor)` 라는 고유 한 속성을 가지고 있습니다. `Object` 함수 의 경우, `prototype` 은 `Object`를 가리키는 `constructor`을 가지고 있습니다.

```
Object.prototype.constructor === Object//true
```

![](https://cdn-media-1.freecodecamp.org/images/rnUjw1hZdqdTpcSW2y3ZX8ptZ3OUcCzuaKbO)

위의 그림에서, 왼쪽은 `Object` 생성자의 확장 된 뷰입니다. 당신은 이 모든 다른 기능들이 무엇인지 궁금 할 것입니다. 함수는 **object** 이므로 다른 객체처럼 속성을 가질 수 있습니다.

자세히 보면, `Object` _(왼쪽)_ 자체는 `prototype` 을 가진 다른 생성자로부터`Object`가 만들어 졌음을 의미하는 `__proto__` 를 가지고 있습니다. `Object`는 함수 객체이기 때문에 , 그것은`Function` 생성자를 사용하여 만들어 졌음에 틀림 없습니다.

![](https://cdn-media-1.freecodecamp.org/images/we607uLIJLuCdG4P0metYMcjf9PpNHvh22tm)

`Object`의 `__proto__` 는 `Function` 의 `prototype` 과 같습니다. 두 함수의 동등성을 검사하면 같은 객체가됩니다.

```
Object.__proto__ === Function.prototype//true
```

자세히 살펴보면 `Function` 자체가 `__proto__` 을 가지고있는 것을 보게 될 것입니다. 즉, `Function` 생성자 함수는 `prototype` 을 가진 어떤 생성자 함수에서 만들어 졌음을 의미합니다. `Function` 자체는 **function** 이기 때문에 `Function` 생성자, 즉 그 자체로 만들어 져야합니다. 나는 그것이 이상하게 들린다는 것을 알고있다. 그러나 당신이 그것을 점검 할 때, 그것은 사실 인 것으로 판명됩니다.

다시 정리하면, Function 생성자 함수에는 `__proto__` 프로퍼티가 있다. 이것이 의미하는건 `prototype` 속성을 지닌 어떤 생성자로 만들었다는걸 뜻하는 것이다.

여기서 Function 은 사실 그 자체로 function(함수)이기 때문에 Function 생성자 함수는 Function 생성자를 이용해서 만들었을 것이다. 쉽게 이해하기 어렵지만 생각 해보면 우리가 함수를 만들면 그 함수는 Function 생성자를 이용해서 만들었을 것이다. 그렇다면 `Function.__proto__` 는 `Function.prototype` 과 같을 것이다. 실제로도 같다.

아이러니 하지만 Function 생성자는 Function 생성자가 만들었다는 이야기가 된다.

여기서 Function.prototype 은 빌트인 function 객체이다.

```javascript
// 내부적으로 Function 생성자로 person을 만들게 될 것이다.
function person() {}
person.__proto__ === Function.prototype
person.__proto__.name === Function.prototype.name // (1)

Function.name === Function.prototype.name // (2)
```

위 처럼 우리는 함수 person 을 만들면 `__proto__` 로 Function.prototype 과 연결 되어서 Function.prototype 에 있는 속성과 메서드를 사용할 수 있게 된다.
여기서 만약 Function 에 `__proto__` 가 없다면 (2) 번과 같이 Function 에서 바로 Function.prototype 을 사용 할 수 없을 것이다.

![](https://cdn-media-1.freecodecamp.org/images/gHONmm8YNyMAgQYD3MQ88WsYsathI0Nr-cp8)

사실 `Function` 의 `__proto__` 와 `Function` 의 `prototype` 은 사실 동일한 객체를 가리키는 두 개의 포인터입니다.

```
Function.prototype === Function.__proto__\\true
```

앞서 언급했듯이 `prototype` 의 `constructor` 은 `prototype` 을 소유 한 함수를 가리켜 야합니다.`Function` 의 `prototype` 의 `constructor` 은 `Function` 자체를 가리 킵니다.

```
Function.prototype.constructor === Function\\true
```

![](https://cdn-media-1.freecodecamp.org/images/ftvp4bDag11U4kaWjV3nG7UfkqQKjSQPA4i0)

다시 말하지만, **Function** 의 **prototype** 은 `__proto__` 을 가지고 있습니다. 놀랍지도 않습니다 . `prototype` 은 객체입니다. 객체를 가질 수 있습니다. 그러나 객체의 _프로토 타입_ 을 가리키고 있음을 주목하십시오.

```
Function.prototype.__proto__ == Object.prototype\\true
```

그래서 우리는 여기에 마스터 맵을 가질 수 있습니다 :

![](https://cdn-media-1.freecodecamp.org/images/F86Ee6hanmaQuvSRBZ8S1rG6Cq1R-LVhA4Kl)

```
instanceof Operator a instanceof b
```

`instanceof` 연산자는 `a` 에서 `constructor` ( _of_ chained `__proto__`) 중 하나가 가리키는 객체 `b` 를 찾습니다. 다시 읽어봅시다! 그러한 참조를 찾으면 `true`를 리턴하고 그렇지 않으면 `false`.

이제 우리는 네 개의 `instanceof` 문장으로 돌아 간다. 나는 다음을 위해`instanceof` 가 `true` 를 리턴하도록 대응하는 문장을 작성했습니다 :

```
Object instanceof Function Object.__proto__.constructor === Function
```

```
Object instanceof Object Object.__proto__.__proto__.constructor === Object
```

```
Function instanceof Function Function.__proto__.constructor === Function
```

```
Function instanceof Object Function.__proto__.__proto__.constructor === Object
```

휴! 스파게티도 덜 엉키지 만, 나는 상황이 더 명확 해지기를 바랍니다.

여기에 이전에 지적하지 않은 것이 있는데,`Object` 의 `prototype` 은 `__proto__` 을 가지고 있지 않습니다.

사실 그것은 `__proto__`을 가지고 있지만 `null`과 같습니다. 체인은 어딘가에서 끝나야하고 여기서 끝납니다.

```
Object.prototype.__proto__\\null
```

우리의 `Object` , `Function` , `Object.prototype` 과 `Function.prototype`도 `Object.assign` , `Object.prototype.hasOwnProperty` 와 `Function.prototype.call`. 이들은 프로토 타입이없고 `Function` 의 인스턴스이고`Function.prototype` 에 대한 포인터 인 `__proto__` 를 가진 내부 함수입니다.

![](https://cdn-media-1.freecodecamp.org/images/fs6Q6b4ewNiWTuSehUQAY1Cf2OJTV0WyzHAB)

```
Object.create.__proto__ === Function.prototype\\true
```

`Array` 와 `Date` 와 같은 다른 생성자 함수를 탐색하거나 객체를 가져 와서`prototype` 과 `__proto__`를 찾을 수 있습니다. 모든 것이 어떻게 연결되어 있는지 확인할 수있을 것입니다.

#### Extra queries:

잠시 동안 나를 괴롭혔던 질문이 하나 더 있습니다. 왜 '객체'의 프로토 타입이 **객체**이고 '함수'의 프로토 타입이 **함수 객체** 입니까?

[**Here**](https://stackoverflow.com/a/32929083/1934798) 같은 생각을하면 좋은 설명입니다.

지금까지는 수수께끼일지도 모르는 또 다른 질문은 : 원시 데이터 타입이`toString ()`, `substr ()` 및 `toFixed ()` 와 같은 함수를 얻는 방법은 무엇입니까? 이것은 잘 설명되어 있습니다. (https://javascript.info/native-prototypes#primitives).

`prototype` 을 사용하여 자바 스크립트에서 커스텀 객체로 상속 작업을 할 수 있습니다. 그러나 그것은 다른 날을위한 주제입니다.

읽어 주셔서 감사합니다!
