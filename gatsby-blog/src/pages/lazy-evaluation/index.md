---
title: lazy evaluation
date: "2018-04-05T10:00:03.284Z"
---

# 게으른 평가
  
* call-by-need 라고도 불리는 이 전략 방법은 ( 반대는 call-by-name ) 값이 실제로 필요할때 평가를 하는것이다. 또한 반복적인 평가를 피하기 위해서 한번 평가해둔 자료는 기억해 둔다.(memoization)
    

  
# 왜?

* 아래와 같은 코드를 생각해 보자. 

```javascript
const someValue = expensiveFunction();
//.. someValue를 사용하지 않는 다른 연산 코드들 및 유저 인터페이스를 포함하고 있는 수많은 코드들..

console.log(someValue)
```

* someValue는 코드의 맨 마지막 console.log 찍을때 필요하다.
* 처음에 expensiveFunction을 호출할때 브라우저는 그 시간동안 아무것도 안한다. 그 이후에 있을 사용자 경험을 높이기 위한 코드를 지연시키고 따라서 사용자 경험을 방해했을 것이다. 이것은 문제다.
* 물론 아래와 같이 바꿀수 있다.

```javascript
//.. someValue를 사용하지 않는 다른 연산 코드들 및 유저 인터페이스를 포함하고 있는 수많은 코드들..

console.log(expensiveFunction());
```

* 아름답지 않을 뿐더러 큰 프로젝트일수록 언제 쓰일지도 모르고 필요할때마다 매번 호출하게 되니 비용이 많이 든다.

# 이렇게 하고 싶다.

* 만약 평가를 정말 필요할때 하면 어떨까? 
* 자바스크립트에서 lazy 라는 키워드가 있다면..
* someValue에는 실제 평가를 진행하는 코드가 있을테고 해당 값을 호출하면 그때 실제로 작동하는 코드이다.
* 아래와 같이 쓸수 있을 것이다.

```javascript
lazy const someValue = expensiveFunction();

//... 수많은 코드들..

console.log(soameValue);
console.log(soameValue);
```

* 다만, 여기서 2번 반복해서 썼다고 해서 평가를 2번하는건 비효율 적이다.


# 만들어 보자.

* 실제 자바스크립트 안에는 lazy 라는 키워드가 없기 때문에 lazy 라는 함수를 만들어 보자.

  ## memoization 패턴을 이용한 반복호출을 피하자.
  
  ```javascript
  const lazy = getter => {
    let evaluated = false;
    let _res = null;

    const res = function(){
      if(evaluated) return _res;
      const _res = getter.apply(this, arguments);
      evaluated = true;
      return _res;
    }

    return res;
    }
  ```
  * lazy 함수는 getter 라는 함수를 인자로 받아서 getter를 호출시켜주는 새로운 함수를 반환한다.
  * 클로저를 사용, evaluated 와 _res 변수는 반복 호출을 피하기 위한 자유변수들이다.

  ## 사용해보자.

  ```javascript
  let counter = 0;

  const lazyVal = lazy(() => {
    counter += 1;
    return 'result';
  })

  console.log(counter); // 0
  console.log(lazyVal()); // result
  console.log(counter); // 1
  console.log(lazyVal()); // result
  console.log(counter);  // 1
  console.log(lazyVal()); // result
  ```
  * 여러번 호출하더라도 한번만 호출이 된다는걸 알수 있다.

  * 이제 실질적으로 사용하면 되는가????
    * 실제 lazyValue들 끼리 연산작업이 필요할 경우엔 어떻게 해야할까???

    ```javascript
      const actualVal1 = lazyVal1();
      const actualVal2 = lazyVal2();

      console.log(actualVal1 + actualVal1);
    ```
    * 음..달라진게 없는거 같다. 
    * 우리는 평가를 실제로 필요한 지점에서 사용하고 싶은데 그럼 어떻게 해야할까.

    ```javascript
    const newVal = lazy(() => {
      const actualVal1 = lazyVal1();
      const actualVal2 = lazyVal2();
      return actualVal1 + actualVal2;
    })
    ```
    * 다시 lazy로 감싸야한다.
    * 음.. 아름답지가 않다.

  ## 업그레이드 하자

  * 우리가 원하는 시점으로 평가를 할수있도록 뒤로 늦추긴 했지만 매번 lazy로 감싸야 하는 번거로움이 있었다.
  * 체이닝으로 엮어서 표현하면 어떨까???
  * 다시 lazy 함수를 업그레이드 해보자.

    ### 이런 모양이면 좋겠다.

    ```javascript
    let counter = 0;

    const lazyVal = lazy(() => {
      return counter += 1;
    })

    /* 첫 평가 실행후 리턴 된 값으로 다시 lazy를 리턴 */
    const lazyOp = lazyVal.then(v1 => lazy(()=> {
      return v1 + 1;
    }))
    ```

    ### lazy를 수정하자.

    ```javascript
    const lazy = getter => {
      let evaluated = false;
      let _res = null;

      const res = function(){
        if(evaluated) return _res;
        const _res = getter.apply(this, arguments);
        evaluated = true;
        return _res;
      }

      /* 체이닝을 위한 then 함수 생성 */      
      res.then = modifier => modifier(res());
  
      return res;
      }
    ```  

    * 리턴된 inner함수 (res) 에게 프로퍼티로 then 함수를 추가.
    * then에서 인자로는 첫번째 평가 이후에 리턴된 값으로 다시 lazy를 수행할수 있는 next 함수를 받는다.

    ### map 함수를 만들어 보자.

    * then 함수는 임의로 우리가 lazy 함수를 리턴해줬었어야 했다.
    * 이번엔 그것마저 자동으로 해주는 map 함수를 만들어보자.
    
      #### 이런 모양이어야 한다.

      ```javascript
      let counter = 0;
     
      /* 첫 평가 실행후 리턴 된 값으로 다시 lazy를 리턴 */
      const lazyOp = lazy(() => counter += 1)
      .map(v1 => 
        v1 + 1
      )
      .map(v2 => 
        v2 + 1
      )

      ```

      
      #### 다시 lazy 함수를 수정하자.

      ```javascript
      const lazy = getter => {
        let evaluated = false;
        let _res = null;

        const res = function(){
          if(evaluated) return _res;
          const _res = getter.apply(this, arguments);
          evaluated = true;
          return _res;
        }

        /* 체이닝을 위한 then 함수 생성 */      
        res.then = modifier => modifier(res());
        /* map 함수 */
        res.map = mapper => lazy(() => mapper(res()));
        return res;
        }
      ```  

# 정리
  
  * 자바스크립트에서의 게으른 평가는 결국 호출하고 싶은 코드들을 함수로 한번 더 감싸 실제 필요할때 평가한다.
  * lazy 체이닝의 경우 연속된 함수 참조에 의해서 이뤄진다.

  


# 참고

[https://www.codementor.io/agustinchiappeberrini/lazy-evaluation-and-javascript-a5m7g8gs3](https://www.codementor.io/agustinchiappeberrini/lazy-evaluation-and-javascript-a5m7g8gs3)