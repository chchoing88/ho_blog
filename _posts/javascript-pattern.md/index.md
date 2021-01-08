---
title: javascript pattern (...ing)
date: "2021-01-01T10:00:03.284Z"
---

## Goal

- 다양한 자바스크립트 패턴을 익히고 어느 상황에서 사용되는지 파악한다.

## Good Javascript

- 일급 객체인 함수를 인자로 주고 반환값으로 돌려받는 형태에 길들어야 한다.
- 자바스크립트 함수는 일급 시민으로서 자신만의 프로퍼티와 메서드를 가질 수 있다.
- 클로저는 꼭 함수 같은 객체지만, 함수 생성 당시 환경을 내부에 고스란히 간직한다.
- this는 함수를 호출한 객체를 참조한다.

## SOLID 원칙

### 단일 책임 원칙

- 모든 클래스, 함수는 반드시 한 가지 변경 사유가 있어야 한다. 특정 함수의 유일한 관심사를 만들자. 어떻게 이행할지는 철저하게 외부에서 제공한 함수에 달려있게 하자.

### 개방/폐쇄 원칙

- 모든 소프트웨어 개체는 확장 가능성은 열어 두되 수정 가능성은 닫아야 한다.
- 어떤 경우라도 실행 코드를 변경하지 말고, 어떻게든 (상속 등의 방법으로) 재사용하고 확장 가능하라는 뜻이다.
- 변경 사항이 생길 만한 것을 추상화하여 함수 밖으로 빼내자.

### 리스코프 치환 원칙

- 어떤 타입에서 파생된 타입의 객체가 있다면 이 타입을 사용하는 코드는 변경하지 말아야 한다.
- 한 객체를 다른 객체에서 파생하더라도 그 기본 로직이 변경되어서는 안 된다는 뜻이다.
- 작성중인 함수가 기반 클래스로 하는 일과 서브 클래스로 하는 일이 다르다면 이 원칙을 어긴 셈이다.

### 인터페이스의 분리 법칙

- 인터페이스란 어떤 기능을 '구현'하지 않고 (명칭, 파라미터, 반환타입을) '서술'만 한 코드 조각이다.
- 함수가 기대하는 인자가 무엇인지 명확히 하고 그 기대치를 최소화해야 한다.
- 특정 타입의 인자를 바라기보다는 이 타입에서 실제로 필요한 프로퍼티가 더러 있을 거라 기대하는 것이다.

### 의존성 역전 원칙

- 상위 수준 모듈은 하위 수준 모듈에 의존해서는 안 되며 이 둘은 추상화에 의존해야 한다.

```javascript
// projection 추상화
function d3_svg_line(projection) {
  // ...
  function line(data) {
    // ... 

    function segment() {
      segments.push('M', interolate(projection(points), tension))
    }
  }
}

d3.svg.line = function () {
  return d3_svg_line(d3_identity);
}

d3.svg.line.radial = function () {
  const line = d3_svg_line(d3_svg_lineRadial);
}
```

### DRY 원칙

- 반복하지 마라
- DRY한 코드로 만드는 과정에 의존성 주입과 단일 책임 문제가 개입된다.
- '지식 조각'을 반복시키지 말자.

## 테스트

### 테스트 더블

- 더미(dummy): 보통 인자 리스트를 채우기 위해 사용되며, 전달은 하지만 실제로 사용되지는 않는다.
- 틀(stub): 더미를 조금 더 구현하여 아직 개발되지 않은 클래스나 메서드가 실제 작동하는 것처럼 보이게 만든 객체로 보통 리턴값은 하드 코딩한다.
- 스파이(spy): 틀과 비슷하지만 내부적으로 기록을 남긴다는 점이 다르다. 특정 객체가 사용되었는지, 예상되는 메서드가 특정 인자로 호출되었는지 등의 상황을 감시하고 이러한 정보를 제공하기도 한다.
- 모의체(fake): 틀에서 조금 더 발전하여 실제로 간단히 구현된 코드를 갖고는 있지만, 운영 환경에서 사용할 수는 없는 객체다.
- 모형(mock): 더미, 틀, 스파이를 혼합한 형태와 비슷하나 행위를 검증하는 용도로 주로 사용된다.

## 경량 의존성 주입 프레임 워크

- DI 프레임워크를 사용하지 않고 의존성 주입(DI)하는 것을 두고 '빈자의 의존성 주입(poor man's dependency injection)'이라 한다.
- 의존성 주입 프레임워크는 다음과 같이 동작한다.
  1. 애플리케이션이 시작되자마자 인젝터블을 확인하고 해당 인젝터블이 지닌 지칭하며 순서대로 DI 컨테이너에 등록한다.
  2. 객체가 필요하면 컨테이너에 요청한다.
  3. 컨테이너는 일단 요청받은 객체와 그 의존성을 모두 재귀적으로 인스턴스화한다. 그런 다음, 요건에 따라 필요한 객체에 각각 주입한다.

```javascript
DiContainer = function() {
  // ...
  this.registrations = [];
}

DiContainer.prototype.register = function (name, dependencies, func) {
  var ix;

  if(typeof name !== 'string' ||
    !Array.isArray(dependencies) ||
    typeof func !== 'function') {
      throw new Error(this.messages.registerRequiresArgs);
    }

  for(ix = 0; ix < dependencies.length; ++ix) {
    if(typeof dependencies[ix] !== 'string') {
      throw new Error(this.messages.registerRequiresArgs);
    }
  }

  this.registrations[name] = { dependencies, func };
}

diContainer.prototype.get = function (name) {
  var self = this;
  var registration = this.registrations[name];
  var dependencies = [];

  if(registration === undefined) {
    return undefined;
  }

  registration.dependencies.forEach(function(dependencyName) {
    var dependency = self.get(dependencyName);
    dependencies.push( dependency === undefined ? undefined : dependency);
  })

  return registration.func.apply(undefined, dependencies);
}

```

## 애스팩트 지향 프로그래밍(AOP)

- 단일한 책임 범위 내에 있지 않은 하나 이상의 객체에 유용한 코드를 한데 묶어 눈에 띄지 않게 객체에 배포하는 기법.
- 배포할 코드 조각을 어드바이스(advice), 어드바이스가 처리할 문제를 애스팩트(aspect) 또는 황단 관심사라고 한다.
- AOP의 핵심은 함수 실행(타깃)을 가로채어 다른 함수(어드바이스)를 실행하기 직전이나 직후, 또는 전후에 실행시키는 것이다.
- around 함수의 핵심 (fnName, advice, fnObj)
  - 원본 함수를 어드바이스로 대체한다.
  - 타깃 정보를 어드바이스에 전달한다. 내부에 원본 타깃 함수를 저장한 객체를 만들어 어드바이스에 넘긴다.
  - 타깃에 넘기는 인자도 함께 전달한다.

```javascript
Aop = {
  around: function (fnName, advice, fnObj) {
    var origianlFn = fnObj[fnName];
    fnObj[fnName] = function () {
      return advice.call(this, {fn: origianlFn, args: arguments})
    }
  },
  // 어드바이스 작성시에 원본 함수를 호출할 수 있도록 해주는 도우미 함수
  next: function (targetInfo) {
    return targetInfo.fn.apply(this, targetInfo.args)
  }
}
```

## 인터페이스

- 인터페이스는 `기능이 정의된 모듈`과 그것을 `사용할 모듈 사이`에 일종의 규약(contract)처럼 쓰인다.
- 인터페이스 분리 원칙은 객체 사용부가 할 일을 단순화하고 변경에 따른 영향도를 개발자가 잘 파악할 수 있게 해준다.

### 규약 정의

- 규약 정의는 규약명과 객체가 규약을 지키는지를 true/false로 반환하는 평가 함수로 이루어진다.

```javascript
// define 시그니처
function define(contractName, evaluator)
```

### 규약을 지키는지 판단

```javascript
// fullfills 메서드 틀
function fullfills(contractName, obj)
```

### 규약을 지킨다고 단언

규약을 지켰는지 여부는 fulfills 메서드를 다시 쓰면 된다.

```javascript
function assert(contractName, obj)
```

### 규약 레지스트리 코드

```javascript
// fullfills 함수
// obj가 규약을 지키면 true, 어기면 false를 반환한다.
var ReliableJavaScript = ReliableJavaScript || {};
ReliableJavascript.contractRegistry = function() {
  'use strict';

  // 등록된 규약
  var registry = {};

  return {
    define: function define(contractName, evaluator) {
      // ...에러 조건문
      registry[contractName] = evaluator
    },
    fullfills: function fullfills(contractName, obj) {
      // ...에러 조건문
      return registry[contractName](obj);
    },
    assert: function assert(contractName, obj) { 
      if(!this.fulfills(contractName, obj)) {
        throw new Error(this.getMessageForFiledContract(contractName, obj))
      }
    },
    attachReturnValidator: function attachReturnValidator(funcName, funcObj, contractName) {
      var self = this;
      if(typeof funcName !== 'string') {
        throw new Error(self.messages.funcNameMustBeString);
      }
      if(typeof funcObj !== 'object') {
        throw new Error(self.messages.funcObjMustBeObject);
      }
      if(typeof contractName !== 'string') {
        throw new Error(self.messages.nameMustBeString);
      }

      Aop.around(funcName,
        function(targetInfo) {
          var ret = Aop.next(targetInfo); // 실제 모듈을 호출해서 객체를 얻는다.
          self.assert(contractName, ret): // 실제 모듈이 contractName을 지켰는지 확인한다.
        }, funcObj)
    },
    messages: {
      // ...
    },
    getMessageForNameNotRegistered: function getMessageForNameNotRegistered(contractName) {
      return this.messages.nameMustBeRegistered.replace('_', contractName)
    },
    getMessageForFiledContract: function getMessageForFiledContract() {
      // ...
    }
  }
}
```

실제 사용 예

```javascript
// attendeeContracts.js
// 이 함수를 호출하여 Conference.attendee() 가 올바르게 attendee를 생성했는지 확인하는 애스팩트를 설치한다.
Conference.attendeeContracts = function attendeeContracts(registry) {
  'use strict';

  var attendeePersonalInfo = 'Conference.attendee.personalInfo';
  var attendeeCheckInManagement = 'Conference.attendee.checkInManagement';

  function fulfillsPersonalInfo(att) {
    //...
  }

  function fullfillsCheckInManagement(att) {
    // ...
  }

  registry.define(attendeePersonalInfo, fulfillsPersonalInfo);
  registry.define(attendeeCheckInManagement, fullfillsCheckInManagement);

  // 실제 Conference의 attendee를 호출해서 attendeePersonalInfo 가 맞는 지 확인한다.
  registry.attachReturnValidator('attendee', Conference, attendeePersonalInfo);
  registry.attachReturnValidator('attendee', Conference, attendeeCheckInManagement);
  
}

var registry = ReliableJavaScript.contractRegistry();
Conference.attendeeContracts(registry);

// 올바르게 생성된 객체인지 애스팩트가 보장한다.
var a = Conference.attendee('Rock', 'Star'); // 예외를 던지지 않음.
```

## Pattern

### Callback pattern

- 콜백은 나중에 실행할 부차 함수(second function)에 인자로 넣는 함수다. 즉, 함수를 넘겨주면 나중에 실행시켜줘 라고 하는 것과 같다.
- 여기서 콜백이 실행될 '나중' 시점이 부차 함수의 실행 완료 이전이면 `동기`(synchronous), 반대로 실행 완료 이후면 `비동기`(asynchronous)라고 본다.

#### 단위 테스트

- 콜백 실행 횟수가 정확한가?
- 콜백이 실행될 떄마다 알맞은 인자가 전달 되는가?
- 스파이 함수를 이용하면 이런일에 제격이다.
- 익명 콜백함수를 곧장 콜백으로 넘기기 보다는 별도의 기능 모듈로 분리할 수 있다면 추출해서 따로 테스트를 진행하자.
- 익명 함수는 디버깅을 매우 어렵게 만든다.

#### 시나리오

- 컨퍼런스에 attend(참가자) 등록을 하는 시스템이 있다.
- 한명 또는 여러명을 한번에 참가 등록을 할수 있다.
- attend(참가자)는 또는 참가자들은 참가자 등록이 되었는지 안되었는지 확인할 수 있다.
- attend(참가자)는 또는 참가자들은 이름을 알 수 있다.

#### code

```javascript
var C = {};

// 참가자 체크인 여부를 비롯한 각종 정보를 attendee 함수가 생성한 객체에 담아둔다.
C.attendee = function(firstName, lastName) { 
  //...

  return { 
    getFullName: function() {},
    isCheckedIn: function() {},
    checkIn: function() {}
  }
}

// singleton
var C.attend = function(name){
  var fullName = name;
  return {
    registry: function() {},
    isRegistry: function() {},
    getFullName: function() {}
  }
}

// 참가자 한명이 생성되었다.
// 참가자는 참가자 등록에 실제 현실에선 수동적이지만 oop 에선 능동적으로 생각한다.
var attendee1 = C.attend('merlin1');
var attendee2 = C.attend('merlin2');

var C.attendeeCollection = function(){
  var attendees = [];

  return {

    contains: function (attendee) {
      return attendees.indexOf(attendee) > -1; // 들어있니??

    },
    add: function (attendee) {
      if (!this.contains(attendee)) {
        attendees.push(attendee);
      }

    },
    remove: function (attendee) {
      var index = attendees.indexOf(attendee);

      if (index > -1) {
        attendees.splice(index, 1);
      }
    },
    getCount: function() {
      return attendees.length;
    },
    iterate: function (callback) {   // 반복..
      // attendees의 각 attendee에 대해 콜백을 실행한다..
      attendees.forEach(callback);

    }

  }
}

var attendees = C.attendeeCollection();
function addAttendeesToCollection(attendeeArray) {
      attendeeArray.forEach(function(attendee) {
        collection.add(attendee);
      });
}
addAttendeesToCollection([attendee1, attendee2]);
attendees.iterate(function doCheckIn(attend) { // 익명의 콜백함수 -> 디버깅 용이함을 위해 이름을 지정한다.
  attend.checkIn();
  // 외부 서비스를 통해 체크인 등록한다.
});

// 참가자 체크인은 중요한 기능이므로 checkInService 자체 모듈에 캡슐화 하자.
// 체크인 로직을 attendeeCollection에서 분리하여 코드를 재사용할 수도 있다.
// 외부 시스템의 체크인 등록 기능을 별도의 책임으로 보고 등록용 객체를 cehckInSevice에 주입하자.
// checkInRecorder 주입
C.checkInService = function(checkInRecorder) {
  const recorder = checkInRecorder;

  return {
    checkIn: function(attendee) { // attendee 주입
      // attendeeCollection 에서의 attendee 한명
      attendee.checkIn();
      recorder.recordCheckIn(attendee);
    }
  }
}

// 다음과 같이 사용
const checkInService = C.checkInService(C.checkInRecorder())
const attendees = C.attendeeCollection()

attendees.iterate(checkInService.checkIn);
```

#### 주의사항

- 콜백을 사용할때는 디버깅에 용이하기 위해 이름을 붙여주자.
- 콜백 헬이 발생할때는 편 코딩으로 해결할수 있다.
- 콜백 함수 안의 this를 주의하자. this 값은 함수를 호출한 (대게 함수 앞에 점으로 연결한) 객체를 가리키지만, 콜백 함수를 만들어 넣을 때 어떤 객체를 참조하라고 직접 지정할 수는 없다. 이런 이유로 콜백 함수는 대부분 this를 명시적으로 가리킨다.

```javascript
var Conference = Conference || {};

// 체크인을 마친 attendeeCollection의 attendee 객체 수를 세는 모듈
Conference.checkedInAttendeeCounter = function() {
  var checkedInAttendees = 0;
  
  return {
    increment: function() {},
    getCount: function() {},
    countIfCheckedIn: function(attendee) {
      if(attendee.isCheckedIn()) {
        // this.increment(); // 이부분의 this 가 문제..
      }
    }
  }
}

// test시에
var count = Conference.checkedInAttendeeCounter();
count.countIfCheckedIn.call({}, attendee) // this가 checkedInAttendeeCounter를 꼭 가리키는건 아니라는걸 판별하자.

// 해결 
Conference.checkedInAttendeeCounter = function() {
  var checkedInAttendees = 0;
  var self = {
    increment: function() {},
    getCount: function() {},
    countIfCheckedIn: function(attendee) {
      if(attendee.isCheckedIn()) {
        // this.increment(); // 이부분의 this 가 문제..
        self.increment();
      }
    }
  }

  return self;
}
```

#### 정리

- 한가지 일을 여러번 수행해야 할때 함수하나를 인자로 보내(콜백 패턴) 여러번 호출을 진행할수 있다.
- A작업이 끝난뒤에 B작업이 수행되어지길 바랄때 콜백 패턴을 이용할 수 있다.

### Promise pattern

- 비동기 액션을 초기화하고 성공과 실패 케이스를 각각 처리할 콜백을 준다.
- 이벤트 기반의 비동기 프로그래밍보다 훨씬 더 이해하기 쉽고 우아하며 탄탄한 코드를 작성할 수 있다.
- '귀결되었다'는 말은 프라미스 숙명이 어느 한쪽으로 결정됐단 뜻이다.
- Promise는 나중에 벌어질 이벤트와 그 성공/실패에 따라 각기 실행할 콜백을 캡슐화한 장치다.
- Promise 생성자의 인자는 비동기 작업을 감싼 함수다. 이 함수는 두 인자, resolve, reject를 받는다. Promise가 귀결 또는 버림 처리될 때 둘중 한 함수가 호출된다.
- Promise 객체의 핵심은 then 메서드로, 콜백 함수 2개를 인자로 취한다.
- Promise가 '귀결되면' 첫 번째 콜백으로 이어지고, 이 콜백은 귀결값을 파라미터로 받는다.
- Promise가 '버려지면' 두 번째 콜백이 실행되고 버림 사유를 파라미터로 받는다. 버림 사유는 보통 Error 객체로 받지만, 단순 문자열도 상관없다.

Promise 기반 코드를 테스트할 때 조심할 함정에 대해서는 다음과 같다.

- 비동기로 작동하는 Promise는 조심하지 않으면 테스트 기대식이 실행될 때 여전히 미결 상태로 남을 수 있다. 그래서 실패해야 할 테스트가 성공한 것처럼 눈속임한다. jasmine은 특별히 비동기 코드 테스팅을 done() 함수로 지원한다.
- XMLHttpRequest를 사용한 코드를 테스트할 때 서버를 직접 호출하지 않고 비동기적인 HTTP 특성을 흉내 내고 싶을 때가 있다. jasmine이 제공하는 AJAX 모의 라이브러리를 사용하면 된다.
- Promise는 구조상 체이닝을 할 수 있다. 경우의 수를 모두 따져보고 의도했던 then 콜백으로 실행 흐름이 이루어지는지 확인하라.

### partial pattern

- 커링 요소에 뭔가 더 보태서 기능을 할 수있게 끔 만드는 패턴이다.
- 인자가 여럿 있고 그중 일부는 값이 불변인 함수를 쓸 경우가 있다. 이때 같은 값을 계속 반복하기보다 원본함수를 새로운 함수로 감싼 다음, 상수 인자는 건네주고 값이 달라지는 나머지 인자만 표출하는 것이 좋다.
- 값이 불면인 상수 인자를 지난 함수 호출부는 `상수성(constancy)을 캡슐화`하여 함수를 새로 만드는 것이 좋다.
- 커링은 여러 인자를 거느린 함수를 인자 하나만으로 취하는 여러 단계의 함수들로 쪼갠다.

#### 시나리오

- 행사장 근처에 있는 음식점 위치를 알려주는 서드파티 웹 서비스가 있다고 하자.
- `getRestaurantsWithinRadius(address, radiusMiles, cuisine)` 요건상 address와 cuisine부분은 변경의 필요성이 없어 보인다.
- `restaurantApi` 에서 반환하는 api 객체에 새로운 메서드를 집어넣기로 하자.
- address 와 raius 파라미터를 고정한 채 `getRestaurnatsNearConference(cuisine)` 가 `getRestaurantsWithinRadius` 반환값을 무조건 반환하게 하자.

#### 단위 테스트

- 올바른 인자로 기존 api를 잘 호출하고 있는가?
- 기존 api에서 반환되는 값을 잘 반환하고 있는가?

#### code

```javascript
function addGetRestaurantsNearConference(targetInfo) {
    'use strict';

    //ThirdParty.retaurantApi() 가 반환한 원본 API
    var api = Aop.next.call(this, targetInfo); // Aop.next 는 원본 함수에 원본 인자를 넣어 호출해준다...


    //API에 추가할 함수
    function getRestaurantsNearConference(cuisine) {
      return api.getRestaurantsWithinRadius(
        '울산 남구 신정로 20번길 988', 2.0, cuisine);
      // 앞에 2개의 인자는 값이 불변인 상수 인자.

    }

    // 없으면 이 함수를 추가한다
    api.getRestaurantsNearConference = api.getRestaurantsNearConference || getRestaurantsNearConference;

    //수정한 API를 반환한다
    return api;

  },
```

#### 커링

- 커링은 인자를 여럿 취하는 함수를 인자 하나만 받는 함수 여러 개로 해체 하는 기법이다.
- 구체적인 형태를 아주 간단히 표현하면 다음과 같다.

```javascript
function getRestaurantsCurried(address) {
  const self = this;
  return function(radius) {
    return function(cuisine) {
      return self.getRestaurantsWithinRadius(address, radius, cuisine);
    };
  };
}
```

#### 부분 적용 함수

- 부분 적용 함수는 언뜻 인자를 여럿 받는 함수를 더 적은 인자를 받는 함수로 바꾸는 커링과 비슷해 보인다.
- 그러나 위 `addGetRestaurantsNearConference` 구현부를 보면 알 수 있듯이 오히려 정반대에 가깝다.
- 즉, 부분 적용 함수는 이전 단계에서 생성된 커링 요소에 뭔가 더 보태서 부분 적용 함수 버전과 기능이 같은 함수로 만든 것이다.

```javascript
function getRestaurantsNearConference(cuisine) {
  return getRestaurantsCurried("울산")(2.0)(cuisine);
}
```

### memoization pattern

- 일명 기억패턴 , 보통 함수 호출시 전달받은 인자를 키로 그 반환 결과를 어떤 구조체에 저장하고, 같은 키를 인자로 다시 함수를 호출하면 저장해둔 값을 꺼내어 바로 바환한다. 물론, 이때 함수 본체는 그냥 건너 뛴다.

#### 시나리오

- 서드파티 api가 요청 건당 과금을 하는 통해 카드 청구서가 수북하다.
- 그러니 검색 결과를 어디다가 저장해놓았다가 다른 참가자가 같은걸 요구하게 되면 그 데이터를 그대로 반환하면 좋을꺼 같다.
- 현재 제공되고 있는 api에 퍼사드(facade)나 래퍼(wrpper)를 끼워넣고 이전 검색 결과를 저장/반환하는 기능을 붙이면 된다.
- 여기서 퍼스드의 경우에는 프로그래밍을 잘 모르는 사용자에게 최소한의 api만 공개하는, 이렇게 일부만 노출하는 패턴을 퍼사드 패턴이라고 한다.

#### code

```javascript
memoizedRestaurantApi = function (thirdPartyApi) {
  'use strict';

  var api = thirdPartyApi,
    cache = {};

  return {
    getRestaurantsNearConference: function (cuisine) {
      if (cache.hasOwnProperty(cuisine)) {
        return cache[cuisine];
      }

      var returnPromise = api.getRestaurantsNearConference(cuisine);

      cache[cuisine] = returnPromise;
      return returnPromise;
    }
  }
```

### singleton pattern

- 다중 객체 인스턴스를 만들 필요가 없거나, 오히려 만들면 안 될 때도 있다. 이렇게 하나의 객체 인스턴스만 존재해야 할 때는 싱글톤 패턴을 사용한다.

#### 시나리오

- 위에서 생각해봤던 메모이제이션을 적용했던 `restaurantApi` 의 인스턴스(api)가 2개 만들어져서 각각 똑같은 인자로 `getRestaurantsWithinRadius` 함수를 2번 객체를 호출하면 1번 객체의 함수 호출 후 캐시된 결과를 다시 사용할까???
- 여기서 "1번 객체 함수 호출로 캐시된 결과를 다시 사용해" 라고 대답할 수 있어야 한다.
- 이런 인스턴스들이 전부 따로 캐시를 두지 않고 단일 캐시를 공유할 수 있으면 이상적이다.
- 의존성 주입으로 인스턴스간에 캐시 객체를 공유할수 있게 해주면 좋을듯 싶다.

#### code

```javascript
// 공유할 캐시 객체를 주입받는다.
const cache = {}; // 데이터 감춤 따위의 기능은 없다.
memoizedRestaurantApi = function(cache, thirdPartyApi) {
  const restaurantCache = cache || {}; // 캐시를 주입안하면 내부적으로 생성한다.
  //(...)
};
```

- 캐시가 일반적인 객체가 아닌 여러가지 기능을 하는 캐쉬의 역활도 할수 있음 좋겠다. 예를들어 최저 사용빈도 기능과 일정 시간까지만 캐시값을 저장해두는게 더 합리적인 상황도 필요할 수있다.
- 이럴땐 리터럴가지고만은 캐시를 만들수 없다.

```javascript
simpleCache = function() {
  "use strict";

  var privateCache = {};

  function getCacheKey(key) {
    return JSON.stringify(key);
  }

  return {
    hasKey: function(key) {
      return privateCache.hasOwnProperty(getCacheKey(key));
    },
    setValue: function(key, value) {
      privateCache[getCacheKey(key)] = value;
    },
    getValue: function(key) {
      return privateCache[getCacheKey(key)];
    },
  };
};
```

- 위 캐시는 함수라서 이 함수를 실행하게 되면 각자 객체 인스턴스를 생성하기 때문에 다시 같은 문제를 야기하게 된다.
  그래서 다들 단일 인스턴스를 바라보게 하려면 즉시 실행을 응용하여 싱글톤 패턴을 구현하는 것이 좋다.

```javascript
const getRestaurantsWithinRadius = (function() {
  "use strict";

  var instance = null;
  return {
    getInstance: function() {
      if (!instance) {
        instance = Conference.simpleCache();
      }
      return instance;
    },
  };
})();
const cache = RestaurantsWithinRadiusCache.getInstance();
```

### factory pattern

- 팩토리 패턴은 객체를 단순히 찍어내는 함수이다.
- Object.create 메서드 역시 언어 자체에 포함된 팩토리이다.
- 모듈은 데이터 감춤이라는 부가 기능이 있지만, 객체 생성/반환이 주 임무라는 점에서 엄밀히 말하면 팩토리 이다.
- 일반 new 나 일반 함수를 호출해서 객체를 만들어 쓰면 되는데, 굳이 팩토리를 이용하는 이유는 '제어와 추상화'를 강화하기 위해서이다.
- 용도에 특화된 유형별 create 메서드가 여럿 있는 팩토리도 있다.
- 팩토리엔 대부분 create 같은 이름의, 하나 또는 그 이상의 파라미터를 받는 메서드가 하나 있다. 이 메서드는 전달 받은 파라미터를 살펴보고 알맞은 객체를 내어준다.

#### 시나리오

- 유형이 다른 두가지의 프레젠테이션 모델링을 해보자.
- 일반은 제목과 발표자 정보가 있고, 벤더 프레젠테이션은 여기에 벤더명, 제품정보가 추가된다.
- 프로퍼티 뭉치로 되어있는 객체를 하나 받았을때 프레젠테이션 유형은 알아서 판단하고 싶다.

#### code

```javascript
// 팩토리에서 하는일
// 1. create의 파라미터는 이전에 객체 리터럴로 넘겼을때 undefined로 자리 끼움했던 보기 흉한 형태에서 완전히 벗어났다
// 2. 파라미터에 무엇이 들었든 잘 건네주기만 하면 뒷일은 팩토리가 알아서 처리한다.
// 3. 나중에 유형이 다른 프레젠테이션도 얼마든지 추가할 수 있다.
// 4. new 키워드로 객체를 생성해야 한다는 사실을 팩토리가 대신 기억해준다. 팩토리 안에서 new...

// 팩토리 단위 테스트에서는 다음을 확인하자
// 1. create 함수는 잘못된 파라미터를 받지 않는다.
// 2. 파라미터가 정상적으로 전달되면 그에 따른, 원객체의 생성함수를 정확히 호출한다.
// 3. 이렇게 하여 반환된 객체가 바로 create가 반환한 객체다.

presentationFactory = function() {
  "use strict";

  return {
    create: function(obj) {
      // obj가 샬롯이 주는 데이터이다...
      var baseProperty = ["title", "presenter"],
        vendorProperty = ["vendor", "product"],
        allProperty = baseProperty.concat(vendorProperty),
        p,
        ix;

      for (p in obj) {
        if (allProperty.indexOf(p) < 0) {
          // indexOf 배열에서 지정된 요소를 찾을 수있는 첫 번째 인덱스를 반환 -1 이면 못찾음.
          throw Error(
            Conference.presentationFactory.messages.unexpectedProperty + p
          );
        }
      }

      // 나중에 Presentation 에서 유래한 객체를 반환할 예정..

      for (ix = 0; ix < vendorProperty.length; ++ix) {
        if (obj.hasOwnProperty(vendorProperty[ix])) {
          return new Conference.VendorPresentation(
            obj.title,
            obj.presenter,
            obj.vendor,
            obj.product
          );
        }
      }
      return new Conference.Presentation(obj.title, obj.presenter);
    },
  };
};
```

### sandbox pattern

- 샌드박스 패턴은 자바스크립트의 이름공간의 단점을 해결하는 방안으로 다른 모듈 및 그 샌드박스에 전혀 영향을 주지 않고 어떤 모듈을 실행할수 있는 독자적 환경을 구축한다는 점이다.
- 단일 전역 변수에 지나치게 의존하지 않고 점으로 길게 연결된 이름을 가진 타입이 범람하지 않게 한다.
- 다른 모듈 및 샌드박스에 전혀 영향을 주지 않고 어떤 모듈을 '실행할 수 있는' 독자적 환경을 구축한다는 점

#### 시나리오

- 대시보드 특성 측면상 대시보드는 보통 담당자 별로 보고 싶어하는 타입으로 커스터마이징을 할수 있어야 한다. 예를 들면 어떤 사람은 a,b 만을 어떤 사람은 a,c 만을 보고 싶어할 수도 있다.
- 각 위젯마다의 의존성은 없어야 겠다.
- 우선 이런 위젯들을 서로 떼어놓을수 있다면 테스트와 구성 요소간 결합도가 낮아진다. 이에 해결책은 각각 위젯을 자신의 샌드박스에 가둬두자.

#### code

- 샌드박스 편

```javascript
WidgetSandbox = function() {
  "use strict";

  // new로 실행했는지 보장한다..
  if (!(this instanceof Conference.WidgetSandbox)) {
    throw new Error(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
  }

  var widgetFunction,
    toolsToLoad = [],
    argsArray;

  // var widgetFunction = arguments[arguments.length -1],
  //   toolsToLoad = [];

  //arguments에서 *진짜* 배열을 추출한다.
  argsArray = Array.prototype.slice.call(arguments);

  //배열 마지막 원소는 widgetFunction일 것이다..
  widgetFunction = argsArray.pop();

  if (typeof widgetFunction !== "function") {
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }

  // if(arguments[0] instanceof Array){
  //   toolsToLoad = arguments[0];
  // }

  toolsToLoad = argsArray[0] instanceof Array ? argsArray[0] : argsArray;

  toolsToLoad.forEach(function(toolName) {
    if (!Conference.WidgetTools.hasOwnProperty(toolName)) {
      throw new Error(Conference.WidgetSandbox.messages.unknownTool + toolName);
    }

    Conference.WidgetTools[toolName](this);
  }, this); // 콜백 내에서 this가 sandbox 인스턴스를 가리키도록 보장한다..

  widgetFunction(this);
};
```

- 위젯 편

```javascript
attendeeNamesWidget = function(sandbox) {
  "use strict";

  // 해당 도구를 사용할 수 없으면 즉시 실패처리를 한다.
  if (!sandbox.dom) {
    throw new Error(Conference.Widgets.messages.missingTool + "dom");
  }
  if (!sandbox.attendeeNames) {
    throw new Error(Conference.Widgets.messages.missingTool + "attendeeNames");
  }

  // attendeeNames를 조회하여 대시보드에 추가한다.
  sandbox.attendeeNames.getAll().then(
    function resolve(name) {
      // sandbox.dom 으로 이름 목록을 표시한다.
    },
    function rejected(reson) {
      // sandbox.dom 으로 위젯 대신 에러 메시지를 나타낸다.
    }
  );
};
```

- 도구 편

```javascript
WidgetTools.attendeeNames = function(sandbox, injectedAttendeeWebApi) {
  "use strict";

  // attendeeApi를 선택적으로 주입할 수 있게 코딩한다 단위 테스트 할때 유용하다.
  var attendeeWebApi = injectedAttendeeWebApi || Conference.attendeeWebApi();

  sandbox.attendeeNames = {
    getAll: function gatAll() {
      return attendeeWebApi.getAll().then(function extractNames(attendees) {
        //각 참가자의 전체 성명만 추출하여 반환한다
        var names = [];
        attendees.forEach(function addName(attendee) {
          names.push(attendee.getFullName());
        });

        return names;
      });
    },
  };
};
```

#### 정리

- WidgetSandbox는 new로 호출되어야 한다. 여러 샌드박스를 만들기 위해서 위젯 하나당 하나의 widgetSandbox 인스턴스를 가진다고 생각하면 될듯 싶다.
- 도구들은 모듈로 정의를 하고 도구마다 모듈 함수가 WidgetSandbox 인스턴스를 받고 도구가 스스로를 WidgetSandbox 인스턴스의 프로퍼티에 추가한다.
- WidgetSandbox 생성자는 다음둘중 하나를 받는다. 첫 번째 인자는 위젯에서 쓸 도구명이 담긴 배열, 두번째 인자는 위젯함수 또는 도구명을 개별 인자로 죽 나열하고 위젯 함수를 제일 마지막 인자에 넣는다.
- 각 도구들은 싱글톤 객체이다.
- 위젯샌드박스에서 각 도구를 실행시키면 this ( 여기서 this는 WidgetSandbox 의 인스턴스가 되겠다.) 에 도구 이름으로 된 프로퍼티로 도구 스스로가 등록하게 된다.

```javascript
WidgetTools.toolA = function(sandbox) {
  sandbox.toolA = {
    function1: function() {
      // function1 구현부
    },
    function2: function() {
      // function2 구현부
    },
  };
};
```

- 여기서 샌드박스의 역활은 샌드박스를 new로 선언하면서 해당 this안에 도구와 위젯을 가둬두는 것이다.
- 도구1(this), 도구2(this), ... 도구n(this), 위젯(this) 이렇게 순차대로 호출하면 위젯에서는 원하는 도구를 this.도구1 , this.도구2 이런식으로 활용할 수 있겟다.

### decoration pattern

- 객체를 바꾸지 않고 그 기능을 늘리는 수법
- 기존 책임을 하는 api 객체는 그대로 놔두고 그 객체를 감싼 객체에 기능을 새로 넣자. 이 래퍼 객체에는 원 객체와 파라미터 개수 및 의미가 같은 메서드가 있는데 추가 할 기능만 자신이 맡고 물밑에서 실제로 처리하는 일은 자신이 감싼 원 객체에게 떠맡긴다.
- 실제로 상황에 따라 어떠한 특성 혹은 행동을 덧붙이는 패턴이다.
- 다양한 형태로 기능을 확장해야 하는 경우, 예를 들면 여러 종류의 단위 기능이 있고 이들을 조합해서 사용할 경우 장식자 패턴을 사용하면 장식자 개체에서 필요한 단위 기능을 하는 형식 개체를 포함을 시키는 것으로 이를 해결할 수있다.
- 단일 책임 원칙을 준수하면서 믿음성이 강화된 코드를 효과적으로 작성할 수 있다.

#### 시나리오

- 컨퍼런스에서 참가자가 등록버튼을 눌러 등록하면 post로 참가자가 등록하게 된다.
- 하지만 이때, 신규 참가자 페이지에서 사용자를 계속 붙잡아 두면 안되겠고, post가 끝난 다음에 참가자 명단 페이지에 가서 확인하라고 하는것 또한 안된다.
- post가 실패할 확률은 희박하다.
- 다음과 같이 하자
  1. 새 레코드를 post 하기전, 대기 레코드(pendingPosts) 배열에 담는다.
  2. post promise가 귀결되면 해당 레코드를 배열에서 들어낸다 ( 삭제 시킨다. ) 배열 splice
  3. 그러는 동안 대기 레코드들을 get 결과에 덧붙인다. 이렇게 하면 참가자 명단 페이지에서 post 처리된
     레코드를 바로 보여줄 수 있다. 대기 레코드들은 아직 DB에서 참가자 ID를 발급받지 못한 상태라 수정/삭제가 불가피 하지만, 어쨌든 그 사이에 적어도 이름을 명단에 보여주는 건 가능하다.
  4. post 결과 참가자 id가 넘어오면 조금전 3번에서 get으로 덧붙인 해당 레코드에 집어넣고 수정/삭제할 수 있는 상태로 바뀐다.
  5. 드물긴 하지만, post가 실패하면 에러 메시지를 띄우고 등록 실패한 참가자를 명단 페이지에서 지운다.
     오류가 발생한 참가자가 명단에 잠시 머물렀다 해도 문제 될 일은 없다. 화면에서 id가 다시 넘어오기 전까지 수정/삭제를 할 수 없을 뿐이니까.

#### code

- 원 객체 ( baseWebApi )

```javascript
// fake 모의체
fakeAttendeeWebApi = function() {
  "use strict";

  var attendees = []; // 가짜 데이터베이스 테이블

  return {
    //서버에 attendee를 POST 전송하는 척한다.
    //attendee 사본(마치 서버에서 새 버전을 조회해오는 것처럼 ) 으로
    // 귀결되는 프라미스를 반환하고 귀결 시점에 이 레코드에는
    // 데이터베이스에서 할당된 PK(attendeeId)가 들어있을 것이다..

    //프라미스를 버려야 하는 테스트라면 스파이를 이용하자.
    post: function post(attendee) {
      return new Promise(function(resolve, reject) {
        // 5밀리초에 불과하지만,
        // setTimeout은 프라미스 귀결을 다음 차례로 지연한다..
        setTimeout(function pretendPostingToServer() {
          var copyOfAttendee = attendee.copy();
          copyOfAttendee.setId(attendees.length + 1);
          attendees.push(copyOfAttendee);
          resolve(copyOfAttendee);
        }, 5);
      });
    },
    // 전체 참가자에 대한 프라미스를 반환한다..
    // 이 프라미스는 반드시 귀결되지만 , 필요하면 테스트 코드에서 스파이를 심을수도 있다..
    getAll: function getAll() {
      return new Promise(function(resolve, reject) {
        // setTimeout은 실제 조건을 흉내 내기 위해
        // post보다 지연시간이 짧다..
        setTimeout(function pretendToGetAllFromServer() {
          var copies = [];
          attendees.forEach(function(a) {
            copies.push(a.copy());
          });
          resolve(copies);
        }, 1);
      });
    },
  };
};
```

- 장식자

```javascript
attendeeWebApiDecorator = function(baseWebApi) {
  "use strict";

  var self = this,
    // post 함수에 전달할 레코드
    // 호출 결과는 아직 귀결되지 않은 상태다.
    pendingPosts = [],
    messages = {
      postPending: "이 참가자에 대한 처리가 진행 중인 것 같습니다.",
    };

  //attendee에 해당하는 'posts' 원소를 반환하거나
  // 그런 원소가 없으면 -1을 반환한다..
  function indexOfPostForSameAttendee(posts, attendee) {
    var ix;
    for (ix = 0; ix < posts.length; ++ix) {
      if (posts[ix].isSamePersonAs(attendee)) {
        return ix;
      }
    }
    return -1;
  }

  return {
    post: function post(attendee) {
      if (indexOfPostForSameAttendee(pendingPosts, attendee) >= 0) {
        return Promise.reject(new Error(messages.postPending));
      }

      pendingPosts.push(attendee);

      return baseWebApi.post(attendee).then(
        function onPostSucceeded(attendeeWithId) {
          var ix = pendingPosts.indexOf(attendee);
          if (ix >= 0) {
            pendingPosts[ix].setId(attendeeWithId.getId());
            pendingPosts.splice(ix, 1);
          }

          return attendeeWithId;
        },
        function onPostFailed(reason) {
          var ix = pendingPosts.indexOf(attendee);
          if (ix >= 0) {
            pendingPosts.splice(ix, 1);
          }

          return Promise.reject(reason);
        }
      );
    },
    getAll: function getAll() {
      return baseWebApi.getAll().then(function(records) {
        pendingPosts.forEach(function(pending) {
          var ix = indexOfPostForSameAttendee(records, pending);
          if (ix < 0) {
            records.push(pending);
          }
        });
        return records;
      });
    },
    getMessages: function getMessages() {
      return messages;
    },
  };
};
```

#### 정리

- 기존의 api 호출을 하는 객체를 사용한다면, post 호출후 어떤식으로든 완료가 되고 getAll로 그 리스트를 가져와야 하는 일련의 시간을 사용자가 기다리게 마련이다.
- 이런 경험을 높히기 위해서 기존 api 호출 하는 객체에 추가 기능을 래퍼 객체로 만들어 주었다.
- 여기서 래퍼는 post를 보내고 나서 바로 getAll에 post 보낸 정보를 덧대였고( id가 없는 상황 ) post가 끝나면 그 덧댄 객체에게 id를 setting 해주는 식이다.
- 기존 객체에서 발생하는 에러 및 성공을 잘 패스-스루(장식된 객체에서 -> 장식자 -> 호출부로의 전달) 해주는지 확인해야하고, 장식자의 고유 기능을 넣는다.
- 논리적으로 다음 단계는 장식자의 일반화 문제를 다뤄야 한다.
- 실제로 HTTP 의 PUT과 DELETE는 물론이고 연관된 POST GET 까지 캡슐화한 객체를 여럿 두고 구현한 애플리케이션도 있다. ( 예를 들어, 이미지 등록, 사용자 수정..등등의 여러 REST API) `모든 경우`에 적용할 수 있게 장식자를 일반화 하려면 어떻게 해야하는가??? ( 현재는 baseWebApi가 post와 getAll이 있는 녀석들을 받아야 한다. )
- 공통의 기능을 상위 클래스 및 인터페이스로 일반화를 해보자.

### Strategy pattern

- 전략 패턴은 특정 작업을 수행하는 다중 알고리즘, 즉 전략을 런타임 시 넣었다 뺐다 할 수 있는 모듈 단위로 나누기 위해 사용한다.
- 특정 작업을 수행하는 서로 다른 알고리즘(운수회사 교통편 예약)을 분리하고, 런타임 시점에 알고리즘, 즉 전략을 동적으로 지정할 수 있게 해주는 패턴
- 여기서 팩토리 패턴을 사용함으로써 테스트가 덜 복잡해지고 전략을 추가/삭제할 때도 실행 콘텍스트는(transportScheduler) 전혀 고칠 필요가 없다.

#### 시나리오

- 웹사이트에서 참가자는 자신이 선택한 택시 회사에 요청을 보내고 그 회사가 발급한 에약 확인번호를 돌려받는 식으로 콘퍼런스 행사장 교통편을 예약할 수 있다.
- 택시 회사에서는 웹사이트 대시보드를 보면서 예약 상황을 모니터링하고, 주최자 역시 회사별 이용 실적이 얼마나 되는지 확인할 수 있어야 한다.
- 운수회사 모듈 생성을 통틀어 관장하는 팩토리 함수를 하나 만드는게 좋을거 같다.
- 여기서 운수회사별 모듈이 바로 전략이다.

#### code

```javascript
transportScheduler = function(
  auditService /* 집계 서비스 */,
  transportCompanyFactory
) {
  "use strict";

  if (!auditService) {
    throw new Error(Conference.transportScheduler.messages.noAuditService);
  }

  if (!transportCompanyFactory) {
    throw new Error(Conference.transportScheduler.messages.noCompanyFactory);
  }

  return {
    scheduleTransportation: function scheduleTransportation(transportDetails) {
      if (!transportDetails) {
        throw new Error(Conference.transportScheduler.messages.noDetails);
      }
      var company;
      // 여기서 어떤 운수회사 모듈을 생성한다.
      company = transportCompanyFactory.create(transportDetails);

      // 여기서 운수회사는 schedulePickup 을 반드시 구현한다.
      return company
        .schedulePickup(transportDetails)
        .then(function successful(confirmation) {
          auditService.logReservation(transportDetails, confirmation);
          return confirmation;
        });
    },
  };
};
```

```javascript
// 운수회사
redicabTransportCompany = function(httpService) {
  "use strict";

  var schedulePickupUrl = "http://redicab.com/schedulepickup";

  return {
    // RediCab사와 픽업 일정을 잡는다.
    // 이 회사 API로부터 채번된 확인 코드로 귀결되는 프라미스를 반환한다.
    schedulePickup: function schedulePicup(transportDetails) {
      var details = {
        passenger: transportDetails.passengerName,
        pickUp: "컨퍼런스 센터",
        pickUpTime: transportDetails.departureTime,
        dropOff: "공항",
        rateCode: "JavaScriptConference",
      };

      return httpService
        .post(schedulePickupUrl, details)
        .then(function resolve(confirmation) {
          return confirmation.confirmationCode;
        });
    },

    //픽업 정보를 전송할 url을 반환한다.
    getSchedulePickupUrl: function getSchedulePickupUrl() {
      return schedulePickupUrl;
    },
  };
};
```

### Proxy pattern

- 프록시는 대리인이라는 뜻이다. 즉, 사용자가 원하는 행동을 하기 전에 한번 거쳐가는 단계라고 생각하면 된다.
- 좋은 프록시는 사용자의 요청을 캐싱하여 성능을 높일 수도 있고, 에러를 잡아낼 수도 있지만 나쁘게 사용한다면 사용자의 요청을 왜곡하여 다른 동작을 하도록 만들 수 있다.

#### 주된용도

- 클라이언 사용 패턴에 따라 데이터를 미리가져온다.
- 실체에 클라이언트 요청이 과도하게 몰리지 않게 한다. ( ex. 디바운싱 프록시 : 수 밀리 초에 한번만 이벤트에 반응하도록 제한할 수 있다.)
- 클라이언트가 접근하면 안 되는 자원을 통제한다.
- HTTP 요청 n 개를 하나로 묶어 n-1개 요청에 따른 고정 비용을 줄인다.

#### 프록시 패턴 시나리오

- 콘퍼런스 참가자 명단에서 클릭하면 프로필 전체를 볼수있게 한다.
- 프로필 화면에는 사진이 적어도 하나 이상 등록되어 있어서 전체 프로필을 처음부터 죄다 끌어오고 싶지는 않다.
- 현재 페이지의 참가자 중 가장 접근 횟수가 많은 프로필만이라도 미리가져오는게 좋겠다.
- 시간이 지나면서 쌓인 프로필 클릭 횟수에 따라 누가 유명 인사인지 시스템이 알아서 학습하도록 놔두고 그 사람들 프로필만 선취하면 될거같다.

#### code

```javascript
//attendeeProfileService(profileService) 함수로 참가자 배열(attendees)에서
//accessCount에 따라 가장 인기 있는 프로필부터 prefetchLimit개 만큼 선취하는 식으로
//참가자 프로필 접근을 관리한다.
Conference.attendeeProfileProxy = function(
  attendees,
  profileService,
  prefetchLimit
) {
  "use strict";

  var prefetched = {};

  function prefetch(attendeeId) {
    // 이놈이 진짜... getProfile 가져오는 놈...
    prefetched[attendeeId] = profileService.getProfile(attendeeId);
  }

  if (prefetchLimit > attendees.length) {
    prefetchLimit = attendees.length;
  }
  // 즉시 실행 함수로 감싸서 딱 한 번만 실행되도록
  // 그리고 새 변수 sortedAttendees가 외부 스코프에 의해 더렵혀지지 않게 한다...
  // 즉시 실행 함수도 prefetchAll 이라는 이름을 붙여 문서화 및 스택 추적 시 이정표로 삼는다..
  (function prefetchAll() {
    var ix,
      sortedAttendees = attendees.slice().sort(function byViews(a, b) {
        // 서버에서는 네트워크 효율 때문에 프로필 조회수가 업슨ㄴ 사람은 profileViews 프로퍼티를 전송하지 않는다.
        // 따라서 예외 처리를 해준다.
        return (b.profileViews || 0) - (a.profileViews || 0);
      });
    for (ix = 0; ix < prefetchLimit; ++ix) {
      prefetch(sortedAttendees[ix].attendeeId);
    }
  })();

  // 위에걸 한번 돌리고 나면... prefetched에 뭔가가 쌓인다.. 그게 뭐가 쌓이느냐.
  // 서버에서 내려주는 profileViews 값이 높은순위별로.. prefetchLimit 갯수만큼 쌓인다..
  // prefetced는 참가자의 id가 키 값이고 값은 진짜 getProfile ( 프로필 ) ..

  return {
    getProfile: function(attendeeId) {
      return prefetched[attendId] || profileService.getProfile(attendeeId);
    },
  };
};
```

### chainable pattern

### iterator pattern

### mediator pattern (중재자 패턴)

- 중재자는 소통을 주도하고 이해 당사자를 이끌며, 각자의 이야기에 응답하고 다음단게로 나아간다.

#### 중재자 패턴이란?

- 소프트웨어 설게에서 중재자 패턴은 문제를 회피하는 방법이다.
- 소프트웨어 시스템은 소통하는 코드를 줄일수록 오류 가능성이 적어진다.
- 서로 다른, 또는 유사한 일을 하는 협력자(colleague)들과 이들을 조직하여 전체 성과를 끌어내는 단일 중재자로 이루어진다.
- 가장 순수한 형태의 중재자는 별다른 비즈니스 로직 없이 협력자 사이의 움직임만 관장한다.

#### 중재자 패턴 시나리오

- 노드망이 있고 여기에 봇(bot) 서너 개가 돌아다닌다.
- 플레이어(player) 2명은 이 봇을 빠른 속도로 모두 잡아 보드를 접수하면 게임은 끝난다.
- 협력자 각자의 역할은 다음과 같다.
  - player: 연결된 다른 노드로 이동하면서 mediator에게 자신의 움직임을 알린다.
  - bot: player와 같다.
  - gameLogic: 게임 종료 시점을 결정하는 로직 등이 있다. '정규 공간'을 그리고 player와 bot을 배치한다. 이들을 브라우저에 표시하는 일은 svgDisplay의 몫이다.
  - svgDisplay: svg 요소에 게임판을 그린다. 처음에 mediator에게 지령을 받고 게임판을 그리지만, 그 이후에 mediator와 다시 이야기를 주고받지는 않는다.
- mediator의 역할
  - gameLogic(player와 bot)과 svgDisplay를 인스턴스화하고 게임을 초기화한다.
  - 방향키에 이벤트 리스너를 건다.
  - player/bot이 자신의 움직임을 알리면, gameLogic/svgDisplay에게도 소식을 알리고 gameLogic이 종료를 선언하면 자신이 걸어둔 이벤트 리스너를 푼다.
  - player가 bot을 잡게되면 직접 bot을 내쫒는게 아니라 mediator에게 귀띔만 한다. 그러면 mediator는 다시 gameLogic에 통보하고, gameLogic은 충돌 여부를 살펴보고 bot을 지운다.
  - gameLogic이 화면을 직접 고치는 건 아니고 mediator에게 한 번 더 메시지로 알리면 svgDisplay가 bot을 삭제한다.

#### 협력자 개발

player 객체는 게임판의 지리는 조금 알고 있지만, 게임이 언제 끝나는지, 다른 player는 몇 명인지, bot은 몇 개가 살아 돌아다니고 있는지 전혀 모른다.
svg에 표시되고 있는 줄도 모른다.

```javascript
var Game = Game || {};

Game.player = function player(mediator) {
  'use strict';

  var me;
  var node;
  var id = (Game.player.nextId === undefined? Game.player.nextId = 0 : ++Game.player.nextId); // 정적 변수 nextId
  var listenEvent = 'keydown';
  var elementWithKeydownAttached;
  // 첫 번째 플레이어는 1-4키를 쓴다(keycode: 49 - 52)
  // 두 번째 플레이어는 6-9키를 쓴다(keycode: 54 - 58)
  var keycodeForPath0 = id % 2 ? 54 : 49;

  function handleKeydown(e) {
    var pathIx = e.keycode - keycodeForPath0;
    if(keyIx >= 0 && pathIx < Game.pathIndex.count) {
      me.move(pathIx);
    }
  }

  var me = {
    getId: function() {
      return id;
    },
    setNode: function setNode(gameNode) {
      node = gameNode;
    },
    getNode: function getNode() {
      return node;
    },
    activate: function activate(elementForKeydown) {
      // 키가 눌렸을때의 해당 엘리먼트
      elementWithKeydownAttached = elementForKeydown;
      elementWithKeydownAttached.addEventListener(listenEvent, handleKeydown)
    },
    deactivate: function deactivate() {
      if(elementWithKeydownAttached) {
        elementWithKeydownAttached.removeEventListener(listenEvent, handleKeydown);
      }
    },
    move: function move(pathIndex) {
      // pathIndex로 주어진 경로를 따라 플레이어를 이동시켜본다.
      // 이동의 성공 여부를 true/false로 반환한다.
      if(node.getConnectedNode(pathIndex)) {
        me.setNode(node.getConnectedNode(pathIndex));
        mediator.onPlayerMoved(me);

        return true;
      }

      return false;
    }
  }

  return me;
}
```

#### 중재자 인터페이스 분리

- 각 협력자들은 중재자의 특정 메서드를 호출한다. 이에 그에 맞는 중재자 인터페이스를 갖춰야 한다.
- 중재자 코드를 사용하는 커스터머들은 협력자들이고 협력자들에 맞춰서 중재자 구현을 짜는 것이 의존성 역전 원칙(Dependency Inversion Principle)이라 할 수 있다.
- 여기서는 중재자에게 규약을 정해서 협력자(커스터머)들이 사용하게 만들 수 있고 반대로, 협력자(커스터머)가 중재자 규약을 지니고 있고 중재자가 구현을 하도록 만들 수 있다.
- 전자의 경우에는 중재자가 변경된다면 규약까진 변경 될 순 있지만 그것을 사용하고 있는 협력자를 찾아서 전부 고쳐야 하는 문제가 있다.
- 후자의 경우에는 인터페이스를 사용하는 모듈마다(즉, 커스터머(협력자)) 규약을 적용해야 하므로 코드가 반복될 수 있는 문제가 있다.(DRY 원칙에 어긋)

#### 중재자 개발

```javascript
var Game = Game || {};

Game.mediator = function mediator() {
  'use strict';

  var logic;
  var display;
  var startTime;
  var svgElement = document.getElementById('gameSvg');

  function moveBotStartInLogicAndOnDisplay(bot) {
    logic.onMotMoveStart(bot);
    display.onBotMoveStart(bot);
  }

  var med = {
    startGame: function startGame() {
      logic.getPlayers().forEach(function (player) {
        player.activate(document.getElementById('gameInput'));
      });
      startTime = new Date();
    },
    // 플레이어가 이동하면 이 함수를 호출한다.
    onPlayerMoved: function onPlayerMoved(player) {
      logic.onPlayerMoved(player);
      display.onPlayerMoved(player);
    },
    // 봇이 이동하기 시작하면 이 함수를 호출한다.
    onBotMoveStart: function onBotMoveStart(bot) {
      moveBotStartInLogicAndOnDisplay(bot);
    },
    // 봇이 이동을 마치면 이 함수를 호출한다.
    onBotMoveEnd: function onBotMoveEnd(bot) {
      logic.onBotMoveEnd(bot);
    },
    // 봇이 잡히면 게임 로직이 이 함수를 호출한다.
    onBotHit: function onBotHit(bot) {
      bot.setNode(undefined);
      moveBotStartInLogicAndOnDisplay(bot);
    },
    // 게임 로직이 이 함수를 호출하여 게임을 끝낸다.
    endGame: function endGame() {
      var millisecondsToWin = new Date() - startTime;

      logic.getPlayers().forEach(function (player) {
        player.deactivate();
      });

      // 누가 이겼는지 디스플레이가 표시하기 전에
      // setTimeOut을 써서 마지막 봇을 삭제할 시간을 준다.
      setTimeout(function() {
        display.endGame(millisecondsToWin);
      }, 500)
    }
  }

  // mediator가 인스턴스화되면 두 협력자 gameLogic과 svgDisplay를 생성한다.
  // 그런 다음 gameLogic이 player와 bot을 만든다.
  var logic = Game.gameLogic(med, 6, 7);
  var display = Game.svgDisplay(med, svgElement, logic);

  return med;
}
```

player 협력자 코드는 다음과 같이 실행된다.

1. activate 메서드는 주어진 방향키를 누르면 알맞은 player의 move 메서드를 호출할 이벤트 리스너를 추가한다.
2. 새 노드로 정상 이동하면 player.move가 mediator.onPlayerMoved 메서드를 호출한다.
3. 이 메서드는 player의 이동 사실을 gameLogic과 svgDisplay에게 알린다.
4. 마지막으로 gameLogic이 게임 종료를 선포한 후 mediator.endGame이 이벤트 리스너를 풀리기 전까지 2,3번 단계를 반복한다.

mediator의 주된 관심사는 자신이 몰라도 될 객체들 사이의 움직임을 조정하는 일이다.

### observer pattern (관찰자 패턴)

- 한 객체의 상태 변화에 따라 다른 객체의 상태도 연동되도록 일대다 객체 의존 관계를 구성 하는 패턴
- 데이터의 변경이 발생했을 경우 상대 클래스나 객체에 의존하지 않으면서 데이터 변경을 통보하고자 할 때 유용
- 통보 해야할 대상 객체의 관리를 Subject 클래스와 그 대상들이 꼭 구현을 해야할 observer 인터페이스로 일반화 한다.
- 쉽게 여기서 통보 해야할 대상 객체는 구독자 라고 하고 그 구독자들은 update 함수를 구현해야할 약속을 이행하기 위한 observer 인터페이스를 갖는다. 또한 대상 객체의 관리를 하는 Subject는 신문사라고 생각 할 수 있다.

#### 관찰차 패턴이란?

- 관찰할 객체 (대상자)
- 대상자를 지켜보는 객체 (관찰자)

대상자는 관찰자에게 다음 세 기능을 반드시 제공한다.

- 관찰자가 알림을 받을 수 있게 자신을 등록하는 기능
- 관찰자가 알림을 그만 받도록 자신을 등록 해지하는 기능
- 대상자가 관찰자에게 업데이트를 알리는 기능
- 관찰자는 대상자가 변경 사실을 자신에게 알려줄 때 호출할 메서드를 건내준다.

#### 관찰자 패턴 시나리오

컨퍼런스 주최자는 참가자 등록 현황을 브라우저 새로 고침 없이 다음과 같이 두 가지 형태로 조회하고 싶다.

- 총 등록자 인원수
- 최근 등록을 마친 10인 명단

여기서는 신규 등록자를 폴링하는 전용 모듈을 따로 두고 사용자에게 정보를 보여주는 모듈 2개를 업데이트하는 식으로 개발한다.
폴링 모듈이 대상자고 화면 표시 모듈 2개가 관찰자가 된다.

#### 관찰자 패턴 대상자 코드

```javascript
// 대상자 코드
var Conference = Conference || {};

Conference.recentRegisterationsService = function (registrationsService) {
  'use strict';

  var registrationsObservers = [];
  var service = {
    // 관찰자 추가
    addObserver: function addObserver(observer) {
      // ...
      // observer 는 객체
    },
    // 관찰자 목록에서 관찰자를 삭제한다.
    removeObserver: function removeObserver() {
      var index = registrationsObservers.indexOf(observer);
      if(index >= 0) {
        registrationsObservers.splice(index,1)
      }
    },
    // 관찰자 모두 삭제
    clearObservers: function clearObservers() {
      registrationsObservers = [];
    },
    // 주어진 관찰자가 등록되어 있으면 true, 그렇지 않으면 false 반환
    hasObserver: function hasObserver(observer) {
      return registrationsObservers.indexOf(observer) >= 0;
    },
    // 등록된 관찰자들이 각자 제공한 update 메서드 실행
    updateObserver: function updateObserver(newAttendee) {
      registrationsObservers.forEach(function executeObserver(observer) {
        observer.update(newAttendee);
      })
    },
    // 폴링을 멈춘다. 한번 멈춘 다음에는 다시 시작하지 않는다.
    stopPolling: function stopPolling() {
      if(pollingProcess) {
        clearInterval(pollingProcess);
        pollingProcess = false;
      }
    }, 
  }

  // 서버를 호출, 최종 조회 시점 이후로 등록한 참가자를 조회하여
  // 참가자 배열의 프라미스를 반환한다.
  var getNewAttendees = function getNewAttendees() {
    return new Promise(function (resolve, reject) {
      // ...
      resolve([])
    })
  }

  // 바로 polling 시작
  var pollingProcess = setInterval(function pollForNewAttendees() {
    getNewAttendees().then(function processNewAttendees(newAttendees) {
      newAttendees.forEach(function updateWithNewAttendee(newAttendee) {
        // recentRegisterationsService는 자신을 지켜보는 관찰자 모두 attendee 객체를 인자로 받는 update 함수를 표출한다고 전제한다.
        service.updateObservers(newAttendee);
      })
    })
  }, 15000)

  return service;
}
```

#### 관찰자 패턴의 관찰자 테스트

- totalAttendeeCount 인스턴스가 자신을 recentRegistrationsService 인스턴스의 관찰자로 등록한다.
- getCount 메서드는 모듈 함수에 준, 초기 인원수를 반환한다.
- update 메서드를 실행하면 getCount가 반환한 값을 하나 늘린다.

#### 관찰자 패턴의 관찰자 코드

```javascript
var Conference = Conference || {};

// recentRegistrationsService 대상자
Conference.totalAttendeeCount = function(initialCount, recentRegistrationsService) { 
  'use strict';

  var currentCount = initialCount;
  var registrations = recentRegistrationsService;
  var render = function render() {
    // 현재 인원수를 DOM에 렌더링한다.
  }

  var module = {
    // UI에 표시된 총 참가자 인원수를 반환한다.
    getCount: function getCount() {},
    // 총 참가자 인원수를 늘린다.
    update: function update(newAttendee) {
      currentCount++;
      render();
    }
  }

  // 모듈을 recentRegistrationsService의 관찰자로 추가한다.
  registrations.addObserver(module);

  return module;
}
```

### pubSub pattern

### builder pattern
