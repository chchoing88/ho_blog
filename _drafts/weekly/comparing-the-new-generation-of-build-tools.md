# 차세대 빌드 도구 비교

> 원문 : [https://css-tricks.com/comparing-the-new-generation-of-build-tools/](https://css-tricks.com/comparing-the-new-generation-of-build-tools/)

새로운 개발자 도구 모음들은 과거 몇년동안 출시되어 왔다. 그리고 그 개발자 도구모음들은  지난 몇 년 동안 webpack, Babel, Rollup, Parcel, create-react-app 을 포함하는 프론트엔드 개발을 지배해 온 도구의 뒤를 따르고 있다.

여기서 소개할 새로운 도구들은 정확히 같은 기능을 하도록 디자인 되어있지 않았으며 각 도구마다 목표와 기능이 다르다. 이러한 도구들은 서로 다르지만 **개발자 환경 개선**이라는 공통의 목표를 가지고 있다.

## 목차

* 1장. esbuild
* 2장. Snowpack
* 3장. Vite 
* 4장. wmr
* 5장. 기능 비교
* 6장. 마무리

--- 

구체적으로 각 제품의 기능, 필요 이유, 사용 사례 등을 간략하게 평가하고자 한다. 비교가 공평하지 않다는것도 깨닫는다. 다시 말하지만 이글에서 이 도구들을 경쟁자로 다루려고 하는것이 아니다. 사실 Snowpack과 Vite는 특정 작업을 위해서 esbuild를 *사용*한다. 우리의 목표는 작업을 더 쉽게 만들어주는 개발자 도구를 폭 넓게 보고자 함이다. 이렇게 하면 우리는 어떤 선택지가 있는지와 얼마나 비용이 드는지를 알아볼 수 있어서 가장 적절한 선택을 할 수 있게된다.

물론 이 도구들 모두 필자의 React와 Preact 사용 경험으로만 비춰질수 있다. 필자는 이 라이브러리들에 익숙해져있다. 하지만 다른 프론트엔드 프레임워크들에 대한 지원도 함께 살펴볼것이다.

이 새로운 개발 툴에 대해서 많은 훌륭한 팟케스트나 스트림, 기사들이 존재한다. 좀 더 자세한 내용을 위해 몇 가지 ShopTalk Show 에피소드를 추천한다. [에피소드 454](https://shoptalkshow.com/454/)에서는 Vite에 대해 설명하고 [에피소드 448](https://shoptalkshow.com/448/)에서는 wmr 및 Snowpack 제작자를 소개한다. 이 사례에서 눈에 띄는 점은 개발 환경을 현대화하기 위해 엄청난 양의 작업이 이러한 도구를 만드는 데 투입되었다는 것이다.

## 왜 지금 이런 도구들이 출시가 되었을까?

부분적으로 이러한 도구들은 자바스크립트 툴링 피로감에 대한 반응으로 등장하고 있다고 생각한다. [2016년 자바스크립트 학습에 대한 기사](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f)에서 잘 나와있다. 또한 이 도구들은 하나의 바닐라 자바스크립트 파일을 쓰는 것과 당신이 자신의 코드를 쓰기 전에 200 메가바이트의 툴링 의존성을 다운로드해야 하는 것 사이의 부족한 중간 지점을 채워준다. 

이것들은 종속성 없이 표준 라이브러리만으로도 모든 작업을 수행하는데 문제 없으며(batteries-included) 자바스크럽트 생태계의 [계층 축소](https://www.swyx.io/js-third-age/)의 추세의 한 부분이다. 

Snowpack, Vite 그리고 wmr은 모두 브라우저의 [네이티브 자바스크립트 모듈](https://css-tricks.com/life-with-esm/)에 의해 활성화 되었다. 2018년에 [파이어폭스 60](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/60#javascript)은 ECMAScript 2015 모듈을 기본으로 활성화한 상태로 출시되었다. 그 이후로 모든 메이저 브라우저 엔진들은 네이티브 자바스크립트 모듈을 지원하기 시작했다. Node.js 또한 2019년 11월에 [네이티브 자바스크립트 모듈](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V13.md#13.2.0)을 지원했다. 우리는 2021년에 네이티브 자바스크립트 모듈이 오늘날 어떤 가능성을 열어줄지 여전히 찾고 있다.

## 기존 존재하는 도구들과 얼마나 다를까?

개발 서버를 위해 webpack, Rollup 또는 Parcel 어떤 것을 사용하든 상관없이 이 도구들은 소스 코드와 node_modules 폴더의 전체 코드베이스를 번들로 묶고, 빌드 프로세스(Babel, TypeScript 또는 PostCSS와 같은)를 통해 실행한 다음 번들된 코드를 브라우저에 제공한다. 이 모든 작업에는 작업이 소요되며, 캐싱 및 최적화 작업이 완료된 후에도 개발 서버가 대규모 코드베이스를 크롤링하기 위해 속도가 느려질 수 있다.

Snowpack, Vite, 그리고 wmr 개발 서버는 위와 같은 모델을 따르지 않는다. 대신 브라우저가 삽입 구문을 찾고 HTTP로 해당 모듈을 요청할때까지 기다린다. 이 요청이 이루어진 후에만 도구는 요청된 모듈과 모듈의 가져오기 트리에 있는 모든 리프 노드에 변환을 적용한 다음 이를 브라우저에 제공한다. 이렇게 하면 개발 서버로 푸시하는 과정에서 작업이 줄어들기 때문에 작업 속도가 훨씬 빨라진다.

위 에서 [esbuild](https://esbuild.github.io/)가 누락되었다. esbuild는 무엇보다도 *번들러*다. 그것은 다른 도구들처럼 번들링을 우회 하지 않는다. 대신, esbuild 프로세스는 [비용이 많이 드는 변환을 피하고 병렬화를 활용하며 Go 언어를 사용함으로써](https://esbuild.github.io/faq/#why-is-esbuild-fast) [매우 빠르게](https://esbuild.github.io/faq/#benchmark-details) 코드를 작성한다.


## 실험

React 문서에서 예제 앱 중 하나를 가져와 이 글에서 다루는 각 도구로 다시 빌드했다. 필자가 같이 했던 프로젝트는 [Yogita Verma](https://github.com/Yog9/SnapShot)의 [Snap Shot](https://yog9.github.io/portfolio/)이었다. 다음은 [원본 리포지토리 링크](https://github.com/Yog9/SnapShot)와 각기 다른 빌드 도구를 사용하는 [4가지 버전의 Snap Shot의 내 리포지토리에 대한 링크](https://github.com/Elliotclyde/build-tool-test)다. 나중에 각 빌드 단계의 출력을 비교할 것이다. 이 앱을 다시 빌드하여 [React Router](https://reactrouter.com/) 및 [axios](https://github.com/axios/axios)를 비롯한 몇 가지 꽤 표준적인 React 종속성을 번들 도구로 가져오는 개발자 경험을 테스트할 수 있었다.

## 비교 가능한 기능

개별 도구의 세부 사항에 대해 살펴보기 전에 이 도구들은 모두 다음과 같은 기능을 지원한다(다양한 정도).

* 네이티브 자바스크립트 모듈을 위한 일급 객체 지원
* 타입스크립트 컴파일(타입 체크는 하지 않는다)
* JSX
* 확장 가능한 플러그인 API
* 내장된 개발 서버
* CSS-in-JS 라이브러리를 위한 CSS 번들링

모든 도구들은 타입스크립트를 자바스크립트로 컴파일 할 수 있다. 하지만 *타입이 에러나도 이 작업은 가능하다.* 타입 체크를 하기 위해선 타입스크립트를 설치하고 최상단 자바스크립트 파일에서 *tcs --noEmit*를 실행하거나 에디터 플러그인을 사용할 수 있다.

좋다. 그럼 각각의 도구에 대해서 살펴보자.

## esbuild

esbuild는 [Evan Wallace](https://github.com/evanw)([피그마](https://www.figma.com/)의 CTO)에 의해 만들어졌다. 주요 특징은 노드 기반 번들러보다 10배-100배 빠른 빌드 단계를 제공한다는 것이다. 이 도구는 create-react-app에서 찾을 수 있는 많은 개발자 편의를 제공하지 않는다. 그러나 이러한 공백을 메우기 위해 [create-react-app-esbuild](https://github.com/pradel/create-react-app-esbuild), [estrella](https://github.com/rsms/estrella), 빌드 단계로 esbuild를 사용하는 [Snowpack](https://www.snowpack.dev/)을 포함하여 esbuild 스타터들이 점점 더 많이 생겨나고 있다.

esbuild는 매우 새롭다. 아직 1.0 버전에 도달하지도 않았고 실운영에 사용할 준비가 되지도 않았다. 하지만 머지 않았다. 이 도구는 직관적인 JavaScript 및 명령줄 API를 제공한다.

### 사용 사례

esbuild는 번들러 세계의 게임 체인저이다. esbuild와 노드 번들러 간의 속도 차이가 배가되는 대규모 코드베이스에서 가장 유용할 것이다. esbuild가 1.0에 도달하면 대규모 프로덕션 사이트에서 *매우* 유용할 것이며 빌드가 완료될 때까지 기다리는 시간을 절약할 수 있다. 불행히도 대규모 프로덕션 사이트는 esbuild가 안정될 때까지 기다려야 한다. 그동안 사이드 프로젝트의 번들링 속도를 빠르게 하기 위해 사용하는 것이 좋을 것이다.

esbuild의 번개처럼 빠른 속도는 당신이 하는 모든 종류의 작업에 보너스가 될 것이다. 빌드가 실행될 때까지 기다리는 시간을 줄이는 것이 개발자 경험에 항상 도움이 된다! 빠른 애플리케이션을 프로토타이핑할 때 esbuild보다 더 높은 수준의 다른것을 원할 수 있다. 하지만 자바스크립트 생태계에서 기대하는 편리함 이전 환경을 구축하고 종속성을 가져오기 위해 더 많은 시간을 써야 할 것이다. 또한 번들 크기를 최대한 최소화하려는 경우에는 Rollup 및 terser를를 사용하면 번들 크기가 약간 작아질 수 있다.

### 설치

필자는 원시적인 방법으로 React 프로젝트에 esbuild를 사용하기로 했다. npm을 이용해 esbuild와 React, ReactDOM을 설치했다. `src/app.jsx`파일과 `dist/index.html`파일을 만들었다. 그 후에 `dist/bundle.js` 파일로 컴파일 하기 위해 다음과 같은 커맨드를 사용했다.

```bash
./node_modules/.bin/esbuild src/app.jsx --bundle --platform=browser --outfile=dist/bundle.js
```

`index.html`를 호스팅하고 브라우저로 열었을때 "하얀 죽은 창" 과 "Uncaught ReferenceError: process is not defined" 콘솔 에러를 마주했다. [문서와 CLI 모두 이를 방지하기 위해 해야 할 일을 정확히 설명](https://esbuild.github.io/getting-started/#bundling-for-the-browser)하지만, React를 번들링할 때 추가 인수가 필요하기 때문에 초보자에게는 다소 어려운 것일 수 있다.

다음과 같은 추가 인수가 필요하다.

```bash
--define:process.env.NODE_ENV=\"production\"
```

또한 esbuild를 npm scripts에 포함하려고 한다면 다음과 같이 따옴표 이스케이프 작성해야 한다.

```bash
--define:process.env.NODE_ENV=\\\"production\\\"
```

이 `define` 인수는 노드 환경 변수를 필요로하는 브라우저를 위한 번들된 라이브러리에 필요하다.Vue 2.0도 이를 필요로 한다. Preact는 환경변수가 필요하지 않고 기본적으로 브라우저를 위해 준비된 라이브러리이기 때문에 같은 문제를 겪지 않는다.

`define` 인수로 명령을 실행한 후 "Hello world" React 앱이 완벽하게 작동했다. JSX는 `.jsx` 파일과 함께 작동한다. 즉, React를 수동으로 가져온 다음 JSX를 `React.createElement`로 변환해야 하지만 [JSX에 자동으로 React 추가하거나 Preact를 위해 JSX를 구성하는 방법](https://esbuild.github.io/content-types/#jsx)이 있다.

### 사용법

esbuild는 `--serve`옵션을 통해 개발서버를 제공한다. 개발서버는 모듈들을 파일 시스템을 사용하지 않고 메모리에서 직접 제공한다. 이는 브라우저가 최신 모듈 버전을 가져오는것을 보장한다.  하지만 live/hot reload는 지원하지 않는다. 따라서 저장 후 브라우저를 새로고침 하는 이상적이지 않은 경험을 할 것이다. (역자 주: 새로고침할때마다 새롭게 빌드를 하게 된다.)

필자는 새로운 [감시 기능](https://esbuild.github.io/api/#watch)을 사용하기로 했고 이는 소스파일이 저장될때마다 자동으로 esbuild가 코드를 컴파일 시작시켜준다. 하지만 여전히 저장된 변화를 보려면 서버가 필요했다. 그래서 Luke Jackson의 [servor](https://www.npmjs.com/package/servor)라는 개발 패키지를 사용했다.

```bash
npm install servor --save-dev
```

그런 다음 서버로써 시작하기 위해서 esbuild의 자바스크립트 API를 사용하고 동시에 esbuild의 감시 모드를 실행할 수 있다. watch.js라는 프로젝트의 루트에 파일을 생성하겠다.

```js
// watch.js
const esbuild = require("esbuild");
const servor = require("servor");

esbuild.build({
  // pass any options to esbuild here...
  entryPoints: ["src/app.jsx"],
  outdir: "dist",
  define: { "process.env.NODE_ENV": '"production"' },
  watch: true,
});

async function serve(){
  console.log("running server from: http://localhost:8080/");
  await servor({
    // pass any options to servor here...
    browser:true,
    root: "dist",
    port: 8080,
  });
}

serve();
```

이제 명령줄에서 `node watch.js`를 실행한다. 이는 좋은 개발 서버를 제공하지만 hot module replacement 또는 빠르게 새로 고침을 해주지는 않는다(즉, 클라이언트 측 상태가 유지되지 않음). 하지만 이 정도면 테스트하기 충분했다.

파일을 저장할 때마다 전체 애플리케이션을 다시 배포하고 있지만, esbuild 속도가 느려지기 전에 상당히 큰 애플리케이션이 필요하다. 이 도구를 설정한 후 변경에 대해 즉각적인 피드백을 받았다. 필자 컴퓨터는 2012년산 인텔 i7을 사용하므로, 최첨단 기계는 확실히 아니다.

live reload 및 일부 React 기본값이 포함된 사전 구성된 esbuild 버전이 필요한 경우 [이 저장소](https://github.com/Elliotclyde/esbuild-react-starter)에서 확인해라.

### 지원 파일

esbuild는 JavaScript에서 CSS를 가져올 수 있다. CSS를 기본 출력 자바스크립트 파일과 같은 이름으로 컴파일할 것이다. 또한 기본적으로 CSS `@import` 문을 번들로 포함할 수 있다. [CSS 모듈](https://css-tricks.com/css-modules-part-1-need/)에 대한 지원은 없지만, 이에 대한 계획이 있다.

[esbuild용 플러그인 커뮤니티가 증가](https://github.com/esbuild/community-plugins)하고 있다. 예를 들어 [Vue 단일 파일 컴포넌트](https://github.com/few-far/esbuild-vue-plugin) 및 [Svelte 컴포넌트](https://github.com/EMH333/esbuild-svelte)에 사용할 수 있는 플러그인이 있다.

esbuild는 JSON 파일과 함께 작동하며 구성 없이 자바스크립트 모듈로 번들을 제공할 수 있다.

또한 이미지를 데이터 URL로 변환하거나 출력 폴더로 복사하는 옵션과 함께 JavaScript에서 이미지를 가져올 수 있다. 이 동작은 기본적으로 사용하도록 설정되어 있지 않지만 esbuild config 개체에 다음을 추가하여 옵션 중 하나를 사용하도록 설정할 수 있다.

```js
loader: { '.png': 'dataurl' } // JS 번들에 data url로 변환
loader: { '.png': 'file' } // 출력 폴더로 복사
```

코드 분할은 진행 중인 작업으로 보이지만 대부분 ESM 출력 형식으로 존재하며 프로젝트의 우선 순위로 보인다. tree-shaking은 기본적으로 esbuild에 내장되어 있으며 끌 수 없다는 점도 언급할 가치가 있다.

### 운영 빌드



### 종합