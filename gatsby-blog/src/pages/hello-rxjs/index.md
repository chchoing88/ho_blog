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

아주 간단한 Observable 을 만든다면 아래와 같을 것이다.

```javascript
class Observable {
  constructor(functionThatThrowsValues) {
    this._functionThatThrowsValues = functionThatThrowsValues
  }
  subscribe(observer) {
    return this._functionThatThrowsValues(observer)
  }
}

// 실행문
let fakeAsyncData$ = new Observable(observer => {
  setTimeout(() => {
    observer.next('New data is coming')
    observer.complete()
  }, 2000)
})

fakeAsyncData$.subscribe({
  next(val) {
    console.log(val)
  },
  error(e) {
    console.log(e)
  },
  complete() {
    console.log('complete')
  },
})
```

여기서 중요한 것은 Observable 에 넘기는 함수`(functionThatThrowsValues)`는 반드시 `구독(subscribe)` 하는 녀석이 있어서 실행된다는 것이다.

또한 Observable 에서 observer 들을 모두 배열이나 다른 데이터 구조로 지니고 있는 것이 아니라 구독할때 observer 자신을 넘긴다는 것이다. `(subscribe(observer))` 그리고 나서 값이 새로 생성되는 함수에 observer 를 넘겨서 실행하면 `(this._functionThatThrowsValues(observer))` 해당 함수에서 동기 또는 비동기 적으로라도 observer 에 next 메서드를 호출해서 새로운 값을 push 해줄 수 있다.

`subscribe` 메서드로 여러 observer 들을 등록해도 모두 push 해줄 수 있다.

아래 코드는 조금 더 진화된 코드

```javascript
class Observable {

  constructor(functionThatThrowsValues) {
    this._functionThatThrowsValues = functionThatThrowsValues;
  }

  subscribe(next, error, complete) {
    if (typeof next === "function") {
      return this._functionThatThrowsValues({
        next,
        error: error || () => {},
        complete: complete || () => {}
      });
    }
    else {
      return this._functionThatThrowsValues(next);
    }

  }


  map(projectionFunction) {
      return new Observable(observer => {
        return this.subscribe({
           next(val) { observer.next(projectionFunction(val)) },
           error(e) { observer.error(e) } ,
           complete() { observer.complete() }
        });
      });
  }

  mergeMap(anotherFunctionThatThrowsValues) {
    return new Observable(observer => {
      return this.subscribe({
        next(val) {
          anotherFunctionThatThrowsValues(val).subscribe({
            next(val) {observer.next(val)},
            error(e) { observer.error(e) } ,
            complete() { observer.complete() }
          });
        },
        error(e) { observer.error(e) } ,
        complete() { observer.complete() }
      });
    });
  }

  static fromArray(array) {
    return new Observable(observer => {
      array.forEach(val => observer.next(val));
      observer.complete();
    });
  }

  static fromEvent(element, event) {
    return new Observable(observer => {
      const handler = (e) => observer.next(e);
      element.addEventListener(event, handler);
      return () => {
        element.removeEventListener(event, handler);
      };
    });
  }

  static fromPromise(promise) {
    return new Observable(observer => {
      promise.then(val => {
        observer.next(val); observer.complete();
      })
      .catch(e => {
        observer.error(val); observer.complete();
      });
    })
  }
}
```

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

## Error handling

* stream 이 completes 가 되면, 이후에 error 는 방출되지 않는다.
* stream 이 error 를 발생하면, 이후에 complete 하지 않는다.

따라서 에러 발생 시점에 어떻게 이 recover 를 할수 있을지 생각해야 한다.

subscribe 는 항상 3 가지의 부가적인 arguments 를 받는다.

* success handler 함수는 stream 에서 value 가 발생할때마다 불러진다.
* error handler 함수는 오직 error 발생시에만 호출된다.
* completion handler 함수는 stream 이 끝났을때만 호출된다.

subscribe 에서 error handling 접근은 제한적이다. 왜냐하면 error 와 백엔드에서 대체할수 있는 값을 내려주었을때 복귀할수가 없다.

그래서 몇몇 에러를 핸들링할 operatior 을 배워보자.

### catchError Operator

해당 Operator 는 input Observable 을 받아서 output Observable 을 내보내는 간단한 함수이다.

catchError 를 호출하려면, error handling 이라는 함수를 전달해줘야 한다.

catchError 는 error 를 방출하는 Observable 을 받아서 output Observable 에서 그 에러 값을 방출하기 시작한다.
만약 에러가 발생하지 않는다면 catchError 로 생성된 output Observable 은 똑같이 input Observable 처럼 작동한다.

반대로 에러가 발생되면 catchError operator 는 error 를 받아서 error handling 함수로 전달된다. 이 함수는 에러를 방출한 stream 을 다른 stream 으로 대체하는 replacement Observable 을 생성하는 역활을 한다.

아래 예제를 보자.

아래 예제는 에러를 감지하고 replace 하는 전략을 보여준다.
catchError 에 error handling 함수를 전달한다. 이 핸들러 함수는 평범한 상황일때는 호출되지 않다가 입력받는 observable 에서 error 가 발생되면 그때 호출이 된다.

만약 input stream 에서 에러가 발생되면 이 함수는 `of([])` 를 사용해서 Observable 을 생성해 리턴한다.
여기서 `of()`는 오직 한번 []의값을 방출하고 complete 되는 Observable 을 생성하는 함수이다.
error handling 함수는 recovery Observable 인 `of([])`를 리턴한다.
recovery Observable 의 값들은 catchError 에 의해 리턴된 output Observable 안에서 방출되는 replacement value 들 이다.

결과적으론 http$ Observable 은 error 를 더이상 발생시키지 않는다. 따라서 subscribe 에서 error handling 은 호출되지 않는다. 대신 빈배열인 [] (빈배열 : fallback value) 값을 방출하고 http$ observable 은 completed 된다.

```javascript
const http$ = this.http.get<Course[]>('/api/courses');

http$
    .pipe(
        catchError(err => of([]))
    )
    .subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );

// 결과 콘솔
// HTTP response []
// HTTP request completed.  
```

위와 같은 상황에서 Rethrow 도 할수 있다. 위 상황처럼 대처하기 보다는 local 에서 error 를 핸들링하고 싶을때 즉, 에러 메세지를 유저에게 보여주고 싶을때 사용된다.

아래와 같이 `throwError`를 사용해주면 된다.
이 `throwError`는 value 를 방출하지 않고 catchError 와 동일한 error 를 사용해서 error 를 내주는 Observable 을 생성한다.

```javascript
const http$ = this.http.get<Course[]>('/api/courses');

http$
    .pipe(
        catchError(err => {
            console.log('Handling error locally and rethrowing it...', err);
            return throwError(err);
        })
    )
    .subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );
```

또한 아래처럼 Observable 체인에서 여러번 사용할 수 있다.

```javascript
const http$ = this.http.get<Course[]>('/api/courses');

http$
    .pipe(
        map(res => res['payload']),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        }),
        catchError(err => {
            console.log('caught rethrown error, providing fallback value');
            return of([]);
        })
    )
    .subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );
```

try..catch..finally 문 처럼 RxJs 에서도 Finalize Operator 가 있다. 예제는 아래와 같다.

```javascript
const http$ = this.http.get<Course[]>('/api/courses');

http$
    .pipe(
        map(res => res['payload']),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        }),
        finalize(() => console.log("first finalize() block executed")),
        catchError(err => {
            console.log('caught rethrown error, providing fallback value');
            return of([]);
        }),
        finalize(() => console.log("second finalize() block executed"))
    )
    .subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );

// 결과
// 에러발생
// caught mapping error and rethrowing {에러객체}
// caught rethrown error, providing fallback value
// first finalize() block executed
// HTTP response []
// HTTP request completed.  
// second finalize() block executed
```

재 시도에 대한 전략도 세울수가 있다.
만약 스트림이 에러가 발생했을 경우 우리는 input Observable 을 다시 subscribe 할수 있는 새로운 stream 을 만들어야 한다.

언제 재시도를 해야할까?

즉시 실행이 가능할까? 또는 몇초 뒤에 실행해야할까, 문제가 해결되고 다시 시도하길 바랄수도 있다, 또는 몇몇 시도를 제안 둘수도 있을까?

우리는 위와 같은 답을 얻기 위해서 보조적인 Observable 이 필요하다. 이름하야 Notifier Observable. 이 Observable 은 언제 재시도를 해야할지 알려준다.

즉시 실행하는 방법은 `retryWhen` 를 사용한다. 이것은 간단하게 input Observable 을 Notification Observable 이 값을 방출할때마다 재 시도 하는 것이다.

그럼 여기서 어떻게 Notification Observable 을 만들 것인가.
`retryWhen` operator 에 전달된 함수가 Notification Observable 을 만들고 이 함수는 Error Observable 을 인자로 받는다.

에러가 발생 즉시 재시도를 하기 위해서 여기서 해야할 일은 Error Observable 을 변화시키지 않고 리턴하는 것이다. 그래야 이 Error Observable 을 구독함으로써 언제 정확히 에러가 발생하는지 알 수 있는 Notification Observable 을 만들어 낼 수 있다. 아래 코드에서는 tap operation 을 사용했는데 이는 단지 로깅을 위한 목적으로 쓰이고 Error Observable 은 변화시키지 않았다.

여기서 기억해야하는것은 `retryWhen` 함수 호출에서 반환되는 Observable 은 Notification Observable 이라는 것이다. 이곳에서 어떤 값이 방출되는건 중요치 않다. 단지 재시도를 하기 위한 트리거이기 때문에 중요한건 언제 방출된 값을 받았는지가 중요하다.

```javascript
const http$ = this.http.get<Course[]>('/api/courses');

http$.pipe(
        tap(() => console.log("HTTP request executed")),
        map(res => Object.values(res["payload"]) ),
        shareReplay(),
        retryWhen(errors => {
            return errors
                    .pipe(
                        tap(() => console.log('retrying...'))
                    );
        } )
    )
    .subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );

// 결과
// 에러
// retrying...
// HTTP request executed
// HTTP response
// HTTP request completed.
```

또는 딜레이를 주는 방법이 있다. 특히 트레픽이 높아서 네트워크 실패인 경우 유용하게 사용할 수 있다.
ex) `timer(3000,1000)` 3 초 뒤에 1 초마다 발생, 2 번쨰 인자는 옵셔널한 인자인데 주지 않는다면 3 초 뒤에 값이 한번 발생하고 complete 되는 것이다.

한가지 중요한 점은 `retryWhen` Operator 의 Notification Observable 를 정의하는 함수(인자로 전해지는 함수)는 오직 한번만 호출된다는 점이다. 그래서 재 시도를 해야할 신호가 왔을때 Notification Observable 을 정의할 기회는 한번 뿐이라는 것이다.

우리는 Error Observable 을 받을때 Notification Observable 을 정의하고 `delayWhen` 를 적용할 것이다.

```javascript
const http$ = this.http.get<Course[]>('/api/courses');

http$.pipe(
        tap(() => console.log("HTTP request executed")),
        map(res => Object.values(res["payload"]) ),
        shareReplay(),
        retryWhen(errors => {
            return errors
                    .pipe(
                        delayWhen(() => timer(2000)),
                        tap(() => console.log('retrying...'))
                    );
        } )
    )
    .subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );
```

Error Observable 에서 들어오는 각각의 error 값에 delay 를 적용하기 위해서 `delayWhen` 에 전달된 함수(duration selector function 이라 부른다.)를 호출한다. 이 함수는 input value 가 어느정도 경과했는지를 결정할 Observable 을 방출한다.

각각의 input value 에는 duration selector Observable 을 가지고 있다. 이 Observable 이 결국 값을 emit 하고 나면 input value 가 delayWhen 의 ouput 으로 보여지게 된다.

에러가 발생할때마다 `delayWhen` operator 는 timer 함수를 호출함으로써 duration selector Observable 를 생성하게 된다. 이 duration selector Observable 는 0 값이 2 초후에 발생하게 되고 그 후엔 complete 된다. 그 일이 일어나게 되면 `delayWhen` Observable 은 주어졌던 error input 의 경과시간을 알게 되고 2 초라는 경과시간이 지나게 되면 error 는 notification Observable ouput 에 보여지게 된다. notification 에 value 가 emit 하게 되면, `retryWhen` operator 는 재시도를 하게 된다.

## Higher-Order RxJs Mapping Operator (switchMap, mergeMap, concatMap, exhaustMap)

제일먼저 mapping operation 을 이해하기 전에 기본 로직인 concat, merge, switch and exhaust 전략부터 살펴볼것이다.

끝으로는 어떻게 mapping operation 이 동작하고 언제 사용하고 왜 사용하는 이유까지 알게 될것이다.

### RxJs Map Operator

이름에서 알수 있듯이 그것은 무엇인가를 mapping 하고 있는 것이다. 하지만 정확히 무엇을 mapping 하고 있는 것인까?
map 연산자를 사용하면 input stream 의 값들을 가져올 수 있으며 그 값에 파생하는 output stream 을 만들 수 있습니다.

그래서 map operator 는 input observable 의 값들을 매핑해주는 것이다.

```javascript
const http$: Observable<Course[]> = this.http.get('/api/courses')

http$
  .pipe(
    tap(() => console.log('HTTP request executed')),
    map(res => Object.values(res['payload']))
  )
  .subscribe(courses => console.log('courses', courses))
```

위 예제를 보자. 우리는 하나의 HTTP observable 을 만들었다. 이것은 backend 에 요청을 보내고 그 답을 구독하게 된다. 이 observable 은 backend 의 응답이 오면 값을 방출하게 된다.

이 경우, 응답은 data 의 payload 프로퍼티에 감싸여져서 내려온다. 이 값을 얻기 위해서 우린 RxJs map operator 를 사용한다. mapping function 은 JSON response payload 에 매핑하고 그 값을 추출한다.

아래는 간단한 map 함수의 매커니즘이다.

```javascript
fakeAsyncData$.map(val => `New value ${val}`).subscribe({
   next(val) { console.log(val) } ,
   error(e) { console.log(e) } ,
   complete() { console.log(‘complete’) }
});

map(projectionFunction) {
     return new Observable(observer => {
       return this.subscribe({
          next(val) { observer.next( projectionFunction(val)) },
          error(e) { observer.error(e) } ,
          complete() { observer.complete() }
        });
     });
  }
```

우리가 `map` 메서드를 호출하게 되면 `new Observable`이 리턴된다. 이 Observable 에는 현재 source 코드에 대한 subscribes 가 들어있는데 이때 source 에 해당하는 것이 `fakeAsyncData$`가 되겠다. source 코드에서 새로운 값이 던져지게 되면 map 메서드가 받게 되고, 그 값을 `projectionFunction` 에 실어서 실행하게 된다. 그리곤 map 메서드에서 리턴했던 Observable 을 구독하고 있는 우리에게 그 `projectionFunction` 실행하고 리턴된 값이 전해지게 된다. (우리는 map Observable 을 구독하고 있어야 한다는 점을 명심하자.)

### What is Higher-Order Observable Mappping?

higher-order mapping 은 일반 plain value 1 을 10 으로 맵핑하는 대신에 값을 Observable 로 mapping 한다. 그 observable 을 higher-order Observable 이라고 한다. 이 higher-order Observable 은 다른 Observable 과 같은 마찬가지 이지만 그것이 방출하는 값들은 일반 plain 값이 아닌 우리가 별도로 구독할 수 있는 Observable 들이라는 점이다.

쉽게 말해 아래와 같은 코드가 있다.

```javascript
const click$ = Observable.fromEvent(button, 'click')
const interval$ = Observable.interval(1000)

const clicksToInterval$ = click$.map(event => {
  return interval$ // observable을 mapping
})

clicksToInterval$.subscribe(intervalObservable =>
  console.log(intervalObservable)
)
```

여기서 `clicksToInterval$`은 higher-order Observable 이다. 우리가 이 Observable 을 구독하는 순간 `click$` Observable 은 `interval$` observable 과 함께 next()를 호출 할것이다. 그렇게 되면 클릭시 일반적인 map 에서 보였던 plain 한 값이 보이지 않고 실행되지 않은 interval observable 객체가 보일것이다.

그것은 `interval$` observable 을 구독하지 않았기 때문이다. observable 들은 lazy 이다. 만약 observable 이 지닌 값들을 가져오고 싶다면 반듯이 `subscribe()` 해야한다.

```javascript
clicksToInterval$.subscribe(intervalObservable$ => {
  intervalObservable$.subscribe(num => {
    console.log(num)
  })
})
```

위 처럼 하면 다시 값이 보일것이다. 이게 가장 자연스럽게 이해할수있는 higer order observable 이다.

특히 `mergeAll()` 메서드는 higher order observable 의 이해를 돕기 위한 좋은 예제이다.

```javascript
const click$ = Observable.fromEvent(button, ‘click’);
const interval$ = Observable.interval(1000);

const observable$ = click$.map(event => {
   return interval$;
});

observable$.mergeAll().subscribe(num => console.log(num));
```

`mergeAll()`의 경우에는 inner observable(여기서 interval$에 해당함)을 받아다가 그것을 구독하고 해당 값을 observer 에게 전달시켜 준다. 즉, inner observable 이 emits 될때 그 값을 outer observable와 merging 해서 나에게 알려줍니다. 

위의 경우에서는 source observable(또는 outer observable) 은 `click$` observable 이고 inner observable 은 `interval$` 이다.
그래서 mergeMap()은 단지 map() + mergeAll() 이다.

위 코드를 mergeMap()으로 짠다면 아래와 같다.

```javascript
const click$ = Observable.fromEvent(button, ‘click’);
const interval$ = Observable.interval(1000);

const observable$ = click$.mergeMap(event => { 
   return interval$;
});

observable$.subscribe(num => console.log(num));
```

### why Higher-Order Observables?

만약 폼 데이터를 중간에 조금씩 저장해서 만일에 잘못된 새로고침에 전체 양식의 손실을 방지하기 위한 작업이 필요하다고 생각해보자.
폼의 value 들이 변화가 생기고 일정시간 가장 마지막 변화를 감지하면 그 값들을 가지고 백엔드에다가 저장시킨다고 해보자.

폼 값들을 저장하는 수행을 함수형으로 짜기 위해선 값을 받고 그 이후에 HTTP observable 을 생성해야한다. 그리고 그 결과 값을 구독해야한다.

이 수행을 매뉴얼하게 짠다고 하면 아래와 같은 그림이 될 것이다.

```javascript
this.form.valueChanges
    .subscribe(
       formValue => {

           const httpPost$ =
                 this.http.put(`/api/course/${courseId}`, formValue);

           httpPost$.subscribe(
               res => ... handle successful save ...
               err => ... handle save error ...
           );

       }
    );
```

하지만 위 그럼인 중첩된 subscribe 인 안티패턴에 속하게 된다.

단점으로는 첫번째로는 callback hell 에 빠질수 있고, 두번째로는 각각의 observable 의 subsciption 처리를 스스로가 해야한다는 점이 있다.

### Avoiding nested subscriptions

만약 위 상황에서 여러 폼 값을 빠르게 연속적으로 내보내고 저장 작업을 완료하는데 시간이 걸리는 경우 어떻게 되는지 생각해보자.

* 우리는 다른 save request 하기 전에 하나의 save request 가 완료되기를 기다리고 싶나?
* 우리는 병렬로 save 들을 하고 싶나?
* 우리는 새로운 save request 가 나타나면 진행했던것을 취소하고 싶나?
* 우리는 이미 진행중인 save request 동안 새로운 save request 에 대해서 무시하고 싶나?

위 처럼 중첩된 상황이라면 우리는 실제로 병렬로 save operation 을 발생시킨다. 이것은 사실 우리가 원하는 방식은 아니다. 왜냐하면 백엔드에서 순차적으로 저장한다는 보장이 없기 때문이고, 마지막 유효한 값이 실제로 백엔드에 저장되었다고 볼수 없기 때문이다. 이 방법을 higher-order observable 로 피해보자.

### Understanding Observable Concatenation

위 예제에서 순차적으로 저장을 하기 위해선 우린 새로운 Observable concatenation 개념을 소개한다.

```javascript
const series1$ = of('a', 'b')

const series2$ = of('x', 'y')

const result$ = concat(series1$, series2$)

result$.subscribe(console.log)

// 결과
// a
// b
// x
// y
```

여기서 `of()` 함수는 `of()`로 전달된 값을 방출하고 그 이후에 값을 모두 방출하면 complete 되는 Observable 을 생성한다.

`concat()` 은 처음인자로 들어온 `series1$` 을 처음으로 구독하고 두번째 인자인 `series2$`는 구독하지 않는다. ( 이것이 중요한 이해이다. )
`series1$`이 값을 방출하면 바로 `result$` Observable output 에 반영된다고 이때 `series2$`는 값을 방출하지 않는다. 왜냐하면 아직 구독하지 않기 때문이다. 이후에 `series1$` 이 complete 가 되면 `series2$`를 구독하기 시작한다. 그럼 `series2$` 값이 output 으로 반영되고 `series2$`가 complete 되면 `result$` Observable 도 끝나게 된다.

여기서 중요한것은 첫번째 Observable 이 끝나야 다음 Observable 을 구독해서 실행한다는 것이다. 이 작업은 모든 Observable 이 끝날때 까지 실행된다.

### Using Observable Concatenation to implement sequential saves

위 폼 예제에서 값을 순차적으로 받아서 저장하기 위해서는 각각의 폼 값들을 받아서 그 값들을 `httpPost$` Observable 에 mapping 할 필요가 있다.
그래서 우리는 여러 `httpPost$` Observable 들을 함께 concatenate 를 할 필요가 있다.

우리가 필요한 것은 아래 두가지 이다.

* a higher-order mapping operation( 폼 값을 받고 그 값을 `httpPost$` Observable 로 변환하기 위해서 )
* `concat()` operation 은 여럿 `httpPost$` Observable 을 이전 save complete 가 되기 전에 HTTP save 가 만들어지지 않는 것을 보장하기 위해 concatenating 을 한다.

이 두가지를 믹스 시킨것을 RxJs concatMap Operator 라고 이름을 붙일것이다.

### The RxJs concatMap Operator

위에서 말했던 concatMap 을 사용하면 아래 코드와 같을 것이다.

```javascript
this.form.valueChanges
    .pipe(
        concatMap(formValue => this.http.put(`/api/course/${courseId}`,
                                             formValue))
    )
    .subscribe(
       saveResult =>  ... handle successful save ...,
        err => ... handle save error ...
    );
```

이 concatMap 같은 higher-order mapping operator 를 사용하면 더이상 subscribe 를 중첩시키지 않아도 된다. 또한 모든 폼 값들이 backend 에 순차적으로 전달될것이며 이는 크롬 DevTools 의 네트워크 탭에서 확인할 수 있다.

`concatMap` 은 각 폼 값을 save HTTP Observable 을로 변환을 시킨다. 이를 우리는 inner Observable 이라 부를 것이다. 그 후에 inner Observable 을 구독하고 그 결과를 output 시킨다.
두번째 폼 값이 이전 값 저장하는 것보다 더 빠르게 방출될것이다. 만약 이런일이 발생한다면 새로운 폼 값은 그 즉시 HTTP request 로 mapping 되지 않는다. 대신에 `concatMap`은 이전 HTTP Observable 이 complete 될때 까지 기다린다.

### Observable Merging

만약 다른 상황을 우리가 원한다면, 이전 Observable 이 끝나기를 기다리지 않고 병렬로 처리를 원한다면 이때 우리는 Merge 전략을 사용할수 있다. Merge 는 Concat 과 다르게 Observable 이 끝나기를 기다려주지 않는다.

대신에 merge 구독은 매 Observable 과 같은 타임에 merged 된다. 그 후에 각 source Observable 의 값들이 시간이 자나서 혼합되어서 여러 값으로 result Observable 에 나타나게 된다.

```javascript
const series1$ = interval(1000).pipe(map(val => val * 10))

const series2$ = interval(1000).pipe(map(val => val * 100))

const result$ = merge(series1$, series2$)

result$.subscribe(console.log)

// 결과
// 0
// 0
// 10
// 100
// 20
// 200
// 30
// 300
```

여기서 보면 혼합된 source Observable 의 값이 result Observable 에 즉시 나타난것을 볼수 있다. 만약 머지당한 source Observable 중 하나가 complete 된다면, merge operator 는 계속 다른 Observable 의 값을 방출할 것이다.

### The RxJs mergeMap Operator

만약 우리가 merge 전략과 higher-order Observable mapping 을 혼합한다면 우린 RxJs mergeMap Operation 을 얻을 수 있다.

mergeMap operator 작동방법은 다음과 같다.

각 source Observable 의 값은 concatMap 과 같이 inner Observable 로 mapping 된다. 이 inner Observable 은 mergeMap 에 의해서 구독된다.
inner Observable 이 새로운 값을 방출할때, 그것들은 즉시 output Observable 에 반영된다.
다만 concatMap 과 다르게 mergeMap 의 경우에는 다음 inner Observable 이 일으키기(triggering) 전에 이전 inner Observable 이 complete 되는것을 기다려주지 않는다. 이 의미는 mergeMap 은 여러개의 inner Observable 이 시간이 지나서 겹칠수도 있다는것을 뜻한다. result Observable 에 반영되는 값들이 서로 겹쳐서 진행될 수 있다는 것이다.

위 예제의 경우 우린 concatMap 이 더 깔끔하다. 우린 병렬로 저장되길 원하지 않기 때문에 mergeMap 은 적합지 않다.

```javascript
this.form.valueChanges
    .pipe(
        mergeMap(formValue =>
                 this.http.put(`/api/course/${courseId}`,
                               formValue))
    )
    .subscribe(
       saveResult =>  ... handle successful save ...,
        err => ... handle save error ...
    );
```

위와 같이 mergeMap 을 사용했을 경우 우린 여러번 save request 가 병렬로 동작하는 모습을 크롬의 네트워크 탭에서 볼 수 있다. 그래서 이 경우는 error 다. 이런 로드가 많은 경우 이러한 요청이 순서없이 처리 될 수 있기 때문이다.

아래는 가장 기본적인 mergeMap()의 실행문이다.

```javascript
function myMergeMap(innerObservable) {
  /** the click observable, in our case */
  const source = this

  return new Observable(observer => {
    source.subscribe(outerValue => {
      /** innerObservable — the interval observable, in our case */
      innerObservable(outerValue).subscribe(innerValue => {
        observer.next(innerValue)
      })
    })
  })
}

Observable.prototype.myMergeMap = myMergeMap
```

### Observable Switching

switching 은 merging 과 비슷하다. 그말인 즉슨, 어떤 Observable 이라도 끝날때 까지 기다려 주지 않는다는 말이다.

하지만 merging 과 다르게 만약 새로운 Observable 의 값이 방출이 된다면 이전 Observable 의 구독을 취소해 버린다.

Observable switching 은 사용하지않는 Observable 의 구독취소 트리거를 발생시켜서 자원을 released 한다.

switching Marble Diagram 을 보면 맨 위의 higher-order Observable 에서 대각선으로 forks 되는 순간이 value Observable 이 방출되고 switch 에 구독되는 순간이다.

여기서 중요한건 이런 그림들이 higher-order Observable 로 부터 fork 된 diagonal lint 의 그 시점 일때 각 inner Observable 이 구독이 되던지 또는 구독이 취소되던지 하는 그림이 필요하기 때문에 갈라지는 선을 표현하게 된다.

### The RxJs switchMap Operator

이제 switch 전략과 그것을 higer order mapping 을 적용시켜보자. 여기서 input stream 이 1,3 그리고 5 를 방출할 계획을 가지고 있다고 해보자.

우리는 각 값을 Observable 로 mapping 한다. 다른 concatMap 그리고 mergeMap 케이스들과 같이 higer-order Observable 을 얻는다.
만약 방출된 inner Observable 사이에서 switch 가 일어났다고 했을때, 그것들을 concatenating 또는 mergeing 하는 대신에 switchMap Operator 로 종료시킨다.

```javascript
function mySwitchMap(innerObservable) {
  /** the click observable, in our case */
  const source = this
  let innerSubscription

  return new Observable(observer => {
    source.subscribe(outerValue => {
      innerSubscription && innerSubscription.unsubscribe()

      /** innerObservable — the interval observable, in our case */
      innerSubscription = innerObservable(outerValue).subscribe(innerValue => {
        observer.next(innerValue)
      })
    })
  })
}

Observable.prototype.mySwitchMap = mySwitchMap
```

### The Exhaust Strategy

만약 source observable 에서 나오는 새로운 값을 이전 값 처리가 완료 될때까지 무시하고 싶다면 어떻게 해야할까?? 예를들어, save 버튼을 눌러 backend 에 save request 요청을 보낸다고 해보자. 우리는 concatMap operator 를 사용해서 실행할것이다. 왜냐하면 save operation 이 순차적으로 저장되길 원하기 때문이다.

```javascript
fromEvent(this.saveButton.nativeElement, 'click')
  .pipe(concatMap(() => this.saveCourse(this.form.value)))
  .subscribe()
```

하지만 만약 사용자가 버튼을 여러번 눌렀다고 했을땐 어떤일이 일어날까? 20 번을 눌렀다고 한다면 20 번이 저장이 될것이다.
우리는 이미 save 가 진행중인게 있다면 나머지 클릭들이 무시되길 원한다. 이때 exhaust Observable 전략을 사용할 수있다.

다른것과 마찬가지로 marble diagram 에 가장 상위 라인이 higher-order Observable 을 가지고 있다.
exhaust 는 첫번째로 나오는 inner Observable 을 구독한다.
이때 처음 나오는 inner Observable 은 (a-b-c) 값을 방출하고 그건 그 즉시 output 에 반영된다.
두번째 inner Observable 이 방출될때 (d-e-f) 아직 처음 Observable 이 진행되고 있다. (a-b-c)

이떄 두번째 inner Observable 은 exhaust 전략에 따라 버려짐을 당한다. 그리고 그 두번째 Observable 은 구독하지 않는다.

오직 첫번째 Observable 이 끝났을때, 새로운 Observable 이 구독된다.
세번째 Observable(g-h-i)이 방출됬을때 첫번째는 이미 끝난 상태라 세번째는 버려지지 않고 구독을 시작하게 된다.
여기서 (d-e-f)가 방출되지 않는 두번째와는 다르게 세번째 (g-h-i)는 result Observalbe 의 output 에 보여지게 된다.

## 출처

* [https://www.youtube.com/watch?v=PhggNGsSQyg](https://www.youtube.com/watch?v=PhggNGsSQyg)
* [https://www.youtube.com/watch?v=2f09-veX4HA&t=1714s](https://www.youtube.com/watch?v=2f09-veX4HA&t=1714s)
* [https://oaksong.github.io/2017/12/23/concurrency-and-parallelism/](https://oaksong.github.io/2017/12/23/concurrency-and-parallelism/)
* [https://netbasal.com/understanding-subjects-in-rxjs-55102a190f3](https://netbasal.com/understanding-subjects-in-rxjs-55102a190f3)
* [https://blog.angular-university.io/rxjs-error-handling/](https://blog.angular-university.io/rxjs-error-handling/)
* [https://blog.angular-university.io/rxjs-higher-order-mapping/](https://blog.angular-university.io/rxjs-higher-order-mapping/)
* [https://netbasal.com/javascript-observables-under-the-hood-2423f760584](https://netbasal.com/javascript-observables-under-the-hood-2423f760584)
* [https://netbasal.com/understanding-mergemap-and-switchmap-in-rxjs-13cf9c57c885](https://netbasal.com/understanding-mergemap-and-switchmap-in-rxjs-13cf9c57c885)
