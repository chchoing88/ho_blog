---
title: Hello rebass
date: "2020-03-09T10:00:03.284Z"
---

이번 프로젝트에 rebass 라는 React primitive ui component build with styled system 이라는 라이브러리를 사용해보고 정보와 사용 느낀점을 남깁니다.

## rebass 란

React에서 사용할 수 있는 UI 원시 컴포넌트들을 지원하는 라이브러리로써 기존의 css-in-js 라이브러리에 styled-system을 이용해서 만들어져 있습니다.

즉, css-in-js에 이런 styled-system을 믹싱해서 원시 컴포넌트를 미리 만들어 둔 것이 rebass 입니다.

css-in-js : styled-component , @emotion

## css-in-js (styled-component, @emotion) 장점

여기서는 별도의 css-in-js 들을 설명하진 않겠습니다. 대신 장점 몇 가지를 나열해 보겠습니다.

1. 셀렉터의 스코프가 전역이 아닙니다. 이 말은, 셀렉터가 겹칠일이 없다는 것입니다.
2. sass 문법을 사용할 수 있습니다. 즉, '&' 단어로 현재 컴포넌트를 나타낼 수 있고 이걸로 부모 , 형재 등등의 선택자들을 셀렉팅 할 수 있습니다.
3. React Context API를 이용해 theme를 적용할 수 있습니다.
4. 다이나믹하게 스타일링을 적용할 수 있습니다. 컴포넌트에 props를 전달해서 동적으로 스타일을 정의 할 수 있습니다. 또한 js 특정 값에 따라서 스타일을 쉽게 정의 내릴 수 있습니다.

무엇보다도 컴포넌트 베이스 디자인을 할 수 있고 작은 독립적인 단위로 UI 분할을 하는데 도움을 줍니다.

한곳 또한 한 페이지 이상 또는 자주 사용된다면 특정 스타일 또는 디자인을 갖고 있다면 클래스를 만들고 어플리케이션의 다른 영역에서 그 클래스를 사용하는 것보다 하나의 스타일된 컴포넌트를 만들고 특정 컴포넌트를 사용하는 것이 중복된 css를 줄이고 color 또는 공간을 조정하는 것 같은 UI를 약간 변경하는 데 필요한 시간을 줄입니다.  

## styled-system 이란

Styled System은 constraint-based design system principles에 영향을 받아 비주얼 디자인의 특정 영역 내에서 디자인 제약 스케일을 관리하기 위한 솔루션 입니다.

> "디자인 시스템은 기본적으로 디자인과 코드로 구현 된 규칙, 제약 조건 및 원칙의 모음입니다." -Sylvee L.-
> '디자인 시스템'이란, 서비스를 만드는데 사용한 공통 컬러, 서체, 인터랙션, 각종 정책 및 규정에 관한 모든 컴포넌트를 정리해놓은 것을 뜻합니다. -배재민 디자이너-

예를 들면 폰트의 사이즈, 여백의 사이즈, 컬러, 기타 다른 시각적인 속성들을 theme object로 관리 할 수 있도록 도와줍니다. 이제는 구체적인 디자인 시스템을 포함하는 theme.js 를 사용해서 컴포넌트의 props를 셋팅해주게 됩니다.

또한 일관된 스타일을 적용 할 때 올바른 작업을 쉽게 수행 할 수있는 API를 제공하도록 합니다.

## rebass 장점

rebass는 system-styled 장점을 더욱 간단히 이용 하는 것이라, 아래 장점들은 styled-system의 장점이 되기도 합니다.

1. 가장 작고 견고한 Component 들을 제공합니다.

  컴포넌트 개발시에 기본적으로 제공하는 (Box, Text, Image.. 등등의 컴포넌트를 미리 제공해 줍니다.)

  ```ts
    import {Box, Text, Image} from 'rebass'
  ```

2. 일관 된 컴포넌트의 props 개발

  다음 유지보수시 서로 다른 개발자가 작성한 컴포넌트가 아래의 예시와 같다고 했을 때
  
  ```ts
    <CustomButton1 type="thin"/>
    <CustomButton2 thin/>
  ```

  다양한 API 형식을 지니는 컴포넌트를 제작할 수 있으며 이는 곧 또다른 유지보수시 큰 시간을 들이게 됩니다. 
  
  반면 rebass를 사용한다면 새롭게 props 를 만들 필요가 없을 뿐더러 다른 개발자가 보아도 쉽게 이해 할 수 있습니다. 
  
  ```ts
    <CustomButton1 p={2} /> // padding 이 테마의 scale의 2번째 값을 적용한다.
    <CustomButton2 p={3} /> // padding 이 테마의 scale의 3번째 값을 적용한다.
  ```

3. 테마를 우선순위로 사용하면서 일관된 스타일을 유지

  css-in-js 에서도 테마를 지원하지만 기본적으로 우선시 되지는 않습니다. 하지만 rebass 컴포넌트는 테마를 우선 적용하도록 되어있습니다.

4. 확장성이 용이

  css-in-js에서 사용하도록 하는 `styled()` 로 확장하는 컴포넌트는 기존 컴포넌트의 API가 복잡할수록 예측 가능하도록 확장하기가 어렵습니다. 반면 rebass로 확장을 하는 경우에는 예측 가능하도록 설계가 되어 있습니다.

  ```ts
    import {Button} from 'rebass'
    
    function CustomButton() {
      return <Button sx={
                color: 'point' // theme에 포인트 컬러
              } />
    }
    
    <CustomButton /> // 일반적으로 color는 point 컬러
    <CustomButton color={'red'} /> // red color로 수정
  ```

## 추후 theme를 잘 쓰기 위한 노력

스타일에 대한 적절한 추상화 작업이 필요합니다. 최대한 추상화로 정의 내릴 수 있는 디자인은 모두 theme에 녹여내는 작업이 필요 합니다.

디자인을 보고 더 이상 쪼갤 수 없는 스타일 요소들을 분류하고 한 스타일 요소에 최대 n개가 넘지 않는 선에서 추상화를 시킵니다.

ex) borderRadius 의 경우 smallRadius, mediumRadius, largeRadius

이렇게 theme.js 에 디자인 명세를 작성하면 페이지에 들어가는 컴포넌트들은 될 수 있으면 이 명세에 따르도록 만듭니다.
피치 못할 경우에는 각 컴포넌트에서 필요한 스타일을 추가 및 오버라이딩 해서 적용합니다.

## rebass + typescript

rebass와 typecript를 함께 썼을때 이슈로는 다음과 같습니다.

rebass는 css-in-js를 @emotion 기반으로 사용하고 styled-system을 사용하는 것으로 github에서 보았습니다.

```ts
  import styled from '@emotion/styled'
  
  export const Box = styled('div', {
    shouldForwardProp
  })({
    boxSizing: 'border-box',
    margin: 0,
    minWidth: 0,
  },
    base,
    variant,
    sx,
    props => props.css,
    compose(
      space,
      layout,
      typography,
      color,
      flexbox,
    ),
  )
  
  interface BoxKnownProps
      extends BaseProps,
          StyledSystem.SpaceProps,
          StyledSystem.LayoutProps,
          StyledSystem.FontSizeProps,
          StyledSystem.ColorProps,
          StyledSystem.FlexProps,
          StyledSystem.OrderProps,
          StyledSystem.AlignSelfProps,
          SxProps {
      variant?: StyledSystem.ResponsiveValue<string>;
      tx?: string;
  };
  export interface BoxProps extends BoxKnownProps, Omit<React.HTMLProps<HTMLDivElement>, keyof BoxKnownProps> {}
  export const Box: React.FunctionComponent<BoxProps>;
```

하지만 다른 컴포넌트에서  @emotion/core를 import 할 경우 css에 대한 충돌이 발생 합니다.

@emotion/core 에서 사용하는 css type 은

```ts
  declare global {
    namespace JSX {
      /**
       * Do we need to modify `LibraryManagedAttributes` too,
       * to make `className` props optional when `css` props is specified?
       */
  
      interface IntrinsicAttributes {
        css?: InterpolationWithTheme<any>
      }
    }
  }
```

rebass 의 css type을 살펴보면

```ts
  import * as StyledComponents from 'styled-components';
  
  export interface BaseProps extends React.RefAttributes<any> {
      as?: React.ElementType;
      css?: StyledComponents.CSSObject | StyledComponents.FlattenSimpleInterpolation | string;
  }
```

여기서 rebass의 css props는 왜 StyledComponents 를 아직도 type으로 지정하는지는 아직 파악이 안됩니다. 

## rebass 느낀점

디자이너가 있다면 어느정도 디자인에 대한 system을 만들어 두고 시작하면 좀 더 손쉽게 쓸 수 있을거 같습니다. 
여기서 디자인 system은 간단하게 디자인 가이드 정도 생각하면 될 듯 싶습니다. 
스타일 어디까지를 테마로 뺴두어야 할지의 경계를 정하지 못한다면 theme.js가 자칫 의미가 없어질 수 있습니다. 

장점을 정리해보면 다음과 같습니다.

1. 테마를 우선순위로
2. 일관된 props ( 모양과 행동으로 구체적인 props를 갖는게 좋음.)
3. 컴포넌트의 계층 구조를 손쉽게 생각할 수 있게 해줌.
4. 컴포넌트 확장에 용이

### 아쉬웠던 점

css-in-js 들에는 develop 할 경우 css 네이밍을 개발자가 정해놓은 룰에 따라서 네이밍을 붙여주기도 합니다.

특히 @emotion 에서는 [https://emotion.sh/docs/babel-plugin-emotion](https://emotion.sh/docs/babel-plugin-emotion) 를 사용하면 css 네이밍을 붙여줍니다.

이는 개발자 도구에서도 어느 컴포넌트에서 렌더링이 되었는지 한눈에 알아 볼 수 있습니다.

- rebass에서 @emotion/styled 를 사용하고 있어서 위 플러그인을 사용함.

하지만 rebass 에서는 다음의 경우에만 css 네이밍을 붙여 줍니다.

1. props로 css 속성이 들어간 컴포넌트 : babel config에 정해진 룰대로 자동으로 css 네이밍을 붙여줍니다.
2. sx props 안에 label property가 존재하는 경우 : label의 값으로 css 네이밍을 붙여줍니다.

## 참고

styled-system 사용법 : [https://varun.ca/styled-system/](https://varun.ca/styled-system/)

styled-component와 styled-system을 함께 사용했을때 이점 : [https://medium.com/styled-components/build-better-component-libraries-with-styled-system-4951653d54ee](https://medium.com/styled-components/build-better-component-libraries-with-styled-system-4951653d54ee)

styled-system 신조 : [https://jxnblk.com/blog/the-three-tenets-of-styled-system/](https://jxnblk.com/blog/the-three-tenets-of-styled-system/)

디자인 시스템 1 : [https://medium.muz.li/what-is-a-design-system-1e43d19e7696](https://medium.muz.li/what-is-a-design-system-1e43d19e7696)

디자인 시스템 2 : [https://medium.com/sketch-app-sources/design-system-principles-service-design-c3e439666b97](https://medium.com/sketch-app-sources/design-system-principles-service-design-c3e439666b97)

디자인 시스템 3 : [https://medium.com/guleum/%EB%94%94%EC%9E%90%EC%9D%B8-%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%9D%84-%EA%B5%AC%EC%84%B1%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-beefa8214884](https://medium.com/guleum/%EB%94%94%EC%9E%90%EC%9D%B8-%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%9D%84-%EA%B5%AC%EC%84%B1%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-beefa8214884)