---
title: Hello React
date: "2018-01-31T10:00:03.284Z"
---

## intro React

리엑트를 처음 마주해보자.
해당 정리 내용의 출처는 
[https://www.youtube.com/watch?v=GEoNiUcVwjE&list=PL9FpF_z-xR_GMujql3S_XGV2SpdfDBkeC](https://www.youtube.com/watch?v=GEoNiUcVwjE&list=PL9FpF_z-xR_GMujql3S_XGV2SpdfDBkeC)

이곳을 참조 하였다.

Babel : es6 작성된 코드를 이전 버젼인 es5로 변환하기 위한 도구 
여러가지 브라우저를 호환하기 위해 es5로 변환

15버전 이상에서 

react.min.js : 컴포넌트 담당

react-dom.min.js : dom에 랜더링 담당

컴포넌트는 자바스크립트 클래스 이다.
리엑트 컴포넌트 클래스를 상속한다.

```javascript
class Coldelab extends React.Component{
    render(){
        let text = "Hi i am coldelab";
        let style = {
            baackgroundColor:'aqua'       
        };
        return(
            // <div>Codelab</div>
            <div style={style}>{text}</div>
        )
    }
}
// 다른 컴포넌트에서 다시 사용할 수 있다.
class App extends React.Component{
    render(){
        return (
            <Codelab/>
        )
    }
}

// 페이지에 랜더링
// 실제 페이지에 jsx코드를 랜더링할때 사용합니다.
ReactDom.render(<App/>,document.getElementById("root"));
```

### React element

- `react element`는 컴포넌트 인스턴스 또는 돔 노드를 설명해주고 그것이 원하는 프로퍼티를 설명하는 객체이다. 
- 이 객체 안에는 오직 컴포넌트의 타입(<button>), 프로퍼티(color), 그리고 그 안에 들어있는 child node들의 정보이다. 
- element는 실제 인스턴스가 아닙니다. 오히려, React에게 화면에보고 싶은 것을 알려주는 방법입니다.
- element의 어떤 method도 호출할 수 없습니다. 이것은 단지 immutable 한 2개의 필드(type: (string | Component) and props: Object.)를 가진 object 설명서입니다.

```javascript
const Button = {
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      children: 'OK!'
    }
  }
}
```

- component를 설명하는 element 또한 element 이다. 단지 element는 DOM node를 설명하는 것이다. 그것들은 다른것들과 중첩될 수 있다. 

```javascript
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
});
```

- React는 element type에 class나 함수가 오면 주어진 props와 함께 어떤 element를 render 그려야 할지 물어본다.
- element는 plain object이다. 이 object는 DOM 노드들 또는 다른 컴포넌트들의 관점에서 화면에 표시할 내용을 설명하는 일반 객체이다. Element 들은 다른 element들을 props안에 포함할 수 있다.

### React component

- React component는 props를 input 으로 받아서 element tree를 output으로 방출하는 것이다. 이게 component이다! 
- 이렇게 반환 된 요소 트리에는 DOM 노드를 설명하는 요소와 다른 구성 요소를 설명하는 요소가 모두 포함될 수 있습니다. 이렇게하면 내부 DOM 구조에 의존하지 않고도 UI의 독립적 인 부분을 작성할 수 있습니다.
- component는 class로도 정의 될 수 있다. 함수 컴포넌트보다 조금더 파워풀 하다. 
- 함수나 클래스나 모든 컴포넌트는 React 이라는 것이다. 컴포넌트들은 props를 받고 element 를 반환한다는 것이다.


```javascript
// React: You told me this...
// 여기서 From 이 component 라고 한다면 아래 props를 input으로 받아서 새로운 element를 output으로 내놓을 것이다.
{
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}
// React: ...And Form told me this...
{
  type: Button,
  props: {
    children: 'OK!',
    color: 'blue'
  }
}
// React: ...and Button told me this! I guess I'm done.
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

- 위 수행으로 React가 최종 DOM tree를 안다. 그리곤 ReactDOM 이나 React Native 같은 rederer로 update가 필요한 부분에 실제 DOM 노드를 최소한으로 적용시킨다.
- component는 2가지로 표현할 수 있다. render() 메서드를 지닌 React.Component를 상속받은 class가 하나고, function 이 또다른 하나다. 이 두가지 케이스는 props를 input으로 받고 return으로는 element 트리를 리턴한다.
- component가 몇몇 props를 input으로 받는다는 것은 부모 component가 그것의 타입과 그들의 prop를 리턴했기 때문이다. 
- instance는 작성한 컴포넌트 클래스에서 this 참조하는 인스턴스입니다. 로컬 상태를 저장하고 수명주기 이벤트에 반응하는 데 유용합니다.
- Function component들은 intstaces를 전혀 가지지 못합니다. Class 컴포넌트들은 instances 들을 가진다. 이 instance는 사용자가 직접적으로 만들 필요는 없다. 
- element를 만들기 위해서는 React.createElement(), JSX, 또는 element factory helper 함수를 이용할 수 있다.

### jsx

xml같은 문법을 네이티브 자바스크립트로 변환을 해줍니다. 괄호는 가독성을 위해 사용
바벨이 jsx로더를 사용해서 jsx 형태코드를 변환해준다. 

```jsx

// jsx
var a = (
    <div>
        Welcome to <b>React CodeLab</b>
    </div>
)
```


```javascript

// javascript
var a = React.createElement(
    "div",
    null,
    "Welcome to",
    React.createElement(
        "b,
        null,
        "React.js CodeLab"
    )
)
```

모든 jsx 형태의 코드는 컨테이너 엘리먼트 안에 포함시켜 주어야 한다.
jsx안에서 javascript 를 표현할때는 {} 로 wrapping을 하면 된다.
if Else 문은 jsx에서 사용 불가 이에 대한 대안은 tenary expression 을 사용한다.

```javascript
    condition? true : false // {1==1? 'true':'false'}
```

jsx안에 스타일을 선언할때 카멜케이스를 사용한다. ex) backgroundColor
jsx 안에서 class를 설정할때는 'class=' 가 아닌 className을 사용한다.

jsx 에서 주석을 작성할 때는 { /* ... */ } 로 표현한다.




### props

컴포넌트 내부의 immutable Data 를 처리할 때 사용한다.
jsx 내부에 {this.props.propsName} 라고 설정하고
위에서 설정한 컴포넌트를 사용할때 propsName="value" 라고 사용한다.
this.props.childrens은 기본적으로 가지고 있는 props로 
<Cpnt> 여기에 있는 값이 들어갑니다. <Cpnt>

```javascript
class Coldelab extends React.Component{
    render(){
       return(
           <div>
                <h1>Hello {this.props.name}</h1>
                <div>{this.props.children}</div>
           </div>
        )
    }
}
// 다른 컴포넌트에서 다시 사용할 수 있다.
class App extends React.Component{
    render(){
        return (
            <Codelab name="merlin">이 사이에 있는거</Codelab> // "이 사이에 있는거" 가 위의 children에 나타납니다.
        )
    }
}

```

props에 기본 값을 설정 할 수 있다.
props에 특정 타입이 아니거나 입력을 안했을때 개발자 콘솔에 뜨게 할 수 있다.
참고 : js 넣을때 minifyed 버젼은 에러가 뜨지 않는다.

```javascript
class App extends React.Component{
    render(){
        return (
            <Codelab name="merlin">이 사이에 있는거</Codelab> // "이 사이에 있는거" 가 위의 children에 나타납니다.
        )
    }
}

App.defaultProps = {
    value:0
}

App.propTypes = {
    value:React.PropTypes.string,
    secondValue:React.PropTypes.number,
    thirdValue:React.PropTypes.any.isRequired // 어떤 타입이든 필수로 입력이 되도록
}
```

### state

컴포넌트에서 유동적인 데이터를 보여줄 때 사용합니다.
초기값 설정이 필수다.
초기값은 constructor에서 this.state={} 로 설정
값을 수정할때는 this.setState({...}), 렌더링 된 다음엔 this.state= 절대 사용하지 말것.

렌더링이 되기 전에는 setState 메소드를 사용하지 못한다.즉, construct에서 사용 못함.

렌더링이 된 후에는 this.state= 로 수정하면 안된다. 
setState 메소드를 사용 state를 바로 수정하는게 아니라 리엑트 개발자가 지정한 안정된 프로세스를 거쳐 값이 변경된다.
값이 변경된 다음에는 자동으로 리 랜더링 합니다.

스테이트를 바로 수정하는게 아니라 리엑트 개발자가 지정한 안정된 프로세스로 통하여 값이 변경된다.
값이 변경된 다음에는 랜더링이 다시 진행된다.

```javascript

class Counter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value:0
    };
    
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(){
    this.setState({
      value:this.state.value + 1
    });
  }
  
  
  
  render(){
    return (
      <div>
        <h2>{this.state.value}</h2>
        <button onClick={this.handleClick}>Press me</button>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <Counter />
    );
  }
};

ReactDOM.render(
  <App></App>,
  document.getElementById("root")
);


```

### 컴포넌트 맵핑 

데이터 배열을 리엑트에서 렌더링 할때 javascript 내장 함수인 map을 사용한다.

```javascript
class ContactInfo extends React.Component{
  render(){
    return (
      <div>{this.props.contact.name} {this.props.contact.phone}</div>
    )
  }
}

class Contact extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      contactData:[
        {name:'Abet',phone:"010-0000-0001"},
        {name:'Bbet',phone:"010-0000-0002"},
        {name:'Cbet',phone:"010-0000-0003"},
        {name:'Dbet',phone:"010-0000-0004"},
      ]
    }
  }
  
  render(){
    
    const mapToComponent = (data) => {
       return data.map((contact,i) => {
         return (<ContactInfo contact={contact} key={i} />) // 각 데이터에 identity를 주기 위해서.
       })
    };
    
    return (
      <div>
         {mapToComponent(this.state.contactData)} 
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
        <Contact />
    );
  }
};

ReactDOM.render(
  <App></App>,
  document.getElementById("root")
);
```

### 위 맵핑의 문제점

- 리액트 컴포넌트를 loop를 돌면서 생성을 할때 key 값을 지정할 수 있다. 여기서 key 값에 list의 index를 전달 해주었는데 이는 안티패턴이다. <br />
이유는 key 값은 각 요소를 구별할수 있는 장치 이다, 새로운 item을 추가/삭제/정렬시에 리액트는 새롭게 변화된 컴포넌트들을 랜더링하게 된는데, 이 때 이전에 가지고 있던 key 값들을 가져와 비교를 하면서 다시 랜더링하는 것을 막아주고 상태를 유지하게 된다. 하지만 여기서 배열의 인덱스 값으로 key를 설정하게 될경우를 생각해보자. <br />
부모 컴포넌트가 배열의길이가 10개인 아이템들을 가지고 10개의 컴포넌트를 랜더링 한다고 했을 때, 5번째 아이템을 삭제한다고 가정하자. 다시 부모 컴포넌트는 9개의 아이템을 가지고 9개의 컴포넌트를 렌더링 할것이다. 이때, 리엑트는 key 값인 배열의 인덱스를 살펴볼 것이고 5번째의 아이템이 사라졌다는 생각대신 10번째 아이템이 없어졌다고 인식할 수 있다. <br />

따라서 각 child item 들에 유니크한 값으로 id를 셋팅 후에 이 id 값을 key 값으로 설정해주는 것이 좋다.

### 번외_1 eslint를 함께 사용해보자.

- airbnb의 eslint를 사용해 보자.

IDE: vsCode ( eslint plugin )

1. eslint , babel-eslint 를 설치 

```sh
$ npm i -g eslint // eslint 명령어를 사용하기 위해..
$ npm i -D eslint babel-eslint babel-preset-airbnb
```

babel-preset-airbnb : airbnb 의 javascript 스타일로 transform 해준다.
babel-eslint : eslint 의 parser를 babel-eslint로 사용. 이것은 Babel code를 lint에서 유효하게 만들어 준다.


2. eslint 의 configuration file 을 만들기 위해 아래 명령어를 활용한다.
```sh
$ eslint --init 
```

3. 선택지가 몇개 나오는데 그중 "Use a popular style guide" 에서 "airbnb" 선택
4. react 사용하냐 응답에 yes~
5. javascript 선택

6. .eslintrc.js 파일이 생성됨.
7. .eslintrc.js 파일 수정

```javascript
module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "node": true
    },
    "extends": "airbnb",
    "rules": {
        "strict": 0,
        "react/jsx-filename-extension": 0,
        "react/no-array-index-key": 0

    }
};
```
**참고로 airbnb eslint는 state 가 없으면 pure function 으로 작성하게 되어있다.**

관련 자료 : [https://groundberry.github.io/development/2017/06/11/create-react-app-linting-all-the-things.html](https://groundberry.github.io/development/2017/06/11/create-react-app-linting-all-the-things.html)

우선 여기까지만 하면 기본적인 설정은 끝.. 나머지는 차차 하면서~

```javascript
// package.json 
{
  "name": "reactTest",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "dependencies": {
    "react": "^16.2.0",
    "react-dom": "^16.2.0"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-eslint": "^8.2.1",
    "babel-preset-airbnb": "^2.4.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "bable-loader": "0.0.1-security",
    "eslint": "^4.18.0",
    "eslint-config-airbnb": "^16.1.0",
    "eslint-plugin-import": "^2.8.0",
    "eslint-plugin-jsx-a11y": "^6.0.3",
    "eslint-plugin-react": "^7.6.1",
    "react-hot-loader": "^3.1.3",
    "webpack": "^3.11.0",
    "webpack-dev-server": "^2.11.1"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

```

### 번외_2 react 와 flow 사용하기.


### 앞으로 공부할 것

- React 더 심화
- Redux 
- Rxjs , redux-observable
- flow
- esLint & airbnb

## 참고 

[https://medium.com/@dan_abramov/react-components-elements-and-instances-90800811f8ca](https://medium.com/@dan_abramov/react-components-elements-and-instances-90800811f8ca)