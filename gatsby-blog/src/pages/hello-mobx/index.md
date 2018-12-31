---
title: hello-mobx
date: "2018-12-31T10:00:03.284Z"
---

# Intro

* mobx 의 특징을 알아보고 공부하자.
* mobx 의 공홈을 독파해보자.

## Concepts

1. State

* state 란 어플리케이션을 이끄는 데이터이다.

2. Derivations ( 파생 )

* state 로 부터 파생되는 값들이다. 다양한 형태로 존재할 수 있다.
* 파생된 데이터는 todo 리스트에서 남아있는 todo item 갯수라고 할 수 있다.
* mobx 는 구별되는 두가지의 파생 종류가 있다. 하나는 Computed values 또 다른 하나는 Reactions 이다.
  * Computed values 는 순수 함수를 이용한 observable state 로 부터 파생된 새로운 값이다. 따라서 side effect 가 없어야 한다.
  * 만약 지금의 state 를 베이스로 새로운 값을 만들길 원한다면 computed 를 사용하면 된다.
  * 모든 Computed value 는 순수해야하고 state 를 변화 시키면 안된다.
  * Reactions 는 state 변화로 인해 자동적으로 발생될 필요가 있는 sied effect 이다. 여기서 side effect 는 호출된 함수 밖에 있는 다른 값들이나 어플리케이션의 상태를 변경되는 것을 뜻한다.
  * Reactions 은 명령형 프로그래밍과 reactive 프로그래밍 사이를 연결해주는 것으로 필요로 한다.
* action 은 state 를 변화시키는 한 코드이다. 마치 스프레드 시트에 새로운 값을 입력하는 user 와 같은 것이다.
* 만약 strict 모드를 사용한다면 액션 밖에서 state 를 강제로 바꾸는 일을 할 수 없게 된다.

### imperative

* imperative 는 명령형 프로그래밍으로 쉽게는 순차적으로 명령을 하듯이 프로그래밍 하는것을 뜻한다. 컴퓨터가 수행할 명령들을 순서대로 적어놓아서 내가 원하는 결과를 얻는것이다. 즉, how 어떻게 할것인가에 포커싱을 맞춘다. 반대로는 선언적인 프로그래밍이 있다. 선언적 프로그래밍에선 데이터에 집중하기 보단 절차에 집중을 해서 만들어 낸다. 즉, what 무엇을 할 것인가에 초점을 맞춘다.

* 데이터를 정의하고 그것의 변화 과정을 프로그래밍 할것이냐 행위를 정의하고 거기에 데이터를 집어 넣을 것이냐 방법의 차이. 즉, 생각의 주체를 데이터에 두느냐 function 에 두느냐의 차이.

### reactive programing

* async 상황에서 이 async 데이터를 어떻게 처리할것이냐 , 아이디어는 stream 라는것으로 연결하고 그 stream 에 데이터를 흘려 보내자. 라는 생각이 reactive 프로그래밍이다. 함수의 동작은 async 하게 움직이지만 코드로는 순서대로.. async 한 작업을 functional 하게 처리하는 아이디어.

* 어떤 데이터를 생산해내는 함수가 있을거고 그 데이터를 받아서 처리하는 컨슈머가 있을것이다. 그것을 서로 스트림으로 연결시키고 데이터를 만드는애를 observable 데이터를 소비하는 애를 subscriber 라고 한다.
  observable 부터 subscriber 까지 데이터가 흘러가는데 흘러가는 사이에 operator 라는 것들을 통해 데이터를 변형하거나 제작할수 있다.

* reactive 프로그래밍이란 데이터의 흐름과 그 변화를 알려주는 통지로 바라보는 패러다임이다. 예를 들면 a = b + c 에서 덧셈의 결과를 a 에 할당하지만 일반적인 패러다임은 b 나 c 가 변하여도 a 값은 변경되지 않는다. 하지만 반응형 프로그래밍에서는 a 가 자동으로 변경된다. ( ex. 엑셀의 셀처럼 ) 즉, 프로그래밍 언어에서 정적 또는 동적 데이터 흐름을 쉽게 표현할 수 있어야 하며 변경 사항을 데이터 흐름을 통해 자동으로 전파한다는 것을 의미

* 공식 문서에서의 imperative 란 반응형으로 이뤄진 코드 생태계의 외부 code 생태계라고 볼수있다. 이 외부 code 생태계는 반응형의 생태계의 side effect 정도 되겠다.

## Principles

* MobX 는 action 이 상태를 변경하고 그에 따른 views 를 업데이트하는 단방향 데이터 흐름을 지원합니다.
* 모든 파생물들은 자동적으로 state 가 변할때마다 업데이트 된다. 결과적으로 그 중간값들을 관찰할 수 없다.
* 모든 파생물들은 기본 동기적으로 업데이트 된다. 이 의미는 actions 은 state 가 변화된 후 computed value 를 안전하게 확인할 수 있다.
* Computed value 는 update 가 게으르게 된다. 실제로 사용되지 않는 Computed value 는 side effect 위해 필요로 하지 않는 이상 업데이트 되지 않는다. 만약 view 가 더이상 사용하지 않는다면 가비지 컬렉터가 수거해 간다.

## 사물을 관찰 가능하게 만들기

### observable

### @observable

### objects

### arrays

### maps

### boxed values

### decorators

## 관측 대상에 반응하기

### (@)Computed

* Computed values 는 다른 computed value 또는 지금 존재하는 state 로 부터 파생된 값이다.
* 이 값은 실제로 수정가능한 state 를 최소화 시킬수 있는 방법중 하나이다.
* computed 와 autorun 는 반응적으로 실행되는 표현법(expressions)이지만, computed 는 다른 observer 에 의해 사용될수 있는 값을 생성할때 사용되고 autorun 은 새로운 값을 만들어 내지 안흔ㄴ다 그 대신에 어떠한 효과를 이루기 위해 사용될수 있다. 예를들면 로깅이나 네트워크 요청 같은 것들 말이다.
* Compute values 는 이전 값의 변화가 없다면 재 계산되지 않는다. 또한 다른 computed property 또는 reaction 에서 사용되 지 않으면 계산되지 않는다.
* Computed values 는 사용되지 않으면 자동으로 가비지 컬렉터가 수거해 간다. 이는 autorun 과의 차이점 중에 하나이다. ( autorun 의 경우에는 그들 스스로가 dispose 해주어야 한다. )
* 만약 항상 computed value 가 계산되길 원한다면 observe 또는 keepAlive 를 이용해서 사용할 수 있다.
* computed 프로퍼티들은 enumerable 하지 않는다. 또한 상속 체인에 overwritten 되지 않는다.

### autorun

* autorun 은 반응하는 함수를 만들 경우 사용된다. autorun 으로 해당 함수를 감싼다. 이 함수는 스스로가 observer 들을 가지지 않는다.
* autorun 은 대게 반응형 코드에서 명령형 코드로 이어짐이 필요할 경우 사용된다. 예를 들면 로깅이나 ui update code 에서 사용된다.
* autorun 을 사용할때 제공하는 함수(감싸이는 함수)는 항상 그 즉시 한번은 실행된다. 그리고 이후에 그것의 디펜던시들이 변화가 일어날때마다 한버씩 실행된다.
* 대조적으로 computed 로 생성되는 함수는 오직 관찰자가 그 값을 가질때 재 평가 된다.
* autorun 은 자동적으로 실행되야 할 함수를 지닐때 하지만 새로운 값을 결과로 가지지 않을때 사용되고 computed 는 그 외에 사용된다고 보면 된다.
* autorun 은 부수적인 효과를 시작하는 것이지 새로운 값을 만들어 내지 않는다.
* 만약 첫번째 인자로 문자열을 autorun 에 넘긴다면 그것은 디버그 네임으로 사용될 수 있다.
* autorun 의 리턴 값은 해당 autorun 을 해지하는 disposer function 이다. 이 함수는 더이상 autorun 이 필요 없어질때 사용된다.
* 반응(reaction) 그 자체는 autorun 에 제공하는 함수에 유일한 인수로 전달되며 이 인수를 autorun 함수 안에서 다룰수 있다. 이 의미는 두가지 방법으로 더이상 autorun 이 필요 없을때 dispose 할 수 있다는것을 뜻한다.

### when

### reaction

### (@)observer

## 관측값 변경하기

## 참조

(https://www.youtube.com/watch?v=cXi_CmZuBgg&feature=youtu.be)[https://www.youtube.com/watch?v=cXi_CmZuBgg&feature=youtu.be]
