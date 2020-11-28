---
title: OOP 패턴으로 리팩토링
date: "2020-11-22T10:00:03.284Z"
tags:
  - javascript
  - OOP
  - refactoring
keywords:
  - OOP
  - refactoring
---

> 이 글은 `리팩토링 자바스크립트` 책의 9장을 정리한 내용입니다.

## 템플릿 메서드

- 템플릿 메서드 패턴은 최소한의 변형으로 같은 목적을 수행하는 두 알고리즘이 있을 때 유용하다.
- 두 하위 클래스의 함수의 일부(공통적으로 수행해야 하는 추상화로직)를 부모 클래스로 옮기는 것이다.

```javascript
class Person {
  log(number) {
    console.log(this.whatIs(number));
  }
}

class BinaryKnower extends Person {
  whatIs(number) {
    return Number("0b" + number);
  }
}

class BinaryOblivious extends Person {
  whatIs(number) {
    return number;
  }
}

const personOne = new BinaryKnower();
const personTwo = new BianryOblivious();

[personOne, personTwo].forEach((person) => person.log(10));
```

- 위 코드를 함수형 코드로 변형 시키자면 다음과 같을 것이다.

```javascript
function log(fun, number) {
  console.log(fun(nubmer));
}

function whatIsBinary(number) {
  return Number("0b" + number);
}
function whatIs(number) {
  return number;
}
[whatIsBinary, whatIs].forEach((fun) => log(fun, 10));
```

## 전략

- 템플릿 메서드는 상위 클래스의 조건부 구현을 하위 클래스를 이용해서 제거할 수 있게 도와 주었다.
- 전략 패턴은 부모 객체에 전략(함수)를 붙여 하위 클래스를 제거할 수 있게 한다.

```javascript
class Person {
  constructor(whatIs) {
    this.whatIs = whatIs;
  }

  log(number) {
    console.log(this.whatIs(number));
  }
}

// 여기서 인자로 넘기는 함수를 전략이라고 생각하자.
// 인자로 넘기는 함수를 이름을 지정하고 추출할 수도 있다.
const personOne = new Person((number) => Number("0b" + number));
const personTwo = new Person((number) => number);

[personOne, personTwo].forEach((person) => person.log(10));
```

- 전략은 개별적으로 유지하는 것이 가장 좋다.
- 전략을 객체로 생성하여 전체 코드를 다음과 같이 만들 수 있다. 예를 들어 다음고 ㅏ같다.

```javascript
class Person {
  constructor(whatIs) {
    this.whatIs = whatIs;
  }

  log(number) {
    console.log(this.whatIs(number));
  }
}

const binary = {
  aware(number) {
    return Number("0b" + number);
  }

  oblivious(number) {
    return number;
  }
}
```

## 상태

- 상태 패턴의 핵심은 객체에 '속한 것'으로 생각될 수 있는 부분을 다른 객체로 옴기려는 의지다.
- 전략 패턴에서는 각 조건마다 전략으로 만들어서 알맞는 전략을 심어주는데 이는 조건이 많아지면 전략이 복잡해질 수 있다. 해서 가장 간단한 방법은 `Person` 의 인스턴스 들이 각 상태를 모두 포함하게 하는 것이다.

```javascript
class Person {
  // 모든 지식을 다 알게끔한다.
  constructor(binaryKnowledge) {
    this.binaryKnowledge = binaryKnowledge;
  }

  change(binaryKnowledge) {
    this.binaryKnowledge = binaryKnowledge;
  }
}

const binaryAwareness = {
  read(number) {
    return Number("0b" + number);
  }

  and(numberOne, numberTwo) {
    return numberOne && numberTwo;
  }

  xor(numberOne, numberTwo) {
    return numberOne ^ numberTwo;
  }

  forget(person) {
    person.change(binaryObliviousness);
  }
}

const binaryObliviousness = {
  read(number) {
    return number
  }

  and(numberOne, numberTwo) {
    return 'unkonwn'
  }

  xor(numberOne, numberTwo) {
    return 'unkonwn'
  }

  learn(person) {
    person.change(binaryAwareness);
  }
}

const personOne = new Person(binaryAwareness);
const personTwo = new Person(binaryObliviousness);

[personOne, personTwo].forEach((person) => {
  console.log(person.binaryKnowledge.read(10));
  console.log(person.binaryKnowledge.and(2, 3));
  console.log(person.binaryKnowledge.xor(2, 3));
});
```

- 위 코드에서 위험한 점은 다음과 같은 코드를 만났을 때 이다.
- 아래 코드는 모든 `binaryObliviousness` 를 지닌 `person`의 read 함수를 변경 시킬 우려가 있다.
- `Person`에 불변 객체를 지니게 만들 수 있는 가장 쉬운 방법은 `new`를 사용하는 것이다.

```javascript
personTwo.binaryKnowledge.read = () => `redefined on both objects`;
```

- 불변 객체를 갖게끔 하는 또 다른 방법은 `Object.create` 를 사용하여 Person 생성자의 binaryKonwledge를 래핑하는 것이다.

```javascript
class Person {
  constructor(binaryKnowledge) {
    this.binaryKnowledge = Object.create(binaryKnowledge);
  }

  change(binaryKnowledge) {
    this.binaryKnowledge = Object.create(binaryKnowledge);
  }
}
```

- 또 하나 어색한점은 각 상태에서 person 객체를 인자로 받고 있다는 점이다.
- 이는 `Object.assign()` 을 사용하여 `binaryKnowledge` 와 `person` 객체 사이의 양방향 연결을 설정해서 해결할 수 있습니다.

```javascript
class Person {
  constructor(binaryKnowledge) {
    this.binaryKnowledge = Object.create(
      Object.assign({ person: this }, binaryKnowledge)
    );
  }

  change(binaryKnowledge) {
    this.binaryKnowledge = Object.create(
      Object.assign({ person: this }, binaryKnowledge)
    );
  }
}

const binaryAwareness = {
  forget() {
    this.person.change(binaryObliviousness);
  },
};

const binaryObliviousness = {
  learn() {
    this.person.change(binaryAwareness);
  },
};

personTwo.binaryKnowledge.forget();
personTwo.binaryKnowledge.read = () => `will not assign both`;
[personOne, personTwo].forEach((person) => {
  console.log(person.binaryKnowledge.read(3));
});
```

## null 객체

- 전반적으로 애플리케이션 개발에서 null 객체 패턴은 null 검사의 대안을 제공한다. 따라서 라이브러리, 프레임워크, 모듈을 작성할때 코드를 사용하는 모든 사람의 코드 기반을 'null 에 감염'되지 않게 하려면 이 패턴을 고려할 가치가 있다.
- 하지만 null 값이 어떻게 사용될지에 대한 최종 환경에 따라 각기 다른 null 객체 함수가 필요할 수 있다.

```javascript
class Person {
  constructor(name) {
    this.name new NameString(name);
  }
}

class AnonymousPerson extends Person {
  constructor() {
    super();this.name = new NullString();
  }
}

class NullString {
  capitalize() {
    return this;
  }

  tigerify() {
    return this;
  }

  display() {
    return '';
  }
}

class NameString extends String {
  capitalize() {
    return new NameString(this[0].toUpperCase() + this.substring(1));
  }

  tigerify() {
    return new NameString(`${this}, the tiger`);
  }

  display() {
    return this.toString();
  }
}

const personOne = new Pserson('tony');
const personTwo = new AnonymousPerson('tony');
console.log(personOne.name.capitalize().tigerify().display());
console.log(personTwo.name.capitalize().tigerify().display());
```

## 래퍼 (데코레이터와 어댑터)

```javascript
class Dog {
  constructor() {
    this.cost = 50;
  }

  displayPrice() {
    return `The dog costs ${this.const}.`;
  }
}
```

- 소유하고 있지 않거나 직접 조작하고 싶지 않은 모듈에서 dog 클래스를 가져오려고 할때 좋습니다.
- 불규칙하게 뻗어 있는 거대한 하위클래스에서 지키는 일환으로 좋다.

```javascript
// dog를 특별한 특성으로 꾸미려고 (decorate) dog를 입력으로 취하는 팩토리 함수를 추가 할 수 있다.
function Cute(dog) {
  const cuteDog = Object.create(dog);
  cuteDog.cost = dog.cost + 20;
  return cuteDog;
}
```

- 데코레이터의 노력은 기존 인터페이스에 특성을 추가하는데 집중한다.
- 데코레이터 패턴을 가지고 null을 반환하는 API 문제를 해결해 보자.

```javascript
class Person {
  constructor(name) {
    this.name = new NameString(name);
  }
}

class AnonymousPerson extends Person {
  constructor() {
    super();
    this.name = null; // 이 부분을 내가 따로 건들 수 없다고 했을 때...
  }
}

class NameString extends String {
  capitalize() {
    return new NameString(this[0].toUpperCase() + this.substring(1));
  }

  tigerify() {
    return new NameString(`${this}, the tiger`);
  }

  display() {
    return this.toString();
  }
}

// 여기서 NullString 을 위한 새 코드
class NullString {
  capitalize() {
    return this;
  }

  tigerify() {
    return this;
  }

  display() {
    return "";
  }
}

// name이 null이 되는 것을 막는 일을 합니다.
function WithoutNull(person) {
  personWithoutNull = Object.create(person);
  if (personWithoutNull.name === null) {
    personWithoutNull.name = new NullString();
  }

  return personWithoutNull;
}
```

- 데코레이터와 어댑터는 팩토리 함수로써 가장 적합하다. 그렇다면 어댑터와 데코레이터 차이는 무엇인가?

  - 데코레이터는 몇 가지 구별되는 특성을 추가하는 데 중첩된 래퍼들을 가지기 쉽다.
  - 어댑터는 한 오브젝트와 다른 오브젝트 사이의 인터페이스 매핑에 더 가깝다.

- 어뎁터 패턴은 다음과 같다.

```javascript
class Target {
  hello() {
    console.log("hello");
  }

  goodbye() {
    console.log("goodbye");
  }
}

const formal = new Target();
formal.hello();
formal.goodbye();

class Adaptee {
  hi() {
    console.log("hi");
  }

  bye() {
    console.log("bye");
  }
}

class Adapter {
  constructor(adaptee) {
    this.hello = adaptee.hi;
    this.goodby = adaptee.bye;
  }
}

const adaptedCasual = new Adapter(new Adaptee());
adaptedCasual.hello();
adaptedCasual.goodby();
```

## 퍼사드

- 퍼사드는 사람들이 작성할 필요가 있는 코드를 간소화하고 단순화하려는 목적에서 하나 이상의 API부터 정돈된 하위 집합을 포함하는 인터페이스이다.
- 퍼사드는 복잡한 API를 단순화 하는 작업에 많이 사용된다.
  - ORM(Object Relational Mappers)은 데이터베이스 상호 작용을 단순화하는 데 유용할 수 있습니다.
  - jQuery는 프론트엔드 자바스크립트 및 API와 상호 작용하는 모든 API를 위한 매우 큰 퍼사드라고 할 수 있습니다.

## 컴포지트 패턴

- 이 패턴은 JSON, 객체, document 노드 처럼 데이터 트리를 탐색하는데 적합하다.
  - 여러 개의 객체들로 구성된 복합 객체와 단일 객체를 클라이언트에서 구별 없이 다루게 해주는 패턴 (ex. 컴퓨터이든 키보드이든 전부 컴퓨터 디바이스라고 생각하는 것)

## 빌더 패턴

- 복잡한 객체 생성에 사용되는 이 패턴은 테스트 데이터를 생성하는데 적합하다.

## 옵저버 패턴

- 이 패턴은 게시 및 구독, 이벤트, 관찰 가능 항목에서 볼 수 있다.
