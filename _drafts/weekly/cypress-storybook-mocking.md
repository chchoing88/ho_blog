# 흩어져 있는 모킹 데이터 통합관리와 테스트 범위를 넓히기 위한 모킹 on/off 기능

모킹 데이터는 가짜 데이터를 말한다. 흔히 FE개발자는 개발된 UI를 확인하기 위해 API를 이용하여 필요한 데이터를 요청하지만 아직 준비가 덜 되어있는 경우 가짜 데이터를 만들어 개발된 UI를 확인해야 하는 경우를 마주하게 된다.
또한, 테스트 환경에서는 API에서 가져오는 실제 데이터에 의존하여 테스트를 만들게 되면 예측할 수 없는 데이터로 기댓값을 충족할 수 없기 때문에 깨지기 쉬운 테스트가 된다. 그래서 API에서 오는 실제 데이터를 고정된 가짜 데이터로 대체 해야 하는 경우도 마주하게 된다.

이렇게 FE개발자는 많은 곳에서 모킹 데이터 즉, 가짜 데이터를 사용한다. 많은 곳에서 모킹 데이터를 사용하다 보면 비슷한 모킹 코드들이 흩어져 있는 것을 쉽게 발견할 수 있다.

이 글에서는 프로젝트 이곳 저곳에 흩어져 있던 모킹 데이터를 한곳에서 통합 관리한 경험과 e2e테스트 범위를 넓히기 위한 모킹 on/off 기능을 적용한 경험을 들려줄 것이다.

## stroybook과 cypress에서 일반적인 모킹 방법

필자가 개발에 참여하는 프로젝트에서는 UI개발을 위해 [storybook](https://storybook.js.org/)과 e2e테스트를 위해 [cypress](https://www.cypress.io/)를 사용하고 있다. 가장 먼저 이 서드 파티에서 모킹을 어떻게 진행하는지 살펴보자.

### storybook 모킹 방법

[storybook](https://storybook.js.org/)에서는 모킹을 위한 자체 내장 함수를 지원하지 않으므로 [axios](https://github.com/axios/axios)모킹 할 수 있는 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)를 사용한다.

또한 [storybook](https://storybook.js.org/)은 컴포넌트의 UI 모습을 확인하는 목적으로 모든 API를 한번에 모킹을 진행해도 UI를 확인 가능하므로 모든 API들을 모킹했다.

**.storybook/preview.js 파일에서 모킹 진행**

```javascript
import instance from '@/api/axios/index';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(instance);

function allApiMockData() {
  mock.onGet('api/foo', {params: {name: 'mandoo'}}).reply(200, {
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
[storybook](https://storybook.js.org/)과는 다르게 테스트 바디들 안에서 API 하나하나 모킹해서 기댓값과 실제 모킹한 데이터가 맞는지 파악해야 한다. 그러므로 한번에 모킹을 진행하지 않는다. 필요한 모킹 데이터는 `fixtures` 폴더 내에 json 파일로 만들어 둔다.

**각 테스트 바디 내에서 모킹 진행**

```javascript
cy.intercept(
    {
      pathname: '/api/foo',
      query: {
        name: 'mandoo',
      },
    },
    {
      fixture: 'foo/fooMock.json',
    }
  );
```

## 무엇이 문제인가

각 모킹하는 모습들을 보다보면 API 주소, 쿼리 스트링, 모킹 데이터 등이 서로 다른 파일에서 중복 관리 되는 것을 확인 할 수 있다. 이는 API 형태나 응답이 바뀌면 [storybook](https://storybook.js.org/)과 [cypress](https://www.cypress.io/)에서 진행한 모킹 모두 수정이 필요하다는 것을 의미한다.

그렇다면 API 응답을 모킹하는 모듈을 한곳에서 관리 할 순 없을까? 이런 서드파티와 무관하게 관리 될 수 있는 API 모킹 통합 시스템을 만들자.

## 모킹 데이터 통합하기

API 모킹 통합 시스템을 만들기 위해 [storybook](https://storybook.js.org/)과 [cypress](https://www.cypress.io/)에서 모킹을 어떻게 진행 했었는지 살펴보고 필요한 조건이 무엇인지 파악해야 한다.

각 모듈에서 필요한 조건은 다음과 같다.

- [storybook](https://storybook.js.org/)에서는 한번의 호출로 모든 API를 모킹할 수 있어야 한다.
- [cypress](https://www.cypress.io/)에서는 API별로 모킹을 하되 모킹 데이터와 개수를 제어해서 동적으로 모킹 데이터를 만들 수 있어야 한다.

### 동적으로 생성되는 모킹 데이터

가장 먼저 정적으로 만들었던 모킹 데이터를 외부에서 모킹 데이터와 개수를 제어할 수 있게 동적으로 생성될 수 있도록 함수로 제작한다.

필요한 데이터를 일일이 타이핑 하지 않게 하기 위해 [Chance](https://chancejs.com/index.html)라는 도구를 설치한다.

```sh
npm install Chance --save-dev 
```

[Chance](https://chancejs.com/index.html)도구는 랜덤한 값을 생성하는 도구로 여기서는 데이터 갯수로 모킹 데이터를 제어할 때 랜덤한 값을 만들어 주게 된다.

```javascript
chance.name();
// 'Dafi Vatemi'
```

그리고 리스트로 된 모킹 데이터를 만들기 위해 하나의 모킹 아이템을 리턴하는 `createMock`함수를 받아 `count`갯수만큼 모킹 응답값을 만들어주는 헬퍼 함수를 만든다.

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

최종적으로 특정 API의 모킹 데이터를 외부에서 제어 할 수 있게끔 적절한 인자를 받아 모킹 데이터를 생성하는 `createFooMock`함수를 만든다.

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

일반적인 모킹 방법에서 살펴 보았듯이 [storybook](https://storybook.js.org/)에서 사용하는 모킹 모듈인 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)과 [cypress](https://www.cypress.io/)에서 모킹을 위해 사용하는 [intercept](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route)는 서로 다른 인터페이스를 갖는다. 때문에 우리는 이 모듈들에 필요한 API정보나 모킹 데이터를 두번씩 작성 했었어야 했는데 이를 통합하는 모듈을 만들어서 변경이 있더라도 한곳에서 작업이 가능하도록 만든다.

다음 `mockSystem`함수는 개발시에 필요한 모킹 모듈를 받아서 `on`메서드를 지닌 객체라면 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)의 인터페이스를 따르게 만들고 그 외에는 [intercept](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route)의 인터페이스를 따르게 만든다.

`mockSystem`함수 호출로 리턴되는 객체에 2번째 인자인 `mock`은 정적 모킹 데이터도 받을 수 있을 뿐더러 함수형인 동적 모킹 데이터를 받을 수 있게 했다. 그렇게 나온 `mockFn`은 모킹 데이터에 필요한 인자를 받게 된다.

```javascript
function createMockFunctionlization(mock) {
  return isFunction(mock) ? mock : () => mock;
}

export function mockSystem(mockAdapter) {
  return {
    onGet({ path, matcher = {} }, mock = {}) {
      const mockFn = createMockFunctionlization(mock);

      if (hasOnMethodProperty(mockAdapter)) {
        return mockAdapter.onGet(path, matcher).reply(({ params }) => {
          return [200, mockFn({ params })];
        }); // axios-mock-adapter 방식 
      }

      return (alias, mockParams = {}) =>
        mockAdapter({ 
          alias, 
          status: mockParams.status, 
          url: path, 
          method: 'GET', 
          query: matcher.params 
        }, mockFn(mockParams)); // cypress 방식

    },
    onPost({ path }, mock = {}) {
     const mockFn = createMockFunctionlization(mock);

      if (hasOnMethodProperty(mockAdapter)) {
        return mockAdapter.onPut(path).reply(200, mockFn());
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

위 코드를 자세히 살펴보면 다음과 같이 `onGet`함수의 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)방식이 다른것을 확인 할 수 있다.

```javascript
return mockAdapter.onGet(path, matcher).reply(({ params }) => {
        return [200, mockFn({ params })];
      }); // axios-mock-adapter 방식 
```

`reply`메서드 인자로 받는 함수에 파라미터로 유저가 설정했던 [axios](https://github.com/axios/axios)설정값과 매칭된 url 정보를 함께 넣어준다. 그렇기에 매칭된 url의 쿼리 스트링을 보고 다른 모킹 데이터를 만들기 위해 `mockFn`에 쿼리 스트링 값을 넣어주게 된다.

이제 이 `mockSystem`함수를 이용하면 다른 모킹 모듈 늘어나더라도 `mockSystem`안에서 제어 할 수 있다는 장점이 있다.

### API 모킹

이제 만들어둔 `API 통합 모킹 시스템`과 `동적으로 생성되는 모킹 데이터`를 가지고 API path 연관시켜서 모킹 데이터를 생성하도록 만든다.
이때 관련된 API 끼리 묶어두되 API 메서드 별로 따로 객체를 생성해서 분리한다. 이는 뒤에서 나올 *[cypress](https://www.cypress.io/)에서 활용*에서 더 편리하게 사용하기 위함이다.

맨 먼저 API이름은 상수로 만들고 다른 API이름과 겹치지 않도록 앞부분에 네임스페이스를 같이 작성한다. 이렇게 하는 이유는 나중에 모든 API 모킹을 한곳에 모을 예정이기 때문에 API 이름 중복으로 인한 오류를 없애기 위함이다.

```javascript
export const FOO = 'NAMESPACE/FOO';
export const BAR = 'NAMESPACE/BAR';
```

그 다음 위에서 만든 통합된 모킹 인터페이스를 받는 `mock`인자를 받아 메서드 별로 API 모킹 함수를 작성한다.

```javascript
export function createFooMockApi(mock) {
  return {
    get: {
      [FOO]() {
        return mock.onGet({path : '/api/foo', matcher: { params: { name: 'mandoo' }}}, (mockParams) => createFooMock(mockParams))
      }
      [BAR]() {
        return mock.onGet({path: '/api/bar'}, (mockParams) => {
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

위 *API 모킹*에서 API별로 모킹하는 함수(`createFooMockApi`)를 만들었다면 이제는 [storybook](https://storybook.js.org/)에서 한번에 API를 모킹할 수 있는 함수(`addAllMockApi`)와 [cypress](https://www.cypress.io/)에서 모든 API 하나하나를 호출 할 수 있도록 모아둔 객체(`mockApi`)를 리턴하는 `createMockApi`를 만든다.

여기서 API 모킹들이 하나로 합쳐지기 때문에 API 이름에 네임스페이스를 두어서 겹치지 않게 하는 것이다.

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

### storybook에서 활용

[storybook](https://storybook.js.org/)에서 한번에 API를 모킹할 수 있는 함수(`addAllMockApi`)만을 호출하면 기존의 작업과 동일하게 사용할 수 있다.

[storybook](https://storybook.js.org/)에서 사용했던 모킹 모듈인 `MockAdapter`를 `mockSystem`함수의 인자로 넘기면 위에서 만들어 두었던 통합된 인터페이스를 지닌 객체가 리턴되어 API 모킹하는데 사용하게 된다.

```javascript
import MockAdapter from 'axios-mock-adapter';

const { addAllMockApi } = createMockApi(mockSystem(new MockAdapter(instance)));
addAllMockApi();
```

### cypress에서 활용

[cypress](https://www.cypress.io/)에서는 위에서 만들어둔 `createMockAPi`함수의 리턴인 `mockApi`를 테스트 바디에서 다음과 같이 사용할 수 있다.

여기서는 [storybook](https://storybook.js.org/)과 다르게 [cypress](https://www.cypress.io/)에서 모킹을 위해 사용하는 `cy.intercept`함수를 `mockSystem`함수의 인자로 넘기는 것을 볼 수 있다.

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
첫번째 인자로는 API 이름을 받고 두번째 인자로는 모킹 데이터를 제어 할 수 있는 데이터를 직접 받게 해보자.

```javascript
cy.mocks.get(`API NAME`, {
  // 모킹 데이터를 제어할 수 있는 데이터
})
```

위 형태로 모킹을 진행하기 위해 [cypress](https://www.cypress.io/)에서 사용자가 원하는 커맨드를 만들 수 있는 API인 [Custom Commnads](https://docs.cypress.io/api/cypress-api/custom-commands.html)를 이용할 것이다.

다음 코드는 `cypress/support/mock.js` 파일에 작성한 뒤 `cypress/support/index`에 import 해준다.

`installMockApi`커스텀 커맨드는 실제 테스트 바디에서 사용할 `cy.mocks`객체를 만든다.

**cypress/support/mock.js 작성**

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

이렇게 만들어둔 커스텀 커맨드 실제 테스트에서 다음과 같이 사용할 수 있다.

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

필자가 개발에 참여하는 프로젝트의 e2e테스트 목표는 실제 테스트용 서버를 구축해서 backend에서부터 user까지의 테스트를 진행하는 것이 목표이다. 이렇게 되면 단순히 FE코드만을 테스트하는 e2e테스트가 아니라 시스템 전반에 걸친 e2e테스트가 이뤄져서 유지보수시에도 더 신뢰하는 코드를 유지할 수 있게 된다.
따라서 테스트용 서버를 구축하기 이전까진 FE에서 API를 모킹해서 테스트를 진행하는 것이다. 테스트용 서버가 구축이 되면 테스트 바디에 흩어져 있던 모킹을 손쉽게 off하여 테스트용 서버로 e2e테스트를 진행하게 한다.

### 해결방안

[cypress](https://www.cypress.io/)의 config에서 관리하면 중앙에서 관리 할 수 있다.

**cypress.json 작성**

```json
{
    //...
    "env": {
        //...
        "mockApi": true
    }
}
```

모킹을 off 하더라도 테스트 바디에 사용하는 `cy.mock.get(FOO, {})` 인터페이스는 계속 유효해야 하기 때문에 응답 값만 조정 할 수 있도록 한다.
추가적으로 [cypress intercept](https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route)메서드는 오버라이트가 되지 않기 때문에 ([이곳](https://glebbahmutov.com/blog/cypress-intercept-problems/#no-overwriting-interceptors-again)에서 확인 할 수 있다.) `intercept`메서드를 감싼 `http`커스텀 커맨드를 별도로 작성한다.

다음 코드를 보면 위에서 설정한 `mockApi`의 설정을 `Cypress.env('mockApi')`로 가져와 응답을 제어 하는 코드를 살펴볼 수 있다.
사용할 시에는 이전에 `mockSystem`에 넣었던 `cy.intercept`를 `cy.http`로 대체해 사용하게 된다.

```javascript
Cypress.Commands.add('http', ({ alias, url, method, ...rest }, response) => {
  const key = `${alias}-${method}-${url}`;
  const intercepts = Cypress.config('intercepts');

  if (key in intercepts) {
    intercepts[key] = response;
  } else {
    intercepts[key] = response;
    cy.intercept({ url, method, ...rest }, (req) => {
      if (Cypress.env('mockApi')) { // config에서 작성한 mockApi를 보고 응답값을 정한다.
        req.reply(intercepts[key]);
      } else {
        // do nothing
      }
    }).as(alias);
  }
});

const { mockApi } = createMockApi(mockSystem(cy.http)); // cy.http
```

이로써 현재는 FE코드 내에서 모킹을 적용해서 e2e테스트가 FE코드까지만 검증이 되어 있지만 앞 필요성에서 언급했던 backend에서부터 user까지의 테스트를 진행하는 목표를 이루기 위해 추후에는 `cypress.json`의 `mockApi`값을 조절하여 현재 적용되어 있는 모킹 on/off를 손쉽게 이룰 수가 있다.

## 결론

우리는 더 빠른 개발과 더 나은 유지보수를 위해 모킹 데이터를 생성한다. App개발만 해도 바쁜 개발자들이 모킹 데이터를 위해 시간을 투자하는것이 시간 낭비라고 생각하는 개발자도 있을 것이다. 하지만 나중에는 흩어져 있는 모킹 데이터들을 복붙하고 여러번 수정하는 우리의 모습을 상상하면 끔찍할 것이다.
모킹 통합 방법은 API형태와 응답이 바뀌더라도 storybook, cypress 두 군데서 수정해야 했던 것을 한곳에서 관리 할 수 있다는 장점을 지니고 있다. 다음에 또 다른 모킹 모듈이 등장하더라도 유연하게 대처할 수 있다. 또 모킹 on/off기능은 우리의 테스트 범위를 넓히는데 더 간편한 방법을 제시한다.
이 글이 모킹 데이터를 사용하는 모든 개발자에게 도움이 되었으면 한다.
