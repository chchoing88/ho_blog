---
title: thinking high order function
date: "2018-11-05T10:00:03.284Z"
---

# High Order Function에 대해서 생각을 적는다.

## 서론

- 기본적인 high order function (고차함수) 특성을 이해한다.
- high order function 을 썼을때의 이점과 어느 상황에서 사용이 될 수 있을지 생각해 본다.
- Promise 와 react-thunk를 알아보면서 느꼈던 high order function(고차함수)에 대해서 생각해 본다. 

## high order function 정의 

- Taking Function as Arguments
- Returning Functions as Results


## 상황

### 함수형 자바스크립트

- 미리 넣어두기 ( 느낌 )

### 동기식 로직에서 중간에 비동기 로직이 들어가야 할 경우.

- 내가 다음에 실행하는거 알고 있으니 나한테 인자로 함수를 넣어줘봐 내가 그 함수 인자로 그 다음에 실행해야하는거 넣어줄게 그러면 너는 그 인자를 비동기 후에 실행 시키면 되. ( 느낌 )

## 리엑트 미들웨어

- 어떤 특정한 기능을 하는 함수(A)를 다른 함수를 인자로 주입 한뒤 더 추가 기능을 수행할 수 있는 함수를 작성하고 주입된 함수(A)를 실행하는 코드 작성, 그 후에 그 특정한 기능을 하는 함수(A)를 대체 한다. 그러고 나면 처음에 주입한 함수(A)를 확장할 수 있다. 

## 커링

- 어떤 연산을 수행할 때 필요한 값 중 일부를 저장하고 나중에 나머지 값을 전달 받는 기법, 이를 위해 다른 함수를 반환하는 함수를 사용하며, 이를 커링된 함수라 부른다.

```javascript
const userLogs = userName => message => 
  console.log(`${userName} -> ${message}`)

const log = userLogs('merlin');

log('hi merlin, i am ready message')

fetch('url').then(
  data => log(`response ${data}`)
)
```

## 결론

- 다른 함수를 반환하는 고차 함수는 자바스크립트에서 비동기적인 실행 맥락을 처리할 때 유용하다.
- 함수를 반환하는 고차 함수를 이용하면 필요할 때 재활용할 수 있는 함수를 만들 수 있다.



## 참조

- [https://www.sitepoint.com/higher-order-functions-javascript/](https://www.sitepoint.com/higher-order-functions-javascript/)