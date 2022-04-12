# (번역) 인터페이스 vs 구현 프로그래밍

> 원문 : [https://dmitripavlutin.com/interface-vs-implementation/#comments](https://dmitripavlutin.com/interface-vs-implementation/#comments)
    
    

당신은 코드를 작성하고 테스트를 하고 상품을 출시한다. 이후에 코드를 다시 수정할 일이 없다면 얼마나 훌륭하겠는가?

이런 꿈은 제쳐두고... 당신은 매번  작성된 코드를 수정한다. 필자 생각으로는 이미 작성된 코드를 수정하는 것이 소프트웨어 개발에서 가장 큰 도전이라고 생각한다.

당신의 코드가 변할 수 있는 가능성에 대해 미리 생각해두지 않는다면 [경직되고 깨지기 쉬운 코드](https://www.excella.com/insights/top-4-symptoms-of-bad-code)가 될 것이다.

이 글에서 필자는 나중에 더 쉽게 코드를 수정하는데 도움이 되는 `구현보다는 인터페이스로 하는 프로그래밍`하는 소프트웨어 디자인에 대해 이야기할 것이다.

## 목차

1. 리스트 렌더러
2. 구현으로 하는 프로그래밍
  2-1. 구현 변경
3. 인터페이스로 하는 프로그래밍
  3-1. 인터페이스로 하는 실전 프로그래밍
4. 이점 vs 복잡성 증가
5. 결론

## 1. 리스트 렌더러

소프트웨어 디자인 원칙을 가장 잘 이해하기 위한 방법은 예제를 따라가도록 하면서 어떤 이점이 있는지 보여주는 것이다.

먼저, 변화에 적합하지 않은 구현으로 하는 프로그래밍을 보여줄 것이다. 그 후에 *인터페이스로 하는 프로그래밍*을 적용해서 컴포넌트를 재 디자인하고 새롭게 디자인된 컴포넌트가 어떤 이점이 있는지 보여줄 것이다.

예를 들어, 당신은 `ListRenderer`클래스 구현 업무를 맡고 있다. 이 클래스는 단 하나의 메서드인 `listRender.render(names)`를 가지고 있다. 이 메서드는 이름이 담긴 배열을 정렬 없는 HTML list로 렌더링 한다.

![https://dmitripavlutin.com/5e62f2552ee637e1499815675ede46b1/diagram-01.svg](https://dmitripavlutin.com/5e62f2552ee637e1499815675ede46b1/diagram-01.svg)

`ListRenderer`클래스는 아래와 같이 구현할 수 있었을 것이다.

```js
class ListRenderer {
  render(names: string[]): string {
    let html = '<ul>';
    for (const name of names) {
      html += `<li>${name}</li>`;
    }
    html += '</ul>';
    return html;
  }
}
```

그리고 몇 가지 이름을 가지고 리스트 렌더러를 사용해보자.

```js
const renderer = new ListRenderer();
 
renderer.render(['Joker', 'Catwoman', 'Batman']);
// =>
// <ul>
//  <li>Joker</li>
//  <li>Catwoman</li>
//  <li>Batman</li>
// </ul>
```

[데모를 실행해보자.](https://codesandbox.io/s/simple-renderer-qld0c?file=/src/index.ts)

위 구현은 간단하게 이름 리스트를 렌더링 하길 원한다면 매우 좋은 해결법이다. 하지만 당신이 앞으로 이 코드를 수정하게 된다면 어떻게 될까? 예를 들어 정렬하는 기능을 추가해야 한다면 말이다.

## 2. 구현으로 하는 프로그래밍

이 글 처음에 언급했듯이 새로운 요구사항이 발생하면 이미 작성된 코드를 수정해야 할 가능성이 크다.

자 그럼 *이름을 알파벳 순으로 정렬*을 해야 하는 요구사항이 있다고 해보자.

당신은 새로운 클래스를 생성해서 이 요구사항을 구현할 수 있다. 다음은 `SortAlphabetically` 예제이다.

```js
class SortAlphabetically {
  sort(strings: string[]): string[] {
    return [...strings].sort((s1, s2) => s1.localeCompare(s2))
  }
}
```

위 예제에서`s1.localCompare(s2)`메서드는 `s1`이 알파벳 순으로 `s2` 이전 또는 이후에 오는지를 비교하는 [문자열 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)이다.

그 이후에 `ListRender`클래스에 `SortAlphabetically`를 통합하고 렌더링 이전에 이름순으로 정렬을 하게 된다.

```js
class ListRenderer {
  sorter: SortAlphabetically;
 
  constructor() {
    this.sorter = new SortAlphabetically();
  }
 
  render(names: string[]): string {
    const sortedNames = this.sorter.sort(names)
 
    let html = '<ul>';
    for (const name of sortedNames) {
      html += `<li>${name}</li>`;
    }
    html += '</ul>';
 
    return html;
  }
}
```

이제 이 정렬 로직을 가지고 알파벳 순으로 리스트가 렌더링 된다.

```jsx
const renderer = new ListRenderer();
 
renderer.render(['Joker', 'Catwoman', 'Batman']);
// =>
// <ul>
//   <li>Bane</li>
//   <li>Catwoman</li>
//   <li>Joker</li>
// </ul>
```
[데모를 실행해보자.](https://codesandbox.io/s/sorted-renderer-efuj6?file=/src/index.ts)


정렬 기능을 인스턴스화 하는 줄을 자세히 보자.

```jsx
this.sorter = new SortAlphabetically();
```

`ListRender`에서 정확히 `SortAlphabetically`라는 구체적인 정렬 구현을 사용하기 때문에 이것은 구현을 위한 프로그래밍이다. 

![https://dmitripavlutin.com/9ad9a704a3f74939205f452015aafdd5/diagram-02.svg](https://dmitripavlutin.com/9ad9a704a3f74939205f452015aafdd5/diagram-02.svg)

구현으로 하는 프로그래밍이 문제가 있을까? 이 질문의 답은 *나중에 어떻게 코드가 변할지*에 달려있다.

만약 리스트 렌더러가 알파벳순으로만 정렬이 되고 이 요구사항이 절대 변하지 않는다면 이 구체적인 정렬 구현으로 하는 프로그래밍은 *훌륭*하다.

### 2.1 구현 변경

하지만 정렬 구현이 나중에 변경될 수 있거나 런타임 값에 따라 다른 정렬이 필요한 경우 *구현으로 하는 프로그래밍*이 어려울 수 있다.

예를 들어, 사용자의 선택에 따라 이름을 알파벳 순으로 오름차순 또는 내림차순으로 정렬할 수 있어야 한다고 가정하자.

구현으로 하는 프로그래밍을 사용하면 자세한 정렬 구현과 함께 메인 컴포넌트가 비대해지기 시작한다. 이렇게 하면 코드를 쉽게 추론하기 어렵고 변경하기 어렵다.

```jsx
class ListRenderer {
  sorter: SortAlphabetically | SortAlphabeticallyDescending;
  constructor(ascending: boolean) {
    this.sorter = ascending ? 
      new SortAlphabetically() : 
      new SortAlphabeticallyDescending();
  }
  
  render(names: string[]): string {
    // ...
  }
}
```

위 `ListRenderer` 예제에서 오름차순 또는 내림차순 이름에 따라 정렬을 할 수 있다. 사용되는 정렬 유형은 `ascending`파라미터에 따라 달라진다.

![https://dmitripavlutin.com/852cff38a1727856ac59abf090a25b44/diagram-03.svg](https://dmitripavlutin.com/852cff38a1727856ac59abf090a25b44/diagram-03.svg)

`ListRenderer`가 얼마나 복잡해지는지 볼 수 있다. 이 클래스는 구체적인 정렬 구현으로 비대해졌다.

만약 나중에 정렬 구현이 추가된다면 어떻게 될까? `ListRender`안에 새로운 정렬 구현을 참조하면 `ListRender`는 몰라도 되는 세부사항으로 인해 너무 복잡해진다.

이러한 설계 방법은 두 가지 중요한 소프트웨어 디자인 원칙을 위배하게 된다.

첫 번째, [단일 책임 원칙](https://en.wikipedia.org/wiki/Single-responsibility_principle)을 위반하게 된다. `ListRenderer`는 이름을 렌더링 하는 한 가지 책임을 지닌다. 하지만 지금은 *추가적*으로 정렬을 담당하는 객체를 인스턴스화 하고 올바른 정렬 구현을 선택해야 한다.

두 번째, 정렬 방법의 추가로 `ListRenderer` 수정이 발생함으로 [개방/폐쇄 원칙](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)을 위배하게 된다.

변경 가능성이 있는 종속성 구현을 어떻게 설계할 것인가? *인터페이스로 하는 프로그래밍*을 맞이하자!

## 3. 인터페이스로 하는 프로그래밍

만약 `ListRenderer`를 유연하게 만들고 구체적인 정렬 구현으로부터 [분리](https://softwareengineering.stackexchange.com/a/244478)시키고 싶다면 `인터페이스로 하는 프로그래밍`접근법을 이용해야 한다.

다음은 다양한 정렬 메커니즘을 가진 렌더러 디자인을 개선하기 위해 수행해야 하는 작업이다.

1. 정렬 행위를 대표하는 `Sorter` 인터페이스를 정의하자.(또는 추상화 클래스)
2. 구체적인 구현인 `SortAlphabetically 그리고 SortAlphabeticallyDescending`에 의존하는 것이 아닌 `Sorter`인터페이스에 의존하는 `ListRender`를 만든다.
3. `Sorter`인터페이스를 구현하는 구체적인 정렬 구현인 `SortAlphabetically` 그리고 `SortAlphabeticallyDescending`을 만든다.
4. 올바른 정렬 구현과 함께 `ListRenderer`인스턴스를 구성한다. (`new ListRenderer(new SortAlphabetically())` 또는 `new ListRenderer(new SortAlphabeticallyDescending())`

인터페이스로 하는 프로그래밍의 주된 목표는 안정적인 구조(인터페이스 또는 추상 클래스)를 도입하고 인터페이스나 추상 클래스에 의존하는 것이다. 또한 메인 클래스 밖에서 상세 구현을 인스턴스화 시키고 선택할 수 있다.

![https://dmitripavlutin.com/03d284246f6778ea53effe67b6d2bdf9/diagram-04.svg](https://dmitripavlutin.com/03d284246f6778ea53effe67b6d2bdf9/diagram-04.svg)

### 3.1 인터페이스로 하는 실전 프로그래밍

자, 그럼 리스트 렌더러의 디자인을 개선하기 위해 인터페이스에 프로그래밍을 적용하는 방법에 대해 알아보자.

1. `Sorter`인터페이스를 정의하는 건 비교적 쉽다.

```jsx
interface Sorter {
  sort(strings: string[]): string[]
}
```

`Sorter`인터페이스는 단지 문자열 배열을 정렬하는 하나의 `sort()`메서드를 포함하고 있다. 이 인터페이스는 `sort()`메서드가 구체적으로 어떻게 동작하는지 알지 못한다. 단지 문자열 배열을 받아 정렬된 문자열 배열을 반환한다는 것만 안다.

2. `Sorter`인터페이스를 사용하는 `ListRender`를 만드는 것은 쉽다. 단지 구체적인 구현의 참조를 제거하고 `Sorter`인터페이스를 사용하면 된다.

```jsx
class ListRenderer {
  sorter: Sorter;
 
  constructor(sorter: Sorter) {
    this.sorter = sorter;
  }
 
  render(names: string[]): string {
    const sortedNames = this.sorter.sort(names)
 
    let html = '<ul>';
    for (const name of sortedNames) {
      html += `<li>${name}</li>`;
    }
    html += '</ul>';
 
    return html;
  }
}
```

이제 `ListRenderer`는 더 이상 구체적인 정렬 구현에 의존하지 않는다. 따라서 `ListRenderer`클래스는 추론하기가 쉽고 정렬 로직으로부터 분리되었다. 이 클래스는 매우 안정된 `Sorter` 인터페이스에 의존한다.

`ListRenderer`안에 `sorter: Sorter`의 존재가 인터페이스로 하는 프로그래밍이다.

3. 마지막으로 `Sorter`인터페이스를 구현하는 구체적인 정렬 클래스를 만드는 것도 상대적으로 쉽다.

```jsx
class SortAlphabetically implements Sorter {
  sort(strings: string[]): string[] {
    return [...strings].sort((s1, s2) => s1.localeCompare(s2))
  }
}
```

```jsx
class SortAlphabeticallyDescending implements Sorter {
  sort(strings: string[]): string[] {
    return [...strings].sort((s1, s2) => s2.localeCompare(s1))
  }
}
```

## 4. 이점 vs 복잡성 증가

당신은 인터페이스에 대한 프로그래밍이 구현을 위한 코딩보다 더 많은 모듈 필요하다고 이야기할 수 있다. 맞다!

이미 봤지만 가장 큰 이점은 `ListRenderer`클래스가 추상 인터페이스 `Sorter`를 사용한다는 것이다.

따라서 `ListRenderer`는 `SortAlphabetically` 또는 `SortAlphabeticallyDescending`과 같은 구체적인 정렬 구현에서 분리된다.

이제 다양한 정렬 구현을 제공할 수 있다. 그중 하나는 알파벳을 오름차순으로 정렬할 수 있다.

```jsx
const names = ['Joker', 'Catwoman', 'Batman'];
 
const rendererAscending = new ListRenderer(
  new SortAlphabetically()
);
rendererAscending.render(names); 
// =>
// <ul>
//   <li>Batman</li>
//   <li>Catwoman</li>
//   <li>Joker</li>
// </ul>
```

[데모를 실행해보자.](https://codesandbox.io/s/sorted-renderer-interface-alpha-0nv8v?file=/src/index.ts)

또 다른 상황에서 `ListRenderer` 코드 수정 없이 `ListRenderer` 를 내림차순 정렬 기능과 쉽게 구성할 수 있다.

```jsx
const names = ['Joker', 'Catwoman', 'Batman'];
 
const rendererDescending = new ListRenderer(
  new SortAlphabeticallyDescending()
);
rendererDescending.render(names);
// =>
// <ul>
//   <li>Joker</li>
//   <li>Catwoman</li>
//   <li>Batman</li>
// </ul>
```

[데모를 실행해보자.](https://codesandbox.io/s/sorted-renderer-interface-desc-eyuci?file=/src/index.ts)

또한 런타임 값에 따라서 구체적인 정렬 기능을 선택적으로 적용할 수도 있다.

```jsx
const sorting = 
  someRuntimeBoolean ?
    new SortAlphabetically() :
    new SortAlphabeticallyDescending();
const renderer = new ListRenderer(
  sorting
);
// ...
```

## 5. 결론

*인터페이스로 하는 프로그래밍*은 시간에 따라 변화하는 의존성을 설계하거나 또는 런타임 값에 따라 다른 의존성 구현을 선택할 수 있는 유용한 원칙이다.

인터페이스로 프로그래밍하려면 일반적으로 기본 클래스(예: `ListRenderer`)가 인터페이스(예: `Sorter`)에 의존하고 구체적인 구현(예: `SortAlphabetically` 및 `SortAlphabeticallyDescending`)이 해당 인터페이스를 구현해야 한다.

기본 클래스(예: `ListRenderer`)의 클라이언트는 기본 클래스(예: `ListRenderer`)의 소스 코드를 수정하지 않고도 필요한 모든 종속성 구현을 즉시 제공할 수 있다.

인터페이스로 하는 프로그래밍에는 복잡성이 증가한다는 대가가 따른다. 이 프로그래밍을 사용하는 것은 현명하고 신중한 선택이어야 한다.

그러나 코드의 특정 부분이 변경되지 않을 것이라고 확신하는 경우 구현 위주의 프로그래밍이 더 저렴하고 저렴하고 좋은 선택이다!

예를 들어 `ListRenderer`가 항상 이름을 알파벳 오름차순으로 정렬하는 경우 이 글의 섹션 2의 시작 부분에서 다뤘던 디자인에서 멈춰야 한다. 불필요한 복잡성을 추가하지 마라.