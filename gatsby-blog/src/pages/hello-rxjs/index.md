---
title: hello-RxJS
date: "2019-01-28T10:00:03.284Z"
---

# Intro

* RxJS 의 특징을 알아보고 공부하자.
* RxJS 의 공홈을 독파해보자.

## definition

* RxJS 는 Observables 을 이용한 반응형 프로그래밍을 할수 있게 도와주는 라이브러리 입니다. 비동기와 콜백 베이스 코드를 observable sequence 들을 이용해서 좀 더 쉽게 구성할수 있게 만들어준다.
* RxJS 는 Observable 이라는 코어 타입과 몇몇 서브 타입( Observer, Schedulers, Subjects ) 그리고 Array 의 함수에서 영감을 받은 operator 들이 있다. 이 operator 들은 비동기 이벤트를 collection 들 처럼 처리할 수 있습니다.
* RxJS 이벤트의 시퀀스를 관리하기 위한 방법으로는 Observer pattern 과 Iterator pattern 과 collection 과 함께하는 functional programming 를 합쳐 놓은 것이다.

## Essential Concepts

* Observable : 미래 값 또는 이벤트들의 호출 가능한 컬렉션의 아이디어를 나타낸다.
* Observer : Observer 는 컬렉션의 콜백이다. 이 콜백은 Observable 이 전달한 값을 듣는 방법을 알고 있습니다.
* Subscription : Observerable 의 실행을 뜻하며 대게 실행을 취소하는데 유용하다.
* Operators : Operation 은 순수함수이다. 컬렉션 들을 functional programming 스타일로 다루는것을 가능하게 한다. 마치 map, filter, concat, reduce 등등
* Subject : Subject 는 EventEmitter 와 같다. 값 또는 이벤트를 여러 관찰자에게 멀티 캐스팅 하는 유일한 방법이다. 기본적인 Subject 는 subscribe 한 뒤( observer 생성 ) next 메서드로 실행한 값(emit)만 받아올수 있다. 즉, subscribe 이전에 next 호출에 대해서는 구독을 할 수 없다. observable 과의 차이는....
  * BehaviorSubject : 기본 Subject 와 다르게 subscribe 가 만들어지기(observer) 바로 직전 next 호출까지 (emit) 받아올수 있다.
  * ReplaySubject(number, \[time\]) : subscribe 가 만들어지기 (observer) n 번째 전 next 호출까지 받아올수 있다. 두번째 인자는 옵셔널 하게 시간을 줄 수 있는데 subscribe 가 만들어지기 (observer) time 시간전에 발생된 next 호출 (emit) 까지 받아 올 수 있다.
  * AsyncSubject : 가장 마지막 emit 한 value 의 값을 complete 한 메서드가 호출 되었을때만 가져오게 된다. 만약 complete() 메서드가 호출 되지 않는다면 아무것도 observer 는 받아오지 않는다.
* Schedulers : Schedulers 들은 중앙의 dispatcher 들이다. 이 디스패처들은 concurrency 를 컨트롤 하는 녀석들인데 여기서 concurrency 를 컨트롤 한다는 것은 시분할을 조절한다는 뜻이다. 이것은 계산이 언제 일어나는지를 조정할수 있게 합니다. 예를 들면 setTimeout 또는 requestAnimationFrame 그 외의 것들입니다.

## 출처

[https://www.youtube.com/watch?v=PhggNGsSQyg](https://www.youtube.com/watch?v=PhggNGsSQyg)
[https://www.youtube.com/watch?v=2f09-veX4HA&t=1714s](https://www.youtube.com/watch?v=2f09-veX4HA&t=1714s)
[https://oaksong.github.io/2017/12/23/concurrency-and-parallelism/](https://oaksong.github.io/2017/12/23/concurrency-and-parallelism/)
