---
title: Hello Testing 
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

1. **Test launchers** 는 당신의 테스트들을 유저가 CLI 또는 UI 를 이용해서 설정한 노드 또는 브라우저에서 실행하게 합니다.
    또한 브라우저를 수동으로 열어도 가능합니다. ([Karma](https://karma-runner.github.io/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

2. **Testing structure** 는 당신의 테스트 파일들을 정렬할 수 있도록 도와줍니다. ([Mocha](https://mochajs.org/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Cucumber](https://github.com/cucumber/cucumber-js), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

3. **Assertion functions** 기대한 값과 테스트 결과 값을 비교합니다. ([Chai](http://chaijs.com/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Unexpected](http://unexpected.js.org/), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

4. **Generate and display test progress and results.** ([Mocha](https://mochajs.org/), [Jasmine](http://jasmine.github.io/), [Jest](https://facebook.github.io/jest/), [Karma](https://karma-runner.github.io/), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

5. **Mocks, spies, and stubs** 는 테스트들의 특정 부분을 분리하고 그것들의 사이드 이펙트 들과 분리시켜 주기 위해 사용합니다. ([Sinon](http://sinonjs.org/), [Jasmine](http://jasmine.github.io/), [enzyme](http://airbnb.io/enzyme/docs/api/), [Jest](https://facebook.github.io/jest/), [testdouble](https://testdouble.com/))

6. **Generate and compare snapshots** 는 이전 수행에서의 의도로 부터 컴포넌트와 데이터 구조의 변화를 확인하기 위해 사용합니다. ([Jest](https://facebook.github.io/jest/), [Ava](https://github.com/avajs/ava))

7. **Generate code coverage** 당신의 테스트로 인해 코드가 어느정도 커버가 되는지에 대한 코드의 양을 알 수 있습니다. ([Istanbul](https://gotwarlost.github.io/istanbul/), [Jest](https://facebook.github.io/jest/), [Blanket](http://blanketjs.org/))

8. **Browser Controllers** Functional Tests를 위한 유저 액션을 시뮬레이션 합니다. ([Nightwatch](http://nightwatchjs.org/), [Nightmare](http://www.nightmarejs.org/), [Phantom](http://phantomjs.org/)**,** [Puppeteer](https://github.com/GoogleChrome/puppeteer), [TestCafe](https://github.com/DevExpress/testcafe), [Cypress](https://www.cypress.io/))

9. **Visual Regression** **Tools** 는 이미지 비교 기술을 사용하여 사이트를 이전 버전과 시각적으로 비교하는 데 사용됩니다. ([Applitools](https://applitools.com/), [Percy](https://percy.io/), [Wraith](http://bbc-news.github.io/wraith/), [WebdriverCSS](https://github.com/webdriverio-boneyard/webdrivercss))

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

거기에는 수십 가지 훌륭한 도구가 있습니다. 여기에 모든 것을 포함시킬 수는 없었지만 다음 목록에 알아야 할 가장 중요하고 가장 잘 관리되는 도구와 가장 채택 된 도구를 포함 시키려고 했습니다.

### jsdom

[jsdom](https://github.com/jsdom/jsdom?source=post_page-----264e19514d0a----------------------)


**jsdom**은 WHATWG DOM 및 HTML 표준의 JavaScript 구현입니다. 즉, jsdom은 일반 JS 이외의 것을 실행하지 않고 브라우저 환경을 시뮬레이션합니다.

이전에도 말했듯이, 이 브라우저 환경 시뮬레이션에서 test를 진행하는 것은 매우 빠릅니다. jsdom의 단점은 실제 브라우저 외부에서 모든 것을 시뮬레이션 할 수 없다는 것입니다 (예 : 스크린 샷을 찍을 수 없음).이를 사용하면 테스트 범위가 제한 될 수 있습니다.

JS 커뮤니티는 jsdom을 빠르게 향상시키고 현재 버전은 실제 브라우저와 매우 가깝습니다.

### Electron

[Electron](https://github.com/electron/electron?source=post_page-----264e19514d0a----------------------)

**Electron framework** 은 자바스크립트와 HTML 과 CSS를 사용해서 데스크탑의 여러 플랫폼을 작성할 수 있습니다. 이것 또한 headless mode (창이 없이 화면을 그려주는 작업을 가상으로 진행해주는 방법) 입니다.

방대한 커뮤니티가 있고 매우 중요한 어플리케이션들이 이 위에 구축되어 있습니다. 그래서 따라서 최신 상태를 유지해야합니다. [Atom](https://atom.io/), [Slack](http://slack.com/), [Skype](https://www.macstories.net/news/microsoft-releases-cross-platform-skype-update-and-announces-call-recording-and-other-features/), [GitHub Desktop](https://desktop.github.com/) 에서 사용하고 있습니다.

[Cypress.io] (https://www.cypress.io/)와 같은 테스트 도구는 Electron을 사용하여 브라우저를 최대한 제어하여 테스트를 시작합니다.

### Istanbul

[Istanbul, a JavaScript test coverage tool.](https://istanbul.js.org/?source=post_page-----264e19514d0a----------------------)

**Istanbul** 은 너에게 유닛 테스트가 너의 코드를 커버하는지에 대한 수치를 말해줍니다. 이것은 구문, 라인, 함수, 브랜치에 퍼센테이지로 적용이 되며 그래서 커버할게 무엇이 남았는지를 이해할 수 있습니다.

### Karma

[Karma — Spectacular Test Runner for Javascript](https://karma-runner.github.io/2.0/index.html?source=post_page-----264e19514d0a----------------------)

**Karma** 는 페이지의 환경에서 테스트를 실행하기 위해 특수 웹 페이지가있는 테스트 서버를 호스팅합니다. 이 페이지는 많은 브라우저와 jsdom을 포함한 브라우저와 유사한 환경에서 실행될 수 있습니다.

### Chai

[Chai](https://github.com/chaijs/chai?source=post_page-----264e19514d0a----------------------)

**Chai** 는 가장 유명한 assertion 라이브러리 입니다. 많은 플러그인과 확장 기능이 있습니다.

### Unexpected

[Unexpected](https://github.com/unexpectedjs/unexpected?source=post_page-----264e19514d0a----------------------)

**Unexpected** 는 Chai와 약간 다른 문법을지닌 assertion 라이브러리 입니다. 또한 확장가능 하므로 [unexpected-react] (https://github.com/bruderstein/unexpected-react)와 같은 라이브러리를 사용하여 어설 션을 더욱 발전시킬 수 있습니다.

### Sinon.JS

[Standalone test spies, stubs and mocks for JavaScript. Works with any unit testing framework.](http://sinonjs.org/?source=post_page-----264e19514d0a----------------------)

**Sinon** 는 매우 강력한 어떤 모든 테스팅 프레임워크에서 작동하는 자바스크립트를 위한 독립형 테스트 spies, stubs 그리고 mocks 을 제공합니다.

### testdouble.js

[A minimal test double library for TDD with JavaScript](https://github.com/testdouble/testdouble.js?source=post_page-----264e19514d0a----------------------)

**testdouble**는 Sinon이하는 일을하는 덜 인기있는 라이브러리입니다. 디자인, 철학 및 기능에 몇 가지 차이점이있어 많은 경우에 유용하게 사용할 수 있습니다. 

여기를 읽어 보세요. [here](https://www.sitepoint.com/javascript-testing-tool-showdown-sinon-js-vs-testdouble-js/), [here](https://spin.atomicobject.com/2016/03/21/javascript-mocking-testdouble/) and [here](http://blog.testdouble.com/posts/2016-03-13-testdouble-vs-sinon.html).

### Wallaby

[Integrated Continuous Test Runner for JavaScript](https://wallabyjs.com/?source=post_page-----264e19514d0a----------------------)

**Wallaby**는 언급할 가치가 있는 또 다른 도구 입니다. 무료는 아닙니다만 많은 유저들이 사는것을 추천합니다. 이것은 IDE에서 동작하며 변경된 코드와 관련된 test를 동작시키며 코드와 함께 실시간으로 장애가 발생했는지 여부를 나타냅니다.

!(https://miro.medium.com/max/1612/1*b-jNPVyrwyAJssbHNYPwtQ.png)[https://miro.medium.com/max/1612/1*b-jNPVyrwyAJssbHNYPwtQ.png]

### Cucumber

[Cucumber](https://github.com/cucumber/cucumber-js?source=post_page-----264e19514d0a----------------------)

**Cucumber** 는 Gherkin 구문을 사용하는 승인된 파일 과 그것들과 부합하는 테스트로 나누어서 BDD 테스팅 작성을 도와줍니다.

테스트들은 우리가 집중하고있는 JS를 포함한 프레임 워크에서 지원하는 다양한 언어로 작성될 수 있습니다.

```feature
// like-article.feature
Feature: A reader can share an article to social networks
  As a reader
  I want to share articles
  So that I can notify my friends about an article I liked
Scenario: An article was opened
    Given I'm inside an article
    When I share the article
    Then the article should change to a "shared" state
```

```javascript
// like-article.steps.js
module.exports = function() {
  this.Given(/^I'm inside an article$/, function(callback) {
    // functional testing tool code
  })
  
  this.When(/^I share the article$/, function(callback) {
    // functional testing tool code
  })
    
  this.Then(/^the article should change to a "shared" state$/, function(callback) {     
    // functional testing tool code
  }) 
}
```

많은 팀이이 구문을 TDD보다 편리하게 사용할 수 있습니다.

# Choose Your Unit and Integration Tests Framework

- 간단히 말해서, 만약 그냥 시작하고 싶다거나 대형 프로젝트에 빠른 프레임워크를 찾고 있다면 **Jest** 와 함께 라면 잘못 가지 않을 것입니다.

- 만약 확장가능하고 매우 유연한 설정을 원한다면, go with **Mocha**.

- 간단함을 원한다면 go with **Ava**.

- 진정한 low-level을 원한다면, go with **tape**.

### Jest

[Painless JavaScript Testing](https://facebook.github.io/jest/?source=post_page-----264e19514d0a----------------------)

**Jest** 는 페이스북에서 만들고 유지하고있는 테스팅 프레임워크 입니다. 급격한 인기로 2017년에 가장 유명한 라이브러리가 되었습니다.

후에 이야기할 **Jasmin**을 기반으로 만들어 졌습니다. 후에 페이스북은 대부분의 기능을 대체했으며 그 위에 많은 특징들을 추가했습니다.

- **Performance** - 가장 먼저 Jest는 영리한 병렬 테스트 메커니즘을 구현하여 테스트 파일이 많은 대규모 프로젝트의 경우 더 빠른 것으로 간주됩니다.
- **UI** - 깔끔하고 편리합니다.
- **Ready-To-Go** - [Sinon](https://sinonjs.org/)과 같은 라이브러리에 해당하는 assertion, spies, 그리고 mock 들이 탑재 되어 있습니다. 고유 한 기능이 필요한 경우에도 라이브러리를 쉽게 사용할 수 있습니다.
- **Globals** - Jasmine 과 같이 기본적으로 메서드와 객체가 글로벌하게 생성이 됩니다. 그래서 별도의 요구가 필요하지 않습니다. 테스트의 유연성과 제어력이 떨어지기 때문에 이는 잘못된 것으로 간주 될 수 있습니다. 하지만 대부분 케이스에서 이것은 삶을 평온하게 만듭니다.

```javascript
// "describe" is in the global scope already
// so no these require lines are **not required**:
// import { describe } from 'jest'
// import { describe } from 'jasmine'

describe('calculator', function() {
  ...
})
```

- **Snapshot testing** - jest-snapshot은 페이스북에 의해 개발되어지고 유지되어져 왔습니다. 도구의 프레임 워크 통합의 일부로 또는 올바른 플러그인을 사용하여 거의 모든 다른 프레임 워크에서 사용할 수 있습니다.
- **Improved modules mocking** - Jest는 테스트 속도를 향상시키기 위해 무거운 모듈을 mock하는 쉬운 방법을 제공합니다. 예를 들어, 네트워크 요청을하지 않고 promise를 resolve하기 위해 서비스를 mocked 할 수 있습니다.
- **Code coverage** - Istanbul 기반의 매우 강력하고 빠른 코드 커버리지를 포함하고 있습니다.
- **Reliability** - 젋은 라이브러리 이지만 2017년, 2018년을 통해서 Jest는 안정화 되어있고 신뢰를 받고있다. 현재는 메이저 IDE와 툴들에서 지원을 하고 있습니다.
- **Development** - jest는 오직 파일 업데이트로 test들을 watch모드로 매우 빠르게 동작합니다.

### jasmine

[jasmine](https://github.com/jasmine/jasmine?source=post_page-----264e19514d0a----------------------)

**Jasmine**은 Jest의 기반이 되는 테스팅 프레임워크 입니다. 왜 Jest보다 Jasmine을 선호 할까요? 그것은 더 오래 되었고 더 많은 기사와 툴, 그리고 수년에 걸친 커뮤니티에서 생성된 수 많은 질문과 답이 있기 때문입니다.

또한 Angular는 아직도 Jest보다 이것을 사용하는것을 추천합니다. 비록 Jest는 Angular 테스트를 실행하는 데 완벽하게 적합하지만 많은 사람들이 jasmine을 사용합니다.


-   **Ready-To-Go** - 테스트를 시작하는 데 필요한 모든 것이 포함되어 있습니다.
-   **Globals** - 글로벌 스코프에 중요한 모든 테스트 기능이 제공됩니다.
-   **Community** -  2009 년부터 시장에 출시되었으며 이를 바탕으로 한 수많은 기사, 제안 및 도구를 수집했습니다.
-   **Angular** - 모든 버전에 대해 Angular가 널리 지원되며  and [official Angular documentation](https://angular.io/guide/testing)에서 권장합니다.

### mocha

[mocha](https://github.com/mochajs/mocha?source=post_page-----264e19514d0a----------------------)

**Mocha** 는 Jasmine과 달리 많이 사용하는 라이브러리 입니다. 제 3의 assertion, mocking, spying tools과 함께 사용되어 집니다. (대게 Sinone 과 Chai)

Mocha는 셋업이 어렵고 더 많은 라이브러리로 나눠져 있지만 더 유연하고 확장이 가능합니다.

예를 들면 만약 특별한 assertion logic을 원한다면 Chai를 fork 해서 원하는 자신만의 Chai assertion 라이브러리로 대체할 수 있습니다. 이것 또한 Jasmine에서 할 수 있지만 Mocha가 이런 변경은 좀 더 명확하고 명백합니다.

-   **Community** - 고유 한 시나리오를 테스트하기위한 많은 플러그인과 확장 기능이 있습니다.
-   **Extensibility** - 플러그인, 확장 및 라이브러리가 그 위에서 만 실행되도록 설계된 지점까지 매우 확장 가능합니다.
-   **Globals** - 기본적으로 테스트 구조 전역을 작성하지만 분명히 Jasmine과 같은 assertions, spies and mocks는 아닙니다. 

### AVA

[AVA](https://github.com/avajs/ava?source=post_page-----264e19514d0a----------------------)

**Ava**는 테스트를 병렬로 실행하는 최소한의 테스트 라이브러리입니다.

- **Ready-To-Go** - 테스트를 시작하는 데 필요한 모든 것이 포함되어 있습니다 (쉽게 추가 할 수있는 스파이 및 더빙 외에). 테스트 구조 및 어설 션에 다음 구문을 사용하고 Node.js에서 실행됩니다.

```javascript
import test from 'ava'

test('arrays are equal', t => {
  t.deepEqual([1, 2], [1, 2])
})
```

- **Globals** - 위에서 본 것처럼 테스트 전역을 만들지 않으므로 테스트를 더 많이 제어 할 수 있습니다.
- **Simplicity** - 많은 고급 기능을 지원하면서 복잡한 API가없는 간단한 구조 및 어설 션.
- **Development** - Ava는 업데이트 된 파일 만 업데이트하므로 테스트는 watch 모드에서 빠르게 실행됩니다.
- **Speed** - 별도의 Node.js 프로세스로 테스트를 병렬로 실행합니다.
- **Snapshot testing** [프레임 워크의 일부로 지원됩니다](https://github.com/avajs/ava#snapshot-testing).

### tape

[tap-producing test harness for node and browsers](https://github.com/substack/tape?source=post_page-----264e19514d0a----------------------)

**Tape**가 가장 간단합니다. 매우 짧고 "포인트까지" API를 사용하여 노드로 실행하는 JS 파일 일뿐입니다.


- **Simplicity** - Ava보다 훨씬 더 복잡한 API가 없는 최소 구조 및 assertions .
- **Globals** - 테스트 전역을 만들지 않으므로 테스트를보다 강력하게 제어 할 수 있습니다.
- **No Shared State**  between tests - Tape는 “각각” 과 같은 기능을 사용하여 테스트 모듈성을 보장하고 테스트주기를 최대로 사용자가 제어 할 수 없도록합니다.
- **No CLI**  is needed - Tape는 JS가 실행할 수있는 곳이면 어디든 실행됩니다.

# Functional Testing Tools

우선, 위에서 언급했듯이 [여기](https://www.keycdn.com/blog/browser-compatibility-testing-tools/) 및 [여기](https://www.guru99.com/top-10-cross-browser-testing-tools.html) 테스트가 실행되는 컴퓨터를 호스팅하고 다른 장치 및 브라우저에서 이러한 테스트를 실행하는 데 도움이되는 서비스 공급자에 대한 훌륭한 기사를 찾을 수 있습니다.

기능 테스트를 위한 도구는 구현, 철학 및 API에서 서로 매우 다르므로 다양한 솔루션을 이해하고 제품에서 테스트하는 데 시간을 투자하는 것이 좋습니다.

* 간단히 말해서, 간단한 설정의 크로스 브라우저 올인원 도구를 사용하여 "시작하기"를 원한다면  [**TestCafe**](https://devexpress.github.io/testcafe/).

* 편리한 UI, 명확한 문서화, 멋진 도구 및 전체적으로 재미있는 올인원 도구 기능 테스트 경험을 원한다면  [**Cypress.io**](https://www.cypress.io/).

* 오래되고 입증 된 도구를 선호하는 경우 다음과 같이 "시작"할 수 있습니다.  [**Nightwatch.js**](http://nightwatchjs.org/).

* 커뮤니티 지원과 유연성을 극대화하여 오래되고 더 입증 된 도구를 선호하는 경우, [**WebdriverIO**](https://webdriver.io/)  을 사용하십시요.

* 가장 안정적이고 Angular 친화적 인 솔루션을 원한다면 다음을 사용하십시요.  [**Protractor**](https://github.com/angular/protractor).

### selenium

[A browser automation framework and ecosystem.](https://github.com/SeleniumHQ/selenium?source=post_page-----264e19514d0a----------------------)

**Selenium**과 그것에 의존하는 도구는 수년간 기능 테스트 시장을 지배했습니다. 테스트 용으로 특별히 작성되지 않았으며 추가 기능 및 브라우저 확장 프로그램을 사용하여 브라우저를 제어하는 ​​드라이버를 노출시켜 다양한 목적으로 브라우저를 제어 할 수 있습니다.

```
Node.js <=> WebDriver <=> FF/Chrome/IE/Safari drivers <=> browser
```
Selenium WebDriver 는 다양한 방식과 다양한 언어를 이용해서 접근할 수 있습니다. 그리고 몇몇 툴은 실제 프로그래밍 없이도 다룰 수 있습니다.

WebDriver는 테스팅 프레임워크에 삽입할 수 있습니다. 그리고 테스트를 다음과 같이 작성할 수 있습니다.

```javascript
describe('login form', () => {
 
  before(() => {
    return driver.navigate().to('http://path.to.test.app/')
  })
  
  it('autocompletes the name field', () => {
    driver
      .findElement(By.css('.autocomplete'))
      .sendKeys('John')
    
    driver.wait(until.elementLocated(By.css('.suggestion')))
    
    driver.findElement(By.css('.suggestion')).click()
    
    return driver
      .findElement(By.css('.autocomplete'))
      .getAttribute('value')
      .then(inputValue => {
        expect(inputValue).to.equal('John Doe')
      })
  })
  
  after(() => {
    return driver.quit()
  })
})
```

WebDriver 자체는 충분할 수 있으며 실제로 일부 사람들은 그대로 사용하는 것이 좋습니다. 하지만 이를 포크하거나 변경하거나 줄임으로써 다양한 라이브러리를 만들어 확장 할 수 있습니다.

그러나 일부 사람들은 직접 사용하지 않는 것을 선호합니다. 셀레늄 라이브러리를 살펴 보세요.

### Protractor

[E2E test framework for Angular apps](https://github.com/angular/protractor?source=post_page-----264e19514d0a----------------------)

**Protractor**는 셀레늄을 감싸고 Angular를 위한 향상된 구문과 특수 내장 후크를 제공하는 라이브러리입니다.


- **Angular** - 다른 JS 프레임 워크에서도 성공적으로 사용할 수 있지만 특별한 후크가 있습니다. [Angular official documentation](https://angular.io/guide/testing)  에서는 이 툴을 사용하길 추천합니다.
- **Error reporting** - Good mechanism.
- **Support** - TypeScript 지원이 가능하며 라이브러리는 거대한 Angular 팀에 의해 운영되고 유지됩니다.

### WebdriverIO

[Selenium 2.0 bindings for NodeJS](http://webdriver.io/?source=post_page-----264e19514d0a----------------------)

**WebdriverIO** 에는 자체 셀레늄 WebDriver 구현이 있습니다.

- **Syntax** - 매우 쉽고 읽기 쉽습니다.
- **Flexible** - 매우 간단하며, 유연하고 확장 가능한 라이브러리 입니다.
- **Community** - 훌륭한 지원과 열정적 인 개발자 커뮤니티가 있습니다.

### Nightwatch

[Nightwatch](http://nightwatchjs.org/?source=post_page-----264e19514d0a----------------------)

**Nightwatch** 에는 자체 셀레늄 WebDriver 구현이 있습니다. 또한 자체 테스트 프레임 워크에 테스트 서버, 어설 션 및 도구를 제공합니다.

- **Framework** - 다른 프레임 워크와 함께 사용할 수도 있지만 다른 프레임 워크의 일부가 아닌 기능 테스트를 실행하려는 경우 특히 유용합니다.
- **Syntax** - 가장 쉽고 읽기 쉬운 것처럼 보입니다.
- **Support** - typescript 지원이 없으며 일반적으로이 라이브러리는 다른 라이브러리보다 약간 덜 지원되는 것 같습니다.

### Appium

[:iphone: Automation for iOS, Android, and Windows Apps.](https://github.com/appium/appium?source=post_page-----264e19514d0a----------------------)


**Apium**은 다음 도구를 사용하여 모바일 장치에서 웹 사이트를 테스트하기 위해 Selenium과 유사한 API를 제공합니다.

- **iOS 9.3+**: Apple’s  [XCUITest](https://developer.apple.com/reference/xctest)
- **Before iOS 9.3**: Apple’s  [UIAutomation](https://developer.apple.com/library/ios/documentation/DeveloperTools/Reference/UIAutomationRef/)
- **Android 4.2+**: Google’s  [UiAutomator/UiAutomator2](http://developer.android.com/tools/help/uiautomator/index.html)
- **Android 2.3+**: Google’s  [Instrumentation](http://developer.android.com/reference/android/app/Instrumentation.html). (Instrumentation support is provided by bundling a separate project,  [Selendroid](http://selendroid.io/))
- **Windows Phone**: Microsoft’s  [WinAppDriver](http://github.com/microsoft/winappdriver)

따라서 Selenium 또는 Selenium 기반 도구를 사용하는 경우 Apium을 사용하여 모바일 장치에서 테스트 할 수도 있습니다.

### TestCafe

[Automated browser testing for the modern web development stack](https://devexpress.github.io/testcafe/?source=post_page-----264e19514d0a----------------------)

TestCafe는 셀레늄 기반 도구의 훌륭한 대안입니다. 2016 년 말에 다시 작성되어 오픈 소스로 제공되었습니다.

TestCafe에는 프로그래밍이 아닌 테스트 도구를 제공하는 유료 버전도 있었습니다. 더 이상 사용되지 않으며 새로운 TestCafe Studio로 대체 될 예정입니다. 이 TestCafe Studio는 현재 무료로 제공되지만 몇 달 안에 공식적으로 출시되면 상용 제품이 될 것입니다.

TestCafe는 Selenium처럼 브라우저 자체를 제어하는 ​​대신 JavaScript 스크립트로 웹 사이트에 삽입합니다. 이를 통해 **모바일 장치를 포함한 모든 브라우저**에서 실행할 수 있으며 JavaScript 실행 루프를 완전히 제어 할 수 있습니다.


- **Fast to set up** - Npm 으로 설치하고 and 원하는 브라우저에서 첫번째 테스트를 실행할 수 있습니다.
- **Cross Browser and Devices** - 많은 브라우저와 장치를 지원하며 테스트를위한 장치와 브라우저를 제공하는 [SauceLabs](https://saucelabs.com/) 또는 [BrowserStack](https://www.browserstack.com/)과 함께 사용할 수 있습니다. 
여기에는 [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome) 및 [Headless Firefox](https://developer.mozilla.org/en-US/Firefox/Headless_mode) 에서 테스트 실행이 포함됩니다. 
- **Parallel Testing** - TestCafe는 [한 번에 여러 브라우저 인스턴스에서 테스트를 실행할 수 있습니다.](https://devexpress.github.io/testcafe/documentation/using-testcafe/common-concepts/concurrent-test-execution.html). 이 연습은 테스트 시간을 크게 단축시킬 수 있습니다.
- **Convenient Error Reporting**
- **Own Ecosystem** - [TestCafe는 자체 테스트 구조를 사용합니다](https://testcafe-discuss.devexpress.com/t/interacting-with-browser-using-testcafe-apis-but-without-testcafe-test-runner/300/6). 
UI 테스트는 일반적으로 다른 테스트와는 별도로 실행되기 때문에 매우 편리 할 수 ​​있습니다. [그러나 일부 사람들은 싫어합니다.](https://medium.com/tech-quizlet/cypress-the-future-of-end-to-end-testing-for-web-applications-8ee108c5b255).

```javascript
// test-cafe-code-example.js
import { Selector } from 'testcafe';

fixture `Getting Started`
    .page `https://devexpress.github.io/testcafe/example`

// Own testing structure
test('My first test', async t => {
    await t
        .typeText('#developer-name', 'John Smith')
        .click('#submit-button')
        .expect(Selector('#article-header').innerText)
        .eql('Thank you, John Smith!')
})
```

### Cypress

[JavaScript End to End Testing Framework](https://www.cypress.io/?source=post_page-----264e19514d0a----------------------)

Cypress는 TestCafe의 직접적인 경쟁 업체입니다. 웹 사이트에 테스트를 주입하는 비교적 동일한 작업을 수행하지만 더 현대적이고 유연하며 편리한 방식으로 테스트를 시도합니다.

[차이점]((https://medium.com/yld-engineering-blog/evaluating-cypress-and-testcafe-for-end-to-end-testing-fcd0303d2103))은 Cypress.io가 브라우저에서 자체적으로 실행되고 Cypress는 브라우저 프로세스에서 실제 테스트 코드를 실행하는 반면 TestCafe는 노드에서 실행합니다. Cypress는 브라우저에서 삽입 된 스크립트와의 직렬 통신을 통해 테스트를 제어한다는 것입니다.


- [**Parallel testing**](https://docs.cypress.io/guides/guides/parallelization.html#Parallelization-process) 는 버젼 3.10.에서 소개 되었습니다.
- **Documentation** - 깔끔합니다.
- 직렬화 없이 **Native access to all your application’s variables** (다른 한편으로 TestCafe는 객체를 JSON으로 바꾸고 텍스트로 Node.js로 보낸 다음 다시 객체로 파싱 함.)
- **Very convenient running and debugging tools** - 테스트 프로세스의 쉬운 디버깅 및 로깅.
- **No cross-browser Support** - 현재는 오직 크롬만 지원하고 있습니다. [and not headless](https://github.com/cypress-io/cypress/issues/832). Runs in Electron in headless mode. They  [are working on it as this article is being created](https://github.com/cypress-io/cypress/issues/310). (And we will update the article once they do it)
- **Some use-cases are missing**  하지만 지속적으로 개발하고 있습니다. 예를들면 [lack of HTML5 drag-n-drop](https://github.com/cypress-io/cypress/issues/857).
- **Using Mocha**  테스트 구조 제공자는 표준을 사용하고 나머지 테스트와 동일한 구조로 기능 테스트를 빌드 할 수 있습니다.

```javascript
describe('My First Cypress Test', function() {
  it("Gets, types and asserts", function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

### Puppeteer

[Headless Chrome Node API](https://github.com/GoogleChrome/puppeteer?source=post_page-----264e19514d0a----------------------)

**Puppeteer** 는 Node.js 라이브러리 입니다. 구글에서 디벨롭 하고 있고 크롬 또는 [**Headless Chrome**](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) 를 컨트롤 하기 위한 Node.js API 를 제공하고 있습니다.

헤드리스 Chrome은 --headless 플래그와 함께 Chrome v59에 발표 되었으며 일반적으로 Chrome v59 버젼 이상입니다.
Chrome은 헤드리스 모드에서 실행될 때 이를 제어하기위한 API를 노출하며, 앞에서 말했듯이 Puppeteer는 Google이 이를 제어하기 위해 제공하는 JavaScript 도구입니다.

Firefox는 2017 년 말에 헤드리스 모드를 출시했습니다.

다른 테스트 도구또한 Headless Chrome 및 Firefox를 사용할 수도 있습니다. 예를 들면 : TestCafe, Karma, Cypress.

- **Puppeteer**는 비교적 새롭지 만 주변에 도구와 래퍼를 사용하고 개발하는 큰 커뮤니티가 있습니다.
- 기본이며 최신 Chrome 엔진을 사용하므로 **매우 빠릅니다.**
- Headless Chrome (Puppeteer도 마찬가지)의 주요 단점 중 하나는 플래시와 같은 [**확장자를 지원하지 않습니다**](https://bugs.chromium.org/p/chromium/issues/detail?id=706008) 아마 플래시는 가까운 장래에는 없을 것입니다.


### PhantomJS

[PhantomJS](http://phantomjs.org/?source=post_page-----264e19514d0a----------------------)

Phantom은 크롬 엔진을 구현하여 제어 가능한 Chrome과 같은 헤드리스 브라우저를 만듭니다. Google이 'Puppeteer'를 발표 이전 까지 헤드리스 모드로 실행하는 것이 훌륭한 도구였습니다.

주요 관리자 인 Vitaliy Slobodin은 더 이상 작동하지 않으며 개발이 중단되고 저장소가 보관되었습니다.

### Nightmare

[A high-level browser automation library](https://github.com/segmentio/nightmare?source=post_page-----264e19514d0a----------------------)

**Nightmare**는 매우 간단한 테스트 구문을 제공하는 Functional Testing 라이브러리입니다.
Chromium을 사용하여 브라우저의 동작을 제어하는 ​​Electron을 사용합니다.

최근에 유지되지 않는 것 같습니다. 아마도 “Puppeteer”가 소개 되었기 때문에 동일한 기능을 즉시 사용할 수 있습니다.

### CodeceptJS

[Modern Era Acceptance Testing Framework for NodeJS](https://github.com/codeception/codeceptjs/?source=post_page-----264e19514d0a----------------------)

위에서 논의한 CucumberJS와 마찬가지로 Codecept는 다른 라이브러리 API에 대한 또 다른 추상화를 제공하여 테스트와의 상호 작용이 사용자 행동에 중점을 둔 약간 다른 철학을 사용하도록 합니다.

그 모습은 다음과 같습니다.

```javascript
// codecept-example.js
Scenario('login with generated password', async (I) => {
  I.fillField('email', 'miles@davis.com');
  I.click('Generate Password');
  const password = await I.grabTextFrom('#password');
  I.click('Login');
  I.fillField('email', 'miles@davis.com');
  I.fillField('password', password);
  I.click('Log in!');
  I.see('Hello, Miles');
});
```

이 코드를 사용하여 실행할 수있는 라이브러리 목록은 다음과 같습니다. 모두 위에서 논의했습니다.

[WebDriverIO](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/WebDriverIO.md), [Protractor](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/Protractor.md), [Nightmare](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/Nightmare.md), [Appium](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/Appium.md), [Puppeteer](https://github.com/Codeception/CodeceptJS/blob/master/docs/helpers/Puppeteer.md).

이 구문이 귀하의 요구에 더 적합하다고 생각되면, 한 번 써보세요.

# Visual Regression Testing

시각적 회귀 테스트 도구는 대략 다음과 같이 구성됩니다.

- CI 용 CLI를 포함하여 브라우저를 자동화하거나 위에서 설명한 기능 테스트 도구의 일부로 실행하기위한 기술 및 통합
- 스마트 스크린 샷을 이미지 및 DOM 스냅 샷으로 작성
- 때로는 고급 AI를 사용하여 차이를 발견하기 위한 이미지 및 DOM 비교 기술.
- 인간이 사용자와 관련된 내용 만 표시하도록 비교 메커니즘을 승인, 거부 및 개선 할 수있는 UI

시장에는 이러한 유형의 도구가 많이 있지만이 분야는 여전히 먼 길을 가고 있다고 생각합니다.

또한 시각적 회귀 테스트 범주의 유료 도구가 무료 도구보다 훨씬 우수하다는 것을 알았습니다.

### Applitools

[Applitools Eyes](https://applitools.com/?source=post_page-----264e19514d0a----------------------)


- **설정이 쉽습니다.**
- AI를 사용하여 비교기술 그리고 차이점에 관하여 사람이 인지할 수 있는 기술 그리고 오 탐지의 차이점과 부정에 대해 매우 강력하게 만듭니다.
- 위에서 설명한 여러 도구와 편리하게 통합 할 수 있습니다.
- 신생 기업 및 비영리 단체의 특별 가격을 포함하여 무료 및 유료 유연한 요금제를 제공합니다.

### Percy

[Continuous visual integration for web apps.](https://github.com/percy?source=post_page-----264e19514d0a----------------------)

- **설정이 쉽습니다.**
- 스마트 **비교 기술**을 사용합니다.
- 차이점에 관하여 사람이 편리하게 인지 할 수 있습니다.
- 위에서 설명한 **여러 도구와 편리하게 통합** 할 수 있습니다.
- 훌륭한 도구와 잘 **통합**되어 있습니다.
- 무료 및 유료 탄력 요금제가 있습니다.

### Happo

[Happo.io — Cross-browser screenshot testing](https://happo.io/?source=post_page-----264e19514d0a----------------------)

Happo는 유료 시각 회귀 테스트 도구입니다. 변경 전후에 UI 구성 요소의 시각적 모양을 비교하기 위해 CI에 연결됩니다.
응용 프로그램의 일관된 크로스 브라우저 및 반응 형 스타일을 보장하기 위해 다른 브라우저와 다른 화면 크기에서 스크린 샷을 찍을 수 있습니다.

오픈 소스 프로젝트에 대한 무료 요금제로 지불했습니다.

### LooksSame

[gemini-testing/looks-same](https://github.com/gemini-testing/looks-same?source=post_page-----264e19514d0a----------------------)

Yandex는 현재 사용이 중단 된 Gemini와 함께이 라이브러리를 만들었으며 사용하기 쉬운 시각적 회귀 테스트 도구였습니다.

Yandex는 이제 WebdriverIO v4 및 Mocha.js를 사용하여 테스트를 실행하고 시각적 조정을 위해 LooksSame을 사용하는 
[**hermione**](https://github.com/gemini-testing/hermione)로 마이그레이션 했습니다. 위에서 언급 한 유료 도구보다 더 단순하고 제한적이지만 간단한 웹 사이트의 경우 충분할 수 있습니다.

LooksSame은 원하는 방식으로 스크린 샷을 생성하는 한 자체적으로 사용할 수도 있습니다.

### BackstopJS

[BackstopJS](https://github.com/garris/BackstopJS?source=post_page-----264e19514d0a----------------------)

Puppeteer 및 CI를 지원하는 Chrome Headless에서 실행되는 오픈 소스 시각적 회귀 유틸리티입니다.


### AyeSpy

[AyeSpy-A visual regression testing tool](https://github.com/newsuk/AyeSpy?source=post_page-----264e19514d0a----------------------)

[News UK](https://www.news.co.uk/)의 [Times Tooling](https://github.com/newsuk) 팀에서 내놓은 오픈소스 유틸리티 입니다.

visual regression 테스트를 Chrome/Firefox에서 생성하기 위해 selenum docker를 사용합니다.

### reg-suit

[Visual Regression Testing tool.](https://github.com/reg-viz/reg-suit?source=post_page-----264e19514d0a----------------------)

**이미지를 비교**하고 보고서를 생성하여 **클라우드에 저장**하는 오픈 소스 라이브러리입니다. 
**기존 functional test에 시각적 회귀 테스트를 추가**하려는 경우 매우 편리합니다. 
기존 테스트 흐름에 스크린 샷을 찍는 단계를 추가하고 이를 사용하여 이러한 스크린 샷을 비교하십시오.

### Differencify

[Differencify is a library for visual regression testing](https://github.com/NimaSoroush/differencify?source=post_page-----264e19514d0a----------------------)

Jest 스냅 샷과 잘 통합 된 Puppeteer 테스트 도구를 사용하는 또 다른 오픈 소스 Chrome Headless 입니다.
도커에서 실행할 수 있으며 편리한 보고서를 생성합니다.

## No Coding Functional Testing Tools

### testim

[Testim.io | Agile, Self-Healing, Autonomous Testing Solution](https://www.testim.io/?source=post_page-----264e19514d0a----------------------)

별도의 창에서 응용 프로그램을 열고 **브라우저 확장**을 사용하여 응용 프로그램과의 수동 상호 작용을 테스트 시나리오로 기록합니다.
**machine learning**을 사용하여 테스트 시나리오를 기록하고 검증 할 수 있습니다. 
크로스 브라우저이며 많은 CI 및 협업 도구와 잘 통합되어 있습니다.

무료 및 유료 탄력 요금제가 있습니다.

### Screener

[Automated Visual Testing](https://screener.io/?source=post_page-----264e19514d0a----------------------)

**크롬 확장 프로그램**을 사용하여 테스트를 기록하고 심층적 인 시각적 회귀 보고 기능을 제공합니다. 
**스토리 북과 다른 CI 도구 및 BrowserStack 및 Sauce Labs**와 같은 멋진 통합 기능이 있습니다.

무료가 아닙니다.