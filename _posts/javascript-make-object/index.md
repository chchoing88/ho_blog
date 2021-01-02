---
title: 객체를 바르게 만들기
date: "2021-01-02T10:00:03.284Z"
tags:
  - javascript
  - object
keywords:
  - object
---

## 원시형

ECMAScript 5 기준으로 다음과 같다.

- 문자열
- 숫자
- Boolean
- null
- undefined

## 객체 리터럴

객체 리터럴은 다음과 같이 선언할 수 있다.

```javascript
const test = { name: 'koko', genus: 'gorilla', genius: 'sing language' }
```

다음은 객체 리터럴이 함수 반환값인 경우다.

```javascript
const amazeTheWorld = function () {
  // ...

  return { name: 'koko', genus: 'gorilla', genius: 'sing language' }
}
```

- 객체 리터럴을 여럿 생성할 때 반복되는 프로퍼티명을 입력하다 보면 실수하기 마련이다.
- TDD 방식으로는 어떤 함수가 원하는 프로퍼티를 지닌 객체를 반환하는지는 충분히 확인 가능하지만 단순 객체 리터럴만으로는 직접 테스트할 방법이 마땅치 않다.
- 단순 객체 리터럴에서는 의존성 주입은 아예 시도조차 해볼 기회가 없지만, 함수는 애플리케이션 시작부에서 의존성을 주입하는 과정에 잘 어울린다.
- 단순 객체 리터럴은 생성 시 검증할 수 없다는 것도 문제다. 생성자는 전달받은 인자를 어떤 식으로든 검증하여 올바른 결과를 보장하지만, 단순 객체 리터럴은 그런 검증을 할 수 없다.
- 객체 리터럴은 한 곳에서 다른 곳으로 데이터 뭉치를 옮길 때 쓰기 편하다. 예를 들어 함수 인자가 많아 그 순서를 정확히 맞추기 쉽지 않을 때 객체 리터럴을 사용하면 유용하다.

## 모듈 패턴

- 데이터 감춤이 주목적인 함수가 모듈 API를 이루는 객체를 반환하게 한다.
- 임의로 함수를 호출하여 생성하는 모듈
- 선언과 동시에 실행하는 함수에 기반을 둔 모듈이 있다.

### 임의 모듈 생성

원하는 시점에 언제라도 생성할 수 있는 모듈로, 모듈 함수를 호출하여 API를 얻는다.

```javascript
const MyApp = MyApp || {};

MyApp.wildLifePreserveSimulator = function (animalMaker) {
  // private
  const animal = [];

  return { 
    addAnimal: function (species, sex) {
      animals.push(animalMaker.make(species, sex))
    },
    getAnimalCount: function () {
      return animal.length
    }
  }
}
```

모듈은 다음과 같이 사용된다.

```javascript
const perserve = MyApp.wildLifePreserveSimulator(realAnimalMaker);
perserve.addAnimal(gorilla, female);
```

animalMaker 같은 의존성을 외부 함수에 주입하여 리터럴에서 참조하게 만들 수도 있다.
임의 모듈 생성 방식으로 만든 모듈은 의존성을 쉽게 주입할 수 있다.
다른 모듈에 주입할 수 있어 확장성이 좋다.

### 즉시 실행 모듈 생성

외부 함수를 선언하자마자 실행하는 방법이다.
반환된 API는 이름공간을 가진 전역 변수에 할당된 후 해당 모듈의 싱글톤 인스턴스가 된다.

```javascript
const MyApp = MyApp || {};

MyApp.wildLifePreserveSimulator = (function (animalMaker) {
  // private
  const animal = [];

  return { 
    addAnimal: function (species, sex) {
      animals.push(animalMaker.make(species, sex))
    },
    getAnimalCount: function () {
      return animal.length
    }
  }
}()); // <-- 즉시 실행한다.
```

함수 즉시 실행 시 의존성을 가져오지 못하면 외부 함수에 주입할 수 없다.
싱글톤이 꼭 필요하다면 임의 모듈 패턴으로 모듈을 코딩하고 해당 모듈을 요청할때마다 의존성 주입 프레임워크에서 같은 인스턴스를 제공하는 편이 의존성 주입 측면에서 더 낫다.

### 모듈 생성의 원칙

- 단일 책임 원칙에 따라 한 모듈에 한 가지 일만 시키자. 그래야 결속력이 강하고 다루기 쉬운 API를 작성하게 된다.
- 모듈 자신이 쓸 객체가 필요하다면 의존성 주입 형태로 이 객체를 제공하는 방안을 고려하라.
- 다른 객체 로직을 확장하는 모듈은 해당 로직의 의도가 바뀌지 않도록 분명히 밝혀라. (리스코프 치환 원칙)

## 객체 프로토타입과 트로토타입 상속

### 프로토타입 상속

ECMAScript 5 부터 나오는 Object.create 메서드를 사용하면 기존 객체와 프로토타입이 연결 된 객체를 새로 만들 수 있다.

```javascript
const ape = { 
  hasThumbs: true, 
  hasTail: false, 
  swing: function () {
    return '매달리기'
  }
}

const chimp = Object.create(ape);
const bonobo = Object.create(ape);
bonobo.habitat = '중앙 아프리카';

// chimp의 __proto__ 는 ape
// bonobo의 __proto__ 는 ape
```

위 코드에서 ape는 공유 프로퍼티라서 수정하면 chimp와 bonobo 모두에 즉시 영향을 미친다.

### 프로토타입 체인

프로토타입 체인 이라는 다층 프로토타입을 이용하면 여러 계층의 상속을 구현할 수 있다.

```javascript
const primate = { 
  stereoscopicVision: true
}

const ape = Object.create(primate);
ape.hasThumbs = true;
ape.hasTail = false;
ape.swing = function () {
  return '매달리기';
}

const chimp = Object.create(ape);

console.log(chimp.hasTail); // false (ape 프로토타입)
console.log(chimp.stereoscopicVision) // true (primate 프로토타입)
```

## new 객체 생성

new 키워드를 앞에 붙여 생성자 함수를 실행하면 다음과 같이 실행이 된다.

1. 빈 객체를 하나 만든다.
2. 새 객체의 프로토타입(\_\_proto\_\_)을 생성자 함수의 프로토타입 프로퍼티(prototype)에 연결한다.
3. 생성자 함수를 this로 실행하여 새 객체를 찍어낸다.

instanceof의 작동 원리는 다음과 같다.

- instanceof의 우변 피연산자의 프로토타입이 좌변 피연산자의 프로토 타입 체인에 있는지 확인해본다.
- 만약 있으면 좌변 피연산자는 우변 피연산자의 인스턴스라고 결론 내린다.

### new를 사용하도록 강제

```javascript
function Marsupial(name, nocturnal) {
  if(!(this instanceof Marsupial)) {
    return new Marsupial(name, nocturnal);
  }
}

// 하지만 에러를 내는게 더 옳다고 본다.
function Marsupial(name, nocturnal) {
  if(!(this instanceof Marsupial)) {
    throw new Error('이 객체는 new를 사용하여 생성해야 합니다')
  }
}
```

함수 프로퍼티를 생성자 함수의 프로토타입에 정의하면 객체 인스턴스를 대량 생성할 때 함수 사본 개수를 한 개로 제한하여 메모리 점유율을 낮추고 성능까지 높이는 추가 이점이 있다.

## 클래스 상속

### 고전적 상속 흉내 내기

```javascript
function Marsupial(name, nocturnal) {
  // ...
}

Marsupial.prototype.isAwake = function () {
  // ...
}

function Kangaroo(name) {
  // ...
}

Kangaroo.prototype = new Marsupial();
Kangaroo.prototype.hop = function {
  // ...
}
```

위 코드는 결론적으로 Kangaroo의 프로토타입이 된 Marsupial 인스턴스에 hop 함수를 추가하여 확장할 수 있게 됐다.
hop 함수는 Marsupial 생성자 함수는 물론 Marsupial 생성자 함수의 프로토타입 어느쪽에도 추가되지 않는다.

하지만 위 코드처럼 작성하게 되면 코드 반복과 메모리 점유는 피하기 어렵다.

Marsupial 생성자 함수에 인자가 없다. 또한 Kangaroo의 프로토타입을 지정하는 시점은 물론이고 Kangaroo 인스턴스가 만들어지기 전까지 어떤 인자가 올지 알 길이 없다.
프로토타입 지정 시 인자를 알 수 없으므로 Marsupial 함수의 프로퍼티 할당 작업은 Kangaroo 함수에서도 되풀이 된다.

```javascript
function Marsupial(name, nocturnal) {
  // ...
  this.name = name
  this.isNocturnal = nocturnal
}

function Kangaroo(name) {
  // ...
  // 중복을 만들 게 된다.
  this.name = name
  this.isNocturnal = false
}
```

## 함수형 상속

함수형 상속을 하면 데이터를 숨긴 채 접근을 다스릴 수 있다.
고전적 상속 흉내 내기의 생성자 반복 문제를 함수형 상속에서 해결 할 수 있다.

```javascript
const AnimalKingdom = AnimalKingdom || {};

AnimalKingdom.marsupial = function (name, nocturnal) { 

  // ...
  return {
    getName: function () {
      return instanceName;
    },
    getIsNocturnal: function () {
      return instanceIsNocturnal;
    }
  }
}

AnimalKingdom.kangaroo = function (name) {
  const baseMarsupial = AnimalKingdom.marsupial(name, false);

  baseMarsupial.hop = function () {
    // ...
  }

  return baseMarsupial;
}
```

## 멍키 패칭

멍키 패칭은 추가 프로퍼티를 객체에 붙이는 것이다. 다른 객체와 함수를 붙여 객체의 덩치를 불리는 일은 자바스크립트 언어가 제격이다.

```javascript
const MyApp = MyApp || {};

MyApp.Hand = function () {
  this.dataAboundHand = {};
}
MyApp.Hand.prototype.arrangeAndMove = function (sign) {
  this.dataAboundHand = '새로운 수화 동작'
}

MyApp.Human = function (handFactory) {
  this.hands = [handFactory(), handFactory()]
}
MyApp.Human.prototype.useSignLanguage = function (message) {
  const sign = {};
  // 메시지를 sign에 인코딩 한다.
  this.hands.forEach((hand) => {
    hand.arrangeAndMove(sign);
  })

  return '손을 움직여 수화하고 있어.';
}

MyApp.Gorilla = function (handFactory) {
  this.hands = [handFactory(), handFactory()]
}

// 트레이너가 코코에게 수화를 가르쳐 준다.
MyApp.TeachSignLanguageToKoko = (function () {
  const handFactory = function () {
    return new MyApp.Hand();
  }

  // 빈자의 의존서 주입
  const trainer = new MyApp.Human(handFactory);
  const koko = new MyApp.Gorilla(handFactory);

  // 멍키 패칭
  koko.useSignLanguage = trainer.useSignLanguage;

  console.log(koko.useSignLanguage('안녕하세요'))
}());
```

여기서 나중에 빌린 함수에(trainer.useSignLanguage) 다른 요건이 추가될 가능성이 항상 있기에 패치를 관장하는 빌려주는 객체가 빌리는 객체가 요건을 충족하는지 알아보게 하는 것이 가장 좋은 멍키 패칭 방법이다.

```javascript
MyApp.Human.prototype.endowSigning = function (receivingObject) {
  if(typeof receivingObject.getHandCount === 'function'
    && receivingObject.getHandCount() >= 2 
  ) {
    receivingObject.useSignLanguage = this.useSignLanguage;
  } else {
    throw new Error('너에게는 수화를 가르쳐줄 수 없어');
  }
}

// 멍키패칭
trainer.endowSigning(koko);
```

이런 식으로 한 객체의 기능 다발 전체를 다른 객체로 패치할 수도 있다.
