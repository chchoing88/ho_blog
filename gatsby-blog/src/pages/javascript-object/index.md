번역 : http://blog.brew.com.hk/not-everything-in-javascript-is-an-object/

# Javascript 의 모든것은 Object 이다.? 아니다.?

자바스크립트가 OOP(객체 지향 언어인지 함수형 언어인지 많은 혼란들이 있다. 실제로 Javascript 는 이 두가지 모두 사용할 수 있다.

그러나 사람들은 자바스크립트 모든것이 객체인지?, 함수는 무엇인지 질문하곤 한다.
이 포스트가 이것들을 명확하게 할것이다.

## 시작해보자.

자바스크립는 여섯가지 원시 데이터 타입이 있다.

* Booleans - `true` or `false`
* `null`
* `undefined`
* `number` - double-precision 64-bit float. **There are no integers in JavaScript**.
* `string`
* `symbol` (new in ES6)

원시타입 외에도, ECMAScript 스탠다드는 `object` 타입을 정의합니다. 이것은 간단하게 키 벨류의 저장소 입니다.

```javascript
const Object = {
  key: 'value',
}
```

간단하게는, 원시타입이 아닌 어떤것들을 `Object` 이라한다. 그리고 이것은 함수와 배열을 포함하고 있다.

모든 함수들은 객체들이다.

```javascript
// Primitive types
true instanceof Object // false
null instanceof Object // false
undefined instanceof Object // false
0 instanceof Object // false
'bar' instanceof Object // false

// Non-primitive types
const foo = function() {}
foo instanceof Object // true
```

## 원시타입

원시타입 들은 원시타입에 붙어있는 메서드를 가지지 않는다. 그래서 절대 `undefined.toString()` 이라는 문법을 볼 수 없을 것이다. 또한 이 원시타입들은 값을 을 변화시키는 메서드를 지니고 있지 않기 때문에 원시타입들은 불변함의 성격을 지니고 있다.

사용자들은 원시타입을 변수에 재 할당할수 있다. 하지만 그것은 새로운 값이 될것이다. 예전의 것이 아니며 변할수도 없다. 즉, 변수에 원시타입을 대입하는 것은 새로운 값이 되는것이지 이전의 값이 변한것이 아니다.

```javascript
const answer = 42
answer.foo = 'bar'
answer.foo // undefined
```

> 원시 타입들은 불변함을 지닌다.

게다가 원시 타입들은 참조값을 저장하는 객체와는 다르게 값 자체로 저장이 된다. 이것은 같은 검사를 수행할때 여향을 미친다.

```javascript
"dog" === "dog"; // true
14 === 14; // true

{} === {}; // false
[] === []; // false
(function () {}) === (function () {}); // false
```

> 원시 타입들은 값으로 저장이 되고, 객체는 참조값으로 저장이 된다.

## 함수

함수는 `constructor` , `call` 과 같은 몇몇 특별한 프로퍼티들을 가진 object 타입이다.

```javascript
const foo = function(baz) {}
foo.name // "foo"
foo.length // 1
```

그리고 평범한 객체와 같이 새로운 프로퍼티들을 추가할 수 있다.

```javascript
foo.bar = 'baz'
foo.bar // "baz"
```

### Methods

메서드는 함수처럼 행동하는 객체의 프로퍼티이다.

```javascript
const foo = {}
foo.bar = function() {
  console.log('baz')
}
foo.bar() // "baz"
```

## 생성자 함수

만약 당신이 몇몇 같은 수행을 공유하는 객체를 가지고 있다면, 생성자 함수 내부에 그 로직을 놓을 수 있다. 그리고 생성자 함수로 그 객체들을 만들수 있다.

생성자 함수는 다른 함수들과 다르지 않다. 이 함수는 new 키워드 뒤에 사용될 때 생성자 함수로 사용된다.

> 모든 함수라도 생성자 함수가 될수 있다.

```javascript
const Foo = function() {}
const bar = new Foo()
bar // {}
bar instanceof Foo // true
bar instanceof Object // true
```

생성자 함수는 객체를 리턴 할 것이다. 여기 이 함수안에 있는 `this`는 객체에 새로운 프로퍼티를 할당하는데 사용 될 수 있다.

그래서 만약 우리가 초기에 `bar`라는 프로퍼티에 `baz` 값을 할당하고 싶은 많은 객체를 만들길 원한다면 해당 로직을 지닌 새로운 `Foo`라는 로새로운 생성자를 만들 수 있다.

```javascript
const Foo = function() {
  this.bar = 'baz'
}
const qux = new Foo()
qux // { bar: "baz" }
qux instanceof Foo // true
qux instanceof Object // true
```

> 당신은 생성자 함수를 새로운 객체를 만드는데 사용할 수 있다.

생성자 함수가 단순히 new 가 없이 일반 함수 `Foo()` 처럼 동작한다면 해당 함수 안에 있는 이 `this` 는 실행 컨텍스트에 해당되게 됩니다. 그래서 모든 함수들 밖에서 `Foo()`를 호출하게 되면 사실 `window` 객체 가 수정되게 될것이다.

```javascript
Foo() // undefined
window.bar // "baz"
```

반대로, 일반 함수를 생성자 처럼 실행하게 된다면 이전에 바왔던 새로운 빈 객체가 나오게 된다.

```javascript
const pet = new String('dog')
```

## 래퍼 객체

`String`, `Number`, `Boolean`, `Function` 등등 이런 함수들은 혼란을 가져온다.
이것들을 `new` 와 함께 호출한다면 원시타입 대한 *wrpper object*가 생성된다.

`String`은 주어진 매개변수를 원시 문자열을 만들수 있는 글로벌 함수이다. 그것은 매개변수를 문자열로 변환할 수 있다.

```javascript
String(1337) // "1337"
String(true) // "true"
String(null) // "null"
String(undefined) // "undefined"
String() // ""
String('dog') === 'dog' // true
typeof String('dog') // "string"
```

하지만 `String`함수를 생성자 함수처럼 사용할 수도 있다.

```javascript
const pet = new String('dog')
typeof pet // "object"
pet === 'dog' // false
```

그리고 이것은 문자열 `"dog"`를 표현하는 새로운 객체를 만들어 낸다. 다음과 같은 프로퍼티들을 지닌다.

```javascript
{
  0: "d",
  1: "o",
  2: "g",
  length: 3
}
```

## 자동 박싱

흥미로운 점은 기본 문자열과 객체 모두의 생성자가 둘 다 String 함수라는 것이다.
훨씬 더 흥미로운 사실은 기본 문자열에서 `.constructor`를 호출할 수 있다는 점이다. 우리가 원시타입은 메서드를 가질수 없다고 알고있었다.

```javascript
const pet = new String('dog')
pet.constructor === String // true
String('dog').constructor === String // true
```

이런 절차가 발생되는것을 우리는 *autoboxing*이라 부른다. 우리가 원시 타입안에서 메서드나 프로퍼티를 호출할 때, 자바스크립트는 먼저 일시적으로 *wrapper object*로 변환시킨다. 그리고 그 프로퍼티와 메서드에 원래의 값에 영향없이 접근한다.

```javascript
const foo = 'bar'
foo.length // 3
foo === 'bar' // true
```

위 예제에서 `length`프로퍼티에 접근한다. 자바스크립트는 `foo`를 wapper object 로 autoboxed 를 시킨다. 그리곤 해당 객체의 length 에 접근한다. 그리곤 그 객체를 버립니다. 이것은 foo 에 영향 없이 진행됩니다.

이것이 우리가 원시타입에 프로퍼티를 접근하려들려 할때 자바스크립트가 에러를 뱉지 않는 이유이다. 그 원시 타입 자신을 건들지 않고 임시 래퍼 객체에 할당했기 때문이다.

```javascript
const foo = 42
foo.bar = 'baz' // Assignment done on temporary wrapper object
foo.bar // undefined
```

만약 `undefined`나 `null`같이 래퍼객체가 없는 타입으로 이같은 시도를 했다면 에러가 났을 것이다.

```javascript
const foo = null
foo.bar = 'baz' // Uncaught TypeError: Cannot set property 'bar' of null
```

## 요약

1. 자바스크립트의 모든것이 객체가 아니다.
2. 자바스크립트에는 6 가지 원시 타입이 있다.
3. 원시타입 모두가 객체는 아니다.
4. 함수는 특별한 타입의 객체이다.
5. 함수는 새로운 객체를 만드는데 사용될 수 있다.
6. String, booleans 그리고 numbers 는 원시타입으로 대표될 수 있지만 객체이기도 하다.
7. 확실한 원시타입( strings. numbers, booleans ) 는 마치 객체처럼 보여지기도 하다. 이는 자바스크립트의 autoboxin 이라고 불리오는 특징 때문이다.

```
일부 의역이 들어간 경우도 있으므로 해당 원문의 내용과 조금 다를 수 있습니다. <br/>
문제가 될 소지가 있다거나 혹은 수정이 필요한 사항이 있다면 있다면 issues 보내주세요.
```
