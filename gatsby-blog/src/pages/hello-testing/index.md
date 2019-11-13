---
title: Hello Testing (작성중..)
date: '2019-11-14T10:00:03.284Z'
---

이 글은 아래 링크에 있는 글을 의역 했습니다.
[참조](https://medium.com/welldone-software/an-overview-of-javascript-testing-in-2019-264e19514d0a)

# Test Types

일반적으로 웹사이트를 위한 아주 중요한 테스트 타입들은 다음과 같다.

- **Unit Tests** - 입력을 제공하고 출력이 예상한것과 같은지 확인하여 function들 또는 class들 같은 개별 테스팅 입니다.

```javascript
expect(fn(5)).to.be(10)
```

- **Integration Tests** - 사이드 이펙트를 포함해서 그것들의 목표를 위한 몇몇의 유닛 테스트에서의 절차들을 테스트 합니다.

```javascript
const flyDroneButton = document.getElementById('fly-drone-button')

flyDroneButton.click()

assert(isDroneFlyingCommandSent())

//or even
drone.checkIfFlyingViaBluetooth().then(isFlying => assert(isFlying))
```

- **Functional Tests** (또는 e2e 테스트라고 알려져있는) - 웹사이트 또는 브라우저의 컨트롤을 통해서 product 스스로에서 기능 시나리오가 어떻게 작동하는지 테스트 하는 방법입니다. 이 테스트 들은 어플리케이션의 내부 구조는 무시하고 블랙박스처럼 외부 에서 바라보는 것처럼 테스트를 진행합니다.

```
Go to page "https://localhost:3303"

Type "test-user" in the field "#username"

Type "test-pass" in the field "#password"

Click on "#login"

Expect Page Url to be https://localhost:3303/dashboard

Expect "#name" to be "test-name"
```

# Running Tests

테스트들은 테스트 라이브러리와 테스트를 포함하고 있는 JS들과 함께 HTML 페이지를 만들어서 브라우저에서 테스트가 이루어 집니다.

또한 테스트들은 간단하게 test를 import하고 관련 라이브러리들과 함께 Node.js에서도 실행이 가능합니다.
jsdom은 대게 순수한 자바스크립트를 사용해서 브라우저와 같은 환경에서 시뮬레이션 하기 위해 Node.js에서 사용이 됩니다.
그것은 window, document, body, location, cookies, selectors 그리고 브라우저 안에서 JS를 돌릴때 얻을 수 있는 어떤 것이든 제공합니다.
하지만 render들은 실제가 아닙니다. 'headless mode' 와는 차이가 있습니다. 왜냐하면 headless mode를 하기 위해서는 실제 브라우저가 필요하고 jsdom과 다르게 스크린샷을 가질 수 있습니다.

우리는 두번째 방법(Node.js + jsdom) 방법을 추천합니다. 왜냐하면 실제 브라우저에서 테스트 하는 것보다 빠르기 때문입니다. 첫번째 방법이 일상 샐활에서 실제 그려주는 소프트웨어와 같은 것을 사용해서 더 실뢰도가 있긴 하지만 jsdom을 사용하면 가볍고 다양한 케이스들을 충분히 행할 수 있습니다.

# Test Tools Types

테스트 툴들은 다음과 같은 기능들로 나뉘어 집니다. 일부는 하나의 기능 만 제공하고 일부는 조합을 제공합니다.
가장 유연한 설정 기능을 얻으려면 여러 도구를 함께 사용하는 것이 일반적입니다.

1.  **Test launchers** 는 당신의 테스트들을 유저가 CLI 또는 UI 를 이용해서 설정한 노드 또는 브라우저에서 실행하게 합니다.
    또한 브라우저를 수동으로 열어도 가능합니다. ([Karma](https://karma-runner.github.io/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

2.  **Testing structure** 는 당신의 테스트 파일들을 정렬할 수 있도록 도와줍니다. ([Mocha](https://mochajs.org/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Cucumber](https://github.com/cucumber/cucumber-js), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

3.  **Assertion functions** 기대한 값과 테스트 결과 값을 비교합니다. ([Chai](http://chaijs.com/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Unexpected](http://unexpected.js.org/), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

4.  **Generate and display test progress and results.** ([Mocha](https://mochajs.org/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Karma](https://karma-runner.github.io/), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

5.  **Mocks, spies, and stubs** 는 테스트들의 특정 부분을 분리하고 그것들의 사이드 이펙트 들과 분리시켜 주기 위해 사용합니다. ([Sinon](http://sinonjs.org/), [Jasmine](http://jasmine.github.io/), [enzyme](http://airbnb.io/enzyme/docs/api/), [Jest](https://facebook.github.io/jest/), [testdouble](https://testdouble.com/))

6.  **Generate and compare snapshots** 는 이전 수행에서의 의도로 부터 컴포넌트와 데이터 구조의 변화를 확인하기 위해 사용합니다. ([Jest](https://facebook.github.io/jest/), [Ava](https://github.com/avajs/ava))

7.  **Generate code coverage** 당신의 테스트로 인해 코드가 어느정도 커버가 되는지에 대한 코드의 양을 알 수 있습니다. ([Istanbul](https://gotwarlost.github.io/istanbul/), [Jest](https://facebook.github.io/jest/), [Blanket](http://blanketjs.org/))

8.  **Browser Controllers** Functional Tests를 위한 유저 액션을 시뮬레이션 합니다. ([Nightwatch](http://nightwatchjs.org/), [Nightmare](http://www.nightmarejs.org/), [Phantom](http://phantomjs.org/)**,** [Puppeteer](https://github.com/GoogleChrome/puppeteer), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

9.  **Visual Regression** **Tools** 는 이미지 비교 기술을 사용하여 사이트를 이전 버전과 시각적으로 비교하는 데 사용됩니다. ([Applitools](https://applitools.com/), [Percy](https://percy.io/), [Wraith](http://bbc-news.github.io/wraith/), [WebdriverCSS](https://github.com/webdriverio-boneyard/webdrivercss))

위에서 언급 한 용어 중 일부를 설명해 보겠습니다.

**Test launchers** 들은 테스트 리스트를 받습니다. 그리고 이 테스트들을 돌리기 위한 다양한 설정과 발판들이 필요로 합니다. ( 어떤 브라우저에서 돌아갈지, 어떤 바벨 플러그인을 사용할지, 어떤 포멧으로 결과가 나올지 등등)

```
# Install Karma:
npm install karma --save-dev

# Install plugins that your project needs:
npm install karma-jasmine jasmine-core karma-chrome-launcher karma-firefox-launcher --save-dev

# Run on
npx karma start karma.conf.js --log-level debug --single-run
```

```javascript
// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '../..',
    frameworks: ['jasmine'],
    autoWatch: true,
    browsers: ['Firefox', 'Chrome'],
    files: [
      // simple pattern to load the needed testfiles
      // equal to {pattern: 'test/unit/*.spec.js', watched: true, served: true, included: true}
      'test/unit/*.spec.js',
    ],
    //...
  })
}
```

**Testing structure**는 테스트 구조를 언급합니다. 요즘 테스트는 일반적으로 행동 중심 개발 (BDD)을 지원하는 BDD 구조로 구성됩니다. 종종 다음과 같이 보입니다.

```javascript
describe('calculator', function() {
  // describes a module with nested "describe" functions
  describe('add', function() {
    // specify the expected behavior
    it('should add 2 numbers', function() {
       //Use assertion functions to test the expected behavior
       ...
    })
  })
})
```

**Assertion functions**은 테스트 된 변수에 예상 값이 포함되도록하는 데 사용됩니다.
그들은 일반적으로 다음과 같이 보입니다. 처음 두 스타일이 가장 일반적입니다.

```javascript
// Chai expect (popular)
expect(foo).to.be.a('string')
expect(foo).to.equal('bar')

// Jasmine expect (popular)
expect(foo).toBeString()
expect(foo).toEqual('bar')

// Chai assert
assert.typeOf(foo, 'string')
assert.equal(foo, 'bar')

// Unexpected expect
expect(foo, 'to be a', 'string')
expect(foo, 'to be', 'bar')
```

**Spies** 는 우리에게 함수에 대한 정보를 제공합니다. 예를 들면 얼마나 많이 호출이 되었는지 어느 케이스에 누가 호출했는지에 대한 정보를 알려줍니다. 즉, 해당 함수에 스파이를 심어서 정보를 빼내오는 것입니다.

Spies 들은 기대가 되는 프로세스의 사이드 이팩트를 확인하기 위해서 통합 테스트에서 사용됩니다. 예를 들면, 일부 프로세스 동안에 계산 함수가 몇 번이나 호출이 되었는가? 에 대한 확인을 할 수 있습니다.

`father.execute()`가 어떻게 동작하는지 알아보고 `father.child`가 이 프로세스에서 몇번 동작하는지 세어봅시다.

```javascript
class Child {
  ...
  execute() { ... }
  ...
}

class Father {
  constructor() {
    this.child = new Child()
  }
  ...
  execute() {
    ...
    this.child.execute()
    ...
    this.child.execute()
    ...
  }
  ...
}

it('should call child execute twice when father executes', () => {
  const father = new Father()

  // create a sinon spy to spy on object.method
  const childSpy = sinon.spy(father.child, 'execute')

  // call the method with the argument "3"
  father.execute()

  // make sure child.execute was called twice
  assert(childSpy.calledTwice)
})
```

**Stubbing or dubbing** 는 테스트 중에 예상되는 동작을 보장하기 위해 기존 모듈의 선택된 방법을 사용자 제공 기능으로 대체합니다.

다른 컴포넌트를 테스트하는 도중에 `user.isValid()`가 항상 `true` 인것을 보장받기 위해서 다음과 같이 할 수 있습니다.

```javascript
// Sinon
sinon.stub(user, 'isValid').returns(true)

// Jasmine stubs are actually spies with stubbing functionallity
spyOn(user, 'isValid').andReturns(true)

// Testing someFn with user where user.isValid() returns true
assert(someFn(user))
```

**Mocks or Fakes** 들은 프로세스의 다른 부분을 테스트하기 위해 특정 모듈이나 동작을 위조하는 데 사용됩니다.

예를 들면, Sinon 에서는 특정 테스트 플로우를 테스트할때 빠르고 예상되는 응답을 보장하는 오프라인인 fake 서버를 만들 수 있습니다.

```javascript
it('returns an object containing all users', done => {
  // create and configure the fake server to replace the native network call
  const server = sinon.createFakeServer()
  server.respondWith('GET', '/users', [
    200,
    { 'Content-Type': 'application/json' },
    '[{ "id": 1, "name": "Gwen" },  { "id": 2, "name": "John" }]',
  ])

  // call a process that includes the network request that we mocked
  Users.all().done(collection => {
    const expectedCollection = [
      { id: 1, name: 'Gwen' },
      { id: 2, name: 'John' },
    ]
    expect(collection.toJSON()).to.eql(expectedCollection)
    done()
  })

  // respond to the request
  server.respond()

  // remove the fake server
  server.restore()
})
```

**Snapshot Testing** 은 기대되는 결과 값이랑 데이터 구조를 비교할 때 사용합니다.

공식 Jest 문서의 다음 예에서 특정 `Link` 컴포넌트의 스냅샷 테스트를 보여줍니다.

```javascript
it('renders correctly', () => {
  // create an instance of the Link component with page and child text
  const linkInstance = <Link page="http://www.facebook.com">Facebook</Link>

  // create a data snapshot of the component
  const tree = renderer.create(linkInstance).toJSON()

  // compare the sata to the last snapshot
  expect(tree).toMatchSnapshot()
})
```

이것은 사실 렌더가 되는것이 아니고 컴포넌트의 그림을 찍는 것입니다. 하지만 그것은 분리된 파일로 내부 데이터를 저장합니다.

```
exports[`renders correctly 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;
```

테스트가 동작할때, 새로운 스냅샷은 마지막에 찍었던것과 비교합니다. 개발자는 변화가 의도된 것인지 확인하는 알림을 받습니다.

![https://miro.medium.com/max/2000/0*wqUDMDebG-ipMs5d.png](https://miro.medium.com/max/2000/0*wqUDMDebG-ipMs5d.png)

> 스냅샷은 대게 컴포넌트의 표현 데이터를 비교하는데 사용하지만 다른 데이터 타입과 비교하는데에도 쓰입니다. redux stores 또는 어플리케이션의 다른 유닛의 내부 구조 같은 곳에서도 쓰입니다.

브라우저는 그 위에 설치된 드라이버로 제어 할 수 있으며 다른 방법을 사용하여 브라우저를 제어 할 수 있습니다. 이것이 셀레늄의 작동 방식입니다.

```
Node.js <=> WebDriver <=> FF/Chrome/IE/Safari drivers <=> browser
```

또는 전체 어플리케이션의 환경을 접근할 수 있는 JS 코드의 [script injection](https://dzone.com/articles/testcafe-e2e-testing-tool) 는 유저의 행동 시뮬레이션과 같은 이벤트를 발생 시킬 수 있습니다.

```javascript
document.getElementByID('someButton').dispatchEvent(clickEvent).
```

```
Node.js <=> FF/Chrome/IE/Safari injected script <=> Simulated events
```

# Putting it All Together

이제 당신이 좋아하는 문법과 테스트 구조와 단언하는 구문의 함수 라이브러리를 선택하고 어떻게 테스트를 진행하길 원하는지를 결정해야 한다.

몇몇 프레임 워크들은 [Jest](https://facebook.github.io/jest/docs/en/snapshot-testing.html), [Jasmine](https://jasmine.github.io/), [TestCafe](https://devexpress.github.io/testcafe/), and [Cypress](https://www.cypress.io/) 이 모든것을 제공합니다.

또한 몇몇 것들은 몇몇 기능만 제공하고 다른 라이브러리와 혼재해서 사용해야 합니다. ([mocha](https://mochajs.org/) + [chai](https://www.chaijs.com/) + [sinon](https://sinonjs.org/))

여기서는 2가지의 다른 프로세스를 생성할것을 제안 합니다. 하나는 **unit and integration tests** 이고 다른 하나는 **Functional Tests** 입니다. 왜냐하면 functional tests는 대게 길고 특별하게 몇몇의 다른 브라우저에서 테스트를 진행해야 하기 때문입니다.

각 유형의 테스트를 실행하는 것이 적절한시기를 생각하십시오. 예를 들면 다음과 같습니다.
모든 변경에 대한 단위 + 통합, 커밋 전에 만 기능 테스트.

## Unit Tests

이 단위는 응용 프로그램 유틸리티, 서비스 및 도우미의 모든 작은 단위를 포함해야합니다.
이 모든 단위에 간단하고 엣지 케이스 입력(예상을 벗어난 입력)을 제공하고 어설 션 함수을 사용하여 출력이 예상 한대로 되도록 하십시오.
또한 코드 적용 범위보고 도구를 사용하여 이 유닛테스가 어느정도 적용되는지 확인하십시오.

유닛 테스트들은 함수형 프로그래밍과 가능하면 순수 함수를 사용하기 위한 한가지 이유이기도 합니다.

당신의 어플리케이션이 순수하면 할수록, 테스트 하기는 점점 쉬워 집니다.

## Integration Tests

구식 테스트는 단위 테스트에 중점을 두 었으며 많은 작은 부품이 작동하지만 전체적으로 프로세스가 계속 실패하는 응용 프로그램이 만들어졌습니다.
반면에 통합 테스트는 장치가 리팩터링되고 테스트를 통과했지만 해당 프로세스에 실패한 경우를 감지합니다.

![https://miro.medium.com/max/300/1*xHibbXdcePT0GtpeZRgxSA.gif](https://miro.medium.com/max/300/1*xHibbXdcePT0GtpeZRgxSA.gif)

시스템의 각 부분 이상을 개별적으로 테스트하는 것이 중요한 이유에 대한 최고의 데모는이 위대한 GIF에서 볼 수 있습니다.

통합 테스트는 중요한 교차 모듈 프로세스를 포함해야합니다.
때로는 여러 클래스로부터의 프로세스가 확장되고 프런트-엔드-백-엔드 상호 작용과 같은 다른 시스템을 테스트 하기도 합니다.

단위 테스트와 비교해서 예상되는 side effect를 보장하기 위해 **spies**를 사용하는것이 이득이 될 것입니다. 그리고 **stubs**은 특정 프로세스에 포함되지 않은 프로세스의 한 부분을 mock과 modify 위해 사용하는 것이 이득이 될 것입니다.

또한 단위 테스트와 달리 창에 액세스하려면 브라우저 또는 브라우저와 유사한 환경 (jsdom)이 필요할 수 있습니다.

**구성 요소 스냅 샷 테스트**도 이 범주에 속합니다. 프로세스가 브라우저 나 브라우저와 유사한 환경에 프로세스를 실제로 렌더링하지 않고 선택된 컴포넌트에 프로세스가 어떻게 영향을 미치는지 테스트 할 수있는 방법을 제공합니다.

## Functional Tests

때때론 빠르고 효과적인 unit and integration tests가 충분치 않을 때도 있습니다.

Functional tests 는 브라우저를 컨트롤 합니다. 그리고 유저의 행동을 이들의 환경에서 시뮬레이션 합니다. (clicking, typing, scrolling etc…) 그리고 end user의 시야로 실제 시나리오를 행합니다.

또한 많은 서비스가 이러한 테스트를 실행할 장치와 브라우저를 제공한다는 점에 주목할 가치가 있습니다.
이와 같은 더 많은 서비스가 있습니다.

**Visual regression testing tools**(시각적 회귀 테스트 도구) 를 설정하여 스크린 샷을 스마트하게 비교하여 응용 프로그램의 다른 화면이 시각적으로 괜찮은지 ( 브라우저 마다의 차이점을 비교 - 흡싸 틀린그림 찾기 ) 확인할 수 있습니다. 이 스크린 샷은 일반적으로 기능 테스트의 일부로 또는 별도의 브라우저 자동화 세션을 실행하여 수행됩니다.

![https://miro.medium.com/max/600/1*U8eW7J15E1GIBMQuvmMWVA.gif](https://miro.medium.com/max/600/1*U8eW7J15E1GIBMQuvmMWVA.gif)

# List of General Prominent Testing Tools

### jsdom

### Electron

### Istanbul

### Karma

### Chai

### Unexpected

### Sinon.JS

### testdouble.js

### Wallaby

### Cucumber

# Choose Your Unit and Integration Tests Framework

- 간단히 말해서, 만약 그냥 사직하고 싶다거나 대형 프로젝트에 빠른 프레임워크를 찾고 있다면 **Jest** 와 함께 라면 잘못 가지 않을 것입니다.

- 만약 확장가능하고 매우 유연한 설정을 원한다면, go with **Mocha**.

- 간단함을 원한다면 go with **Ava**.

- 진정한 low-level을 원한다면, go with **tape**.

### Jest

### jasmine

### mocha

### AVA

### tape

# Functional Testing Tools

### selenium

### Protractor

### WebdriverIO

### Nightwatch

### Appium

### TestCafe

### Cypress

### Puppeteer

### PhantomJS

### Nightmare

### CodeceptJS

# Visual Regression Testing

### Applitools

### Percy

### Happo

### LooksSame

### BackstopJS

### AyeSpy

### reg-suit

### Differencify

## No Coding Functional Testing Tools

### testim

### Screener
