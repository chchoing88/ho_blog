---
title: Javascript OOP Inherit
date: "2020-08-02T10:00:03.284Z"
tags:
  - javascript
  - oop
  - inherit
keywords:
  - oop
---

## 상속

- ECMAScript에서는 구현 상속만 지원하며 구현 상속은 대개 프로토타입 체인을 통해 이루어집니다.

### 포로토타입 체인

- 프로토타입 체인의 기본 아이디어는 프로토 타입 개념을 이용해 두 가지 참조 타입 사이에서 프로퍼티와 메서드를 상속한다는 것입니다. 모든 생성자에는 생성자 자신을 가리키는 프로토타입 객체가 있으며 인스턴스는 프로토타입을 가리키는 내부 포인터가 있습니다. 그렇다면 프로토 타입이 사실 다른 타입의 인스턴스라면 어떨까요? 이런 경우에는 프로토타입(A) 자체에 다른 프로토타입(B)을 가리키는 포인터가 있을 것이며, B에는 또 다른 생성자를 가리키는 포인터가 있을 겁니다.

```javascript
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function() {
  return this.property;
};

function SubType() {
  this.subproperty = false;
}

//inherit from SuperType

SubType.prototype = new SuperType();

//새 프로토타입은 SuperType의 인스턴스이므로 SuperType 인스턴스가 가질 프로퍼티와 메서드 외에 SuperType의 프로토타입을 가리키는 포인터도 가집니다.

SubType.prototype.getSubValue = function() {
  return this.subproperty;
};

var instance = new SubType();

console.log(instance.getSuperValue()); //true
```

- SubType의 기본 프로토타입 대신 새 프로토타입이 할당되었습니다.

- 새 프로토타입은 SuperType의 인스턴스이므로 SuperType 인스턴스가 가질 프로퍼티와 메서드 외에 SuperType의 프로토타입을 가리키는 포인터도 가집니다.

- 즉, instance는 SubType.prototype을 가리키고 Subtype.prototype은 Super.prototype을 가리킵니다.

- getSuperValue() 메서드는 SuperType.prototype 객체에 남지만 property는 SubType.prototype에 존재함을 눈여겨 보십시오.

- 이렇게 되는 것은 getSuperValue()이 프로토타입 메서드이며 property는 인스턴스 프로퍼티이기 때문입니다. SubType.prototype은 SuperType의 인스턴스 이므로 property는 SubType.prototype에 저장됩니다.

- SubType.prototype의 constructor 프로퍼티를 덮어썼으므로 instance.construcor가 SuperType을 가리키는 점도 살펴보십시오.

- instance.getSuperValue()를 호출하면 3단계로 검색합니다. 1) 인스턴스에서, 2) SubType.prototype에서 3) SuperType.prototype에서 검색하며 3단계에서 메서드를 찾습니다.

- 프로토타입과 인스턴스 사이의 관계는 두가지 방법으로 알아볼 수 있습니다.

- 첫번째 방법은 instanceof 연산자 입니다. instanceof 연산자는 다음과 같이 인스턴스 생성자가 프로토타입 체인에 존재할때 true를 반환합니다.

```javascript
console.log(instance instanceof Object); //true

console.log(instance instanceof SuperType); //true

console.log(instance instanceof SubType); //true
```

- 두번째 방법은 isPrototypeOf() 메서드입니다. 체인에 존재하는 각 프로토타입은 모두 isPrototypeOf() 메서드를 호출할 수 있는데 이 메서드는 다음과 같이 체인에 존재하는 인스턴스에서 true를 반환합니다.

```javascript
console.log(Object.prototype.isPrototypeOf(instance)); //true

console.log(SuperType.prototype.isPrototypeOf(instance)); //true

console.log(SubType.prototype.isPrototypeOf(instance)); //true
```

- 하위타입에서 상위 타입의 메서드를 오버라이드(메서드 덮어쓰기)하거나 상위 타입에 존재하지 않는 메서드를 정의해야 할 때가 많습니다. 이렇게 하려면 반드시 프로토타입이 할당된 다음 필요한 메서드를 프로토타입에 추가해야 합니다.

- 아래 예제에서 중요한 점은 두 메서드가 모두 프로토타입이 SuperType의 인스턴스로 할당된 다음 정의되었다는 점.
  한가지 중요한 점은 객체 리터럴을 써서 프로토타입 메서드를 만들면 체인을 덮어쓰는 결과가 되므로 프로토타입 체인과 함께 사용할수가 없다.

```javascript
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function() {
  return this.property;
};

function SubType() {
  this.subproperty = false;
}

//inherit from SuperType
SubType.prototype = new SuperType();

//new method
SubType.prototype.getSubValue = function() {
  return this.subproperty;
};

//override existing method
SubType.prototype.getSuperValue = function() {
  return false;
};

var instance = new SubType();
console.log(instance.getSuperValue()); //false
```

- 첫번째 메서드인 getSubValue()는 SubType에 추가한 메서드입니다. 두번째 메서드인 getSuperVlaue()는 프로토타입 체인에 이미 존재하지만 instance에서 기존 메서드를 가렸습니다.
- 중요한점은 객체 리터럴을 써서 프로토타입 메서드를 만들면 체인을 덮어쓰는 결과가 되므로 프로토타입과 체인과 함께 사용할 수는 없습니다.

```javascript
function SuperType() {
  this.property = true;
}
SuperType.prototype.getSuperValue = function() {
  return this.property;
};
function SubType() {
  this.subproperty = false;
}
//inherit from SuperType
SubType.prototype = new SuperType();
// 메서드를 추가하려는 시도 앞줄을 무효화 합니다.
SubType.prototype = {
  getSubValue: function() {
    return this.subproperty;
  },
  someOtherMethod: function() {
    return false;
  },
};
var instance = new SubType();
console.log(instance.getSuperValue()); //error!
```

- 이렇게 하면 이제 프로토타입에는 SuperType의 인스턴스가 아니라 Object의 인스턴스가 들어있으므로 프로토타입 체인이 끊어져서 SubType과 SuperType 사이에는 아무 관계도 없습니다.

- 프로토타입 체인은 강력한 상속 방법이지만 문제도 있습니다. 주요문제는 참조값을 포함한 프로토타입과 관련이 있습니다. 프로토타입 프로퍼티에 들어있는 참조 값이 모든 인스턴스에서 공유된다는 사실을 상기하십시오. 이 때문에 프로퍼티는 일반적으로 프로토타입 대신 생성자에 정의합니다. 프로토타입으로 상속을 구현하면 프로토타입이 다른 타입의 인스턴스가 되므로 처음에 인스턴스 프로퍼티였던 것들이 프로토타입 프로퍼티로 바뀝니다. (즉, 공유를 안하려고 한 속성(프로퍼티)들이 프로토타입 체인을 이용함으로써 공유하게 된다. )

```javascript
function SuperType() {
  this.colors = ["red", "blue", "green"];
}
// 공유를 안하려고 만들었던 color배열..
function SubType() {}

//inherit from SuperType
SubType.prototype = new SuperType();
// 서브타입의 프로토 타입에 새로운 생성자 정의
// 객체가 만들어지고 SuperType()에 있던 color값은 새로운 객체 안에 속하게 되고
// 해당 객체를 SubType 프로토타입에 반환.
// SubType 프로토 타입은 SubType의 인스턴스에 모두 공유하는 성질.
// 즉, 공유를 안하려고 만든 color배열을 SubType인스턴스에 모두 공유하는 상황이 생김

var instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors); //"red,blue,green,black"

var instance2 = new SubType();
console.log(instance2.colors); //"red,blue,green,black"
```

- 결국 SubType의 모든 인스턴스에서 color프로퍼티를 공유하게 되어 instance1.colors를 수정하면 instance2.colors 에도 반영이 됩니다. 두번째 문제는 하위 타입 인스턴스를 만들 때 상위 타입생성자에 매개변수를 전달할 방법은 없다.

### 생성자 훔치기

- 기본 아이디어는 매우 단순합니다. 하위타입 생성자 안에서 상위 타입 생성자를 호출하는 겁니다. 함수는 단순히 코드를 특정 컨텍스트에서 실행하는 객체일 뿐임을 염두에 두면 다음과 같이 새로 생성한 객체에서 apply()와 call() 메서드를 통해 생성자를 실행할 수 있음이 이해될것입니다.

```javascript
function SuperType() {
  this.colors = ["red", "blue", "green"];
}

function SubType() {
  //inherit from SuperType

  SuperType.call(this);
}

var instance1 = new SubType();

instance1.colors.push("black");

console.log(instance1.colors); //"red,blue,green,black"

var instance2 = new SubType();

console.log(instance2.colors); //"red,blue,green"
```

- 이 코드는 SuperType() 함수에 들어있는 객체 초기화 코드 전체를 SubType 객체에서 실행하는 효과가 있습니다. 결과적으로 모든 인스턴스가 자신만의 colors프로퍼티를 갖게 됩니다.
- 생성자 훔치기 패턴은 하위 타입의 생성자 안에서 상위 타입의 생성자에 매개변수를 전달할 수 있는데 이는 생성자 훔치기 패턴이 프로토타입 체인보다 나은점중 하나입니다.

```javascript
function SuperType(name) {
  this.name = name;
}

function SubType() {
  //inherit from SuperType passing in an argument

  SuperType.call(this, "Nicholas");

  //instance property

  this.age = 29;
}

var instance = new SubType();

console.log(instance.name); //"Nicholas";

console.log(instance.age); //29
```

- 이 코드에서 SuperType 생성자는 매개변수로 name 하나를 받고 단순히 프로퍼티에 할당하기만 합니다. SubType생성자 내에서 SuperType 생성자를 호출할때 값을 전달할 수 있는데, 이는 SubType인스턴스의 name프로퍼티를 지정하는 결과가 됩니다.

- 생성자 훔치기 패턴만 사용하면 커스텀 타입에 생성자 패턴을 쓸때와 같은 문제가 발생됩니다. 메서드를 생성자 내부에서만 정의해야 하므로 함수 재사용이 불가능해집니다. 게다가 상위 타입의 프로토타입에 정의된 메서드는 하위타입에서 접근할 수 없는 문제도 있습니다.

3. 조합상속

- 조합상속은 프로토타입 체인과 생성자 훔치기 패턴을 조합해 두 패턴의 장점만을 취하려는 접근법입니다. 기본 아이디어는 프로토타입 체인을 써서 프로토타입에 존재하는 프로퍼티와 메서드를 상속하고 생성자 훔치기 패턴으로 인스턴스 프로퍼티를 상속하는 것입니다. 이렇게 하면 프로토타입에 메서드를 정의해서 함수를 재사용할 수 있고 각 인스턴스가 고유한 프로퍼티를 가질 수도 있습니다.

```javascript
function SuperType(name) {
  this.name = name;

  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);

  this.age = age;
}

SubType.prototype = new SuperType();

SubType.prototype.sayAge = function() {
  console.log(this.age);
};

var instance1 = new SubType("Nicholas", 29);

instance1.colors.push("black");

console.log(instance1.colors); //"red,blue,green,black"

instance1.sayName(); //"Nicholas";

instance1.sayAge(); //29

var instance2 = new SubType("Greg", 27);

console.log(instance2.colors); //"red,blue,green"

instance2.sayName(); //"Greg";

instance2.sayAge(); //27
```

- 프로토타입 체인과 생성자 훔치기 패턴의 단점을 모두 해결한 조함상속은 자바스크립트에서 가장 자주 쓰이는 상속 패턴입니다. 조합상속은 instanceOf()와 isPrototypeOf()에서도 올바른 결과를 반환합니다.

### 프로토타입 상속

- 이 방법은 프로토타입을 써서 새 객체를 생성할 때 반드시 커스텀 타입을 정의할 필요는 없다는 데서 출발합니다. 크록포드가 소개한 함수는 다음과 같습니다.

```javascript
function object(o) {
  function F() {}

  F.prototype = o;

  return new F();
}
```

- object() 함수는 임시 생성자를 만들어 주어진 객체를 생성자의 프로토타입으로 할당한 다음 임시 생성자의 인스턴스를 반환합니다. 요약하면 object()는 주어진 객체의 사본 역할을 합니다.

```javascript
var person = {
  name: "Nicholas",

  friends: ["Shelby", "Court", "Van"],
};

var anotherPerson = object(person);

anotherPerson.name = "Greg";

anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);

yetAnotherPerson.name = "Linda";

yetAnotherPerson.friends.push("Barbie");

console.log(person.friends); //"Shelby,Court,Van,Rob,Barbie"
```

- 이 방법에서는 일단 다른 객체의 기반이 될 객체를 만듭니다. 기반 객체를 object()에 넘긴다음 결과 객체를 적절히 수정해야 합니다. 이 예제에서는 person 객체가 기반 객체이므로 object()함수에 넘겨서 새 객체를 반환받았습니다. 새 객체의 프로토타입은 person입니다.

- ECMAScript 5판은 프로토타입 상속의 개념을 공식적으로 수용하여 Object.create() 메서드를 추가했습니다. 이 메서드는 매개변수를 두개 받는데 하나는 다른객체의 프로토타입이 될 객체이며 , 옵션인 다른 하나는 새 객체에 추가할 프로퍼티를 담은 객체입니다. 매개변수를 하나 쓰면 Object.creat()는 object() 메서드와 똑같이 동작합니다.

```javascript
var person = {
  name: "Nicholas",

  friends: ["Shelby", "Court", "Van"],
};

var anotherPerson = Object.create(person);

anotherPerson.name = "Greg";

anotherPerson.friends.push("Rob");

var yetAnotherPerson = Object.create(person);

yetAnotherPerson.name = "Linda";

yetAnotherPerson.friends.push("Barbie");

console.log(person.friends); //"Shelby,Court,Van,Rob,Barbie"
```

- Object.create()의 두번째 매개변수는 Object.defineProperties()의 두번째 매개변수와 같은 형식입니다. 즉 추가할 프로퍼티마다 서술자와 함께 정의하는 형태입니다. 이런식으로 추가한 프로퍼티는 모두 프로토타입 객체에 있는 같은 이름의 프로퍼티를 가립니다.

```javascript
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};

var anotherPerson = Object.create(person, {
  name: {
    value: "Greg",
  },
});

console.log(anotherPerson.name); //"Greg"
```

- 프로토타입 패턴과 마찬가지로 참조 값을 포함하는 프로퍼티들은 모두 그 값을 공유함을 유념하십시오.

### 기생 상속

- '기생상속'이란 개념은 프로토타입 상속과 밀접히 연관된, 인기있는 패턴이다.

- 기본 아이디어는 기생 생성자나 팩터리 패턴과 비슷합니다. 상속을 담당할 함수를 만들고, 어떤 식으로든 객체를 확장해서 반환한다는 겁니다. 기생 상속 패턴은 다음과 같습니다.

```javascript
function createAnother(original) {
  var clone = object(original);

  clone.sayHi = function() {
    alert("hi");
  };

  return clone;
}
```

- 기반 객체 original을 object() 함수에 넘긴 결과를 clone에 할당합니다. 다음으로 clone 객체에 sayHi()라는 메서드를 추가합니다. 마지막으로 객체를 반환합니다.

다음과 같이 활용합니다.

```javascript
var person = {
  name: "Nicholas",

  friend: ["Shelby", "Court", "Van"],
};

var anotherPerson = creatAnother(person);

anotherPerson.sayHi(); // "hi"
```

### 기생 조합 상속

- 조합 상속은 자바스크립트에서 가장 자주 쓰이는 상속 패턴이지만 비효율적인 면도 있습니다. 이 패턴에서 가장 비효율적인 부분은 상위 타입 생성자가 항상 두 번 호출된다는 점입니다. 한 번은 하위 타입의 프로토타입을 생성하기 위해, 다른 한번은 하위 타입 생성자 내부에서 입니다. 하위 타입의 프로토타입은 상위 타입객체의 인스턴스 프로퍼티를 모두 상속하는데, 하위 타입생성자가 실행되는 순간 이를 모두 덮어쓰므로 별 의미가 없습니다.

```javascript
function SuperType(name) {
  this.name = name;

  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name); // SuperType()을 두 번째 호출

  this.age = age;
}

SubType.prototpye = new SuperType(); //SuperType()을 처음 호출

SubType.prototype.constructor = SubType;

SubType.prototype.sayAge = function() {
  alert(this.age);
};
```

- 빨간색으로 표시한 부분은 SuperType 생성자가 실행되는 부분이다. 이 코드가 실행되면 SubTpye.prototype 에는 name과 colors 두 가지 프로퍼티가 남습니다. 이 둘은 SuperType의 인스턴스 포로퍼티였지만 이제는 SubType의 프로토타입에 존재합니다. SubType 생성자를 호출하면 SuperType 생성자 역시 호출되면서 인스턴스 프로퍼티 name과 color를 새 객체에 만드는데 이들은 프로토타입에 존재하는 프로퍼티를 가립니다.

- 이런 문제를 해결 할 수 있는 기본적인 아이디어는 하위타입의 프로토타입을 할당하기 위해 상위 타입의 생성자를 호출할 필요는 없습니다. 필요한건 상위 타입의 프로토타입 뿐입니다. 간단히 말해 기생 상속을 써서 상위 타입의 프로토타입으로부터 상속한 다음 결과를 하위 타입의 프로토타입에 할당합니다. 기생 조합 상속의 기본 패턴은 다음과 같습니다.

```javascript
function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype); //create object

  prototype.constructor = subType; //augment object

  subType.prototype = prototype; //assign object
}
```

- 함수 내부에서 일어나는 첫 단계는 상위 타입의 프로토타입을 복제하는 겁니다. 다음에는 constructor 프로퍼티를 prototype에 할당해서 프로토타입을 덮어쓸 때 기본 constructor 프로퍼티가 사라지는 현상에 대비합니다. 마지막으로 하위 타입의 프로토타입에 새로 생성한 객체를 할당합니다.

```javascript
function object(o) {
  function F() {}

  F.prototype = o;

  return new F();
}

function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype); //create object

  prototype.constructor = subType; //augment object

  subType.prototype = prototype; //assign object
}

function SuperType(name) {
  this.name = name;

  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function() {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);

  this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function() {
  console.log(this.age);
};

var instance1 = new SubType("Nicholas", 29);

instance1.colors.push("black");

console.log(instance1.colors); //"red,blue,green,black"

instance1.sayName(); //"Nicholas";

instance1.sayAge(); //29

var instance2 = new SubType("Greg", 27);

console.log(instance2.colors); //"red,blue,green"

instance2.sayName(); //"Greg";

instance2.sayAge(); //27
```

- 이 예제는 SuperType 생성자를 단 한 번만 호출하므로 SubType.prototype 에 불필요하고 사용하지 않는 프로퍼티를 만들지 않는점에서 효과적입니다. 기생 조합 상속은 참조 타입에서 가장 효율적인 상속 패러다임으로 평가 받습니다.

- 객체를 하나 만들어서 징검다리 해주는 느낌 객체를 하나 만들면 인스턴스에 subType.prototype을 인스턴스 프로토타입에는 SuperType.prototype을 넣어서 결국 subType.prototype이 SuperType.prototype을 가리키게 만드는 기법
