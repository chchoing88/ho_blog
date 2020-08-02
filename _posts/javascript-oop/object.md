---
title: Javascript OOP Object
date: "2020-08-01T10:00:03.284Z"
tags:
  - javascript
  - oop
  - object
keywords:
  - oop
---

이 내용은 프론트엔드 개발자를 위한 자바스크립트 프로그래밍을 읽고 정리한 내용입니다.

## 객체에 대한 이해

- 객체를 만드는 방법은 간단한 방법은 Object 인스턴스를 만들고 여기에 프로퍼티와 메서드를 추가하는 방법입니다.
- 객체를 만드는 가장 많이 쓰이는 패턴은 객체 리터럴 패턴이 더 많이 쓰입니다.

```javascript
var person = {
  name: "merlin",
  age: 29,
  sayName: function() {
    console.log(this.name);
  },
};
```

### 프로퍼티 타입

- 프로퍼티에는 데이터 프로퍼티와 접근자 프로퍼티 두 가지 타입이 있습니다.

#### 데이터 프로퍼티

- 데이터 프로퍼티에는 그 행동을 설명하는 네가지 속성이 있습니다.
  - Configurable : 당 프로퍼티가 delete를 통해 삭제하거나, 프로퍼티의 속성을 바꾸거나, 접근자 프로퍼티로 변환할 수 있음을 나타냅니다. 이전 예제처럼 객체에 직접 정의한 모든 프로퍼티에서 이 속성은 기본적으로 true 입니다.
  - Enumerable : for-in 루프에서 해당 프로퍼티를 반환함을 나타냅니다.
  - Writable : 프로퍼티의 값을 바꿀 수 있음을 나타냅니다.
  - Value : 프로퍼티의 실제 데이터 값을 포함합니다. 프로퍼티의 값을 읽는 위치이며 새로운 값을 쓰는 위치 입니다. 이 속성의 기본 값은 undefined 입니다.
- 기본 프로퍼티 속성을 바꾸려면 ECMAScript 5판의 `Object.defineProperty()` 메서드를 사용해야 합니다.
- 위 메서드는 `객체, 프로퍼티 이름, 서술자(descriptor) 객체` 세 가지를 매개변수로 받습니다.
- 서술자 객체에는 configurable, enumerable, writeable, value 네 가지 프로퍼티가 있습니다.

```javascript
// name 을 읽기 전용 프로퍼티를 만들고 그 값을 "Nicholas" 로 지정합니다.
// 이 프로퍼티 값은 바꿀 수 없으며, 새로운 값을 할당하려 시도하면 스트릭트 모드가 아닐 때는 무시되고
// 스트릭트 모드에서는 에러가 발생합니다.
var person = {};

Object.defineProperty(person, "name", {
  writable: false,
  value: "Nicholas",
});

console.log(person.name);
person.name = "Michael";
console.log(person.name);
```

- 같은 프로퍼티에서 `Object.defineProperty()`를 여러 번 호출할 수는 있지만, 일단 `configurable`을 false로 지정하면 제한이 생깁니다.
- Object.defineProperty()를 호출할때 configurable, enumerable, writable 의 값을 따로 명시하지 않는다면 기본 값은 false입니다.
- IE8에서는 제대로 구현되지 않았으므로 이 브라우저에서는 사용하지 않아야 합니다.

#### 접근자 프로퍼티

- 접근자 프로퍼티에는 데이터 값이 들어 있지 않고 대신 `getter`함수와 `setter` 함수로 구성됩니다. 프로퍼티의 값을 `getter/setter` 메서드로 대체할 수 있다.
- 접근자 프로퍼티를 읽을 때는 `getter` 함수가 호출되며 유효한 값을 반환할 책임은 이 함수에 있습니다. 접근자 프로퍼티에 쓰기 작업을 할 때는 새로운 값과 함께 함수를 호출하며 이 함수가 데이터를 어떻게 사용할지 결정합니다.
- 접근자 프로퍼티에는 네가지 속성이 있습니다.
  - `Configurable` : 해당 프로퍼티가 delete를 통해 삭제하거나, 프로퍼티의 속성을 바꾸거나, 접근자 프로퍼티로 변환할 수 있음을 나타냅니다. 이전 예제처럼 객체에 직접 정의한 모든 프로퍼티에서 이 속성은 기본적으로 true 입니다.
  - `Enumerable` : for-in 루프에서 해당 프로퍼티를 반환함을 나타냅니다.
  - `Get` : 프로퍼티를 읽을 때 호출할 함수입니다. 기본값은 undefined입니다.
  - `Set` : 프로퍼티를 바꿀 때 호출할 함수입니다. 기본값은 undefined입니다.

```javascript
var book = {
  _year: 2004,
  edition: 1,
};

Object.defineProperty(book, "year", {
  get: function() {
    return this._year;
  },

  set: function(newValue) {
    if (newValue > 2004) {
      this._year = newValue;
      this.edition += newValue - 2004;
    }
  },
});

book.year = 2005;
console.log(book.edition); //2
```

- getter 함수만 지정하면 해당 프로퍼티는 읽기 전용이 됩니다.
- setter만 지정된 프로퍼티를 읽으려 하면 스트릭트 모드가 아닐때는 undefined를 반환하며 스트릭트 모드에서는 에러가 발생합니다.

### 다중 프로퍼티 정의

- 객체에서 프로퍼티 여러 개를 동시에 수정해야 할 가능성이 높으므로 ECMAScript 5판에서는 `Object.defineProperties()` 메서드를 제공합니다.
- 매개변수는 프로퍼티를 추가하거나 수정할 객체, 그리고 프로퍼티 이름이 추가 및 수정할 프로퍼티 이름과 대응하는 객체 두 가지 입니다.

```javascript
var book = {};

Object.defineProperties(book, {
  _year: {
    value: 2004,
  },
  edition: {
    value: 1,
  },
  year: {
    get: function() {
      return this._year;
    },

    set: function(newValue) {
      if (newValue > 2004) {
        this._year = newValue;
        this.edition += newValue - 2004;
      }
    },
  },
});

book.year = 2005;
console.log(book.edition); //2
```

### 프로퍼티 속성 읽기

- ECMAScript 5의 `Object.getOwnPropertyDescriptor()` 메서드를 이용해 원하는 프로퍼티의 `서술자(descriptor) 객체`의 프로퍼티를 읽을 수 있습니다.
- `Object.getOwnPropertyDescriptor()` 메서드는 읽어올 프로퍼티가 포함된 객체, 서술자를 가져올 프로퍼티 이름 두가지 매개변수를 받습니다.

```javascript
// 위 코드 book 객체가 있다고 가정했을때.

var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
console.log(descriptor.value); //2004
console.log(descriptor.configurable); //false
console.log(typeof descriptor.get); //"undefined"

var descriptor = Object.getOwnPropertyDescriptor(book, "year");
console.log(descriptor.value); //undefined
console.log(descriptor.enumerable); //false
console.log(typeof descriptor.get); //"function"
```

## 객체 생성

### 팩터리 패턴

- 팩터리 패턴은 특정 객체를 생성하는 과정을 추상화(구체적으로 만드는 구상화의 반대말입니다. 같은 일을 하는 코드에서 공통점을 모아 함수를 만드는 것이 추상화의 좋은 예입니다.)하는 것으로, 소프트웨어 공학에서는 잘 알려진 디자인 패턴입니다.

```javascript
function createPerson(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function() {
    console.log(this.name);
  };

  return o;
}

var person1 = createPerson("Nicholas", 29, "Software Engineer");
var person2 = createPerson("Greg", 27, "Doctor");

person1.sayName(); //"Nicholas"
person2.sayName(); //"Greg"
```

- 다양한 매개변수를 가지고 이 함수를 몇 번이든 호출해도 항상 프로퍼티 세 개와 메서드 한개를 가진 객체를 반환합니다.
- 비슷한 객체를 여러 개 만들 때의 코드 중복 문제는 해결할 수 있지만 생성한 객체가 어떤 타입인지 알 수 없다는 문제는 해결되지 않습니다. (생성된 객체의 `constructor` 로 어떤 생성자를 이용했는지 알 수가 없다는 뜻.)

### 생성자 패턴

- 특정한 타입의 객체를 만드는데 쓰입니다.
- 커스텀 생성자를 만들어서 원하는 타입의 객체에 필요한 프로퍼티와 메서드를 직접 정의할 수 있습니다.

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;

  this.sayName = function() {
    console.log(this.name);
  };
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

- 위 코드는 다음과 같은 특징이 있습니다.
  - 명시적으로 객체를 생성하지 않습니다.
  - 프로퍼티와 메서드는 this 객체에 직접적으로 할당 됩니다.
  - return 문이 없습니다.
- Person의 새 인스턴스를 만들 때는 `new` 연산자를 사용합니다. 생성자를 이런식으로 호출하면 내부적으로는 다음과 같은 과정이 이루어집니다.
  - 객체를 생성합니다.
  - 생성자의 this 값에 새 객체를 할당합니다. 따라서 this가 새 객체를 가리킵니다.
  - 생성자 내부 코드를 실행합니다.(객체에 프로퍼티를 추가합니다.)
  - 새 객체를 반환합니다.
- `constructor` 프로퍼티로 객체의 타입을 알아보는 것 보다 `instanceof` 연산자로 확인하는게 더 안전한 것으로 간주 됩니다.
- 생성자를 직접 만들면 인스턴스 타입을 쉽게 식별할 수 있는데 이는 팩터리 패턴에 비해 장점입니다.

#### 함수로서의 생성자

- 생성자는 결국 함수일 뿐이며, 함수가 자동으로 생성자처럼 동작하게 만드는 특별한 문법 같은 것은 없습니다.
- `new` 연산자와 함께 호출한 함수는 생성자처럼 동작하고 `new` 연산자 없이 호출한 함수는 일반적인 함수에서 예상하는 것과 똑같이 동작합니다.
- **함수를 호출할 때 객체의 메서드로 호출하거나 `call()/apply()`를 통해 호출해서 this의 값을 명시적으로 지정하지 않는다면 this 객체는 항상 Global 객체에 묶인다는 점을 기억해야 합니다.**

#### 생성자의 문제점

- 주요 문제는 인스턴스마다 메서드가 생성된다는 점입니다.
- ECMAScript 에서 함수는 객체이므로 함수를 정의할 때마다 새로운 객체 인스턴스가 생성되는 것이나 마찬가지 입니다.

### 프로토타입 패턴

- 모든 함수는 prototype 프로퍼티를 가집니다.
- prototype 프로퍼티는 **해당 참조 타입의 인스턴스가 가져야할 프로퍼티와 메서드를 담고 있는 객체** 입니다.
- 프로토타입의 프로퍼티와 메서드는 객체 인스턴스 전체에서 공유 된다는 점이 프로토타입의 장점입니다.

```javascript
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
  console.log(this.name);
};

var person1 = new Person();
person1.sayName(); //"Nicholas"
var person2 = new Person();
person2.sayName(); //"Nicholas"
```

#### 프로토타입은 어떻게 동작하는가

- 기본적으로 모든 프로토타입은 자동으로 constructor 프로퍼티를 갖는데 이 프로퍼티는 해당 프로토타입이 프로퍼티로서 소속된 함수(생성자 함수)를 가리킵니다. (Person.prototype.constructor === Person)
- 생성자를 호출해서 인스턴스를 생성할 떄마다 해당 인스턴스 내부에는 생성자의 프로토타입을 가리키는 포인터가 생성됩니다. (person.\_\_proto\_\_)

```javascript
function Person() {}

Person.prototype.constructor = Person;

const person1 = new Person();
const person2 = new Person();

person1.__proto__ = Person.prototype;
person2.__proto__ = Person.prototype;
```

- \_\_proto\_\_ 는 구현 환경에 따라 접근 불가능할 수도 있지만 객체 사이에 프로토 타입 연결이 존재하는지 `isPrototypeOf()` 메서드를 통해 알 수 있습니다.
- ESCMAScript 5판에는 \_\_proto\_\_ 을 값을 반환하는 `Object.getPrototypeOf()` 라는 메서드가 추가 되었습니다.
- 객체에서 프로퍼티를 읽으려 할 때마다 해당 프로퍼티 이름으로 찾으려고 검색 합니다.
- 검색은 객체 인스턴스 자체에서 시작합니다. 인스턴스에서 프로퍼티 이름을 찾으면 그 값을 반환하지만 프로퍼티를 찾지 못하면 포인터를 프로토타입으로 올려서 검색을 계속합니다. 프로퍼티를 프로토타입에서 찾으면 그 값을 반환합니다.
- 프로토타입 프로퍼티와 같은 이름의 프로퍼티를 인스턴스에 추가하면 해당 프로퍼티는 인스턴스에 추가되며 프로토타입까지 올라가지 않습니다.
- 일단 객체 인스턴스에 프로퍼티를 추가하면 해당 프로퍼티는 프로토 타입에 존재하는 같은 이름의 프로퍼티를 `가립니다.`
- 인스턴스에 프로퍼티가 있으면 프로토타입에 존재하는 같은 이름의 프로퍼티에 대한 접근은 차단됩니다. 하지만 delete 연산자는 인스턴스 프로퍼티를 완전히 삭제하며 다음과 같이 prototype 프로퍼티에 다시 접근할 수 있습니다.
- `hasOwnProperty()` 메서드는 프로퍼티가 인스턴스에 존재하는지 프로토타입에 존재하는지 확인합니다. 이 메서드는 Object로부터 상속한 것인데 해당 프로퍼티가 `객체 인스턴스에 존재할 때만 true`를 반환합니다.

#### 프로토타입과 in 연산자

- in 연산자에는 두 가지 쓰임이 있습니다.
  - 하나는 그 자체로서 사용하는 경우
  - for-in 루프에서 사용하는 경우
- 그 자체로서 사용하는 경우 in 연산자는 주어진 이름의 프로퍼티를 객체에서 접근할 수 있을 때, 다시말해 해당 프로퍼티가 인스턴스에 존재하든 프로토타입에 존재하든 모두 true를 반환합니다.

```javascript
var person1 = new Person();
var person2 = new Person();

console.log(person1.hasOwnProperty("name")); //false
console.log("name" in person1); //true

person1.name = "Greg";
console.log(person1.name); //"Greg"  from instance
console.log(person1.hasOwnProperty("name")); //true
console.log("name" in person1); //true

console.log(person2.name); //"Nicholas"  from prototype
console.log(person2.hasOwnProperty("name")); //false
console.log("name" in person2); //true

delete person1.name;
console.log(person1.name); //"Nicholas" - from the prototype
console.log(person1.hasOwnProperty("name")); //false
console.log("name" in person1); //true
```

- for-in 루프를 사용할 때는 객체에서 접근할 수 있고 나열(enumerate)가능한 프로퍼티를 반환하는데, 여기에는 인스턴스 프로퍼티와 프로토타입 프로퍼티가 모두 포함됩니다.
- 인스턴스 프로퍼티 중 나열 불가능한 prototype 프로퍼티(Enumerable이 false로 지정된 프로퍼티)를 `가리고 있는` 프로퍼티 역시 (인스턴스 프로퍼티로 재 지정한 프로퍼티들) for-in 루프에서 반환되는데 , 개발자가 지정한 프로퍼티는 항상 나열 가능하도록 한 규칙때문이다. ( IE8 및 이전버전에서는 적용 안됨 )
- ECMAScript 5판의 `Object.keys()` 메서드를 통해 객체 인스턴스에서 나열 가능한 프로퍼티의 전체 목록을 얻을 수 있습니다.

```javascript
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
  console.log(this.name);
};

var keys = Object.keys(Person.prototype);
console.log(keys); //"name,age,job,sayName"

var p1 = new Person();
p1.name = "Rob";
p1.age = 31;
var p1keys = Object.keys(p1);
console.log(p1keys); // "name,age"
```

- 나열 가능 여부와 관계없이 인스턴스 프로퍼티 전체 목록을 얻으려면 `Object.getOwnPropertyNames()` 메서드를 같은 방법으로 사용합니다.

```javascript
function Person() {}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function() {
  console.log(this.name);
};

var keys = Object.getOwnPropertyNames(Person.prototype);
console.log(keys); //"constructor,name,age,job,sayName"
```

#### 프로토타입의 대체 문법

- 프로토타입에 기능을 더 가독성 있게 캡슐화하는 패턴이 더 널리 쓰입니다.

```javascript
function Person() {}

Person.prototype = {
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  sayName: function() {
    console.log(this.name);
  },
};

var friend = new Person();

console.log(friend instanceof Object); //true
console.log(friend instanceof Person); //true
console.log(friend.constructor == Person); //false
console.log(friend.constructor == Object); //true
```

- 요약하면 이 문법은 기본 prototype 객체를 완전히 덮어쓰는데, 결과적으로 constructor 프로퍼티는 함수 자체가 아니라 완전히 새로운 객체의 생성자 (Object 생성자) 와 같습니다.
- constructor의 값이 중요하다면 다음과 같이 적절한 값을 지정하자.

```javascript
function Person() {}

var friend = new Person();

Person.prototype = {
  constructor: Person,
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  sayName: function() {
    console.log(this.name);
  },
};
```

- 이런식으로 생성자를 재설정하면 프로퍼티의 \[\[Enumerable\]\] 속성이 true로 지정됩니다. 네이티브 constructor 프로퍼티는 기본적으로 나열 불가능한 프로퍼티이므로 ECMAScript 5판을 구현한 자바스크립트 엔진이라면 `Object.defineProperty()`를 쓰는 편이 좋습니다.

```javascript
Object.defineProperty(Person.prototype, "constructor", {
  enumerable: false,
  value: Person,
});
```

#### 프로토타입의 동적 성질

- 프로토 타입에서 값을 찾는 작업은 적시(런타임) 검색이므로 프로토 타입이 바뀌면 그 내용이 즉시 인스턴스에도 반영이 된다. 심지어는 프로토 타입이 바뀌기 전에 빠져나온 인스턴스도 바뀐 내용을 반영합니다.
- 프로퍼티와 메서드를 언제든 프로토타입에 추가할 수 있고 이들을 즉시 객체 인스턴스에서 사용할 수 있긴 하지만, 전체 프로토타입을 덮어썼을 때에는 다르게 동작할 수 있습니다.
- 인스턴스는 프로토타입을 가리키는 포인터를 가질 뿐 생성자와 연결된 것이 아닙니다.
- 생성자의 프로토타입을 바꾸면 그 이후에 생성한 인스턴스는 새로운 프로토타입을 참조하지만, 그 이전에 생성한 인스턴스는 바꾸기 전의 프로토타입을 참조합니다.

```javascript
function Person() {}

// friend 의 프로토타입은 바꾸기 전의 프로토 타입을 참조한다.
var friend = new Person();

Person.prototype = {
  constructor: Person,
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  sayName: function() {
    console.log(this.name);
  },
};

friend.sayName(); //error
```

### 네이티브 객체 프로토타입

- 네이티브 참조 타입(Object, Array, String 등)의 메서드 역시 생성자의 프로토타입에 정의되어 있습니다. 예를 들어 sort() 메서드는 Array.prototype에 존재하고 substring() 메서드는 String.prototype에 정의되어 있습니다.
- 네이티브 객체의 프로토타입을 통해 기본 메서드를 참조할 수 있고 새 메서드를 정의할 수도 있습니다.

#### 프로토타입의 문제점

- 모든 인스턴스가 기본적으로 같은 프로퍼티를 값을 갖게 됩니다.
- 인스턴스 프로퍼티에 값을 할당하면 prototype 프로퍼티를 가릴 수 있습니다.
- 프로퍼티가 참조 값을 포함한 경우 입니다.

```javascript
function Person() {}

Person.prototype = {
  constructor: Person,
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  friends: ["Shelby", "Court"],
  sayName: function() {
    console.log(this.name);
  },
};

const person1 = new Person();
const person2 = new Person();

person1.friends.push("Van");

console.log(person1.friends); // "Shelby", "Court", "Van"
console.log(person2.friends); // "Shelby", "Court", "Van"
console.log(person1.friends === person2.friends); // true
```

- 일반적으로 인스턴스 프로퍼티는 해당 인스턴스만의 특징으로 쓰기 마련입니다. 이 때문에 프로토타입 패턴을 있는 그대로만 사용하는 경우는 드뭅니다.

### 생성자 패턴과 프로토타입 패턴의 조합

- 생성자 패턴으로 인스턴스 프로퍼티를 정의하고 프로토타입 패턴으로 메서드와 공유 프로퍼티를 정의하는 방법 이런 접근법을 통하면 모든 인스턴스는 자신만의 인스턴스 프로퍼티를 가질 수 있고, 참조 방식을 통해 메서드는 공유하므로 메모리를 절약할 수 있습니다.

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends = ["Shelby", "Court"];
}

Person.prototype = {
  constructor: Person,
  sayName: function() {
    console.log(this.name);
  },
};

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1.friends.push("Van");

console.log(person1.friends); //"Shelby,Court,Van"
console.log(person2.friends); //"Shelby,Court"
console.log(person1.friends === person2.friends); //false
console.log(person1.sayName === person2.sayName); //true
```

### 동적 프로토타입 패턴

- 동적 프로토타입 패턴은 모든 정보를 생성자 내부에 캡슐화 하여 이런 혼란을 해결하면서도, 필요한 경우에는 프로토타입을 생성자 내부에서 초기화하여 생성자와 프로토타입을 모두 쓰는 장점은 취하려는 접근법 입니다.

```javascript
function Person(name, age, job) {
  // properties
  this.name = name;
  this.age = age;
  this.job = job;

  // methods
  if (typeof this.sayName !== "function") {
    Person.prototype.sayName = function() {
      console.log(this.name);
    };

    Person.prototype.sayJob = function() {
      console.log(this.job);
    };
  }
}

var friend1 = new Person("Nicholas", 29, "Software Engineer");
// friend2 가 생성될 당시에는 이미 prototype에 sayName과 sayJob 메서드가 존재하기에 추가적으로 생성되지 않는다.
var friend2 = new Person("Greg", 30, "Jounalist");
friend1.sayName(); // Nicholas
friend2.sayJob(); // Jounalist
```

- sayName() 메서드가 존재하지 않는다면 추가하는 역할입니다. 이 코드 블록은 생성자가 첫 번째로 호출된 다음에만 실행됩니다. 그 다음 프로토타입이 초기화되며 그 이상 어떤 변경도 필요 없습니다.

### 기생 생성자 패턴

- 기생 생성자 패턴은 보통 다른 패턴이 실패할 때 폴백으로 씁니다. 이 패턴의 아이디어는 일반적인 생성자처럼 보이지만 사실 다른 객체를 생성하고 반환하는 동작을 래퍼 생성자로 감싸는 겁니다.

```javascript
function Person(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function() {
    console.log(this.name);
  };

  return o;
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName(); //"Nicholas"
```

- 이 예제에서는 Person 생성자가 새 객체를 생성한 다음 프로퍼티와 메서드를 초기화 하여 반환합니다. 생성자가 값을 반환하지 않을때는 기본적으로 새 객체 인스턴스(Person객체의 인스턴스인 this)을 반환합니다. 생성자 마지막에 return 문을 추가함으로써 생성자를 호출했을 때 반환되는 값을 오버라이드 할 수 있습니다.

- 이 패턴은 new 연산자를 써서 함수를 생성자로 호출하는 점을 제외하면 팩터리 패턴과 완전히 같습니다.

- 이 패턴을 쓰면 다른 방법으로는 불가능한 객체 생성자를 만들 수 있습니다. 예를 들면 메서드를 추가한 특별한 배열을 만들고 싶다고 한다면 Array 생성자에 직접 접근할 수는 없지만 이 패턴을 사용하면 이런 제한을 우회할 수 있습니다.

```javascript
function SpecialArray() {
  //create the array
  var values = new Array();

  //add the values
  values.push.apply(values, arguments);

  //assign the method
  values.toPipedString = function() {
    return this.join("|"); // join 메서드는 Array 메서드
  };

  //return it
  return values;
}

var colors = new SpecialArray("red", "blue", "green");
console.log(colors.toPipedString()); // "red|blue|green"
console.log(colors instanceof SpecialArray); // false
```

- 이를 모두 실행하면 `SpecialArray` 생성자에 배열의 초기 값을 넘겨 호출할 수 있고, 생성자가 반환하는 배열에서는 `toPipedString()` 메서드를 사용할 수 있습니다.
- 반환된 객체와 생성자 또는 생성자의 프로토타입 사이에 아무 연결고리가 없다는 점입니다. 반환된 객체는 생성자와 아무 상관도 없다는 듯 존재합니다. 따라서 `instancof` 연산자로는 이 객체의 타입을 알 수 없습니다.

### 방탄 생성자 패턴

- 자바스크립트에는 공용 프로퍼티가 없고 메서드가 this를 참조하지 않는 객체를 가리키는 '방탄(durable)객체' 라는 용어가 있습니다.
- 방탄 객체는 this나 new의 사용을 금지하는 보안환경, 매시업 애플리케이션 등에서 데이터를 써드파티 보호하는데 가장 잘 어울립니다.
- '방탄 생성자'는 기생 생성자 패턴과 비슷한 패턴으로 만드는 생성자인데 차이점은 두가지가 있습니다.
  - 첫째, 생성된 객체의 인스턴스 메서드가 this를 참조하지 않습니다.
  - 둘째, 생성자를 new 연산자를 통해 호출하는 경우가 결코 없습니다.

```javascript
function Person(name, age, job) {
  //반환할 객체를 생성합니다.
  var o = new Object();

  // 옵션: 변수와 함수는 여기서 정의합니다.

  // 메서드를 등록합니다.
  o.sayName = function() {
    alert(name); // name에 접근할 수 없다.
  };

  return o;
}

var friend = Person("Nicholas", 29, "sftware Engineer");

friend.sayName();
```

- 이 패턴에서 눈여결 볼 부분은 반환된 객체의 name 값에 접근할 방법이 없다는 겁니다. `sayName()`메서드를 통해 그 값을 알 수는 있지만 그 외에는 방법이 전혀 없습니다.
- `friend` 변수 역시 방탄 객체이며 객체에 등록된 메서드를 호출하지 않고서는 이 객체가 간직하는 데이터에 접근할 방법이 전혀 없습니다.
- 써드파티 코드에서 이 객체에 메서드나 데이터를 추가할 수는 있지만, 객체를 생성할 때 생성자에 넘겼던 원래 데이터에는 접근할 수 없습니다.
- 기생 생성자 패턴과 마찬가지로 방탄 생성자와 방탄 객체 인스턴스 사이의 연결은 존재하지 않으므로 `instanceof`는 동작하지 않습니다.
