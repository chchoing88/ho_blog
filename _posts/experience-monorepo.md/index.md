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

`lerna 3.0 이상을 기준으로 합니다.`

### lerna 명령어 사용법

* lerna 초기화 및 independent 모드로 실행

```sh
$ lerna init -i
```

* 각 패키지 안에 들어있는 모듈의 npm install 을 실행

```sh
$ lerna bootstrap
# 1. 각 패키지의 모든 외부 dependecies를 npm install 해준다.
# 2. 서로의 dependencies들을 가지고 있는 package들을 Symlink 해준다.
# 3. 모든 bootstrap 당한 packaged들을 npm run prepublish를 실행한다. ( --ignore-prepublish가 없을경우)
# 4. 모든 bootstrap 당한 packaged들을 npm run prepare를 실행한다.

$ lerna bootstrap --hoist [glob]
# glob에 매칭된 모든 외부 dependencies들을 repo의 root에 설치해준다. 
# 이 dependencies들은 node_moules/.bin/ 디렉토리에 연결되고 npm script가 가능하게 해준다. 
```

여기서 hoist를 사용하게 되면 다음과 같은 수행을 하게 됩니다.
  - 공통된 dependencies들을 오직 top-level의 node_modules에 설치하고 각각의 package에의 node_modules에서 생략됩니다.
  - 서로 다른 버젼을 가진 package들은 각 로컬에 정상적으로 설치하게 됩니다.
  - 공통 패키지들의 바이너리 파일들은 개별 패키지의 node_modules/.bin/ 디렉토리와 심볼릭 링크되어 있으므로 package.json 스크립트를 수정없이 사용할수 있다.

Node module resolution algorithm에 따르면 패키지 A를 찾으려고 할때 가장먼저 node_modules/A 를 찾고 그 후엔 ../node_modules/A, ../../node_modules/A, ../../../node_modules/A 이런식으로 상위 폴더의 node_modules를 찾곤한다. 

하지만 특히 dependencies들이 local에 있다고 구체적으로 가정하거나 요구하는 경우에는 위 룰을 따르지 않는다. 그래서 이 문제를 해결하기 위해선 top-level에 있는 패키지를 각 패키지 node_module 디렉토리에 symlink 하는 방법이 있다. 하지만 lerna에선 지원하지 않는다.

* 각 패키지들이 마지막 릴리즈 이후에 변화가 있었는지 체크

```sh
$ lerna updated
```

* 각 패키지 안에 있는 npm script 를 한번에 run 시켜줌.

```sh
$ lerna run [script]

$ lerna run --scope my-component test
```

* 각 패키지 안에서 쉘 스크립트를 실행할수 있다.

```sh
$ lerna exec [command]
## ex) lerna exec rm -rf ./node_modules
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

* 버젼을 수정합니다.

```sh
$ lerna version 1.0.1 # explicit
$ lerna version patch # semver keyword
$ lerna version       # select from prompt(s)
```
해당 버젼을 수행하면 다음과 같은 일이 일어난다.

1. 이전 태그 릴리즈 이전부터의 지금까지의 변경사항을 확인한다.
2. 새로운 버젼에 대한 프롬프트 안내를 한다.
3. 새로운 릴리즈 정보를 반영한 패키지를 수정한다.
4. 변경사항을 커밋하고 그 커밋에 태그를 단다.
5. git remote에 push한다.

`주의` : version 명령시에 git push를 할 수 있는 상태가 되어야 한다. 이미 push를 다 해버린 상태라면 push를 할 수가 없다고 에러가 뜬다.

그래서 수동으로 package.json의 version 을 내리고 다시 lerna version으로 올리는 방법이 있겠다. 
그전에 git tag -d 로 기존에 있던 tag들은 없앤다.

* 배포 ( git 및 npm )

```sh

$ lerna publish
## git 뿐만 아니라 npmjs 에도 배포 ( npm publish )

$ lerna publish --skip-npm ## Deprecated
## npm 생략 ( 대신 git 에도 올라가지 않음 )
## 이렇게 publish 하면 package.json 의 버전이 업데이트가 되고
## 그에 관련된 의존성있던 모듈들의 package.json의 devDependency 나 dependency의 해당 모듈의 버젼도 업데이트 시켜준다.

$ lerna publish from-git 
## explicitly publish packages tagged in current commit
## lerna version을 별도로 수행하지 않고 현재 있는 태그로 publish를 도와준다. 
## 주의할 점은 현재 커밋의 tagged를 배포한다는 것이다. 커밋만 있고 Annotated tag가 없다면 
## No tagged release found 라는 메세지가 뜨면서 배포가 되질 않는다.
## 그냥 커밋만 했을시엔 lerna publish 를 실행시켜서 다시 version 을 수정해주어야 한다.

$ lerna publish from-package
# explicitly publish packages where the latest version is not present in the registry
# 각 package.json을 확인해서 version이 registry에 있지 않은 가장 마지막 커밋을 배포한다. 
# 이는 이전 lerna publish가 모든 패키지 등록을 실패했을때 유용하게 사용할 수 있다.
```

* 패키지 모듈 생성 

```sh
$ lerna create test1

## lerna로 관리될 패키지 모듈 생성
## test1이라는 폴더 이름으로 packages 폴더 안에 생성된다. 
```

`참고 1` : lerna 의 version 과 changed 의 기준은 최신 Annotated tag를 기준으로 한다. npm version 과 lerna version 의 경우 자동으로 Annotated tag를 생성해준다. ( npm version 의 경우 git 사용시 )

`참고 2` : npm version 과 publish 는 git 이랑 무관하게 사용할 수 있다. 

`참고 3` : npm publish 의 경우에는 오로지 npm package.json의 version 만 보고 해당 버져닝으로 배포한다. 

* 자세한건 lerna 공식 홈페이지 참조.
  [https://lernajs.io/](https://lernajs.io/)

### lerna json 셋팅

* version: 현재 repository 버젼
* packages: packages 경로, 배열과 glob 사용.
* command.publish.ignoreChanges: `lerna changed/puslish` 할때 포함시키지 않을 파일
* command.bootstrap.ignore: `lerna bootstrap` 명령어 사용할시 bootstrap 안할 리스트 , 배열과 glob 사용
* command.bootstrap.scope: `lerna bootstrap` 명령어 사용할시 packages 들의 영역을 지정한다. 배열과 glob 사용.
* command.bootstrap.npmClientArgs: `lerna bootstrap` 명령 사용할시 `npm install`에 직접 넘겨야할 인자들을 배열로 받는다.


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

```javascript
// package.json 에 아래와 같이 설정
"workspaces": [
    "packages/*"
  ],
```

```javascript
// jest-matcher-utils package.json
{
  "name": "jest-matcher-utils",
  "description": "...",
  "version": "20.0.3",
  "license": "...",
  "main": "...",
  "browser": "...",
  "dependencies": {
    "chalk": "^1.1.3",
    "pretty-format": "^20.0.3"
  }
}
```

```javascript
// jest-diff package.json
{
  "name": "jest-diff",
  "version": "20.0.3",
  "license": "...",
  "main": "...",
  "browser": "...",
  "dependencies": {
    "chalk": "^1.1.3",
    "diff": "^3.2.0",
    "jest-matcher-utils": "^20.0.3",
    "pretty-format": "^20.0.3"
  }
}
```

위와 같이 설정 후 각 패키지 모듈안에서 `yarn install` 명령을 실행하면 아래와 같은 구조를 만들어준다.
아래 구조에서 symlink를 잘 보자!!

```
| jest/
| ---- node_modules/
| -------- chalk/
| -------- diff/
| -------- pretty-format/
| -------- jest-matcher-utils/  (symlink) -> ../packages/jest-matcher-utils
| ---- package.json
| ---- packages/
| -------- jest-matcher-utils/
| ------------ node_modules/
| ---------------- chalk/
| ------------ package.json
| -------- jest-diff/
| ------------ node_modules/
| ---------------- chalk/
| ------------ package.json
```

마지막으로 `yarn install`을 진행하면 아래와 같은 계층을 얻을수 있다.

`yarn install`시 패키지들의 있는 모듈들을 root 디렉토리쪽으로 hoisted 시켜준다.
대신 버젼이 다른 dependency 에 한해서는 hoisted 시켜주지 않는다.

이것은 lerna 의 bootstrapping 의 `--hoint` flag 효과와 같다.

```
| jest/
| ---- node_modules/
| -------- chalk/
| -------- diff/
| -------- pretty-format/
| -------- jest-matcher-utils/  (symlink) -> ../packages/jest-matcher-utils
| ---- package.json
| ---- packages/
| -------- jest-matcher-utils/
| ------------ node_modules/
| ---------------- chalk/
| ------------ package.json
| -------- jest-diff/
| ------------ node_modules/
| ---------------- chalk/
| ------------ package.json
```

패키지 `diff`, `pretty-format` 그리고 symlink인 `jest-matcher-utils` 들은 root의 node_moules 디렉토리로 hoist 된다.
그러나 `chalk`의 경우네는 root에 이미 다른 버젼이 설치되어있기 때문에 root로 hoist 되지 않는다. 

위와 같은 구조에서 jest-diff 워크스페이스 안이라면, 코드 안에서 다음과 같이 resolve 될것이다.

- require(‘chalk’) resolves to ./node_modules/chalk
- require(‘diff’) resolves to ../../node_modules/diff
- require(‘pretty-format’) resolves to ../../node_modules/pretty-format
- require(‘jest-matcher-utils’) resolves to ../../node_modules/jest-matcher-utils that is a - symlink to ../packages/jest-matcher-utils

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

* lerna 2.0.0 에선 lerna 커맨드 이용시 `--use-workspace` flag 를 사용하면 프로젝트의 bootstrap 을 Yarn 을 사용하게 된다. 이렇게 되면 root-level의 `packages.json/workspaces` 필드의 값이 `lerna.json/packages` 값을 재정의 한다.

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
* lerna를 이용하면 버져닝과 publish의 flow를 강제해서 많은 모듈들을 관리할 수 있다.
* lerna 를 이용하면 yarn workspace 에서 할수 없는 다양한 기능들을 사용할 수 있다. ( testing, 배포 , 버젼관리 , 패키지별 scripting 명령)
* 같은 환경속에서 여러가지 dependency 를 가지고 여러 패키지들을 다룬다면 monorepo 를 사용할만 할것 같다.
