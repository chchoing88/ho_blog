---
title: make promise
date: '2018-07-27T10:00:03.284Z'
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

Promise 인자로는 함수 하나를 받는데 그 함수의 인자로 resolve, reject 를 받겠끔 되어있다.
fn 이라는 함수를 호출할때 resolve 와 reject 구실을 할 수있는 함수를 만들어 넣어줘야 한다.

여기서 참고로 resolve 함수는 Promise 객체를 받을수도 있어야 한다.

이런 기능들을 하는 함수들을 만들어 보자.

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

  // 여기서 result가 올수있는 값은 일반 plain 값이 올수 있고 다른 Promise가 올수있으므로 그 처리를 해두어야 한다.
  // 프로미스는 오직 fulfilled/rejected 중 오직 딱 한번만 귀결이 될수 있다.
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

## 헬퍼함수 작성하기

위에서 본 헬퍼함수는 두종류가 존재한다. `getThen` , `doResolve` 함수이다.
`getThen` 의 경우에는 Promise 객체의 특징은 then 함수가 있는지 없는지 파악하여 있으면 then 함수를 리턴 없으면 null 을 리턴한다. 또한 잘못된 Promise 를 막아줌.
여기서 특히 다시 `doResolve` 를 실행시킬때 `then.bind(result)` 구문을 유의깊게 보자.
then 을 호출하는데 이 then 의 경우에는 this 를 result 로 바꿔준다. 이는 곧 result(Promise 객체)에 들어있는 then 을 호출하겠다는 의미이다.

`doResolve` 는 `Promise` 로 들어온 함수 인자(`fn`)를 실행해서 `resolve` 시키도록 하는 함수이다. 이 `fn` 함수 인자의 파라미터로 `resolve`, `reject` 함수를 받게 되는데 이 함수들은 `doResolve` 함수가 가지고 있는 함수를 제공하는 것이다. done 이라는 변수는 `fulfill` 과 `reject` 를 한번만 호출할수 있도록 도와준다. 또한 `fn` 을 한번 호출한 뒤에는 다시 `resolve` 나 `reject` 를 사용자에서 호출을 해줘야 다음 절차를 이행해 간다.

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
  let done = false // 중복 호출 방지
  try {
    // Promise 인자로 넘어왔던 함수 fn 호출
    fn(
      // Promise 인자로 넘어왔던 함수 fn 인자로 넘겨줄 resolve
      function(value) {
        if (done) return
        done = true
        onFulfilled(value)
      },
      // Promise 인자로 넘어왔던 함수 fn 인자로 넘겨줄 reject
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

Promise 에 들어온 함수 `fn` 인자에서 모든 수행이 끝나면 `resolve`를 실행시키는데 이것은 아래 함수를 실행시킨다.
특히 `onFulfilled` 함수는 Promise 내장 `resolve` 함수를 실행시키는데 이 함수는 일반 plain 한 값 또는 Promise 객체를 받기 위한 분기 처리가 되어있다.

```javascript
function(value) {
  if (done) return
  done = true
  // Promise 내장 resolve 함수.
  onFulfilled(value)
},
```

반대로 `reject`를 실행시키면 아래 함수를 실행시킨다.

```javascript
function(reason) {
  if (done) return
  done = true
  // Promise 내장 reject 함수.
  onRejected(reason)
}
```

실제 Promise 에서도 resolve 함수를 여러번 호출했을 경우를 막아준다. ( 맨 처음에 호출한 resolve 로 귀결시킨다. )

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

"여기까지는 내가 함수를 하나 줄터이니 Promise 내부 상태값과 결과값을 반영 시킬 함수를 인자로 넣어서 실행 시켜라" 같은 느낌이다.

그러면 유저가 Promise에 넘길 함수 내용에 비동기 작업을 하고 Promise가 상태값과 결과값을 반영할 함수를 넣어줄거라 믿고 비동기 결과에 따라 적절한 메서드를 결과값과 함께 호출한다.

## Promise 실행

아랫쪽에 다시 `doResolve`를 사용함으로써 잘못 행동하는 `fn` 을 막아준다. 여기서 `fn` 은 `resolve`, `reject` 심지어 에러도 던질수 있기에 `resolved` 와 `rejected` 를 한번만 호출 될수 있도록 보장하고 또한 내부변수인 `state` 를 바뀌는걸 막아준다.

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
  // 여기서 result가 올수있는 값은 일반 plain 값이 올수 있고 다시 Promise가 올수있으므로 그 처리를 해두어야 한다.
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

`done` 이라는 함수는 `resolver` 끝나고 실행되어야 할 함수를 등록하는 함수이다.
`then` 이라는 함수를 작성하기 전에 `done` 이라는 함수를 작성해보자.
`done` 메서드는 간단하면서도 `then` 메서드가 어떻게 실행이 되는지 생각해볼 수 있게 한다.
`done` 메서드는 `promise` 가 끝나고 나서 해당의 행동을 정의하는 함수이다.

```javascript
promise.done(onFulfilled, onRejected) // 이렇게 실행이 되도록 할 것이다.
```

`done` 함수의 몇가지 목표가 있다.

- `done` 함수의 인자의 `onFulfilled` 와 `onRejected` 는 둘 중 하나만 호출이 된다.
- 호출될 함수(`onFulfilled`, `onRejected`)는 한번만 호출이 된다.
- 호출될 함수(`onFulfilled`, `onRejected`)는 `done` 메서드가 return 되기 전까지 호출되지 않는다.
- `promise` 안에 `resolve` 함수(어떠한 결과에 도달함)는 `done` 호출 전에 되었는지 후에 되었는지 상관없이 호출되어진다.

실제로 javascript `promise` 에는 `done` 이라는게 없고 `jqeury` 의 `Deferred` 에는 존재하긴 하다. 어떻게 움직이는지 보자.

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
  // Promise가 올 경우에는 then 함수에서 return 값으로 Promise를 넘길때이다.
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
    // handler 객체
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
    // 즉, 여기 있는 함수가 다 호출한 뒤에 호출을 할 목적을 가진 setTimeout 함수.
    // setTimeout으로 감싼 함수는 webapis timer에 의해 관리되고
    // 그이후에 나머지 코드를 스택에 쌓고 먼저 실행된다. 그 사이 타이머가 완료가 되고
    // task queue에 콜백을 집어넣구 event loop는 스택이 비워져있으면 task queue에서 하나하나 꺼내어
    // 실행시킨다.
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

앞서 `Promise` 에 넘겨준 `fn` 이 모든 작업이 끝나면 `Promise`의 상태 값을 변경 하게 되고 변경된 상태 값에 따라서 `done`에 등록해둔 함수 (`onFulfilled`, `onRejected`) 를 호출 하게 된다.

## done 함수의 분석

눈 여겨 볼 부분은 `handlers` 와 `done` 함수 그리고 `fulfill` , `reject` 에 있는 `forEach` 메서드 , `handle` 함수이다.

만약 아래처럼 호출했다고 가정하자.

```javascript
new Promise((resolve, reject) => {
  setTimeout(function() {
    resolve(10)
  }, 2000)
}).done(value => console.log(value))
```

처음 Promise 인자로 받은 `fn` 은 `doResolve` 함수에 인자로 들어가서 호출당하게 된다. 이때 `fn` 에는 비동기인 `setTimeout` 함수가 호출되게 되고 이 안에 있는 `resolve(10)` 를 감싼 익명함수는 2 초 후에 task queue 에 쌓이게 된다.

> 여기서 task queue 는 스택에 있는 실행문이 다 실행이 되고나서 실행된다. 그래서 정확히 2 초 후에 실행 된다는 보장이 없다.

그리고 나서 done 함수를 호출하게 되면 여기서 done 호출도 비동기 함수인 setTimeout 함수가 실행이 되고 이는 0 초 후에 task queue 에 쌓이게 되어 타이머 차이로 위 `function(){ resolve(10) }` 보다 먼저 큐에 쌓이게 된다. 따라서 done 이 실행이 먼저 된다. handle 함수에서 status 를 파악하는데 `resolve()`가 실행하지 않은 상태이니 상태 값은 `pending` 이다. 따라서 `handlers=[]` 에 `handler 객체`를 push 하게 된다.

그 이후에 `resolve(10)` 이 실행되면 `handlers`를 순회하면서 `handle 함수`를 실행한다.
상태값이 `FULLFILLED` 가 되면서 `handler.onFuilfilled`를 결과값을 넣어서 실행 하게 된다.

여기서는 `Promise` 의 `resolve` 함수가 `done` 함수 호출 이후에 호출이 되었다. `resolve` 함수가 아직 호출이 안되었기 때문에 상태는 `PENDING` 상태일 것이고 이때는 작업이 귀결(resolve)이 되고나서 실행되어야 할 `resolve`, `reject` 함수를 품은 객체를 `handlers` 라는 배열에 잠시 넣어두고 나중에 적절한 함수를 호출하도록 한다.

만약 `resolve` 가 먼저 실행이 되었다면 `status` 가 `resolve` 된 귀결 상태(fulfill 이 되든 reject 가 되든)에 따라서 바로 `done` 에 넘겼던 함수를 호출하게 된다.

## 여기까지의 요약

여기까지의 promise 는 메인 객체 안에 넘겼던 함수가 최종적으로 결론이 났는지 (resolved 가 되었는지) 확인하는 상태값을 가지고 done 에 등록해둔 함수를 호출할지 말지를 결정한다.

Promise 에서 인자로 받는 fn 에는 resolve, reject 2 개의 인자가 넘어가는데 이 resolve, reject 의 경우에는 Promise 안에 있는 내장된 함수들이고 이 함수들을 인자로 넣어서 fn 을 실행하게 된다.

원하는 작업이 완료 되었을때 resolve (or reject) 에 해당 작업의 결과값을 넣어 호출하는 것은 이전에 Promise 안에 있는 내장함수들을 수행 시키고 그 작업 이 완료 된 done 메서드의 인자로 받은 다음에 실행시켜야 하는 함수를 실행 시키는 것이다.

## then 메서드 작성

`then` 메서드의 경우에는 `done` 과 비슷하지만 `Promise` 를 반환하면서 체이닝을 구성 할 수 있어야 한다.

```javascript
new Promise(function(resolve, reject) {
  // 비동기 처리 예제
  setTimeout(function() {
    resolve(1)
  }, 2000)
})
  .then(result => {
    // then은 새로운 Promise를 반환합니다.
    console.log(result) // 1
    return result + 10 // 여기서 return 값은 then이 반환하는 promise 객체의 resolved 된 값이다.
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

    // self(기존 Promise) 의 귀결이 끝나고 실행해야 하는걸 보장하기 위해 => self.done() 메서드 호출
    // self.done() 메서드로 self Promise가 끝나고 실행해야 하는 함수 등록.
    // 등록된 함수에서는 then 에서 등록해 뒀던 onFulfiled 호출 => resolve(onFulfilled(result))
    // onFulfiled 함수가 결과 값이 나왔을때 새로운 Promise의 then에 등록해 뒀던 함수 다시 호출 => resolve(onFulfilled(result))

    return new Promise((resolve, reject) => {
      // 체이닝을 하기 위해서 promise를 리턴하자.
      return self.done(
        // 여기서 done 함수는 앞서 등록했던 promise가 resolve(귀결) 되었을시
        // 그 status에 따라 호출될 함수들을 등록시킨다.
        // 이 함수는 self promise가 resolve 했을 시 그 결과를 result에 넘겨주고
        // 그 결과를 다시 then에서 넘어온 onFulfiled 함수의 인자로 넘긴다.
        function(result) {
          if (typeof onFulfilled === 'function') {
            try {
              // 리턴되는 값(then에서 인자로 줬던 함수가 실행되고 난 return 값: onFulfilled(result))을
              // 다시 새로운 resolve에 넘겨주어야 그 다음 then에게 전달.
              // 특히 이 onFulfilled(result) 의 리턴값이 Promise 객체라면
              // 위 new Promise에서 해야할 resolve와 reject 함수를 onFulfilled(result) 의 리턴값인 Promise 객체가
              // resolve 또는 reject 됬을시 실행하도록 만든다.
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

## then 함수 파헤치기

앞서 `done` 함수의 경우 연속된 체이닝을 갖지 못하는 단점을 지니고 있었다.
`then` 함수의 경우에는 연속된 `then` 호출을 할수있도록 체이닝을 지니고 있으면서 `then` 에 등록된 함수에서 `return` 값이 자동으로 그 다음 호출되는 `then` 핸들러의 인자값으로 전달 될수 있도록 모양새를 갖추고있다.

위에서 `then` 은 연속된 `then` 호출을 위해 `promise` 로 감싸서 리턴을 하고있다.
`then` 함수에서 하는 일은 앞의 `promise` 가 `resolve` 또는 `reject` 시 그 결과를 받아 호출될 함수들을 등록할 `done` 함수를 호출 하는 일이다.

이 작업 또한 `new Promise()`로 감싸서 새로운 `Promise`(약속)으로 만들어 준다.

`done` 함수에 앞서 `Promise` 가 귀결되면 호출될 함수를 등록하고 그 함수로 앞선 `Promise` 의 결과를 받게 되면 `then` 메서드에서 인자로 받았던 함수의 인자로 넘기게 되고 그 결과 값을 새로운 `Promise` 의 `resolve`에 인자로 귀결 값을 넘기게 된다.

결국 맨 앞의 `Promise` 의 결과를 `then` 에 등록한 함수가 받는다. (이때 then 은 새로운 `Promise` 를 생성 및 리턴한다.)
그 등록한 함수의 리턴 값은 새로운 `Promise` 의 `resolve()` 에 인자로 넘겨서 또 다시 `then` 에 등록한 함수가 받게끔 한다.

기본적으로 `then` 에 등록한 함수에서 리턴된 값은 즉시 다음 `then` 에 등록된 함수로 전달이 된다. 만약 리턴된 값이 `promise` 라면 그 값이 귀결(resolve 또는 reject)될 때까지 기다린 후 귀결이 되면 `then` 에서 만들어뒀던 `Promise` 의 `resolve` 또는 `reject` 함수를 실행시켜 다음 `then` 호출로 이어지게 한다.

```javascript
new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000)
  // 여기서 resolve는 내부적인 resolve 함수를 호출,
  // 그 이후에 fulfilled 과 value 1 셋팅 그 이후에 등록해뒀던 핸들러 함수 실행 ( 아래 then으로 등록해둔 함수 )
  // 사실 then 함수는 바로 등록하기 보다는 해당 함수를 실행할수 있는 함수를 등록함.
})
  .then(function(result) {
    alert(result) // 1

    return new Promise((resolve, reject) => {
      // (*)
      setTimeout(() => resolve(result * 2), 1000)
    })
  })
  .then(function(result) {
    // (**)

    alert(result) // 2

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(result * 2), 1000)
    })
  })
  .then(function(result) {
    alert(result) // 4
  })
```

## Promise 함수 전체 이해

- `Promise` 란 어떠한 작업을 수행한 뒤 그 작업에 대해 성공을 했는지 아니면 실패를 했는지 결과를 객체(promise 인스턴스)로서 나에게 알려주는 녀석이다. 그 약속의 객체에 메서드를 실행하면서 기존의 비동기 콜백 헬에서 비동기 선형으로 읽기 좋은 코드를 만들기 위한 노력이다.

- 콜백이란 어떠한 작업이 모두 끝났을때 수행하도록 만든 함수이다. 이런 콜백함수는 일종의 약속인 셈이다. 상상해보자. 직접적으로 비동기 작업을 할때 약속을 주입시키는 방법은 콜백 헬을 만들 가능성이 아주 높다. 하지만 `Promise` 라는것으로 한번 감싸 준다면 비동기 작업을 수행하긴 하지만 그 결과를 소비하는 주체 즉, 약속의 행동이 나타나기 전까지는 그 결과 값을 바로 내뱉지 않는다. (`then` 이라는 함수 호출을 통해 그 결과 값을 받아올수 있다.) 그러므로 바로 사용될수 없다. 이런 해당 결과값은 리턴된 객체 안에 보관 시켜둔다. 그래서 약속을 계속 주입하기 보단 순차적인 약속을 만들어 콜백 헬을 막을 수 있다.

- then 이라는 체이닝을 제외하고 `Promise` 의 대략적인 구현 방식은 인자로 받은 첫번째 함수가 결과값을 내고 그 다음 실행하고 싶은 함수 즉, 약속하고 싶은 코드(함수)를 done 함수를 통해서 등록한다. 비동기가 끝난 뒤 resolve 를 실행 하게 되면 등록 되었던 함수가 동작하게 된다. 이것은 `resolve` 라는 함수는 해당 `Promise` 에서 인자로 받았던 함수가 모든 수행을 다 했다는걸 알리기 위한 함수이고 내부적으로 등록해뒀던 `handlers` 들을 `forEach` 하면서 실행하게 된다.

- 체이닝의 경우 처음 동기화 부분이 다 진행된 뒤에 ( 비동기는 나중에 실행될 부분이므로 ) `then` 함수가 진행이 된다. `then` 함수는 기본적으로 `Promise` 를 리턴하므로 체이닝으로 `then` 함수를 또 불러올수 있고 `Promise` 인자인 함수를 바로 호출하게 된다.<br />
  여기서 `done` 함수를 이용해서 처음에 `Promise` 로 넘겼던 함수(fn) 비동기 완료 후 (`resolve` 후) 불러올 `handler` 를 등록을 해둔다. 그 이후로도 마지막 `then` 까지 실행이 되며 (사실 이 중간에 각 `Promise` 에 `resolve` 가 호출 되었을수도 아닐수도 있다.) 이 `then` 메서드들은 각기 다른 `Promise` 객체(다른 `context` 를 지님, `then` 호출시 `new Promise`를 하기 때문)의 핸들러(`Promise` 안에 `handler` 배열 )에 `fulfill` 과 `reject` 함수를 등록시킨다. <br />
  이후 비동기 값이 귀결값이 정해지면 `done` 에서 등록해두었던 `handler` 함수가 실행 될것이고 `hendler` 안에는 `then` 에서 등록해두었던 `onFulfilled` 함수를 실행한다. 여기서 나온 리턴값을 가지고 다시 `resolve` 를 시켜주게 되면 계속적으로 등록해두었던 함수를 호출하게 된다.
  <br />
  즉, `then` 함수는 새로운 약속만드는 함수이다. `then` 에 인자로 넘긴 함수(`onFulfilled`, `onRejected`)에서의 일련의 작업들이 완료되는 경우(`resolved`: 귀결), 그 다음 체이닝 `then` 으로 등록했던 함수에 인자로 그 결과를 다시 또 알려주겠다는 약속인 셈이다.
  여기서 특히 인자로 넘기는 함수 안에서 다시 `Promise` 객체를 리턴하는 로직을 만난다면 그 `promise` 가 `resolve` 되었을때 수행하는 작업(여기선 또다른 `then` 일 것이다. `then` 을 호출해야 결과 값을 가져올 수 있기 때문이다.) `then` 을 자동으로 등록 해주어 그 결과 값이 `then` 의 `promise` 로 전달 될 수 있도록 한다.

- `Promise` 의 인자 함수에 비동기 코드가 아닌 일반 코드가 들어갔을 경우 (ex. `resolve(1)`만 들어가있을 경우 ) 여기서 동기적인 `resolve(1)` 호출은 `Promise` 의 `resolve` 함수는 상태값과 귀결값(1) 만 셋팅해주고 나머지 done 이나 then 에서 등록된 함수를 내 상태(`Promise` 에 등록해두었던 함수, 즉 `Promise` 의 인자로 넘겼던 함수)가 귀결되었으므로 그 결과를 등록함수 인자로 넘겨서 실행시킨다.

- then 체이닝에서 첫번째 `then` 에 등록한 함수가 리턴 값이 `Promise` 값이라면 (`return new Promise()`)
  then 에서 리턴할 `Promise` 의 resolve 함수에서 `Promise` 객체를 인자로 받고 `resolve(Promise객체)` 그 객체(`Promise`)가 다시 `resolve` 될때까지 지연시킨다. (결과에 `then` 함수가 있다면 그 `Promise` 결과 객체(`{status:'', value:''...}`)에 있는 then 을 수행하게 된다. `then` 을 수행할때 바로 앞서 실행하고 있는 `resolve` 를 등록해줌으로써 `Promise` 결과 객체의 `value` 값을 추출해 올수 있다. )

- resolve 함수에서 `getThen` 함수는 `result` 값이 `Promise` 객체일 경우 처리해주는 함수이다.

- `doResolve` 해당 헬퍼 함수는 `Promise` 에 등록되는 `fn` 을 실행시켜줄 뿐 아니라 `resolve` 또는 `reject` 를 한번만 실행시킬수 있도록 `done` 이라는 변수로 보장해주는 함수이다. 여기서 `resolve` 는 `Promise` 안의 내장되어있는 `resolve` 함수로 일반 값 또는 또다른 `Promise` 의 리턴 값을 받을 수 있도록 분기 처리 해주는 함수이다.

## then 에서 Promise 를 리턴했을 경우를 알아보자.

```javascript
new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000)
})
  .then(function(result) {
    alert(result) // 1

    return new Promise((resolve, reject) => {
      // (*)
      setTimeout(() => resolve(result * 2), 1000)
    })
  })
  .then(function(result) {
    // (**)
    alert(result) // 2
  })
```

처음 `Promise` 의 인자로 넣은 함수를 호출한뒤 then 함수들이(동기) 차례로 호출이 되면서 `Promise` 가 resolve 되었을때 호출될 콜백 함수들을 등록시킨다.

1 초 뒤에 `resolve(1)` 이 호출되면 `Promise` 내부적으로 `status` 와 `value` 값을 업데이트 하고 그 다음 `then` 에서 등록해두었던 콜백을 실행한다.
`then` 으로 등록 시킬경우 아래 해당 함수가 `handler.onFulfilled` 로 등록이 된다.

```javascript
// then 함수안에 self.done함수에서 fulfilled 될때 실행할 함수를 등록
function (result) {
      if (typeof onFulfilled === 'function') {
        try {
          return resolve(onFulfilled(result)); // 여기 onFulfilled는 then에서 등록했던 함수.
        } catch (ex) {
          return reject(ex);
        }
      } else {
        return resolve(result);
      }
    }
```

`resolve(1)` 이 실행 되면서 등록되었던 위 함수가 실행이 되고 `onFulfilled(result)`이 실행되면서 `then` 에서 등록했던 함수가 실행이 된다. 그러면서 `alert(1)`이 실행이 되고, `return new Promise()` 가 실행이 되는데 여기서는 `Promise` 의 인자 함수를 실행하고 `{PENDING, null}` 이런식으로 리턴한다.

여기서 `resolve` 는 `doResolve` 함수에 있는 아래와 같다.

```javascript
function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }
```

`onFulfilled(value)`를 실행하면서 `value` 에는 `promise` 객체가 들어간다.
여기서 `onFulfilled(value)`를 실행시키면 아래 함수가 호출되게 되고, (onFulfilled 함수가 실행 되었다는 것은 `Promise` 가 받았던 함수가 실행이 완료(귀결성공)이 되었다는 것을 뜻한다.)

```javascript
function resolve(result) {
  try {
    var then = getThen(result)
    if (then) {
      // result가 promise 객체이므로 result에 해당하는 then을 호출하자.
      // then은 result의 done을 호출하면서 result결과에 따른 resolve, reject 함수를 등록한다.
      doResolve(then.bind(result), resolve, reject)
      return // 리턴
    }
    fulfill(result)
  } catch (e) {
    reject(e)
  }
}

function doResolve(fn, onFulfilled, onRejected) {
  let done = false // 중복 호출 방지
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

위 함수에서 result 가 `new Promise`의 리턴 값이므로 `fulfill(result)`를 호출하지 않고 (`then` 의 첫번째 인자로 들어왔던 함수가 다 끝났다고 보지 않고) 다시 `doResolve()` 를 실행하게 된다. 여기서 첫 인자로는 result 로 들어왔던 `Promise` 객체의 `then` 함수를 호출한다. 여기서 `then` 을 호출하는 이유!! 리턴 값이 Promise 객체 라는 것은 `then` 함수로 소비를 해줘야 그 값을 알 수 있는데 여기에선 단지 `return new Promise()` (`then` 함수에 등록한 함수에서) 로 그치기만 했다. 해서 내부에서 해당 결과의 `then` 함수를 아까 제대로 수행하지 못한 `resolve` 함수와 함께 실행해주게 된다. 그렇게 되었을때 `result` 값이 `resovle` 되었을때 연속해서 `then` 체이닝을 이끌어 갈 수 있다.

바로 자신(`then` 으로 등록한 함수)의 `fulfill` 된 사실을 미뤄두고 결과로 들어온 `promise` 의 객체의 then 함수를 실행시켜서 자신의 `resolve` 함수를 다시 등록해둔다. 즉, 내부의 `promise` 부터 처리하고 처리가 완료되면 내 결과를 처리 하는 것이다.

여기서 2 초 뒤에 `resolve(result * 2)` 이게 호출이 된다면 결과값으로 들어왔던 `Promise` 가 `resolve` 되고 아까 `doResolve(then.bind(result), resolve, reject)` 등록해뒀던 `resolve` 가 실행된다.
아래 함수는 `then` 함수 내부 실행될 함수이고

```javascript
function (result) {
      if (typeof onFulfilled === 'function') {
        try {
          return resolve(onFulfilled(result));
        } catch (ex) {
          return reject(ex);
        }
      } else {
        return resolve(result);
      }
    }
```

위 함수에서 onFulfilled 는 `doResolve` 에서 등록한 아래 함수이고 아래 함수에서 onFulfilled 함수가 `doResolve(then.bind(result), resolve, reject)` 에서 두번째 인자인 기존 promise 를 지연해왔던 resolve 함수가 되겠다.

```javascript
function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }
```

그럼 결국엔 2 로 귀결 된 값이 호출이 되고 처음에 지연시켜놨던 `resolve` 가 다시 실행되고 이번엔 값이기 때문에 `fulfill(result);` 가 실행되서 `fulfill` 함수에 등록되었던 등록된 `handlers` 가 마저 실행된다.

## 결론

- 고차함수의 특성(함수를 인자로 받을수 있고 리턴 할 수 있다.)을 이용해서 `Promise` 를 구현하고 있다.
- `then` 으로 등록하는 함수 안에서 또다른 비동기를 구현한다면 `Promise` 로 감싸 주어야 한다. 그래야 비동기 결과를 가지고 그 다음 `then` 으로 등록된 함수에 인자로 넣어줄 수 있다.
- `then` 을 수행시 마다 새로운 스코프 환경이 생긴다. `then` 을 수행한다는 것은 자신의 스코프에 등록되어 있는 함수를 수행 완료 즉, 결과값을 받아내고 나서 다음으로 그 결과 값을 가지고 호출되어야 하는 함수를 등록해줄 뿐만 아니라, 그 등록된 함수가 수행이 완료되고 또 다른 결과를 가지고 또 다른 함수 호출을 보장하기 `then` 의 실행 구문(후속 처리를 해야하는 함수를 등록하는 `done` 함수)을 `Promise` 로 감싸주고 리턴해준다. 그렇게 되면 두번째 `then` 함수에 등록되었던 함수가 해당 결과 값을 가지고 실행할 수 있다.

아주 간단하게 말해서는 A 라는 함수는 A 라는 함수 동작 이후에 호출될 B 라는 함수를 호출 할 수 있는 함수(일종의 호출버튼)를 매개변수로 받을 거라는 Promise 객체의 약속을 받고 유저는 A 함수를 작성 하고 Promise에 넘기게 된다.

이때, A 라는 함수 동작 이후에 B 라는 함수를 호출하게 만들어 주기 위해서 제 3자인 Promise 객체가 A 라는 함수와 B 라는 함수를 가지면서 A 라는 함수가 약속의 함수를 적절할때 호출(위에서 말했던 호출버튼)해주면 Promise는 가지고 있던 B 라는 함수를 호출해 준다.

다시 B 라는 함수가 끝났을 때 다시 C 라는 함수를 호출 할 수 있게 하기 위해서는

위에서 언급했던 B 라는 함수를 호출할 수 있는 함수를 다시 새로운 C 함수를 호출 할 수 있는 함수를 가진 Promise 에 등록을 해서 B가 호출이 되서 리턴이 되면 C 라는 함수를 호출 할 수 있는 함수를 호출하게끔 만든다. `C호출버튼(B())`

즉, A가 호출이 되고 -> B 라는 함수를 호출할 수 있는 함수를 호출 -> B 호출 후 리턴 -> B 리턴 값 받아서(리턴 및 귀결될때까지) -> C 라는 함수를 호출할 수 있는 함수를 호출 -> C 호출 순서가 된다.

이때, B가 비동기 호출을 지닌 함수라면 기다렸다가 B가 귀결되어서 리턴되면 C 라는 함수를 호출할 수 있는 함수가 그때 호출된다.

## 출처

[https://www.promisejs.org/implementing/](https://www.promisejs.org/implementing/)
