# 흩어져 있는 모킹 데이터 통합관리와 테스트 범위를 넓히기 위한 모킹 on/off 기능

FE개발자는 원시 데이터를 이용하여 사용자들이 손쉽게 데이터를 이용할 수 있도록 화면을 만드는 작업들을 한다. 이때 필요한 것이 API를 이용해서 필요한 원시 데이터를 가져오게 된다.
흔히 FE개발자는 개발된 UI를 확인하기 위해 API를 이용하여 데이터를 요청하지만 필요한 데이터가 아직 준비가 덜 되어있는 경우 가짜 데이터를 만들어 개발된 UI를 확인해야 하는 경우를 마주하게 된다.
또한 테스트 환경에서는 API에서 가져오는 예측 할 수 없는 실제 데이터에 의존하여 테스트를 만들게 되면 깨지기 쉬운 테스트가 되기 때문에 API에서 오는 실제 데이터를 고정된 가짜 데이터로 대체 해야 하는 경우도 마주하게 된다.
이런 경우들에서 가짜 데이터를 우리는 모킹 데이터라고 부른다.

이 글에선 개발된 UI를 확인하기 위한 [storybook](https://storybook.js.org/)에서 사용한 모킹데이터와 e2e 테스트를 진행하기 위한 [cypress](https://www.cypress.io/)에서 사용한 모킹데이터를 적용하면서 흩어져 있던 모킹 데이터를 한곳에서 통합 관리한 경험과 e2e 테스트 범위를 넓히기 위한 모킹 on/off 기능을 적용한 경험을 들려줄 것이다.

## stroybook과 cypress에서 일반적인 모킹 방법

각 서드 파티에서 모킹을 어떻게 진행하는지 살펴보자.

### storybook 모킹 방법

[storybook](https://storybook.js.org/)에서는 모킹을 위한 자체 내장 함수를 지원하지 않으므로 [axios](https://github.com/axios/axios)로 API 요청을 모킹 할 수 있는 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)를 사용한다.

또한 [storybook](https://storybook.js.org/)은 컴포넌트의 UI 모습을 확인하는 목적으로 모든 API를 한번에 모킹을 진행해도 UI를 확인 가능하므로 한번에 API들을 모킹했다.

**.storybook/preview.js 파일에서 모킹 진행**

```javascript
import instance from '@/api/axios/index';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(instance);

function allApiMockData() {
  mock.onGet('api/foo', {params: {name: 'merlin'}}).reply(200, {
    // foo api mock data
  })
  mock.onGet('api/bar').reply(200, {
    // bar api mock data
  })
  // ...
}

allApiMockData();
```

### cypress 모킹 방법

[cypress](https://www.cypress.io/)에서는 모킹을 위한 별도의 [intercept](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route)메서드를 제공한다.
[storybook](https://storybook.js.org/)과는 다르게 test body들 안에서 API 하나하나 모킹해서 기댓값과 실제 모킹한 데이터가 맞는지 파악해야 한다. 그러므로 한번에 모킹을 진행하지 않고 필요한 모킹 데이터는 `fixtures` 폴더 내에 json 파일로 만들어 둔다.

**각 테스트 body 내에서 모킹 진행**

```javascript
cy.intercept(
    {
      pathname: '/api/foo',
      query: {
        name: 'merlin',
      },
    },
    {
      fixture: 'foo/fooMock.json',
    }
  );
```

## 무엇이 문제인가

각 모킹하는 모습들을 보다보면 API 주소, 쿼리 스트링, 모킹 데이터 등이 서로 다른 파일에서 중복 관리 되는 것을 확인 할 수 있다. 이는 API 형태나 응답이 바뀌면 [storybook](https://storybook.js.org/)과 [cypress](https://www.cypress.io/)에서 진행한 모킹들을 모두 수정이 필요하다는 것을 의미한다.

API 응답을 모킹하는 모듈을 한곳에서 관리 할 순 없을까? 이런 서드 파티와 무관하게 관리 될 수 있는 API 모킹 통합 시스템을 만들자.

## 모킹 데이터 통합하기

API 모킹 통합 시스템을 만들기 위해선 각 서드파티에서 모킹을 어떻게 진행 했었는지 다시 한번 살펴볼 필요가 있다.

- [storybook](https://storybook.js.org/)에서는 한번의 호출로 모든 API를 모킹할 수 있어야 한다.
- [cypress](https://www.cypress.io/)에서는 각 API 별로 모킹을 하되 모킹 데이터와 갯수를 제어할 수 있어야 한다.

### 동적으로 생성되는 모킹 데이터

정적으로 만들어 두었던 모킹 데이터를 외부에서 모킹 데이터와 갯수를 제어할 수 있게 동적으로 생성될수 있도록 함수로 제작한다.

하나의 응답 객체를 리스트로 만들기 위한 헬퍼 함수 `createContentsMock`를 작성한다.
여기서 [Chance](https://chancejs.com/index.html)도구는 랜덤한 값을 생성하는 도구로 여기서는 데이터 갯수로 모킹 데이터를 제어할 때 랜덤한 값을 만들어 주게 된다.

```javascript
import Chance from 'chance';

export const createContentsMock = (createMock, count) => {
  const contents = [];
  const size = 20;

  for (let i = 0; i < count; i += 1) {
    contents.push({
      id: String(i),
      ...createMock(new Chance(), i),
    });
  }

  return {
    result: {
      contents,
    },
  };
};
```

특정 API의 모킹 데이터를 외부에서 제어 할 수 있게 적절한 인자를 받아 모킹 데이터를 생성한다.

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
  return createContentsMock((chance, index) => {
    return {
      name: chance.word(),
      age: chance.integer({ min: 1 }),
      ...list[index]
    }
  }, count)
}
```

### 모킹 모듈 인터페이스 통합

[storybook](https://storybook.js.org/)에서 사용하는 모킹 모듈인 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)과 [cypress](https://www.cypress.io/)에서 사용하는 [intercept](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route)서로 다른 인터페이스를 지닌 모킹 모듈을 어느 한곳에서 통합하는 시스템을 만든다.

다음 `mockSystem`함수는 개발시에 필요한 모킹 모듈를 받아서 `on`메서드를 지닌 객체라면 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)의 인터페이스를 따르게 만들고 그 외에는 [intercept](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route)의 인터페이스를 따르게 만든다.

추후에 다른 모킹 모듈 늘어나더라도 한군데서 제어 할 수 있다는 장점이 있다.

리턴되는 객체에 2번째 인자인 `mock`은 정적 모킹 데이터도 받을 수 있을 뿐더러 함수형인 동적 모킹 데이터를 받을 수 있게 했다. 그렇게 나온 `mockFn`은 모킹 데이터에 필요한 인자를 받게 된다.

```javascript
function createMockFunctionlization(mock) {
  return isFunction(mock) ? mock : () => mock;
}

export function mockSystem(mockAdapter) {
  return {
    onGet({ path, matcher = {} }, mock = {}) {
      const mockFn = createMockFunctionlization(mock);

      if (hasOnMethodProperty(mockAdapter)) {
        return mockAdapter.onGet(path, matcher).reply(200, mockFn()); // axios-mock-adapter 방식 
      }

      return (alias, mockParams = {}) =>
        mockAdapter({ alias, url: path, method: 'GET', query: matcher.params }, mockFn(mockParams)); // cypress 방식
    },
    onPost({ path }, mock = {}) {
     // ...
    },
    onPut({ path }, mock = {}) {
      // ...
    },
    onDelete({ path }, mock = {}) {
      // ...
    },

  };
}
```

### API 모킹

이제 만들어둔 `API 통합 모킹 시스템`과 `동적으로 생성되는 모킹 데이터`를 가지고 API path와 쿼리스트링을 연관시켜서 모킹 데이터를 생성하도록 만든다.
이때 관련된 API 끼리 묶어두되 API method 별로 따로 객체를 생성해서 분리한다. 이는 뒤에서 나올 cypress에서 활용에서 이렇게 한 이유를 설명 할 것이다.

다음 `createFooMockApi`의 인자인 mock은 위에서 만든 `mockSystem`의 리턴 객체를 나타낸다.

```javascript
export const FOO = 'FOO';

export function createFooMockApi(mock) {
  return {
    get: {
      [FOO]() {
        return mock.onGet({path : '/api/foo', {params: {name: 'merlin',}}}, (mockParams) => createFooMock(mockParams))
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

위 *API 모킹*에서 각 API 그룹들 마다 모킹하는 함수(`createFooMockApi`)를 만들었다면 이제는 [storybook](https://storybook.js.org/)에서 한번에 API를 모킹할 수 있는 함수(`addAllMockApi`)와 [cypress](https://www.cypress.io/)에서 모든 API 하나하나를 호출 할 수 있도록 모아둔 객체(`mockApi`)를 리턴하는 `createMockApi`를 만든다.

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

### storybook에서 활용

[storybook](https://storybook.js.org/)에서 한번에 API를 모킹할 수 있는 함수(`addAllMockApi`)만을 호출하면 기존의 작업과 동일하게 사용할 수 있다.

```javascript
import MockAdapter from 'axios-mock-adapter';

const { addAllMockApi } = createMockApi(mockSystem(new MockAdapter(instance)));
addAllMockApi();
```

### cypress에서 활용

[cypress](https://www.cypress.io/)에서는 위에서 만들어둔 `createMockAPi`함수의 리턴인 `mockApi`를 테스트 바디에서 다음과 같이 사용할 수 있다.

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

하지만 매 테스트마다 `createMockApi`함수를 호출하는 것이 아닌 다음과 같이 Cypress인스턴스(`cy`)에 적용해 편리하게 사용해보자.
첫번째 인자로는 API 이름을 받고 두번째 인자로는 모킹 데이터를 제어 할 수 있는 데이터를 직접 받게 된다.

```javascript
cy.mocks.get(`API NAME`, {
  // 모킹 데이터를 제어할 수 있는 데이터
})
```

[cypress](https://www.cypress.io/)에서는 사용자가 원하는 커맨드를 만들 수 있는 API인 [Custom Commnads](https://docs.cypress.io/api/cypress-api/custom-commands.html)라는 API를 제공하고 있다.
이 API를 활용해서 모킹을 위한 다음과 같은 인터페이스를 만들 수 있다.

다음 코드는 `cypress/support/mock.js` 파일에 작성한 뒤 `cypress/support/index`에 import 해준다.

```javascript
const { mockApi } = createMockApi(mockSystem(cy.intercept));

// installMockApi
Cypress.Commands.add('installMockApi', () => {
  cy.mocks = {
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
});
```

실제 테스트가 이뤄질때는 다음과 같이 Cypress인스턴스(`cy`)로만 모킹을 진행할 수 있다.

```javascript
import { FOO } from 'fooMockApi'

describe('실제 테스트시에는', () => {
   before(() => {
     cy.installMockApi();
   })

  if('이렇게 모킹을 진행 할 수 있다.', () => {
    const expectedList = [
      // ...
    ]
    cy.mocks.get(FOO, { list: expectedList });
  })
})
```

## 테스트 범위를 넓히기 위한 모킹 on/off 기능

## 결론

우리는 더 빠른 개발과 더 나은 유지보수를 위해 모킹 데이터를 생성한다. App 개발만 해도 바쁜 개발자들이 모킹 데이터를 위해 시간을 투자하는것이 시간 낭비라고 생각하는 개발자도 있을 것이다.
하지만 나중에는 흩어져 있는 모킹 데이터들을 복붙하고 여러번 수정하는 우리의 모습을 상상하면 끔찍할 것이다.
이 방법은 API 형태와 응답이 바뀌더라도 storybook, cypress 두 군데서 수정해야 했던 것을 한곳에서 관리 할 수 있다는 장점을 지니고 있다. 추후에 또 다른 모킹 모듈이 등장하더라도 유연하게 대처할 수 있다.
이 글이 모킹 데이터를 사용하는 모든 개발자에게 도움이 되었으면 한다.
