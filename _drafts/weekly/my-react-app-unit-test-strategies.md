# 리액트 앱 단위 테스트 전략

> 원문 : [https://medium.com/better-programming/my-react-app-unit-testing-strategies-18ebe55cd078](https://medium.com/better-programming/my-react-app-unit-testing-strategies-18ebe55cd078)

단위테스트는 아무리 작은 앱이라도 개발자들에게 매우 중요하다. 이 블로그 기사는 [example app](https://github.com/xiongemi/white-label-airline) 의 단위 테스트를 작성하는 방법에 대해 설명한다.

React app의 여러 부분에 대한 단위 테스트를 설명 할 것이다.

- 서비스
- 프리젠테이셔널 컴포넌트
- 스마트/컨테이너/연결 컴포넌트
- 리덕스 파일들
- Hooks

## 기술 스택

여기서 사용하는 라이브러리들은 다음과 같다.

- 테스팅 프레임워크: [Jest](https://jestjs.io/)
- DOM 테스팅: [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- 린팅: [ESLint](https://eslint.org/)
- ESLint 플러그인: [lint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library) 과 [eslint-plugin-jest-dom](https://github.com/testing-library/eslint-plugin-jest-dom)
- 접근성 테스트: [jest-axe](https://github.com/nickcolley/jest-axe)

## ESLint 플러그인

유닛 테스트 작성에 있어서 린팅을 추가하는 것은 개발자에게 몇몇 가지의 실수를 피할 수 있게 한다. [lint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library) 과 [eslint-plugin-jest-dom](https://github.com/testing-library/eslint-plugin-jest-dom) 를 ESLint 플러그인으로 설치를 하기 위해 다음과 같은 커멘드를 작성할 수 있다.

```
# npm
npm install --save-dev lint-plugin-testing-library eslint-plugin-jest-dom
# yarn
yarn add lint-plugin-testing-library --dev
yarn add eslint-plugin-jest-dom --dev
```

`.eslintrc` 파일에서 다음 rules을 추가할 수 있다. 예를들면 `extends` 에 추천하는 rule들을 추가한다.

```
"extends": [
  "plugin:jest-dom/recommended",
  "plugin:testing-library/react",
],
```

## 접근성을 위한 단위 테스트

유닛 테스트로 접근성을 테스트 할 수 있으며 jest-axe 라이브러리를 사용하면 된다.

```
# npm
npm install --save-dev jest-axe

# yarn
yarn add jest-axe --dev
```

설정하기 위해서 `jest.setup.js` 라는 파일을 루트 경로에 만들고 다음과 같이 컨텐츠를 작성한다.

```javascript
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

특정 설치 파일을 Jest 구성 파일에 명시하기 위해선 다음과 같이 작성한다. (`jest.config.js` 또는 `jest.config.ts`)

```javascript
setupFilesAfterEnv: ['./jest.setup.js']
```

아래 단위 테스트는 React 컴포넌트가 접근성을 위반하는지를 체크하는 코드이다.

```typescript
// app.spec.tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';

import App from './app';

describe('App', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(<App />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

## Mock 삽입

때때론 테스트를 위해 라이브러리 또는 서비스를 설치할 수 없는 경우가 있지만 그것의 모킹을 활용할 수 있다. 모킹은 이런 라이브러리 또는 서비스가 리턴하는 것을 세부적으로 컨트롤 할 수 있다.

### 모킹 라이브러리

예제: `react-i18next`

예를 들면 `react-i18next` 라이브러리를 사용하고 컴포넌트에서 삽입을 한다. : `import { useTranslation } from 'react-i18next'`
하지만 테스트를 위해 실제 이것을 셋팅하지 않아도 된다. 단지 모킹을 하면 된다.

```typescript
// i18n.mock.ts
import { jest } from '@jest/globals';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));
```

유닛 테스트 안에서는 간단하게 이 모킹 파일을 `jest.setup.js` 파일에 삽입 시켜주기만 하면 된다.

### 모킹 서비스

에를 들어 `countriesService` 불리는 서비스 함수를 가지고 있다고 하자. 단위 테스트에서는 이 서비스를 위한 모킹이 필요하다. 서비스 파일은 다음과 같습니다.

```typescript
import { CountriesResponse } from './models/countries-response.interface';

async function getCountries(): Promise<CountriesResponse> {
  const response = await fetch(...);
  if (response.ok) {
    return response.json();
  }
  throw response;
}
  
export const countriesService = { getCountries };
```

단위 테스트 파일에서 모킹은 다음과 같다.

```typescript
countriesService.getCountries = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockCountriesResponse));
```

## 서비스들

예를들어 `countriesService` 가 `fetch`를 사용해 네트워크 요청을 하는 서비스라면:

```typescript
import { CountriesResponse } from './models/countries-response.interface';

async function getCountries(): Promise<CountriesResponse> {
  const response = await fetch(...);
  if (response.ok) {
    return response.json();
  }
  throw response;
}
  
export const countriesService = { getCountries };
```

### 모킹 `fetch`

이 파일을 테스트 하기 위해선 `fetch` 함수를 모킹 해야한다. 그러기 위해선 `jest-fetch-mock`을 설치 한다.

```
# npm
npm install jest-fetch-mock --save-dev

# yarn
yarn add jest-fetch-mock --dev
```

이것을 설치하기 위해 `jest.setup.js`에 다음 라인을 추가한다.

```javascript
require('jest-fetch-mock').enableMocks()
```

### 단위 테스트

단위테스트 파일에서 fetch 성공적인 호출을 모킹하기 위해선 다음과 같다.

```javascript
fetchMock.mockResponseOnce(JSON.stringify(<mock response>));
```

fetch 실패 호출을 모킹하기 위해선 다음과 같다. 

```javascript
const response = new Response(null, {
  status: 401,
});
fetchMock.mockReturnValueOnce(Promise.resolve(response));
```

여기 실제 위 서비스를 위한 단위 테스트가 있다.

```typescript
import fetchMock from 'jest-fetch-mock';

import { countriesService } from './countries.service';
import { mockCountriesResponse } from './models/countries-response.mock';

describe('Countries Service', () => {
  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('should return response if successful', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockCountriesResponse));
    const actual = await countriesService.getCountries('en-CA');
    expect(actual).toEqual(mockCountriesResponse);
  });

  it('should throw response if returns error response', async () => {
    const response = new Response(null, {
      status: 401,
    });
    fetchMock.mockReturnValueOnce(Promise.resolve(response));
    try {
      await countriesService.getCountries('en-CA');
    } catch (actual) {
      expect(actual).toEqual(response);
    }
  });
});
```

## 프리젠테이셔널 컴포넌트들

프리젠테이셔널 컴포넌트들은 오직 그들의 부모로부터 받은 props에 의존하는 데이터를 보여줍니다. - 어떤 상태 값과도 연결 되지 않습니다.

나의 의견에는 프리젠테이셔널 컴포넌트들은 props에 따라 적절하게 표시되는지 확인 할 필요가 없다고 생각한다. 대부분의 경우 접근성 검사를 위한 단위 테스트만 진행 했다.

## 스마트/컨테이너/연결 컴포넌트들

스마트/컨테이너/연결 컴포넌트들은 상태 값과 연결되는 컴포넌트들 이다. 나의 경우에는 상태 관리로 Redux를 사용한다. Redux 스토어를 실제 셋팅 대신에 `redux-mock-store` 라이브러리를 이용해 모킹을 한다.

```
# npm
npm install redux-mock-store @types/redux-mock-store --save-dev

# yarn
yarn add redux-mock-store --dev
yarn add @types/redux-mock-store --dev
```

모킹 스토어를 설치하기 위해 다음과 같이 작성한다.

```typescript
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('...', () => {
  beforeEach(() => {
    store = mockStore({<mock store state value>});
    store.dispatch = jest.fn();
  });
  
  it('...', () => {
    render(
      <Provider store={store}>
        <Component ...>
      </Provider>
    );
  });
});
```

다음은 보통 쓰는 테스트이다.

- 스토어 상태들의 다른 타입들을 넘기면 데이터가 정확히 표시되는지 확인 할 수 있다.

```typescript
describe('initial state', () => {
  beforeEach(() => {
    store = mockStore({<intial state>});
    store.dispatch = jest.fn();
  });
  it('should show loading spinner');
});

describe('state with success fetch status', () => {
  beforeEach(() => {
    store = mockStore({<state with success fetch status>});
    store.dispatch = jest.fn();
  });
  it('should not show loading spinner');
});
```

- 특정 이벤트가 발생할 때 올바른 작업으로 디스패치가 트리거되는지 확인한다.

```javascript
expect(store.dispatch).toBeCalledWith(<expected action>);
```

여기 실제 작성했던 스마트 컴포넌트를 단위 테스트하는 예제가 있다.

```typescript
import { render } from '@testing-library/react';
import { mockQuotePerLeg } from '@white-label-airline/services/quotes';
import {
  FetchStatus,
  initialQuotesState,
  quotesSlice,
} from '@white-label-airline/store';
import { axe } from 'jest-axe';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { mockQuotesQueryParams } from '../models/quotes-query-params.mock';

import Quotes from './quotes';

const mockStore = configureStore([]);

describe('Quotes', () => {
  let store;

  describe('initial state', () => {
    beforeEach(() => {
      store = mockStore({
        quotes: initialQuotesState,
      });

      store.dispatch = jest.fn();
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Provider store={store}>
          <Quotes
            queryParams={mockQuotesQueryParams}
            isOutbound={true}
            selectQuote={jest.fn()}
          />
        </Provider>
      );

      expect(await axe(container)).toHaveNoViolations();
    });

    it('should show loading spinner', () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <Quotes
            queryParams={mockQuotesQueryParams}
            isOutbound={true}
            selectQuote={jest.fn()}
          />
        </Provider>
      );

      expect(queryByTestId('loading')).toBeTruthy();
    });

    it('should dispatch action to load quotes', () => {
      render(
        <Provider store={store}>
          <Quotes
            queryParams={mockQuotesQueryParams}
            isOutbound={true}
            selectQuote={jest.fn()}
          />
        </Provider>
      );

      expect(store.dispatch).toBeCalledWith(
        quotesSlice.actions.getQuotes({
          ...mockQuotesQueryParams,
          isOutbound: true,
        })
      );
    });
  });

  describe('state with success fetch status', () => {
    beforeEach(() => {
      store = mockStore({
        quotes: {
          fetchStatus: FetchStatus.Success,
          quotes: {
            outbound: [mockQuotePerLeg],
          },
        },
      });

      store.dispatch = jest.fn();
    });

    it('should show quotes list', () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <Quotes
            queryParams={mockQuotesQueryParams}
            isOutbound={true}
            selectQuote={jest.fn()}
          />
        </Provider>
      );

      expect(queryByTestId('loading')).toBeFalsy();
      expect(queryByTestId('quotes-list')).toBeTruthy();
    });
  });

  describe('state with error fetch status', () => {
    beforeEach(() => {
      store = mockStore({
        quotes: {
          fetchStatus: FetchStatus.Error,
          quotes: {},
        },
      });

      store.dispatch = jest.fn();
    });

    it('should show not show loading spinner nor quotes list', () => {
      const { queryByTestId } = render(
        <Provider store={store}>
          <Quotes
            queryParams={mockQuotesQueryParams}
            isOutbound={true}
            selectQuote={jest.fn()}
          />
        </Provider>
      );

      expect(queryByTestId('loading')).toBeFalsy();
      expect(queryByTestId('quotes-list')).toBeFalsy();
    });
  });
});
```

## 리덕스 파일들

**Note:** 리덕스 파일들을 테스트 하기 위해 [Redux Toolkit](https://redux-toolkit.js.org/) 와 [redux-observable](https://redux-observable.js.org/)를 사용 했다.

### 리듀서

리듀서는 테스트 하기 간단한 순수함수로 대게 다음과 같은 패턴을 지닌다.

```typescript
const action = <any action>;
const state = reducer(<initial state value>, action);
expect(state).toEqual(<expected state value>);
```

여기 리듀서를 위한 단위 테스트 예제가 있다.

```typescript
import { mockCountry } from '@white-label-airline/services/countries';

import { FetchStatus } from '../models/fetch-status.enum';

import { countriesSlice } from './countries.slice';
import { initialCountriesState } from './models/countries-state.initial';

describe('Countries Slice', () => {
  it('should reset state when get countries', () => {
    const action = countriesSlice.actions.getCountries();
    const state = countriesSlice.reducer(initialCountriesState, action);
    expect(state).toEqual({
      fetchStatus: FetchStatus.Loading,
      countries: [],
    });
  });

  it('should set state when get countries success', () => {
    const action = countriesSlice.actions.getCountriesSuccess([mockCountry]);
    const state = countriesSlice.reducer(initialCountriesState, action);
    expect(state).toEqual({
      fetchStatus: FetchStatus.Success,
      countries: [mockCountry],
    });
  });

  it('should set state when get countries failed', () => {
    const action = countriesSlice.actions.getCountriesError();
    const state = countriesSlice.reducer(initialCountriesState, action);
    expect(state).toEqual({
      fetchStatus: FetchStatus.Error,
      countries: [],
    });
  });
});
```

### 선택자들

리듀서와 유사하게 선택자들 또한 순수함수로 다음과 같은 패턴을 따른다.

```typescript
const actual = selectorFn(<mock state value>);
const expected = <expected selector return value>;
expect(actual).toEqual(expected);
```

선택자들을 위한 단위 테스트 예제이다.

```typescript
import { FetchStatus } from '../models/fetch-status.enum';
import { mockInitialRootState } from '../root/root-state.mock';

import { countriesSelectors } from './countries.selectors';

describe('Countries Selectors', () => {
  describe('initial state', () => {
    it('should return countries', () => {
      const actual = countriesSelectors.getCountries(mockInitialRootState);
      const expected = [];

      expect(actual).toEqual(expected);
    });

    it('should return countries fetch status', () => {
      const actual = countriesSelectors.getCountriesFetchStatus(
        mockInitialRootState
      );
      const expected = FetchStatus.Initial;

      expect(actual).toEqual(expected);
    });
  });
});
```

### 에픽들

나는 비동기 액션을 다루기 위해 `[redux-observable](https://redux-observable.js.org/)` 를 사용한다. 다른 방식으로는 `[Thunk](https://redux.js.org/recipes/writing-tests#async-action-creators)` 또는 `[redux-saga](https://redux-saga.js.org/docs/advanced/Testing.html)` 이 있다.

다음과 같은 패턴으로 단위 테스트를 진행하는 예제 이다.

```typescript
describe('<epic name>', () => {
  let action$: ActionsObservable<Action>;
  beforeEach(() => {
    action$ = new ActionsObservable(
     of(<triggered action>)
    );
  });
  it('should map to certain action', (done) => {
    epicFn(action$).subscribe({
      next: (action) => {
        expect(action).toEqual(<expected action>);
        done();
      },
    });
  });
});
```

에픽을 위한 단위 테스트 에제 이다.

```typescript
import { Action } from '@reduxjs/toolkit';
import {
  countriesService,
  mockCountriesResponse,
} from '@white-label-airline/services/countries';
import { ActionsObservable } from 'redux-observable';
import { of } from 'rxjs';

import { getCountriesEpic } from './countries.epics';
import { countriesSlice } from './countries.slice';

jest.mock('@white-label-airline/services/countries');

describe('Countries Epics', () => {
  describe('getCountriesEpic', () => {
    let action$: ActionsObservable<Action>;

    beforeEach(() => {
      action$ = new ActionsObservable(
        of(countriesSlice.actions.getCountries())
      );
    });

    it('should map to success action if service returns valid response', (done) => {
      countriesService.getCountries = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockCountriesResponse));

      getCountriesEpic(action$).subscribe({
        next: (action) => {
          expect(countriesService.getCountries).toHaveBeenCalled();
          expect(action).toEqual(
            countriesSlice.actions.getCountriesSuccess(
              mockCountriesResponse.Countries
            )
          );
          done();
        },
      });
    });

    it('should map to error action if service throws an error', (done) => {
      const mockError = new Error('random error');
      countriesService.getCountries = jest
        .fn()
        .mockImplementation(() => Promise.reject(mockError));

      getCountriesEpic(action$).subscribe({
        next: (action) => {
          expect(action).toEqual(countriesSlice.actions.getCountriesError());
          done();
        },
      });
    });
  });
});
```

## Hooks

[custom React hooks](https://reactjs.org/docs/hooks-custom.html) 을 테스트 하기 위해서 `[@testing-library/react-hooks](https://github.com/testing-library/react-hooks-testing-library)` 를 사용한다.

```
# npm
npm install --save-dev @testing-library/react-hooks react-test-renderer

# yarn
yarn add @testing-library/react-hooks --dev
yarn add react-test-renderer --dev
```

나는 나의 커스텀 훅 안에 또 다른 라이브러리 훅을 사용한다.

```typescript
import { useFormikContext, getIn } from 'formik';

const { touched, errors, isSubmitting } = useFormikContext();
```

단위 테스트에서 이것을 모킹 하는 방법은 다음과 같다.

```typescript
jest.mock('formik', () => ({
  useFormikContext: () => {
    return {
      touched: { fieldName: true },
      errors: { fieldName: 'random error' },
      isSubmitting: true,
    };
  },
  getIn: (context: Record<string, unknown>, fieldName: string) => {
    return context[fieldName];
  },
}));
```

여기 나의 커스텀 훅과 그것의 단위 테스트 예제 이다.

```typescript
// use-field-errors-touched.hook.spec.ts
import { renderHook } from '@testing-library/react-hooks';

import { useFieldErrorTouched } from './use-field-errors-touched.hook';

jest.mock('formik', () => ({
  useFormikContext: () => {
    return {
      touched: { fieldName: true },
      errors: { fieldName: 'random error' },
      isSubmitting: true,
    };
  },
  getIn: (context: Record<string, unknown>, fieldName: string) => {
    return context[fieldName];
  },
}));

describe('Use Field Errors Touched Hook', () => {
  test('should set field error and touched', () => {
    const { result } = renderHook(() => useFieldErrorTouched('fieldName'));
    expect(result.current.fieldError).toEqual('random error');
    expect(result.current.fieldTouched).toEqual(true);
    expect(result.current.isSubmitting).toEqual(true);
  });
});
```

```typescript
// use-field-errors-touched.hook.ts
import { useFormikContext, getIn } from 'formik';
import { useState, useEffect } from 'react';

export function useFieldErrorTouched(name: string) {
  const { touched, errors, isSubmitting } = useFormikContext();
  const [fieldError, setFieldError] = useState(null);
  const [fieldTouched, setFieldTouched] = useState(false);

  useEffect(() => {
    setFieldError(getIn(errors, name));
  }, [errors, name]);

  useEffect(() => {
    setFieldTouched(getIn(touched, name));
  }, [touched, name]);

  return { fieldError, fieldTouched, isSubmitting };
}
```

## 범위 임계 값

지금까지 몇몇 단위 테스트를 작성했고 적용 범위의 임계값을 셋팅할 것이다. `jest.config` 파일에 다음과 같이 추가하자.

```javascript
  collectCoverage: true,
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
```

터미널에서 다음 적용 범위 리포트를 받아 볼 수 있다.

app 에 대한 내 의견은 너무 높은 적용 범위의 수치를 적용할 필요가 없다는 것이다. 수치가 높을 수록 더 나은 코드라는 의미는 아니다. 의미 있는 단위 테스트를 계속 작성하라는 의미로 여기에 몇 가지 숫자를 추가했다.

### Precommit hooks

그럼에도 불구하고 각 커밋 전에 단위 테스트가 동작하고 통과되기 위한 precommit 훅을 설정할 것이다.

- Install `[husky](https://github.com/typicode/husky)`
- In your `package.json`, add the following lines

```javascript
"husky": {
    "hooks": {
      "pre-push": "npm run lint && npm run test"
    }
  }
```

## 결론

