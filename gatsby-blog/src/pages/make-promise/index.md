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

Promise 인자로는 함수 하나를 받는데 그 함수의 인자로 resolve, reject를 받겠끔 되어있다.
fn 이라는 함수를 호출할때 resolve와 reject 구실을 할 수있는 함수를 만들어 넣어줘야 한다. 

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

  return {
    PromiseStatus: status,
    PromiseValue: value,
  }
}
```

## 헬퍼함수 작성하기

위에서 본 헬퍼함수는 두종류가 존재한다. `getThen` , `doResolve` 함수이다.
`getThen` 의 경우에는 Promise 객체의 특징은 then 함수가 있는지 없는지 파악하여 있으면 then 함수를 리턴 없으면 null 을 리턴한다. 또한 잘못된 Promise를 막아줌.
`doResolve` 의 함수의 경우에는 fulfill 과 reject 를 한번만 호출할수 있도록 도와준다.
또한 fn 을 한번 호출한 뒤에는 내부적으로는 아무것도 할것이 없다. 다시 resolve나 reject를 사용자에서 호출을 해줘야 다음 절차를 이행해 간다. 

실제 Promise에서도 resolve 함수를 여러번 호출했을 경우를 막아준다. ( 맨 처음에 호출한 resolve 로 귀결시킨다. )

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
              resolve(onFulfilled(result)) // 리턴되는 값을 다시 새로운 resolve에 넘겨주어야 그 다음 then에게 전달. 
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

앞서 done 함수의 경우 연속된 체이닝을 갖지 못하는 단점을 지니고 있었다. 
then 함수의 경우에는 연속된 then 호출을 할수있도록 체이닝을 지니고 있으면서 then에 등록된 함수에서 return 값이 자동으로 그 다음 호출되는 then 핸들러의 인자값으로 전달 될수 있도록 모양새를 갖추고있다. 


위에서 then은 연속된 then 호출을 위해 promise로 감싸서 리턴을 하고있다. 


기본적으로 then에서 리턴된 값은 즉시 다음 핸들러로 전달이 된다. 만약 리턴된 값이 promise라면 그 값이 귀결될때까지 다음 then 호출을 기다린다. promise의 결과값이 주어졌을 경우에 다음 next를 호출하게 된다. 

```javascript
new Promise(function(resolve, reject) { 

  setTimeout(() => resolve(1), 1000); 
  // 여기서 resolve는 내부적인 resolve 함수를 호출, 
  // 그 이후에 fulfilled 과 value 1 셋팅 그 이후에 등록해뒀던 핸들러 함수 실행 ( 아래 then으로 등록해둔 함수 )
  // 사실 then 함수는 바로 등록하기 보다는 해당 함수를 실행할수 있는 함수를 등록함. 

}).then(function(result) {

  alert(result); // 1

  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) { // (**)

  alert(result); // 2

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) {

  alert(result); // 4

});
```

## 결론

* 위 코드는 아주 최소화된 Promise를 따라 구현해본것이다.
* then이라는 체이닝을 제외하고 대략적인 구현 방식은 약속하고 싶은 코드를 먼저 실행을 하고 비동기 안에 resolve 함수가 들어가있다면 done 함수와 state를 통해서 그 즉시 resolve 함수를 등록해 둔다. 비동기가 끝난 뒤 resolve를 실행 하게 되면 등록 되었던 함수가 동작하게 된다.
* 체이닝의 경우 처음 동기화 부분이 다 진행된 뒤에 ( 비동기는 나중에 실행될 부분이므로 ) then 함수가 진행이 된다. then 함수는 기본적으로 Promise를 리턴하므로 체이닝으로 then 함수를 또 불러올수 있고 Promise 인자인 함수를 바로 호출하게 된다. 
여기서 done 함수를 이용해서 비동기 완료 후 불러올 handler를 등록을 해둔다. 그 이후로도 마지막 then까지 실행이 되며 그전 then에서 등록해둔 resolve 함수를 등록해둔다. 
이후 비동기 값이 귀결값이 정해지면 done에서 등록해두었던 handler 함수가 실행 될것이고 hendler 안에는 then에서 등록해두었던 onFulfilled 함수를 실행한다. 여기서 나온 리턴값을 가지고 다시 resolve를 시켜주게 되면 계속적으로 등록해두었던 함수를 호출하게 된다.  
* Promise의 인자 함수에 비동기 코드가 아닌 일반 코드가 들어갔을 경우 (ex. resolve(1)만 들어가있을 경우 ) 여기서 동기적인 resolve(1) 호출은 Promise의 상태값과 귀결값(1) 만 셋팅해주고 나머지 done이나 then에서 호출되었을때 상태가 귀결되었으므로 인자로 받았던 함수를 아까 셋팅해둔 귀결값을 넣고 호출해주게 된다. 
* resolve에서 getThen 과 doResolve 함수는 result 값이 Promise 객체일 경우 처리해주는 함수들이다. 
* 여기서 중요한건 함수의 연속된 함수 참조를 이루고 있다는 것이다. 

## 출처

[https://www.promisejs.org/implementing/](https://www.promisejs.org/implementing/)
