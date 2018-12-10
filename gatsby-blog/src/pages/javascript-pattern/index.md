---
title: javascript pattern
date: "2018-08-05T10:00:03.284Z"
---

## Goal

- 다양한 자바스크립트 패턴을 익히고 어느 상황에서 사용되는지 파악한다.

## Contents 
- [callback pattern](#callback)
- [promise pattern](#promise)
- [partial pattern](#partial)
- [memoization pattern](#memoization)
- [singleton pattern](#singleton)
- [factory pattern](#factory)
- [sandbox pattern](#sandbox)
- [decoration pattern](#decoration)
- [strategy pattern](#strategy)
- [proxy pattern](#proxy)
- [chaning pattern](#chaning)




## Pattern

### <span id="callback">callback pattern</span>
- 콜백은 나중에 실행할 부차 함수에 인자로 넣는 함수다. 
- 여기서 콜백이 실행될 '나중'시점이 부차 함수의 실행 완료 이전이면 동기, 반대로 실행 완료 이후면 비동기라고 본다.

#### 시나리오 

- 컨퍼런스에 attend(참가자) 등록을 하는 시스템이 있다.
- 한명 또는 여러명을 한번에 참가 등록을 할수 있다.
- attend(참가자)는 또는 참가자들은 참가자 등록이 되었는지 안되었는지 확인할 수 있다.
- attend(참가자)는 또는 참가자들은 이름을 알 수 있다. 

#### code

```javascript
var C = {};
// singleton 
var C.attend = function(name){
  var fullName = name;
  return {
    registry: function(){},
    isRegistry: function(){},
    getFullName: function(){}
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
    iterate: function (callback) {   // 반복..
      // attendees의 각 attendee에 대해 콜백을 실행한다..
      attendees.forEach(callback);

    }

  }
}

function addAttendeesToCollection(attendeeArray) {
      attendeeArray.forEach(function(attendee) {
        collection.add(attendee);
      });
}

var attendees = Conference.attendeeCollection();
addAttendeesToCollection([attendee1, attendee2])
attendees.iterate(function doCheckIn(attend) { // 익명의 콜백함수 -> 디버깅 용이함을 위해 이름을 지정한다. 
  attend.checkIn();
})

```

#### 주의사항
- 콜백을 사용할때는 디버깅에 용이하기 위해 이름을 붙여주자.
- 콜백 헬이 발생할때는 편 코딩으로 해결할수 있다.
- 콜백 함수 안의 this를 주의하자.

#### 정리
- 한가지 일을 여러번 수행해야 할때 함수하나를 인자로 보내(콜백 패턴) 여러번 호출을 진행할수 있다.
- A작업이 끝난뒤에 B작업이 수행되어지길 바랄때 콜백 패턴을 이용할 수 있다.

### <span id="promise">promise pattern</span>
- 비동기 액션을 초기화하고 성공과 실패 케이스를 각각 처리할 콜백을 준다.
- 이벤트 기반의 비동기 프로그래밍보다 훨씬 더 이해하기 쉽고 우아하며 탄탄한 코드를 작성할 수 있다.

### <span id="partial">partial pattern</span>
- 커링 요소에 뭔가 더 보태서 기능을 할 수있게 끔 만드는 패턴이다.
- 인자가 여럿 있고 그중 일부는 값이 불변인 함수를 쓸 경우가 있다. 이때 같은 값을 계속 반복하기보다 원본함수를 새로운 함수로 감싼 다음, 상수 인자는 건네주고 값이 달라지는 나머지 인자만 표출하는 것이 좋다.
- 값이 불면인 상수 인자를 지난 함수 호출부는 상수성을 캡슐화하여 함수를 새로 만드는 것이 좋다.
- 커링은 여러 인자를 거느린 함수를 인자 하나만으로 취하는 여러 단계의 함수들로 쪼갠다. 

#### 시나리오 

- 행사장 근처에 있는 음식점 위치를 알려주는 서드파티 웹 서비스가 있다고 하자.
- `getRestaurantsWithinRadius(address, radiusMiles, cuisine)` 요건상 address와 cuisine부분은 변경의 필요성이 없어 보인다. 
- `restaurantApi` 에서 반환하는 api 객체에 새로운 메서드를 집어넣기로 하자.
- address 와 raius 파라미터를 고정한 채 `getRestaurnatsNearConference(cuisine)` 가 `getRestaurantsWithinRadius` 반환값을 무조건 반환하게 하자.

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

### <span id="memoization">memoization pattern</span>
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



### <span id="singleton">singleton pattern</span>
- 다중 객체 인스턴스를 만들 필요가 없거나, 오히려 만들면 안 될 때도 있다. 이렇게 하나의 객체 인스턴스만 존재해야 할 때는 싱글톤 패턴을 사용한다.

#### 시나리오
- 위에서 생각해봤던 메모이제이션을 적용했던 `restaurantApi` 의 인스턴스(api)가 2개 만들어져서 각각 똑같은 인자로 `getRestaurantsWithinRadius` 함수를 2번 객체를 호출하면 1번 객체의 함수 호출 후 캐시된 결과를 다시 사용할까???
- 여기서 "1번 객체 함수 호출로 캐시된 결과를 다시 사용해" 라고 대답할 수 있어야 한다. 
- 이런 인스턴스들이 전부 따로 캐시를 두지 않고 단일 캐시를 공유할 수 있으면 이상적이다. 
- 의존성 주입으로 인스턴스간에 캐시 객체를 공유할수 있게 해주면 좋을듯 싶다.

#### code 
```javascript
// 공유할 캐시 객체를 주입받는다.
const cache = {} // 데이터 감춤 따위의 기능은 없다. 
memoizedRestaurantApi = function (cache, thirdPartyApi) {
  const restaurantCache = cache || {} // 캐시를 주입안하면 내부적으로 생성한다. 
  //(...)
}
```
- 캐시가 일반적인 객체가 아닌 여러가지 기능을 하는 캐쉬의 역활도 할수 있음 좋겠다. 예를들어 최저 사용빈도 기능과 일정 시간까지만 캐시값을 저장해두는게 더 합리적인 상황도 필요할 수있다.
- 이럴땐 리터럴가지고만은 캐시를 만들수 없다.

```javascript
simpleCache = function () {

  'use strict';

  var privateCache = {};

  function getCacheKey(key) {
    return JSON.stringify(key)
  }

  return {
    hasKey: function (key) {
      return privateCache.hasOwnProperty(getCacheKey(key));
    },
    setValue: function (key, value) {
      privateCache[getCacheKey(key)] = value;
    },
    getValue: function (key) {
      return privateCache[getCacheKey(key)];
    }
  }

};
```

- 위 캐시는 함수라서 이 함수를 실행하게 되면 각자 객체 인스턴스를 생성하기 때문에 다시 같은 문제를 야기하게 된다.
그래서 다들 단일 인스턴스를 바라보게 하려면 즉시 실행을 응용하여 싱글톤 패턴을 구현하는 것이 좋다.
```javascript
getRestaurantsWithinRadius = (function () {
  'use strict';

  var instance = null;
  return {
    getInstance: function () {
      if (!instance) {
        instance = Conference.simpleCache();
      }
      return instance;
    }
  }
})();

const cache = RestaurantsWithinRadiusCache.getInstance()
```

### <span id="factory">factory pattern</span>
- 팩토리 패턴은 객체를 단순히 찍어내는 함수이다. 
- Object.create 메서드 역시 언어 자체에 포함된 팩토리이다. 
- 모듈은 데이터 감춤이라는 부가 기능이 있지만, 객체 생성/반환이 주 임무라는 점에서 엄밀히 말하면 팩토리 이다. 
- 일반 new 나 일반 함수를 호출해서 객체를 만들어 쓰면 되는데, 굳이 팩토리를 이용하는 이유는 '제어와 추상화'를 강화하기 위해서이다. 

#### 시나리오
- 

### <span id="sandbox">sandbox pattern</span>

### <span id="decoration">decoration pattern</span>
- 단일 책임 원칙을 준수하면서 믿음성이 강화된 코드를 효과적으로 작성할 수 있다.

### <span id="strategy">strategy pattern</span>

### <span id="proxy">proxy pattern</span>
- 프록시는 대리인이라는 뜻이다. 즉, 사용자가 원하는 행동을 하기 전에 한번 거쳐가는 단계라고 생각하면 된다. 
- 좋은 프록시는 사용자의 요청을 캐싱하여 성능을 높일 수도 있고, 에러를 잡아낼 수도 있지만 나쁘게 사용한다면 사용자의 요청을 왜곡하여 다른 동작을 하도록 만들 수 있다. 

### <span id="chaning">chaning pattern</span>

### <span id="iterator">iterator pattern</span>

### <span id="mediator">mediator pattern</span>

### <span id="observer">observer pattern</span>

### <span id="builder">builder pattern</span>