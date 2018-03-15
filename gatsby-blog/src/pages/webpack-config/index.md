---
title: webpack config
date: "2018-03-14T10:00:03.284Z"
---

## Intro
---

- 기존에 돌아가는 서버를 바라보는 dev proxy server를 띄워 부분적으로 react component를 개발하는 환경을 만들어보자.
- 그러기 위해서 사용하는 개발서버 webpack dev config 설정을 해보자.
- 배포를 위한 webpack prod config 설정을 해보자.
- webpack 개발을 위한 babel , react-hot-loader 등을 설정해보자.
- webpack 을 node api 로 사용해보자.

## Tech stack
---

- webpack v4.0
- react v16.2



## Structure
---

```
├── config
│   ├── paths                       ## 경로 설정 ( 각자의 경로가 다르다면 여기서 수정)
│   ├── webpack.prod.config.js      ## 웹팩 prod config
│   ├── webpack.dev.config.js       ## 웹팩 dev config
│   ├── wepackDevServer.js          ## 웹팩 dev server용 config
├── scripts                         ## frontend 개발서버 , build , 배포 쪽 스크립트
│   ├── build.js                    ## 배포 build 
│   ├── start.js                    ## 개발서버 start 
├── src                             ## react 소스 폴더
│   ├── components                  ## components 들 모음 폴더
│   ├── App.js                      ## app 의 시작점
│   ├── index.js                    ## react render의 시작점
├── .babelrc
├── package.json                    
  
```

- dev 환경 : script/start.js 에서 webpack.dev.config 와 webpackDevServer 를 import 하여 webpack dev server 를 실행시킨다. 
- prod 환경 : script/build.js 에서 webpack.prod.config 를 이용해서 bundle.js를 만든다.
- 공통 환경 : paths.js 경로에 관련된 환경
- 깃 : [https://github.kakaocorp.com/FTDev-RnD/study-docker/tree/master/merlin_app/merlin_frontend](https://github.kakaocorp.com/FTDev-RnD/study-docker/tree/master/merlin_app/merlin_frontend)

## 각 파일 설명
---

### webpack.dev.config.js


```javascript
const path = require("path");
const paths = require("./paths");

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: paths.appPublic,
    filename: "bundle.js"
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  mode: "development",
  plugins: [],
  resolve: {
    modules: ["node_modules"]
  }
};

```

**webpack 4에는 production 과 development mode 옵션이 생겨났다.**

보통의 경우 development config 파일과 production config 파일 2개를 관리하게 된다.

- webpack dev server 를 설정하고 기타 설정들을 위한 dev config
- UglifyJsPlugin , 소스맵 , 뿐만아니라 배포를 위한 최적화 된 bundle.js 를 위한 기타 설정들을 위한 prod config

webpack 4 에선 --mode (production / development) 옵션으로 해당 옵션만으로 

production 모드에선 minification과 hoisting , tree-shaking(불필요 한것을 떨군다.) 등등의 최적화 작업이 자동으로 이뤄지고
development 모드에선 다른 방식으로 optimized를 하면서 un-minified bundle을 내뱉어 준다.

mode 옵션에 대한 참고 : [https://www.valentinog.com/blog/webpack-4-tutorial/#webpack_4_production_and_development_mode](https://www.valentinog.com/blog/webpack-4-tutorial/#webpack_4_production_and_development_mode)

### webpackDevServer

```javascript

const noopServiceWorkerMiddleware = require("noop-service-worker-middleware");

module.exports = {
  public: "nodeapp.local:3001",
  inline: true, // live reloading insert bundle..
  hot: true, // hot module reloading
  compress: true, // enable gzip compression
  historyApiFallback: true,
  before(app) {
    //app.use(errorOverlayMiddleware());
    app.use(noopServiceWorkerMiddleware());
  },
  overlay: {
    warnings: true,
    errors: true
  }
};

```

webpack dev server 에 대한 기본적인 option 부분이다.

**devServer 의 옵션**

- devServer.public : dev server 의 inline 모드와 proxying dev server 이용시, inline client scrtip는 항상 어디에 연결해야 하는지 모른다. client script는 server에 window.location 기준으로 추축하게 된다. 그러나 이게 실패할시 이 public을 이용하게 된다.
- devServer.inline : dev server 에는 inline 모드와 hot 모드가 있다. default 는 inline 모드를 사용한다. 이것은 번들에 삽입되어서 live reloading을 지원하고 build 메세지를 브라우져 console에 보여준다.
- devServer.historyApiFallback : HTML5 History API 를 사용할때(즉, SPA사용시), true로 설정하면 어느 404 응답대신 index.html을 제공된다. rewrites(Object or Array)를 이용하면 by passing을 설정할 수 있다.
- devServer.contentBase : dev server 는 기존 프로젝트 루트에 있는 파일을 서비스 하는데 여기서는 proxy를 사용하기에 별도로 작성하지 않는다. 
- devServer.before() : dev 서버 안에 모든 내부 미들웨전에 실행하는 부분이다. 이부분은 커스텀 핸들러를 정의하는데 사용할 수 있다.
- devServer.overlay : 컴파일 에러시 브라우져 화면에 overlay 로 보여준다.

**noopServiceWorkerMiddleware**
- express의 미들웨어를 리턴하는 녀석으로 이전의 서비스 워커 설정들을 reset 시키는 녀석이다. ( 사실 react-create-app 에서 사용하기에 들고왔다. ) 
- 아직 왜 필요한지는 파악하지 못함.
- 서비스 워커란? [https://b.limminho.com/archives/1384](https://b.limminho.com/archives/1384)

### webpack.prod.config

```javascript
const path = require("path");
const paths = require("./paths");

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: paths.appPublic,
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  mode: "production",
  plugins: [],
  resolve: {
    modules: ["node_modules"]
  }
};

```

- dev.config 와 동일

### paths.js

```javascript
const path = require("path");
const fs = require("fs");
const url = require("url");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPublic: resolveApp("public"),
  appBuild: resolveApp("build")
};

```

- path 를 관리하는 장소 ( 상세 설명은 생략 )



### start.js ( dev start )

```javascript
"use strict";

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../config/webpack.dev.config");
const webpackDevConfig = require("../config/webpackDevServer");
const open = require("open");

// setting
const host = process.env.HOST || "0.0.0.0";
const proxyUrl = "http://nodeapp.local:8081";
const publicPath = "/";
const port = process.env.PORT || 3001;
const devServerOptions = Object.assign({}, webpackDevConfig, {
  proxy: {
    "/": {
      target: proxyUrl,
      secure: false
    }
  },
  host,
  port,
  publicPath,
  stats: {
    colors: true
  }
});

webpackConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());
webpackConfig.plugins.push(new Webpack.NamedModulesPlugin());

WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);
const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(port, host, err => {
  if (err) {
    return console.log(err);
  }

  console.log("Starting server on http://nodeapp.local:3001");
  open("http://nodeapp.local:3001");
});

```

기본적으로 webpack 에선 express를 이용해서 devServer를 만듭니다.

webpack dev server 에 필요한 추가적인 부분을 작성합니다. 

**devServerOptions**

- proxy 라는 부분을 이용해서 "/" 경로로 들어왔을때 target 프록시 url로 요청을 보내서 받아오게 됩니다.
- publicPath 라는 부분은 개발시에 실제 서버 경로 처럼 사용할 수 있게 만들어 줍니다. 예를 들어 "/asset" 으로 설정해놓으면 실제로 dev 개발할 시 bundle의 주소는 /asset/bundle.js 로 참고 하게 됩니다.

**HotModuleReplacementPlugin**
- hot module replace 모드를 활성화 시켜줍니다.
- 절대 production 모드에선 사용하지 않습니다.


**NamedModulesPlugin**
- hot module replace 모드 사용시 모듈의 상대 경로를 표시해줍니다. 개발시에 추천되는 플러그인 입니다.


webpack dev 참고 : <br/>
[https://webpack.js.org/guides/hot-module-replacement/#via-the-node-js-api](https://webpack.js.org/guides/hot-module-replacement/#via-the-node-js-api)
[https://github.com/webpack/webpack-dev-server/tree/master/examples/api/simple](https://github.com/webpack/webpack-dev-server/tree/master/examples/api/simple)


### build.js ( prod bundle )

```javascript
const path = require("path");
const paths = require("../config/paths");
const chalk = require("chalk");
const fs = require("fs-extra");
const argv = require("yargs").argv;
const webpack = require("webpack");
const config = require("../config/webpack.prod.config");

function execute() {
  build().then(
    ({ stats }) => {
      console.log("build Success!!");
      copyPublicFolder();
    },
    err => {
      console.log("build error");
    }
  );
}

function build() {
  console.log("Creating an optimized production build...");

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      return resolve({ stats });
    });
  });
}

// copy folder and file
function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild);
}

execute();

```

실제 배포 번들을 만든 뒤 파일 copy 하는 부분

< 추가 되어야 할 부분 >

- 실제 배포되야할 번들 파일 뒤에 번들 리비젼 붙이기 
- 기타 console.log 부분 제거와 optimized

## Reference
---

- 해당 폴더 구성과 파일 구성등은 Create React App 을 참고 하였다.