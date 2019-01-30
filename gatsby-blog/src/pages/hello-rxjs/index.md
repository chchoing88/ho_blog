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

* Observable : 미래 값 또는 이벤트들의 호출 가능한 컬렉션의 아이디어를 나타낸다. Observable 은 모든 operators 를 가지고, 이들을 구독할수 있다.
* Observer : Observer 는 컬렉션의 콜백이다. 이 콜백은 Observable 이 전달한 값을 듣는 방법을 알고 있습니다. Observer 는 next, error, complete 메서드를 지닌다.
* Subscription : Observerable 의 실행을 뜻하며 대게 실행을 취소하는데 유용하다.
* Operators : Operation 은 순수함수이다. 컬렉션 들을 functional programming 스타일로 다루는것을 가능하게 한다. 마치 map, filter, concat, reduce 등등
* Subject : Subject 는 EventEmitter 와 같다. 값 또는 이벤트를 여러 관찰자에게 멀티 캐스팅 하는 유일한 방법이다. 기본적인 Subject 는 subscribe 한 뒤( observer 생성 ) next 메서드로 실행한 값(emit)만 받아올수 있다. 즉, subscribe 이전에 next 호출에 대해서는 구독을 할 수 없다.
  Subject 는 observable 이고 observer 다. 그래서 subject 는 observable 과 많은 observer 들 사이에서 bridge/proxy 형태로 행동할수 있다. 이 행동은 다수의 observer 들에게 같은 observable 실행을 공유 할수가 있다.
  * BehaviorSubject : 기본 Subject 와 다르게 subscribe 가 만들어지기(observer) 바로 직전 next 호출까지 (emit) 받아올수 있다.
  * ReplaySubject(number, \[time\]) : subscribe 가 만들어지기 (observer) n 번째 전 next 호출까지 받아올수 있다. 두번째 인자는 옵셔널 하게 시간을 줄 수 있는데 subscribe 가 만들어지기 (observer) time 시간전에 발생된 next 호출 (emit) 까지 받아 올 수 있다.
  * AsyncSubject : 가장 마지막 emit 한 value 의 값을 complete 한 메서드가 호출 되었을때만 가져오게 된다. 만약 complete() 메서드가 호출 되지 않는다면 아무것도 observer 는 받아오지 않는다.
* Schedulers : Schedulers 들은 중앙의 dispatcher 들이다. 이 디스패처들은 concurrency 를 컨트롤 하는 녀석들인데 여기서 concurrency 를 컨트롤 한다는 것은 시분할을 조절한다는 뜻이다. 이것은 계산이 언제 일어나는지를 조정할수 있게 합니다. 예를 들면 setTimeout 또는 requestAnimationFrame 그 외의 것들입니다.

## Examples

### Purity

RxJS 를 파워풀하게 만드는것은 pure function 을 사용해서 value 를 만드는게 가능하다는 것이다. 이것은 실수를 줄여주는 코드를 만들게 해준다.

보통 impure function 을 사용하게 되면 다른 코드 조각들이 당신의 state 를 더럽히게 된다.

```javascript
var count = 0
var button = document.querySelector('button')
button.addEventListener('click', () => console.log(`Clicked ${++count} times`))
```

RxJS 를 사용하면 state 를 독립시킬수 있다.

```javascript
const { fromEvent } = rxjs
const { scan } = rxjs.operators

const button = document.querySelector('button')
fromEvent(button, 'click')
  .pipe(scan(count => count + 1, 0))
  .subscribe(count => console.log(`Clicked ${count} times`))
```

여기서 scan operator 는 array 의 reduce 처럼 움직인다.

### Flow

RxJS 는 모든 범위의 operator 를 가지고 있다. 이것은 observable 을 통해 이벤트 흐름을 제어하는 방법을 도와준다.

플래인 자바스크립트

```javascript
var count = 0
var rate = 1000
var lastClick = Date.now() - rate
var button = document.querySelector('button')
button.addEventListener('click', () => {
  if (Date.now() - lastClick >= rate) {
    console.log(`Clicked ${++count} times`)
    lastClick = Date.now()
  }
})
```

RxJS 를 이용

```javascript
const { fromEvent } = rxjs
const { throttleTime, scan } = rxjs.operators

const button = document.querySelector('button')
fromEvent(button, 'click')
  .pipe(throttleTime(1000), scan(count => count + 1, 0))
  .subscribe(count => console.log(`Clicked ${count} times`))
```

다른 flow 를 컨트롤 하는 operator 에는 filter, delay, debounceTime, take, takeUntil, distinct, distinctUntilChanged 등이 있다.

### Values

value 를 observable 로 전달하면서 변화를 시킬수 있다.

```javascript
let count = 0
const rate = 1000
let lastClick = Date.now() - rate
const button = document.querySelector('button')
button.addEventListener('click', event => {
  if (Date.now() - lastClick >= rate) {
    count += event.clientX
    console.log(count)
    lastClick = Date.now()
  }
})
```

```javascript
const { fromEvent } = rxjs
const { throttleTime, map, scan } = rxjs.operators

const button = document.querySelector('button')
fromEvent(button, 'click')
  .pipe(
    throttleTime(1000),
    map(event => event.clientX).scan((count, clientX) => count + clientX, 0)
  )
  .subscribe(count => console.log(count))
```

value 를 만드는 operator 에는 pluck, pairwise, sample 들이 있다.

## Observable

Observable 은 다양한 값을 지닌 lazy Push collections 이다.

|      | SINGLE   | MULTIPLE   |
| ---- | -------- | ---------- |
| Pull | Function | Iterator   |
| Push | Promise  | Observable |

보통 우리는 data 를 생성하는 쪽(data source)과 data 를 받는 쪽(data receiver)으로 생각할 수 있다. 여기서 push 라 함은 data 생성하는 쪽(data source)이 생성한 data 를 data 받는 쪽(data receiver)에게 전달할 때를 결정한다. 반대로 pull 이라 함은 data 받는 쪽(data receiver)에서 data 생성하는 곳(data source)으로 부터 받을 때를 결정한다.

가장 유명한 push 행동 방식은 eventListener 를 DOM element 에 적용하는 방식이다. 여기서 handler 는 data 를 받는 쪽(data receiver) 유저가 DOM 에 인터렉션을 하는건 data 생성자(data source)에 해당한다. 따라서 여기서는 data 생성자가 data 전달을 결정한다.

반대로 pull 방식은 대부분 사용하는 javascript 의 function 이다.
모든 function 은 pull system 이다. 어떤 코드가 function 을 호출 했다는 것은 function 으로 부터 data 를 요청 했다는 것이다. 그래서 data 받는 쪽이(data receiver) data 생성자로부터(data source) data 를 당겼다는 의미에서 pull 행동이다.

또한 function 은 한가지 값만을 위한 pull system 이 아니다. ES6 의 generator function 은 return multiple values 를 할수 있다. 각각 시간마다 data receiver 는 next 메서드를 호출하면 data source 는 매번 다른 값을 yield 시키고 receiver 에게 전달해준다.

## 출처

[https://www.youtube.com/watch?v=PhggNGsSQyg](https://www.youtube.com/watch?v=PhggNGsSQyg)
[https://www.youtube.com/watch?v=2f09-veX4HA&t=1714s](https://www.youtube.com/watch?v=2f09-veX4HA&t=1714s)
[https://oaksong.github.io/2017/12/23/concurrency-and-parallelism/](https://oaksong.github.io/2017/12/23/concurrency-and-parallelism/)
[https://netbasal.com/understanding-subjects-in-rxjs-55102a190f3](https://netbasal.com/understanding-subjects-in-rxjs-55102a190f3)
