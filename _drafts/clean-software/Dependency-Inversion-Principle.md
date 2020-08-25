---
title: 의존 역전 원칙
date: "2020-08-13T10:00:03.284Z"
tags:
  - javascript
  - OOP
keywords:
  - OOP
---

- 상위 수준의 모듈은 하위 수준의 모듈에 의존해서는 안된다. 둘 모두 추상화에 의존해야 한다.
- 추상화는 구체적인 사항에 의존해서는 안 된다.
- 실제로 이런 방법의 목표 중 하나는 상위 수준의 모듈이 하위 수준의 모듈을 호출하는 방법을 묘사하는 서브프로그램의 계층 구조를 정의하는 것이었다.

```uml
copy -- ReadKeyboard
copy -- WritePrinter
```

- 하위 수준의 모듈에 의존하는 상위 수준의 모듈이 의미하는 바를 생각해보자. 어떤 애플리케이션의 중요한 정책 의사결정과 업무 모델을 포함하고 있는 것은 상위 수준의 모듈로서, 이 모듈은 애플리케이션의 본질을 담고있다.
- 이런 상위 수준의 모듈이 하위 수준의 모듈에 의존할 때, 하위 수준 모듈의 변경은 상위 수준 모듈에 직접적인 영향을 미칠 수 있고, 이번엔 상위 수준의 모듈이 변경되게 할 수도 있다.
- 업무 규칙을 포함하는 상위 수준의 모듈은 구체적인 구현을 포함한 모듈에 우선하면서 동시에 독립적이어야 한다. 상위 수준의 모듈은 어떤 식으로든 하위 수준의 모듈에 의존해서는 안된다.
- 재사용하기 원하는 것은 전책을 결정하는 상위 수준의 모듈이다.

## 레이어 나누기

```uml
PolicyLayer ..> MechanismLayer
MechanismLayer ..> UtilityLayer
```

- 위 다이어그램은 Policy 레이어가 아래 Utility 레이어의 모든 변화에 민감하다는 특성이 함정으로 숨어 있다.
- 의존성은 이행적(transitive)이다.

> x,y,z 에 대해 x -> y 이고 y -> z 이면 x -> y 가 성립한다. 이를 z 가 x 에 이행적으로 함수 종속되었다고 한다.

```uml
PolicyLayer --> PolicyServiceInterface
PolicyServiceInterface <|-- MechanismLayer
MechanismLayer --> MechanismServiceInterface
MechanismServiceInterface <|-- UtilityLayer
```

- 위 uml에서 각 상위 수준 레이어는 그것이 필요로 하는 서비스에 대한 추상 인터페이스를 선언한다.
- 하위 수준의 레이어는 이 추상 인터페이스로부터 구체화된다.
- 각 상위 수준 클래스는 추상 인터페이스를 통해 다음 하위 수준의 레이어를 사용한다. 따라서 상위 레이어는 하위 레이어에 의존하지 않는다.
- 반대로 하위 레이어는 상위 레이어에 선언된 추상 서비스 인터페이스에 의존한다.

### 소유권 역전

- DIP가 적용된 경우에는 클라이언트가 추상 인터페이스를 소유하는 경향이 있고, 이들은 서버가 그것에서 파생해 나온다는 사실을 알게된다.
- 하위 수준의 모듈은 상위 수준의 모듈 안에 선언되어 호출되는 인터페이스의 구현을 제공한다.
- 더욱이 PolicyLayer 는 PolicyServiceInterface 에 맞는 하위 수준 모듈을 정의하는 어떤 문백에서든 재사용될 수 있다.

### 추상화에 의존하자

- 이 경험적 접근 방식은 구체 클래스에 의존해서는 안 되고 어떤 프로그램의 모든 관계는 어떤 추상 클래스나 인터페이스에서 맺어져야 한다고 충고한다.
  - 어떤 변수도 구체 클래스에 대한 포인터나 참조값을 가져선 안된다.
  - 어떤 클래스도 구체 클래스에서 파생되어서는 안 된다.
  - 어떤 메소드도 그 기반 클래스에서 구현된 메소드를 오버라이드해서는 안된다.
- 비휘발성(nonvolatile) 클래스에는 이 접근 방식을 적용할 이유가 없어 보인다. 하지만 우리가 애플리케이션 프로그램의 일부로 작성하는 대부분의 구체 클래스는 휘발적이다. 휘발적이지 않다는 것은 즉, 자주 바뀌지 않는다는 뜻이다. 그러므로 비휘발성 클래스를 직접 의존하는 것은 전혀 해가 되지 않는다.
- 우리가 직접적으로 의존하지 않기를 원하는 구체 클래스가 바로 이것들이다. 이들의 휘발성은 이들을 추상 클래스 뒤에 숨겨둠으로써 분리될 수 있다. 이들의 휘발성은 이들을 추상 클래스 뒤에 숨겨둠으로써 분리될 수 있다.
- 하지만 이것은 완벽한 해결책이 아니다. 휘발적인 클래스의 인터페이스를 변경해야 할 때가 있고, 이 변경은 분명히 이 클래스를 표현하는 추상 인터페이스로 전파될 것이다. 이런 변경은 추상인터페이스의 분리 상태를 망가뜨린다.
- **클라이언트 클래스(구체 클래스가 사용을 당하는 클래스)가 자신이 필요로 하는 서비스 인터페이스를 선언한다는 장기적 관점을 택한다면, 이 인터페이스가 변경되는 경우는 오직 클라이언트가 변경을 필요로 할 때가 된다. 추상 인터페이스를 구현하는 클래스의 변경은 클라이언트에 영향을 주지 않는다.**

## 간단한 예

- Button 객체와 Lamp 객체의 사례를 보자.
- Button 객체는 외부 환경을 감지한다. Poll 메세지를 받으면 이 객체는 사용자가 그것을 눌렀는지 판단한다.
- Lamp 객체는 외부 환경에 영향을 미친다. 이 객체는 TurnOn 메세지를 받으면 어떤 종류의 조명을 밝히고, TurnOff 메시지를 받으면 그 조명을 끈다.

```uml
Button --> Lamp
```

- 위와 같은 구조는 미숙하다.

```java
public class Button {
  private Lamp itsLamp;
  public void poll() {
    if(/* 어떤 조건 */) {
      itsLamp.turnOn()
    }
  }
}
```

- 이런 의존성은 Button이 Lamp에 대한 변경에 영향을 받을 것임을 의미한다.
- 게다가, Button Motor 객체를 제어할 수 있게 재사용하는 것도 불가능 하다.
- 이 애플리케이션의 상위 수준 정책은 하위 수준 구현에서 분리되어 있지 않다.
- 이런 분리 없이는 상위 수준 정책은 자동적으로 하위 수준 모듈에 의존하게 된다.

### 내재하는 추상화를 찾아서

- 애플리케이션에 내재하는 추상화이자, 구체적인 것이 변경되더라도 바뀌지 않은 것이 상위 수준의 정책이다.
- 사용자의 동작을 탐지하기 위해 어떤 매커니즘인지는 상관없다. 사용자로부터 켜고 키는 동작을 탐지해 그 동작을 대상 객체에 전해주는 것이 내재하는 추상화이다. 대상객체 또한 상관없다.

```uml
Button --> ButtonServiceInterface
ButtonServiceInterface <|-- Lamp
```

- ButtonServiceInterface 는 Button이 어떤 것을 켜거나 끄기 위해 사용할 수 있는 추상 메소드(turnOff, turnOn)를 제공하고, Lamp는 이를 구현한다.
- 의존성 방향을 역전시키고 Lamp가 의존을 당하는 대신 의존하게 만듦으로써, Lamp가 다른 구체적인 Button에 의존하게 만들었다.
- ButtonServiceInterface 를 SwitchableDevice 이름으로 변경함으로써 SwitchableDevice가 개별적인 라이브러리에 존재함을 확실히 하여, SwitchableDevice 을 사용하는 것이 곧 Button을 사용하는 것임을 의미하지 않게 만들수 있다.

## 용광로 사례

- 이 소프트웨어는 IO 채널에서 현재 온도를 읽고 다른 IO 채널에 명령어를 전송하여 용광로를 켜거나 끈다.

```c++
void Regulate(double minTemp, double maxTemp) {
  for(;;) {
    while (in(THERMOMETER) > minTemp) {
      wait(1);
      out(FURNACE, ENGAGE);
    }

    while(in(THERMOMETER) < maxTemp) {
      wati(1);
      out(FURNACE, DISENGAGE);
    }
  }
}
```

- 위 알고리즘은 상위 수준 목적은 분명하지만, 많은 하위 수준의 구체적인 내용으로 어지럽혀져 있다.
- 또한 이 코드는 다른 제어 하드웨어에서는 절대 재사용할 수 없을 것이다.

```uml
Regulate <-- ThemometerInterface : parameter
Regulate <-- HeaterInterface : parameter
ThemometerInterface <|-- IOChannelThermometer
HeaterInterface <|-- IOChannelHeater
```

- 위 uml에서는 조절 함수가 2개의 인자를 받는데 둘 다 인터페이스다.

```c++
void Regulate(Themometer& t, Heater& h, double minTemp, double maxTemp) {
  for(;;) {
    while (t.Read() > minTemp) {
      wait(1);
      h.Engage()
    }

    while(t.Read() < maxTemp) {
      wati(1);
      h.Disengage();
    }
  }
}
```

- 위 코드는 상위 수준의 조절 정책이 자동 온도 조절기나 용광로의 구체적인 사항에 의존하지 않도록 의존성 역전을 시켰다.

### 동적 다형성과 정적 다형성

- 지금까진 동적 다형성(즉, 추상 클래스나 인터페이스)를 이용해서 의존성의 역전을 해결했고 Rgulate를 일반적인 것으로 만들었다.
- c++에서는 템플릿이 제공하는 다형성의 정적 형태를 사용할수도 있었다.

```c++
template <typename THERMOMETER, typename HEATER>
class Regulate(THERMOMETER& t, HEATER& h, double minTemp, double maxTemp) {
  for(;;) {
    while (t.Read() > minTemp) {
      wait(1);
      h.Engage()
    }

    while(t.Read() < maxTemp) {
      wati(1);
      h.Disengage();
    }
  }
}
```

- 이렇게 하면 동적 다형성의 부하(또는 유연성) 없이도 의존성 역전을 이룰 수 있다.
- 강제되는 것은 오직 HEATER 를 대체하는 클래스가 Engage 와 Disengage 메소드를 가져야 하고, THERMOMETER를 대체하는 클래스는 Read 함수를 가져야 한다는 것뿐이다.
- 정적 다형성은 소스 코드의 의존성을 깔끔하게 끊어주지만, 동적 다형성만큼 많은 문제를 해결해주지 않는다.
- 템플릿을 통한 단점은 다음과 같다.
  - HEATER와 THERMOMETER의 형이 런타임 시에 바뀔 수 없다.
  - 새로운 종류의 HEATER 와 THERMOMETER를 사용이 재컴파일과 재배포를 필요로 한다는 점이다.

## 결론

- 전통적인 절차 지향 프로그래밍 방식은 정책이 구체적인 것에 의존하는 의존성 구조를 만든다.
- 프로그램의 의존성이 역전되어 있다면 이것은 객체 지향 설계이며, 의존성이 역전되어 있지 않다면 절차적 설계다.
- 변경에 탄력적인 코드를 작성하는데 있어 결정적으로 중요하다.
- 추상화와 구체적 사항이 서로 분리되어 있기 때문에, 이 코드는 유지보수하기가 훨씬 쉽다.
