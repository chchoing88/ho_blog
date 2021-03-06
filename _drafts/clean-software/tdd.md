# 테스트

- 단위 테스트를 작성하는 일은 검증의 문제가 아닌 설계와 문서화의 문제이다.

## 테스트 주도 개발

- 일차적이고 가장 명백한 효과는 프로그램의 모든 단일 함수가 그 동작을 검증하는 테스트를 갖게 된다는 것이다.
- 테스트 집합은 프로그래머가 기존의 어떤 기능을 망가뜨려도 그 사실을 알려준다. 이 테스트들은 프로그램이 아직 잘 동작하고 있다는 것을 알려주므로 수정하기가 용이하다.
- 테스트를 먼저 작성할 경우 프로그래머가 다른 관점에서 문제를 해결할 수 있다.
- 프로그래머는 작성할 프로그램을 그 프로그램의 호출자 관점에서 봐야한다. 따라서 프로그래머는 프로그램의 함수만큼이나 인터페이스에도 바로 관심을 가져야 한다.
- 프로그래머는 편리하게 호출할 수 있는 소프트웨어를 설계할 수 있다.
- 프로그래머는 자신이 반드시 테스트 가능한 프로그램을 설계하도록 강제 할 수 있다.
- 테스트를 먼저 작성한다는 건 프로그래머가 소프트웨어를 다른 환경과 분리하도록 강제 하는 것이다.
- 테스트를 먼저 작성하면 문서화의 귀중한 한 형태로 기능할 수 있다.

### 테스트 우선 방식의 설계의 예

- 몬스터 사냥하기 게임을 만들어보자.
- 내용만 전달하는 방식으로 테스트 작성 (이것을 계획된 프로그래밍 이라고 한다.)

```javascript
// 움퍼스라는 악당에게 잡혀 먹히기 전에 먼저 움퍼스를 처치하는 어드벤스
// 동굴은 통로로 서로 연결 되어 있다.
// 각 방에는 동서남북으로 향하는 통로가 있을 수 있다.
function testMove() {
  const g = new WumpusGame();
  g.connect(4, 5, "E"); // 한방을 다른 방과 연결하는 동작의도를 설명
  g.setPlayerRoom(4);
  g.east();
  expect(g.getPlayerRoom).toEqual(5);
}
```

- 프로그래머는 자신의 의도를 구현하기 전에, 먼저 그 의도를 가능한 단순하고 읽기 편하게 만들어 테스트로 제시한다.
- 위 테스트가 아주 이른 시기에 주요한 설계의 이슈를 명백히 한다는 것이다.
- 테스트를 먼저 작성하는 것은 설계 의사결정의 차이를 식별하는 것이다.
- 위 테스트가 프로그램이 동작하는 방식을 말해준다는 점에 주목하자.

### 테스트 분리

- Payroll 객체의 행위를 명시하는 테스트를 작성해보자.
- Payroll 클래스를 테스트하기도 전에 주변의(데이터 베이스..)의 완벽한 기능을 작성해야하는가?
- 위 문제는 의사 객체(MOCK OBJECT) 패턴을 이용하는 것이다. Payroll의 모든 관련 요소 사이에 인터페이스를 추가하고 이 인터페이스를 구현하는 테스트 스텁(stub)을 생성할 수 있다.

```javascript
function testPayroll() {
  const db = new MockElmployeeDatabase();
  const writer = new MockCheckWriter();
  const p = new PayRoll(db, w);
  p.payEmployees();

  expect(w.checksWereWrittenCorrectly()).toBe(true);
  expect(db.paymentWerePostedCorrectly()).toBe(true);
}
```

- 위 테스트는 전부 옳은 데이터로 옳은 함수를 호출하는지의 여부로, 사실 수표가 제대로 작성됐는지를 검사하는 것은 아니다.
- Payroll 클래스가 분리된 것처럼 동작하는지 여부를 검사한다.

### 운 좋게 얻은 분리

- Payroll을 다른 객체와 분리하는 것은 테스트와 애플리케이션의 확장이란 측면에서 다른 데이터베이스와 수표 기록기로 교체할 수 있게 해준다.
- 테스트에서 모듈 분리에 대한 필요성은 프로그래머가 프로그램 전체 구족에 이득이 되는 방식으로 분리 작업을 하도록 강제한다. 코드보다 테스트를 먼저 작성하면 설계가 개선된다.

## 인수 테스트

- 단위 테스트는 시스템의 개별적인 메커니즘을 검증하는 화이트박스 테스트(테스트하는 모듈의 내부 구조를 알고, 그것에 의존하는 테스트를 말한다.), 인수 테스트는 고객의 요구사항이 충족되고 있는지를 검증하는 블랙박스 테스트(테스트하는 모듈의 내부 구조를 모르고, 그것에 의존하지 않는 테스트를 말한다.)다.
- 단위 테스트가 프로그래머로 하여금 작은 단위에서 뛰어난 설계 의사결정을 할 수 있게 만드는 것과 마찬가지로, 인수 테스트는 프로그래머로 하여금 큰 단위에서 뛰어난 아키텍처 의사결정을 할 수 있게 해준다.

### 운 좋게 얻은 아키텍쳐

## 결론

- 일련의 테스트를 실행하는 것이 간단할수록 테스트는 좀 더 자주 실행되며, 테스트를 많이 실행할수록 이 테스트에 어긋나는 것들을 좀 더 빨리 찾게 된다.
- 테스트 작업에서 가장 중요한 이점은 아키텍처와 설계에 미치는 효과일 것이다.
- 어떤 모듈이나 애플리케이션을 테스트 가능하게 만들려면 주위 환경으로부터 분리해야 하는데, 좀 더 테스트 가능해질수록 더욱 주위 환경으로부터 분리된다.