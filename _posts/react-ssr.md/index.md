---
title: react SSR
date: "2020-04-23T10:00:03.284Z"
---

이 글은 벨로퍼트님의 `리액트를 다루는 기술` 책의 SSR 부분을 핵심만 요약한 글입니다.
SSR의 흐름을 알기 쉽게 보기 위해서 정리합니다.

## 정의

SSR은 `Server Side Rendering` 으로 서버에서 HTML 코드를 만들어서 응답으로 보내주는 형식을 말합니다.
기존의 SPA의 경우에는 `Client Side Rendering` 을 사용하고 있고 SSR과 CSR은 장단점을 지니고 있습니다.

## 기본 요약

1. `index.server.js` 를 만들어 `ReactDOMServer.rednerToString` 으로 JSX를 마크업으로 만들어 줍니다.
2. 서버 코드에서 응답으로 만들어진 마크업을 전달합니다.
3. 빌드 된 JS, CSS 파일은 파일명이 매번 바뀌기 때문에 `asset-manifest.json` 파일을 참고해서 만들 마크업에 link, script 태그를 이어줍니다.
4. `Router` 는 `StaticRouter`의 `location props`를 가지고 라우팅 처리를 합니다.

## 데이터 로딩 요약

SSR에서는 라이프 사이클 메서드가 동작하지 않고, 데이터가 바뀐다고 해도 re-Rendering이 되지 않으므로
마크업을 만들어서 응답하기 전에 필요한 API 데이터를 미리 다 불러와야 합니다.

### redux-thunk

- 불려져야 하는 API 함수 (`promise`) 들을 Preload 컴포넌트를 이용해 `React Context`에 하나하나 쌓아 둡니다.
- 마크업을 만들기 전에 해당 `Promise.all` 을 이용해서 promise 들을 실행시키며 이 `promise` 들은 `redux reduce` 에서 api 호출 및 저장이 됩니다.
- 최종 마크업을 만들어 줍니다.
- `redux thunk`(액션함수)를 `dispatch` 의 인자로 넘기면 `promise`가 반환됩니다.

1. `PreloadContext` 를 만들어 줍니다.
2. `Preload` 컴포넌트는 초기 데이터를 받아야 할 리턴이 `promise`인 함수를 `props`로 받아 해당 `Context state`에 넣어두는 로직을 구성합니다.
3. 각 컨테이너 컴포넌트에서 `Preload`가 필요한 곳에 넣어줍니다.
4. 이때, 라이프 사이클에서 마운트 에서 호출하던 (`useEffect, componentDidMount`) API 호출은 데이터가 유효하면 호출하지 않도록 분기를 쳐 둡니다.
5. JSX를 만들고 나서 `ReactDOMServer.renderToStaticMarkup()` 메서드를 활용해서 초기 데이터를 불러오게끔 하는 렌더링을 진행합니다.
6. `Promise.all()`로 `PreLoadContext`의 `promise list` 들을 실행합니다.
7. 마지막으로 `ReactDOMServer.renderToString()`으로 마지막 최종 렌더링을 진행해서 응답해줍니다.

### redux-saga

- saga도 똑같이 `Preload` 컴포넌트를 사용합니다.
- 유효성 검사 후 에 null 처리 할 곳에 `Preload` 컴포넌트를 사용합니다.
- 서버 코드 내에서 `sagaMiddleware.run(rootSaga).toPromise()` 를 이용해서 saga Task들을 promise로 만들어줍니다.
- 서버 코드 내에서 `store.dispatch(END)` 코드를 넣어서 saga가 액션을 모니터링 하는것을 방지합니다.
- `thunk` 에서 `Promise.all()` 하는 곳 바로 위에 `await sagaMiddleware.run(rootSaga).toPromise()` 넣어주고 진행 중이던 사가들이 모두 끝날때 까지 기다려줍니다.

## 서버 사이드 렌더링과 코드 스플리팅

이 부분이 중요한 이유는 서버 사이드 렌더링해서 전부 렌더링이 진행 된 이후 클라이언트 사이드에서 js가 다 불러져 온 뒤로 다시 비동기로 컴포넌트를 불러올때 깜빡임이 발생 하기 때문입니다.

- `Loadable Components`를 사용할 것을 권장하고 있습니다.
- 서버 유틸 함수, 웹팩 플러그인, babel 플러그인을 제공합니다.
- 페이지 컴포넌트를 `loadable()` 메서드로 감싸서 Route에 적용합니다.
- 웹팩과 바벨을 설정하면 `loadable-stats.json` 이라는 파일이 만들어 집니다.
- `loadable-stats.json` 이 파일은 각 컴포넌트 코드가 어떤 청크파일에 들어가 있는지에 대한 정보를 가지고 있다고 보면 됩니다.
- 서버 사이드 렌더링을 할 때 이 파일을 참고하여 어떤 컴포넌트가 렌더링 되었는지에 따라 어떤 파일들을 사전에 불러와야 할지 설정할 수 있습니다.

## loadableReady & hydrate

- `Loadable Component`를 사용하면 성능 최적화를 위해 js 파일을 모두 불러오는데 이때 모든 js 파일이 로딩되고 나서 렌더링을 할 수있도록 하는 것이 `loadableReady` 입니다.
- 추가로 `render()` 메서드가 아닌 `hydrate()` 메서드가 존재하는데 이것은 기존에 존재하는 UI에 이벤트만 연동하여 성능을 최적화 시켜줍니다. 하지만 기존에 존재하는 UI 와 `hydrate()` 메서드에서 비교하려는 컴포넌트랑 다르면 에러가 뜬다는 사실이 있습니다.
