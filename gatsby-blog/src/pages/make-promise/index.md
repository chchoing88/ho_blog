---
title: make promise
date: "2018-07-27T10:00:03.284Z"
---

# javascript promise 를 만들어보자.

## 동기

javascript 비동기를 다루는데 쓰이는 Promise 라는 객체가 있다. Promise 를 다루는 방법은 많지만 실제로이 객체가 어떤 방식으로 움직이는지 그 구조를 파악하면서 Promise 를 좀더 자유자재로 다뤄보자.

## 틀 만들기

promise 를 실행해서 리턴을 해보면 [[PromiseStatus]] 와 [[PromiseValue]] 이렇게 값이 나오는걸 확인할 수 있다.
이걸 바탕으로 실제 promise 는 아니지만 비슷하게 만들어 보자.

```javascript
const PENDIGN = 0
const FULFILLED = 1
const REJECTED = 2

function Promise(fn) {
  let status = PENDING // Promise의 상태값
  let value = null // 최종 결과값이 저장될 장소.

  return {
    PromiseStatus: status,
    PromiseValue: value,
  }
}
```

## Promise 기능함수 만들기

promise 개념을 보다보면 resolve, fulfill, reject 라는 용어를 볼 수가 있다.
resolve 라는 개념은 어떠한 결과값으로 귀결되었다인데 이는 성공했을수도 있고 실패했을수도 있다는 뜻이다. 즉, 어떤 결과든 결론을 지었다라고 생각하면 된다.
fulfill 은 귀결된 결과값이 성공했다는 뜻이고 반대로 reject 는 실패했다는 뜻이다.
이런 기능들을 하는 기능들을 만들어 보자.

```javascript
const PENDIGN = 0
const FULFILLED = 1
const REJECTED = 2

function Promise(fn) {
  let status = PENDING // Promise의 상태값
  let value = null // 최종 결과값이 저장될 장소.

  // 이부분부터..
  function fulfill(result) {
    status = FULFILLED // 상태값을 바꿔줌.
    value = result // 결과값을 value 값에 넣어줌.
  }

  function reject(error) {
    status = REJECTED // 상태값을 바꿔줌.
    value = error // 실패한 에러를 value 값으로 넣어줌.
  }

  // 이 resolve 는 fulfill 또는 reject로 보낼수 있어야 한다.
  // 여기서 value가 올수있는 값은 일반 plain 값이 올수 있고 다시 Promise가 올수있으므로 그 처리를 해두어야 한다.
  function resolve(result) {
    try {
      let then = getThen(result) // 여기 then 함수가 있으면 Promise로 왔다고 간주. (getThen 은 헬퍼함수)
      if (then) {
        doResolve(then.bind(result), resolve, reject) // ( doResolve는 헬퍼함수 )
        return
      }
      fulfill(result) // 일반 값으로 왔을 경우 이행.
    } catch (e) {
      reject(e)
    }
  }

  return {
    PromiseStatus: status,
    PromiseValue: value,
  }
}
```

## 헬퍼함수 작성하기

위에서 본 헬퍼함수는 두종류가 존재한다. `getThen` , `doResolve` 함수이다.
`getThen` 의 경우에는 Promise 객체의 특징은 then 함수가 있는지 없는지 파악하여 있으면 then 함수를 리턴 없으면 null 을 리턴한다.
`doResolve` 의 함수의 경우에는 fulfill 과 reject 를 한번만 호출할수 있도록 도와주고 잠재적인 fn(resolver)의 잘못된 행동을 막아준다.

resolver 에서 resolve 함수를 여러번 호출했을 경우를 막아준다. ( 맨 처음에 호출한 resolve 로 귀결시킨다. )

```javascript
new Promise(function(resolve, reject) {
  // 비동기 처리 예제
  setTimeout(function() {
    resolve(1)
    resolve(2) // 이아이는 실행되지 않는다.
  }, 2000)
}).then(result => {
  console.log(result) // 1
  return result + 10
})
```

이제 이 두가지 함수에 대해서 작성해보자.

```javascript
function getThen(result) {
  let t = typeof result
  if (t && (t === 'object' || t === 'function')) {
    let then = t.then
    if (typeof then === 'function') {
      return then
    }
  }

  return null
}

function doResolve(fn, onFulfilled, onRejected) {
  let done = false
  try {
    fn(
      function(value) {
        if (done) return
        done = true
        onFulfilled(value)
      },
      function(reason) {
        if (done) return
        done = true
        onRejected(reason)
      }
    )
  } catch (e) {
    if (done) return
    done = true
    onRejected(e)
  }
}
```

## Promise 실행

아랫쪽에 다시 `doResolve`를 사용함으로써 잘못 행동하는 fn 을 막아준다. 여기서 fn 은 resolve, reject 심지어 에러도 던질수 있기에 resolved 와 rejected 를 한번만 호출 될수 있도록 보장하고또한 내부변수인 state 를 바뀌는걸 막아준다.

```javascript
const PENDIGN = 0
const FULFILLED = 1
const REJECTED = 2

function Promise(fn) {
  let status = PENDING // Promise의 상태값
  let value = null // 최종 결과값이 저장될 장소.

  // 이부분부터..
  function fulfill(result) {
    status = FULFILLED // 상태값을 바꿔줌.
    value = result // 결과값을 value 값에 넣어줌.
  }

  function reject(error) {
    status = REJECTED // 상태값을 바꿔줌.
    value = error // 실패한 에러를 value 값으로 넣어줌.
  }

  // 이 resolve 는 fulfill 또는 reject로 보낼수 있어야 한다.
  // 여기서 value가 올수있는 값은 일반 plain 값이 올수 있고 다시 Promise가 올수있으므로 그 처리를 해두어야 한다.
  function resolve(result) {
    try {
      let then = getThen(result) // 여기 then 함수가 있으면 Promise로 왔다고 간주. (getThen 은 헬퍼함수)
      if (then) {
        doResolve(then.bind(result), resolve, reject) // ( doResolve는 헬퍼함수 )
        return
      }
      fulfill(result) // 일반 값으로 왔을 경우 이행.
    } catch (e) {
      reject(e)
    }
  }

  // 실행
  doResolve(fn, resolve, reject)

  return {
    PromiseStatus: status,
    PromiseValue: value,
  }
}
```

## done 메서드 작성

done 이라는 함수는 resolver 끝나고 실행되어야 할 함수를 등록하는 함수이다.
then 이라는 함수를 작성하기 전에 done 이라는 함수를 작성해보자. done 메서느는 간단하면서도 then 메서드가 어떻게 실행이 되는지 생각해볼수 있게 한다.
done 메서드는 promise 가 끝나고 나서 해당의 행동을 정의하는 함수이다.

```javascript
promise.done(onFulfilled, onRejected) // 이렇게 실행이 되도록 할 것이다.
```

done 함수의 몇가지 목표가 있다.

* done 함수의 인자의 onFulfilled 와 onRejected 는 둘중 하나만 호출이 된다.
* 호출될 함수는 한번만 호출이 된다.
* 호출될 함수는 done 메서드가 return 되기 전까지 호출되지 않는다.
* promise resolved 가 done 호출 전에 되었는지 후에 되었는지 상관없이 호출되어진다.

실제로 javascript promise 에는 done 이라는게 없고 jqeury 의 Deferred 에 존재하긴 하다. 어떻게 움직이는지 보자.

```javascript
const PENDIGN = 0
const FULFILLED = 1
const REJECTED = 2

function Promise(fn) {
  let status = PENDING // Promise의 상태값
  let value = null // 최종 결과값이 저장될 장소.

  var handlers = [] // 성공과 실패 이후에 실행되어야 할 handler를 저장하는 공간.

  // 이부분부터..
  function fulfill(result) {
    status = FULFILLED // 상태값을 바꿔줌.
    value = result // 결과값을 value 값에 넣어줌.

    handlers.forEach(handle) // 이행이 되고 난 다음에 후속 함수들을 실행한다.
    handlers = []
  }

  function reject(error) {
    status = REJECTED // 상태값을 바꿔줌.
    value = error // 실패한 에러를 value 값으로 넣어줌.

    handlers.forEach(handle)
    handlers = []
  }

  // 이 resolve 는 fulfill 또는 reject로 보낼수 있어야 한다.
  // 여기서 value가 올수있는 값은 일반 plain 값이 올수 있고 다시 Promise가 올수있으므로 그 처리를 해두어야 한다.
  function resolve(result) {
    try {
      let then = getThen(result) // 여기 then 함수가 있으면 Promise로 왔다고 간주. (getThen 은 헬퍼함수)
      if (then) {
        doResolve(then.bind(result), resolve, reject) // ( doResolve는 헬퍼함수 )
        return
      }
      fulfill(result) // 일반 값으로 왔을 경우 이행.
    } catch (e) {
      reject(e)
    }
  }

  function handle(handler) {
    if (status === PENDING) {
      handlers.push(handler)
    } else {
      if (status === FULFILLED && typeof handler.onFulfilled === 'function') {
        handler.onFulfilled(value)
      }
      if (status === REJECTED && typeof handler.onRejected === 'function') {
        handler.onRejected(value)
      }
    }
  }

  const done = function(onFulfilled, onRejected) {
    // done 호출 되기 전에 남아있는 함수들을 다 호출하고 호출하기 위해
    // 즉, 비동기를 보장하기 위한 setTimeout 함수.
    // setTimeout으로 감싸면 스택에 쌓인것부터 무조건 우선순위를 갖는다. 호출 순서에 상관없이
    setTimeout(function() {
      handle({
        onFulfilled: onFulfilled,
        onRejected: onRejected,
      })
    }, 0)
  }

  // 실행
  doResolve(fn, resolve, reject)

  return {
    PromiseStatus: status,
    PromiseValue: value,
    done,
  }
}
```

## done 함수의 분석

눈 여겨 볼 부분은 handlers 와 done 함수 그리고 fulfill , reject 에 있는 forEach 함수 , handle 함수이다.
만약 아래처럼 호출했다고 가정하자.

```javascript
new Promise((resolve, reject) => {
  setTimeout(function() {
    resolve(10)
  }, 2000)
}).done(value => console.log(value))
```

처음 Promise 인자로 받은 fn 은 `doResolve` 함수에 인자로 들어가서 호출당하게 된다. 이때 fn 에는 비동기인 setTimeout 함수가 호출되게 되고 이 안에 있는 `resolve(10)` 부분은 2 초 후에 큐에 쌓이게 된다.
(여기서 큐는 스택에 있는 실행문이 다 실행이 되고나서 실행된다.) 그리고 나서 done 함수를 호출하게 되는데 여기서 done 호출도 비동기 함수인 setTimeout 함수가 실행이 되고 이는 0 초 후에 큐에 쌓이게 되어 먼저 큐에 쌓이게 된다. 따라서 done 이 실행이 먼저 되고 handle 함수에서 아직 pending 인 상태니 handlers 에 handle 객체를 push 하게 된다.

그 이후에 `resolve(10)` 이 실행되면 resolve -> fulfill 함수를 거쳐 아까 push 해두었던 handler 를 실행하고 최종적으로는 `handler.onFulfilled(value)` 를 실행하게 된다.

## then 메서드 작성

then 메서드의 경우에는 done 과 비슷하지만 Promise 를 반환하면서 체이닝을 구성할 수 있다.

```javascript
new Promise(function(resolve, reject) {
  // 비동기 처리 예제
  setTimeout(function() {
    resolve(1)
  }, 2000)
})
  .then(result => {
    console.log(result) // 1
    return result + 10
  })
  .then(result => {
    console.log(result) // 11
    return result + 10
  })
```

위 처럼 실행이 되도록 할것이다.

```javascript
function Promise(fn) {
  //... 윗부분 생략

  const done = function(onFulfilled, onRejected) {
    // done 호출 되기 전에 남아있는 함수들을 다 호출하고 호출하기 위해
    // 즉, 비동기를 보장하기 위한 setTimeout 함수.
    // setTimeout으로 감싸면 스택에 쌓인것부터 무조건 우선순위를 갖는다. 호출 순서에 상관없이
    setTimeout(function() {
      handle({
        onFulfilled: onFulfilled,
        onRejected: onRejected,
      })
    }, 0)
  }

  const then = function(onFulfilled, onRejected) {
    // 이 then은 체이닝 될때 resolve 함수에서 then을 bind해서 넘긴다.
    let self = this

    return new Promise((resolve, reject) => {
      // 체이닝을 하기 위해서 promise를 리턴하자.
      return self.done(
        // done 함수 호출하면
        function(result) {
          if (typeof onFulfilled === 'function') {
            try {
              resolve(onFulfilled(result))
            } catch (e) {
              reject(e)
            }
          } else {
            reject(onReject(result))
          }
        },
        function(error) {
          if (typeof onRejected === 'function') {
            try {
              return resolve(onRejected(error))
            } catch (ex) {
              return reject(ex)
            }
          } else {
            return reject(error)
          }
        }
      )
    })
  }

  // 실행
  doResolve(fn, resolve, reject)

  return {
    PromiseStatus: status,
    PromiseValue: value,
    done,
    then,
  }
}
```

## 출처

[https://www.promisejs.org/implementing/](https://www.promisejs.org/implementing/)
