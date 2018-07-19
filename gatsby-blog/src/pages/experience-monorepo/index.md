---
title: experience monorepo
date: "2018-07-13T10:00:03.284Z"
---

## intro

* 공통모듈을 한 repo 에서 관리 하는 시도를 해보자.
* 여러 npm 패키지를 하나의 github repo 에서 관리하자.
* 즉, monorepo 를 구축해서 공통모듈을 관리하는 환경을 만들자.

## monorepo 의 이점

* lint 나 build, test, release 프로세스를 한가지로 가져갈수 있다.
* 개발 환경을 따로 구축할 수고를 덜어준다.
* devDependency 를 한곳에서 관리 할 수 있다.
* 여러 이슈를 중앙에서 관리할 수 있다.

## monorepo 의 단점

* 한 repo 가 커질 수 있다.

## monorepo 를 사용하고 있는 곳

* babel
* react
* etc..

## monorepo 를 사용할 수 있는 수단.

* lerna [https://lernajs.io/](https://lernajs.io/)
* yarn workspace [https://yarnpkg.com/lang/en/docs/workspaces/](https://yarnpkg.com/lang/en/docs/workspaces/)
* git sub-modules

## lerna

각각의 독립적인 버젼을 가지고 있는 큰 코드베이스 분리는 코드 공유에 큰 이점을 가진다.
하지만 많이 얽혀져있는 repositories 는 추적하기도 어렵고 지저분합니다. 그리고 테스팅도 복잡해집니다.

이 문제를 해결하기 위해 몇몇 프로젝트는 multi-package repositories 를 설계하고(monorepos 라고 불리움) Babel, React, Angular, Ember, Meteor, Jest 프로젝트들이 싱글 repository 안에 그들의 모든 패키지들을 관리합니다.

lerna 툴은 git 및 npm 을 사용하여 multi-package repositories 를 관리하는 작업을 최적화 하는 도구이다.

Lerna 는 또한 개발 및 빌드 환경에서 패키지의 수많은 복사본에 대한 시간과 공간을 줄여줍니다.

### lerna 명령어 사용법

* lerna 초기화 및 independent 모드로 실행

```sh
$ lerna init -i
```

* 각 패키지 안에 들어있는 모듈의 npm install 을 실행

```sh
$ lerna bootstrap
```

* 각 패키지들이 마지막 릴리즈 이후에 변화가 있었는지 체크

```sh
$ lerna updated
```

* 각 패키지 안에 있는 npm script 를 한번에 run 시켜줌.

```sh
$ lerna run [script]
```

* 모듈간의 의존성 추가

```sh
## moduleb 의 package.json에 dependency에 modulea 추가
$ lerna add modulea --scope=moduleb

## moduleb 의 package.json에 devDependency에 modulea 추가
$ lerna add modulea --scope=moduleb --dev

## 모든 모듈 package.json에 devDependency에 moduleb 추가
$ lerna add modulea
```

* 배포 ( git 및 npm )

```sh
## git 뿐만 아니라 npmjs 에도 배포 ( npm publish )
$ lerna publish

## npm 생략 ( 대신 git 에도 올라가지 않음 )
$ lerna publish --skip-npm

## 이렇게 publish 하면 package.json 의 버전이 업데이트가 되고
## 그에 관련된 의존성있던 모듈들의 package.json의 devDependency 나 dependency의 해당 모듈의 버젼도 업데이트 시켜준다.
```

* 자세한건 lerna 공식 홈페이지 참조.
  [https://lernajs.io/](https://lernajs.io/)

### lerna json 셋팅

* version: 현재 repository 버젼
* packages: packages 경로, 배열과 glob 사용.
* command.publish.ignoreChanges: `lerna changed/puslish` 할때 포함시키지 않을 파일
* command.bootstrap.ignore: `lerna bootstrap` 명령어 사용할시 bootstrap 안할 리스트 , 배열과 glob 사용
* command.bootstrap.scope: `lerna bootstrap` 명령어 사용할시 packages 들의 영역을 지정한다. 배열과 glob 사용.

### lerna 장점

* 공통의 devDependencies 를 가질수 있다.
  * 대부분의 devDependencies 를 root repo 에서 당겨 받을수 있다.
  * 모든 패키지들은 같은 버젼의 dependency 로 사용할 수 있다.
  * 스토리지를 적게 들수있다.

## yarn Workspaces

Yarn Workspaces 는 단일 루트 package.json 파일의 하위 폴더에있는 여러 package.json 파일의 종속성을 모두 한 번에 설치할 수있는 기능입니다.

또한 워크스페이스들 간의 중복된 package 를 막아주므로써 가볍고, Yarn 은 서로 의존하는 Workspace 간에 심볼릭 링크를 만들 수 있으며 모든 디렉토리의 일관성과 정확성을 보장합니다.

Yarn Workspaces 는 lerna 툴 처럼 사용할 수 있는 low-level 의 primitives 이다.
lerna 가 제공하는 high-level 의 특징들을 제공하진 않지만, 코어로직의 실행과 linking steps 로 더 향상된 퍼포먼스를 제공할 수 있다.

### yarn Workspaces setting

* root 에 있는 package.json 에 아래와 같이 셋팅한다.

```javascript
{
  "private": true,
  "workspaces": ["workspace-a", "workspace-b"]
}
```

* 각 워크스페이스의 package.json 은 아래와 같이 셋팅한다.

아래 보면 줄일 수 third-party dependecies 들이 보인다.
Workspaces 를 활성화 시키면 yarn 은 dependency 구조를 좀더 최적화 시켜준다.

```javascript
// workspace-a/package.json:

{
  "name": "workspace-a",
  "version": "1.0.0",

  "dependencies": {
    "cross-env": "5.0.5"
  }
}
```

```javascript
// workspace-b/package.json:

{
  "name": "workspace-b",
  "version": "1.0.0",

  "dependencies": {
    "cross-env": "5.0.5",
    "workspace-a": "1.0.0"
  }
}
```

* 마지막으로 `yarn install`을 진행하면 아래와 같은 계층을 얻을수 있다.

`yarn install`시 패키지들의 있는 모듈들을 root 디렉토리쪽으로 hoisted 시켜준다.
대신 버젼이 다른 dependency 에 한해서는 hoisted 시켜주지 않는다.

이것은 lerna 의 bootstrapping 의 `--hoint` flag 효과와 같다.

```sh
/package.json
/yarn.lock

/node_modules
/node_modules/cross-env
/node_modules/workspace-a -> /workspace-a

/workspace-a/package.json
/workspace-b/package.json
```

* 위 처럼 적용이 될때 workspace-b 에있는 파일에서 workspace-a 를 요구하면 현재 Github 에 게시 된 코드가 아니라 프로젝트 내부에있는 정확한 코드가 사용되며 cross-env 패키지가 올바르게 중복 제거되어 프로젝트의 루트에 놓입니다.

* lerna 2.0.0 에선 lerna 커맨드 이용시 `--use-workspace` flag 를 사용하면 프로젝트의 bootstrap 을 Yarn 을 사용하게 된다. 이렇게 되면 `packages.json/workspaces` 필드에 `lerna.json/packages` 대신에 packages 라는 필드를 찾는다.

lerna.json 파일로 설정하는 방법은 아래와 같다.

```javascript
{
  ...
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

## 결론

* lerna 와 yarn workspace 를 사용하면 중복되는 dependency 에 관해서 관리를 할 수 있다.
* yarn workspace 와 lerna 는 쉽게 통합될수 있다.
* lerna 를 이용하면 yarn workspace 에서 할수 없는 다양한 기능들을 사용할 수 있다. ( testing, 배포 , 버젼관리 , 패키지별 scripting 명령)
* 같은 환경속에서 여러가지 dependency 를 가지고 여러 패키지들을 다룬다면 monorepo 를 사용할만 할것 같다.
