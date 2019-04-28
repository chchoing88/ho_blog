---
title: 복합 리팩토링
date: "2019-04-28T10:00:03.284Z"
---

해당 글은 `리팩토링 (코드 품질을 개선하는 객체지향 사고법)` 에서 발췌 했습니다. 코드 예제는 javascript 로 전환하였습니다.

# 상속 구조 정리

하나의 상속 계층이 두 작업을 동시에 수행할 땐 상속 계층을 하나 더 만들어서 위임을 통해 다른 계층을 호출하자.

상속구조로 만들면 하위클래스 안에 작성할 코드가 상당히 줄어든다.
메서드 하나는 비록 크기는 작지만 상속 계층에 들어 있다는 것만으로 상당히 중요하다.

이것을 오용하게 되면 모르는 사이 쌓여간다. 사소한 기능의 작은 하위클래스를 하나 추가하고, 다음 날은 계층구조의 다른 부분을 같은 기능의 다른 하위클래스를 몇 개 추가하는 식으로 하다가, 나중에는 상속 구조를 풀기 힘들 정도로 복잡하게 얽힌다.

개발자는 "이 계층구조가 여기서 결과를 산출한다" 라고 추상적으로 말해선 안 되고, "이 계층구조가 결과를 산출하고, 표 형태로 출력하는 하위클래스들이 있고, 그 하위엔 국가를 구별하는 하위클래스가 있다." 라고 섬세하게 이야기 해야한다.

계층구조의 특정 계층에 있는 모든 클래스의 하위클래스들이 이름 앞에 같은 형용사가 붙어 있다면 한 계층으로 두 개능을 수행하는 것이다.

### 예제

복잡하게 얽힌 계층 구조 예제는 다음과 같다.

```javascript
class Deal {}
// 거래유형
class ActiveDeal extends Deal {}
class PassiveDeal extends Deal {}
// 표현 스타일
class TabularActiveDeal extends ActiveDeal {}
class TabularPassiveDeal extends PassiveDeal {}
```

이 계층구조는 Deal 이 원래 하나의 거래를 표시하는 용도로만 사용되다 보니 이렇게 된것이다.
이후에 누군가가 여러 개의 거래를 하나의 표로 표시하면 좋겠다는 아이디어를 떠올려서 작성한 구조이다.

여기서 `TabularActiveDeal`, `TabularPassiveDeal` 의 경우에는 이제 거래 유형 로직과 표현 로직이 엉켜서 새로운 Deal 을 추가하기가 어려워졌다.

이 문제를 해결하기 위해선 이 상황에서 우선 상속 계층에 의해 처리되는 기능들을 확인하자.
첫번째 기능은 거래 유형에 따른 변화를 감지하는 것이고, 두번째 기능은 표현 스타일에 따른 변화를 감지하는 것이다.

| Deal         | Active Deal | Passive Deal |
| ------------ | ----------- | ------------ |
| Tabular Deal |             |              |

물건 거래가 표현 스타일보다 훨씬 중요하므로 Deal 만 남겨두고 표현 스타일을 별도의 상속 계층으로 빼낸다.

```javascript
class Deal {}
// 거래유형
class ActiveDeal extends Deal {}
class PassiveDeal extends Deal {}

// 표현 메서드
class PresentationStyle {}
class TabularPresntationStyle extends PresentationStyle {}
class SinglePresntationStyle extends PresentationStyle {}
```

메서드 이동과 필드 이동을 실시해서 Deal 하위클래스에 들어있는 표현 관련 메서드와 변수를표현 스타일 클래스로 옮기자.
