# 당신이 모르는 자바스크립트의 메모리 누수의 비밀

> 원문 : [https://javascript.plainenglish.io/these-5-bad-javascript-practices-will-lead-to-memory-leaks-and-break-your-program-9cf692303043](https://javascript.plainenglish.io/these-5-bad-javascript-practices-will-lead-to-memory-leaks-and-break-your-program-9cf692303043)

크롬 DevTools로 하는 디버깅과 해결책을 찾아서!

인터뷰 하는 동안 다음과 같은 질문을 받아 본적이 있는가? 만약 웹 페이지가 멈췄을때, 원인이 뭐라고 생각하는가요? 원인을 찾아서 해결할 방법이 없을까요?

이는 광범위하고 심도 있는 질문으로, 페이지 성능 최적화 문제가 많이 수반된다. 필자는 아직도 인터뷰 질문을 받았을 때 이 질문에 어떻게 대답했는지 기억한다.

1. 먼저 네트워크 요청이 너무 많아 데이터 전송 속도가 느려지는지 확인한다. 이 문제는 캐싱으로 최적화할 수 있다.
2. 특정 리소스의 번들이 너무 클수 있으므로, 해당 번들을 분할 할 수 있다.
3. 너무 많은 루프로 인해 메인 스레드를 너무 오래 점유하고 있는지 우리의 자바스트립트 코드를 검토한다.
4. 브라우저가 특정 프레임에 너무 많은 것을 렌더링한 것일 수 있다.
5. 페이지 렌더링 프로세스 중에서 너무 많은 리플로우와 리페인트가 일어난다.
6. 잘 모르겠다.

후에 필자는 메모리 누수가 페이지 로딩이 오래걸리는 원인이라는 것을 알게 되었다. 이 글에서는 필자는 당신과 이 주제로 논의할 것이다.

## 메모리 누수란?

메모리 누수는 부주의 또는 일부 프로그램 오류로 인해 더 이상 사용되지 않는 메모리를 해제하지 못하는 것이다. 간단히 말해 변수가 100M의 메모리를 사용하고 필요하지 않지만 수동 또는 자동으로 해제되지 않는 경우에도 여전히 100M의 메모리를 사용한다. 이것은 메모리 낭비 또는 메모리 누수이다.

## 스택 메모리 와 힙 메모리

자바스크립트 메모리는 단순 변수에 사용되는 스택 메모리와 복잡한 객체에 사용되는 힙 메모리로 구분된다.

* 원시타입이라고 언급되는 단순 변수들은 다음과 같다. `String`, `Number`, `Boolean`, `Null`, `Undefined`, `Symbol`, `Bigint`
* 참조 데이터 타입이라고 언급되는 복잡한 객체는 다음과 같다. `Object`, `Array`, `Function`...

## 자바스크립트 내 가비지 커렉션

메모리 누수 정의에 따라서 몇몇 변수 또는 데이터는 더 이상 필요하지 않다면 그것은 가비지 변수 또는 가비지 데이터가 된다. 만약 더 이상 사용되지 않는 변수나 데이터가 메모리에 남아 있다면 메모리 사용량을 초과하는 결과에 이르게 할 수 있다. 이때 이 가바지 데이터를 정리 해야합니다. 여기서는 가비지 컬렉션 메커니즘의 개념을 소개한다.

가비지 컬렉션 메커니즘은 수동과 자동 두가지 범주로 나뉜다.

C 와 C++ 수동 정리 메커니즘을 사용한다. 즉, 개발자는 첫번째로 변수를 위해 특정 양의 메모리를 할당받고 필요가 없어지면 수동으로 해당 메모리를 비워주어야 한다.
반면, 자바스크립트는 자동 정리 메커니즘을 사용한다. 이 의미는 모든게 자동으로 처리해주기 때문에 우리는 얼마나 많은 메모리를 할당받고 비워주어야 하는지 관리하지 않아도 된다. 하지만 그렇다고 메모리 관리에 신경 쓸 필요가 없다는 의미는 아니다! 그렇지 않으면 이 기사에서 설명한대로 메모리 누수가 발생하지 않았을 것이다.

다음으로 자바스크립트 가비지 컬렉션 메커니즘을 살펴 보자.

일반적으로 전역 변수는 자동으로 정리되지 않는다. 그래서 우리는 지역 범위 메모리 수집에 초점을 맞출 것이다.

다음은 예제 코드다.

```javascript
function fn1 () {
    let a = {
        name: 'bytefish'
    }
    
    let b = 3
    
    function fn2() {
        let c = [1, 2, 3]
    }
  
    fn2()
  
    return a
}
let res = fn1()
```

위 코드의 호출 스택은 아래 그림과 같다.

![https://miro.medium.com/max/3600/1*czMCrgKKuV2FL6lhrcs9dg.png](https://miro.medium.com/max/3600/1*czMCrgKKuV2FL6lhrcs9dg.png)

그림의 왼쪽편은 스택 공간으로 이곳은 실행 컨텍스트와 원시 타입의 데이터를 저장하는데 사용된다. 오른편은 힙 공간으로 이곳은 객체를 저장하는데 사용된다.

`fn2()`가 실행될때, 콜 스택안 실행 컨텍스트는 위에서 부터 아래로 다음과 같이 존재한다. `fn2 함수 실행 컨텍스트` => `fn1함수 실행 컨텍스트` => `전역 실행 컨텍스트`.

함수 `fn2`가 내부 실행을 완료하면 화살표를 아래로 이동하여 `fn2`실행 컨텍스트를 종료 할 시간이다. 아래 그림과 같이 `fn2`실행 컨텍스트가 지워지고 스택 메모리 공간이 해제된다.

![https://miro.medium.com/max/3600/1*TYNSLtfZsaukaX9j3QMIuw.png](https://miro.medium.com/max/3600/1*TYNSLtfZsaukaX9j3QMIuw.png)

함수 `fn1`의 내부 실행이 완료된 후 `fn1 함수 실행 컨텍스트`를 종료 할 시간이다. 즉, 화살표가 다시 아래로 이동한다. 이때 그림과 같이 `fn1 함수 실행 컨텍스트`가 지워지고 해당 스택 메모리 공간이 해제된다.

![https://miro.medium.com/max/3600/1*m9DRb1lMevLouoD60dc9bA.png](https://miro.medium.com/max/3600/1*m9DRb1lMevLouoD60dc9bA.png)

이 시점에서 우리 프로그램은 전역 실행 컨텍스트에 있다.

자바스크립트 가비지 수집기는 가끔 호출 스택을 탐색하고 가비지를 수집한다. 이 시점에서 가비지 수집 메커니즘이 수행된다고 가정하자. 가비지 수집기가 호출 스택을 순회 할 때 변수 `b`와 `c`가 사용되지 않음을 발견하여 가비지 데이터임을 확인하고 표시한다. `fn1` 함수는 실행 후 변수 `a`를 반환하고 전역 변수 `res`에 저장하므로 활성 데이터로 식별되고 그에 따라 표시한다. 유휴 시간에 가비지 데이터로 표시된 모든 변수는 그림과 같이 해당 메모리를 해제하기 위해 지워진다.

![https://miro.medium.com/max/3600/1*cg4u6y72KeQkKVMvjz47Ew.png](https://miro.medium.com/max/3600/1*cg4u6y72KeQkKVMvjz47Ew.png)

여기까지 간단하게 정리하면 다음과 같다.

1. 자바스크립트의 가비지 수집기 메커니즘은 자동으로 실행되고 태그는 가비지 데이터를 식별하고 정리하는데 사용된다.
2. 지역 범위를 떠난 후 해당 범위의 변수가 외부 범위에서 참조되지 않으면 나중에 지워진다.

## Chrome DevTools로 메모리 사용량 관찰

Chrome DevTools의 성능 및 메모리 패널을 사용하여 자바스크립트 애플리케이션의 메모리 사용량을 관찰 할 수 있으므로 메모리 관리 메커니즘을 더 깊이 이해할 수 있다.

> 참고 : Chrome DevTools 사용 방법을 아직 모르는 경우 [이전](https://javascript.plainenglish.io/use-chrome-devtools-like-a-senior-frontend-developer-99a4740674) 게시물을 확인하세요.

먼저 다음 코드는 간단한 자바스크립트 프로그램이다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button onclick="myClick()">execute fn1</button>
    <script>
      function fn1() {
        let a = new Array(10000);
        return a;
      }

      let res = [];

      function myClick() {
        res.push(fn1());
      }
    </script>
  </body>
</html>
```

이 페이지는 매우 간단하다. 페이지에는 버튼이 하나 뿐이며 이 버튼을 클릭 할 때마다 프로그램이 새 배열을 만들고 배열 res에 저장한다.
컴퓨터에서 이 파일을 만든 다음 파일 주소를 복사하고 Chrome 브라우저에서 파일을 열자.

![https://miro.medium.com/proxy/1*ACefsXBinQCjk1rCmswdyA.png](https://miro.medium.com/proxy/1*ACefsXBinQCjk1rCmswdyA.png)

이 단계에서 참고 : 파일 주소를 사용하여 파일을 직접 열고 VSCode 또는 기타 IDE Live Server 기능을 사용하여 파일을 열지 않도록 하자. 후자는 파일에 핫 업데이트 코드를 삽입하여 메모리 관찰을 부정확하게 만든다. 필요한 경우 후속 테스트를 방해하지 않도록 브라우저의 확장 프로그램을 일시적으로 비활성화해야한다.

그리고 나서 브라우저의 개발자 도구의 Performance 패털을 연다.

![https://miro.medium.com/max/6152/1*91-UsL6mBitEVSkrudkxAg.png](https://miro.medium.com/max/6152/1*91-UsL6mBitEVSkrudkxAg.png)

이 패널은 많은 기능을 가지고 있다. 상단의 회색 둥근 버튼은 프로그램의 메모리 사용량을 기록한다. 둥근 버튼을 클릭해서 기록해보고 반복적으로 `fn1`함수를 실행시켜 보자.

![https://miro.medium.com/max/3226/1*RwyfeOezhcUpOyORam_NLA.gif](https://miro.medium.com/max/3226/1*RwyfeOezhcUpOyORam_NLA.gif)

결과는 다음과 같다.

![https://miro.medium.com/max/4516/1*vCorv_MhGep1ATmm8o19Rw.png](https://miro.medium.com/max/4516/1*vCorv_MhGep1ATmm8o19Rw.png)

라인 차트 아래쪽은 힙 메모리 사용량을 뜻한다. 버튼을 클릭하는 동안 `fn1` 함수가 새로운 객체를 생성하고 그 객체가 `res` 배열에 저장된다 그리고 가비지 컬렉터가 수거하지 못해 때문에 힙 메모리 사용량이 증가한다.

라인 차트가 콜백 징후 없이 상승 추세에 있는 경우 프로그램은 메모리를 지속적으로 소비하며 프로그램에서 메모리 누수가 발생할 가능성이 높다.

### 메모리 패널

메모리 패널에서는 메모리 사용량을 실시간으로 확인 할 수 있다.

![https://miro.medium.com/max/3200/1*ECWOmph2dNTo9QhpVwxacw.png](https://miro.medium.com/max/3200/1*ECWOmph2dNTo9QhpVwxacw.png)

사용하면 다음과 같다.

![https://miro.medium.com/max/3216/1*taXVc5W9Crq918hcDCv69Q.gif](https://miro.medium.com/max/3216/1*taXVc5W9Crq918hcDCv69Q.gif)

기록을 시작한 후에 오른쪽으로 파란색 히스토그램이 생성되는 것을 볼 수 있다. 이 히스토그램은 시간순으로 현재 메모리의 양을 보여준다. 또한 미디움 홈페이지를 열고 같은 방식으로 히스토그램을 기록 할 수 있다.

![https://miro.medium.com/max/3216/1*iamQ_W-LsG0FmzKhYEMpGQ.gif](https://miro.medium.com/max/3216/1*iamQ_W-LsG0FmzKhYEMpGQ.gif)

위 그림에서 파란색이 빠진 바 그래프와 회색 그래프를 볼 수 있다. 회색 그래프는 이전에 메모리 공간을 차지했었지만 지금은 삭제되고 해제되었다는 것을 나타낸다.

## 메모리 누수 예제들

그래서 어떤 상황들에서 메모리 누수가 발생이 될까? 다음 몇몇 가지가 있다.

* 잘못 사용된 클로저
* 예상치 못한 전역 변수 생성
* 분리된 DOM 노드
* 콘솔 출력
* 해제하지 않은 타이머

각 시나리오를 진행하면서 이전 설명했던 크롬 DevTools로 문제점을 살펴보자.

### 1. 잘못 사용된 클로저

이 글 처음에 언급했던 예제에서 `fn1`함수 실행 컨텍스트가 종료 된 후, 컨텍스트 안에 있는 변수 `a`는 가비지 데이터로써 수거 되었을 것이지만 `fn1`함수가 결국 변수 `a`를 반환하고 전역변수 `res`에 할당함으로써 `res`는 변수 `a`의 값을 참조하게 되었다. 그래서 변수 `a`의 값은 사용중이라는 표식을 갖게 되고 메모리를 차지하게 된다.
후에 `res`변수를 사용하지 않는다고 가정할때, 이 클로저 사용법은 적절하지가 않다.

퍼포먼스 탭과 메모리 탭을 사용해서 클로저가 메모리 누수에 원인이 되는 것을 보자. 메모리 누수 결과를 더 잘 보기 위해서 이 글의 처음 예제를 약간만 변경하자.

예제 코드는 다음과 같다.

```html
<!DOCTYPE html>
<html>
  <body>
    <button onclick="myClick()">execute fn1</button>
    <script>
      function fn1() {
        let a = new Array(10000);

        let b = 3;

        function fn2() {
          let c = [1, 2, 3];
        }

        fn2();

        return a;
      }

      let res = [];

      function myClick() {
        res.push(fn1());
      }
    </script>
  </body>
</html>
```

페이지에 버튼을 하나 생성했고 버튼을 클릭할 때마다 전역변수 `res` 변수에 `fn1`함수가 반환하는 값을 담을 것이다. 그 다음 퍼포먼스 탭에서 메모리 곡선을 기록하자.

* 먼저 회색 버튼을 눌러 메모리를 기록하자.
* 그 다음 메모리 기본 라인을 안정적으로 초기화 하기 위해 수동으로 가비지 컬렉션을 실행 시킨다.
* 그 후에 `fn1`함수를 몇번 클릭한다.
* 마지막으로 가비지 컬렉터를 수행한다.

![https://miro.medium.com/max/3198/1*qm-_3JgDFB1BdO2zywv1pQ.gif](https://miro.medium.com/max/3198/1*qm-_3JgDFB1BdO2zywv1pQ.gif)

결과는 다음과 같다.

![https://miro.medium.com/max/4548/1*028NLK7vuCBsa_wT7XcoPw.png](https://miro.medium.com/max/4548/1*028NLK7vuCBsa_wT7XcoPw.png)

`fn1`함수를 실행한 후에 힙 메모리 공간이 증가하고 전체 그래프 곡선이 단계별로 증가하는 결과를 볼 수 있다. 마지막 메모리 해제 직전에 기본 메모리 곡선보다도 높은 곡선을 발견 할 수 있다. 이것은 프로그램에서 컨텐츠 누수가 있었음을 나타낸다.

메모리 누수가 있는 것으로 알려진 경우 메모리 패널을 사용하여 문제를 보다 명확하게 식별하고 찾을 수 있다.

![https://miro.medium.com/max/3200/1*ECWOmph2dNTo9QhpVwxacw.png](https://miro.medium.com/max/3200/1*ECWOmph2dNTo9QhpVwxacw.png)

![https://miro.medium.com/max/3192/1*ZGVqWn8lO_SvpWilMtJzPw.gif](https://miro.medium.com/max/3192/1*ZGVqWn8lO_SvpWilMtJzPw.gif)

버튼을 클릭할때마다 파란색 막대가 동적 메모리 할당 그래프에 나타난다. 그 후에 가비지 컬렉터를 실행시켜도 파란색 바가 회색 바로 변하지 않는다. 이것은 할당된 메모리가 해제되지 않았음을 나타낸다.

힙 스냅샷을 사용해서 메모리 누수의 원인인 함수를 발견할 수 있다.

![https://miro.medium.com/max/2266/1*Z1npqYizSrX09peWMh1H0w.gif](https://miro.medium.com/max/2266/1*Z1npqYizSrX09peWMh1H0w.gif)

파란색 막대로 커서를 이동하면 해당 시간에 객체가 생성되었다는걸 볼 수 있다. 어떤 함수가 이 객체를 생성했는지 확인하기 위해서 그 객체를 클릭해 볼 수 있다. 그 함수가 메모리 누수의 범인이 된다.

### 2. 갑작스런 전역 변수 생성

필자는 이 글 처음에 전역 변수는 일반적으로 가비지 컬렉터에 의해서 수집되지 않는다고 언급했었다. 만약 필요하지 않다면 가능한 적게 전역 변수를 사용해야 한다. 몇몇 개발자들은 때떄로 무심코 전역 변수를 생성하곤 한다. 예를 들면 선언없이 변수에 할당을 한다면 그 변수는 전역에 생성되는 원인이 된다.

다음 예제 코드를 보자.

```javascript
function fn1() {
   // `name` is not declared
   name = new Array(99999999)
}
fn1()
```

이 경우에 변수 `name`은 자동적으로 전역에 생성되고 큰 배열이 `name`에 할당된다. 이 변수 `name`은 전역 변수이기 때문에 메모리 공간에서 해제 되지 않을 것이다.

그래서 매 코딩시 마다 변수를 선언하기 전에 값을 할당하는 것을 조심해야 한다. 또한 엄격한 모드를 사용하게 되면 우리가 모르고 실수 하는 것에 대해서 경고 에러를 받을 수 있다.

예제를 보자.

```javascript
function fn1() {
    'use strict';
    name = new Array(99999999)
}
fn1()
```

### 3. 분리된 DOM 노드

DOM 노드를 직접 제거했다고 가정해보자. 당신은 DOM 노드의 메모리를 해제 했어야 했지만 몇몇 코드는 여전히 삭제된 노드를 참조하고 있다. 그래서 메모리는 해제되지 못한다.

다음 예제를 보자.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="root">
    <div class="child001">I am child element</div>
    <button>remove</button>
</div>
<script>
    let btn = document.querySelector('button')
    let child001 = document.querySelector('.child001')
    let root = document.querySelector('#root')
    
    btn.addEventListener('click', function() {
        root.removeChild(child001)
    })

</script>

</body>
</html>
```

이 코드는 버튼을 클릭 후에 `.child001`노드를 제거한다. 클릭 후에 실제로 노드가 제거 되었지만, 전역변수 `child001`는 아직 해당 노드를 참조하고 있다. 그래서 노드의 메모리는 해제 되지 않는다.

메모리 패널에서 이것을 테스트해보자.

![https://miro.medium.com/max/1400/1*46Mzf1HGjKm0TD5OsN_Wpg.png](https://miro.medium.com/max/1400/1*46Mzf1HGjKm0TD5OsN_Wpg.png)

![https://miro.medium.com/max/3214/1*sDkz1BZtwR9ootKYFohvAA.gif](https://miro.medium.com/max/3214/1*sDkz1BZtwR9ootKYFohvAA.gif)

먼저 힙 스냅샷 기능을 사용해서 프로그램 시작했을때 힙 메모리를 기록해 둔다. 그 후에 버튼을 클릭해 `.child001`DOM 엘리먼트를 제거하고 힙 메모리 사용량을 다시 기록한다.

만약 두번째 스냅샷에서 `detached`라는 키워드로 검색했을때, DOM 트리에서 분리된 DOM 노드가 검색이 안되어야 하지만 제거 되지 않고 검색이 되었다. 실제로 `.child001` 엘리먼트를 찾을 수 있었고 이 엘리먼트가 가비지 컬렉터에 의해서 수거되지 않았음을 의미한다.

이 또한 메모리 누수의 시나리오다. 해결책은 다음과 같다.

```javascript
let btn = document.querySelector("button");
btn.addEventListener("click", function () {
    let child001 = document.querySelector(".child001");
    let root = document.querySelector("#root");
    root.removeChild(child001);
});
```

`.child001`노드를 참조하는 값을 콜백함수 내부로 이동했다. 노드를 제거하고 콜백 함수 실행이 종료 되고 나면, 노드의 참조값은 자동적으로 메모리 해제가 되고 더이상 메모리 누수를 일으키지 않는다.

확인해보자.

![https://miro.medium.com/max/3184/1*A0Yvo9tEF1-2YeYzhxUCLA.gif](https://miro.medium.com/max/3184/1*A0Yvo9tEF1-2YeYzhxUCLA.gif)

두번째 힙 스냅샷에서 더이상 삭제된 엘리먼트를 찾아 볼수 없는 결과로 가비지 컬렉터가 수가했다는것을 알 수 있다. 우리는 메모리 누수 문제를 성공적으로 해결했다.

### 4. 콘솔 출력

콘솔 출력이 메모리 누수의 원인이 될까? 맞다. 만약 브라우저가 우리가 출력하고자하는 객체의 정보를 저장하지 않는다면 어떻게 매 시간 우리가 콘솔탭을 열었을때 볼 수 있을까? 다음 테스트 코드를 살펴보자.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <button>btn</button>
<script>
    document.querySelector('button').addEventListener('click', function() {
        let obj = new Array(1000000)

        console.log(obj);
    })
</script>

</body>
</html>
```

우리는 버튼 클릭시 큰 배열 객체를 생성하고 출력한다. 퍼포먼스 탭에서 확인해보자.

![https://miro.medium.com/max/3184/1*1jREoQH7riDx1sT8insi_w.gif](https://miro.medium.com/max/3184/1*1jREoQH7riDx1sT8insi_w.gif)

기록을 시작하기 전에 가비지 컬렉터를 실행하면서 컨텐츠의 기본 메모리 라인을 정의해두자. 그 다음 버튼을 몇번 클릭하고 마지막으로 가비지 컬렉터를 한번 더 실행하자. 기록된 결과를 살펴보면 힙 메모리 곡선이 점점 상승하다가 마지막에 가장 높은 지점을 나타내고 있다. 이 결과의 의미는 매 클릭시 마다 큰 배열 객체가 브라우저에의해 저장되고 있고 `console.log` 때문에 가바지 컬렉터가 수거되지 않았다는 점을 보여준다.

다음, `console.log`를 제거하고 결과를 보자.

![https://miro.medium.com/max/2828/1*TA_BKosGcxLZLFnM0E-dGQ.png](https://miro.medium.com/max/2828/1*TA_BKosGcxLZLFnM0E-dGQ.png)

![https://miro.medium.com/max/3184/1*BiSxS7N-GeUUl5eRSTQJoQ.gif](https://miro.medium.com/max/3184/1*BiSxS7N-GeUUl5eRSTQJoQ.gif)

그래프의 결과는 다음과 같다.

![https://miro.medium.com/max/4520/1*iy1gvynSVXNwm2IR3i_sQQ.png](https://miro.medium.com/max/4520/1*iy1gvynSVXNwm2IR3i_sQQ.png)

`console.log`가 제거된 코드에서는 매 시간 `obj`가 생성되고나서 즉시 사라지는 것을 볼 수 있다. 결과적으로 가비지 컬렉터가 실행될때 새로운 메모리 라인은 기존 높이와 같은 높이를 유지하게 된다. 이것으로 메모리 누수가 없다는 것을 알 수있다.

마찬가지로 메모리 탭을 사용해서 다시 확인 할 수 있다.

* `console.log`를 사용 했을 때

![https://miro.medium.com/max/2780/1*ylJnveESj3Qn8OwPhG3Kzg.gif](https://miro.medium.com/max/2780/1*ylJnveESj3Qn8OwPhG3Kzg.gif)

* `console.log`를 사용하지 않았을 때

![https://miro.medium.com/max/1400/1*MLWj7C70jdP0ewm_q5voQw.gif](https://miro.medium.com/max/1400/1*MLWj7C70jdP0ewm_q5voQw.gif)

개발 환경일때 디버그 목적으로 콘솔을 출력할 수 있다. 하지만 실제 환경일때 가능한한 콘솔에 데이터를 출력하지 말아야 한다. 그래서 많은 자바스크립트 코딩 사양에서는 `console.log`를 사용하지 않기를 요구하고 있다.

만약 정말 변수 출력을 원한다면 다음과 같이 작성할 수 있다.

```javascript
if(isDev) {
    console.log(obj)
}
```

`console.log`, `console.error`, `console.info`, `console.dir` 등등 실제 환경에서 불필요한 변수를 출력하는 것을 사용하지 말야아 한다.

### 5. 해제 하지 않은 타이머

만약 해제하지 않은 타이머 정의하는 것도 메모리 누수가 원인이 될 수 있다.

다음 예제 코드를 살펴보자.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <button>start a timer</button>
<script>

    function fn1() {
        let largeObj = new Array(100000)

        setInterval(() => {
            let myObj = largeObj
        }, 1000)
    }

    document.querySelector('button')
      .addEventListener('click', function() {
        fn1()
    })
</script>

</body>
</html>
```

`fn1`함수는 버튼이 클릭된 후에 실행되었다. `fn1`함수는 `largeObj`큰 배열을 생성하고 동시에 setInterval 타이머를 생성했다. 타이머의 콜백은 `largeObj`를 참조하는데 여기까지 전체 메모리 할당을 살펴보자.

![https://miro.medium.com/max/2862/1*p_u9R_4PSnl7okcaWsX30A.gif](https://miro.medium.com/max/2862/1*p_u9R_4PSnl7okcaWsX30A.gif)

![https://miro.medium.com/max/4532/1*DYe3QqdnNeShZIwRUihshA.png](https://miro.medium.com/max/4532/1*DYe3QqdnNeShZIwRUihshA.png)

버튼 클릭은 `fn1`함수를 실행시키고 함수의 실행 컨텍스트가 종료된다. 그리고 함수 바디의 지역변수들은 해제된다. 하지만 사진의 기록의 결과를 살펴보면 메미로 누수가 보이고 즉, 마지막 메모리 곡선은 기본 높이 보다 더 높은 높이를 보여준다.

메모리 탭에서 다시 확인해보자.

![https://miro.medium.com/max/2814/1*Q9lAqVdu2OR3qFcOyQT7TA.gif](https://miro.medium.com/max/2814/1*Q9lAqVdu2OR3qFcOyQT7TA.gif)

버튼 클릭 후에 동적 메모리 할당 그래프에서 파란색 바를 볼 수 있다. 이것은 브라우저가 메모리의 한 부분을 `largeObj`변수에 할당했다는 것을 의미한다. 하지만 이 메모리의 한부분은 추후에 해지 되지 않았다. 즉, 메모리 누수가 발생했다는 것을 알 수 있다.

setInterval 콜백 함수가 `largetObj`를 참조하고 타이머가 해제되지 않았기 때문에 `largeObj`의 메모리가 해제되지 않았다.

어떻게 이 문제를 해결할 수 있을까? 우리는 딱 3번만 타이머가 실행되길 원한다고 가정해보자. 그러면 다음과 같이 코드를 변형할 수 있다.

```html
<body>
    <button>start a timer</button>
    <script>
      function fn1() {
        let largeObj = new Array(100000);
        let index = 0;
        
        let timer = setInterval(() => {
          if (index === 3) clearInterval(timer);
          let myObj = largeObj;
          index++;
        }, 1000);
      }

      document.querySelector("button").addEventListener("click", function () {
        fn1();
      });
    </script>
  </body>
```

그 후에 테스트를 진행해보면 다음과 같다.

![https://miro.medium.com/max/2860/1*BYFmMhTKCaLs8_TwsJnxiA.gif](https://miro.medium.com/max/2860/1*BYFmMhTKCaLs8_TwsJnxiA.gif)

![https://miro.medium.com/max/4484/1*-x6JFWASu-mR6lsIqGKwKA.png](https://miro.medium.com/max/4484/1*-x6JFWASu-mR6lsIqGKwKA.png)

기록 결과를 살펴보면 마지막 메모리 곡선이 처음 기본 곡선 높이와 동일한것을 확인할 수 있다. 이것으로 메모리 누수가 발생하지 않았다는 것을 알 수 있다.

## 결론

프로젝트 개발을 진행하면서 메모리 누수 같은 몇몇 성능 문제를 접한다면 이 글에서 언급했던 다음 다섯가지 상황을 문제 해결에 활용할 수 있고 문제를 찾아 해결책을 제시 할 수 있다.

자바스크립트 가비지 컬렉션이 자동이긴 하지만 때때로 특정 변수들의 메모리를 수동으로 해제 해야 하는 일이 필요하다. 예를 들어 만약 특정 상황에서 더 이상 필요하지 않은 변수가 외부 변수에의해 참조 당하고 있어 메모리가 해제 될 수 없을때 `null`을 할당해서 다음 가비지 컬렉션이 동작할 때 메모리를 해제할 수 있다.
