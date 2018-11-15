---
title: hello middleware
date: "2018-11-15T10:00:03.284Z"
---


## intro

- Node.js 에서 사용되는 use 함수와 redux에서 사용되는 middleware 들은 어떤 원리로 동작하는지 알아보자.

## 문제인식

- 어떠한 함수 호출 속에서 내가 원하는 작업을 중간에 끼워 넣고 싶다.
- 원하는 작업이 서버를 거쳐서 오는 경우나 DB를 거쳐서 오는 경우가 있을 수 있으니 비동기 작업도 있을 수 있다.
- 호출 순서를 보장받고 싶다.
- 기능별로 분리된 모듈로서 관리하고 싶다.

```javascript
// App의 execute 하기 전에 logging 와 saveStorage 모듈을 끼워 넣고싶다.
const App = function () {
  let state = {}
  this.execute = function(){
    state.exe = true
    console.log('execute')
  }
  this.getState = function(){
    return state
  }
}

// 서드파티로 위에껄 제공한다고 했을때..
// 아래 코드는 사용자 코드

const app = new App();

app.execute();

```

- 위와 같은 모듈이 있을때 사용자(App 모듈을 사용하는 사용자)는 execute 하기전에 내가 만든 logging 함수와 execute 하고나서의 saveStorage 함수를 끼워넣고 싶다.

### 의식의 흐름대로

```javascript
const app = new App();

console.log(app.getState()) // logging 
app.execute();
saveStorage(app.getState()) // saveStorage
```
- 앞뒤로 붙일순 있지만, 매번 이렇게 추가할수 없고, 비동기시 모듈을 실행할시 문제가 될 수 있다. 

### execute 몽키패칭

```javascript
let next = app.execute;

app.execute = function customExecute(){
  console.log(app.getState()) // logging 
  next()
  saveStorage(app.getState()) // saveStorage
}

```
- 위와 같이 작성을 해도 될것이다. 하지만 어떤 api가 덮어쓰기를 원할까???

### 몽키패칭 숨기기

- 기존 execute를 덮어쓰지말고 새로운 함수를 반환하는건 어떨까??
- 또한 각 모듈을 함수로 분리해서 관심사를 분리하자.

```javascript
// logger 미들웨어
function loggerExecute(app){
  let next = app.execute

  return function(){
    console.log(app.getState()) // logging 
    let result = next()
    return result
  }
}
// save 미들웨어
function saveExecute(app){
   let next = app.execute

  return function(){
    let result = next()
    saveStorage(app.getState()) // saveStorage
    return result
  }
}

const app = new App();
app.execute = loggerExecute(app)
app.execute = saveExecute(app)

app.execute()
```

### 몽키패칭 제거하기

- 위와 같이 해도 우린 execute 함수를 덮어쓰고있다.
- 그 이유는 그래야 우리가 등록한 미들웨어(모듈들)을 다 실행시킬수가 있기 떄문이다. 만약 덮어씌우지 않는다면 loggerExecute 나 saveExecute 이 함수 안에서 app.execute는 원본의 app.execute를 실행할 것이다. 
- 우리가 logging , saveStorage 모듈 말고도 다른 서드파티 모듈들을 실행시키고 싶다면 체이닝을 해야한다.
- 덮어쓰는 체이닝 말고도 미들웨어에서 next 함수를 매개변수로 받는 방법이 있다.


```javascript
const App = function () {
  let state = {}
  this.execute = function(){
    state.exe = true
    console.log('execute')
  }
  this.getState = function(){
    return state
  }
  this.applyMiddleware = function(middlewares){
    middlewares = middlewares.slice();
    middlewares.reverse();

    let execute = this.execute;
    middlewares.forEach(middleware =>
      execute = middleware(execute)
    );
    
    this.execute = execute
  }
}

// logger 미들웨어
function loggerExecute(next){

  return function(){
    console.log(app.getState()) // logging 
    let result = next()
    return result
  }
}
// save 미들웨어
function saveExecute(next){
   
  return function(){
    let result = next()
    saveStorage(app.getState()) // saveStorage
    return result
  }
}

const app = new App();

app.applyMiddleware([loggerExecute, saveExecute]) // 방법 1.

app.use(loggerExecute) // 방법 2.
app.use(saveExecute) 

app.execute()
```
- 방법 1. 또는 방법 2. 와 같이 진행된다면 사용자 코드에선 강제로 api를 덮어 써야 하는 코드를 작성하지 않아도 된다.



**위와 같은 문제인식을 생각해보았는데 이럴때 필요한게 미들웨어 패턴을 이다.**


## Middleware Pattern

### example 1 

```javascript

var Middleware = function() {};

Middleware.prototype.use = function(fn) {
  var self = this;

  this.go = (function(stack) {
    return function(next) {
      stack.call(self, function() {
        fn.call(self, next.bind(self));
      });
    }.bind(this);
  })(this.go);
};

Middleware.prototype.go = function(next) {
  next();
};
```


```javascript
var middleware = new Middleware();

middleware.use(function(next) {
  var self = this;
  setTimeout(function() {
    self.hook1 = true;
    next();
  }, 10);
});

middleware.use(function(next) {
  var self = this;
  setTimeout(function() {
    self.hook2 = true;
    next();
  }, 10);
});

var start = new Date();
middleware.go(function() {
  console.log(this.hook1); // true
  console.log(this.hook2); // true
  console.log(new Date() - start); // around 20
});
```

- 느낌 : 원본 go , 사본 go1, 사본 go2 이렇게 메모리에 적제 시켜놓구 ( use 함수를 써서 ) 최종적으로는 사본 go2를 호출 그럼 사본 go2는 사본 go1 을 호출하고 사본 go1 은 원본 go를 호출,
각각의 go에는 등록해뒀던 코드를 실행하고 이 다음에 실행해야 할 코드를 인자로 받는다. 

```javascript
// sudo code
original go = function ( next ){
  next();
}

실행 use(regi1Fun)
overide1 go = function(next){
  origianl go (function(){
    regi1Fun(next)
  })
}

실행 use(regi2Fun)
overide2 go = function(next){
  overide1 go (function(){
    regi2Fun(next)
  })
}

실행 go(regi3Fun)

// 실행순서
overide2 go 실행 ( next : regi3Fun ) -> overide1 go 실행 ( regi2Fun(next : regi3Fun) ) -> original go 실행 ( regi1Fun(next : regi2Fun(next : regi3Func)) ) -> next() 실행 ( regi1Fun(next : regi2Fun(next : regi3Func)) 이거 실행)
```

- 결국 `regi1Func(function(){regi2Func(regi3Func)})` 이 모양을 만들기 위해 존재하는 로직들이다.


### example 2

```javascript
const App = () => {
  const middlewrares = []

  const use = fn => middlewrares.push(fn)

  const runMiddelwrares = index => {
    const count = middlewrares.length
    if( index < count ){
      middlewrares[index].call(null, () => runMiddelwrares(index+1))
    }
  }

  const get = () => {
    runMiddlewares()
    console.log('get')
  }
}
```

```javascript
const app = App()
app.use(next) = > {
  setTimeout(() => {
    console.log('first one')
    next()
  },1000)
}

app.use(next) = > {
  setTimeout(() => {
    console.log('second one')
    next()
  },1000)
}

app.use(next) = > {
  setTimeout(() => {
    console.log('third one')
    next()
  },1000)
}

app.get()
```

### example 3

- redux 미들웨어

```javascript
const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    });
    throw err;
  }
}
```

```javascript
// 주의: 적당히 구현함!
// Redux API가 **아님**.

function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice();
  middlewares.reverse();

  let dispatch = store.dispatch;
  middlewares.forEach(middleware =>
    dispatch = middleware(store)(dispatch)
  );

  return Object.assign({}, store, { dispatch });
}
```


## 정리

- 필요한 정보를 먼저 받고 함수 리턴후 그다음 나중에 실행해야하는거 받고 먼저 받은거 실행하면서 나중에 실행해야하는걸 인자로 전달


## 출처 

- [https://gist.github.com/darrenscerri/5c3b3dcbe4d370435cfa](https://gist.github.com/darrenscerri/5c3b3dcbe4d370435cfa)
- [https://www.youtube.com/watch?v=E5JaeELl2RE](https://www.youtube.com/watch?v=E5JaeELl2RE)
- [https://dobbit.github.io/redux/advanced/Middleware.html](https://dobbit.github.io/redux/advanced/Middleware.html)