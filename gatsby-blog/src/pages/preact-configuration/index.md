---
title: preact 구성기
date: "2019-12-19T10:00:03.284Z"
---

# preact, rollup, babel 구성기

react의 경량화 버젼인 preact를 rollup과 babel로 환경 셋팅한 경험기 입니다.
`preact-cli` 가 존재하지만 각 설정들이 숨겨져 있고 `eject` 시키기가 어려워서 새롭게 구성했습니다.

## preact

- 3kb 용량의 경량화 된 react 입니다.
- 약간의 설정으로 react 문법과 동일하게 사용할 수 있습니다.
- `preact`는 별도의 빌드 툴이 없어도 브라우저에서 사용할 수 있도록 제작이 되어있습니다. 
- Hooks 도 지원을 하고 있습니다.
- 기존 react의 이벤트 시스템을 가지고 있지 않아서 가볍습니다.
- `className` 대신 `class`를 사용하기 때문에 기존 마크업 된 결과물을 쉽게 가져다 넣을 수 있습니다. 
- `Component.render()` 메서드에 인자로 `this.props` 와 `this.state` 값을 순차적으로 받아 올 수 있습니다.
- `preact`의 `h()` 함수는 `react`에 `createElement`와 매칭이 됩니다.
- `preact`에선 `onChange` 대신에 `onInput`을 사용합니다.

## preact & babel 

- `preact` 에서 JSX를 사용하기 위해선 별도의 babel 셋팅이 필요합니다.

```javascript
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "h",
      "pragmaFrag": "Fragment",
    }]
  ]
}
```

- 폭 넓은 브라우저 대응을 위한 babel 을 셋팅합니다.
- polyfill을 대신할 `core-js` 와 `regenerator-runtime` 을 설치 해줍니다. 
- `"useBuiltIns": "usage"` 설정은 각 파일에서 사용될 폴리 필에 대한 것만 가져옵니다.

```javascript
"presets": [[
    "@babel/preset-env",
    {
      "targets": {},
      "useBuiltIns": "usage",
      "corejs": 3
    }
  ]]
```

## preact & rollup

- axios를 번들에 넣고 싶을 때 `resolve({ browser: true,})` 를 넣어주어야 합니다. 왜냐하면 axios 모듈은 유니버셜 코드 (서버 와 브라우저 환경에서 모두 작동) 이기 때문에 브라우저에서만 작동되는 스크립트를 번들 하기 위해선 브라우저 에서 작동할 번들이라고 알려주어야 합니다. (모듈의 package.json 의 browser 키 값을 보고 필요한 것만 번들해 옵니다.)
- plugin 순서는 `babel`, `resolve`, `commonjs` 를 지켜주도록 합니다.

```javascript
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import { uglify } from 'rollup-plugin-uglify'

export const context = process.env.npm_config_context

if (!context) {
  throw new Error(`please insert npm command line '--context={pageName}'`)
}

export default {
  input: `src/page/${context}.js`,
  output: {
    file: `dist/${context}/bundle_${context}.js`,
    format: 'iife',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
    postcss(),
    uglify(),
  ],
}
```

