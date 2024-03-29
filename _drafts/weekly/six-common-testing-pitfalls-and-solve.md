# 프런트엔드 테스트 함정! 6가지 일반적인 테스트 함정 및 해결 방법

> 원문 : [https://www.smashingmagazine.com/2021/07/frontend-testing-pitfalls/](https://www.smashingmagazine.com/2021/07/frontend-testing-pitfalls/)

> 빠른 요약: 프런트엔드 테스트를 작성하다 보면 많은 함정에 빠지게 된다. 요약하면, 유지관리가 힘들어지고 실행 시간이 느려지며 최악의 경우 신뢰할 수 없는 테스트가 발생할 수 있다. 하지만 이 글에서는 경험상 개발자들이 저지르는 흔한 실수들과 어떻게 피할 수 있는지를 이야기하겠다. 더 이상 테스트는 고통스러운 게 아니다.

필자가 어렸을 때 좋아했던 영화를 다시 보고 있는데 특히 한 구절이 눈에 띄었다. 그 구절은 1983년 [스타워즈 에피소드 6: 제다이의 귀환](https://en.wikipedia.org/wiki/Return_of_the_Jedi) 영화의 한 장면이다. 이 대사는 Endor 전투에서 언급되며, 이 전투에서 Alliance는 데스 스타를 파괴하기 위해 집중적으로 병력을 동원한다. 그곳에서 Mon Calamari 반군 지도자인 Ackbar 제독은 기억에 남는 대사를 말한다.

![“It’s a trap!” — Admiral Akbar (Image credit: Ramona Schwering)](https://res.cloudinary.com/indysigner/image/fetch/f_auto,q_80/w_2000/https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/b391a3c0-decf-4df6-9c27-081ea0c12807/1-frontend-testing-pitfalls.png)

"함정이야!" 이 대사는 예상치 못한 매복, 임박한 위험을 경고한다. 하지만 이것이 테스트와 무슨 관련이 있을까? 이것은 코드 베이스에서 테스트를 다룰 때 적절한 비유가 된다. 이러한 함정들은 코드 베이스 작업을 할 때 예상하지 못한 매복을 당한 것처럼 느끼게 한다.

이 기사에서 필자는 경험했던 함정들을 말할 것이다. 그중 일부는 필자 잘못이 있었다. 이 글에서 동일한 환경과 상황이 같을 수는 없다. 필자는 단위 테스트를 위한 Jest 프레임워크를 사용하고 End-to-End테스트를 위한 Cypress 프레임워크를 사용으로 일상 업무에 많은 영향을 받았다. 필자는 필자의 분석이 최대한 추상적으로 유지될 수 있도록 할 것이다. 그래야 당신이 다른 프레임워크를 사용하는 사용자들에게 조언을 할 수 있을 것이다. 만약 가능하지 않다고 생각되는 부분이 있다면 아래 댓글에서 이야기 나눠보자. 일부 예제는 단위, 통합 또는 End-to-End테스트 등 모든 테스트 유형에 적용될 수 있을 것이다.
## 프런트엔드 테스트 함정

어떠한 종류의 테스트든 많은 이점을 가지고 있다. 프런트엔드 테스트는 웹 애플리케이션의 UI를 테스트하기 위한 일련의 작업이다. UI를 다양한 환경에 처한 상황에 대한 기능을 테스트한다. 테스트 유형에 따라 다양한 방법과 수준에서 기능 테스트를 할 수 있다.

* **단위 테스트**는 애플리케이션에 작은 단위를 확인한다. 이 유닛들은 클래스, 인터페이스 또는 메서드일 수 있다. 단위 테스트에서는 사전에 정의된 입력을 사용하여 기대 출력을 제공하는지를 확인한다. 따라서 테스트 단위는 개별적으로 격리하여 시행한다.
* **통합 테스트**는 넓은 범위를 가진다. 각 테스트의 상호작용을 확인하면서 코드 단위의 테스트를 진행한다.
* **End-to-End테스트**는 실제 유저가 사용하는 것처럼 테스트를 진행한다. 따라서 이론적으로 품질 보증 면에서 보면 [시스템 테스트](https://en.wikipedia.org/wiki/System_testing)와 유사하다.

이 모든 작업을 함께 수행하면 애플리케이션을 배포할 때 큰 자신감을 가질 수 있다. 그중 프런트엔드 테스트를 통해 원하는 대로 사용자가 UI와 상호작용을 하는지 확인할 수 있다. 또 다른 관점에서 이런 테스트 실행을 통해 많은 리소스와 에너지를 소모하는 수동 테스트 없이도 오류 없는 애플리케이션 출시를 보장할 수 있다.

그러나 다양한 원인을 가진 문제들이 존재하고, 그 문제들이 위 장점을 가리는 함정이 될 수 있다. 좋은 의도로 무언가를 하고 있지만 계속 고통만 준다고 생각해보면 나쁜 기술 부채로 볼 수 있을 것이다.

## 왜 테스트 함정에 신경을 써야 하는가?

필자가 프런트엔드 테스트 함정에 빠졌던 원인과 결과를 생각하면 몇 가지 문제가 떠오른다. 특히 몇 년 전에 작성한 레거시 코드에서 비롯된 세 가지 원인이 몇 번이고 되살아난다.

### 1. 테스트 속도가 느리거나 적어도 테스트 실행 속도가 느리다

로컬에서 개발할 때 개발자는 자신이 작업하는 코드를 특히 팀의 누군가가 병합해야 하는 경우 테스트를 하면서 마음이 조급해지는 경향이 있다. 긴 대기 시간은 어떤 경우에도 짜증 나게 느껴진다. 이러한 함정은 여러 가지 작은 원인(예: 적절한 대기 시간이나 테스트 범위에 크게 주의를 기울이지 않는 것)에서 발생할 수 있다.

### 2. 테스트의 유지보수가 어려워진다

이 두 번째 문제는 테스트를 포기하는데 더 중요한 원인이 된다. 예를 들어, 몇 개월 후에 다시 테스트로 돌아와서 테스트의 내용이나 의도를 전혀 이해하지 못할 수 있다. 아니면 팀원들이 당신이 작성한 오래된 테스트로 무엇을 이루고 싶었냐고 물을 수도 있다. 일반적으로 텍스트나 코드에 너무 많은 클래스나 추상화가 흩어져 있으면 개발자의 동기부여가 사라지고 명백한 혼란으로 이어질 수 있다. 이 영역의 함정은 테스트에 적합하지 않은 모범 사례를 따르면 발생할 수 있다.

### 3. 테스트가 일관된 결과값을 주지 않는다

이것을 하이젠실패(Heisenfails) 또는 하이젠테스트(Heisentests)라고 부를 수 있다. 마치 유명한 하이젠버그(Heisenbug)처럼 말이다. 하이젠버그(Heisenbug)는 눈을 돌리거나 측정하지 않거나 디버깅하지 않을 때만 발생한다. 최악의 경우는 아무 변경 없이 빌드 간에 동일한 결과를 제공하지 못하는 비결정성 테스트인 [불안정한 테스트](https://www.smashingmagazine.com/2021/04/flaky-tests-living-nightmare/) 이다. 이러한 현상은 다양한 이유로 발생할 수 있지만, 테스트 모범 사례를 무시한 채 쉽고 보기에 편리한 꼼수를 시도할 때 주로 발생한다.

하지만 너무 걱정하지 마라. 테스트를 보고 다루는 것은 재미있을 수 있다! 우리는 고통스러운 결과를 피하고자 몇 가지 사항들을 살펴보기만 하면 된다. 물론, 가장 좋은 것은 애초에 우리의 테스트 디자인에 함정이 생기는 것을 피하는 것이다. 하지만 이미 잘못되었다면, 테스트를 리팩토링하는 것이 차선책이다.

## 황금 규칙

여러분이 흥미진진하면서도 힘든 일을 하고 있다고 가정해 보자. 당신은 그 일에 완전히 집중하고 있다. 여러분의 두뇌는 프로덕션 코드로 가득 차 있으며, 테스트를 생각할 만큼의 여력이 없다. 테스트가 머릿속을 복잡하게 만드는 것은 전적으로 테스트의 목적에 반하는 것이다. 최악 경우는 부담스럽게 느껴지는 테스트로 인해 많은 팀들이 테스트를 포기하게 되는 것이다.

Yoni Goldberg는 "[JavaScript 테스트 모범 사례](https://github.com/goldbergyoni/javascript-testing-best-practices)" 가이드에서 테스트가 부담으로 느껴지지 않도록 하는 황금 규칙을 다음과 같이 설명한다. 테스트는 친절한 조력자처럼 느껴져야 하고 당신을 돕기 위한 것처럼 느껴야 하며 방해물처럼 느껴져서는 안 된다.

맞다. 이것은 테스트에서 가장 중요한 것이다. 하지만 정확히 어떻게 이걸 이룰 수 있을까? 미리 말하자면 대부분 필자의 예제가 이를 보여줄 것이다. KISS 원칙(간단하고 단순하게)이 핵심이다. **모든 테스트는 유형에 상관없이 단순하고 단순하게 설계되어야 한다.**

그렇다면 단순하고 간단한 테스트란 무엇일까? 당신의 테스트가 아주 간단한지 어떻게 알 수 있을까? 테스트를 복잡하게 만들지 않는 것이 가장 중요하다. 주요 목표는 Yoni Goldberg에 의해 완벽하게 요약된다.

> 테스트를 보고 즉시 의도를 파악해야 한다.

따라서 테스트는 깔끔하게 설계되어야 한다. 미니멀리스트가 테스트를 가장 잘 비유가 될 것이다. 테스트는 로직이 많지 않아야 하고 추상화도 거의 없어야 한다. 이는 페이지 객체 및 특정 작업을 실행하는 명령에 주의하고 작업 명령을 의미 있는 이름과 문서로 지정해야 함을 의미한다. 페이지 객체와 명령를 사용한다면 지시 명령, 함수 및 클래스 이름에 신경을 더 써야 한다. 이렇게 하면 개발자와 테스터 모두에게 시험이 즐거움으로 남을 것이다.

필자가 가장 좋아하는 테스트 원칙은 중복, DRY(반복하지 마라) 원칙이다. 만약 추상화가 테스트를 이해하는 데 방해된다면 중복 코드를 모두 피하자.

다음은 코드 예제이다.

```js
// Cypress
beforeEach(() => {
  // 이 커맨드가 실제로 처리하는 일을 언뜻 봐서는 알기 어렵다.
  cy.setInitialState()
    .then(() => {
        return cy.login();
    })
}):
```

테스트를 더 쉽게 이해하려면 명령 이름을 의미 있게 지정하는 것만으로는 충분하지 않다고 생각할 수 있다. 대신 다음과 같이 명령에 대한 설명을 문서화하는 것도 고려할 수 있다.

```js
// Cypress
/**
* Logs in silently using API
* @memberOf Cypress.Chainable#
* @name loginViaApi
* @function
*/
Cypress.Commands.add('loginViaApi', () => {
   return cy.authenticate().then((result) => {
       return cy.window().then(() => {
           cy.setCookie('bearerAuth', result);
       }).then(() => {
           cy.log('Fixtures are created.');
       });
   });
});
```

이런 문서는 **미래의 자신과 팀이 테스트를 더 잘 이해하는 데 도움이 되므로 이 경우 필수적일 것이다.** 알다시피 프로덕션 코드에 대한 일부 모범 사례는 테스트 코드에 적합하지 않다. 테스트는 단순히 프로덕션 코드가 아니며, 우리는 테스트 코드를 그렇게 취급해서는 안된다. 물론 테스트 코드는 프로덕션 코드와 동일하게 취급해야 한다. 그러나 일부 규약과 모범 사례는 맞지 않을 수 있다. 이런 경우 황금 규칙을 기억하고 개발자 경험을 우선시해야 한다.

## 테스트 설계의 함정

이 섹션의 첫 번째 몇 가지 예에서는 먼저 테스트 함정에 빠지지 않는 방법에 관해 설명하겠다. 그 후에 필자는 테스트 디자인에 관해 이야기하겠다. 만약 당신이 이미 오래 개발되었거나 오랫동안 서비스되며 유지보수하고 있는 프로젝트를 하고 있다면, 이 방법은 여전히 유용할 것이다.

### 3가지 규칙

다음 예제코드를 보자. 테스트 타이틀에 주목하자. 테스트 콘텐츠 자체는 주된 것이 아니다.

```js
// Jest
describe('deprecated.plugin', () => {
  it('should throw error',() => {
    // 실제 테스트에서 컴포넌트는 간단한 에러를 발생한다.
    const component = createComponent();

    expect(global.console.error).toBeCalled();
  });
});
```

위 테스트를 보고 첫눈에 무엇을 테스트할 것인지 알 수 있는가? 특히 테스트 결과에서 이 제목을 살펴본다고 상상해 보자. (예를 들면 지속적인 통합에서 파이프라인의 로그 항목을 확인할 수 있다) 분명 에러가 발생할 것이다. 하지만 그게 무슨 에러일까? 어떤 상황에서 에러가 나야 할까? 알다시피, 제목이 의미가 없기 때문에 이 테스트가 달성하려고 하는 의도를 **바로** 알아차리기 쉽지 않다.

우리의 황금 규칙을 기억하자. 우리는 테스트가 무엇을 의미하는지 바로 알아차릴 수 있어야 한다. 그러면 제목을 바꿔야 한다. 다행히도 이해하기 쉬운 해결책이 있다. 이 테스트의 제목은 세 가지 규칙에 따라 정할 것이다.

[Roy Osherove가 소개한](https://osherove.com/blog/2005/4/3/naming-standards-for-unit-tests.html) 이 규칙은 테스트가 무엇을 달성해야 하는지를 명확히 하는 데 도움이 될 것이다. 단위 테스트에서는 잘 알려진 방식이지만, End-to-End테스트에서도 도움이 될 것이다. 규칙에 따르면, 테스트의 제목은 다음 세 부분으로 구성되어야 한다.

1. 무엇을 테스트하고 있나?
2. 어떤 상황에서 테스트가 되고 있나?
3. 예상되는 결과가 무엇인가?

이 규칙을 따르면 어떻게 될까?

```js
// Jest
describe('deprecated.plugin', () => {
  it('Property: Should throw an error if the deprecated prop is used', () => {
      // 실제 테스트에서 컴포넌트는 간단한 에러를 발생한다.
      const component = createComponent();

      expect(global.console.error).toBeCalled();
   });
});
```

제목은 길지만, 위에서 언급했던 3가지 규칙을 발견할 수 있을 것이다.

1. 무엇을 테스트하고 있나? 이 경우 프로퍼티를 테스트한다.
2. 어떤 상황에서 테스트 되고 있나? 더 사용되지 않는 프로퍼티를 테스트하려고 한다.
3. 예상되는 결과가 무엇인가? 응용 프로그램에서 오류가 발생해야 한다.

이 규칙을 따르면 우리는 첫눈에 테스트 결과를 볼 수 있게 되며 로그를 통해 읽을 필요가 없다. 그래서, 우리는 이 경우에 황금 규칙을 따를 수 있다.

### “ARRANGE, ACT, ASSERT” VS. “GIVEN, WHEN, THEN”

다른 코드에서 다른 함정을 살펴보자. 한번 읽어보고 나서 다음 테스트를 이해할 수 있는가?

```js
// Jest
describe('Context menu', () => {
  it('should open the context menu on click', async () => {
      const contextButtonSelector = 'sw-context-button';
      const contextButton =
            wrapper.find(contextButtonSelector);
      await contextButton.trigger('click');
      const contextMenuSelector = '.sw-context-menu';
      let contextMenu = wrapper.find(contextMenuSelector);
      expect(contextMenu.isVisible()).toBe(false);
      contextMenu = wrapper.find(contextMenuSelector);
      expect(contextMenu.isVisible()).toBe(true);  
  });
});
```

그렇다면 축하한다! 당신은 정보 처리 속도가 놀라울 정도로 빠른 것이다. 그렇지 않으면 걱정하지 마라. 테스트 구조가 크게 개선될 수 있기 때문에 이는 매우 정상적이다. 예를 들어 선언하는 구문과 단언을 실행하는 구문은 구조를 신경쓰지않고 작성되었다. 어떻게 하면 이 테스트를 개선할 수 있을까?

**AAA 패턴**이 유용할 수 있다. AAA는 "arrange, act, assert"의 줄임말로, 테스트를 명확하게 구조화하기 위해 무엇을 해야 하는지를 알려준다. 테스트를 중요한 세 개의 부분으로 나눈다. 비교적 짧은 테스트에 적합하기 때문에 이 패턴은 대부분 단위 테스트에서 접하게 된다. 간단히 말해서, 다음 세 가지 부분이다.

#### Arrange

여기서 테스트가 목표로 하는 상황에 도달하도록 테스트 중인 시스템을 설정한다. 변수 설정부터 Mock과 Stub 작업까지 모든 것이 포함될 수 있다.

#### Act

이 부분에서는 테스트를 실행한다. 따라서 테스트의 결과 상태에 도달하기 위해 필요한 모든 단계를 수행한다.

#### Assert

이 부분은 비교적 설명하기 쉽다. 이 마지막 부분에서는 간단하게 단언을 실행하고 확인한다.

이것은 얇고 이해하기 쉬운 방법으로 테스트를 설계하는 또 다른 방법이다. 이 규칙을 염두에 두고 우리는 위에서 작성했던 테스트를 다음과 같이 바꿀 수 있다.

```js
// Jest
describe('Context menu', () => {
  it('should open the context menu on click', () => {
      // Arrange
      const contextButtonSelector = 'sw-context-button';
      const contextMenuSelector = '.sw-context-menu';

      // 테스트 하기 전에 상태 단언을 실행한다.
      let contextMenu = wrapper.find(contextMenuSelector);
      expect(contextMenu.isVisible()).toBe(false);

      // Act
      const contextButton =
            wrapper.find(contextButtonSelector);
      await contextButton.trigger('click');

      // Assert
      contextMenu = wrapper.find(contextMenuSelector);
      expect(contextMenu.isVisible()).toBe(true);  
  });
});
```

잠깐! 단언을 실행하기 전에 행동하는 부분은 무엇인가? 그리고 행동하는 동안 단위 테스트로써 너무 많은 문맥이 존재한다고 생각하지 않는가? 그렇다. 우리는 여기서 통합 테스트를 다루고 있다. 위 코드와 같이 DOM 테스트를 하게 된다면 전후 상태를 확인해야 한다. 따라서 AAA 패턴은 단위 테스트와 API 테스트에는 잘 어울리지만 위 상황에는 어울리지 않는다.

필자가 어떻게 할 것인지 생각하는 대신에 Claudio Lassala가 [자신의 블로그](https://lassala.net/2017/07/20/test-style-aaa-or-gwt/)의 게시물 중 하나에서 언급한 관점에서 AAA 패턴 관점에서 살펴보자.

* "나의 테스트에서 **arrange**는 나에게 무엇이 주어졌는가(**given**)를 생각한다." 이것은 테스트의 모든 전제 조건이 포함된 시나리오이다.
* "나의 테스트에서 **act**는 무슨 일이 발생했을 때(**when**)를 생각한다." 위 코드에서 보는 테스트 실행 부분이다.
* "결과를 **assert**하는 것은 만약 어떤 일이 일어난 이후에(**then**) 단언하는 결과가 기대하는 결과라고 생각한다." 여기서 우리는 테스트의 의도를 갖는 단언을 발견한다.

마지막 글머리 기호에서 굵게 표시된 키워드는 행동 주도 개발(BDD)의 다른 패턴을 암시한다. Daniel Terhorst-North와 Chris Matts가 개발한 **given-when-then**패턴이다. 게르킨어로 시험을 써봤다면 이 문제에 익숙할 것이다.

```
Feature: Context menu
  Scenario: 
    Given I have a selector for the context menu
       And I have a selector for the context button

    When the context menu can be found
       And this menu is visible
       And this context button can be found
       And is clicked
     
   Then I should be able to find the contextMenu in the DOM
      And this context menu is visible
```

그러나 블록 구조를 모든 종류의 테스트에서 사용할 수 있다. 위에서 언급한 내용을 바탕으로 예시 테스트를 다시 작성하기는 매우 쉽다.

```js
// Jest
describe('Context menu', () => {
  it('should open the context menu on click', () => {
      // Given
      const contextButtonSelector = 'sw-context-button';
      const contextMenuSelector = '.sw-context-menu';

      // When
      let contextMenu = wrapper.find(contextMenuSelector);
      expect(contextMenu.isVisible()).toBe(false);
      const contextButton =
            wrapper.find(contextButtonSelector);
      await contextButton.trigger('click');

      // Then
      contextMenu = wrapper.find(contextMenuSelector);
      expect(contextMenu.isVisible()).toBe(true);  
  });
});
```

### 우리가 공유하는 데 사용한 데이터

다음 함정에 도달했다. 아래 이미지는 평화롭고 행복해 보인다. 두 사람이 종이를 공유하고 있다.

![Test data we used to share. (Image credit: Ramona Schwering)](https://res.cloudinary.com/indysigner/image/fetch/f_auto,q_80/w_2000/https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/0aca41f2-0dc4-4989-a1d9-c87d2a5a57cf/2-frontend-testing-pitfalls.png)

하지만, 그들은 예상치 못한 일들을 생각해야 할 것이다. 이 이미지에 테스트를 적용해 보면, 두 사람은 테스트를 나타내고 종이는 테스트 데이터를 나타낸다. 이 두 테스트의 이름을 A 테스트와 B 테스트로 하겠다. 창의적이지 않은가? 요점은 테스트 A와 테스트 B가 동일한 테스트 데이터를 공유하거나 더 나쁜 경우에는 이전 테스트에 의존한다는 것이다.

이것은 **불안정한 테스트로 이어지기** 때문에 문제가 된다. 예를 들어, 이전 테스트가 실패하거나 공유된 테스트 데이터가 손상된 경우 테스트 자체를 성공적으로 실행할 수 없다. 또 다른 시나리오는 테스트가 랜덤 순서로 실행되는 것이다. 이 경우 이전 테스트가 해당 순서로 유지될지 아니면 다른 순서로 완료될지 예측할 수 없다. 그래서 테스트 A와 B의 기준을 잃게 된다. 이는 End-to-End테스트에 국한되지 않는다. 보통 단위 테스트는 두 테스트가 동일한 기준 데이터를 변화시킨다.

좋다. 필자 일상 업무에서 나온 End-to-End테스트 코드 예제를 보자. 다음 테스트에서는 온라인 상점의 로그인 기능에 관해 설명한다.

```js
// Cypress
describe('Customer login', () => {
  // 매 테스트 실행전에 실행한다.
  beforeEach(() => {
      // 1 단계: 어플리케이션의 상태를 초기화 한다.
      cy.setInitialState()
        .then(() => {
          // 2 단계: 테스트 데이터를 생성한다.
          return cy.setFixture('customer');
        })
        // … cy.request를 사용해서 고객을 생성한다.
  }):

  // … 테스트는 아래 쪽에서 시작된다.
})
```

위에서 언급한 문제를 방지하기 위해 파일에 있는 각 테스트 전에 이 테스트의 `beforeEach` 훅을 실행할 것이다. 여기서 가장 중요한 첫 번째 단계는 사용자 지정 데이터나 다른 데이터 없이 애플리케이션을 초기화 설정으로 재설정하는 것이다. 우리의 목표는 모든 테스트의 기준을 동일하게 하는 것이다. 또한 테스트 외부의 요인으로 발생한 사이드 이펙트로부터 이 테스트를 보호한다. 기본적으로, 테스트를 외부로부터 어떠한 영향도 받지 않고 고립시키는 것이다.

두 번째 단계는 테스트를 실행하는 데 필요한 모든 데이터를 생성하는 것이다. 이 예제 코드에서는 매장에 로그인할 수 있는 고객을 만들어야 한다. 테스트 자체에 맞게 테스트에 필요한 모든 데이터를 만들고 싶다. 이렇게 하면 테스트는 독립적이며 실행 순서는 무작위로 지정할 수 있다. 요약하자면, 두 단계 모두 테스트가 다른 테스트 또는 외부 부작용으로부터 격리되어 결과적으로 안정성을 유지하는 데 필수 적이다.

## 구현 함정

좋다. 테스트 디자인에 관해 얘기했다. 하지만 좋은 테스트 디자인을 말하는 것만으로는 충분치 않다. 왜냐하면 불가사의한 요소가 세부사항 속에 숨어있기 때문이다. 그러니 우리 테스트를 살펴보고 실제 구현을 해보자.

### FOO BAR 무엇?

테스트 구현의 첫 번째 트랩에는 BB-8인 손님이 있다! BB-8은 우리 테스트 중 하나에서 뭔가를 발견했다.

![What does “Foo Bar” mean?! (Image credit: Ramona Schwering)](https://res.cloudinary.com/indysigner/image/fetch/f_auto,q_80/w_2000/https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/326e595b-8597-4d1e-a867-a7a351cb5841/3-frontend-testing-pitfalls.png)

그는 우리에게 친숙할지는 몰라도 그것에 익숙하지 않은 이름을 발견했다. Foo Bar. 물론, 우리 개발자들은 Foo Bar는 임시 이름으로 사용된다는 것을 알고 있다. 하지만 테스트에서 본다면 그것이 무엇을 나타내는지 즉시 알 수 있을까? 다시 말하지만, 테스트가 첫눈에 이해하기 더 어려울 수 있다.

다행히 이 함정은 고치기 쉽다. 아래의 Cypress 테스트를 살펴보자. End-to-End테스트이지만, 이 유형에 국한된 조언은 아니다.

```js
// Cypress
it('should create and read product', () => {
  // 제품을 추가할 모듈을 연다.
  cy.get('a[href="#/sw/product/create"]').click();

  // 제품의 기본적인 데이터를 추가한다.
  cy.get('.sw-field—product-name').type('T-Shirt Ackbar');
  cy.get('.sw-select-product__select_manufacturer')
    .type('Space Company');

  // … 테스트는 계속 진행된다. …
});
```

이 테스트는 제품이 생성되고 읽힐 수 있는지 확인하는 것이다. 이 테스트에서는 실제 제품에 연결된 이름 및 임시 데이터를 사용하고자 한다.

* 티셔츠 제품 이름은 "T-Shirt Akbar"를 사용하고 싶다.
* 제조업체 이름에 "Space Company"는 한 가지 생각이다.

하지만 모든 제품 이름을 지어낼 필요는 없다. 데이터를 자동 생성하거나 훨씬 더 멋지게 프로덕션 상태에서 가져올 수 있다. 어쨌든, 필자는 이름을 지을 때도 황금 규칙을 지키고 싶다.

### 반드시 선택자를 살펴보자

같은 테스트의 새로운 함정이다. 뭔가 알아챘는가?

```js
// Cypress
it('should create and read product', () => {
  // 제품을 추가할 모듈을 연다.
  cy.get('a[href="#/sw/product/create"]').click();

  // 제품의 기본적인 데이터를 추가한다.
  cy.get('.sw-field—product-name').type('T-Shirt Ackbar');
  cy.get('.sw-select-product__select_manufacturer')
      .type('Space Company');

  // … 테스트는 계속 진행된다. …
});
```

선택자를 보았는가? CSS 선택자이다. 음, 글쎄, 당신은 궁금해할 것이다. "왜 그것들이 문제가 됩니까? 독특하고 취급 및 유지 관리가 쉽고 완벽하게 사용할 수 있는데!” 그러나 항상 저런 선택자가 유지된다고 확신하는가?

사실 CSS 선택자는 변경되기 쉽다. 예를 들어 클래스를 변경하면 버그를 도입하지 않았더라도 테스트가 실패할 수 있다. 이러한 리팩토링은 일반적이기 때문에 개발자들이 이러한 실패를 고치기에는 성가시고 지칠 수 있다. 따라서 버그 없이 테스트에 실패하는 것은 대상 코드가 정상이지만 테스트 케이스가 실패하는 잘못된 현상으로 애플리케이션에 대한 신뢰할 수 있는 보고서가 제공되지 않는다는 점을 명심해야 한다.

![“Look at selectors you must!” (Image credit: Ramona Schwering)](https://res.cloudinary.com/indysigner/image/fetch/f_auto,q_80/w_2000/https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/3e2e3af7-cd08-4321-9181-62b5b87fb33a/4-frontend-testing-pitfalls.png)

이 경우 이 함정은 주로 End-to-End테스트를 의미한다. 예를 들어 단위 테스트에 선택자를 사용하는 경우 등 다른 상황에서도 단위 테스트에 적용될 수 있다. Kent C. Dodds는 [아티클](https://kentcdodds.com/blog/testing-implementation-details)에서 이 주제에 대해 다음과 같이 말한다.

> "구현 세부사항을 테스트해서는 안 됩니다."

테스트에 구현 세부사항을 사용하는 것보다 더 나은 대안이 있다고 생각한다. 대신, **사용자가 알아차릴 수 있는 것들을 테스트해보자.** 더 나은 방법은 변경 가능성이 적은 선택자를 선택하는 것이다. 필자가 가장 좋아하는 선택자 유형은 데이터 속성이다. 개발자는 리팩토링 중에 데이터 속성을 변경할 가능성이 작아 테스트에서 요소를 찾기에 완벽하다. 소스 코드로 작업하는 개발자에게 명확하게 목적을 전달할 수 있도록 **의미 있는 방식으로 이름을 지정할 것**을 권장한다. 다음과 같이 할 수 있다.

```js
// Cypress
cy.get('[data-test=sw-field—product-name]')
  .type('T-Shirt Ackbar');
cy.get('[data-test=sw-select-product__select_manufacturer]')
  .type('Space Company');
```

거짓 양성반응(역자 주: 대상 코드에 버그가 있지만 테스트 케이스에서 정상이라고 알리는 경우)은 구현 세부 정보를 테스트할 때 발생하는 문제 중 하나일 뿐이다. 구현 세부 정보를 테스트할 때도 이와 반대로 거짓 음성반응(역자 주: 대상 코드는 정상이지만 테스트 케이스에서 실패한다고 알리는 경우)이 발생할 수 있다. 응용 프로그램에 버그가 있더라도 테스트에 통과하면 잘못된 양성반응이 발생한다. 그 결과 다시 테스트하는 것은 우리의 황금 규칙에 반하게 되고 다시 두뇌에 과부하가 걸리게 된다. 그래서 최대한 피해야 한다.

참고: 이 주제는 매우 크므로 다른 기사에서 다루는 것이 좋겠다. 그때까지 Dodds의 "[Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)" 기사로 이동하여 이 주제에 대해 자세히 알아보기를 제안한다.

### 기다려봐!

마지막으로, 이 주제는 필자가 아무리 강조해도 부족할 주제이다. 귀찮겠지만 그래도 많은 사람이 하는 걸 보니까 여기서 함정으로 언급해야 할 것 같다.

필자가 [불안정한 테스트 글](https://www.smashingmagazine.com/2021/04/flaky-tests-living-nightmare/)에서 언급했던 고정 대기 시간 문제이다. 이 테스트를 살펴보자.

```js
// Cypress
Cypress.Commands.add('typeSingleSelect', {
        prevSubject: 'element',
    },
    (subject, value, selector) => {
    cy.wrap(subject).should('be.visible');
    cy.wrap(subject).click();

    cy.wait(500);            
    cy.get(`${selector} input`)
      .type(value);
});
```

`cy.wait(500)`가 있는 짧은 줄은 테스트 실행을 0.5초 동안 일시 중지하는 고정된 대기 시간이다. 이 실수를 테스트에서 여러 번 사용해서 더욱 심각하게 만들기 위해 특정 작업을 하는 명령어에 이 대기 코드를 사용해보자. 이 작업 명령을 사용할 때마다 기다리는 시간은 길어질 것이다. 그렇게 하면 테스트 속도는 너무 느려질 것이고, 느려질 필요도 전혀 없다. 이건 최악도 아니다. 가장 나쁜 경우는 우리가 너무 짧은 시간을 기다릴 것이기 때문에 우리의 웹사이트가 반응할 수 있는 것보다 더 빨리 테스트가 진행되리라는 것이다. 이것은 가끔 테스트가 실패하기 때문에 불안정함에 원인이 된다. 다행히 우리는 고정된 대기 시간을 사용하지 않아도 되는 많은 대안들이 있다.

기대하는 모든 행동들은 동적으로 기다려야 한다. 필자는 대부분의 테스트 플랫폼이 제공하는 지정된 방법을 선호한다. 필자가 가장 좋아하는 두 가지 방법을 자세히 살펴보자.

* **UI가 변하는 것을 기다린다.**

필자가 선택한 첫 번째 방법은 사용자가 알아차리거나 반응할 수 있는 애플리케이션의 UI 변경을 기다리는 것이다. 예를 들어 로드 스피너 사라짐, 애니메이션 중지 대기하는 등의 UI 변경이 있을 수 있다. Cypress를 사용하는 경우 다음과 같이 작성할 수 있다.

```js
// Cypress
cy.get('data-cy="submit"').should('be.visible');
```

거의 모든 테스트 프레임워크는 이러한 기다림을 가능하게 제공한다.

> 역자 주: Cypress의 DOM 질의 내장 커맨드 중에 자동으로 타임아웃 동안 재시도 기능을 하는 커맨드들이 있다. [Cypress Retry-ability](https://docs.cypress.io/guides/core-concepts/retry-ability#Commands-vs-assertions)

* **API요청을 기다린다.**

필자가 좋아하게 된 또 다른 기능은 API 요청과 그것의 응답을 기다리는 기능이다. 한 가지 예를 들면, Cypress는 그에 맞는 깔끔한 기능을 제공한다. 처음에는 Cypress가 기다려야 하는 URL을 정의한다.

```js
// Cypress
cy.intercept({
    url: '/widgets/checkout/info',
    method: 'GET'
}).as('checkoutAvailable');
```

그런 다음 테스트에서 다음과 같이 단언을 실행할 수 있다.

```js
// Cypress
cy.wait('@request').its('response.statusCode')
  .should('equal', 200);
```

이렇게 하면 테스트의 안정성과 신뢰성을 유지하면서 시간을 효율적으로 관리할 수 있다. 게다가, 필요한 만큼만 기다리기 때문에 테스트는 더 빨라질 수도 있다.

## 주요 이점

Admiral Akbar와 Star Wars로 돌아가서, Endor 전투는 비록 그 승리를 위해 큰 노력을 해서 성공으로 끝났다. 팀워크와 몇 가지 대응책으로 가능했고 결국 현실이 됐다.

테스트를 적용해라. 테스트 함정에 빠지지 않도록 하거나 특히 레거시 코드로 이미 손상을 입었을 때 이슈를 고치는 데 들이는 수고를 줄일 수 있다. 당신과 당신의 팀은 자주 **테스트 설계나 심지어 많은 리팩토링을 통해 사고방식을 바꿔야 할 것이다.** 하지만 결국엔 그럴 가치가 있고, 결국엔 보상을 받을 것이다.

기억해야 할 가장 중요한 것은 앞에서 이야기했던 황금 규칙이다. 대부분 필자의 예시들이 이 황금 규칙을 따른다. 모든 고통은 황금 규칙을 무시하는 데서 온다. **테스트는 방해물이 아니라 친절한 조수가 되어야 한다!** 이것이 가장 중요한 사항이다. 테스트는 복잡한 수학 공식을 푸는 것이 아니라 일상적인 과정을 거치는 것처럼 느껴져야 한다. 그것을 이루기 위해 최선을 다해보자.

![R2-D2는 여기에서 쉽게 버그를 잡는다. 당신과 당신의 팀도 그렇게 느꼈으면 하는 바람에 테스트를 간단하고 재미있게 만들어 봅시다! (Image credit: Ramona S.)](https://res.cloudinary.com/indysigner/image/fetch/f_auto,q_80/w_2000/https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/64da3fc1-b2c2-42df-bafc-ad3b21da758e/5-frontend-testing-pitfalls.png)

필자는 가장 흔한 함정에 대해 몇 가지 아이디어를 드리며 당신을 도울 수 있기를 바란다. 하지만 더 많은 함정을 찾아서 배울 수 있을 것이다. 아래 댓글에서 가장 많이 접한 함정을 공유해 주시면 감사하겠다. 그래야 우리도 배울 수 있다. 거기서 보자!