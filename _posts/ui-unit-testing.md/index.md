---
title: UI unit testing
date: "2018-08-04T10:00:03.284Z"
---

# Intro

- 비지니스 코드가 아닌 ui의 이벤트를 활용한 코드를 자스민으로 testing을 진행해보자.

# jasmine 이란?

- 행위 주도 개발 (Behavior-Driven Development, BDD) 방식으로 자바스크립트 단위 테스트를 작성하기 위한 라이브러리
- 단위 테스트(unit test)란 코드의 기능 단위(funtionality unit)를 테스트 하는 것을 말한다.
- BDD는 단위 테스트로 확인할 기능 또는 작동 로직을 일상 언어로 서술할 수 있는데 개발자는 자신이 작성 중인 코드가 '어떻게' 가 아닌 '무엇'을 해야하는지 테스트 코드에 표현할수 있다. 
- [공식홈페이지](http://jasmine.github.io)

## 테스트 꾸러미와 스펙

- 테스트 꾸러미는 describe로 정의할수있다. 
```javascript
// dscribe({문자열}, {함수})
decribe("무엇을 테스트할지 서술한다.",function(){
    console.log("테스트 꾸러미의 구현부")
})
```

- 스펙(즉, 개별테스트 )은 it으로 정의된다.
```javascript
// dscribe({문자열}, {함수})
it("무엇을 테스트할지 서술한다.",function(){
    // 적어도 한개의 기대식을 가진 함수 
})
```

- 예) 
```javascript
describe('어떤 버튼은', ()=> {
  describe('클릭했을 때', ()=> {
    it('경고창을 띄운다', ()=> {

    })
  })
})
```

- 테스트 꾸러미 구현부에 전역함수 beforeEach/afterEach 를 쓰면 각 꾸러미 테스트가 실행되기 이전에 beforeEach 함수를, 그 이후에는 afterEach 함수를 호출한다. 전체 테스트가 공유할 설정과 정리를 코드를 두 함수에 담아두면 코드 중복을 피할 수 있어 좋다. 

## 기대식과 매처

- expect 함수는 테스트 대상 코드가 낸 실제값을 인자로 받아 기댓값과 견주어본다. 
- 실제값과 기댓값을 비교하는 일은 매처 함수의 몫이다. 매처는 비교 결과 성공하면 true를 실패하면 false를 반환한다. 하나 이상의 기대식이 포함된 스펙(it함수) 에서 매처가 하나라도 실패하면 모조리 실패한 거로 간주한다. 
- 여러 매처 중에 toBe 매처는 같은 객체여야 한다는 의미이다. 
- 용도에 맞는 매처가 없으면 자스민이 지원하는 커스텀 매처를 만들어 쓴다.

```javascript
expect({실제값이 리턴된다.}).toBe({기댓값})
```
- 커스텀 매처 만드는 법

```javascript
// 기본 형식이다.
const customMacher = {
    merlin: function(){
        return {
            compare: function(actual, expected){
                let result = {}
                // 여기서 result는 pass와 message 프로퍼티를 포함해야 한다. 
                // pass에는 boolean 값이 들어가야 하고 true / false
                // message에는 pass가 true 됬을때 값일때 메시지나 false 됬을때 메시지를 적어준다.
                return result
            }
        }
    }
}


describe("테스트", function(){
    beforeEach(function(){
        // 인자로 커스텀 macher 객체를 넣어준다. 이 객체는 매처의 이름을 키 값으로 값는 메서드를 갖는다. 
        jasmine.addMatchers(customMacher); 
    })
})
```

## 스파이 

- 자스민 스파이는 테스트 더블 역할을 하는 자바스크립트 함수다.
- 테스트 더블이란
    - 더미 : 인자 리스트를 채우기 위해 사용되며 전달은 하지만 실제로 사용되지 않는다.
    - 틀 : 더미를 조금 더 구현하여 아직 개발되지 않은 클래스나 메서드가 실제 작동하는 것처럼 보이게 만든 객체로 리턴값은 하드코딩한다.
    - 스파이 : 틀과 비슷하지만 내부적으로 기록을 남긴다. 특정 객체가 사용되었는지, 특정인자로 호출되었는지 등의 상황을 감시한다.
    - 모이체 : 틀에서 조금 더 발전하여 실제로 간단한 구현된 코드를 갖고는 있지만 운영환경에선 사용할수는 객체다.
    - 모형 : 더미, 틀 , 스파이를 혼합한 형태와 비슷하나 행위를 검증하는 용도로 쓰인다. 
- jasmine.createSpy 함수의 경우 빈 껍데기 스파이이다. 

```javascript
// 예제.
callbackSpy = jasmine.createSpy();
expect(callbackSpy.calls.count()).expect(array.length);
```

- spyOn 함수를 쓰면 특정 함수를 들여다 볼수 있다. 첫번째 인자는 객체 인스턴스, 두번째 인자는 감시할 함수명이다.
- spyOn 함수는 기존 구현부를 대체하는 함수이다. 

```javascript
// 예제
spyOn(saver,'saveReservation');
spyOn(api, 'getRestaurnatsNearConference').and.returnValue(returnedFromService);
expect(saver.saveReservation).toHaveBeenCalled();
```


# Ui test

## 좋지 못한 html 코드 

- 클릭하면 span 돔에 카운트가 늘어나는 코드이다. 
- html과 javascript가 혼재해 있어서 지저분할분 아니라 javascript 코드를 복붙으로 밖에 재활용이 안된다. 

```html
<!DOCTYPE html>
<html>

  <head>
    <script type="text/javascript">
      var clickCount = 0,
          displayCount = function() {
            var countElement = document.getElementById("countDisplay");
            countElement.innerText = clickCount.toString();
          }
    </script>
  </head>

  <body>
    <button type="button" onclick="clickCount++; displayCount();">
      Increment
    </button>

    <span id="countDisplay">0</span>
  </body>

</html>
```

## 테스트 코드 및 모듈 작성(1)


- 기존에 인라인으로 들어간 스크립트를 모듈로 빼두자. 그러면 재사용성이 좋아진다.
- 이벤트 발생시 카운트가 증가해서 저장하는 부분과 DOM업데이트 함수로 나눈다. 그럼 비지니스 로직만 테스트할 수 있음.
- 우선 DOM과 엮이지 않은 코드를 작성해서 테스트를 진행한다. 

```javascript
function clickCountDisplay(){
    let count = 0;
    return {
        // 현재 count 구하기
        getClickCount: function(){
            return count;
        },
        // count를 Dom에 render
        updateCountDisplay: function(){

        },
        // count 증가 및 update Dom
        incrementCountAndUpdateDisplay: function(){
            count++;
            this.updateCountDisplay();
        }
    }
}
```

```javascript
// test코드

decribe("clickCountDisplay", function(){
    "use strict"

    beforeEach(function(){
        let display = clickCountDisplay();
    })

    it("0으로 초기화",function(){
        expect(display.getClickCount()).toEqual(0)
    });

     describe("incrementCountAndUpdateDisplay()", function() {
         it("count 증가 시킨다.",function(){
            let initCount = display.getClickCount();
            display.incrementCountAndUpdateDisplay();
            expect(display.getClickCouny()).toEqual(initCount+1);
         });

         it("updateCountDisplay 함수를 실행시킨다.",function(){
            spyOn(display,"updateCountDisplay");
            display.incrementCountAndUpdateDisplay();
            expect(display.updateCountDisplay).toHaveBeenCalled();
         })
     })
})
```


## 테스트 코드 및 모듈 작성(2)

- DOM이 바뀌는지 테스트를 진행한다. 
- updateCountDisplay 함수를 어떻게 테스트할지 생각해보자.
- updateCountDisplay 이 함수가 조작할수 있는 DOM 요소를 제공해야한다. 
- DOM 요소를 주입하고 나서 함수를 실행했을때 그 값이 잘 렌더링 되는지 확인한다.

```javascript
function clickCountDisplay(opts){
    if(!opts) throw new Error("opts를 주입해야합니다.");
    let count = 0;
    return {
        // 현재 count 구하기
        getClickCount: function(){
            return count;
        },
        // count를 Dom에 render
        updateCountDisplay: function(){
            opts.updateElement.innerHTML(count);
        },
        // count 증가 및 update Dom
        incrementCountAndUpdateDisplay: function(){
            count++;
            this.updateCountDisplay();
        }
    }
}
```


```javascript
// test코드

decribe("clickCountDisplay", function(){
    "use strict"
    let display,
        displayElement;
    beforeEach(function(){
        displayElement = document.createElement("span");
        document.body.appendChild(displayElement);

        clickElement = document.createElement("button");
        document.body.appendChild(clickElement);

        let options = {
            updateElement: displayElement,
            triggerElement: clickElement
        }
        // Element를 주입.
        display = clickCountDisplay(options);
    })

    afterEach(function(){
        displayElement.remove();
        clickElement.remove();
    })

     describe("incrementCountAndUpdateDisplay()", function() {
         it("updateDisplay",function(){
             display.incrementCountAndUpdateDisplay();
             expect(displayElement.innerText).teEqual(display.getClickCount());
         })
     });

     describe("updateCountDisplay()", function() {
        it("횟수를 한번도 늘린 적 없으면 0이 표시된다", function() {
            expect(displayElement.innerText).teEqual("");
            display.updateCountDisplay();
            expect(displayElement.innerText).teEqual("0");
        });
    });
})
```

## 테스트 코드 및 모듈 작성(3)

- 이벤트 트리거가 잘 해당 함수를 호출하는지 확인한다.

```javascript
// 테스트 코드
// .. 나머진 생략
it("클릭이벤트가 발생하면 incrementCountAndUpdateDisplay를 호출한다.",function(){
    spyOn(display, "incrementCountAndUpdateDisplay")
    clickElement.dispatchEvent(new Event('click')); // 클릭 발생시
    expect(display.incrementCountAndUpdateDisplay).toHaveBeenCalled();
})
```

```javascript
function clickCountDisplay(opts){
    if(!opts) throw new Error("opts를 주입해야합니다.");
    let count = 0;
    const module = {
        // 현재 count 구하기
        getClickCount: function(){
            return count;
        },
        // count를 Dom에 render
        updateCountDisplay: function(){
            opts.updateElement.innerHTML(count);
        },
        // count 증가 및 update Dom
        incrementCountAndUpdateDisplay: function(){
            count++;
            this.updateCountDisplay();
        }
    }

    opts.triggerElement.addEventListener('click', function(){
        module.incrementCountAndUpdateDisplay();
    })

    return module
}
```

# 결론

- UI 단위테스트는 다음을 확인하는 정도로 확인해야한다.
    - 요소를 클릭하면 알맞은 처리기가 확실히 실행되는가?
    - 사용자가 보면 안될 UI 요소가 있는가?
    - <select>가 원하는 데이터로 채워지는가.