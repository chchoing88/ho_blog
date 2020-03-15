---
title: typescript + react 사용기
date: "2020-03-08T10:00:03.284Z"
---

## 설치

creact react app 로 typescript로 만들어진 템플릿을 설치해줍니다.

```bash  
  npx create-react-app my-app --template typescript
```

## 함수 선언식 Component

함수형 component를 만드는데는 대게 화살표 함수형으로 만들곤 했었습니다.

이때 사용할 수 있는 타입은 다음과 같습니다.

```typescript
type CustomComponentProps = {

}

const CustomComponent: React.FC<CustomComponentProps> = () => {

  return <div></div>
}
```

React.FC 타입을 사용하게 되면 장 단점이 있습니다.

장점으로는 children이나 static 컴포넌트 프로퍼티들 ( defaultProps, propTypes, contextTypes, displayName ) 이 자동 완성이 지원된다는 점입니다.

하지만 단점으로는 다음과 같습니다.

1. defaultProps 설정이 유효하지 않다는 점입니다. defaultProps 설정을 해도 컴포넌트를 사용할 시에 해당 props를 전달하지 않으면 컴파일 에러가 뜹니다.
2. children 이 "?:(optional)" 으로 들어가 있기 때문에 명시적으로 children이 들어가야 하는지 아니면 안들어가도 되는지를 알 수 가 없습니다.

하여 함수형 컴포넌트를 만들 때는 다음과 같이 만듭니다.

```typescript
type CustomComponentProps = {

}

function CustomComponent({}: CustomComponentProps) {
  return <div></div>
}

export default CustomComponent
```

## Component props type

component의 props의 타입을 지정해 두면 component를 사용할 시에 코드 어시스트의 혜택을 얻을 수 있습니다. 

또한 유지보수시 잘못된 props를 넣거나 다른 타입의 props를 할당하는 것을 방지 할 수 있습니다. 

이때 interface 또는 type alias 방법을 사용할 수 있습니다. 

### type alias 와 interface 차이점

1. class에 implement 문을 작성할 시 type alias 도 가능하지만 "union" 문이 들어간 type alias는 허용하지 않습니다. 
2. interface에 extends 문을 작성할 시 type alias 도 가능하지만 "union" 문이 들어간 type alias는 허용하지 않습니다.
3. type alias 는 declaration merging 이 되지 않습니다. 

대게 React와 props와 state를 type alias로 타입 설정 하길 권장합니다. 하여 여기서 기본적으로는 type alias 방법을 사용합니다. 이유는 다음과 같습니다 .

1. 더 적은 타이핑
2. 일관성 있는 문법 제공 ( interface와 type alias로 된 모든 것들을 intersection으로 묶을 수 있습니다. )
3. React 컴포넌트를 사용자들이 재 선언을 해서 사용(몽키패칭)할 필요가 없습니다. 따라서 interface의 declaration merging 기능이 필요가 없습니다. ( 대게 컨벤션으로 interface는 라이브러리를 제작할때 공공 API를 위해 사용하거나 서드파티를 위해 엠비언트 타입을 정의할때 사용합니다. )

type alias 를 사용했을 시에 예시는 다음과 같습니다.

1. defaultProps를 지정시에 해당 타입을 typeof로 합칠 수 있습니다.

    - 다음과 같이 하면 CustomComponent 를 사용할 시 name props은 optional props로 나타나게 되어 더 명시적으로 디폴트 값이 있다는 것을 알려줄 수 있습니다.

    ```typescript
    type CustomComponentProps = {
      age: number
    } & typeof defaultProps

    const defaultProps = {name: 'merlin'}
    function CustomComponent({name}) {
    }

    CustomComponent.defaultProps = defaultProps
    ```

    - rebass 의 컴포넌트 Props는 interface로 되어 있지만 type의 intersection 으로 컴포넌트의 props를 extends 할 수 있습니다.

    ```typescript
    import React from "react";
    import { Box, BoxProps } from "rebass";
    import { iconCollection } from "./Icon.styled";
    import { IconType } from "types";
    
    type IconProps = BoxProps & {
      icon: IconType;
      children?: never;
    }
    
    function Icon({ icon, ...rest }: IconProps) {
      return <Box sx={iconCollection[icon]} {...rest}></Box>;
    }
    
    export default Icon;
    ```

## 자주 사용 한 typescript 문법

- keyof

```typescript
interface CustomObject {
  name: 'merlin'
  address: 'address'
}

// CustomObjecyKeyType = 'name' | 'address'
type CustomObjectKeyType = keyof CustomObject 

// CustomObjectValueType = 'merlin' | 'address'
type CustomObjectValueType = CustomObject[keyof CustomObject]
```

- Exclude

```typescript

type CustomObjectValueType = 'merlin' | 'address' | 'age' | 'info'


// FilterCustomObjectValueType = 'merlin' | 'address'
type FilterCustomObjectValueType = Exclude<CustomObjectValueType, 'info' | 'age'>
```

- Pick

```typescript
interface CustomObject {
  name: 'merlin'
  address: 'address'
  age: 'age'
  info: 'info'
}

/* {
  name: 'merlin'
  address: 'address'
} */
type PickCustomObjectType = Pick<CustomObject, "name" | "address">;
```

## typescript + react 장점

1. component 에 props로 무엇이 있는지 그 props 값으로는 무엇이 들어가야 하는지 빼먹진 않았는지 알 수 있습니다. 
2. 복잡한 API 응답 타입도 미리 지정해 두면 코드 어시스트가 작동되어 API 응답 값에 무엇이 있었는지 쉽게 알 수 있습니다. 
3. hooks 을 destructure 시에 어떤 타입이 나오는지 쉽게 알 수 있습니다. 

## 참고

[https://medium.com/@martin_hotell/10-typescript-pro-tips-patterns-with-or-without-react-5799488d6680#78b9](https://medium.com/@martin_hotell/10-typescript-pro-tips-patterns-with-or-without-react-5799488d6680#78b9)

[https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c](https://medium.com/@martin_hotell/interface-vs-type-alias-in-typescript-2-7-2a8f1777af4c)