---
title: 리스코프 치환 원칙
date: "2020-08-11T10:00:03.284Z"
tags:
  - javascript
  - OOP
keywords:
  - OOP
---

리스코프 치환 원칙(`LSP`: Liskov Subsitution Principle) 은 다음과 같이 설명할 수 있다.

> 서브타입(subtype)은 그것의 기반 타입(base type)으로 치환 가능해야 한다.

- 이것을 위반한 결과를 생각해보면 분명해진다.
  - 어떤 함수 f 가 그 인자로 어떤 기반 클래스 B의 참조값을 갖는다고 생각해보자.
  - 그리고 클래스 B의 파생 클래스 D를 B를 가장해 함수 f 에 넘겼다고 생각해보자.
  - 이때, f 가 잘못된 동작을 하게 만든다면 이 경우 D는 LSP를 위반한다.

## LSP 위반의 간단한 예

```c++
void DrawShape(const Shape& s) {
  if(s.itsType == Shape :: square) {
    static_cast<const Square&>(s).Draw();
  } else if (s.itsType == Shape :: circle) {
    static_cast<const Circle&>(s).Draw();
  }
}
```

- DrawShape 함수는 OCP를 위반한다.
- DrawShape 함수는 Shape 클래스의 모든 가능한 파생 클래스를 알아야 하고, 또한 Shape의 새로운 파생 클래스가 생길 때마다 변경 되어야 한다.
- Square 와 Circle이 Shape를 대체할 수 없다는 것은 LSP 위반이며, 이 위반은 DrawShape 의 OCP(개방폐쇄원칙: 소프트웨어 개체는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 한다.) 위반을 유발한다.

## 정사각형과 직사각형, 좀 더 미묘한 위반

```c++
class Rectangle {
  public:
    void SetWidth() {}
    void SetHeight() {}
    double GetHeight() const {}
    double getWidth() const {}
  private :
    Point itsTopLeft;
    double itsWidth;
    double itsHeight;
}
```

- Rectangle 클래스를 사용하는 어떤 애플리케이션을 생각해보자.
- 어느날, 사용자가 직사각형은 물론 정사각형(square)도 조작할 수 있게 해달라고 요구해왔다.
- 종종 상속은 IS-A(~이다) 관계라고 한다. 즉, 새로운 종류의 객체가 원래 종류의 객체와 IS-A 관계를 이룬다고 말할 수 있다면, 새 객체의 클래스는 원래 객체의 클래스에서 파생될 수 있어야 한다.
- 일반적인 개념상, 모든 정사각형은 직사각형이다. 따라서 아래와 같은 그림이 합리적이다.

```uml
Rectangle <|-- Square
```

Square는 Rectangle을 상속한다.

- 그러나 이런 식의 생각은 미묘하지만 심각한 문제를 낳을 수 있다. 일반적으로 이런 문제는 코드에서 보게 되기 전까지는 예측할 수 없다.
- 첫번쨰 증거는 Square가 itsHeight 와 itsWidth 멤버 변수를 필요로 하지 않는다는 사실이다.
- 다른 문제는 Square는 SetWidth 와 SetHeight 함수를 상속하는데, 정사각형의 가로와 세로 길이는 같으므로 이 함수들은 Square에서는 부적절하다.
- 함수들을 오버라이드 한다고 해도 다음과 같은 문제가 생겨날 수 있다.

```c++
void f(Rectangle & r) {
  r.SetWIdth(32) // Reactangle::SetWidth 를 호출한다.
}
```

- 만약 어떤 Square 객체에 대한 참조값을 이 함수에 넘겨준다면, 그 Square 객체는 세로 값이 가로 값에 맞춰 바뀌지 않기 때문에 문제가 생긴다. 이것은 명백한 LSP 위반이다.
- 이 문제는 virtual로 쉽게 고칠수 있지만 파생 클래스를 만드는 것이 기반 클래스의 변경으로 이어질때, 설계에 결점이 있음을 의미한다.

## 본질적인 문제

```c++
void g(Rectangle& r) {
  r.SetWidth(5);
  r.SetHeight(4);
  assert(r.Area() == 20);
}
```

- 위 함수를 보자 본직적인 문제는 **g의 작성자는 Rectangle의 가로 길이를 바꾸는 것이 세로 길이를 바꾸지는 않을 것이라고 생각한다는데 있다.**
- 함수 g는 Square/Reactangel 계층 구조에 대해 취약하다.
- Square 와 Rectangle 사이의 관계는 LSP를 위반한다.
- 불변식을 위반한 것은 Square의 제작자이다.
- Square 작성자는 Square 의 불변식을 위반하지 않았다. Rectangle에서 Square를 파생시킴으로써 Rectangle의 불변식을 위반하게 되었다.

## 유효성은 본래 갖추어진 것이 아니다.

- LSP는 '모델만 별개로 보고, 그 모델의 유효성을 충분히 검증할 수 없다.' 라는 아주 중요한 결론을 내린다.
- 어떤 모델의 유효성은 오직 그 고객의 관점에서만 표현될 수 있다.
- 예를 들면 Square 와 Rectangle 클래스를 각각 별개로 검사한다면 자체 모순이 없고 유효하다는 결론을 내릴 것이다.
- 그러나 기반 클래스에 대해 합리적인 가정을 택한 이 기반 클래스를 사용하는 고객 프로그래머의 관점에서 이 클래스들을 본다면 이 모델은 깨지고 만다.
- 그 설계를 사용자가 택한 합리적인 가정의 관점에서 봐야한다. (단위 테스트에서 이런 합리적인 가정 문제가 나타난다.)
- 이것을 예상하려고 시도 하지 말고 관련된 취약성의 악취를 맡을 떄까지 명백한 LSP위반을 제외한 나머지 처리는 연기하자.
