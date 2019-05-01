---
title: hello-MobX
date: "2018-12-31T10:00:03.284Z"
---

# Intro

* MobX 의 특징을 알아보고 공부하자.
* MobX 의 공홈을 독파해보자.

## Concepts

### State

* state 란 어플리케이션을 이끄는 데이터이다.

### Derivations ( 파생 )

* state 로 부터 파생되는 값들이다. 다양한 형태로 존재할 수 있다.
* 파생된 데이터는 todo 리스트에서 남아있는 todo item 갯수라고 할 수 있다.
* MobX 는 구별되는 두가지의 파생 종류가 있다. 하나는 Computed values 또 다른 하나는 Reactions 이다.
  * Computed values 는 순수 함수를 이용한 observable state 로 부터 파생된 새로운 값이다. 따라서 side effect 가 없어야 한다.
  * 만약 지금의 state 를 베이스로 새로운 값을 만들길 원한다면 computed 를 사용하면 된다.
  * 모든 Computed value 는 순수해야하고 state 를 변화 시키면 안된다.
  * Reactions 는 state 변화로 인해 자동적으로 발생될 필요가 있는 sied effect 이다. 여기서 side effect 는 호출된 함수 밖에 있는 다른 값들이나 어플리케이션의 상태를 변경되는 것을 뜻한다.
  * Reactions 은 명령형 프로그래밍과 reactive 프로그래밍 사이를 연결해주는 것으로 필요로 한다.
* action 은 state 를 변화시키는 한 코드이다. 마치 스프레드 시트에 새로운 값을 입력하는 user 와 같은 것이다.
* 만약 strict 모드를 사용한다면 액션 밖에서 state 를 강제로 바꾸는 일을 할 수 없게 된다.

#### imperative programing

* imperative 는 명령형 프로그래밍으로 쉽게는 순차적으로 명령을 하듯이 프로그래밍 하는것을 뜻한다. 컴퓨터가 수행할 명령들을 순서대로 적어놓아서 내가 원하는 결과를 얻는것이다. 즉, how 어떻게 할것인가에 포커싱을 맞춘다. 반대로는 선언적인 프로그래밍이 있다. 선언적 프로그래밍에선 데이터에 집중하기 보단 절차에 집중을 해서 만들어 낸다. 즉, what 무엇을 할 것인가에 초점을 맞춘다.

* 데이터를 정의하고 그것의 변화 과정을 프로그래밍 할것이냐 행위를 정의하고 거기에 데이터를 집어 넣을 것이냐 방법의 차이. 즉, 생각의 주체를 데이터에 두느냐 function 에 두느냐의 차이.

#### reactive programing

* async 상황에서 이 async 데이터를 어떻게 처리할것이냐 , 아이디어는 stream 라는것으로 연결하고 그 stream 에 데이터를 흘려 보내자. 라는 생각이 reactive 프로그래밍이다. 함수의 동작은 async 하게 움직이지만 코드로는 순서대로.. async 한 작업을 functional 하게 처리하는 아이디어.

* 어떤 데이터를 생산해내는 함수가 있을거고 그 데이터를 받아서 처리하는 컨슈머가 있을것이다. 그것을 서로 스트림으로 연결시키고 데이터를 만드는애를 observable 데이터를 소비하는 애를 subscriber 라고 한다.
  observable 부터 subscriber 까지 데이터가 흘러가는데 흘러가는 사이에 operator 라는 것들을 통해 데이터를 변형하거나 제작할수 있다.

* reactive 프로그래밍이란 데이터의 흐름과 그 변화를 알려주는 통지로 바라보는 패러다임이다. 예를 들면 a = b + c 에서 덧셈의 결과를 a 에 할당하지만 일반적인 패러다임은 b 나 c 가 변하여도 a 값은 변경되지 않는다. 하지만 반응형 프로그래밍에서는 a 가 자동으로 변경된다. ( ex. 엑셀의 셀처럼 ) 즉, 프로그래밍 언어에서 정적 또는 동적 데이터 흐름을 쉽게 표현할 수 있어야 하며 변경 사항을 데이터 흐름을 통해 자동으로 전파한다는 것을 의미

* 공식 문서에서의 imperative 란 반응형으로 이뤄진 코드 생태계의 외부 code 생태계라고 볼수있다. 이 외부 code 생태계는 반응형의 생태계의 side effect 정도 되겠다.

### Principles

```
Action -> State -> Views
```

* MobX 는 action 이 상태를 변경하고 그에 따른 views 를 업데이트하는 단방향 데이터 흐름을 지원합니다.
* 모든 파생들은 자동적으로 state 가 변할때마다 업데이트 된다. 결과적으로 그 중간값들을 관찰할 수 없다.
* 모든 파생들은 기본 동기적으로 업데이트 된다. 이 의미는 actions 은 state 가 변화된 후 computed 된 value 를 안전하게 확인할 수 있다.
* Computed value 는 update 가 게으르게 된다. 실제로 사용되지 않는 Computed value 는 side effect 위해 필요로 하지 않는 이상 업데이트 되지 않는다. 만약 view 가 더이상 사용하지 않는다면 가비지 컬렉터가 수거해 간다.
* 모든 Computed 된 value 들은 pure 하다. 이것들은 state 변화를 지원하지 않는다.

### Illustration

```javascript
import { observable, autorun } from 'mobx'

var todoStore = observable({
  /* some observable state : 상태 값*/
  todos: [],

  /* a derived value : 파생된 값 */
  get completedCount() {
    return this.todos.filter(todo => todo.completed).length
  },
})

/* a function that observes the state : 상태를 관찰한다. */
autorun(function() {
  console.log(
    'Completed %d of %d items',
    todoStore.completedCount,
    todoStore.todos.length
  )
})

/* ..and some actions that modify the state : 상태를 수정하는 액션을 취한다. */
todoStore.todos[0] = {
  title: 'Take a walk',
  completed: false,
}
// -> synchronously prints 'Completed 0 of 1 items'

todoStore.todos[0].completed = true
// -> synchronously prints 'Completed 1 of 1 items'
```

## observable

```javascript
observable(value)
@observable classProperty = value
```

* Observable 이라는건 "MobX! 이 값을 추적해줘, 그러면 observer 들을 업데이트 시킬수 있다."
* RxJs 에서도 Observable 을 사용하고 있는데 여기서 느낌을 말하자면..[참조글](https://netbasal.com/javascript-observables-under-the-hood-2423f760584)
* Observable values 의 값으로는 js 의 원시타입, 참조, 일반객체 , 클래스 인스턴스, array 그리고 map 이 될수 있다.
* 다음 변환 규칙이 적용되지만 *modifiers*를 이용해서 세부 조정을 할 수 있다. 여기서 _modifiers_ 란 observable 프로퍼티들의 동작방식을 정의 하는데 사용되는 부분이다. ( ex. observable.deep, observable.ref)
  1. value 가 ES6 의 Map : 새로운 Observable Map 이 리턴된다. 이것은 구체적인 엔트리의 변화에 대한 반응을 하고 싶지 않을때 유용하다. 또한 엔트리 항목의 추가 제거에도 반응하고 싶지 않을때 유용하다.
  2. value 가 ES6 의 Set : 새로운 Observable Set 이 리턴된다.
  3. value 가 array : 새로운 Observable Array 가 리턴된다.
  4. value 가 prototype 이 없는 객체 : 모든 그 객체의 프로퍼티들을 observable 로 만들 수 있다.
  5. value 가 prototype 을 지닌 object 라면 (원시타입 및 함수) `observable`은 에러를 던질 것이다. 그러한 값에 대한 독립형 관찰 가능 참조를 작성하려는 경우 Boxed Observable 를 사용해야 한다. MobX 는 prototype 를 지닌 object(function 같은) 들을 자동으로 observable 한 객체로 만들어 주지 않는다. 이 객체는 생성자 함수에서 생성자에서 수행하도록 고려되어져야 한다. extendObservable 을 사용하거나 클래스 정의에서 @observable / decorate 를 대신 사용해라.

- 여기서 observable reference 란 객체를 observable 로 바꿀 필요가 없을때 사용하는 것이다. 전형적인 케이스들은 immutable object 들 또는 내가 아닌 외부 라이브러리에 의해 관리되는 object 들이다. 예를 들면 JSX elements, DOM elements, History, window 같은 네이티브 object 들이다. 이런 객체들에 대해서는 observable 로 바꾸지 않고 단지 reference 만 저장 및 추적하면 된다.

```javascript
class Message {
  @observable message = 'Hello world'

  // fictional example, if author is immutable, we just need to store a reference and shouldn't turn it into a mutable, observable object
  // author가 불변의 값이라면, 참조 값만 저장하고 변경가능하고 관찰 가능한 객체로 바꾸면 안된다.
  @observable.ref author = null
}
```

* 기본적으로 데이터 구조를 observable 하게 만든다는 것은 infective(감염적)이다. 이 의미는 observable 은 자동적으로 그 데이터 구조안에 포함된 어떤 값이라도 자동으로 적용한다는 의미이다. 또는 나중에 포함될 어느 값 또한 적용된다. 이 행위는 modifiers 에 의해 변화될수 있다.

## @observable

```javascript
import { observable, computed } from 'mobx'

class OrderLine {
  @observable price = 0
  @observable amount = 1

  @computed
  get total() {
    return this.price * this.amount
  }
}
```

* ES7 에서 사용되는 Decorator 는 클래스 프로퍼티들을 observable 하게 만들어준다.
* @observable 은 인스턴스 필드나 getter 프로퍼티에 사용될 수 있다.
* 이렇게하면 개체의 어떤 부분을 관찰 할 수 있는지에 대한 세부적인 제어가 가능합니다.

## objects

```javascript
observable.object(props, decorators?, options?)

import {observable, autorun, action} from "mobx";

var person = observable({
    // observable properties:
    name: "John",
    age: 42,
    showAge: false,

    // computed property:
    get labelText() {
        return this.showAge ? `${this.name} (age: ${this.age})` : this.name;
    },

    setAge(age) {
        this.age = age;
    }
}, {
  // decorators
    setAge: action
});

// object properties don't expose an 'observe' method,
// but don't worry, 'mobx.autorun' is even more powerful
autorun(() => console.log(person.labelText));

person.name = "Dave";
// prints: 'Dave'

person.setAge(21);
// etc
```

* 만약 plain 한 객체가 observable 에 전달된다면 안에있는 모든 프로퍼티들은 복제본에 복사되어 관측할수 있게 된다. ( 여기서 plain 한 객체라 하면 생성자 함수를 사용하여 만들지는 않았고 해당객체의 프로토타입(**proto**)이 `Object`을 가지거나 프로토타입 프로퍼티가 전혀 없는경우이다. )
* observable 은 디폴트로 재귀적으로 적용이 됩니다. 그래서 만약 값들중 하나가 object 또는 array 라면 그 값들 또한 observable 하게 적용된다.
* 오직 plain object 만 observable 하게 만들 수 있다. non-plain object 의 경우에는 생성자에서 observable 프로퍼티를 초기화 해줘야 한다. @observable 또는 extendObservable 함수를 이용할 수 있다.
* getter 프로퍼티는 자동적으로 @computed 처럼 파생 프로퍼티로 전환된다.
* observable 은 재귀적으로 전체 object 그래프에 적용됩니다. 인스턴스화된 것과 나중에 새롭게 observable 프로퍼티들에 할당될 새로운 값(object 객체)들에 대해서도 적용이 된다.
* Observable 은 non-plain objects 를 재귀하지 않는다. 즉, 클래스로 인스턴스를 만들어서 observable 한것은 재귀 하지 않는다.
* 속성 값의 자동 변환을 사용하지 않으려면 {deep : false}를 3 번째 인수로 전달하십시오.
* 이 객체에 친숙한 디버그 이름을 할당하려면 {name : "my object"}를 전달하십시오.

```javascript
// plain object
function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false
  // 지정된 __proto__  타입을 반환한다.
  // __proto__ : 나를 누가 만들었는가.
  // prototype : 나를 이용해서 만들면 해당 prototype을 기반으로 만든다.
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}
```

## arrays

```javascript
observable.array(values?)

var todos = observable([
    { title: "Spoil tea", completed: true },
    { title: "Make coffee", completed: false }
]);

autorun(() => {
    console.log("Remaining:", todos
        .filter(todo => !todo.completed)
        .map(todo => todo.title)
        .join(", ")
    );
});
```

* observable 에 array 를 넣어도 똑같다.
* 이 구문도 재귀적으로 잘 움직이고, 모든 값 ( 미래에 들어올 값 ) 또한 observable 할 수 있다.
* array 의 빌트인 함수들 뿐만 아니라 observable array 는 다음과 같은 유용한 기능을 사용할 수 있다.
  * intercept(interceptor), observe(listener, fireImmediately? = false), clear(), replace(newItems), find(predicate: (item, index, array) => boolean, thisArg?), findIndex(predicate: (item, index, array) => boolean, thisArg?) , remove(value)

## maps

## boxed values

JavaScript 의 모든 원시객체 값은 변경 가능하지(immutable) 않으므로 정의에 따라 관찰 할 수 없다. 일반적으로 MobX 는 관찰 가능한 값을 포함하는 속성(property)을 만들 수 있기 때문에 괜찮다.
드문 경우지만 "원시객체를"를 observable 로 만드는 것이 편리 할 수 있을때가 있다. 이러한 경우에는 이러한 프리미티브를 관리하는 관찰 가능한 상자를 만들 수 있다.

### example

```javascript
import { observable } from 'mobx'

const cityName = observable.box('Vienna')

console.log(cityName.get())
// prints 'Vienna'

cityName.observe(function(change) {
  console.log(change.oldValue, '->', change.newValue)
})

cityName.set('Amsterdam')
// prints 'Vienna -> Amsterdam'
```

## decorators

## (@)Computed

```javascript
class OrderLine {
  @observable price = 0
  @observable amount = 1

  constructor(price) {
    this.price = price
  }

  @computed
  get total() {
    return this.price * this.amount
  }
}

// or

var upperCaseName = computed(() => name.get().toUpperCase())
var disposer = upperCaseName.observe(change => console.log(change.newValue))
```

* Computed values 는 다른 computed value 또는 지금 존재하는 state 로 부터 파생된 값이다.
* Computed 는 reaction 들이 일어나고 나서 계산이 수행 된다.
* 이 값은 실제로 수정가능한 state 를 최소화 시킬수 있는 방법중 하나이다.
* computed 와 autorun 는 반응적으로 실행되는 표현식(expressions)이지만, `computed` 는 다른 observer 에 의해 사용되는 값을 생성할때 사용되고 `autorun` 은 새로운 값을 만들어 내지 않는다 그 대신에 어떠한 효과를 이루기 위해 사용될수 있다. 예를들면 로깅이나 네트워크 요청 같은 것들 말이다.
* Compute values 이전 계산에서 사용 된 데이터가 변경되지 않으면 계산 된 속성이 다시 실행되지 않는다. 뿐만 아니라 다른 computed property 또는 reaction 에서 사용되지 않으면 계산되지 않는다.
* Computed values 는 사용되지 않으면 자동으로 가비지 컬렉터가 수거해 간다. 이는 autorun 과의 차이점 중에 하나이다. ( autorun 의 경우에는 그들 스스로가 dispose 해주어야 한다. )
* 만약 항상 computed value 가 계산되길 원한다면 observe 또는 keepAlive 를 이용해서 사용할 수 있다.
* computed 프로퍼티들은 `enumerable` 하지 않는다. 여기서 `enumerable` 하다는 뜻은 `for..in` 루프로 프로퍼티들을 순회 할 수 있다는 뜻이다. 또한 이 computed 프로퍼티들은 상속 된 값으로 덮어 씌여지지 않는다.
* computed value 를 위한 setter 도 정의할 수 있다. 이 setter 는 computed value 를 직접 변경하진 않지만 역 파생으로 사용될 수 있다. 예를 들면, 아래에서 `orderLine.total = 10` 이라고 셋팅하면 total 값이 직접적으로 바뀌는 것이 아닌 price 값이 변경되면서 다시 get 의 total 값이 반응하게 된다.

```javascript
const orderLine = observable.object({
  price: 0,
  amount: 1,
  get total() {
    return this.price * this.amount
  },
  set total(total) {
    this.price = total / this.amount // infer price from total
  },
})
```

> 주의 : @computed get 메서드 내용에 일반 함수를 호출하면 되지만 @action 을 넣으면 computed 가 반응을 하지 않는다.

```javascript
// 동작
@computed  
get total() {
  return this.something()
}

something() {}

// 동작 안함
@computed  
get total() {
  return this.something()
}

@action
something() {}
```

### autorun

```javascript
const disposer = autorun(reaction => {
  /* do some stuff */
})
disposer()

// or

autorun(reaction => {
  /* do some stuff */
  reaction.dispose()
})
```

* autorun 은 반응하는 함수를 만들 경우 사용된다. autorun 으로 해당 함수를 감싼다. 이 함수는 스스로가 observer 들을 가지지 않는다.
* autorun 은 대게 반응형 코드에서 명령형 코드로 이어짐이 필요할 경우 사용된다. 예를 들면 로깅이나 ui update code 에서 사용된다.
* autorun 을 사용할때 제공하는 함수(감싸이는 함수)는 항상 그 즉시 한번은 실행된다. 그리고 이후에 그것의 디펜던시들이 변화가 일어날때마다 한버씩 실행된다.
* 대조적으로 computed 로 생성되는 함수는 오직 관찰자가 그 값을 가질때 재 평가 된다.
* autorun 은 자동적으로 실행되야 할 함수를 지닐때 하지만 새로운 값을 결과로 가지지 않을때 사용되고 computed 는 그 외에 사용된다고 보면 된다.
* autorun 은 부수적인 효과를 시작하는 것이지 새로운 값을 만들어 내지 않는다.
* 만약 첫번째 인자로 문자열을 autorun 에 넘긴다면 그것은 디버그 네임으로 사용될 수 있다.
* autorun 의 리턴 값은 해당 autorun 을 해지하는 disposer function 이다. 이 함수는 더이상 autorun 이 필요 없어질때 사용된다.
* 반응(reaction) 그 자체는 autorun 에 제공하는 함수에 유일한 인수로 전달되며 이 인수를 autorun 함수 안에서 다룰수 있다. 이 의미는 두가지 방법으로 더이상 autorun 이 필요 없을때 dispose 할 수 있다는것을 뜻한다.
* observer decorator/function 과 같이, autoron 은 오직 제공된 함수의 실행 동안 사용되는 데이터를 관찰 할수 있다.

## when

```javascript
when(predicate: () => boolean, effect?: () => void, options?)
```

* when 은 주어진 `predicate` return 값이 true 일때 까지 관찰하고 실행한다. predicate 가 true 값이 리턴되면 주어진 `effect` 값은 실행되고 자동으로 disposed 가 실행된다.
* 이 함수는 실행되기 전에 미리 취소를 할 수 있도록 disposer 를 리턴한다.
* 만약 `effect` 함수를 제공하지 않으면 when 은 `Promise`가 리턴된다. 이것은 async / await 랑 함께 쓰기 나이스하다.

```javascript
async function() {
    await when(() => that.isVisible)
    // etc..
}
```

## reaction

```javascript
reaction(() => data, (data, reaction) => { sideEffect }, options?)
```

* 관측대상을 추적할수 있는 컨트롤을 보다 정밀제어가 가능한 autorun 의 변형이다.
* 2 개의 function 을 인자로 받는다. 하나는 data function 으로 추적당하고 data 를 리턴한다. 이 리턴된 값은 두번째 인자로 넘겨지는 것으로 사용된다.
* autorun 과는 달리 side effect 는 생성과 동시에 실행되지 않고 첫번째 인자인 data 표현식이 처음으로 새로운 값으로 리턴되었을때 실행된다. side effect 가 실행되는 동안 side effect 내에서 접근 가능한 observables 들은 tracked 되지 않는다.
* reaction 의 return 값으로는 disposer function 이 리턴된다.
* 두번째 인자로 넘겨지는 함수는 effect function 은 2 개의 인자를 받는다. 첫번째 인자는 data function 에서 리턴되는 값이고, 두번째 인자는 현재 반응하는 reaction 이다. 이것은 실행되는 동안에 이 reaction 을 dispose 하는 용도로 사용될 수 있다.
* side effect 는 data expression 에서 accessed 한 데이터에만 반응한다. 이 data 표현식은 사실 effect 에서 사용되는 data 보다 적을 수 있다. 또한 side effect 는 오직 data expression 에 의해 변경되는 data 가 리턴되었을때 반응한다. 다시말해, reaction 은 side effect 에서 필요한것을 생산하도록 요구하는 것이다.

## (@)observer

* @observer 라고 데코레이터를 사용하는 것은 MobX 에게 "이 컴포넌트의 rendering 은 observables 관련으로 부터 파생될수 있다." 말하는 것과 같다.
* observer function / decorator 는 react components 를 반응형 컴포넌트로 변환시킬수 있다.
* 이것은 컴포넌트의 렌더링에 사용되는 데이터가 변경되면 컴포넌트를 강제로 re-rendering 을 하게 만들기 위해서 render 함수를 `mobx.autorun` 으로 감싼다.
* 'mobx-react' 패키지의 한 부분으로 이용가능하다.

```javascript
import { observer } from 'mobx-react'

var timerData = observable({
  secondsPassed: 0,
})

setInterval(() => {
  timerData.secondsPassed++
}, 1000)

@observer
class Timer extends React.Component {
  render() {
    return <span>Seconds passed: {this.props.timerData.secondsPassed} </span>
  }
}

ReactDOM.render(<Timer timerData={timerData} />, document.body)
```

Tip: `observer`가 다른 데코레이터나 higher-order-compoenets 와 함께 이용할 필요가 있을땐, `observer`가 가장 먼저 적용되도록 해야한다. 그렇지 않으면 작동안될수 있다.

`observer` 를 observer(class Timer{...}) 로도 이용이 가능하다.

### dereference values inside your components

> dereference 라는건 주소를 참조하고 있는 변수(reference)를 보고 해당 주소로 찾아가서 값을 보는 것을 말한다. c 언어로 예를 들자면 & 기호가 reference operator 고 \* 기호가 dereference operator 라고 보면 되겠다.

Mobx 는 많은 것을 할 수있지만, 원시타입을 observable 로 만들 수 없다.(비록 boxed obserbables 로 감싸면 observable 로 만들 수 있다.) 그렇기 때문에 값들을 observable 하고 있는게 아니라 객체의 프로퍼티들을 observable 하고 있다는 것이다. 이것이 의미하는건 `@observer`는 사실 역참조한 값에 반응하는것 이다.
좀 더 쉽게 말하면 `const person = {name : 'merlin'}` person 이라는 객체가 있을 때 name 이 observable 이라면 'merlin'이란 값이 바뀌는거에 대해서 포커스를 두는 것이 아니라 `person.name` 의 변화에 포커스를 두고 있다는 사실이다.
이 때 아마도 person.name 의 `defineProperty` 으로 `get`과 `set` 메서드를 설정해 두어서 그런게 아닐까 싶다.
그래서 위 예제에서 Timer components 는 다음과같이 초기화 된 경우 반응하지 않는다.

```javascript
React.render(<Timer timerData={timerData.secondsPassed} />, document.body)
```

그래서 observer 하고 있는 컴포넌트 안에서 역 참조한 값을 접근해야 한다.

## Understanding what MobX reacts to

* MobX 는 observable 프로퍼티에 반응한다. 이 프로퍼티를 추적하는 함수의 실행을 하는동안 읽어짐으로써 반응한다.
* 'reading' 이라 함은 object 의 프로퍼티에 접근하는 것이다. ( ex. user.name or user['name'])
* 'trackable functions' 라는건 computed, observer component 의 render 메서드와 첫번째 인자로 when, reaction, 그리고 autorun 을 전달 받는 함수들이다.
* 'during'의 의미는 함수 실행동안에 읽혀지는 오직 observables 들만 추적한다는것을 뜻한다. 이들의 값들은 추적하는 함수에 의해 직접적으로 또는 간접적으로 사용되는지는 중요하지 않다.
* MobX 는 이럴때 반응하지 않는다.
  * observables 로 부터 얻은 값이지만 tracked function 밖에 있는 값.
  * 비동기적으로 호출되는 코드 블럭에서 읽혀진 Observables 들
* MobX 는 값이 아닌 프로퍼티의 주소를 추적한다. 즉, 주소가 바뀌면 변화를 감지한다.

### Example

```javascript
let message = observable({
  title: 'Foo',
  author: {
    name: 'Michel',
  },
  likes: ['John', 'Sara'],
})
```

* tracked function 내의 역참조, .title 프로퍼티가 autorun 에 의해 역참조 당했다. 그 이후에 변화가 생기면 이 변화는 감지가 된다. tracked function 안에 trace() 함수를 호출함으로서 MobX 는 추적한다는걸 알수 있다.

```javascript
autorun(() => {
  console.log(message.title)
})
message.title = 'Bar'
// [mobx.trace] (...)
```

* non-observable 의 참조값은 변해도 반응하지 않는다. 아래 예제에서 message 는 변했다. 그러나 message 는 observable 한게 아니다 단지 observable 한 객체를 가리키는 변수일 뿐이다. 변수 자체는 observable 하지 않는다.

```javascript
autorun(() => {
  console.log(message.title)
})
message = observable({ title: 'Bar' })
```

* tracked function 밖에서의 역참조(주소가 아닌 값을 지닌 프로퍼티)는 반응하지 않는다. 아래 예제에서 title 은 observable 한게 아니다. 그래서 꼭 tracked function 안쪽에서 역참조를 진행해야 한다.

```javascript
var title = message.title
autorun(() => {
  console.log(title)
})
message.title = 'Bar'
```

* tracked function 안에서의 역참조는 잘 반응 한다. author 와 author.name 은 모두 점으로 참조하고있습니다. 따라서 MobX 가 이 참조를 추적할 수 있습니다.

```javascript
autorun(() => {
  console.log(message.author.name)
})
message.author.name = 'Sara'
message.author = { name: 'John' }
```

* observable 한 객체를 tracking 없이 로컬 변수에 저장해서 사용하기. 아래 예제에서는 첫번째 변화에 대해선 잘 감지 할것이다. 그 이유는 message.author 가 주소를 넘기고 로컬 변수인 author 는 그 주소를 받아서 사용하기 때문에 같은 객체를 가리킨다. 그래서 위와 다르게 autorun 에서 반응을 할테지만 두번째 변화에 대해서는 감지를 하지 않는다. 그 이유는 autorun 에 의해 추적되는 author 는 message.author 가 가리키는 또다른 변수이지 message.author 를 추적하진 않는다. autorun 에 있는 author 는 아직 예전 객체를 가리키고 있기 때문이다.

```javascript
const author = message.author
autorun(() => {
  console.log(author.name)
})
message.author.name = 'Sara' // 1
message.author = { name: 'John' } // 2
```

* 아래 예제의 경우에는 업데이트 된 title 을 프린트 하지 않는다. 왜냐하면 autorun 안에서 title 이 사용되지 않았기 때문이다. autorun 은 오직 message 에만 의존하게 된다. 또한 message 는 observable 이 아니다. 그저 상수일 뿐이다. autorun 에서 title 은 사용되지 않았기 때문에 autorun 이랑 관련이 없는 것이다.

```javascript
const message = observable({ title: 'hello' })

autorun(() => {
  console.log(message)
})

// Won't trigger a re-run
message.title = 'Hello world'

// 해결책들

autorun(() => {
  console.log(message.title) // clearly, the `.title` observable is used
})

autorun(() => {
  console.log(mobx.toJS(message)) // toJS creates a deep clone, and thus will read the message
})

autorun(() => {
  console.log({ ...message }) // creates a shallow clone, also using `.title` in the process
})

autorun(() => {
  console.log(JSON.stringify(message)) // also reads the entire structure
})
```

* tracked function 에서 bound 를 넘치는 접근을 했을때는 반응하지 않는다. 예를 들면 배열에서는 index < length 조건이 되야 한다.

* observable 을 사용하지만 그것의 프로퍼티 접근이 전혀 없을때 반응하지 않는다.

```javascript
autorun(() => {
  message.likes
})
message.likes.push('Jennifer')
```

* MobX 4 에서는 non-observable 한 프로퍼티 및 아직 존재하지 않은 observable object 프로퍼티 접근이 허용되지 않았지만 MobX 5 에선 반응한다.

* MobX only tracks synchronously accessed data 이 말은 아래 상황에서 확인할 수 있다. 비록 author.name 이 autorun 에 전달되지 않지만 MobX 는 upperCaseAuthorName 에서 발생되는 역참조를 추적할 수 있다. 왜냐하면 그 발생은 autorun 이 실행되는 동안('during') 발생되기 때문이다.

```javascript
function upperCaseAuthorName(author) {
  const baseName = author.name
  return baseName.toUpperCase()
}
autorun(() => {
  console.log(upperCaseAuthorName(message.author))
})
message.author.name = 'Chesterton'
```

* 반면 아래 상황은 반응하지 않는다. autorun 이 실행되는 동안 어디에서도 accessed 되는 observable 을 만날수가 없다.

```javascript
autorun(() => {
  setTimeout(() => console.log(message.likes.join(', ')), 10)
})
message.likes.push('Jennifer')
```

* MobX 는 오직 observer 컴포넌트의 render 에 직접적으로 접근되는 data 만 추적합니다.
  아래 상황에서 <div> 는 사실 MyComponent 에 의해 렌더링 되는 것이 아닌 SomeContainer 에 의해 렌더링 됩니다. 따라서 SomeContainer 의 title 이 정확하게 새로운 message.title 에 반응하는지 확인하기 위해서 SomeContainer 는 observer 이어야 한다.

```javascript
const MyComponent = observer(({ message }) => (
  <SomeContainer title={() => <div>{message.title}</div>} />
))

message.title = 'Bar'
```

* 만약 SomeContainer 가 외부 라이브러리라면 div 를 우리의 상태가 없는 observer 에 기반한 컴포넌트를 하나 더 만들어야 한다. 이게 싫다면 대안책으로 'mobx-react' 에 내장된 <Observer> 컴포넌트를 이용하자.

```javascript
const MyComponent = ({ message }) => (
  <SomeContainer
    title={() => <Observer>{() => <div>{message.title}</div>}</Observer>}
  />
)

message.title = 'Bar'
```

* 클래스의 로컬 필드에 observable 이 캐싱되는 것을 피하자. 아래 상황에서 author 의 name 의 변화에는 잘 반응 하지만 message 의 author 의 변화에는 반응하지 못한다. 이것은 render() 메서드 밖에서 역참조를 진행 했기 때문이다. 오직 observer 컴포넌트는 render() 메서드가 tracked function 이다. 그래서 간단한 해결책은 render() 메서드 안에서 역참조 하는 것이고 또는 컴포넌트 인스턴스 내에 computed 프로퍼티를 이용해서
  this.author 를 update 시키면 render 에서 참조하는 값은 예전 주소의 값이므로 변경을 감지하여 반응하게 된다.

```javascript
@observer
class MyComponent extends React.component {
  author
  constructor(props) {
    super(props)
    this.author = props.message.author
  }

  render() {
    return <div>{this.author.name}</div>
  }
}

// computed 해결책
@observer
class MyComponent extends React.component {
  @computed
  get author() {
    return this.props.message.author
  }
}
```

* 아래와 같은 상황에서 `<Author author={ message.author.name} />` 와 같이 호출한다면, `Message`는 역참조 컴포넌트가 되어서 message.author.name 이 변화가 생기면 Message 는 re-render 를 할것이다. 그럼에도 불구하고 Author 는 새로운 값을 받았기에 re-render 를 진행할것이다. 이러면 퍼포먼스 저하가 나온다. 따라서 가능한한 늦게 역참조를 진행하는 것이 옳다.

* 만약에 likes 데이터가 문자열이 아닌 객체들로 구성되어있다면, (ex. [{}, {}, {},...]) 그리고 그 객체들이 `Like` 컴포넌트에서 렌더링이 된다고 했을때 `Likes` 컴포넌트는 특정 like 객체의 변화에 re-render 를 하지 않는다.

```javascript
const Message = observer(({ message }) => (
  <div>
    {message.title}
    <Author author={message.author} />
    <Likes likes={message.likes} />
  </div>
))

const Author = observer(({ author }) => <span>{author.name}</span>)

const Likes = observer(({ likes }) => (
  <ul>{likes.map(like => <li>{like}</li>)}</ul>
))
```

| 변화                              | re-rendering component                                           |
| --------------------------------- | ---------------------------------------------------------------- |
| message.title = "Bar"             | Message                                                          |
| message.author.name = "Susan"     | Author (.author is dereferenced in Message, but didn't change)\* |
| message.author = { name: "Susan"} | Message, Author                                                  |
| message.likes[0] = "Michel"       | Likes                                                            |

## action

```javascript
action(fn)
action(name, fn)
@action classMethod() {}
@action(name) classMethod () {}
@action boundClassMethod = (args) => { body }
@action(name) boundClassMethod = (args) => { body }
@action.bound classMethod() {}
```

* Action 은 state 를 변화시키는 모든것들이다.
* Action 은 인자로 함수를 받아서 같은 함수이지만 `transaction`, `untracked`, `allowStateChagnes`. 로 감싸진 함수를 반환한다. 사실 transaction 은 자동으로 적용된다.
* action 은 변화들을 한다발로 묶는다. 그리고나서 computed value 와 reaction 들에게 가장 마지막 action 이 끝난 후에 통지한다. 이렇게 하면 action 이 끝날때 까지 action 실행 중에 나머지 application 은 중간값 또는 아직 끝나지 않은 값은 확인할 수가 없다.
* observable 을 변경하는 모든 함수 또는 side effects 를 만드는 함수에는 (@)action 을 사용하는게 좋습니다.
* @action 데코레이터를 사용하는 setter 는 지원하지 않습니다. 하지만 computed 프로퍼티의 setter 들은 자동으로 action 이 된다.
* MobX config 에서 state 변화를 반드시 action 을 사용하도록 config 한다면 action 은 필수 적으로 사용되어져야 합니다. (enforceActions 옵션)
* action decoreator / function 들은 javascript 의 기본적인 binding 룰을 따르게 됩니다. 그러나 `action.bound` 는 자동으로 action 에 대상 객체에 대한 this 를 bind 한다. action 과 다르게 (@)action.bound 는 name 파라미터를 받지 않는다. 대신 action.bound 를 적용하는 프로퍼티 이름에 기반으로 한다. action.bound 와 arrow 함수는 함께 사용하지 말자.
* `runInAction(name?, thunk)` 는 간단한 유틸리티 이다. 이것은 code block 을 받고 익명의 action 을 실행한다. 이것은 즉석에서 액션을 생성하고 실행하는데 유용하다. 예를 들면 비동기적인 절차 안에서 사용하는 예가 있겠다. 간단하게 말해서 `runInaction(f)`은 `action(f)()` 과 같다.

## async action & flow

* action wrapper / decorator 는 오직 현재 함수가 실행이 되고있을때 영향을 미친다. 하지만 현재 함수에 의해 스케쥴 된 함수(단지, 실행함수 말고)는 영향을 미치지 않는다. 이것이 의미하는건 setTimeout, promise then, async , state 를 변화시키는 callback 함수같은 함수들에게 action 으로 감싸줘야 한다는 것이다.
* 비동기 action 을 생성하는 방법은 몇몇 가지가 있다.

### Promise

```javascript
mobx.configure({ enforceActions: 'observed' }) // don't allow state modifications outside actions

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // "pending" / "done" / "error"

  @action
  fetchProjects() {
    this.githubProjects = []
    this.state = 'pending'
    fetchGithubProjectsSomehow().then(
      projects => {
        const filteredProjects = somePreprocessing(projects)
        this.githubProjects = filteredProjects
        this.state = 'done'
      },
      error => {
        this.state = 'error'
      }
    )
  }
}
```

* 위 예제에서는 예외를 던집니다. `fetchGithubProjectsSomehow`에 넘긴 콜백들은 `fetchProject` 액션의 한 부분이 아니기도 하고, action 은 오직 현재 스택에만 적용되기 때문이다.
* 가장 쉽게 고치는 방법은 callback 을 action 으로 추출하는 방법이 있다. ( 이때, action.bound 를 사용하는 것은 정확한 this 를 얻는데 중요하다. )

```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // "pending" / "done" / "error"

  @action
  fetchProjects() {
    this.githubProjects = []
    this.state = 'pending'
    fetchGithubProjectsSomehow().then(
      this.fetchProjectsSuccess,
      this.fetchProjectsError
    )
  }

  @action.bound
  fetchProjectsSuccess(projects) {
    const filteredProjects = somePreprocessing(projects)
    this.githubProjects = filteredProjects
    this.state = 'done'
  }

  @action.bound
  fetchProjectsError(error) {
    this.state = 'error'
  }
}
```

* 위 코드는 깨끗하고 명확할수 있는 코드이지만 약간은 복잡한 flow 를 가지고 있습니다. ( 코드를 읽기에 왔다갔다 할 수 있다. ) 대안책으로는 promise callback 을 action 키워드로 감싸는 방법을 취할 수 있습니다. 해당 action 에 이름을 부여하는것은 추천하지만 의무는 아닙니다.

```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // "pending" / "done" / "error"

  @action
  fetchProjects() {
    this.githubProjects = []
    this.state = 'pending'
    fetchGithubProjectsSomehow().then(
      // inline created action
      action('fetchSuccess', projects => {
        const filteredProjects = somePreprocessing(projects)
        this.githubProjects = filteredProjects
        this.state = 'done'
      }),
      // inline created action
      action('fetchError', error => {
        this.state = 'error'
      })
    )
  }
}
```

### runInAction utility

* 인라인 action 의 단점은 TypeScript 가 그것들을 추론하기 어렵다는 것이다. 그래서 모든 callback 에 type 을 적용해야한다. 이렇게 callback 전부에 action 을 생성하는 대신, action 함수안에 callback 을 약간 수정해서 state 를 수정할 수 있다.

```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // "pending" / "done" / "error"

  @action
  fetchProjects() {
    this.githubProjects = []
    this.state = 'pending'
    fetchGithubProjectsSomehow().then(
      projects => {
        const filteredProjects = somePreprocessing(projects)
        // put the 'final' modification in an anonymous action
        runInAction(() => {
          this.githubProjects = filteredProjects
          this.state = 'done'
        })
      },
      error => {
        // the alternative ending of this process:...
        runInAction(() => {
          this.state = 'error'
        })
      }
    )
  }
}
```

* `runInAction` 또한 첫번째 인자로 이름을 넘길수 있다. `runInAction(f)`는 `action(f)()`로 볼 수있다.

### async / await

* Async / await 를 기반으로 하는 함수는 처음에는 혼동스러울수 있다. 왜냐하면 문법적으로 그것들은 동기적인 함수처럼 보이기 때문이다. 이 방법은 @action 이 전체 함수에 적용되는 인상을 준다. 결론적으로 `@action`은 코드블럭에서 첫번째 await 까지 적용이 된다. 그 후에 await 가 비동기적으로 실행이 되고 await 이 끝난 후에 state 를 변경하는 코드는 action 으로 감싸줘야한다.

```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending' // "pending" / "done" / "error"

  @action
  async fetchProjects() {
    this.githubProjects = []
    this.state = 'pending'
    try {
      const projects = await fetchGithubProjectsSomehow()
      const filteredProjects = somePreprocessing(projects)
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.state = 'done'
        this.githubProjects = filteredProjects
      })
    } catch (error) {
      runInAction(() => {
        this.state = 'error'
      })
    }
  }
}
```

### flows

* 내장된 `flow` 빌트인 함수를 사용하는건 나이스한 접근이지만, flow 는 generators 를 이용한다. 초보자들에겐 두려움이 될수 있지만 async/await 과 같이 움직인다고 보면 된다. 단지 async 대신에 `function *` 을 await 대신에 `yield`를 사용하는 것이다. 이 `flow`는 문법적으로 async/await 와 매우 닮아있고 비동기 파트에 대한 action 래핑이 따로 필요 없다는 것이다. 그 결과 깔끔한 코드를 작성할 수 있다.

* `flow`는 함수처럼 사용이 되고 docorator 가 아니다. 또한 MobX 개발툴과 밀접하며 비동기 함수의 절차를 추적하기에 용이합니다.

```javascript
mobx.configure({ enforceActions: 'observed' })

class Store {
  @observable githubProjects = []
  @observable state = 'pending'

  fetchProjects = flow(function*() {
    // <- note the star, this a generator function!
    this.githubProjects = []
    this.state = 'pending'
    try {
      const projects = yield fetchGithubProjectsSomehow() // yield instead of await
      const filteredProjects = somePreprocessing(projects)
      // the asynchronous blocks will automatically be wrapped in actions and can modify state
      this.state = 'done'
      this.githubProjects = filteredProjects
    } catch (error) {
      this.state = 'error'
    }
  })
}
```

* flow 는 취소가능하다. 이 의미는 리턴되는 promise 에 있는 `cancel()` 함수를 호출할 수 있다는 뜻이다. 이 함수는 generator 를 즉시 중지 시킬수 있지만 finally 절은 실행이 됩니다. 반환된 promise 그 자체는 FLOW_CANCELLED 로 reject 로 귀결된다.

## Object api

## 기타

## react-mobx

* react 는 render 를 호출하는 방법은 2 가지가 있다. setState() 메서드와 forceUpdate() 이다. 여기서 forceUpdate() 메서드를 사용하게 되면 자식 컴포넌트들이 다 다시 render 가 된다.
* react 에서 render 를 막을수 있는 방법은 shouldComponentUpdate 와 pure component 방법이 있겠다. 여기서 pure component 는 얕은 비교를 통해서 render 를 할지 안할지를 결정한다.
* react-mobx 는 forceUpdate 메서드를 가지고 화면을 갱신하게 된다. 이때 문제는 불필요한 자식들까지 렌더링이 된다는 것이다. 이때 shouldComponentUpdate 를 오버라이딩 해놓고 얕은 비교를 통해서 업뎃을 할지 안할지를 결정한다. 따라서 prop 에 data 를 넘길때 observable 한 값을 넘기기 보다는 observable 을 포함한 변하지 않은 객체를 넘기는 것이 효율적이다.

## 참조

[https://www.youtube.com/watch?v=cXi_CmZuBgg&feature=youtu.be](https://www.youtube.com/watch?v=cXi_CmZuBgg&feature=youtu.be
