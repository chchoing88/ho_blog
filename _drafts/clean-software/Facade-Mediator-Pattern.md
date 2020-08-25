---
title: 퍼사드와 미디에이터 패턴
date: "2020-08-17T10:00:03.284Z"
tags:
  - javascript
  - OOP
keywords:
  - OOP
---

- 퍼사드 와 미디에이터 둘 다 어떤 종류의 정책을 다른 객체들의 그룹에 부과한다.
  - 퍼사드는 위로부터 정책을 적용
  - 미디에이터(mediator) 는 아래로부터 정책을 적용한다.
  - 퍼사드의 사용은 가시적이고 강제적인 반면, 미디에이터 사용자는 비가시적이고 허용적이다.

## 퍼사드 패턴

- 퍼사드 패턴은 복잡하고 일반적인 인터페이스를 가진 객체 그룹에 간단하고 구체적인 인터페이스를 제공하고자 할 때 사용한다.

```uml
DB <-- Application
ProducData <-- Application
DB <-- ProducData

java.sql <-- DB
```

- 위 uml 에서는 DB 클래스가 Application이 java.sql 패키지 안의 구체적인 내용을 알 필요가 없게끔 보호하고 있음을 주목하자.
- 이 DB 클래스는 java.sql 의 모든 일반성과 복잡성을 아주 간단하고 구체적인 인터페이스 뒤에 숨긴다.

- DB 같은 클래스는 ProductData 멤버들의 조작과 데이터베이스를 조작하는 적절한 질의와 명령을 구성하는 방법도 안다.

  - 이 모든 복잡성을 사용자에게 보이지 않도록 숨긴다.
  - Application 의 관점에서 보면, java.sql은 존재하지도 않는다. 퍼사드 뒤에 숨겨져 있는 것이다.

- 퍼사드 패턴 사용은 개발자가 '모든 데이터베이스 호출이 DB를 통과해야 한다'는 규정을 채택했다는 사실을 내포한다.
  - Application 에서 java.sql 로 바로 간다면, 이것은 규정을 위반하는 것이다.
  - 퍼사드는 자신의 정책을 Application에 적용한다. 규정에 의해 DB는 java.sql에 있는 기능들의 독점 중개인이 된다.

## 미디에이터 패턴

- 미디에이터 패턴도 역시 정책을 적용한다.
  - 그러나 퍼사드가 자신의 정책을 가시적이고 강제적인 방식으로 적용한다.
  - 미디에이터는 자신의 정책을 은밀하고 강제적이지 않은 방식으로 적용한다.

```java
// QuickEntryMediator.java
JTextField t = new JTextField();
JList l = new JList();

QuickEntryMediator qem = new QuickEntryMediator(t, l); // 이게 전부다.

public class QuickEntryMediator {
  public QuickEntryMediator(JTextField t, JList l) {
    itsTextField = t;
    itsList = l;

    itsTextField.getDocument().addDocumentListener(new DocumentListener() {
      public void changedUpdate() {
        textFieldChanged();
      }

      public void insertUpdate(DocumentEvent e) {
        textFieldChanged();
      }

      public void removeUpdate(DocumentEvent e) {
        textFieldChanged();
      }
    })
  }

  private void textFieldChanged() {
    // 요약
    itsList.clearSelection();
    itsList.getModel();
    itsList.setSelectedValue(o, true);


  }
}
```

- 위 클래스(QuickEntryMediator) 는 JTextField 하나와 JList 하나를 받는다.
- 이 클래스는 사용자가 JList 에 있는 항목들의 접두어(prefix)를 JTextField에 입력한다고 가정한다.
- JTextField의 현재 접두어와 일치하는 JList 의 첫 번째 항목을 자동적으로 선택한다.
- 만약 JTextField 가 null 이거나, 접두어가 JList 에 있는 어떤 원소와도 일치하지 않으면, JList의 선택은 지워진다.
- 이 객체를 호출하기 위한 방법은 없다. 그냥 생성하고, 잊어버리면 된다.

```uml
JList <-- QuickEntryMediator
JTextField <-- QuickEntryMediator

JTextField --> DocumentListener
QuickEntryMediator +--> DocumentListener
```

- QuickEntryMediator의 인스턴스는 JList 하나와 JTextField 하나를 생성된다.
- 이 QuickEntryMediator 는 익명 DocumentListener 를 JTextField 에 등록한다.
- 이 리스터는 텍스트에 변화가 있을 때마다 textFieldChanged를 호출한다. 그러면 이 메소드는 이 텍스트를 접두어로 같는 JList의 원소를 찾아 그것을 선택한다.
- JList 와 JTextField의 사용자는 이 미디에이터가 존재하는지 알지 못한다. 이것은 조용히 앉아 자신의 정책을 이들객체의 허락이나 인식 없이 적용한다.
- 결국 QuickEntryMediator 는 JList 와 JTextField 를 DocumentListener를 이용해서 조용히 중재하고 있는 역할만 하는거 같다.

## 결론

- 정책 적용이 크고 가시적이어야 하는 경우에는 퍼사드를 사용해 위로 부터 행해질 수 있다.
- 교묘함과 재량이 필요한 경우에는 미디에이터가 좀 더 나은 선택이 될 것이다.
- 퍼사드는 어떤 규정의 중심이 되며, 모든 사람은 그 아래에 있는 객체들이 아니라 이 퍼사드를 사용하기로 합의한다.
- 미디에이터는 사용자에게 감춰져 있다. 이것의 정책은 규정의 문제라기보다는 기정사실이다.
