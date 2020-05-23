---
title: React testing library 사용기 (ing)
date: '2020-05-23T10:00:03.284Z'
---


## 동기

atomic 으로 디자인된 컴포넌트와 react testing library 를 사용하면서 느낀점을 정리합니다.
느낀점을 정리한 것이라고 꼭 이렇게 해야한다는 것은 아닙니다.

테스팅을 진행해야 할때 가져야할 생각을 정리 합니다.

- 컴포넌트 내에서 상세한 구현의 방법은 잊어야 합니다. 유저는 본인이 원하는 기능의 대한 실제 구현 방법을 생각하지 않습니다. 유저는 행하는 행위에 대해서 원하는 결과 값 또는 결과 행위에 대해서만 바랄 뿐입니다.
- 컴포넌트를 생각하지 않고 실제 화면에 그려지는 DOM 또는 컨텐츠, 텍스트를 생각합니다.
- 기획서가 있다면 페이지 별로 상세 기능을 뽑아 보고 그 페이지를 다시 organisms 단위로 나눠서 테스트 케이스를 짜면 될 듯 싶습니다.
- atomic 특징 상 organisms 단위에서는 통합테스트를 생각하고 그 이하로 부모가 모를 만한 로직을 지니고 있다면 자식들에 한해서 unit test를 진행합니다.
- organisms 단위에서 개선된 children 컴포넌트로 바꿨다거나 class 컴포넌트에서 function 컴포넌트로 바뀌었다거나 했어도 테스트는 유지 가능해야 합니다.

## 경험

organisms 단위에서 테스팅을 진행 했을 경우 실제 고민 했던 것을 적어 봅니다.

### 일반 컴포넌트 일 때 무엇을 테스팅 해야 하는가?

props의 형태에 따라 달라 지는 렌더링을 테스트 합니다.

렌더링 테스트를 진행 할 때는 텍스트가 있는지 없는지 위주로 테스트를 진행 합니다.

```typescript
describe("<TotalStatusInfo />", () => {
  it('데이터 제공 기준일을 받으면 "데이터 제공 기준일" 타이틀과 함께 해당 날짜를 보여줍니다', () => {
    const mockModifyTime: ModifyTime = {
      start_date: "2020-04-12",
      end_date: "2020-05-12",
    };

    const { getByText } = render(
      <TotalStatusInfo modifyTime={mockModifyTime}></TotalStatusInfo>
    );
    getByText("(데이터 제공 기준일 : 2020-04-12 ~ 2020-05-12)");
  });
});
```

어떤 특정한 함수가 props 로 넘어 온다면 해당 함수를 실행 시킬 액션이 있을 것입니다.
이때 두 가지로 확인이 가능 합니다.

해당 컴포넌트가 비지니스 로직을 구현해야 하는 컴포넌트 라면 액션을 fire 해서 UI 의 변화를 감지한다.
이를 통해 비지니스 로직을 구현합니다.

해당 컴포넌트가 비지니스 로직을 구현하는 컴포넌트가 아닌 적절한 자식 컴포넌트에 넘겨주는 역할을 담당한다면  해당 함수가 필요한 인자와 같이 호출 되는지도 확인을 합니다.
이때는 mock 함수를 활용합니다. `jest.fn()`
이를 통해 적절한 컴포넌트에 넘겨주는 지 확인합니다.

```typescript
test("FilterSection의 onClick props를 버튼 들에게 넘겨 버튼 클릭시 버튼 ID를 인자로 넘기면서 호출합니다.", () => {
  const onClick = jest.fn();
  const { getByText } = setup({
    title: sampleTitle,
    filterButtonList: sampleFilterButtonList,
    onClick,
  });
  const aidButton = getByText("aid");
  fireEvent.click(aidButton);

  expect(onClick).toBeCalledWith("aid");
});
```

### 자식 컴포넌트에서 useContext를 사용한 컴포넌트가 있으면 어떻게 테스팅을 진행 해야 하는가?

organisms 컴포넌트의 자식 컴포넌트에서 useContext를 사용을 했다면 organisms 컴포넌트만 render시 에러가 나게 됩니다. 

그래서 해당 ContextProvider 컴포넌트를 감싸서 render를 진행해야 합니다.

```typescript
// 중복 설정을 피하기 위해서 setup 함수를 만들어서 각 test 마다 필요한 설정을 활용합니다.
const setup = (props: UfoStatusWidgetGroupProps) => {
  const utils = render(
    <ModalContextProvider>
      <UfoStatusWidgetGroup {...props}></UfoStatusWidgetGroup>
    </ModalContextProvider>
  );

  return {
    ...utils,
  };
};

test("UfoStatusWidgetGroup props에 statusGroupData 넣었을시 각각의 수치가 렌더링 된다.", () => {
  const { getByText } = setup({
    statusGroupData,
    isLoading: false,
    error: null,
  });

  getByText("10,000");
  getByText("1,203,405");
  getByText("32.89");
});
```

### rxjs ajax 를 사용한 컴포넌트는 어떻게 테스팅을 진행 해야 하는가?

가장 많이 고민을 했던 부분입니다.

기존 axios 를 사용 했다면 node_modules를 mocking 하는 방법과 `axios-mock-adapter` 를 선택 할 수 있겠습니다만, 저는 rxjs 에 내장되어 있는 ajax 를 사용했기 때문에 rxjs 의 ajax를 mocking 하는 방법을 찾아 보기로 했습니다.

그 결과 찾을 수 없었습니다. ( 혹시 아시는 분은 알려주시면 감사 하겠습니다. )
가장 마지막까지 시도 했던 방법은 `jest.mock()` 함수로 ajax를 mocking 하는 방법 이였습니다.
`jest.doMock()` 함수를 써봐도 잘 되진 않았습니다.

```typescript
jest.mock('rxjs/ajax', () => {
  return {
    __esModule: true,
    ajax: jest.fn(() => [])
  }
})
```

위 코드 `ajax: jest.fn(() => [])` 에서 사실 return 해야 하는 타입은 `Observable<AjaxResponse>` 가 되어야 했습니다. 타입이 안맞아서 에러가 떨어집니다.
`dynamic import` 를 활용해서 다음과 같이 Observable 까진 생각해 볼 수 있었습니다만, `AjaxResponse` 타입의 Mock을 어떻게 구현을 해야 할지 몰랐습니다.
`dynamic import` 를 활용하는 것은 `jest.mock`은 `babel-jest` 로 인해서 자동으로 import 문 위로 hoist 되기 때문에 활용 한 것입니다.

```typescript
jest.mock('rxjs/ajax', async () => { // mock 할때 async 함수를 넣으면 안된다.
  // const {of} = import('ajax')
  // or
  // const {AjaxResponse} = import('rxjs/ajax')
  return {
    __esModule: true,
    // ajax: jest.fn(() => of([])) // Observble 타입까진 만들 수 있는데 AjaxResponse 타입은 ??
    ajax: jest.fn(() => of(new AjaxResponse(??)))
  }
})
```

그래서 생각한 방법은 rxjs/ajax 를 mocking 하는 것이 아닌 xhr 을 mocking 하는 것입니다.

`import mock from "xhr-mock";` 를 활용하는 방법 이였습니다.

```typescript
describe("<TagOccupancyCard />", () => {
  // replace the real XHR object with the mock XHR object before each test
  beforeEach(() => mock.setup());

  // put the real XHR object back and clear the mocks after each test
  afterEach(() => mock.teardown());

  const setup = (props: TagOccupancyCardProps) => {
    const utils = render(
      <ModalContextProvider>
        <TagOccupancyCard {...props}></TagOccupancyCard>
      </ModalContextProvider>
    );
    return {
      ...utils,
    };
  };

  test("API Test", async () => {
    mock.get(`${DOMAIN}/Test`, {
      status: 200,
      reason: "Created",
      body: JSON.stringify([
        {
          id: "UFO",
          value: 100,
          tag_ratio: 0,
          partname: "호잇",
          fullname: "호잇",
        },
        {
          parent: "UFO",
          id: "P10",
          value: 47.18,
          tag_ratio: 0,
          partname: "아잇",
          fullname: "아잇",
        },
      ]),
    });

    const { getByText } = setup({
      currentFilterData: {
        name: "adid",
        isDisable: false,
        isNew: false,
        id: "adid",
        isActive: true,
      },
    });

    await wait(() => getByText("호잇"));
    await wait(() => getByText("아잇"));
  });
});
```

따로 rxjs/ajax 를 mocking 해주는 라이브러리는 못 찾았습니다.

생각해 보면 좀 더 원시적인 xhr를 mocking 해서 rxjs를 쓰던 axios를 쓰던 관계 없이 테스트가 통과 했었어야 하지 않았나 싶습니다.

### highchart.js 를 활용해서 차트를 그리는 컴포넌트 테스트 중에 highchart.js error 26 이 오류로 나온다면

highchart.js 26 번 에러를 찾아보면 이런 글이 나옵니다.

[https://www.highcharts.com/errors/26/](https://www.highcharts.com/errors/26/)

- WebGL not supported, and no fallback module included

이게 왜 뜨는지 다음과 같이 검색했지만 소득이 없었습니다.

- jest highchart error 26
- jsdom webgl

등 여러 검색 결과에도 찾을 수 없었습니다. 결국 node_modules로 왜 26번 에러가 뜨는지 확인해 본 결과
hightchart 의 boost 모듈에서 에러가 발생하는 것을 알 수 있었습니다.
차트를 그릴 때, 다음과 같은 옵션을 썼다면

```typescript
{
  boost: {
    useGPUTranslations: true,
  },
}
```

아래와 같은 에러를 찾아 볼 수 있습니다.

```text
Debugger attached.
  console.log
    Highcharts error #26: www.highcharts.com/errors/26/

      at defaultHandler (node_modules/highcharts/highcharts.src.js:469:21)
```

에러를 안뜨게 하는 방법은 못찾았지만 생각해보면 브라우저 환경에서 정확히 테스트를 하는 것이 아니기 때문에 무시하기로 했습니다.

## 정리

앞으로 계속 테스트를 작성해 나가면서 정리하고 몇 가지 규칙을 세워두면 TDD 문화를 정착 해 나갈 수 있지 않을까 생각합니다.
계속 업데이트 됩니다.
