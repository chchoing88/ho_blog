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

presentationFactory = function () {

  'use strict';

  return {
    create: function (obj) { // obj가 샬롯이 주는 데이터이다...
      var baseProperty = ['title', 'presenter'],
        vendorProperty = ['vendor', 'product'],
        allProperty = baseProperty.concat(vendorProperty),
        p,
        ix;

      for (p in obj) {
        if (allProperty.indexOf(p) < 0) { // indexOf 배열에서 지정된 요소를 찾을 수있는 첫 번째 인덱스를 반환 -1 이면 못찾음.
          throw Error(Conference.presentationFactory.messages.unexpectedProperty + p);
        }
      }

      // 나중에 Presentation 에서 유래한 객체를 반환할 예정..

      for (ix = 0; ix < vendorProperty.length; ++ix) {
        if (obj.hasOwnProperty(vendorProperty[ix])) {
          return new Conference.VendorPresentation(obj.title, obj.presenter, obj.vendor, obj.product);
        }
      }
      return new Conference.Presentation(obj.title, obj.presenter);

    }
  }

}

```


### <span id="sandbox">sandbox pattern</span>
- 샌드박스 패턴은 자바스크립트의 이름공간의 단점을 해결하는 방안으로 다른 모듈 및 그 샌드박스에 전혀 영향을 주지 않고 어떤 모듈을 실행할수 있는 독자적 환경을 구축한다는 점이다.
- 단일 전역 변수에 지나치게 의존하지 않고 점으로 길게 연결된 이름을 가진 타입이 범람하지 않게 한다.
- 다른 모듈 및 샌드박스에 전혀 영향을 주지 않고 어떤 모듈을 '실행할 수 있는' 독자적 환경을 구축한다는 점

#### 시나리오
- 대시보드 특성 측면상 대시보드는 보통 담당자 별로 보고 싶어하는 타입으로 커스터마이징을 할수 있어야 한다. 예를 들면 어떤 사람은 a,b 만을  어떤 사람은 a,c 만을 보고 싶어할 수도 있다.
- 각 위젯마다의 의존성은 없어야 겠다.
- 우선 이런 위젯들을 서로 떼어놓을수 있다면 테스트와 구성 요소간 결합도가 낮아진다. 이에 해결책은 각각 위젯을 자신의 샌드박스에 가둬두자.

#### code 

- 샌드박스 편
```javascript
WidgetSandbox = function () {
  'use strict';

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

  if (typeof widgetFunction !== 'function') {
    throw new Error(Conference.WidgetSandbox.messages.fcnMustBeProvided);
  }

  // if(arguments[0] instanceof Array){
  //   toolsToLoad = arguments[0];
  // }

  toolsToLoad = (argsArray[0] instanceof Array) ? argsArray[0] : argsArray;

  toolsToLoad.forEach(function (toolName) {
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
attendeeNamesWidget = function (sandbox) {
  'use strict'

  // 해당 도구를 사용할 수 없으면 즉시 실패처리를 한다.
  if(!sandbox.dom){
    throw new Error(Conference.Widgets.messages.missingTool + 'dom');
  }
  if(!sandbox.attendeeNames){
    throw new Error(Conference.Widgets.messages.missingTool + 'attendeeNames');
  }

  // attendeeNames를 조회하여 대시보드에 추가한다.
  sandbox.attendeeNames.getAll().then(function resolve(name){
    // sandbox.dom 으로 이름 목록을 표시한다.
  }, function rejected(reson){
    // sandbox.dom 으로 위젯 대신 에러 메시지를 나타낸다.
  })
}
```

- 도구 편

```javascript
WidgetTools.attendeeNames = function (sandbox, injectedAttendeeWebApi) {

  'use strict';

  // attendeeApi를 선택적으로 주입할 수 있게 코딩한다 단위 테스트 할때 유용하다.
  var attendeeWebApi = injectedAttendeeWebApi || Conference.attendeeWebApi();

  sandbox.attendeeNames = {
    getAll: function gatAll() {
      return attendeeWebApi.getAll()
        .then(function extractNames(attendees) {
          //각 참가자의 전체 성명만 추출하여 반환한다
          var names = [];
          attendees.forEach(function addName(attendee) {
            names.push(attendee.getFullName());
          });

          return names;
        });
    }
  }
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
    function1: function(){
      // function1 구현부
    },
    function2: function(){
      // function2 구현부
    }
  }
}
```
- 여기서 샌드박스의 역활은 샌드박스를 new로 선언하면서 해당 this안에 도구와 위젯을 가둬두는 것이다.
- 도구1(this), 도구2(this), ... 도구n(this), 위젯(this) 이렇게 순차대로 호출하면 위젯에서는 원하는 도구를 this.도구1 , this.도구2 이런식으로 활용할 수 있겟다.



### <span id="decoration">decoration pattern</span>
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
fakeAttendeeWebApi = function(){

  'use strict';

  var attendees = []; // 가짜 데이터베이스 테이블

  return {
    //서버에 attendee를 POST 전송하는 척한다.
    //attendee 사본(마치 서버에서 새 버전을 조회해오는 것처럼 ) 으로
    // 귀결되는 프라미스를 반환하고 귀결 시점에 이 레코드에는
    // 데이터베이스에서 할당된 PK(attendeeId)가 들어있을 것이다..

    //프라미스를 버려야 하는 테스트라면 스파이를 이용하자.
    post: function post(attendee){
      return new Promise(function(resolve,reject){
        // 5밀리초에 불과하지만,
        // setTimeout은 프라미스 귀결을 다음 차례로 지연한다..
        setTimeout(function pretendPostingToServer(){
          var copyOfAttendee = attendee.copy();
          copyOfAttendee.setId(attendees.length+1);
          attendees.push(copyOfAttendee);
          resolve(copyOfAttendee);
        },5);
      });

    },
    // 전체 참가자에 대한 프라미스를 반환한다..
    // 이 프라미스는 반드시 귀결되지만 , 필요하면 테스트 코드에서 스파이를 심을수도 있다..
    getAll : function getAll(){
      return new Promise(function(resolve,reject){
        // setTimeout은 실제 조건을 흉내 내기 위해
        // post보다 지연시간이 짧다..
        setTimeout(function pretendToGetAllFromServer(){
          var copies = [];
          attendees.forEach(function(a){
            copies.push(a.copy());
          });
          resolve(copies);
        },1);
      });
    }

  }
};
```


- 장식자
```javascript
attendeeWebApiDecorator = function (baseWebApi) {
  'use strict';

  var self = this,

    // post 함수에 전달할 레코드
    // 호출 결과는 아직 귀결되지 않은 상태다.
    pendingPosts = [],
    messages = {
      postPending: '이 참가자에 대한 처리가 진행 중인 것 같습니다.'
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

          return attendeeWithId
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
      return baseWebApi.getAll().then(function (records) {
        pendingPosts.forEach(function (pending) {
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
    }
  }
};
```

#### 정리
- 기존의 api 호출을 하는 객체를 사용한다면, post 호출후 어떤식으로든 완료가 되고 getAll로 그 리스트를 가져와야 하는 일련의 시간을 사용자가 기다리게 마련이다.
- 이런 경험을 높히기 위해서 기존 api 호출 하는 객체에 추가 기능을 래퍼 객체로 만들어 주었다.
- 여기서 래퍼는 post를 보내고 나서 바로 getAll에 post 보낸 정보를 덧대였고( id가 없는 상황 ) post가 끝나면 그 덧댄 객체에게 id를 setting 해주는 식이다.
- 기존 객체에서 발생하는 에러 및 성공을 잘 패스-스루(장식된 객체에서 -> 장식자 -> 호출부로의 전달) 해주는지 확인해야하고, 장식자의 고유 기능을 넣는다.
- 논리적으로 다음 단계는 장식자의 일반화 문제를 다뤄야 한다.
- 실제로 HTTP 의 PUT과 DELETE는 물론이고 연관된 POST GET 까지 캡슐화한 객체를 여럿 두고 구현한 애플리케이션도 있다. ( 예를 들어, 이미지 등록, 사용자 수정..등등의 여러 REST API) `모든 경우`에 적용할 수 있게 장식자를 일반화 하려면 어떻게 해야하는가??? ( 현재는 baseWebApi가 post와 getAll이 있는 녀석들을 받아야 한다. )


#### 장식자의 일반화
- 모든 경우를 통용할수 있는 범위의 일반화된 장식자를 만들자.
- 장식자의 패턴은 단위 기능을 수행하는 형식과 장식자 형식을 정의하고 일반화 하여 기반 클래스를 제공한다. 즉, 기능을 수행하는 형식과 그 형식을 정의하고 일반화한 기반 클래스 2가지로 나뉜다.
- 예를 들어, 사진의 필터 ( 색조, 명도, 채도 )의 기능을 하는 녀석들이 있다고 보자. 여기서 필터라는 것은 기반  클래스라고 하며 컴포넌트라고 부르며 장식자에 멤버로 컴포넌트 형식을 포함한다. 이것을 멀티 필터가 있다고 가정하면 장식자는 멀티 필터가 될것이다. 각각의 색조필터, 명도필터, 채도필터는 단위 기능을 수행하는 형식이 될 것이고 이 형식을 정의하고 일반화한 것이 필터가 되겠다.
 


### <span id="strategy">strategy pattern</span>

### <span id="proxy">proxy pattern</span>
- 프록시는 대리인이라는 뜻이다. 즉, 사용자가 원하는 행동을 하기 전에 한번 거쳐가는 단계라고 생각하면 된다. 
- 좋은 프록시는 사용자의 요청을 캐싱하여 성능을 높일 수도 있고, 에러를 잡아낼 수도 있지만 나쁘게 사용한다면 사용자의 요청을 왜곡하여 다른 동작을 하도록 만들 수 있다. 

### <span id="chaning">chaning pattern</span>

### <span id="iterator">iterator pattern</span>

### <span id="mediator">mediator pattern</span>

### <span id="observer">observer pattern</span>

### <span id="builder">builder pattern</span>