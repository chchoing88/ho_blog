---
title: Hello Rollup
date: "2019-11-25T10:00:03.284Z"
---

# Rollup Setting & babel Setting

간단한 스크립트 개발 셋팅을 위한 rollup 과 babel 셋팅 및 crawling을 위한 proxy 서버 셋팅을 정리해둡니다.

## Rollup production setting

rollup 셋팅시 다음과 같은 plugin을 설치하라는 공식 문서가 보입니다.

- `rollup-plugin-node-resolve` : `node_modules`에 설치된 제 3자 모듈의 위치를 [Node resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together) 를 사용해서 모듈의 위치를 찾아줍니다. 이 resolve 가 없을시 `import hljs from "highlight.js/lib/highlight";` 이런 node_modules에 설치된 모듈을 찾지 못합니다. 
- `rollup-plugin-commonjs` : 다음 플러그인을 사용하면 node_modules에 설치된 모듈중에서 `require` 문을 사용하는 CommonJS 모듈을 ES6로 변환해서 번들코드에 포함시켜 줍니다.
- `rollup-plugin-babel` : 코드 번들링할때 babel을 이용하기 위해서 사용됩니다.



## Rollup production Code

```javascript
// rollup.config.js
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from 'rollup-plugin-postcss'
import staticSite from 'rollup-plugin-static-site'
import { uglify } from 'rollup-plugin-uglify'


export default {
  input: "src/js/main.js",
  output: {
    file: "dist/bundle.js",
    format: "iife"
  },
  plugins: [
     babel({
      exclude: "node_modules/**" // only transpile our source code
    })
    resolve({
      browser: true, // axios 같이 서버 코드랑 브라우저 코드가 다 들어있는 모듈일때 package.json 보고 브라우저 관련 코드만 가져온다.
    }),
    commonjs(),
    postcss(), // css 도 번들 포함
    uglify(), 
    staticSite({
      dir: `dist/${context}`,
      filename: 'index.html',
      template: { path: `src/public/index.html` },
    }),
    
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

### loose mode

많은 바벨 플러그인은 2가지 모드를 지원합니다. 

하나는 일반 모드(normal mode) 이고 또다른 하나는 (루즈 모드)loose mode 입니다.

- normal mode : 최대한 ECMAScript 6 의 의미에 가깝게 따릅니다.
- loose mode : 간단하게 ES5로 코드를 생성합니다.

예를 들면 

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
```

위와 같은 코드에서 normal mode로 변환하면 `toString` 이라는 메서드를 non-enumerable(비 열거) 하게 만들지만 ( 비 열거가 되면 객체에서 속성을 열거하려 할때 나오지 않습니다. )

loose mode 모드에선 손으로 작성한 것과 같은 스타일 처럼 일반 메서드로 할당 시켜 버립니다.

- [참고](https://2ality.com/2015/12/babel6-loose-mode.html)



### useBuiltIns

여러가지 옵션중에 `useBuiltIns` 이란 옵션은 polyfills을 다루기 위한 옵션 입니다.

사전에 다음과 같이 설치를 해주어야 합니다.

```bash
npm install core-js@3 --save

# or

npm install core-js@2 --save

# and

npm istall regenerator-runtime --save
```


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

## proxy 서버 셋팅

기존의 마크업된 페이지에서 내가 개발한 코드가 제대로 동작하는지 확인하기 위해서 마크업 페이지를 crawling 해 `css, js, image 경로 변경 후 bundle된 javascript 삽입`된 HTML 응답하는 서버 필요가 생겼었다. 

### rollup setting 변경

기존에 `rollup-plugin-serve`를 쓰던 개발 서버에서 `proxy` 설정을 하기 위해  `rollup-plugin-serve-proxy` 모듈로 교체한다. 

여기서 `proxy` 셋팅은 **적절하게 셋팅해둔 url로 요청이 들어왔을 시 대신 응답(proxy 서버) 해줄 서버를 가리킵니다.** 

```javascript
import common from "./rollup.config";
import serve from "rollup-plugin-serve-proxy";
import livereload from "rollup-plugin-livereload";
import htmlTemplate from "rollup-plugin-generate-html-template";
import * as path from "path";

import setting from "./setting.json";
import Proxy from "./proxy/Proxy";

const proxy = new Proxy({
  targetHost: setting.target_host,
  port: setting.port,
  bundleJs: setting.bundle_js
});
proxy.listen(); // proxy 서버를 띄웁니다.

export default {
  input: common.input,
  output: {
    file: "dist/bundle.dev.js",
    format: "iife"
  },
  plugins: [
    ...common.plugins,
    htmlTemplate({
      template: "index.html",
      target: "dist/index.html"
    }),
    serve({
      open: true,
      contentBase: path.join(process.cwd(), "/dist"),
      host: "localhost",
      port: 9000,
      proxy: {
        dev: "http://localhost:1234" // /dev url로 들어오는 요청은 localhost:1234 서버가 대신 응답해 줍니다.
      }
    }),
    livereload("dist")
  ]
};

```

### proxy 서버 개발

proxy 서버가 하는 일은 다음과 같습니다.

- 사용자가 설정한 주소의 마크업을 크롤링 해옵니다. 
- 크롤링해온 HTML 파일에서 외부 링크나 내부 상대 경로를 이용하는 링크를 절대 경로로 교체 해줍니다. 이는, css, image, js 파일은 해당 마컵 서버에 있는걸 가져다 쓰겠다는 의미 입니다.
- 마지막으로 body 에 개발 서버에 적제되어있는 bundle.js 파일을 삽입해줍니다.

`target_host` 설정 후 `/dev` 이후 요청 받은 url에 따라서 마크업 서버에서 크롤링 해오는 페이지가 다르게 하기 위해서 다음과 같은 작업을 합니다.
(예. `localhost:3000/dev/ho1/ho2?search` 로 접속하면 다음과 같은 주소에서 크롤링 해옵니다. `http://merlin.com/test/ho1/ho2?search`)


```javascript

const getHtml = async (host, path) => {
  try {
    return await axios.get(`${host}${path}`);
  } catch (error) {
    console.error(error);
  }
};

const url = req.url
getHtml(this._targetHost, url).then(... )

```


### 코드 예제


```javascript
{
  "target_host" : "http://merlin.com/test",
  "bundle_js" : "bundle.dev.js",
  "port" : 1234
}
```

```javascript
// DevController.js
const axios = require("axios");
const cheerio = require("cheerio");

const HTTP_REG = /^((http(s?))\:\/\/)/;
const ROOT_REG = /^(\/)/;
const REL_REG = /^(\.(\.?))/;
const isHttpUrl = url => {
  return HTTP_REG.test(url);
};

const isRootUrl = url => {
  return ROOT_REG.test(url);
};

const isRelativeUrl = url => {
  return REL_REG.test(url);
};

const getHtml = async (host, path) => {
  try {
    return await axios.get(`${host}${path}`);
  } catch (error) {
    console.error(error);
  }
};

const stringifyScriptTag = src => {
  return `<script type="text/javascript" src="${src}"></script>`;
};

// ./css/path/aaa
// ../css/path/ccc
// /insure-2019/apt/css/path/bbb
// css/path/aaa => ./css/path/aaa

const convertAbsolutePath = (hostUrl, pathname, attrPath) => {
  if (isRootUrl(attrPath)) {
    return `${hostUrl.substring(0, hostUrl.lastIndexOf("/"))}${attrPath}`;
  }

  if (isRelativeUrl(attrPath)) {
    return `${hostUrl}${pathname}/${attrPath}`;
  }

  return `${hostUrl}/${attrPath}`;
};

const convertCssPath = ($, host, pathname) => {
  const $link = $("link");

  $link.each((index, cssLink) => {
    const $cssLink = $(cssLink);
    const cssHref = $cssLink.attr("href");

    if (cssHref && !isHttpUrl(cssHref)) {
      // 경로가 있고 http로 시작하지 않는 경로만 바꿔준다.
      const absolutePath = convertAbsolutePath(host, pathname, cssHref);
      $cssLink.attr("href", absolutePath);
    }
  });
};

const convertScriptPath = ($, host, pathname) => {
  const $script = $("script");
  const scriptSrc = $script.attr("src");

  if (scriptSrc && !isHttpUrl(scriptSrc)) {
    $script.each((index, scriptLink) => {
      const $scriptLink = $(scriptLink);
      const absolutePath = convertAbsolutePath(host, pathname, scriptSrc);
      $scriptLink.attr("src", absolutePath);
    });
  }
};

const convertImagePath = ($, host, pathname) => {
  const $img = $("img");
  const imgSrc = $img.attr("src");

  if (imgSrc && !isHttpUrl(imgSrc)) {
    $img.each((index, imgLink) => {
      const $imgLink = $(imgLink);
      const absolutePath = convertAbsolutePath(host, pathname, imgSrc);
      $imgLink.attr("src", absolutePath);
    });
  }
};

const appendBundleScript = ($, jsfile) => {
  $("body").append(stringifyScriptTag(`/${jsfile}`));
};

class DevController {
  constructor({ targetHost, bundleJs }) {
    this._targetHost = targetHost;
    this._bundleJs = bundleJs;
  }

  getCrawlingHtml(req, res) {
    const url = req.url;
    const pathname = url.substring(0, url.lastIndexOf("/"));

    getHtml(this._targetHost, url)
      .then(html => {
        const $ = cheerio.load(html.data);
        convertCssPath($, this._targetHost, pathname);
        convertScriptPath($, this._targetHost, pathname);
        convertImagePath($, this._targetHost, pathname);
        appendBundleScript($, this._bundleJs);

        return $.html();
      })
      .then(data => res.send(data));
  }
}

export default DevController;

```

```javascript
// devRouter.js
const express = require("express");
const devRouter = express.Router();

export function devRouting(app, controller) {
  app.use("/dev", devRouter);

  devRouter.get("/*", (req, res, nex) => {
    controller.getCrawlingHtml(req, res);
  });
}

```

```javascript
// Proxy.js
// require
const express = require("express");
const app = express();
import DevController from "./DevController";
import { devRouting } from "./devRouter";

class Proxy {
  constructor({ targetHost, port = 1234, bundleJs }) {
    this._targetHost = targetHost;
    this._port = port;
    this._bundleJs = bundleJs;
    this._devController = new DevController({ targetHost, bundleJs });
    this.routing();
  }

  routing() {
    devRouting(app, this._devController);
  }

  listen() {
    app.listen(this._port, () => {
      console.log(`${this._port}번 port에 proxy server를 띄웠습니다.`);
    });
  }
}

export default Proxy;

```




