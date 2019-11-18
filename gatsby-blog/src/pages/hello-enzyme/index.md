---
title: Hello Enzyme (작성중..)
date: '2019-11-18T10:00:03.284Z'
---

이 글은 아래 링크에 있는 글을 의역 했습니다.
[참조](https://airbnb.io/enzyme/)

엔자임은 리엑트를 위한 Javascript Testing 유틸리티 입니다. 리엑트 컴포넌트들의 결과물을 테스트 하기 용이합니다. 또한 출력에 따라 런타임을 조작, 탐색 및 런타임 시뮬레이션 할 수 있습니다.

엔자임의 API는 DOM 조작 및 순회를 위해 jQuery의 API를 흉내 냄으로써 직관적이고 유연합니다.

> assert라는 단어를 영한 사전에서 찾아 보면 "단언하다, 확실히 하다"라는 뜻을 가지고 있는데 코드가 정확하게 동작할 수 있는 상황이라는 것을 확인한다. 

## Upgrading from Enzyme 2.x or React < 16

엔자임이 React 16과 호환이 되는지 체크해보겠습니까? 현재 Enzyme 2.x 버젼때를 사용하고 계신가요? 훌륭합니다!
[마이크레이션 가이드](https://airbnb.io/enzyme/docs/guides/migration-from-2-to-3.html) 에서 React 16이 지원되는 Enzyme v3으로 마이그레이션 하는 법을 도와줄 것입니다.

### intallation

enzyme 을 시작하기 위해서 npm을 통해 간단하게 설치 할 수 있습니다. react 버젼에 따른 Adapter와 함께 enzyme을 설치 할 수 있습니다. 만약 enzyme과 React16을 사용한다면 다음과 같이 설치 할 수 있습니다.

```bash
npm i --save-dev enzyme enzyme-adapter-react-16
```

각 adapter는 추가적으로 사용자가 설치해야 할 peer dependencies를 가지고 있을 수 있습니다. 예를 들면 `enzyme-adapter-react-16` 은  peer dependencies 으로 `react` 와 `react-dom`을 필요로 합니다.

현재 Enzyme에는 React 16.x, React 15.x, React 0.14.x 및 React 0.13.x와 호환되는 어댑터가 있습니다.


다음 어댑터는 공식적으로 효소에 의해 제공되며 다음과 같은 React와 호환됩니다.

| Enzyme Adapter Package | React semver compatibility |
| --- | --- |
| `enzyme-adapter-react-16` | `^16.4.0-0` |
| `enzyme-adapter-react-16.3` | `~16.3.0-0` |
| `enzyme-adapter-react-16.2` | `~16.2` |
| `enzyme-adapter-react-16.1` | `~16.0.0-0 or ~16.1` |
| `enzyme-adapter-react-15` | `^15.5.0` |
| `enzyme-adapter-react-15.4` | `15.0.0-0 - 15.4.x` |
| `enzyme-adapter-react-14` | `^0.14.0` |
| `enzyme-adapter-react-13` | `^0.13.0` |

마지막으로, 원하는 adapter를 사용하기 위해서 enzyme을 설정해주어야 합니다. 이 작업을 위해서 top level의 `configure(...)`API를 사용해야 합니다.

```javascript
// setup file

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
```

```javascript
// test file
import { shallow, mount, render } from 'enzyme';

const wrapper = shallow(<Foo />);
```

## Running Enzyme Tests

Enzyme은 사용하는 테스트 러너 또는 어설 션 라이브러리와 관련하여 만들어 놓은 것을 써야 합니다. 모든 주요 테스트 러너 및 어설 션 라이브러리와 호환되어야합니다.
enzyme 대한 문서와 예제는 mocha와 chai를 사용하지만 선택한 프레임 워크에 맞는 것을 사용할 수 있습니다.

React 구성 요소를 테스트하기 위해 사용자 지정 어설 ​​션 및 편의 기능과 함께 enzyme를 사용하려면 다음을 사용하는 것이 좋습니다.


- [`chai-enzyme`](https://github.com/producthunt/chai-enzyme)  with Mocha/Chai.
- [`jasmine-enzyme`](https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jasmine-enzyme)  with Jasmine.
- [`jest-enzyme`](https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jest-enzyme)  with Jest.
- [`should-enzyme`](https://github.com/rkotze/should-enzyme)  for should.js.
- [`expect-enzyme`](https://github.com/PsychoLlama/expect-enzyme)  for expect.


## Basic Usage

### [Shallow Rendering](https://airbnb.io/enzyme/docs/api/shallow.html)

```javascript
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon'; // 자바스크립트를 위한 독립형 테스트 spies, stubs 그리고 mocks 을 제공

import MyComponent from './MyComponent';
import Foo from './Foo';

describe('<MyComponent />', () => {
  it('renders three <Foo /> components', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find(Foo)).to.have.lengthOf(3);
  });

  it('renders an `.icon-star`', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find('.icon-star')).to.have.lengthOf(1);
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <MyComponent>
        <div className="unique" />
      </MyComponent>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});
```

### [Full DOM Rendering](https://airbnb.io/enzyme/docs/api/mount.html)

```javascript
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Foo from './Foo';

describe('<Foo />', () => {
  it('allows us to set props', () => {
    const wrapper = mount(<Foo bar="baz" />);
    expect(wrapper.props().bar).to.equal('baz');
    wrapper.setProps({ bar: 'foo' });
    expect(wrapper.props().bar).to.equal('foo');
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = mount((
      <Foo onButtonClick={onButtonClick} />
    ));
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });

  it('calls componentDidMount', () => {
    sinon.spy(Foo.prototype, 'componentDidMount');
    const wrapper = mount(<Foo />);
    expect(Foo.prototype.componentDidMount).to.have.property('callCount', 1);
    Foo.prototype.componentDidMount.restore();
  });
});

```

### [Static Rendered Markup](https://airbnb.io/enzyme/docs/api/render.html)

```javascript
import React from 'react';
import { expect } from 'chai';
import { render } from 'enzyme';

import Foo from './Foo';

describe('<Foo />', () => {
  it('renders three `.foo-bar`s', () => {
    const wrapper = render(<Foo />);
    expect(wrapper.find('.foo-bar')).to.have.lengthOf(3);
  });

  it('renders the title', () => {
    const wrapper = render(<Foo title="unique" />);
    expect(wrapper.text()).to.contain('unique');
  });
});

```

## Using enzyme with Jest

### Configure with Jest

Jest와 함께 Enzyme 설정과 adapter을 위해 설정 파일을 동작하기 위해선 설정 파일([해당 구성 파일의 가능한 위치는 Jest의 설명서를 확인하십시오.](https://jestjs.io/docs/en/configuration) 안에 `setupFileAfterEnv`을 문자열 그대로의 <rootDir>와 셋업 파일의 경로를 셋팅해줘야 합니다.

```javascript
{
  "jest": {
    "setupFilesAfterEnv": ["<rootDir>src/setupTests.js"]
  }
}
```

### Jest version 15 and up

Jest 버젼 15 부터는 Jest가 더이상 기본적으로 mocks modules(Automocking-test에서 import 하는 모든 모듈을 자동적으로 mocked 시켜라)을 하지 않습니다. 이 때문에 Jest에 enzyme을 사용하기 위한 특별한 설정을 추가 하지 않아도 되비다.

Jest 문서에서 권장하는대로 Jest 및 해당 Babel 통합을 설치하세요. 그리고 enzyme을 설치하고 그 다음 테스트 파일 맨 위에 React와 enzyme 함수들 모듈들이 필요합니다.

```javascript
import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Foo from '../Foo';
```

Jest 스냅 샷 테스트에만 사용하려는 경우가 아니면 Jest 자체 렌더러를 포함 할 필요가 없습니다.

### Example Project for Jest version 15+


[Example test for Jest 15+](https://github.com/vjwilson/enzyme-example-jest)

## API Reference


### Shallow Rendering

**shallow(node[, options]) => ShallowWrapper**

Shallow Rendering은 컴포넌트를 단위 테스트하는데 제약을 가하고 테스트들이 하위 child 컴포넌트들의 행동에 간적접적으로 영향이 가지 않도록 하는데 유용합니다.

Enzyme v3부터 얕은 API는 componentDidMount 및 componentDidUpdate와 같은 React 라이프 사이클 메소드를 호출합니다. 이에 대한 자세한 내용은 버전 3 마이그레이션 안내서를 참조하십시오.

```javascript
import { shallow } from 'enzyme';

const wrapper = shallow(<MyComponent />);
// ...
```

```javascript
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Foo from './Foo';

describe('<MyComponent />', () => {
  it('renders three <Foo /> components', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find(Foo)).to.have.lengthOf(3);
  });

  it('renders an `.icon-star`', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find('.icon-star')).to.have.lengthOf(1);
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <MyComponent>
        <div className="unique" />
      </MyComponent>
    ));
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(<Foo onButtonClick={onButtonClick} />);
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});
```

#### Returns

렌더러의 결과에서 나온 인스턴스를 감싼 객체

### Full Rendering

**mount(node[, options]) => ReactWrapper**

Full DOM rendering은 DOM API와 상호 작용할 수 있는 components가 있거나 higher order components로 래핑 된 components를 테스트 해야하는 사용 사례에 이상적입니다.

Full DOM rendering을 위해서는 전체 범위에서 전체 DOM API를 사용할 수 있어야합니다. 이는 최소한 브라우저 환경과 유사한 환경에서 실행되어야 함을 의미합니다. 브라우저 내에서 테스트를 실행하지 않으려면 mount를 사용하는 데 권장되는 방법은 jsdom이라는 라이브러리에 의존하는 것입니다. 이 라이브러리는 본질적으로 JS에서 완전히 구현 된 헤드리스 브라우저입니다.

참고 : 얕은 렌더링 또는 정적 렌더링과 달리 전체 렌더링은 실제로 구성 요소를 DOM에 마운트하므로 테스트가 모두 동일한 DOM을 사용하는 경우 서로 영향을 줄 수 있습니다. 테스트를 작성하는 동안이를 명심하고 필요한 경우 .unmount () 또는 정리와 유사한 것을 사용하십시오.

```javascript
import { mount } from 'enzyme';

const wrapper = mount(<MyComponent />);
// ...
```

```javascript
import { mount } from 'enzyme';
import sinon from 'sinon';
import Foo from './Foo';

describe('<Foo />', () => {
  it('calls componentDidMount', () => {
    sinon.spy(Foo.prototype, 'componentDidMount');
    const wrapper = mount(<Foo />);
    expect(Foo.prototype.componentDidMount).to.have.property('callCount', 1);
  });

  it('allows us to set props', () => {
    const wrapper = mount(<Foo bar="baz" />);
    expect(wrapper.props().bar).to.equal('baz');
    wrapper.setProps({ bar: 'foo' });
    expect(wrapper.props().bar).to.equal('foo');
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = mount((
      <Foo onButtonClick={onButtonClick} />
    ));
    wrapper.find('button').simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
  });
});
```

#### Returns

렌더러의 결과에서 나온 인스턴스를 감싼 객체

### Static Rendering

`render` function 은 렌더링 기능을 사용하여 React 트리에서 HTML을 생성하고 결과 HTML 구조를 분석하십시오.

`render`는 enzyme의 다른 렌더러인 `mount` 및 `shallow`서 매우 유사한 래퍼를 반환합니다. 그러나 render는 third party HTML 파싱 및 순회 라이브러리 Cheerio를 사용합니다. Cheerio는 HTML 구문 분석 및 순회를 매우 잘 처리하며 이 기능을 복제하는 것은 장애가 될 것이라고 믿습니다.

이 문서의 목적 상 Cheerio의 생성자(constructor)를 CheerioWrapper 라고합니다. 즉, ReactWrapper 및 ShallowWrapper 생성자와 유사합니다. CheerioWrapper 인스턴스에서 사용 가능한 메소드에 대해서는 [Cheerio API](https://github.com/cheeriojs/cheerio#api) 문서를 참조 할 수 있습니다.

```javascript
import { render } from 'enzyme';

const wrapper = render(<MyComponent />);
// ...
```

```javascript
import React from 'react';
import { render } from 'enzyme';
import PropTypes from 'prop-types';

describe('<Foo />', () => {
  it('renders three `.foo-bar`s', () => {
    const wrapper = render(<Foo />);
    expect(wrapper.find('.foo-bar')).to.have.lengthOf(3);
  });

  it('rendered the title', () => {
    const wrapper = render(<Foo title="unique" />);
    expect(wrapper.text()).to.contain('unique');
  });

  it('renders a div', () => {
    const wrapper = render(<div className="myClass" />);
    expect(wrapper.html()).to.contain('div');
  });

  it('can pass in context', () => {
    function SimpleComponent(props, context) {
      const { name } = context;
      return <div>{name}</div>;
    }
    SimpleComponent.contextTypes = {
      name: PropTypes.string,
    };

    const context = { name: 'foo' };
    const wrapper = render(<SimpleComponent />, { context });
    expect(wrapper.text()).to.equal('foo');
  });
});
```