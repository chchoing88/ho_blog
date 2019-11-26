---
title: Hello Rollup
date: "2019-11-25T10:00:03.284Z"
---

# Rollup Setting & babel Setting

간단한 스크립트 개발 셋팅을 위한 rollup 과 babel 셋팅을 정리해둡니다.

## Rollup production setting

rollup 셋팅시 다음과 같은 plugin을 설치하라는 공식 문서가 보입니다.

- `rollup-plugin-node-resolve` : `node_modules`에 설치된 제 3자 모듈의 위치를 [Node resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together) 를 사용해서 모듈의 위치를 찾아줍니다. 이 resolve 가 없을시 `import hljs from "highlight.js/lib/highlight";` 이런 node_modules에 설치된 모듈을 찾지 못합니다. 
- `rollup-plugin-commonjs` : node_modules에 설치된 모듈중에서 `require` 문의 CommonJS 모듈을 사용할 경우 다음 플러그인을 사용해서 코드를 포함시켜 줍니다.
- `rollup-plugin-babel` : 코드 번들링할때 babel을 이용하기 위해서 사용됩니다.



## Rollup production Code

```javascript
// rollup.config.js
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

export default {
  input: "src/js/main.js",
  output: {
    file: "dist/bundle.js",
    format: "iife"
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    })
  ]
};

```

## Rollup dev setting

dev에서는 개발서버를 돌려주는 `rollup-plugin-serve` 와 `rollup-plugin-livereload` 를 사용합니다.

dev 모드에서는 `--watch` 를 꼭 붙여주어서 코드가 변화할때마다 다시 번들하게 만들어 주어야 합니다.

```bash
"scripts": {
    "start": "rollup -c ./rollup.config.dev.js --watch"
  },
```

* 주의 : 최신 rollup 버젼에서는 `rollup-plugin-server` 모듈은 사용하지 말자.

## Rollup dev Code

```javascript
import common from "./rollup.config";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import * as path from "path";

export default {
  input: "src/js/main.js",
  output: {
    file: "dist/bundle.dev.js",
    format: "iife"
  },
  plugins: [
    ...common.plugins,
    serve({
      open: true,
      contentBase: path.join(process.cwd(), "/dist"),
      host: "localhost",
      port: 9000
    }),
    livereload("dist")
  ]
};
```

## babel setting

바벨에서 `preset` 이라고 하는 것은 여러 플러그인을 모아둔것이라 불리웁니다.
공식 프리셋은 다음과 같습니다.

- @babel/preset-env
- @babel/preset-flow
- @babel/preset-react
- @babel/preset-typescript

기본적인 프로젝트 셋팅시엔 타겟 환경에 따라 구문을 변환해줄 수 있는 가장 대표적인 `preset-env`를 사용합니다.

아래는 기본 설치 방법 입니다.

```bash
npm install --save-dev @babel/preset-env

```

`@babel/preset-env`는 지정한 대상 환경을 가져 와서 매핑 목록과 비교하여 플러그인 목록을 컴파일하고 그것을 Babel에 전달합니다.

### useBuiltIns

여러가지 옵션중에 `useBuiltIns` 이란 옵션은 polyfills을 다루기 위한 옵션 입니다.


#### useBuiltIns: 'entry'

코드 시작시 `import "core-js";` 라고 선언하게 되면 환경에 따라 필요한 polyfills들을 전부 불러오게 치환 해줍니다.
또한 `core-js@3`을 사용하게 될시 `@babel/preset-env` 는 `core-js`를 최적화 시킬 수 있습니다. 
예를 들면 당신이 배열과 새로운 Math 의 메서드 polyfill이 필요하다면 다음과 같이 작성할 수 있습니다.

```javascript
import "core-js/es/array";
import "core-js/proposals/math-extensions";
```

#### useBuiltIns: 'usage'

각 파일에서 사용되는 대상 환경에서 지원되지 않는 기능에 대해 polyfill을 넣어줍니다. 번들러는 동일한 폴리필에 대해선 한번만 가져오는 이점이 있습니다. 

```javascript
// first file:
var set = new Set([1, 2, 3]);

// second file:
var array = Array.of(1, 2, 3);
```

위 코드는 IE >= 11 환경에서 아래와 같이 변경됩니다.

```javascript
require("core-js/modules/web.dom.iterable");
require("core-js/modules/es6.array.iterator");
require("core-js/modules/es6.object.to-string");
require("core-js/modules/es6.string.iterator");
require("core-js/modules/es6.set");
// first file:
var set = new Set([1, 2, 3]);

require("core-js/modules/es6.array.of");
// second file:
var array = Array.of(1, 2, 3);
```

### corejs

이 옵션은 `useBuiltIns: usage` or `useBuiltIns: entry` 이 옵션이 켜져있을때 효력이 발동되며 `@babel/preset-env`가 core-js 버전이 주입하도록 합니다.

디폴트로는 polyfill은 안정적인(stable) ECMAScript 기능들만 주입하지만, 모든 polyfill을 원한다면 3가지 옵션이 있습니다.

- `useBuiltIns: entry` 의 경우에는 제안에 있는 polyfill을 직접 import 시키는 법입니다. : `import "core-js/proposals/string-replace-all"`

- `useBuiltIns: usage` 의 경우에는 2가지 경우가 있습니다.
  - [`shippedProposals`](https://babeljs.io/docs/en/babel-preset-env#shippedproposals) 옵션을 `true`로 셋팅합니다. 이렇게하면 이미 브라우저에 이미 제공된 제안서에 대한 polyfill 및 변환이 가능합니다.
  - `corejs: { version: 3, proposals: true }` 이렇게 하면 core-js에 있는 모든 제안된 기능들을 polyfilling 합니다.

## babel config code

```javascript
{
  "presets": [[
    "@babel/preset-env",
    {
      "targets": {
        "ie" : "10"
      },
      "useBuiltIns": "entry",
      "corejs": 3
    }
  ]]
}
```