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
      - 만약 리엑트를 사용해서 babel-preset-react를 사용한다면 bable-preset-flow는 별도로 설치할 필요가 없다.


  2. .babelrc 의 preset 속성에 flow 작성

      ```javascript
      {
          "preset": ["flow"]
      }
      ```

      - 이 역시도 react를 사용하고 있다면 react만 적어주면 된다.


  3. flow 설치

      ```sh
      npm install -g flow-bin
      npm install --save-dev flow-bin
      ```


  4. flow init
      - flow init 을 하게 되면 .flowconfig 파일이 생성.
      - .flowconfig에서 flow의 여러가지 config 설정을 할 수 있음.
      - 홈페이지 참조! [https://flow.org/en/docs/config/](https://flow.org/en/docs/config/)


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
    function method(x: number){}

    function method(x: Number){}
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
    obj.baz = "abc"; //error
    ```

    - 조건문에 따라 달라지는 프로퍼티의 값이 있다면 아래처럼 해줘야 한다.

    - sealed object 는 프로퍼티를 추가 할수 없다. 

    ```javascript
    var val3: boolean | string = obj.prop;
    ```

    - unsealed object 의 알지못하는 프로퍼티를 정해진 타입에 할당하는 것은 안전하지 못하다.

    - exact 한 obect를 만들고 싶다면 **{| |}** 를 사용한다.

    ```javascript
    var foo: {| foo: string |} = { foo: "Hello", bar: "World!" }; // Error!

    ```

8. array types

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

9. tuple types

    ```javascript
    let tuple1: [number] = [1];
    let tuple2: [number, boolean] = [1, true];
    let tuple3: [number, boolean, string] = [1, true, "three"];

    ```

    - mutating 한 Array method를 tuples type에 사용하지 않는다.
    - tuples는 array type과 match 시키지 않는다.
    - 같은 tuples 타입이라도 같은 length 여야 한다.

10. class types

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

11. Type aliases

    - 복잡한 타입들을 다양한 장소에서 사용하고 싶을때 flow는 type alias를 사용한다.

    ```javascript
    type MyObject = {
      foo: number,
      var: boolean,
      baz: string
    }
    ```

    - generics 를 활용해서 정의할 수도 있다.

    ```javascript
      type MyObject<A, B, C> = {
        foo: A,
        bar: B,
        baz: C,
      };

      var val: MyObject<number, boolean, string> = {
        foo: 1,
        bar: true,
        baz: 'three',
      };
    ```

12. Opaque Type Aliases

    - Opaque type aliases는 이 타입이 정의된 파일 외부에 있는 다른 파일들에서 접근을 허용하지 않는다. 
    - 이 타입은 선언된 곳 어디서든 사용될수 있는 type aliases와 동일하게 작동한다.

    ```javascript
    opaque type ID = string;

    function identity(x: ID): ID {
      return x;
    }
    export type {ID};
    ```

    - 또한 optionally하게 제약조건 subtyping을 추가할 수 있다.

    ```javascript
    // Opaque type alias syntax
    opaque type Alias = Type;
    opaque type Alias: SuperType = Type;

    opaque type ID: string = string;

    ```

    - import 한 opaque type은 외부에서 사용할 수 없다. 마치 nomial type 처럼 행동한다.
    - c++ , java , swift는 nomial type 시스템을 사용한다.
    - nominal type system 이란 타입의 구조가 같더라도 이름이 다르면 에러를 뿜는다.

    ```javascript
    // exports.js
    export opaque type NumberAlias = number;

    // imports.js
    import type {NumberAlias} from './exports';

    (0: NumberAlias) // Error: 0 is not a NumberAlias!

    function convert(x: NumberAlias): number {
      return x; // Error: x is not a number!
    }

    ```
    - opaque type alias 에 subtyping constraint를 추가할때 우리는 super type으로 사용된 opaque type을 선언된 파일 밖에서 사용할 수 있다.

    ```javascript
    //exports.js
    export opaque type ID: string = string;

    //import.js
    import type {ID} from './exports.js';

    function formatID(x: ID): string {
      return "ID: " + x; // works
    }

    function toID(x: string): ID {
      return x;
    }
    ```

    - subtyping constraint를 함께 쓰는 opaque type alias 를 만들때 타입설정은 반드시 super type positiona에 설정된 타입을 지니고 있어야 한다. 

    ```javascript
    opaque type Bad: string = number; // Error: number is not a subtype of string
    opaque type Good: {x: string} = {x: string, y: number};

    ```

13. Interface Types

    - classes flow type 의 경우에는 nominal typed 이다. 다시말해서 같은 속성과 같은 메서드가 있어도 서로 이름이 다른 classes type은 한곳에서 다른곳으로 사용이 불가하다.
    - 대신에. interface 로 기대 되는 class structure 를 선언할 수 있다.

    ```javascript
    interface Serializable {
      serialize(): string;
    }

    class Foo {
      serialize() { return '[Foo]'; }
    }

    class Bar {
      serialize() { return '[Bar]'; }
    }

    const foo: Serializable = new Foo(); // Works!
    const bar: Serializable = new Bar(); // Works!
    ```

    - implements 구문을 사용해서 flow 에게 이 인터페이스에 매칭되는 클래스를 원한다는 것을 말해줄수가 있다. 이것은 다른 사람이 클래스를 쉽게 변하게 만들지 못하도록 보호할 수 있다.
    - 멀티로 2개 이상도 설정가능

    ```javascript
    // @flow
    interface Serializable {
      serialize(): string;
    }

    class Foo implements Serializable {
      serialize() { return '[Foo]'; } // Works!
    }

    class Bar implements Serializable {
      // $ExpectError
      serialize() { return 42; } // Error!
    }
    ```

    - 인터페이스 syntax는 아래와 같다.

    ```javascript
    interface MyInterface {
      method(value: string): number;
      property: string;
      property?: string;

      [key: string]: number;
    }
    ```

    - 인터페이스도 다른 타입과 같이 generics를 사용할수 있고 프로퍼티에 read-only 와 write-only를 설정할 수있다.

      ```javascript
      interface MyInterface<A, B, C> {
        foo: A;
        bar: B;
        baz: C;
      }

      interface MyInterface {
        +covariant: number // read-only
        -contravariant: number; // write-only
      }

      interface Invariant { property: number }
      interface Contravariant { -writeOnly: number }

      function method1( value: Invariant) {
        value.property; // works
        value.property = 3.14 // works
      }
      funtion method2 ( value: contravariant) {
        value.property; // error
        value.writeOnly = 3.14 // works!!
      }
      ```

      - write-only 를 사용하면 덜 구체적인 타입도 pass를 진행한다.

      ```javascript
      interface Contravariant { -writeOnly: number }
      var numberOrString = Math.random() > 0.5? 42 : 'forty-two';

      var value2: Contravariant = { writeOnly: numberOrString };
      ```

  14. Generic Types

      - generic은 추상적으로 타입을 지정할수 있는 방법이다.
      - generic은 function , function types , classes , type aliases , interface에 사용될 수 있다.

      - function 사용

      ```javascript
      function identity<T>(value: T): T {
        return value;
      }

      <T>(param: T) => T
      ```
      - classes 사용

      ```javascript
      class Item<T> {
        //...
      }

      class Item<T> {
        prop: T;

        constructor(param: T) {
          this.prop = param;
        }

        method(): T {
          return this.prop
        }
      }
      ```
      - many generics as you need

      ```javascript
      function identity<One, Two, Three>(one: One, two: Two, three: Three) {
      
      }
      ```

      - generic 타입은 말 그대로 "unknown" type이다. 하지만 함수 안에서 구체적인 타입을 사용하게 된다면 에러를 뿜는다.

      ```javascript
      function logFoo<T>(obj: T): T {
        console.log(obj.foo); // error
        return obj
      }
      // 정확한 타입을 쓰기 위해 분기를 쳐야 한다.
      function logFoo<T>(obj: T): T {
      if (obj && obj.foo) {
        console.log(obj.foo); // Works.
      }
        return obj;
      }

      // 또는 타입을 지정한다.
      function logFoo<T: {foo: string}>(obj: T): T {
        console.log(obj.foo);
        return obj;
      }
      ```

      - flow경우 하나의 타입을 다른곳으로 전달할 때 original type을 잃어버린다. 그래서 구체적인 타입을 덜 구체적인 타입으로 전달할때 flow 는 "forget" 된다. 그것은 한때 구체적이였던 것이다.
    


      ```javascript
      function identity<T>(val: T): T{
        retur val
      }

      let foo: 'foo' = 'foo'; // works
      // identity 호출할때 구체적인 string이 전잘 됬지만 호출 이후에 original type을 잃어버림.. 그래서 작동할 수 있다.


      let bar: 'bar' = identity('bar'); // works
      ```

      - generic은 함수의 arguments 처럼 타입을 지정할 수 있다. 

      ```javascript
      type Item<T> = {
        prop: T,
      }

      let item: Item<string> {
        prop: "value"
      }
      ```

      - classes 버젼

      ```javascript
      class Item<T> {
        prop: T;
        constructor(param: T) {
          this.prop = param;
        }
      }

      let item: Item<number> = new Item(42); 
      let item: Item = new Item(42); // error;
      ```

      - type aliases 버젼

      ```javascript
      type Item<T> = {
        prop: T,
      }

      let item1: Item<number> = {prop: 42}
      let item2: Item = {prop: 42}  // error
      ```


      - interface 버젼

      ```javascript
      interface HasProp<T> {
        prop: T,
      }

      class Item {
        prop: string
      }
      (Item.prototype: HasProp<string>); // works
      (Item.prototype: HasProp) // error
      ```

      - default 값도 설정할 수있다.

      ```javascript
      type Item<T: number = 1> = {
        prop: T,
      };

      let foo: Item<> = { prop: 1 };
      let bar: Item<2> = { prop: 2 };
      ```


  15. Union types

      - 여러가지 타입을 받고 싶다면 Union types를 쓸수 있다.
      - syntax는 아래와 같다.

      ```javascript
      Type1 | Type2 | ... | TypeN
      ```

      - 여러 타입을 (union types)을 사용한다면 우리는 그들 타입중 하나만을 다뤄야 한다.

      ```javascript
      function toStringPrimitives(value: number | boolean | string): string { // Error!
        if (typeof value === 'number') {
          return String(value);
        } else if (typeof value === 'boolean') {
          return String(value);
        }
      }
      ```
      - 여러타입중 한가지 타입만 다루고 싶다면 다음과 같이 합니다.

      ```javascript
      function toStringPrimitives(value: number | boolean | string) {
        if (typeof value === 'number') {
          return value.toLocaleString([], { maximumSignificantDigits: 3 }); // Works!
        }
        // ...
      }
      ```

      - 만약 우리가 두가지의 object types들을 union type으로 생성한다면 flow 는 두 object type 에 들어있는 success property 를 base로 사용하여 알아낼수 있다.

      ```javascript
      type Success = {success: true, value: boolean}
      type Fail = {success: false, error: string}

      type Response = Success | Fail;

      function handleResponse(response: Response) {
        if( response.success ){
          var value: boolean = response.value // work
        } else {
          var error: boolean = response.error // work
        }
      }
      ```

      - union type을 위처럼 분리해서 사용하려면 정확한 타입과 함께 사용해야 한다. disjoint unions type은 각 object에서 한가지 프로퍼티를 구별로 사용한다. 따라서 구별 할 수 있는 프로퍼티가 없다면 에러를 뿜게 된다.
      이것은 flow가 object type을 더 확장 가능한 값으로 보기 때문이다.

      - 정 사용해야 겠다면 아래처럼

      ```javascript
      type Success = {| success: true, value: boolean |};
      type Failed  = {| error: true, message: string |};

      type Response = Success | Failed;

      function handleResponse(response: Response) {
        if (response.success) {
          var value: boolean = response.value;
        } else {
          var message: string = response.message;
        }
      }
      ```

  16. Intersection Types

      - & 로 연결된 타입들 이것들은 모두를 만족해야 한다.

      ```javascript
      type A = { a: number };
      type B = { b: boolean };
      type C = { c: string };

      function method(value: A & B & C) {}

      // ExpectError
      method({ a: 1 }); // Error!
      // ExpectError
      method({ a: 1, b: true }); // Error!
      method({ a: 1, b: true, c: 'three' }); // Works!

      ```

  17. Typeof Types

      - 자바스크립트의 typeof 연산자에서 리턴되는 값으로 타입을 정의한다.

      ```javascript
      let num1 = 42;
      let num2: typeof num1 = 3.14;     // Works!
      // $ExpectError
      let num3: typeof num1 = 'world';  // Error!
      ```

  18. Type Casting Expressions

      - 함수나 변수를 선언하지 않고 타입을 지정하고 싶을 때가 있을 것입니다. 이때 flow는 inline type cast expression 을 사용할 수 있습니다.

      ```javascript
      (value: Type)

      let val = (value: Type)
      let obj = { prop: (value: Type)}
      let arr = ([(value: Type),(value: Type)]: Array<Type>)
      ```
      - 선언 뿐만 아니라 할당도 할 수 있다.

      ```javascript
      let value = 42;

      (value: 42);     // Works!
      (value: number); // Works!

      // 42 할당 및 type number
      let newValue = (value: number); 

      // $ExpectError
      (newValue: 42);     // Error!
      (newValue: number); // Works!
      ```

      - 다음 아래와 같이 value 를 any로 캐스팅 하면, 너는 원하는 어떤것이든 타입을 캐스팅할수 있다. 다만 이건 굉장이 안전하지 않다. 

      ```javascript
      let newValue = ((value: any): string);
      ```

      - 하지만 타입을 지정하기 어렵고 불가능할때에는 result에 따라서 타입이 정해지길 바랄수 있다. 예를 들어보자

      ```javascript
      // 얕은 복사
      function cloneObject(obj) {
        const clone = {};

        Object.kets(obj).forEach(key => {
          clone[key] = obj[key];
        })

        // return clone;
        // 이렇게 사용될 수 있다.
        return ((clone: any): typeof obj);
      }
      ```

      - 만약 우리가 cloneObject 메소드를 실행하기전에 들어오는 인자의 타입을 먼저 정한다면 아래처럼 작성할 것이다.

      ```javascript
      function cloneObject(obj: { [key: string]: mixed}){}
      ```

      - 하지만 위 코드는 문제가 있다. 우리의 **typeof obj** annotation 또한 새로운 annotation을 갖기에 전체 목적을 파괴시킨다.

      - 그래서 우리는 function 안에 사용할 타입에 대해서 assertion 해야한다.

      ```javascript
      function cloneObject(obj) {
        (obj: { [key: string]: mixed});
        //...

        return ((clone: any): typeof obj);
      }
      ```

      - 실질적인 해결 방법은 아래와 같다.

      ```javascript
      function cloneObject<T: { [key: string]: mixed }> (obj: T): $Shape<T> {
        //...
      }
      ```

   20. Utility Types

      - flow 는 flow 자체내에 utility types 들을 제공한다.

      홈페이지 참고 : [https://flow.org/en/docs/types/utilities/](https://flow.org/en/docs/types/utilities/)