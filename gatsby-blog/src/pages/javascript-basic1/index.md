---
title: Javascript-Basic1
date: "2018-04-05T10:00:03.284Z"
---

# 패턴 연습을 위한 기본 다지기

## 일급 객체인 함수를 잘 다루자

   - 함수를 인자로 받거나 함수를 리턴한다. 이것은 즉, 함수가 high order function 임을 인지한다.

   ```javascript
    // d3.js example

    var svg = {};
    svg.line = function(){

        var getX = function(){};
        var getY = function(){};
        var interpolate = function(){};

        function line(data){
            //...
            // private 함수.
            function segment(){}
            var d = data
            // getX 와 getY 로 필요한 데이터를 추출해서 사용.
            // call 로 함수를 호출 하는 까닭은~?
            getX.call(this,d,i);
            getY.call(this,d,i);

            // 추출 후 segment() 함수 사용.
        }

        line.x = function(fn){ 
            if(!argument.length) return getX;
            getX = fn; 
            return line;
        }
        line.y = function(fn){ 
            if(!argument.length) return getY;
            getY = fn; 
            return line;
        }

        return line; // 함수를 리턴한다. 
    }

    // usage
    var lineGenerator = svg.line();
    var path = lineGenerator(data);

    // 데이터가 달라질때 데이터 추출을 위한 함수 변경이 필요하다.
    var lineGenerator = svg.line()
        .x(function(d){})
        .y(function(d){})

    // 내가 만든 객체에서 값을 얻게끔 라인 생성기를 확장.
    var merlin = {
        getValue: function(){},
        lineGenerator: svg.line()
            .x(function(d){return 10 - this.getValue()})
            .y(function(d){return 10 + this.getValue()})
    }

    var path = merlin.lineGenerator();


   ```
    
   - 위의 getX 와 getY를 그냥 getX() / getY() 처럼 호출 했다면 위 코드는 getValue는 정의되어있지 않은 method라고 에러가 날것이다.
   하지만 getX.call(this) / getY.call(this) 여기서 이 this 는 함수를 호출한 객체를 참조한다.

## 덕 타이핑

   - 오리처럼 생겨서 오리처럼 걷고 오리처럼 꽥꽥 소리를 낸다면 그건 오리다.
    
   > 그게 오리인지 검사하지 말고, 당신이 오리의 무슨 행동이 필요한지에 따라서 오리처럼 우는지, 오리처럼 걷는지 등등 적절한 행동을 오리처럼 하는지 검사하세요

   - 즉, 사람이라도 오리처럼 울고 오리처럼 뒤뚱거리면 그건 사람이 아니라 오리이다.

   - 덕 타이핑이란 형태를 판별하는 대신, 원하는 동작을 수행할수 있는지에 대한 여부만 가지고 검사를 한다. 이때문에 오류들이 잠재할 수 있는 소지들을 안고있다.

   ```javascript
    // 오리라면 먹이를 주자. 이런 주제가 있다고 하면
    // 오리
    function Duck(){
        return {
            duckSound: function(){}
        }
    }

    // 어떤새.
    function Bird(){
        return {
            duckSound: function(){}
        }
    }

    function Merlin(){
        return {
            feed: function(obj){
                // if( obj instanceof Duck ) // 이것은 Duck로 객체를 생성했을 시.
                // if('duckSound' in obj)
                if(obj.hasOwnProperty('duckSound')){ // 이부분 오리인지 아닌지 확인하는 부분
                    return true;
                }
                return false;
            }
        }
    }
    var bird1 = new Bird();
    var bird2 = new Duck();
    var merlin = new Merlin();
    
    var result1 = merlin.feed(bird1); // true
    var result2 = merlin.feed(bird2); // true

    // 판별 방법
    if( something instanceof Merlin)
    // or
    if( 'x' in something)
    // or
    if( something.hasOwnProperty('x'))

   ```

## 함수 오버로딩

   - 자바스크립트에서 함수 오버로딩을 사용할 수 있다.

   ```javascript
    // ex 1) 인자 갯수에 따른 다른 처리 방법
    function a() {
        if(!arguments.length) {
            // 인자가 하나도 없을 시 처리하는 로직
            return ;
        }

        // 그외.. 
    }

    // ex 2) 콜백함수

    function a(data,fn) {
        var i = 0;
        var d = data;

        while(i < 10){
            fn(data,i);
            i++;
        }
    }
    // a에 넘기는 콜백함수는 기본 인자를 2개 받기에 사용자가 선택적으로 사용해도 된다.
    a({}, function(data,index){
        // data 만 써두 되고..
        // 주는 index를 같이 써두 되고..
        // 사용자에게 선택의 폭을 넓혀준다.
    })

   ```

## 스코프는 중첩 함수로 다스린다.
    
   - 함수를 중첩하여 코드를 계층화할 수 있다. 
   - 프로그램에서 변수/함수의 스코프를 최소화할 수 있다.
   - 스코프를 최소화?

   > 즉, 자바스크립트 스코프는 함수 선언시에 결정되기 때문에 함수를 중첩화 해서 실행시키면 그 안에서만의 스코프가 생겨난다. 다른 스코프에 영향이 가지 않기에 범위를 최소화 시킨다고 한다.
    
## 단일 책임 원칙 (SRP)

   - 책임은 곧 변경하려는 이유로 정의하고 모든 클래스 및 함수를 변경하려면 반드시 한가지 변경 사유만 있어야 한다. 즉, 보고서를 편집하고 출력하는 모듈(클래스)이 있다고 생각해보자, 이 모듈을 두가지 사유로 변경될수가 있는데 첫번째는 보고서의 내용이 변경되면 모듈이 변경될 수 있고 두번째는 보고서의 형식이 변경되면 같은 모듈이 변경될 수 있다. 단일 책임 원칙에 의하면 이 문제는 실제로 분리된 책임이라고 보고 분리된 클래스나 모듈로 나눠야 한다. 다른 시기에 다른 이유로 변경되어야 하는 두가지를 묶는 것은 나쁜 설게일 수 있다. 
    
   - 유일한 관심사만 확인하고, 어떻게 이행할지는 외부에서 제공하게끔 하면 도움이 된다.

## 개방/폐쇄 원칙
    
   - 실행 코드를 변경하지말고 어떻게든 재사용하고 확장하라는 뜻.
   - 변경되지 않을 것과 변경 가능성이 있는 것을 내다보는 힘을 길러야 한다.

## 리스코프 치환 원칙

   - 한 객체를 다른 객체에서 파생하더라도 그 기본 로직이 변경되어서는 안된다.
   - 내가 작성중인 함수가 기반 클래스로 하는 일과 서브 클래스로 하는일이 다르다면 이 원칙을 어긴 셈이다.
   - 자바스크립트에서는 어떤 함수의 인자가 숫자일 때, 문자열일 때, 아예 인자가 없는 undefined 탕입일 때를 각각 분기 처리하는 것이 대개 좋은 습관이다.
  

## 인터페이스 분리 원칙

   - 함수가 기대하는 인자가 무엇인지 명확히 하고 그 기대치를 최소화 해야한다. 
   - 특정 타입의 인자를 바라기보다는 이 타입에서 실제로 필요한 프로퍼티가 더러 있을 거라 기대하는 것이다.

## 의존성 연전 원칙

   - 인터페이스 기반 언어에서는 대개 의존성 주입이라는 연관된 개념으로 표현한다.
   - 상위 수준 모듈은 하위 수준 모듈에 의존해서는 안 되며 이 둘은 추상화에 의존해야 한다.
   - 클래스 A 가 클래스 B 를 필요로 할때 A 에서 B 를 생성하는게 아닌 A 생성자 안에 B를 서술하는 인터페이스를 만들어 놓고 A 가 생성이 되면 구체화한 B를 넘겨받는다.

   ```javascript
    // bad!!
    function A(){
        var b = new B(); // b 에 의존.
        return {
            //..
        }
    }

    function B(){
        var name = "merlin"
        return {
            id : name
        }
    }

    // good!!
    function A(){
        var b = { id: "none" } // 인터페이스

        return {
            setB: function (obj){
                b = obj;
            }
        }

    }
    
    var a = new A();
    a.setB(new B());
    
   ```

   - 위 처럼 해야 B의 파생형 버전을 제공할수 있는 이점이 있고 B를 고쳐야 할 경우 하위 버전 호환성을 유지하려면 어떤 로직을 계속 갖고 있어야 하는지 일목요연하게 서술한다.

   ```javascript
    // 어떠한 데이터로 라인을 그린다.
    function baseFn(data){
        return data;
    }

    svg.line = function(){
        return svg_line(baseFn);
    }

    function svg_line(projection){
        function line(data){
            
            function segment(){
                // 이 함수를 호출해서 여러가지 일을 한다...
                projection(data);
            }
        }
        return line;
    }

    var lineGenerator = svg.line();
    var path = lineGenerator(data); // 이렇게 하면 데이터 그대로 라인을 그린다.

    // 허나 난 이 데이터를 기반으로 다른 모양으로 그리겠다.
    // 데이터를 어떻게 조작할지만 생각한다. 즉, baseFn 만 바꿔주면된다.

    function additionFn(data){
        return data*0.3;
    }
    svg.line.addition = function(){
        return svg_line(additionFn); // 의존성 주입.
    }
    var lineGenerator = svg.line.addition();
    var path = lineGenerator(data);
   ```

## DRY 원칙

   - 반복하지 마라!!
   - 재사용할 수 있어야 한다. 
    

   ```javascript
    // bad
    while( ++i < n) {
        points.push([+getX.call(this, data[i],i),
                     +getY.call(this, data[i],i)])
    }

    // good
    var d;
    while(++i < n) {
        d = data[i]
        points.push([+getX.call(this, d,i),
                     +getY.call(this, d,i)])
    }
   ```

## 의존성 주입

### 의존성 주입이란?

- 의존성을 품은, 하드 코딩한 모듈은 단위테스트를 진행하기 어렵다.
- 의존성 품은 모듈의 한 메서드에서 의존성 모듈의 함수들을 호출한다 했을때, 해당 의존성을 품은 모듈은 단위테스트 하기가 까다로워 지고, 폭넓은 경우를 파악하기 힘들다.
- 반면 의존성을 주입하게 되면 fake(모의체)를 주입해서 좀 더 넓은 범위의 가능성에 대해서 테스트를 진행해볼수 있다.

### 의존성 주입하여 믿음직한 코드 만들기

- 의존성 주입 코드는 재사용을 적극적으로 유도한다.
- 하드 코딩한 모듈은 재사용하기가 어렵다. 
- 의존성 주입 코드로 바꾼 다음에는 주입 당한 코드에서 사용하는 주입된 인스턴스 메서드만 있다면 어떤 인스턴스라도 사용할수 있다는 장점이 있다.

### 의존성 주입의 모든것 

- 객체 또는 의존성 중 어느 하나라도 DB, 설정파일, HTTP, 기타 인프라등의 외부 자원에 의존하는가/
- 객체 내부에서 발생할지 모를 에러를 테스트에서 고려해야 하나?
- 특정한 방향으로 객체를 작동시켜야 할 테스트가 있는가?
- 이 서드파티 제공 객체가 아니라 온전히 내가 소유한 객체인가?

## 정리
   - 관심사를 분리하는 일에 집중하고 단일 책임 원칙이나 의존성 주입같은 소프트웨어 공학 원칙을 잘 써먹는게 중요하다.