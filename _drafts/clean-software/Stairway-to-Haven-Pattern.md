---
title: 천국으로의 계단 패턴
date: "2020-09-05T10:00:03.284Z"
tags:
  - javascript
  - OOP
keywords:
  - OOP
---

## 천국으로의 계단 패턴

- 천국으로의 계단은 프록시와 같은 `종속성 뒤집기의 효과`를 얻을 수 있는 또 다른 패턴이다. 이 패턴은 어댑터 패턴의 클래스 형식이 변형된 형태를 취하고 있다.

> 어뎁터 패턴 : A 라는 인터페이스를 상속할 수 없는 객체가 있다면 중간에 A 라는 인터페이스를 구현하는 어뎁터를 두고 실제 일은 상속할 수 없는 객체에 위임한다. 모든 의존 관계가 계속 올바른 방향을 가리키게 만든다.

```uml
PsersistentObject <|-- PersistentProduct
PersistentProduct <|-- PersistentAssembly
Product <|-- PersistentProduct
Assembly <|-- PersistentAssembly
Product <|-- Assembly
```

- PersistentObject는 데이터베이스에 대해 알고 있는 추상 클래스다.
- PersistentProduct는 데이터베이스에서 Product의 모든 데이터 필드를 읽거나 쓰기 위해, PersistentObject를 사용해 read와 write를 구현한다.
- 이와 같은 맥락에서 Assembly의 나머지 필드에 같은 일을 하기 위해 PersistentAssembly에 read와 write를 구현한다.

- 이 패턴은 다중 상속을 지원하는 언어에서만 쓸모가 있다.
- PersistentAssembly는 Product와 마름모꼴의 상속관계를 만들고 있다.

- 이 패턴의 장점은 데이터베이스의 정보를 애플리케이션의 업무 규칙과 완벽하게 분리한다는 것이다.

```cpp
PersistentObject* o = dynamic_cast<PersistentObject*> (product);
if(o) {
  o->write();
}
```

- 위 처럼 하면 읽기나 쓰기에 대해 알 필요가 없는 애플리케이션 부분이 계층 구조의 PersistentObject 쪽에 대해 완전히 독립적이 된다.

### '천국으로의 계단' 예

- 첫번째 예제는 PersistentProduct가 시스템에서 Product로서 돌아다닐 수 있고, PersistentObject로 변환되어 마음대로 쓰기 작업을 할 수 있음을 검증한다.
  - PersistentProduct가 간단한 XML 형식으로 자신을 수정한다고 가정한다.
- 두번째 테스트 케이스는 PersistentAssembly에 대해 똑같은 것을 검증하는데, Assembly 객체에 두 번째 필드를 추가한다는 점만 다르다.

```cpp
void ProductPersistenceTestCase::testWriteProduct() {
  ostrstream s;
  Product* p = new PersistentProduct("Cheerios");
  PersistentObject* po = dynamic_cast<PersistentObject*>(p);
  assert(po);
  po->write(s);
  char* writtenString = s.str();
  assert(strcmp("<PRODUCT><NAME>Cheerios</NAME></PRODUCT>", writtenString) == 0);
}

void ProductPersistenceTestCase::testWriteAssembly() {
  ostrstream s;
  Assembly* a = new PersistentAssembly("Wheaties", "7734");
  PersistentObject* po = dynamic_cast<PersistentObject*>(a);
  assert(po);
  po->write(s);
  char* writtenString = s.str();
  assert(strcmp("<ASSEMBLY><NAME>Wheaties</NAME><ASSYCODE>7734</ASSYCODE></ASSEMBLY>", writtenString) == 0);

}
```

- 다음은 Product와 Assembly의 정의와 구현을 보여준다.
- 보통의 애플리케이션에서라면 이 클래스는 업무 규측을 구현한 메소드를 포함하고 있을 것이다.
- `어느 클래스에서든 조금의 영속성도 찾아볼 수 없음에 주목하자.`
- `업무 규칙에서 영속성 메커니즘에 이르는 어떤 종속성도 존재하지 않는다. 이것이 이 패턴의 가장 중요한 부분이다.`

> 영속성 : 한 객체가 자신을 생성한 작업이 종료되었음에도 불구하고 지속적으로 존재하는 상태를 말한다.

```cpp
#ifndef STAIRWAYTOHEAVENPRODUCT_H
#define STAIRWAYTOHEAVENPRODUCT_H

#include <string>

class Product {
  public:
    Product(const string& name);
    virtual ~Product();
    const string& getName() const {
      return itsName;
    }

  private:
  string itsName;
};

#endif
```

```cpp
#include "product.h"

Product::Product(const string& name) : itsName(name) {
}

Product::~Product() {
}
```

```cpp
#ifndef STAIRWAYTOHEAVENASSEMBLY_H
#define STAIRWAYTOHEAVENASSEMBLY_H

#include <string>
#include "product.h"

class Assembly : public virtual Product {
  public:
    Assembly(const string& name, const string& assyCode);
    virtual ~Assembly();

    const string& getAssyCode() const {
      return itsAssyCode;
    }

  private:
    string itsAssyCode;
};

#endif
```

```cpp
#include "assembly.h"

Assembly::Assembly(const string& name, const string& assyCode)
  :Product(name), itsAssyCode(assyCode) {
}

Assembly::~Assembly() {
}
```

- 다음 코드는 종속성이라는 특징에서는 좋은 반면, Assembly는 virtual 키워드를 사용해 Product를 상속한다.
- 이것은 PersistentAssembly 에서 Product를 중복 상속하는 일이 없도록 하기 위해 필요 불가결한 작업이다.
- Assembly, PersistentProduct, PersistentObject가 이루는 상속 다이아몬드의 꼭대기에 Product가 있음을 알 수 있다.
- Product는 중복 상속을 막기 위해, 가상적으로 상속되어야 한다.

> virtual 키워드 : 포인터 변수의 자료형이 아닌 포인터가 가리키는 객체를 기준으로 호출함수를 결정한다.
> 가상 상속 : 다중 상속시에 기반이 되는 클래스를 중복해서 호출하게 되는데 이때, 기반이 되는 클래스를 가상으로 상속하게 되면 최종적으로 다중상속 받은 클래스에서 하나의 클래스로 인식하게 된는 기법이다.

- 다음은 PersistentObject의 정의와 구현을 보여준다.
  - `PersistentObject는 Product 계층 구조에 대해 아무것도 모르지만, XML을 쓰는 방법에 대해서는 뭔가 알고 있는 것처럼 보인다`는데 주목하자.
  - 적어도 먼저 헤더를 쓰고, 그 뒤에 필드를, 또 그 뒤에 푸터를 써서 객체를 작성한다는 사실은 알고 있는 것이다.
  - PersistentObject의 write 메소드는 템플릿 메소드 패턴(일반적인 알고리즘을 추상화 시켜서 추상 클래스로 빼고 상속받는 클래스에서 구체적인 로직을 구현)을 써서 모든 파생 객체의 쓰기 작업을 제어한다. 따라서 `천국으로의 계단 패턴의 영속성 있는 쪽은 PersistentObject 기반 클래스의 기능을` 이용한다.

```cpp
#ifndef STAIRWAYTOHEAVENPERSISTENTOBJECT_H
#define STAIRWAYTOHEAVENPERSISTENTOBJECT_H

#include <iostream>

class PersistentObject {
  public:
    virtual ~PersistentObject();
    virtual void write(ostream&) const;

  protected:
    virtual void writeFields(ostream&) const = 0;

  private:
    virtual void writeHeader(ostream&) const = 0;
    virtual void writeFooter(ostream&) const = 0;
};

#endif
```

```cpp
#include "persistentObject.h"

PersistentObject::~PersistentObject() {
}

void PersistentObject::write(ostream& s) const {
  writeHeader(s);
  writeFields(s);
  writeFooter(s);
  s << ends;
}
```

- 다음은 PersistentProduct의 구현을 보여준다.
  - 이 클래스는 Product를 위한 XML 코드를 새엇ㅇ하는데 필요한 writeHeader, writeFooter, writeField 함수를 구현한다.
  - 이것은 Product에서 필드와 접근 메소드를 상속하고, 기반 클래스 PersistentOjbect의 write 메소드에 의해 동작한다.

```cpp
#ifndef STAIRWAYTOHEAVENPERSISTENTPRODUCT_H
#define STAIRWAYTOHEAVENPERSISTENTPRODUCT_H

#include "product.h"
#include "persistentObject.h"

class PersistentProduct : public virtual Product, public PersistentObject
{
  public:
    PersistentProduct(const string& name);
    virtual ~PersistentProduct();

  protected:
    virtual void writeFields(ostream& s) const;

  private:
    virtual void writeHeader(ostream& s) const;
    virtual void writeFooter(ostream& s) const;
};

#endif
```

```cpp
#include "persistentProduct.h"

PersistentProduct::PersistentProduct(const string& name) : Product(name) {
}

PersistentProduct::~PersistentProduct() {
}

void PersistentProduct::writeHeader(ostream& s) const {
  s << "<PRODUCT>";
}

void PersistentProduct::writeFooter(ostream& s) const {
  s << "</PRODUCT>";
}

void PersistentProduct::writeFields(ostream& s) const {
  s << "<NAME>" << getName() << "</NAME>";
}
```

- 마지막으로, PersistentAssembly가 Assembly와 PersistentProduct를 통합하는 방법을 보여준다.
  - 여기서도 writeHeader, writeFooter, writeFields를 오버라이드 한다.
  - 그러나 여기서는 PersistentProduct::writeFields를 호출하기 위해 writeFields를 구현한다. 
  - 따라서 Assembly의 Product 부분에 쓰기 작업을 할 수 있는 기능을 PersistentProduct에서 상속받게 되고, Assembly에서 Product와 Assembly의 필드와 접근 메소드들 상속받는다.

```cpp
#ifndef STAIRWAYTOHEAVENPERSISTENTASSEMBLY_H
#define STAIRWAYTOHEAVENPERSISTENTASSEMBLY_H

#include "assembly.h"
#include "persistentProduct.h"

class PersistentAssembly : public Assembly, public PersistentProduct {
  public:
    PersistentAssembly(const string& name, const string& assyCode);
    virtual ~PersistentAssembly();

  protected:
    virtual void writeFields(ostream& s) const;

  private:
    virtual void writeHeader(ostream& s) const;
    virtual void writeFooter(ostream& s) const;
};

#endif
```

```cpp
#include "persistentAssembly.h"

PersistentAssembly::PersistentAssembly(const string& name, const string& assyCode)
  :Assembly(name, assyCode), PersistentProduct(name), Product(name) {
}

PersistentAssembly::~PersistentAssembly() {
}

void PersistentAssembly::writeHeader(ostream& s) const {
  s << "<ASSEMBLY>";
}

void PersistentAssembly::writeFooter(ostream& s) const {
  s << "</ASSEMBLY>";
}

void PersistentAssembly::writeFields(ostream& s) const {
  PersistentProduct::writeFields(s);
  s << "<ASSYCODE>" << getAssyCode() << "</ASSYCODE>";
}
```

### 천국으로의 계단 결론

- 천국으로의 계단 패턴이 많은 상황에서 쓰여 좋은 결과를 내는 모습을 바왔다. 반면, 구현의 중복 상속을 지원하는 C++ 같은 언어 사용을 필요로 한다.

## 데이터베이스와 함께 쓰일 수 있는 그 밖의 패턴

### 확장 객체

- 확장된 객체를 데이터베이스에 기록하는 방법을 알고 있는 확장 객체가 있다고 생각해보자.
- 이런 객체를 기록하기 위해서는 "Database" 키워 일치하는 확장 객체를 요청한 후, 그것을 DatabaseWriterExtension으로 캐스트하고 write 함수를 호출해야 한다.

```cpp
Product p = /* Product를 반환하는 어떤 함수 */
ExtensionObject = p.getExtension("Database");
if( e != null) {
  DatabaseWriterExtension dwe (DatabaseWriterExtension) e;
  e.write();
}
```

### 비지터

- 방문을 받은(visited) 객체를 데이터베이스에 기록하는 방법을 알고 있는 비지터 계층 구조를 생각해보자.
- 프로그래머는 적절한 자료형의 비지터를 생성하고, 기록할 객체에서 accept를 호출하여 데이터베이스에 객체를 기록할 것이다.

### 데코레이터

- 데이터베이스를 구현하기 위해 데코레이터를 쓰는 방법에는 두 가지가 있다.
- 첫번쨰 방법, 업무 관련 객체를 장식(decorate) 하고 그것에 read 와 write 메소드를 줄 수도 있다.
- 두번째 방법, 자신을 읽고 쓰는 방법을 알고 있는 데이터 객체를 장식하고 그것에 업무 규칙을 줄 수도 있다.
- 두번째 방법은 객체 지향 데이터베이스를 쓸 때는 보기 드문 방법이다.

### 퍼사드

- 단순하면서도 효과적이지만 단점으로는 업무 규칙 객체를 데이터베이스와 연결한다는 점을 들 수 있다.
- DatabaseFacade 클래스는 단순히 필수적인 객체에 대한 읽기 쓰기 메소드만 제공한다.
- 이 객체들을 DatabaseFacade에 상호 결합시킨다. 이런 객체는 종종 read와 write 함수를 호출하기 때문에 퍼사드에 대해 알고 있으며, 퍼사드는 read와 write 함수를 구현하기 위해 이들의 접근 메소드와 변경 메소드를 사용해야 하기 때문에 객체에 대해 알고 있다.
- 작은 애플리케이션에 효과적이며, 퍼사드를 사용해서 시작한뒤에 나중에 결합을 줄이기 위해 다른 패턴으로 바꾸기 결심한다 해도 퍼사드는 리팩토링하기가 아주 쉽다.

## 프록시 및 천국으로의 계단 결론

- 프록시나 '천국으로의 계단'이 필요할 것이라는 예상은 매우 매력적이다.
- 일단 퍼사드로 시작하고, 필요하면 리팩토링할 것을 권한다. 그렇게 하면 소중한 시간을 아끼고 문제를 줄일 수 있을 것이다.