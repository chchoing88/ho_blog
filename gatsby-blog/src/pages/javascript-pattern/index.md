---
title: javascript pattern
date: "2018-08-05T10:00:03.284Z"
---

# 목표 

# 목차 

# 패턴

## callback pattern
- 콜백은 나중에 실행할 부차 함수에 인자로 넣는 함수다. 
- 여기서 콜백이 실행될 '나중'시점이 부차 함수의 실행 완료 이전이면 동기, 반대로 실행 완료 이후면 비동기라고 본다.

### 시나리오 

- 컨퍼런스에 attend(참가자) 등록을 하는 시스템이 있다.
- 한명 또는 여러명을 한번에 참가 등록을 할수 있다.
- attend(참가자)는 또는 참가자들은 참가자 등록이 되었는지 안되었는지 확인할 수 있다.
- attend(참가자)는 또는 참가자들은 이름을 알수 있다. 

### code

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

### 주의사항
- 콜백을 사용할때는 디버깅에 용이하기 위해 이름을 붙여주자.
- 콜백 헬이 발생할때는 편 코딩으로 해결할수 있다.
- 콜백 함수 안의 this를 주의하자.

### 정리
- 한가지 일을 여러번 수행해야 할때 함수하나를 인자로 보내(콜백 패턴) 여러번 호출을 진행할수 있다.
- A작업이 끝난뒤에 B작업이 수행되어지길 바랄때 콜백 패턴을 이용할 수 있다.

## promise pattern
- 비동기 액션을 초기화하고 성공과 실패 케이스를 각각 처리할 콜백을 준다.
- 이벤트 기반의 비동기 프로그래밍보다 훨씬 더 이해하기 쉽고 우아하며 탄탄한 코드를 작성할 수 있다.

## partial pattern

## memoization pattern

## singleton pattern

## factory pattern

## sandbox pattern

## decoration pattern
- 단일 책임 원칙을 준수하면서 믿음성이 강화된 코드를 효과적으로 작성할 수 있다.

## strategy pattern

## proxy pattern

## chaning pattern 

