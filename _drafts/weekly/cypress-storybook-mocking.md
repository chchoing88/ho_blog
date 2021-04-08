# 모킹 통합관리와 cypress의 모킹 on/off 기능

모킹 데이터는 테스트를 실행하기 위해 실제 데이터가 아닌 개발자가 필요에 의해서 만든 데이터를 말한다. 그렇다면 모킹 데이터를 사용하는 목적은 무엇일까?

- e2e 테스트 환경에서 실제 데이터가 유동적으로 변경되서 기댓값을 비교하기 어려운 경우
- UI 테스트 환경에서 실제 데이터로 다양한 데이터 표현을 확인하기 어려운 경우

이렇게 테스트 코드마다 모킹 데이터를 사용하다 보면 비슷한 모킹 코드들이 흩어져 있는 것을 쉽게 발견할 수 있다.

이 글에서는 프로젝트 이곳저곳에 흩어져 있던 모킹 데이터를 한곳에서 통합 관리한 경험과 cypress의 모킹 on/off 기능을 적용한 경험을 설명할 것이다.

## storybook와 cypress에서 일반적인 모킹 방법

필자가 개발에 참여하는 프로젝트에서는 개발된 UI를 손쉽게 확인하기 위해 [storybook](https://storybook.js.org/)과 e2e테스트를 위해 [cypress](https://www.cypress.io/)를 함께 사용하고 있다. 먼저 두 도구가 모킹하는 방법을 살펴보자.

### storybook 모킹 방법

storybook에서는 API를 모킹하기 위한 자체 내장 함수를 지원하지 않아 서드파티를 이용해야 한다. 필자가 개발하는 프로젝트는 [axios](https://github.com/axios/axios)를 사용하며 이 경우 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)를 사용한다.

스토리마다 API를 모킹해서 원하는 UI를 볼 수 있지만 필자는 데이터가 다 있는 스토리만 확인하기 위해 한 번에 모든 모킹을 진행하였다.

**.storybook/preview.js 파일에서 모킹 진행**

```javascript
import instance from 'src/api/axios/index';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(instance);

function mockAllApiData() {
  mock.onGet('api/foo').reply(200, {
    // foo api의 모킹 데이터
  })
  mock.onGet('api/bar').reply(200, {
    // bar api의 모킹 데이터
  })
  // ...
}

mockAllApiData();
```

### cypress 모킹 방법

cypress에서는 모킹을 위한 별도의 [intercept](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route)메서드를 제공한다. 이 메서드를 이용해서 각 테스트 케이스에 맞는 상황을 만들어야 한다. 그렇기 때문에 테스트 함수 안에서 필요한 API를 모킹해서 응답 데이터를 실제 데이터가 아닌 모킹 데이터를 기준으로 검증한다.

필요한 모킹 데이터는 `fixtures` 폴더 내에 json 파일로 만들어 둔다.

**각 테스트 함수 내에서 모킹 진행**

```javascript
cy.intercept(
  {
    pathname: '/api/foo',
  },
  {
    fixture: 'foo/fooMock.json',
  }
);
```

## 무엇이 문제인가

storybook과 cypress 양쪽 모두 API 모킹이 필요하였고, 이로 인해 중복된 코드와 데이터가 작성되었다.

storybook에서 사용하는 모킹 모듈인 axios-mock-adapter과 cypress에서 모킹을 위해 사용하는 intercept는 서로 다른 인터페이스를 갖는다. 이는 API 형태나 응답이 바뀌면 storybook과 cypress에서 진행한 모킹 모두 수정이 필요하다는 것을 의미한다.

그렇다면 API 응답을 모킹하는 모듈을 한곳에서 관리할 순 없을까? 그래서 필자는 특정 도구의 인터페이스와 무관하게 관리할 수 있는 '`API 모킹 통합관리 모듈`'을 만들어보고 싶어졌다.

## API 모킹 통합관리 모듈 개발

먼저, 각 도구의 API 모킹을 위해 필요한 조건을 정리해보자.

- storybook에서는 각 스토리에 맞는 UI를 확인하기 위해 스토리에 맞는 API 모킹이 이뤄져야 한다. 또한 필자가 했던 것처럼 모든 API의 모킹을 진행 할 수 있어야 한다.
- cypress에서는 테스트 함수 내에서 기대하는 데이터로 API 모킹을 진행한 뒤 같은 데이터 결괏값이 사용자에게 그대로 보이는지 확인할 수 있어야 한다.

조건들을 살펴보면 모킹 데이터 및 개수를 외부에서 제어가 가능해야 한다는 것을 알 수 있다. 즉, 동적으로 데이터가 만들어져야 한다.

### 모킹 데이터 통합

함수를 이용해서 정적으로 구성되어 있는 모킹 데이터를 원하는 데이터와 개수를 받아 동적으로 모킹 데이터를 만든다. 함수의 리턴 형식은 각 프로젝트 API의 형식에 맞는 구조를 채택하면 된다.

여기서 필자의 프로젝트 API 응답 형식은 다음과 같다.

```javascript
{
  result: {
    contents: [
      {
        // ...
      }
    ]
  }
}
```

`/api/foo` API 를 모킹하는 `createFooMock`함수의 예제를 살펴보자.

리스트 형식의 모킹 데이터(`contents:[]`)를 만들기 위해 헬퍼함수 `createContentsMock`를 만든다.
`createContentsMock`함수의 첫 번째 인자는 하나의 모킹 아이템을 리턴하는 `createMock`함수이고 두 번째 인자는 `count`만큼 모킹 아이템을 생성한다.

```javascript
export const createContentsMock = (createMock, count) => {
  const contents = [];
  
  for (let i = 0; i < count; i += 1) {
    contents.push({
      id: String(i),
      ...createMock(i),
    });
  }

  return {
    result: {
      contents,
    },
  };
};
```

그 다음 특정 API의 모킹 데이터를 외부에서 제어 할 수 있게끔 적절한 인자를 받아 모킹 데이터를 생성하는 함수를 만든다.

```javascript
const defaultFooList = [
  {
    name: 'merlin',
    age: 30,
  },
  {
    name: 'edward',
    age: 35,
  }
]

export const createFooMock = ({list = defaultFooList, count = list.length }) => {
  return createContentsMock((index) => {
    return {
      ...list[index]
    }
  }, count)
}
```

이제 어디서든지 `/api/foo` API 모킹에 필요한 데이터는 `createFooMock`함수를 호출해서 얻을 수 있다.

### 모킹 모듈 통합

서로 다른 모킹 모듈 인터페이스를 통합하는 새로운 통합 모듈을 만들어서 변경이 생기면 한곳에서 작업이 가능하도록 만든다.

```javascript
function hasOnMethodProperty(adapter) {
  if ('onGet' in adapter) {
    return true;
  }

  return false;
}

function createMockFunction(mock) {
  return isFunction(mock) ? mock : () => mock;
}


export function mockSystem(mockAdapter) {
  return {
    onGet({ path }, mock = {}) {
      const mockFn = createMockFunction(mock);

      if (hasOnMethodProperty(mockAdapter)) {
        return mockAdapter.onGet(path).reply(({ params }) => {
          return [200, mockFn({ params })];
        }); // axios-mock-adapter 방식 
      }

      return (alias, mockParams = {}) =>
        mockAdapter({ 
          alias, 
          status: mockParams.status, 
          path, 
          method: 'GET', 
        }, mockFn(mockParams)); // cypress 방식

    },
    onPost({ path }, mock = {}) {
     const mockFn = createMockFunction(mock);

      if (hasOnMethodProperty(mockAdapter)) {
        return mockAdapter.onPost(path).reply(200, mockFn());
      }

      return (alias, mockParams = {}) =>
        mockAdapter({ alias, path, method: 'PUT' }, mockFn(mockParams));
    },
    onPut({ path }, mock = {}) {
      // onPost method만 변경되고 나머지 코드는 동일...
    },
    onDelete({ path }, mock = {}) {
      // onPost method만 변경되고 나머지 코드는 동일...
    },

  };
}
```

코드가 복잡하니 차근차근 살펴보자.

우선 모킹 통합관리 객체를 생성하는 `mockSystem`함수를 만든다. 인자인 `mockAdapter`는 여러가지 모킹 도구를 전달 받는다. storybook의 경우 axios-mock-adapter를 인자로 받고 cypress인 경우 cy.intercept를 받게 된다.

```javascript
export function mockSystem(mockAdapter) {
  // 통합 인터페이스를 지닌 모킹 도구
  return {
    onGet(){},
    onPut(){},
    // ...
  }
}
```

`mockAdapter` 에서 받은 모킹 도구가 `on`메서드를 지닌 객체라면 axios-mock-adapter의 인터페이스를 따르게 만들고 그 외에는 cy.intercept를 따르게 만든다.

```javascript
function hasOnMethodProperty(adapter) {
  if ('onGet' in adapter) {
    return true;
  }

  return false;
}

export function mockSystem(mockAdapter) {
  // 통합 인터페이스를 지닌 모킹 도구
  return {
    onGet() {
      if (hasOnMethodProperty(mockAdapter)) {
        // axios-mock-adapter 방식 
      }

      // cy.intercept 방식
    }
    // ...
  }
}
```

모킹 통합관리 객체의 `onGet`메서드에서 첫 번째 인자로는 API의 `path`를 포함한 정보를 넘긴다. 두 번째 인자로는 `mock`은 모킹 데이터를 넘기게 된다. 모킹 데이터는 정적 및 동적 모킹 데이터를 다 받아 `createMockFunction`함수를 통해 모두 함수로 변환된다.

그 다음 각 조건문에서 모킹 모듈인 axios-mock-adapter와 cy.intercept 방식대로 코드를 작성해 준다.

```javascript
function createMockFunction(mock) {
  return isFunction(mock) ? mock : () => mock;
}

export function mockSystem(mockAdapter) {
  // 통합 인터페이스를 지닌 모킹 도구
  return {
    onGet({ path }, mock = {}) {
      const mockFn = createMockFunction(mock);

      if (hasOnMethodProperty(mockAdapter)) {
        // axios-mock-adapter 방식 
      }

      // cy.intercept 방식
    }
    // ...
  }
}
```

전체 코드를 자세히 살펴보면 `onGet`메서드의 모킹에서는 `reply`메서드 인자로 `함수`를 넘기고 있다.

```javascript
export function mockSystem(mockAdapter) {
  return {
    onGet({ path }, mock = {}) {
      // ...
      if (hasOnMethodProperty(mockAdapter)) {
        return mockAdapter.onGet(path).reply(({ params }) => {
          return [200, mockFn({ params })];
        }); // axios-mock-adapter 방식 
      }
      // ...
    },
    onPost({ path }, mock = {}) {
     // ...
      if (hasOnMethodProperty(mockAdapter)) {
        return mockAdapter.onPut(path).reply(200, mockFn());
      }
      // ...
    },

  };
}
```

`reply`메서드 인자로 함수를 넘기는 이유는 실제 API에서도 쿼리 스트링 값에 따른 다른 데이터를 주는 경우가 있기 때문에 모킹 데이터도 다르게 만들어야 하기 때문이다. 따라서 다음과 같이 사용할 수 있다.

```javascript
mock.onGet({path : '/api/foo'}}, (mockParams) => {
  if(mockParams?.params?.view) {
    return createFooViewMock(mockParams)
  }
  return createFooMock(mockParams)
})
```

이제 `mockSystem`함수를 이용하면 다른 모킹 모듈이 늘어나더라도 `mockSystem`모듈 한곳에서 추가하거나 수정 할 수 있다.

### API 모킹

통합된 `모킹 데이터`와 `모킹 모듈`을 가지고 API 모킹을 진행한다.
먼저 API 이름은 상수로 만들고 다른 API 이름과 겹치지 않도록 앞부분에 네임스페이스를 같이 작성한다. 이렇게 하면 나중에 모든 API 모킹을 한 곳에 모았을때 API 이름이 중복되는 오류를 피할 수 있다.

```javascript
export const FOO = 'NAMESPACE/FOO';
export const FOO_BAR = 'NAMESPACE/FOO_BAR';
```

그다음 통합된 모킹 모듈 `mock`을 받는 `createFooMockApi`함수를 작성한다. 이 함수는 `Foo`와 관련된 API들을 모킹할 수 있는 객체를 리턴한다. 이때 관련된 API끼리 묶어두되 API 메서드 별로 따로 객체를 생성해서 분리한다. 이는 뒤에서 나올 *cypress에서 활용*에서 더 편리하게 사용하기 위함이다.

```javascript
export function createFooMockApi(mock) {
  return {
    get: {
      [FOO]() {
        return mock.onGet({path : '/api/foo'}}, (mockParams) => createFooMock(mockParams))
      }
      [FOO_BAR]() {
        return mock.onGet({path: '/api/foo/bar'}, (mockParams) => {
          if(mockParams?.params?.flag) {
            return createBarMock(mockParams)l
          }

          return createOtherBarMock(mockParams);
        })
      }
    }
    post: {
      // ...
    },
    put: {
      // ...
    },
    delete: {
      // ...
    }
  }
}
```

### API 모킹 통합

특정 API를 모킹하는 함수(`createFooMockApi`)를 만들었다면 storybook에서 한 번에 API를 모킹할 수 있는 함수(`addAllMockApi`)와 cypress에서 API 하나하나를 호출 할 수 있도록 모아둔 객체(`mockApi`)를 리턴하는 `createMockApi`함수를 만든다.

여기서 API 모킹들이 하나로 합쳐지기 때문에 API 이름에 네임스페이스를 적어서 겹치지 않게 한다.

```javascript
export function createMockAPi(mock) {
  const fooMockApi = createFooMockApi(mock);
  // ...

  const mockApi {
    get: {
      ...fooMockApi.get,
      //...
    }
    post: {
      // ...
    },
    put: {
      // ...
    },
    delete: {
      // ...
    }
  }

  function addAllMockApi() {
    Object.keys(mockApi).forEach((key) =>
      Object.keys(mockApi[key]).forEach((api) => mockApi[key][api]())
    );
  }

  return {mockApi, addAllMockApi}
}
```

지금까지 만든 함수들을 가지고 어떻게 활용될 수 있는지 살펴보자.

## API 모킹 통합관리 모듈 활용

### storybook에서 활용

storybook에서 한 번에 API를 모킹할 수 있는 함수(`addAllMockApi`)만을 호출하면 기존의 작업과 동일하게 사용할 수 있다.

storybook에서 사용했던 모킹 모듈인 `MockAdapter`를 위에서 만들었던 `mockSystem`함수의 인자로 넘기면 통합된 인터페이스를 지닌 객체가 리턴되어 API 모킹하는데 사용하게 된다.

```javascript
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const instance = axios.create();

const { addAllMockApi } = createMockApi(mockSystem(new MockAdapter(instance)));
addAllMockApi();
```

### cypress에서 활용

cypress에서 모킹을 위해 사용하는 `cy.intercept`함수를 `mockSystem`함수의 인자로 넘긴다. 그 이후 생성된 모킹 통합 모듈을
`createMockApi`함수에 넘겨 모든 API를 모킹할 수 있게 준비된 `mockApi`객체를 리턴 받는다.

`mockApi`는 다음과 같이 테스트 바디 안에서 사용한다.

```javascript
import { FOO } from 'fooMockApi'

const { mockApi } = createMockApi(mockSystem(cy.intercept));

describe('테스트를', () => {
  it('이렇게도 진행할 수 있지만...', () => {
    const expectedList = [
      // ...
    ]
    mockApi.get[FOO]()({list: expectedList})
  })
})
```

하지만 테스트마다 `createMockApi`함수를 호출하는 것보다 별도의 모듈로 분리해서 편리하게 사용할 수 있다.

```javascript
const { mockApi } = createMockApi(mockSystem(cy.intercept));

export const mocks = {
  get(apiName, mockParams = {}) {
    mockApi.get[apiName]()(apiName, mockParams);
  },
  post(apiName, mockParams = {}) {
    mockApi.post[apiName]()(apiName, mockParams);
  },
  put(apiName, mockParams = {}) {
    mockApi.put[apiName]()(apiName, mockParams);
  },
  delete(apiName, mockParams = {}) {
    mockApi['delete'][apiName]()(apiName, mockParams);
  },
};
```

이렇게 만들어둔 모듈로 실제 테스트에서 다음과 같이 사용할 수 있다.

```javascript
import { mocks } from 'cypress/support/mock';
import { FOO } from 'fooMockApi'

describe('실제 테스트시에는', () => {
  it('이렇게 모킹을 진행 할 수 있다.', () => {
    const expectedList = [
      // ...
    ]
    mocks.get(FOO, { list: expectedList });
  })
})
```

## cypress의 모킹 on/off 기능

필자가 의도한 e2e테스트의 궁극적인 목표는 백엔드까지 연동한 테스트용 서버를 구축하여 실제 상황에 가장 가까운 테스트를 진행하는 것이다. 이렇게 되면 단순히 프론트엔드 코드만을 테스트하는 e2e테스트가 아니라 시스템 전반에 걸친 e2e테스트가 이뤄져서 테스트 코드의 신뢰성이 높아진다.
따라서 테스트용 서버를 구축하기 이전까진 프론트엔드에서 API를 모킹해서 테스트를 진행한다. 테스트용 서버가 구축되면 테스트 함수에 흩어져 있던 모킹을 손쉽게 off 하여 테스트용 서버로 e2e테스트를 진행할 수 있다.

### 해결방안

cypress의 config를 사용하면 이러한 동작을 중앙에서 제어할 수 있다.

**cypress.json 작성**

```javascript
{
  //...
  "env": {
      //...
      "mockApi": true
  }
}
```

모킹을 off해도 테스트 함수에 사용하는 `cy.mocks.get(FOO, {})` 인터페이스는 계속 유효해야 하므로 API의 응답 값만 변경할 수 있도록 해야 한다. 추가로 cypress intercept메서드는 같은 테스트 함수 내에서 중복 호출이 허용되지 않기 때문에 (해결방법은 [Cypress cy.intercept Problems](https://glebbahmutov.com/blog/cypress-intercept-problems/#no-overwriting-interceptors-again)에서 확인 할 수 있다) `intercept`메서드를 감싼 `http`커스텀 커맨드를 별도로 작성한다.

cypress.json에서 설정한 `mockApi`의 설정을 `Cypress.env('mockApi')`로 가져와 API 응답을 제어할 수 있다.
사용할 시에는 이전에 `mockSystem`에 넣었던 `cy.intercept`를 `cy.http`로 대체해 사용하게 된다.

```javascript
Cypress.Commands.add('http', ({ alias, status = 200, path, method, ...rest }, response) => {
  const key = `${alias}-${method}-${path}`;
  const intercepts = Cypress.config('intercepts');

  if (key in intercepts) {
    intercepts[key] = response;
  } else {
    intercepts[key] = response;

    cy.intercept({ pathname: path, method, ...rest }, (req) => {
      if (Cypress.env('mockApi')) { // config에서 작성한 mockApi를 보고 응답값을 정한다.
        req.reply(status, intercepts[key]);
      } else {
        // do nothing
      }
    }).as(`${method}_${alias}`);
  }
});

const { mockApi } = createMockApi(mockSystem(cy.http)); // cy.http
```

## 결론

우리는 더 빠른 개발과 더 나은 유지보수를 위해 모킹 데이터를 만든다. 개발만으로도 바쁜데 모킹 데이터를 여러번 수정하는 것이 끔찍할 것이다.
모킹 통합 방법은 API 형태와 응답이 바뀌더라도 storybook, cypress 두 군데서 수정해야 했던 것을 한곳에서 관리 할 수 있다는 장점이 있다. 다음에 또 다른 모킹 모듈이 등장하더라도 유연하게 대처할 수 있다. 실제로 88개의 API 모킹 코드가 절반으로 줄어들었고, 그 이후로도 API 응답 변경이 이뤄질 때마다 수정해야 할 곳을 빠르게 찾고 중복해서 수정하지 않아도 되어 사용성도 편해졌다.
모킹 on/off 기능은 우리의 테스트 범위를 프론트엔드에서 백엔드 + 프론트엔드 까지 넓힐 수 있는 더 간편한 방법을 제시한다.
이 글이 모킹 데이터를 사용하는 모든 개발자에게 도움이 되었으면 한다.
