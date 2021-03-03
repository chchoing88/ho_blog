---
title: typescript embient
date: "2020-06-18T10:00:03.284Z"
tags:
  - javascript
  - ES6
  - typescript
  - ambient
---

## 동기

- 타입스크립트를 학습하다가 타입 정의 파일에서의 `declear` 의 용도가 궁금해져서 몇가지 테스트 후 정리 해봅니다.

## 배경

### namespace

- 일명 내부 모듈로 전역 이름 공간과 분리된 네임스페이스 단위의 이름 공간입니다.
- 네임스페이스는 여러 파일에 걸쳐 하나의 이름 공간을 공유합니다.
- 컴파일이 진행이 되면 지정된 네임스페이스 이름으로 전역 변수가 하나 생깁니다. 이 전역 변수에는 객체가 할당 됩니다. 이는 곧 전역 스코프에 속하지만 전역 스코프와 독립된 이름 공간을 지닌 다는 이야기가 됩니다.

```typescript
namespace Hello {
  function pring() {}
}
```

```javascript
"use strict";
var Hello;
(function(Hello) {
  function pring() {}
})(Hello || (Hello = {}));
```

- 네임스페이스는 export 를 이용해서 외부 모듈로도 선언이 가능합니다. 이렇게 모듈로 선언된 네임스페이스는 import 문을 이용해 JS로 컴파일 뒤에도 명시적으로 모듈 호출을 할 수 있습니다.

```typescript
export namespace Hello {
  function pring() {}
}
```

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hello = void 0;
var Hello;
(function(Hello) {
  function pring() {}
})((Hello = exports.Hello || (exports.Hello = {})));
```

### export

- 일명 외부 모듈로 모듈 파일마다 이름 공간이 정해집니다.
- 외부 모듈의 이름 공간은 파일 내부로 제한됩니다.

## 타입 정의 파일

- 일반 자바스크립트 라이브러리에는 타입 정보나 구조 정보가 없기 때문에 타입스크립트 컴파일러가 자바스크립트 라이브러리의 API를 인식할 수 있게 하려면 타입 정의 파일을 정의해야 합니다.
- 자바스크립트는 타입 정보를 포함하지 못하므로 타입 정의 파일을 별도로 정의해야 합니다.
- 코드 어시스트 역할을 수행합니다. 개발 에디터에서 코드 어시스트를 통해 타입 정보를 표시합니다.
- 컴파일 에러 표시 역할을 수행합니다. 컴파일 에러가 발생할 때보다 자세한 에러 로그를 출력합니다.

## 앰비언트 선언

- 자바스크립트 라이브러리는 API 형태로 외부로 공개된 모듈을 포함합니다.
- 외부로 공개된 모듈은 보통 export 로 선언되어 있습니다.
- 이런 export 로 공개된 모듈은 declare 키워드를 통해 타입 정의 파일에서 선언 됩니다.
- declare 선언은 실제 구현 내용은 포함하지 않고 단지 정의만 포함합니다.
- 타입스크립트 컴파일러에게 JS에 대한 구현'환경' 에 대한 정보를 준다라는 정도로 이해할 수 있습니다.

## 앰비언트 선언시 코드 어시스트는 어떻게 동작할까

1. export 문 없이 그냥 declare

```typescript
// typeTest.d.ts
declare module test {
  export const name = "merlin";
}
```

위와 같이 작성된 타입 정의 파일이 있다면 타입스크립트 컴파일러는 다음과 같이 적으면 코드 어시스트를 실행시켜 줍니다.

```typescript
test.name; // const name = "merlin"
```

2. export 문과 함께 작성된 declare

```typescript
// typeTest.d.ts
export declare module test {
  export const name = "merlin";
}
```

위와 같이 작성된 타입 정의 파일이 있다면 다른 파일에서 import 시 코드 어시스트를 실행시켜 줍니다.

```typescript
import { test } from "./typeTest";
test.name;
```

3. 모듈 이름을 "" 로 감싸서 표현 했을 때

```typescript
// typeTest.d.ts
declare module "ho" {
  export const name = "merlin";
}
```

위와 같이 "ho" 로 모듈 이름을 작성하면 다른 파일에서 import 모듈시 "ho" 모듈이 있는 것으로 간주하고 코드 어시스트를 실행 해줍니다.
실제로 ho.js 파일엔 아무것도 없어도 일단 어시스트는 돌아 갑니다.

```typescript
import { name } from "ho";
test.name;
```

## 타입스크립트 컴파일시 타입 정의 파일도 만든다면

1. export default 시

```typescript
// test.ts
export default function merlin() {}
```

```typescript
// test.d.ts
export default function merlin(): void;
```

2. export 시

```typescript
// test.ts
export function merlin() {}
```

```typescript
// test.d.ts
export declare function merlin(): void;
```

3. 아무것도 없을 시

```typescript
// test.ts
function merlin() {}
```

```typescript
// test.d.ts
declare function merlin(): void;
```

4. 혼용시

```typescript
// test.ts
export function merlin() {}
namespace merlin2 {}
const merlin3 = "merlin3";
```

```typescript
// test.d.ts
export declare function merlin(): void;
```

## 정리

- 자바스크립트 파일에서 export 로 외부 모듈로 사용될 시 API로 사용자에게 노출이 되는 부분들은 declare 라는 키워드를 사용해서 타입 정의가 이뤄집니다.
- 자바스크립트 파일에서 export 문이 없이 일반 파일이라면 전역 스코프에 속하는 변수, 함수 등등을 declare 라는 키워드를 사용해서 타입 정의가 이뤄집니다.
- 만약 export 문과 일반 함수, 변수 등이 혼용되어 있을 경우에는 모듈로 간주 export 문으로 외부로 공개된 API 만 declare 키워드를 사용해서 타입 정의가 이뤄집니다.
- export default 를 사용해서 외부로 노출하는 API는 별도의 declear 대신 default 문으로 타입 정의가 이뤄집니다.
