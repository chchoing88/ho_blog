---
title: 팩토리 패턴
date: "2020-08-25T10:00:03.284Z"
tags:
  - javascript
  - OOP
keywords:
  - OOP
---

- 의존 관계 역전 원칙(DIP)에 따르면 구체 클래스에 위존하는 것은 피하고 추상 클래스에 의존하는 것을 선호해야 한다.
  - 구체 클래스가 쉽게 변경되는 종류일 경우 특히 그렇다.
- 하지만 DIP 위반이 거의 해롭지 않은 경우도 있다. 구체 클래스가 쉽게 변경되는 종류의 클래스가 아니라면, 그 클래스에 의존하는 것이 그렇게 걱정거리가 되지는 않는다.
- 애플리케이션을 한창 개발하는 중이라면, 매우 변경되기 쉬운 구체 클래스들이 많이 생긴다.
  - 이런 구체 클래스들에 의존하는 것은 문제가 있으며, 대부분의 변경에 영향을 받지 않도록 추상 인터페이스에 의존하는 편이 낫다.

- 팩토리 패턴을 사용하면 추상 인터페이스에만 의존하면서도 구체적 객체들의 인스턴스를 만들 수 있으므로, 한창 개발하느라 생성할 구체 클래스의 변경이 잦을 떄 이 패턴이 큰 도움이 된다.

- 다음은 문제가 되는 시나리오 UML 이다.

```uml
interface Shape

SomeApp <-- Shape
Shape <|-- Square
Shape <|-- Circle

SomeApp <.. Square : <<creates>>
SomeApp <.. Circle : <<creates>>
```

- Shape 인터페이스에 의존하는 SomeApp 클래스는 오직 Shape 인터페이스를 통해서만 여러 Shape 인스턴스들을 사용한다.
- UML은 불행하게도 SomeApp 은 Square 와 Circle의 인스턴스를 직접 생성하기 때문에, 구체 클래스인 Square 와 Circle에게 의존하게 된다.

- SomeApp에 팩토리 패턴을 적용하면 이 문제점을 고칠 수 있다.

```uml
interface Shape
interface ShapeFactory

SomeApp <-- Shape
SomeApp <-- ShapeFactory

Shape <|-- Square
Shape <|-- Circle

ShapeFactory <|-- ShapeFactoryImplementation

ShapeFactoryImplementation <.. Square : <<creates>>
ShapeFactoryImplementation <.. Circle : <<creates>>
```

- ShapeFactory 인터페이스가 등장하는데, 이 인터페이스에는 makeSquare 와 makeCircle 두 메소드가 있다.
  - makeSquare apthemsms Square의 인스턴스를 생성하고, makeCircle 은 Circle의 인스턴스를 생성한다.
  - 하지만 두 메소드가 생성한 인스턴스를 반환할 때는 `모두 Shape 타입`으로 해서 반환한다.

```java
// ShapeFactory.java
public interface ShapeFactory {
  public Shape makeCircle();
  public Shape makeSquare();
}
```

```java
// ShapeFactoryImplementation.java
public class ShapeFactoryImplementation implements ShapeFactory {
  public Shape makeCircle()
  {
    return new Circle();
  }

  public Shape makeSquare()
  {
    return new Square();
  }
}
```

- 이렇게 하면 구체 클래스에 의존하는 문제점이 완전하게 해결됨을 알 수 있다.
- 애플리케이션 코드는 더 이상 Circle 이나 Square에 의존하지 않으면서도 이 두 클래스의 인스턴스는 계속 생성할 수 있다.
- 애플리케이션은 Square 나 Circle 한 곳에만 있는 메소드는 전혀 호출하지 않는다.
- ShapeFactoryImplementation 자체는 아마 main 함수에서 생성되거나 main 함수에 딸린 초기화 함수에서 생성될 것이다.

## 의존 관계 순환

- 위 형태의 팩토리 패턴에는 문제가 있다.
- ShapeFactory 클래스는 Shap 의 파생형마다 메소드가 하나씩 있다. 이렇게 할 경우 Shape에 새로운 파생형을 추가하는 일이 매우 어렵게 만들지도 모르는 의존 관계 순환이 생길 수 있다.
- Shape의 파생형이 추가 된다는 것은 ShapeFactory 에 새로운 메소드를 추가를 하게 되고 이는 클래스를 재컴파일하고 재배포해야 한다는 의미가 된다.

<br />

- ShapeFactory에 Shape 파생형마다 메소드를 하나씩 만드는 대신, String을 받는 make 함수 하나만 만들면 된다.
- 이 기법을 사용하려면 ShapeFactoryImplementation 이 들어오는 인자를 가지고 어떤 Shape 파생형을 인스턴스화해야 할지 결정하기 위해 연쇄적으로 if/else 문을 사용해야 한다.

```java
// 원을 생성하는 코드 조각
 public void testCreateCircle() throws Exception {
  Shape s = factory.make("Circle");
  assert(s instanceof Circle);
}
```

```java
public interface ShapeFactory {
  public Shape make(String shapeName) throws Exception;
}
```

```java
public class ShapeFactoryImplementation implements ShapeFactory {
  public Shape make(String shapeName) throws Exception
  {
    if (shapeName.equals("Circle"))
      return new Circle();
    else if (shapeName.equals("Square"))
      return new Square();
    else
      throw new Exception("ShapeFactory cannot create " + shapeName);
  }
}
```

- Shape 파생형의 이름을 잘못 쓴 호출자가 컴파일 에러 대신 런타임 에러를 받게 되기 때문에, 이렇게 하면 위험하다고 주장하는 사람도 있을지 모른다.
  - 하지만 적절한 수의 단위 테스트가 있고 테스트 주도적 개발을 적용한다면 런타임 에러가 문제가 되기 전에 미리 잡을 수 있을 것이다.

## 대체할 수 있는 팩토리

- 팩토리를 사용해서 가장 큰 장점은, 어떤 팩토리의 구현을 다른 구현으로 대체할 수 있다는 점이다.
- 그럼으로써 애플리케이션 안에 있는 객체들의 집합 하나를 다른 집합으로 통째로 대체할 수 있다.

- 다양한 데이터베이스 구현에 모두 잘 적응해야하는 애플리케이션을 하나 예를 들자.
- 프록시 패턴(어떤 특정한 종류의 데이터베이스에서 어떤 특정한 객체를 읽는 법을 아는 클래스 정도) 애플리케이션과 데이터베이스 구현을 분리할 수도 있을 것이다.
- 그리고 이 프록시들을 인스턴스화 하기 위해 팩토리들을 사용할 수도 있을 것이다.

- EmployeeFactory 에서 하나는 일반 파일을 대상으로 작업하는 프록시를 만들고, 다른 하나는 Oracle 을 대상으로 작업하는 프록시들을 만든다.
- 애플리케이션 자체는 어떤 것이 사용되는지 모르거나, 알더라도 상관하지 않는다는 점에도 주목하자.

## 테스트 픽스처를 위해 팩토리 사용하기

- 단위 테스트를 작성할 때, 어떤 모듈의 행위를 그 모듈이 사용하는 다른 모듈들과 분리된 상태에서 테스트하고 싶은 경우가 종종 있다.
- 예를 들어, 데이터베이스를 사용하는 Payroll 애플리케이션이 있다고 생각해보자. 여기서 데이터베이스를 전혀 사용하지 않고 Payroll 모듈의 기능을 테스트해보고 싶을 수 있다.

```uml
Payroll --> Database
```

- 이것은 데이터베이스의 추상 인터페이스를 사용해서 이룰 수 있다.
- 추상 인터페이스의 구현 하나는 실제 데이터베이스를 사용하고, 다른 하나는 데이터베이스 행위를 흉내 낸다.
- 그리고 데이터베이스로 들어오는 호출이 올바른지 검사하기 위해 테스트 코드를 작성하면 된다.

```uml
interface Database

Payroll --> Database
Payroll <-- PayrollTest
Database <|-- PayrollTest

Database <|-- DatabaseImplementation
```

PayrollTest 가 Database를 스푸핑 한다.

- PayrollTest 모듈은 PayrolModule dprp 호출을 보냄으로써 이 모듈을 테스트한다. 
- PayrollTest 는 Payroll이 데이터베이스에 보내는 호출을 잡기 위해 Database 인터페이스도 구현하는데, 이러면 Payroll이 올바로 동작하는지 PayrollTest 가 보장할 수 있게 된다.
- 이렇게 하면 여러 종류의 데이터베이스 에러나 문제도 PayrollTest 가 흉내 내볼 수 있다. 
- 이것을 `스푸핑(spoofing, 위장)` 이라는 이름으로 알려져 있는 기법이다.



## 팩토리 사용이 얼마나 중요한가?

- 보통 팩토리를 사용하지 않고 시작하며, 팩토리의 필요성이 충분히 커지면 그제야 시스템에 팩토리를 도입한다.
- 예를 들어, 프록시 패턴을 사용해야만 하게 된다면 영속적인 객체들을 생성하기 위해 팩토리도 사용해야만 할 것이다.
- 다른 예를 들어, 다른 객체를 생성하는 어떤 객체가 있다고 할 때, 단위 테스트를 하는 동안 이 객체를 스푸핑해야만 하는 상황도 종종만나게 된다. 그러면 아마 팩토리를 쓰게 될 것이다.
- 어떤 경우라도 팩토리가 당연히 필요할 것이라고 가정하고 시작하지 않는다.
- 언제나 팩토리를 기본으로 사용한다면 설계를 확장하기가 급격히 어려워진다.
- 팩토리를 사용해서 새로운 클래스를 만들려면 새로 만들 클래스와 그 팩토리의 인터페이스 클래스 2개, 그리고 이 인터페이스 2개를 구현하는 구체 클래스 2개, 모두 합해 4개나 새로 만들어야 한다.

## 결론

- DIP를 지키려고 할 때 큰 도움이 되기도 한다.
- 높은 차원의 정책 모듈이 클래스들의 구체적인 구현에 의존하지 않고도 그 클래스들의 인스턴스를 생성하게 해주기도 한다.
- 그리고 어떤 클래스 무리를 오나전히 다른 클래스 무리로 교체하는 일도 가능하게 만든다.
- 팩토리는 피하려면 피할 수도 있는 복잡함이다. 기본으로 팩토리를 사용하는 것이 최선의 방법인 경우는 드물다.
