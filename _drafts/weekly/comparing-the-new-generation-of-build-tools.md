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

![esbuild](https://css-tricks.com/wp-content/uploads/2021/03/s_864795E8DFCEBDF45A714B0A68D25726C4192DC77A541292A7CD86FFCB3E5238_1614109612386_esbuildlogo.svg)

esbuild는 [Evan Wallace](https://github.com/evanw)([피그마](https://www.figma.com/)의 CTO)에 의해 만들어졌다. 주요 특징은 노드 기반 번들러보다 10배-100배 빠른 빌드 단계를 제공한다는 것이다. 이 도구는 create-react-app에서 찾을 수 있는 많은 개발자 편의를 제공하지 않는다. 그러나 이러한 공백을 메우기 위해 [create-react-app-esbuild](https://github.com/pradel/create-react-app-esbuild), [estrella](https://github.com/rsms/estrella), 빌드 단계로 esbuild를 사용하는 [Snowpack](https://www.snowpack.dev/)을 포함하여 esbuild 스타터들이 점점 더 많이 생겨나고 있다.

esbuild는 매우 새롭다. 아직 1.0 버전에 도달하지도 않았고 실운영에 사용할 준비가 되지도 않았다. 하지만 머지 않았다. 이 도구는 직관적인 JavaScript 및 명령줄 API를 제공한다.

### 사용 사례

esbuild는 번들러 세계의 게임 체인저이다. esbuild와 노드 번들러 간의 속도 차이가 배가되는 대규모 코드베이스에서 가장 유용할 것이다. esbuild가 1.0에 도달하면 대규모 프로덕션 사이트에서 *매우* 유용할 것이며 빌드가 완료될 때까지 기다리는 시간을 절약할 수 있다. 불행히도 대규모 프로덕션 사이트는 esbuild가 안정될 때까지 기다려야 한다. 그동안 사이드 프로젝트의 번들링 속도를 빠르게 하기 위해 사용하는 것이 좋을 것이다.

esbuild의 번개처럼 빠른 속도는 당신이 하는 모든 종류의 작업에 보너스가 될 것이다. 빌드할때 기다리는 시간을 줄이는것은 개발자 경험에 항상 도움이 된다! 빠른 애플리케이션을 프로토타이핑할 때 esbuild보다 더 높은 수준의 다른것을 원할 수 있다. 하지만 자바스크립트 생태계에서 기대하는 편리함 전에 환경을 구성하고 의존성을 설치하기 위해 더 많은 시간을 써야 할 것이다. 또한 번들 크기를 최대한 최소화하려는 경우에는 Rollup 및 terser를 사용하면 번들 크기가 약간 작아질 수 있다.

### 설치

필자는 원시적인 방법으로 React 프로젝트에 esbuild를 사용하기로 했다. npm을 이용해 esbuild와 React, ReactDOM을 설치했다. `src/app.jsx`파일과 `dist/index.html`파일을 만들었다. 그 후에 `dist/bundle.js` 파일로 컴파일 하기 위해 다음과 같은 커맨드를 사용했다.

```bash
./node_modules/.bin/esbuild src/app.jsx --bundle --platform=browser --outfile=dist/bundle.js
```

`index.html`를 호스팅하고 브라우저로 열었을때 "화이트 스크린" 과 "Uncaught ReferenceError: process is not defined" 콘솔 에러를 마주했다. [이 문서와 CLI 설명 모두 이를 방지하기 위해 해야 할 일을 정확히 설명](https://esbuild.github.io/getting-started/#bundling-for-the-browser)하고 있지만, React를 번들링할 때 추가 인수가 필요하기 때문에 초보자에게는 다소 어려울 수 있다.

다음과 같은 추가 인수가 필요하다.

```bash
--define:process.env.NODE_ENV=\"production\"
```

또한 esbuild를 npm scripts에 포함하려고 한다면 다음과 같이 따옴표 이스케이프 작성해야 한다.

```bash
--define:process.env.NODE_ENV=\\\"production\\\"
```

이 `define` 인수는 브라우저를 위한 노드 환경 변수를 필요로하는 번들된 라이브러리에 필요하다.Vue 2.0도 이를 필요로 한다. Preact는 환경변수가 필요하지 않고 기본적으로 브라우저를 위해 준비된 라이브러리이기 때문에 같은 문제를 겪지 않는다.

`define` 인수로 명령을 실행한 후 "Hello world" React 앱이 완벽하게 작동했다. JSX는 `.jsx` 파일과 함께 작동한다. 즉, React를 수동으로 가져온 다음 JSX를 `React.createElement`로 변환해야 하지만 [JSX에 자동으로 React 추가하거나 Preact를 위해 JSX를 구성하는 방법](https://esbuild.github.io/content-types/#jsx)이 있다.

### 사용법

esbuild는 `--serve`옵션을 통해 개발서버를 제공한다. 개발서버는 모듈들을 파일 시스템을 사용하지 않고 메모리에서 직접 제공한다. 이는 브라우저가 최신 모듈 버전을 가져오는것을 보장한다. 하지만 live/hot reload는 지원하지 않는다. 따라서 저장 후 브라우저를 새로고침 하는 이상적이지 않은 경험을 할 것이다. (역자 주: 새로고침할때마다 새롭게 빌드를 하게 된다.)

필자는 새로운 [감시 기능](https://esbuild.github.io/api/#watch)을 사용하기로 했고 이는 소스파일이 저장될때마다 자동으로 esbuild가 코드를 컴파일 시작시켜준다. 하지만 여전히 저장된 변화를 보려면 서버가 필요했다. 그래서 Luke Jackson의 [servor](https://www.npmjs.com/package/servor)라는 개발 패키지를 사용했다.

```bash
npm install servor --save-dev
```

그런 다음 서버를 시작하기 위해서 esbuild의 자바스크립트 API를 사용하고 동시에 esbuild의 감시 모드를 실행할 수 있다. 프로젝트의 루트에 watch.js라는 파일을 생성하겠다.

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

이제 명령줄에서 `node watch.js`를 실행한다. 이것은 좋은 개발 서버를 제공하지만 hot module replacement 또는 빠르게 새로 고침을 해주지는 않는다(즉, 클라이언트 측 상태가 유지되지 않음). 하지만 테스트하기엔 충분했다.

파일을 저장할 때마다 전체 애플리케이션을 다시 배포하고 있지만, esbuild 속도가 느려지기 전에 상당히 큰 애플리케이션이 필요하다. 이 도구를 설정한 후 변경에 대해 즉각적인 피드백을 받았다. 필자 컴퓨터는 2012년산 인텔 i7을 사용하므로, 최첨단 기계는 확실히 아니다.

live reload 및 일부 React 기본값이 포함된 사전 구성된 esbuild 버전이 필요한 경우 [이 저장소](https://github.com/Elliotclyde/esbuild-react-starter)에서 확인해라.

### 지원 파일

esbuild는 JavaScript에서 CSS를 가져올 수 있다. CSS를 기본 출력 자바스크립트 파일과 같은 이름으로 컴파일할 것이다. 또한 기본적으로 CSS `@import` 문을 번들로 포함할 수 있다. [CSS 모듈](https://css-tricks.com/css-modules-part-1-need/)에 대한 지원은 없지만, 이에 대한 계획이 있다.

[esbuild용 플러그인 커뮤니티가 증가](https://github.com/esbuild/community-plugins)하고 있다. 예를 들어 [Vue 단일 파일 컴포넌트](https://github.com/few-far/esbuild-vue-plugin) 및 [Svelte 컴포넌트](https://github.com/EMH333/esbuild-svelte)에 사용할 수 있는 플러그인이 있다.

esbuild는 JSON 파일과 함께 작동하며 어떤 설정없이도 자바스크립트 모듈로 번들을 제공할 수 있다.

또한 이미지를 데이터 URL로 변환하거나 출력 폴더로 복사하는 옵션과 함께 JavaScript에서 이미지를 가져올 수 있다. 이 동작은 기본적으로 사용하도록 설정되어 있지 않지만 esbuild config 개체에 다음을 추가하여 옵션 중 하나를 사용하도록 설정할 수 있다.

```js
loader: { '.png': 'dataurl' } // JS 번들에 data url로 변환
loader: { '.png': 'file' } // 출력 폴더로 복사
```

코드 분할은 진행 중인 작업으로 보이지만 대부분 ESM 출력 형식으로 존재하며 프로젝트의 우선 순위로 보인다. tree-shaking은 기본적으로 esbuild에 내장되어 있으며 끌 수 없다는 점도 언급할 가치가 있다.

### 운영 빌드

esbuild 커맨드에서 "[minify](https://esbuild.github.io/api/#minify)" 와 "[bundle](https://esbuild.github.io/api/#bundle)"을 사용해도 [Rollup](https://rollupjs.org/)/[Terser](https://terser.org/) 파이프라인 만큼 작은 번들이 생성되지 않는다. esbuild는 가능한 적은 코드를 훑기 때문에 번들 사이즈를 희생한다. 하지만 그 차이는 아주 미미하고, 프로젝트에 따라서 번들링하는 속도가 더 가치가 있다. Snap Shot 어플리케이션에서 esbuild는 177KB의 번들 사이즈가 생성된다. 이 용량은 rollup과 terser를 사용하는 Vite와는 크게 차이나지 않은 용량 사이즈이다.

### 종합

| esbuild |   |
|---|---|
| 다양한 프론트엔드 프레임워크를 위한 템플릿 | ❌ |
| Hot module replacement 개발 서버 | ❌ |
| 스트리밍 가져오기 | ❌ |
| 사전구성된 프로덕션 빌드  | ❌ |
| PostCSS 와 전처리기 자동 변환  | ❌ |
| HTM 변환 | ❌ |
| Rollup 플러그인 지원 | ❌ |
| 용량(기본 설치) | 7.34MB |

esbuild는 강력한 도구이다. 하지만 당신이 평소에 zero-config 설정을 사용했다면 esbuild는 좀 어려울수 있다. 다른 도구가 더 필요하다면 다음 도구인 esbuild를 사용하는 Snowpack을 살펴보길 바란다.

## Snowpack

![Snowpack](https://css-tricks.com/wp-content/uploads/2021/03/s_864795E8DFCEBDF45A714B0A68D25726C4192DC77A541292A7CD86FFCB3E5238_1615316970072_snowpacklogo.svg)

Snowpack은 [Skypack](https://www.skypack.dev/)과 [Pika](https://www.pika.dev/)의 제작자들이 만든 제작 도구이다. Snowpack은 멋진 개발 서버를 제공하며 "[번들하지 않는 개발](https://www.snowpack.dev/concepts/how-snowpack-works#unbundled-development)" 철학으로 만들어졌다. 문서를 인용하자면 "필요해서가 아니라 원하기 때문에 번들러를 사용할 수 있어야 한다."

기본적으로 Snowpack의 빌드 단계는 번들 파일을 단일 패키지로 빌드하지 않지만 브라우저에서 실행되는 번들되지 않은 esmodule을 제공한다. esbuild는 실제로 종속성으로 포함되어 있지만 아이디어는 JavaScript 모듈을 사용하고 필요할 때만 esbuild와 번들로 묶는 것이다.

Snowpack에는 JavaScript 프레임워크와 함께 사용하기 위한 [가이드 목록](https://www.snowpack.dev/guides)과 그에 대한 [여러 템플릿](https://github.com/snowpackjs/snowpack/tree/main/create-snowpack-app)을 포함하여 [꽤 멋진 문서](https://www.snowpack.dev/)가 있다. 몇몇 가이드들은 아직 진행중이지만 [React 가이드](https://www.snowpack.dev/tutorials/react)는 훌륭하다. 또한 Snowpack은 [Svelte를 일급객체 처럼](https://www.snowpack.dev/tutorials/svelte/)다룬다. 필자는 Svelte Summit 2020에서 Rich Harris의 ["미래적 웹 개발"](https://www.youtube.com/watch?v=qSfdtmcZ4d0&t=636s)에서 처음 Snowpack을 들었다. 거기서 말하길 출시예정인 Svelte 메타 프레임워크인 [SvelteKit](https://svelte.dev/blog/whats-the-deal-with-sveltekit)은 Snowpack으로 구동되어야 하지만 이후에 Vite로 전환되었다.(나중에 다뤄볼 예정)

### 사용법

번들되지 않는 배포 환경을 두배로 축소하려는 경우 Snowpack이 좋은 선택이다. 적은 수의 모듈로 소스 코드를 작성할 수 있다. 이는 번들되지 않은 빌드로 큰 요청을 생성하지 않는다는 것을 의미한다. 번들링의 추가 복잡성과 기술적 부채가 필요하지 않다면 Snowpack이 훌륭한 선택이다. 좋은 사용 사례는 프론트엔드 프레임워크를 서버 렌더링 또는 정적 응용 프로그램에 점진적으로 채택하는 경우이다. 노드 생태계에서 가능한 한 적은 도구를 사용하면서 선언적 프론트엔드 프레임워크의 이점을 누릴 수 있습니다.

둘째, Snowpack은 esbuild를 둘러싼 훌륭한 래퍼이다. esbuild를 사용해 보고 싶지만 개발 서버와 프론트엔드 프레임워크용으로 미리 작성된 템플릿도 필요하다면 Snowpack을 사용하는 것이 잘못될 수 없다. Snowpack 구성의 빌드 단계에서 esbuild를 활성화하면 사용할 수 있습니다.

현재 상황에서 필자는 Snowpack이 create-react-app과 같은 구성이 필요 없는 도구에 대한 최상의 대안이 아니라고 생각한다. 왜냐하면 큰 애플리케이션이 있고 매우 멋진 최적화된 프로덕션 준비 빌드 단계가 필요한 경우 플러그인을 가져와서 직접 구성해야 하기 때문이다. 

### 설치

다음 명령으로 Snowpack 프로젝트를 시작해보겠다.

```bash
mkdir snowpackproject
cd snowpackproject
npm init #fill with defaults
npm install snowpack
```

이제 다음 `package.json`을 추가하자.

```json
// package.json
"scripts": {
  "start": "snowpack dev",
  "build": "snowpack build"
},
```

다음 설정파일을 만든다.

```bash
// Mac or Linux
touch snowpack.config.js
// Windows
new-item snowpack.config.js
```

필자는 Snowpack에서 가장 마법같은 부분은 구성 파일에서 키 값 쌍을 설정할때라고 생각된다. 아래 설정을 구성 파일에 붙여넣어보자.

```js
// snowpack.config.js
module.exports = {
  packageOptions: {
    "source": "remote",
  }
};
```

`source: remote`는 [스트리밍 가져오기](https://www.snowpack.dev/guides/streaming-imports#how-streaming-imports-work)를 활성화 시킨다. 스트리밍 가져오기는 Snowpack이 기존 import 구문(예: `import React from 'react'`)을 Skypack에 있는 CDN import 구문으로 변환해서 npm 설치를 우회할 수 있도록 활성화한다.

계속해서 `index.html`파일을 만들자.

```html
<!--index.html-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">>
  <title>Snowpack streaming imports</title>
</head>
<body>
  <div id="root"></div>
  <!-- Note the type="module". This is important for JavaScript module imports. -->
  <script type="module" src="app.js"></script>
</body>
</html>
```

그리고 마지막으로 `app.jsx`파일을 추가한다.

```js
// app.jsx
import React from 'react'
import ReactDOM from 'react-dom'
const App = ()=>{
  return <h1>Welcome to Snowpack streaming imports!</h1>
}
ReactDOM.render(<App />,document.getElementById('root')); 0
```

우리는 React와 ReactDOM을 어떤 단계에서도 설치 하지 않았다. 하지만 Snowpack 개발 서버를 아래와 같이 시작하면 앱이 작동한다!

```bash
./node_modules/.bin/snowpack dev
```

`node_modules`폴더로부터 가져오는것 대신에 Snowpack은 Skypack에서 npm 패키지를 가져온다. Skypack은 npm 레지스트리를 호스팅하는 CDN 이면서 브라우저에서 동작할 수 있도록 사전 최적화를 한다. 그리고 나서 Snowpack은 `./_snowpack/pkg`URL 에서 해당 모듈을 제공한다.

### 사용법

이것은 Node/npm 기반 워크플로에서 크게 벗어나 있다. 우리가 실제로 보고 있는 것은 새로운 **CDN/JavaScript 모듈 기반 워크플로**다.

그러나 앱을 그대로 실행시키고 프로덕션 빌드를 진행하면 Snowpack은 오류가 발생한다. 빌드시에 React와 ReactDOM의 어떤 버전을 사용할 것인지 알아야 하기 때문이다. 이 문제를 해결하기 위해선 다음 커맨드를 실행시켜 `snowpack.deps.json`	에 자동적으로 의존성 모듈의 버전을 명시해주어야 한다.

```bash
./node_modules/.bin/snowpack add react
./node_modules/.bin/snowpack add react-dom
```

위 실행은 npm에서 패키지를 다운로드 하지 않고 단지 Snowpack 빌드를 위해 패키지 버전을 기록한다.

한 가지 주의할 점은 Skypack이 패키지의 프로덕션 버전을 제공하기 때문에 개발자 오류 메시지를 놓친다는 것이다.

스트리밍 가져오기를 사용하지 않더라도 Snowpack 개발 서버는 node_modules의 각 종속성마다 하나의 JavaScript 파일로 묶고 해당 파일을 기본 JavaScript 모듈로 변환한 다음 브라우저에 제공한다. 즉, 브라우저는 이러한 스크립트를 캐시하고 스크립트가 변경된 경우에만 다시 요청할 수 있다. 개발 서버는 저장 시 자동으로 새로 고침되지만 클라이언트 측 상태는 유지되지 않는다. node의 모든 종속성은 레거시 모듈 형식 또는 노드 API(예: esbuild에서 문제가 발생한 악명 높은 process.env)를 사용하는지 여부에 관계없이 즉시 작동하는 것처럼 보였다.

React에서 클라이언트 측 상태를 유지하려면 [react-refresh](https://www.skypack.dev/view/@snowpack/plugin-react-refresh)가 필요하며, 종속성으로 몇 가지 자체 Babel 패키지가 필요하다. 이것들은 기본적으로 포함되어 있지 않지만 가장 기능이 많은 React 템플릿을 사용하여 사용할 수 있다. 템플릿은 80MB의 총 노드 종속성 패키지이고 react-refresh, Prettier, Chai 및 React Testing Library를 가져온다.

```bash
npx create-snowpack-app my-react-project --template @snowpack/app-template-react
```

### 지원 파일

JSX가 지원되지만 기본적으로 `.jsx` 파일만 지원된다. Snowpack은 React 또는 Preact가 사용 중인지 여부를 자동으로 감지하고 그에 따라 JSX 변환에 사용할 렌더링 기능을 결정한다. 그러나 이것보다 더 JSX를 커스터마이징 하려면 [플러그인](https://www.npmjs.com/package/@snowpack/plugin-babel)을 통해 Babel을 가져와야 한다. [Vue 단일 파일 컴포넌트에 사용할 수 있는 Snowpack 플러그인](https://www.npmjs.com/package/@snowpack/plugin-vue)이 있고 [Svelte 컴포넌트용 플러그인](https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-svelte)도 있다. 또한 Snowpack은 TypeScript를 컴파일하지만 유형 검사를 위해서는 [TypeScript 플러그인](https://www.npmjs.com/package/@snowpack/plugin-typescript)이 필요하다.

CSS는 자바스크립트로 가져올 수 있고 런타임에 `<head>`구문에 삽입된다. 또한 확장자가 `.module.css`인 CSS 모듈도 기본적으로 지원됩니다.

JSON 파일은 기본 내보내기를 사용해서 JavaScript 모듈에서 객체로 사용할 수 있다. Snowpack은 이미지를 지원하고 프로덕션 폴더에 복사한다. 번들하지 않는다는 철학으로 Snowpack은 번들에 이미지를 데이터 URL로 포함하지 않는다.

### 프로덕션 빌드

기본 `snowpack build` 명령은 기본적으로 정확한 소스 파일 구조를 출력 폴더에 복사한다. JavaScript로 컴파일되는 파일(예: TypeScript, JSX, JSON, .vue, .svelte)의 경우 각 개별 파일을 별도의 브라우저 친화적인 JavaScript 모듈로 변환한다.

이 빌드는 잘 작동하지만 소스 코드가 많은 파일로 분할되는 경우 많은 요청이 발생할 수 있으므로 프로덕션에는 적합하지 않다. Snap Shot 어플리케이션에서 결국 184KB의 소스 파일을 요청했고 Skypack에서 또 다른 105KB의 종속성을 요청하여 꽤 거대한 요청을 만들었다.

그러나 Snowpack은 esbuild를 종속성으로 가지고있고 Snowpack 구성파일에 "optimize" 객체를 추가하여 esbuild가 코드를 번들, 축소 및 컴파일하도록 할 수 있다.

```js
// snowpack.config.js
module.exports = {
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
  },
};
```

esbuild에서 제공하는 최적화 기능을 사용하여 코드를 실행하므로 이러한 옵션을 추가하기만 하면 이전에 esbuild에서 사용했던 것과 동일한 빌드를 얻을 수 있다.

esbuild가 아직 버전이 1.0이 되지 않았기 때문에 Snowpack은 프로덕션 빌드에 [webpack](https://www.npmjs.com/package/@snowpack/plugin-webpack) 또는 [Rollup](https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle) 플러그인을 사용할 것을 권장한다. 둘 다 별도의 구성이 필요하다.


### 종합

Snowpack은 모든 기능을 갖춘 개발 서버, 자세한 문서 및 설치가 쉬운 템플릿을 통해 가벼운 개발자 경험을 제공한다. 애플리케이션을 번들로 묶을 것인지 여부와 어떻게 할 것인지 결정해야 한다. 개발 서버와 보다 독창적인 빌드 단계를 모두 제공하는 도구를 원한다면 목록에 있는 다음 도구인 Vite를 살펴보길 바란다.

| Snowpack |   |
|---|---|
| 다양한 프론트엔드 프레임워크를 위한 템플릿 | ✅ |
| Hot module replacement 개발 서버 | ✅ (템플릿을 이용할때 가능) |
| 스트리밍 가져오기 | ❌ |
| 사전구성된 프로덕션 빌드  | ❌ |
| PostCSS 와 전처리기 자동 변환  | ❌ |
| HTM 변환 | ❌ |
| Rollup 플러그인 지원 | ✅ (빌드 시에[snowpack-plugin-rollup-bundle](https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle)사용 가능) |
| 용량(기본 설치) | 16MB |

## Vite

![Vite](https://css-tricks.com/wp-content/uploads/2021/03/s_864795E8DFCEBDF45A714B0A68D25726C4192DC77A541292A7CD86FFCB3E5238_1614109678811_vitelogo.svg)

Vite는 Vue 제작자인 (그리고 [Hades speedrunner](https://mobile.twitter.com/youyuxi/status/1331084461652516864))Evan You가 개발했다. esbuild가 빌드 단계에 집중하고 Snowpack이 개발서버에 집중하는 반면 Vite는 개발서버와 Rollup을 이용한 최적화된 빌드 커맨드 모두를 지원한다. 

### 사용 사례

당신이 진지하게 create-react-app 또는 Vue CLI를 경쟁자를 원한다면 Vite가 이 모든 작업을 수행할수 있기 때문에 가장 가까운 경쟁자 이다. 빠른 개발 서버와 구성이 필요 없는 최적화된 프로덕션 빌드는 어떤 구성없이도 제로에서 프로덕션을 만들 수 있다는 의미이다. Vite 작은 사이드 프로젝트나 큰 프로덕션 어플리케이션 모두 사용할수 있는 도구이다. Vite의 좋은 사용 사례는 크기가 큰 단일 페이지 앱이다.

Vite를 사용하지 않는 이유는 무엇일까? Vite는 그들만의 방법을 고수하는 도구이며 당신은 그 의견에 대해 동의하지 않을 수 있다. 빌드를 할때 Rollup을 사용하고 싶지 않을 수도 있고(우린 esbuild가 얼마나 빠른지에 대해 이야기 했다.) 또는 Babel, eslint, webpack loader 생태계의 모든 기능을 즉시 사용할 수 있는 도구를 원할 수도 있다.

또한 구성이 없는 서버 측 렌더링 메타 프레임워크를 원한다면 Vite 서버 측 렌더링에 대한 이야기가 더 완성될 때까지 Nuxt.js 및 Next.js와 같은 웹팩 기반 프레임워크를 유지하는 것이 좋다.

### 설치

Vite는 esbuild 및 Snowpack보다 더 독단적인 기본값을 가지고 있다. [문서](https://vitejs.dev/)는 명확하고 상세하다. Evan이 제작자인 만큼 Vue에 대한 전폭적인 지원을 받고 있으므로 Vite는 Vue 개발자들에게 있어 확실한 행복한 도구이다. 즉, Vite는 모든 프론트 엔드 프레임워크와 함께 사용할 수 있으며 시작하기 위한 [템플릿 목록](https://github.com/vitejs/vite/tree/main/packages/create-app)도 제공한다.

### 사용법

Vite의 개발 서버는 꽤 파워풀하다. Vite는 프로젝트의 모든 의존성을 esbuild로 단일 기본 자바스크립 모듈로 미리 번들로 묶게된다. 그 후에 많이 캐시된 HTTP 헤더와 함께 제공된다. 즉, 첫 페이지 로드 후 가져온 종속성을 컴파일, 제공 또는 요청하는 데 시간이 낭비되지 않는다. 또한 Vite는 명확한 에러 메세지들을 제공하고 문제를 해결하기 위해 정환한 코드 블록과 줄 번호를 보여준다. 다시 Vite를 사용하면 노드 API 또는 레거시 형식을 사용하는 종속성을 가져오는 데 문제가 없었다. 그것들은 모두 브라우저에서 허용되는 esmodule에 끼워져 있는 것처럼 보였다.

Vite의 React 및 Vue 템플릿은 모두 핫 모듈 교체를 가능하게 하는 플러그인을 가지고있다. Vue 템플릿은 [단일 파일 컴포넌트용 Vue 플러그인](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)과 [JSX용 Vue 플러그인](https://github.com/vitejs/vite/blob/main/packages/plugin-vue-jsx/package.json)을 가지고있다. React 템플릿은 [react-refresh 플러그인](https://github.com/vitejs/vite/tree/main/packages/plugin-react-refresh)을 가지고있다. 어느 쪽이든 둘 다 핫 모듈 교체 및 클라이언트 측 상태 보존을 제공한다. 물론 Babel 패키지를 포함하여 몇 가지 종속성을 추가하지만 Vite에서 JSX를 사용할 때 Babel은 실제로 필요하지 않는다. 기본적으로 JSX는 esbuild 와 동일한 방식으로 작동한다. 즉, 	`React.createElement`로 변환된다. React를 자동으로 가져오지는 않지만 자동으로 가져올수 있도록 동작을 구성할 수 있습니다.

Vite는 Snowpack 및 wmr과 같은 스트리밍 가져오기를 지원하지 않습니다. 이는 평소와 같이 npm 설치 종속성을 의미한다.

한 가지 멋진 점은 Vite에 서버 측 렌더링에 대한 [실험적 지원](https://vitejs.dev/guide/ssr.html)이 포함되어 있다는 것이다. 원하는 프레임워크를 선택하고 클라이언트에 직접 제공되는 정적 HTML을 생성한다. 현재로서는 이 아키텍처를 자체적으로 구성해야 할 것 같지만 여전히 Vite 위에 메타 프레임워크를 구축할 수 있는 좋은 기회이다. Evan You는 이미 [VitePress](https://vitepress.vuejs.org/)라는 작업을 진행 중이며 Vite를 사용하는 이점이 있는 [VuePress](https://vuepress.vuejs.org/)를 대체한다. 그리고 Sveltekit은 [Vite를 종속성 목록에 추가](https://svelte.dev/blog/sveltekit-beta)했다. [CSS 코드 분할](https://vitejs.dev/guide/features.html#css-code-splitting) 포함하고 있는 것이 Sveltekit이 Vite로 전환한 이유의 일부인 것 같다.

### 지원 파일

CSS의 경우 Vite는 우리가 보고 있는 모든 도구 중에서 가장 많은 기능을 제공한다. CSS 가져오기 및 CSS 모듈 번들을 지원한다. npm으로 PostCSS 플러그인을 설치하고 `postcss.config.js` 파일을 생성할 수도 있다. 그러면 Vite가 자동으로 이러한 변환을 CSS에 적용하기 시작한다.

CSS 전처리기를 설치하고 사용할 수 있다. npm으로 전처리기를 설치하고 파일 이름을 적절한 확장자(예: `.filename.scss`)로 바꾸면 Vite가 해당 전처리기를 적용하기 시작한다. 그리고 개요에서 말했듯이 Vite는 CSS 코드 분할을 지원한다.

이미지 가져오기는 기본적으로 공개 URL이지만 URL 문자열 끝에 `?raw` 매개변수를 사용하여 번들에 문자열로 로드할 수도 있다.

JSON 파일을 소스로 가져와 단일 객체를 내보내는 esmodule로 변환할 수 있다. 또한 이름있는 가져오기를 제공할 수 있으며 Vite는 가져올만한 파일만 찾고 나머지를 트리쉐이킹 하기 위해서 JSON 파일의 루트 필드를 찾을 수 있다.

### 프로덕션 빌드

Vite는 여러 가지 최적화가 포함된 사전 구성된 프로덕션 빌드에 Rollup을 사용한다. 대부분의 사용 사례에 충분히 대응하기 위해 제로 구성 빌드를 의도적으로 제공한다.

빌드에는 번들링, 축소 및 트리 쉐이킹과 같은 Rollup 기능이 포함되어 있다. 뿐만 아니라 분할된 코드의 동적 가져오기 및 우리가 자바스크립트 모듈을 요청하면 가져올 수 있는 방법인 "비동기 청크 로드", 빌드는 동시에 비동기 식으로 로드하도록 사전 최적화 된다.

Snap Shot 앱으로 Vite의 기본 빌드를 실행하면 하나의 5KB JavaScript 파일과 하나의 160KB JavaScript 파일(총 165KB)로 끝났고 프로젝트의 모든 CSS는 자동으로 작은 2.71KB 파일로 축소되었다.

### 종합

그들만의 방식을 고수하는 Vite의 특성은 현재 우리의 도구와 심각한 경쟁이 되는 도구이다. 개발자 경험을 정말 매끄럽게 만들고 즉시 프로덕션 준비가 된 빌드를 만들기 위해 많은 작업이 수행 되었다.

| Vite |   |
|---|---|
| 다양한 프론트엔드 프레임워크를 위한 템플릿 | ✅ |
| Hot module replacement 개발 서버 | ✅ (템플릿을 이용할때 가능) |
| 스트리밍 가져오기 | ❌ |
| 사전구성된 프로덕션 빌드  | ✅ |
| PostCSS 와 전처리기 자동 변환  | ✅ |
| HTM 변환 | ❌ |
| Rollup 플러그인 지원 | ✅ |
| 용량(기본 설치) | 17.1MB |

## wmr

![wmr](https://css-tricks.com/wp-content/uploads/2021/03/s_864795E8DFCEBDF45A714B0A68D25726C4192DC77A541292A7CD86FFCB3E5238_1614109766330_wmrlogo.svg)

Vite와 마찬가지로 wmr은 개발 서버와 빌드 단계를 모두 제공하는 또 다른 독창적인 빌드 도구이다. [Preact](https://preactjs.com/)의 창시자인 [Jason Miller](https://twitter.com/_developit)가 만들었기 때문에 Preact 개발자에게는 분명히 행복한 길이다. Jason Miller는 wmr이 [JS Party 팟캐스트에 게스트로 출연했을 때 생각을 설명](https://changelog.com/jsparty/158)했다.

> Preact는 작고 가벼운 프로젝트를 수행하려는 경우에 정말 좋다. 이를 위한 도구는 어디에 있을까? 우리는 많은 유명 사이트에서 프로덕션에 사용되는 웹팩 기반 도구를 가지고 있지만 그것은 무거운 도구다. 프로토타이핑 도구는 어디에 있을까? 웹팩이 한 부분을 차지한다. 반면 다른 한 부분은 저와 우연히 Preact 팀에 있었던 많은 사람들입니다. 우리는 번들러 생태계를 잠시동안 방관하고 있었다. 우리는 현대화 코드를 작성하고 제공하는 이런 아이어를 더 발전시키기 위해 의견을 모으자고 사람들에게 촉구한다.
