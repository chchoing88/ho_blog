---
title: 싱글톤과 모노스테이트 패턴
date: "2020-08-23T10:00:03.284Z"
tags:
  - javascript
  - OOP
keywords:
  - OOP
---


- 대부분의 클래스에서는 많은 인스턴스를 만들어낼 수 있다.
  - 이 인스턴스는 필요할 때 생성되고 이용 가치가 사라졌을 때는 버려지는 객체이다.
  - 이들은 메모리 할당과 해제의 흐름에서 들락날락 한다

- 우린 단 하나의 인스턴스만을 가져야 하는 클래스도 있다.
  - 때로 이런 객체들은 애플리케이션의 루트가 된다.

## 싱글톤 패턴

- 다음은 테스트 케이스를 작성해서 싱글톤 패턴의 구체화를 한다.

```java
public class TestSimpleSingleton extends TestCase {
  public TestSimpleSingleton(String name) {
    super(name);
  }

  public void testCreateSingleton() {
    Singleton s = Singleton.Instance();
    Singleton s2 = Singleton.Instance();

    assertSame(s, s2);
  }

  public void testNoPublicConstructors() throws Exception {
    Class singleton = Class.forName("Singleton");
    Constructor[] constructors = singleton.getConstructors();

    assertEquals("pubcli constructors.", 0, constructors.length);
  }
}
```

- 첫 번째 테스트 함수는 공용 정적 메소드인 Instance를 통해 Singleton 인스턴스에 접근함을 보여준다.
- 이 함수는 Instance가 여러 번 호출 되면, 똑같은 인스턴스에 대한 참조값이 매번 반환됨을 보여준다.

- 두번째 테스트 케이스는 Singleton 클래스가 공용 생성자를 갖고 있지 않기 때문에, Instance 메소드를 사용하지 않고서는 인스턴스를 생성할 방법이 없음을 보여준다.

- 다음은 위 테스트에 대한 Singleton 구현이다.

```java
public class Singleton {
  private static Singleton theInstance = null;

  private Singleton() {}

  public static Singleton Instance() {
    if(theInstance == null) {
      theInstance = new Singleton();
    }

    return theInstance;
  }
}
```

### 싱글톤이 주는 이점

- `플랫폼 호환` : 적절한 미들웨어(예: RMI)를 사용하면, 싱글톤은 많은 JVM과 컴퓨터에서 적용되어 확장될 수 있다.
- `어떤 클래스에도 적용 가능` :  어떤 클래스든 그냥 생성자를 전용(private)으로 만들고 적절한 정적 함수와 변수를 추가하기만 하면 싱글톤 형태로 바꿀 수 있다.
- `파생을 통해 생성 가능` :  주어진 클래스에서 싱글톤인 서브 클래스를 만들 수 있다.
- `게으른 처리(lazy evaluation)` : 만약 싱글톤이 사용되지 않는다면, 생성되지도 않는다.

### 싱글톤의 비용

- `소멸(destruction)이 정의되어 있지 않음` : 싱글톤을 없애거나 사용을 중지하는 좋은 방법은 없다. theInstance 를 null 처리하는 descommission 메소드를 추가한다해도 시스템의 다른 모듈은 그 싱글톤의 인스턴스를 참조 하고 있을 수 있다.
- `상속되지 않음` : 어떤 싱글톤에서 파생된 클래스는 싱글톤이 아니다. 이것이 싱글톤이 되려면 정적 함수와 변수가 추가되어야 한다.
- `효율성` : Instance에 대한 각 호출은 if 문을 실행시킨다. 이 호출 중 대부분의 경우에는 이 if 문이 쓸모없다.
- `비투명성` : 싱글톤의 사용자는 Instance 메소드를 실행해야 하기 때문에 자신이 싱글톤을 사용한다는 사실을 안다.

### 동작에 있어서의 싱글톤

- 사용자가 어떤 웹 서버의 보안 영역에 로그인할 수 있게 해주는 웹 기반의 시스템이 있다고 가정하자.
  - 이런 시스템은 사용자 속서응ㄹ 포함하는 DB를 갖는다.
  - 더 나아가 이 DB에 서드파티 API를 통해 접근한다고 가정하자.
  - 어떤 사용자를 읽고 쓰기 위해 필요한 모든 모듈에서 이 DB에 직접 접근할 수 있다.
  - 그러나 이것은 코드 전체에 서드파티 API 사용을 확산시키게 되고, 이는 접근이나 구조에 대한 규정을 강제할 수 있는 여지가 없게 된다.

- 나은 해결책은 퍼사드 패턴을 사용하여 User 객체를 읽고 쓰는 메소드들을 제공하는 UserDatabase 클래스를 만드는 것이다.
- 이 메소드들은 DB의 서드파티 API 에 접근하여 User객체와 데이터베이스의 테이블과 행 사이에 변환 작업을 한다.
- UserDatabase 내에서는 구조와 접근의 규정을 강제할 수 있다.

- 다음 코드는 싱글톤식의 해결책을 보여준다.

```java
public interface UserDatabase {
  User readUser(String userName);
  void writeUser(User user);
}
```

```java
public class UserDatabaseSource implements UserDatabase {
  private static UserDatabase theInstance = new UserDatabaseSource();

  public static UserDatabase instance() {
    return theInstance;
  }

  private UserDatabaseSource() {}

  public User readUser(String userName) {
    // 구현부분
    return null; // 그저 컴포알되게 하기 위해
  }

  public void writeUser(User user) {
    // 구현부분
  }
}
```

- 위 구조는 싱글톤 패턴의 아주 흔한 사용 형태로서, 모든 데이터베이스 접근이 UserDatabaseSource 의 단일 인스턴스를 통해 이루어짐을 보장해준다.
- 이것은 검사, 카운터, 락 을 UserDatabaseSource 에 넣어 먼저 언급된 접근과 구조에 대해 규정을 강제하기 쉽게 해준다.

## 모노스테이트 패턴

- 모노스테이트 패턴은 단일성을 이루기 위한 또 다른 방법으로, 이 패턴은 완전히 다른 메커니즘으로 동작한다.
- 다음 테스트 케이스를 연구해보면 이 매커니즘의 동작 방식을 알 수 있다.

```java
public class TestMonostate extends TestCase {
  public TestMonostate(String name) {
    super(name);
  }

  public void testInstance() {
    Monostate m = new Monostate();
    for (int x = 0; x < 10; x++) {
      m.setX(x);
      assertEquals(x, m.getX());
    }
  }

  public void testInstancesBehaveAsOne() {
    Monostate m1 = new Monostate();
    Monostate m2 = new Monostate();

    for (int x = 0; x < 10; x++) {
        m1.setX(x);
        assertEquals(x, m2.getX());
      }
    }
}
```

- 첫 번째 테스트 함수는 단순히 자신의 x 변수가 설정되거나 검색될 수 있는 어떤 객체를 나타낸다.
- 두 번째 테스트 케이스는 같은 클래스의 두 인스턴스가 하나인 것처럼 동작하는 모습을 보여준다. 한 인스턴스의 x 변수를 특정 값으로 설정하면, 다른 인스턴스의 x 변수를 확인하는 것으로 그 값을 검색할 수 있다. 이는 2개의 인스턴스가 같은 객체의 서로 다른 이름을 갖고 있는 것이다.
- Singleton 클래스를 이 테스트 케이스에 접목해도 이 테스트 케이스를 통과 해야한다. 따라서 이 테스트 케이스는 단일 인스턴스라는 제약을 강제하지 않는 Singleton 의 행위를 나타낸다.

```java
public class Monostate {
  private static int itsX = 0;
  public Monostate() {}

  public void setX(int x) {
    itsX = x;
  }

  public int getX() {
    return itsX;
  }
}
```

- 이것은 2개의 객체가 같은 변수를 공유함을 의미한다. 이는 모든 변수를 정적으로 만듦으로써 쉽게 이룰 수 있다.
- itsX 변수가 정적 변수임을 주목하자. 또, 어떤 메소드도 정적이 아니라는 점에 주목하자.
- Monostate 의 인스턴스를 몇 개 만들든지 간에, 이들은 모두 단일 객체인 것처럼 동작한다. 심지어 데이터를 잃지 않고도 현재 있는 모든 인스턴스를 없애거나 사용을 중지할 수도 있다.

- 이 두 패턴의 차이점은 '행위 대 구조' 의 차이 중 하나임을 명심하자.
- 싱글톤 패턴은 단일성 구조를 강제한다. 이 패턴은 둘 이상의 인스턴스가 생성되는 것을 막는다.
- 반면, 모노스테이트 패턴은 구조적인 제약을 부여하지 않고도 단일성이 있는 '행위'를 강제한다.
- 이 차이를 분명히 보려면 모노스테이트 테스트 케이스가 Singleton 클래스에 대해서도 유효하지만, 싱글톤 테스트 케이스는 Monostate 클래스에 대해 유효하지 않다.

### 모노스테이트가 주는 이점

- `투명성` : 모노스테이트의 사용자는 일반 객체의 사용자와 다르게 행동하지 않는다. 사용자는 이 객체가 모노스테이트임을 알 필요가 없다.
- `파생 가능성` : 모노스테이트의 파생 클래스는 모노스테이트다. 모노스테이트의 모든 파생 클래스는 같은 모노스테이트의 일부가 된다. 이들은 모두 같은 정적 변수를 공유한다.
- `다형성` : 파생 클래스에서 오버라이드 될 수 있다. 따라서 서로 다른 파생 클래스는 같은 정적 변수의 집합에 대해 서로 다른 행위를 제공할 수 있다.
- `잘 정의된 생성과 소멸` : 정적인 모노스테이트의 변수는 생성과 소멸 시기가 잘 정의되어 있다.

### 모노스테이트의 비용

- `변환 불가` : 보통 클래스는 파생을 통해 모노스테이트로 변환될 수 없다.
- `효율성` : 하나의 모노스테이트는 실제 객체이기 때문에 많은 생성과 소멸을 겪을 수 있다. 이 작업은 종종 비용이 꽤 든다.
- `실재함` : 모노스테이트의 변수는 이 모노스테이트가 사용되지 않는다 하더라도 공간을 차지한다.
- `플랫폼 한정` : 한 모노스테이트가 여러 개의 JVM 인스턴스나 여러 개의 플랫폼에서 동작하게 만들 수 없다.

### 동작에 있어서의 모노스테이트

- 지하철 개찰구를 위한 간단한 유한 상태 기계(finite state machine)를 구현하는 작업을 생각해보자.
- 이 개찰구는 Locked 상태에서 생명주기를 시작한다.
- 동전 하나가 들어오면, Unlocked 상태로 이전하고, 출입구를 열고, 울리고 있는 중일 수도 있는 경보 상태를 리셋하고, 동전을 요금통에 넣는다. 만약 사용자가 이 시점에 출입구를 지나가면 개찰구는 Locked 상태로 다시 돌아가고 출입구를 잠근다.

- 두 가지의 비정상적인 상황이 있다.
  - 사용자가 출입구를 지나가기 전에 2개 이상의 동전을 넣으면 그 동전들은 환불되고 출입구는 열린 상태로 있게 된다.
  - 만약 사용자가 돈을 지불하지 않고 출입구를 지나가면, 경보가 울리고 출입구는 잠긴상태로 있게 된다.

- 아래 테스트 메소드들은 Turnstile이 모노스테이트라고 전제한다는 사실이 주목하자.
- 이 클래스는 이벤트를 보내고 서로 다른 인스턴스들로 부터 질의를 받을 수 있으리라 기대된다. 이것은 Turnstile의 인스턴스가 둘 이상 생기지 않는다면 말이 되는 이야기다.

```java
public class TestTurnstyle extends TestCase {
  public TestTurnstyle(String name) {
    super(name);
  }

  public void setUp() {
    Turnstyle t = new Turnstyle();
    t.reset();
  }

  public void testInit() {
    Turnstyle t = new Turnstyle();
    assert(t.locked());
    assert(!t.alarm());
  }

  public void testCoin() {
    Turnstyle t = new Turnstyle();
    t.coin();
    Turnstyle t1 = new Turnstyle(); // monostate
    assert(!t1.locked()); // 잠기지 않았고
    assert(!t1.alarm()); // 알람도 울리지 않는다.
    assertEquals(1, t1.coins());
  }

  public void testCoinAndPass() {
    Turnstyle t = new Turnstyle();
    t.coin();
    t.pass();

    Turnstyle t1 = new Turnstyle();
    assert(t1.locked()); // 잠겼고
    assert(!t1.alarm()); // 알람을 울리지 않는다.
    assertEquals("coins", 1, t1.coins());
  }

  public void testTwoCoins() {
    Turnstyle t = new Turnstyle();
    // 동전을 2개 넣으면
    t.coin();
    t.coin();

    Turnstyle t1 = new Turnstyle();
    assert("unlocked", !t1.locked()); // 잠기지 않았고
    assertEquals("coins",1, t1.coins());
    assertEquals("refunds", 1, t1.refunds()); // 1개는 환불시켜준다.
    assert(!t1.alarm()); // 알람이 울리지 않는다.
  }

  public void testPass() {
    Turnstyle t = new Turnstyle();
    t.pass();
    Turnstyle t1 = new Turnstyle();
    assert("alarm", t1.alarm()); // 알람울리고
    assert("locked", t1.locked()); // 잠긴다.
  }

  public void testCancelAlarm() {
    Turnstyle t = new Turnstyle();
    // 반대로 한다면
    t.pass();
    t.coin();
    Turnstyle t1 = new Turnstyle();
    assert("alarm", !t1.alarm()); // 알람이 안울리고
    assert("locked", !t1.locked()); // 잠기지 않으며
    assertEquals("coin", 1, t1.coins()); // 코인 1개
    assertEquals("refund", 0, t1.refunds()); // 환불 0
  }

  public void testTwoOperations() {
    Turnstyle t = new Turnstyle();
    t.coin();
    t.pass();
    t.coin();
    assert("unlocked", !t.locked()); // 잠기지 않고
    assertEquals("coins", 2, t.coins()); // 코인은 2개
    t.pass();
    assert("locked", t.locked()); // 잠긴다.
  }
}
```

- 다음은 모노 스테이트인 Turnstile의 구현이다.
  - 기반 Turnstile 클래스는 2개의 이벤트 함수(coin 과 pass)를 유한 상태 기계의 상태를 표현하는 Turnstile의 두 파생 클래스(Locked와 Unloced)에 위임한다.

```java
public class Turnstyle
{
  private static boolean isLocked;
  private static boolean isAlarming;
  private static int itsCoins;
  private static int itsRefunds;
  protected final static Turnstyle LOCKED = new Locked();
  protected final static Turnstyle UNLOCKED = new Unlocked();
  protected static Turnstyle itsState = LOCKED;

  public void reset() {
    lock(true);
    alarm(false);
    itsCoins = 0;
    itsRefunds = 0;
    itsState = LOCKED;
  }

  public boolean locked() {
    return isLocked;
  }

  public boolean alarm() {
    return isAlarming;
  }

  public void coin() {
    itsState.coin();
  }

  public void pass() {
    itsState.pass();
  }

  protected void lock(boolean shouldLock) {
    isLocked = shouldLock;
  }

  protected void alarm(boolean shouldAlarm) {
    isAlarming = shouldAlarm;
  }

  public int coins() {
    return itsCoins;
  }

  public int refunds() {
    return itsRefunds;
  }

  public void deposit() {
    itsCoins++;
  }

  public void refund() {
    itsRefunds++;
  }
}

class Locked extends Turnstyle {
  public void coin() {
    itsState = UNLOCKED;
    lock(false);
    alarm(false);
    deposit();
  }

  public void pass() {
    alarm(true);
  }
}

class Unlocked extends Turnstyle {
  public void coin() {
    refund();
  }

  public void pass() {
    lock(true);
    itsState = LOCKED;
  }
}
```

- 여기서는 모노스테이트 파생 클래스가 다형적이 된다는 것과 이 모노스테이트 파생 클래스 자신들도 모노스테이트가 된다는 사실을 이용했다.
- 때로 어떤 모노스테이트를 일반 클래스로 바꾸는 일이 얼마나 어려운지를 보여준다.
- 이 프로그램의 구조는 Turnstile의 모노스테이트적 본질에 강하게 의존하고 있다.
- 이 유한 상태 기계로 2개 이상의 개찰구를 제어하고자 한다면, 이 코드는 많은 리팩토링이 필요할 것이다.

- Turnstile은 모노스테이트이기 때문에, 별도의 인스턴스는 존재하지 않는다. 따라서 Unlocked 와 Locked는 실제로 별도의 객체가 아니다. 오히려 Turnstile 추상화의 일부다.
- Unlocked 와 Locked는 Turnstile이 접근 권한을 가진 변수와 메소드에 대해 동일한 접근 권한을 갖는다.

## 결론

- 싱글톤은 인스턴스 생성을 제어하고 제한하기 위해 전용(private) 생성자, 1개의 정적변수, 1개의 정적 함수를 사용한다.
- 모노스테이트는 그저 객체의 모든 변수를 정적으로 만든다.
- 싱글톤은 파생을 통해 제어하고 싶은 이미 존재하는 클래스가 있을때, 그리고 접근 권한을 얻기 위해서라면 모두가 instance() 메소드를 호출해야 하는 것도 상관없을 때 최선의 선택이다.
- 모노스테이트는 클래스의 본질적 단일성이 사용자에게 투과적이 되도록 하고 싶을 때, 또는 단일 객체의 파생 객체가 다형적이 되게 하고 싶을 때 최선의 선택이다.
