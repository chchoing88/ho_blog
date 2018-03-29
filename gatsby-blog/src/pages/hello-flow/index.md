---
title: hello-flow
date: "2018-03-29T10:00:03.284Z"
---

## Intro

- flow 는 자바스크립트의 스태틱한 타입들을 체크해주는 도구이다.
- flow 는 코드가 변경되는 동안 빠른 피드백을 줍니다.
- flow 는 타입을 추론할 수 있습니다. 

## install

1. 바벨을 이용해서 flow 유형을 변환시켜줘야 한다.

```sh
npm install --save-dev babel-cli babel-preset-flow
```
* 만약 리엑트를 사용해서 babel-preset-react를 사용한다면 bable-preset-flow는 별도로 설치할 필요가 없다.

2. .babelrc 의 preset 속성에 flow 작성

```javascript
{
    "preset": ["flow"]
}
```

* 이 역시도 react를 사용하고 있다면 react만 적어주면 된다.

3. flow 설치

```sh
npm install -g flow-bin
npm install --save-dev flow-bin
```

4. flow init

flow init 을 하게 되면 .flowconfig 파일이 생성.

.flowconfig에서 flow의 여러가지 config 설정을 할 수 있음.

홈페이지 참조! [https://flow.org/en/docs/config/](https://flow.org/en/docs/config/)


5. flow 명령어를 차기 되면 해당 프로젝트의 타입들을 체크

### 요약

- flow init 으로 프로젝트를 init
- flow 명령으로 Flow background 프로세스를 실행
- 각 파일상단에 "// @flow" 을 기입하므로써 flow가 모니터링을 할수 있게 정의
- flow code 작성
- flow error type 체크


## Type들 

1. primitive types

- 가장 기본적인 원시타입의 정의 
- 리터럴 값의 타입은 소문자로 정의 
- object로 wrapper 한것들은 capitalized 로 정의

```javascript
function method(x: number){

}

function method(x: Number){

}
```
- Boolean , String, Number, null , undefined(flow는 void로 정의 ) , Symblos ( 아직 flow가 지원안함 )

2. Mixed types

- type을 알수 없을때 사용한다.
- 프로그램들은 여러가지 다른 타입의 종류를 지닐수 있다.
- mixed 타입은 아무 타입이나 받을 수 있다. 
- mixed는 아무거나 받을 수 있지만 mixed 유형의 값을 사용하려고 한다면 실제 유형이 무엇인지 알아내야 한다. 그렇지 않으면 에러를 내뿜는다.

```javascript
function user(value: mixed) {
    return "" + value // error
}

function user(value: mixed) {
    if( typeof value === "string" ){
        return "" + value // works!!!
    }
}
```

3. any types

- mixed 와 햇갈려 하지 마세요.
- any 자체는 완벽하게 안전하지 않습니다. 어느때나 에러를 내뿜지 않습니다.
- 그래서 any로 type을 지정했을 경우에는 가능한 빨리 다른 타입으로 casting을 해야 합니다.

4. maybe types

- typing value가 있을수도 있구 없을수도 있을때 사용한다.
- 예를 들어 ?number 라고 타입을 지정하면 받을 수 있는 타입은 number , null , undefined 타입만을 받을 수 있다.

5. variable types

- 변수를 선언할때 타입을 추가한다.
- javascript 변수 선언 방식은 const , let , var 방식이 있다.
- flow는 두 그룹으로 나뉜다 재 할당이 가능한지 ( let, var ) 가능하지 않은지 ( const )

```javascript
var fooVar: number = 2;
let barLet: number = 2;
const bar: number = 2;

fooVar = "3" // error
```

6. function types

- 함수는 2가지 장소에 type을 지정할 수 있다. 하나는 매개변수 ( input ) 나머지 한곳은 return value ( output ) 이다.

```javascript
function concat(a: string , b: string): string {
    return a+b;
}

let method = (str: string , bool?: boolean, ...args: Array<number>) => {

}

// 함수 타입을 아예 지정할 수 있다.
type merlin = {
    ho: (str: string) => void,
    hoing: (string , boolean | void , Array<number>) => void, // 파라미터 명을 생략할 수도 있다.
}

// 콜백에 대한것도 지정할 수 있다.
function method(cb: (error: Error | null , value: string | null) => void){

}
```

- function 의 this의 경우에는 해당 function을 실행한 context를 체크한다. 
- 술어 함수에 대해서는 리턴값 다음에 **%checks** 라고 적어주지 않으면 에러를 뿜는다.

```javascript
function truty(a,b):boolean %checks {
    return !!a && !!b;
}

function merlin(){
    if(truty(a,b)){

    }
}
```

- 만약 매개변수로 좀더 유연한 function을 받으려면 **() => mixed** 를 사용한다.

```javascript
function method(func: () => mixed){

}
```

- 만약 타입체크를 피할 필요성이 느끼면서 any 방법을 사용 하지 않으려면 Function 을 타입으로 사용하면 된다. 하지만 이 방법은 안전하지 않고 피해야할 방법이다.

아래와 같은 코드에서 에러를 내뿜지 않는다.

```javascript
function method(func: Function){
    func(1,2); //works
    func("1","2"); //works
    func({},[]) //works
}

method(function(a: number, b: number){
    return a+b;
})
```

7. Object types

```javascript
var obj1: {
    foo: number,
    bar: boolean,
    baz: string
} = {
    foo: 1,
    bar: true,
    baz: "abc"
}

var obj: { foo? : boolean} = {};
obj.foo = true // works
obj.foo = "abc" // error
```
- value 의 type을 설정할 때에는 optional properties가 void 와 생략을 사용할수 있게 한다. 다만 null 값은 에러를 낸다.

```javascript
// foo 에 null 을 셋팅하면 error가 뜬다.
function acceptsObject(value: {foo? : string}){
    // ...
}

```

- sealed object의 경우에는 없는 값을 추가 하려면 에러를 뿜는다.
- unsealed object의 경우에는 새로운 값을 추가해도 허락한다.

```javascript
var obj = {
    foo: 1
}

obj.bar = true; //error
obj.baz = "abc" //error
```

- 조건문에 따라 달라지는 프로퍼티의 값이 있다면 아래처럼 해줘야 한다.

* sealed object 는 프로퍼티를 추가 할수 없다. 

```javascript
var val3: boolean | string = obj.prop;
```

- unsealed object 의 알지못하는 프로퍼티를 정해진 타입에 할당하는 것은 안전하지 못하다.

- exact 한 obect를 만들고 싶다면 **{| |}** 를 사용한다.
```javascript
var foo: {| foo: string |} = { foo: "Hello", bar: "World!" }; // Error!

```

9. array types

- array 타입은 Array<Type> 으로 사용하고 Type 장소에 배열의 요소 타입을 정의 할 수 있다. 
```javascript
let arr: Array<number> = [1, 2, 3];
let arr2: Array<string> = ["1", "2", "3"]
```

- 축약형으로 Type[] 으로 축약할 수도 있다.
```javascript
let arr: number[] = [0, 1, 2, 3];
```
- ?Type[] 는 ?Array<T> 와 같고 Array<?T>는 (?Type)[] 과 같다.
```javascript
// 이부분은 숫자로 된 배열이거나 , null , undefined 
let arr1: ?number[] = null;   // Works!
let arr2: ?number[] = [1, 2]; // Works!
let arr3: ?number[] = [null]; // Error!

// 이부분은 배열이면서 배열 안에 element들이 숫자이거나 , null , undefined 된거
let arr1: (?number)[] = null;   // Error!
let arr2: (?number)[] = [1, 2]; // Works!
let arr3: (?number)[] = [null]; // Works!
```

- array type을 안전하게 사용하는 방법
```javascript
let array: Array<number> = [0, 1, 2];
let value: number | void = array[1];

if( value !== undefined ){
    // number
}
```

10. tuple types

```javascript
let tuple1: [number] = [1];
let tuple2: [number, boolean] = [1, true];
let tuple3: [number, boolean, string] = [1, true, "three"];

```

- mutating 한 Array method를 tuples type에 사용하지 않는다.
- tuples는 array type과 match 시키지 않는다.
- 같은 tuples 타입이라도 같은 length 여야 한다.

11. class types

- flow 안에서 javascript classes 는 값과 타입 2가지로 작동한다.

```javascript
class MyClass {
  // ...
  prop: number;
  method(value: string): number {
      this.prop = 42; // 이걸 사용하려면 위에 처럼 필드에 대한 타입을 설정해야 한다.
  }
}

let myInstance: MyClass = new MyClass();
```

- classes는 자신만의 generics를 가질수 있다.
```javascript
// @flow
class MyClass<A, B, C> {
  constructor(arg1: A, arg2: B, arg3: C) {
    // ...
  }
}

var val: MyClass<number, boolean, string> = new MyClass(1, true, 'three');

```