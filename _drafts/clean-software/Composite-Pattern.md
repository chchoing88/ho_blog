---
title: 컴포지트 패턴
date: "2020-09-04T10:00:03.284Z"
tags:
  - javascript
  - OOP
keywords:
  - OOP
---

```uml
interface Shape

Shape <|-- Circle
Shape <|-- Square
Shape <|-- CompossiteShape

Shape <-- CompositeShape
```

- Shape 기반 클래스에는 Circle 과 Square 라는 이름의 파생 도형이 2개가 있다.
- 세번째 파생 클래스가 컴포지트인데 이 CompositeShape는 여러 Shape 인스턴스들의 목록을 갖고 있다.
- 이 CompositeShpae 의 draw() 가 호출되면 이 클래스는 자신의 목록에 ㄷ르어있는 모든 Shape 인스턴스들에게 이 메소드 수행을 위임한다.
- 따라서 시스템이 보기에는 CompositeShape 의 인스턴스는 그냥 일반 Shape 하나로 보인다.
  - 이는 Shape 를 받는 함수나 객체에 CompositeShape 를 전달 할 수도 있으며, 하는 행위도 Shape 와 똑같이 보일 것이다.
  - 하지만 CompositeShape 의 실체는 Shape의 인스턴스들 집합의 프록시 이다.

```java
publick interface Shape {
  public void draw();
}
```

```java
import java.util.Vector;

public class CompositeShape implements Shape {
  private Vector itsShapes = new Vector();
  public void add(Shape s) {
    itsShapes.add(s);
  }

  public void draw() {
    for (int i = 0; i < itsShapes.size(); i++) {
      Shape shape = (Shape) itsShapes.elementAt(i);
      shape.draw();
    }
  }
}
```

## 예제: 컴포지트 커맨드

- Sensor는 무엇을 감지하면 Command 의 do() 를 호출한다.
- 종이가 복사기 내부의 특정 지점에 도달하면 광학 센서가 작동한다. 그러면 이 센서는 특정 모터를 정지시키고 다른 모터를 실행 다음 클러치를 작동시킨다.

> 클러치란? 축과 축을 접촉하거나 차단하는데 사용하는 기계 부품

- 처음에는 모든 Sensor 클래스가 Command 객체의 목록을 유지해야 한다고 생각헀다. 하지만 Sensor가 모든 Command 객체를 동일하게 취급한다는 사실이다는 것이다.
- Sensor가 그저 목록을 순회하면서 각 Command 마다 단지 do() 만 호출한다든 뜻이다.

```uml
Sensor -->  "0.. *" Command
```

많은 Command를 포함하는 Sensor

```uml
Sensor --> Command
Command <|-- CompositeCommand
Commnad "0..*" <-- CompositeCommand
```

- 위 와 같이 함으로써 Sensor 나 Command를 변경할 필요 없이 Command에 복수성이라는 개념을 추가할 수 있었다.
- 이것은 OCP(개방폐쇄원칙) 적용의 한예이다.

## 다수성이냐 아니냐

- 우리는 Sensor는 하나도 변경하지 않고도 Sensor가 마치 여러 Command를 갖고 있는 것처럼 동작하게 만드는 데는 성공했다.
- 컴포지트를 사용한다고 몯느 일대다 관계를 일대일 관계로 되돌릴 수 있는 것은 아니다.
- 목록에 들어 있는 모든 객체가 동일하게 취급받을 때만 이것이 가능하다. 예를 들어, 직원 목록을 유지하면서 월급날이 오늘인 직원을 찾기 위해 그 목록을 검색한다면 아마 컴포지트 패턴을 사용해서는 안될 것이다. 이런 상황에서는 모든 직원을 동일하게 취급하지 않을 것이기 떄문이다.
- 그래도 컴포지트를 사용하면 우리 클래스의 클라이언트마다 목록 관리와 순환 코드가 중복해서 등장하는 대신, 그 코드가 컴포지트 클래스에서만 단 한번 나타나면 된다.
