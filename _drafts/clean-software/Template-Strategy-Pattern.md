---
title: 템플릿 메소드와 스트래터지 패턴
date: "2020-08-17T10:00:03.284Z"
tags:
  - javascript
  - OOP
keywords:
  - OOP
---

- 상속을 이용하면 차이에 의한 프로그래밍을 할 수 있었다.

  - 즉, 뭔가 유용한 일을 해주는 어떤 클래스가 이미 있다면, 그것의 서브클래스를 만들고 마음에 들지 않는 일부분만 수정하면 되었다.
  - 단지 클래스를 상속하는 것만으로 코드를 재사용할 수 있게 된것이다.
  - 각 단계가 그 위 단계의 코드를 재사용하는 소프트웨어 구조의 전체 분류 체계를 만들 수도 있었다.

- 1995년, 상속은 너무 지나치게 사용되었고 이런 과도한 사용은 아주 비싼 대가를 지불했다.

  - 감마, 헬름, 존슨, 블리시데스는 `클래스 상속보다는 차라리 복합(composition)이 더 낫다` 라고 강조했다.
  - 그래서 상속을 사용하는 대신 경우에 따라 복합이나 위임으로 대체했다.

- 템플릿 메소드는 문제를 해결하기 위해 상속을 사용하는 반면, 스트레터지는 위임을 사용한다.
- 템플릿 메소드와 스트래터지는 둘 다 구체적인 내용으로부터 일반적인 알고리즘을 분리하는 문제를 해결하는 패턴이다.
- 의존 관계 역전 원칙(DIP)을 따르기 위해서는 이 일반적인 알고리즘이 구체적 구현에 의존하지 않도록 해야 하며, 일반적인 알고리즘과 구체적인 구현이 추상화에 의존하게 해야 한다.

## 템플릿 메소드 패턴

- 지금까지 모든 프로그램에 대해 생각해보자. 다음과 같은 기본적인 메인 루프 구조로 이루어져 있을 것이다.

```java
Initialize();
while(!done()) { // 메인루프
  Idle() // 뭔가 유용한 일을 한다.
}
Cleanup();
```

- 이 구조는 작성하려는 모든 프로그램에서 이 클래스를 재사용할 수 있다.

```java
public class ftocraw() {
  public static void main(String[] args) throws Exception {
    // 초기화
    while(!done) {
      // 메인 루프에서 주된 일
    }
    System.outprintLn("ftoc exit"); // 종료
  }
}
```

- 이 프로그램에는 메인 루프 구조의 모든 구성 요소가 들어있다.

  - 초기화를 하고, 메인 루프에서 주된 일을 하고, 정리를 한 뒤 종료한다.

- 템플릿 메소드 패턴을 적용하면 이 기본 구조를 ftoc 프로그램에서 분리해낼 수 있다.
- 이 프로그램은 모든 일반적인 코드를 추상 기반 클래스에 구현되어 있는 메소드 하나에 집어넣는다.

```java
public abstract calss Application {
  private boolean isDone = false;

  protected abstract void init();
  protected abstract void idle();
  protected abstract void cleanup();

  protected void setDone() {
    isDone = true;
  }

  protected boolean done() {
    return isDone;
  }
  public void run() {
    init();
    while (!done()) {
      idle();
    }
    cleanup();
  }
}
```

- 이 클래스는 일반적인 메인 루프 애플리케이션을 묘사하고 있다.
- Application을 상속해서 추상 메소드들의 내용을 채워 넣는 것만으로 ftoc 클래스를 다시 작성할 수 있다.

### 패턴 오용

- 다시 작성을 했다면, 이렇게 생각했을 것이다.

  - 아무도 이득도 안되고 문제를 너무 복잡하게 만들 뿐이다.
  - 실제로 ftoc를 이렇게 만들기를 권하지는 않는다.

- 이렇게 특정 애플리케이션에 템플릿 메소드를 사용하는 것은 바람직하지 않다.

  - 프로그램이 복잡해지고 내용만 더 늘어날 뿐이다.
  - 실제 애플리케이션에서는 무익한 일이다.

- 디자인 패턴으로 많은 설계 문제를 해결할 수 있다.
  - 그러나 디자인 패턴이 존재한다는 사실 자체가 항상 디자인 패턴을 사용해야 한다는 뜻은 아니다.

### 버블 정렬

```java
public class BubbleSorter {
  static int operations = 0;

  public static int sort(int[] array) {
    // 2개 씩 비교해서 제일 작은 수를 가장 왼쪽에 옮겨두고 다시 한바퀴 돈다.
    // 반대로 하면 2개씩 비교해서 제일 큰수를 가장 오른쪽에 옮겨두고 다시 한바뀌 돈다.
    // length === 8 일때, 7,6,5,4,3,2,1 번 swap 해야한다.

    // 이중 for 문
    // compareAndSwap() 진행
    operations = 0;
    if (array.length <= 1)
      return operations;

    for (int nextToLast = array.length-2; nextToLast >= 0; nextToLast--)
      for (int index = 0; index <= nextToLast; index++)
        compareAndSwap(array, index);

    return operations;
  }

  private static void swap(int[] array, int index) {
    // swap 진행
     int temp = array[index];
    array[index] = array[index+1];
    array[index+1] = temp;
  }

  private static void compareAndSwap(int[] array, int index) {
    // 왼쪽에 있는 수가 더 크다면 swap() 진행
    if (array[index] > array[index+1])
      swap(array, index);
    operations++;
  }
}
```

- BubbleSorter 클래스는 버블 정렬 알고리즘을 이용하여 정수의 배열을 정렬하는 방법을 알고 있다.

  - sort 메소드는 버블 정렬을 수행하는 알고리즘을 포함한다.
  - swap, compareAndSwap 이라는 2개의 보조적인 메소드는 정수와 배열의 구체적인 부분을 다룬다.

- 템플릿 메소드 패턴을 사용하면 `버블 정렬 알고리즘을 따로 떼어 BubbleSorter라는 이름의 추상 기반 클래스에 집어 넣을` 수 있다.
  - BubbleSorter는 outOfOrder와 swap이라는 추상 메소드를 호출하는 sort 함수의 구현을 포함한다.
  - outOfOrder 메소드는 배열에서 인접한 2개의 원소를 비교하여 그 원소의 순서가 잘못되어 있으면 true를 반환하는 메소드다.
  - swap 메소드는 배열에서 2개의 인접 원소를 교환하는 메소드다.

- sort 메소드는 배열에 대해 알지 못하고, 그 배열에 어떤 형의 객체가 저장되어 있는지도 신경 쓰지 않는다.
  - 그저 배열의 여러 인덱스에 대해 outOfOrder 를 호출하고, 그 인덱스가 교환 되어야 하는지 아닌지를 판정한다.

```java
public abstract class BubbleSorter {
  private int operations = 0;
  protected int length = 0;

  protected int doSort() {
    operations = 0;
    if (length <= 1)
      return operations;

    for (int nextToLast = length-2; nextToLast >= 0; nextToLast--)
      for (int index = 0; index <= nextToLast; index++)
      {
        if (outOfOrder(index))
          swap(index);
        operations++;
      }

    return operations;
  }

  protected abstract void swap(int index);
  pretected abstract boolean outOfOrder(int index);
}
```

- 이제 BubbleSorter로 다른 어떤 종류의 객체든 정렬할 수 있는 간단한 파생 클래스를 만들 수 있다.
  - 예로 IntBubbleSorter를 만들 수 있는데, 이 클래스는 정수 배열을 정렬한다.
  - DobuleBubbleSorter는 double 형의 배열을 정렬한다.

```uml
BubbleSorter <|-- IntBubbleSorter
BubbleSorter <|-- DobuleBubbleSorter
```

```java
// IntBubbleSorter.java
public class IntBubbleSorter extends BubbleSorter {
// BubbleSorter 추상 메소드 구현
}
```

```java
// DoubleBubbleSorter.java
public class DoubleBubbleSorter extends BubbleSorter {
// BubbleSorter 추상 메소드 구현
}
```

- 템플릿 메소드 패턴은 객체 지향 프로그래밍에서 고전적인 재사용 형태 중의 하나를 보여준다.
- 일반적인 알고리즘은 기반 클래스에 있고, 다른 구체적인 내용에서 상속된다.

- 이 기법은 비용을 수반한다. `상속은 아주 강한 관계여서, 파생 클래스는 필연적으로 기반 클래스에 묶이게 된다.`
  - 예를 들어, IntBubbleSorter 의 outOfOrder 와 swap 함수는 다른 종류의 정렬 알고리즘에서도 필요로 하는 것이다.
  - 그럼에도 불구하고 이 `다른 정렬 알고리즘에서 outOfOrder 와 swap 을 재사용할 방법이 없다.`
  - BubbleSorter 를 상속함으로써, IntBubbleSorter 의 운명이 영원히 BubbleSorter 와 묶이게끔 결정해버린 것이다.

## 스트래터지 패턴

- 스트래터지 패턴은 일반적인 알고리즘과 구체적인 구현 사이의 의존성 반전 문제를 완전히 다른 방식으로 풀어낸다.
  - 일반적인 알고리즘(구체적인 구현 말고 추상적인 알고리즘)을 추상 기반 클래스에 넣는 대신, ApplicationRunner 라는 이름의 구체 클래스에 넣는다.
  - Application 이란 이름의 인터페이스 안에서 일반적 알고리즘이 호출해야 할 추상 메소드를 정의한다.
  - 이 인터페이스에서 ftocStrategy를 파생시켜 ApplicationRunner에 넘겨준다.
  - 그러면 ApplicationRunner는 이 인터페이스에 위임한다.

```uml
Application <|-- ftocStrategy
ApplicationRunner --> Application
```

```java
// ApplicationRunner.java
public class ApplicationRunner {
  private Application itsApplication = null;

  public ApplicationRunner(Application app) {
    itsApplication = app; // 합성 관계 아닐까???
  }

  public void run() {
    itsApplication.init();
    while(!itsApplication.done()) {
      itsApplication.idle();
    }
    itsApplication.cleanup();
  }
}
```

```java
// Application.java
public interface Application {
  public void init();
  public void idle();
  public void cleanup();
  public void done();
}
```

```java
// ftocStrategy.java
public class ftocStrategy implements Application {
  public static void main(String[] args) throws Exception {
    (new ApplicationRunner (new ftocStrategy())).run();
  }

  public void init() {
    // 구현
  }

  public void idle() {
    // 구현
  }

  public void cleanup() {
    // 구현
  }

  public boolean done() {
    // 구현
  }

  private String readLineAndReturnNullIfError() {
    // 구현
  }
}
```

- 스트래터지에는 템플릿 메소드보다 더 많은 전체 클래스 개수와 더 많은 간접 지정(indirection)이 있다.

  - ApplicationRunner 내부의 위임 포인터는 실행 시간과 데이터 공간 면에서 상속의 경우보다 좀 더 많은 비용을 초래한다.
  - 반면, 서로 다른 많은 애플리케이션을 실행한다면 ApplicationRunner 인스턴스를 재사용하여 Application의 다른 많은 구현에 이것을 넘겨줄 수 있을 테고, 그럼으로써 일반적인 알고리즘과 그것이 제어하는 구체적인 부분 사이의 결합 정도를 감소시킬 수 있다.

- 일반적인 경우에 가장 걱정할 만한 것은 스트래터지 패턴이 필요로 하는 별도의 클래스다.

### 다시 정렬하기

- 스트래터지 패턴을 사용한 버블 정렬 구현을 생각해보자.

```java
public class BubbleSorter {
  public BubbleSorter(SortHandle handle) {
    itsSorHandle = handle;
  }

  // 일반적인 알고리즘 (구체적인 구현이 아닌 추상적인 알고리즘)
  public int sort(Object array) {
    for(int nextToLast = length - 2; nextToLast >= 0; nextToLast--) {
      for(int index = 0; index <= nextToLast; index++) {
        if(itsSortHandle.outOfOrder(index)) {
          itsSortHandle.swap(index);
        }
        operation++;
      }
    }

    return operations;
  }
}
```

```java
public interface SortHandle {
  public void swap(int index);
  public boolean outOfOrder(int index);
  public int length();
  public void setArray(Object array);
}
```

```java
// IntSortHandle.java
public class IntSortHandle implements SortHandle {
  public void swap(int index) {
    // 구현
  }

  public void setArray(Object array) {
    this.array = (int[]) array;
  }

  public int length() {
    return array.length;
  }

  public boolean outOfOrder(int index) {
    return (array[index] > array[index + 1])
  }
}
```

- IntSortHandle 클래스가 BubbleSorter 에 대해 아무것도 모른다는 점에 주목하자.

  - 이 클래스는 버블 정렬 구현부에 어떤 의존성도 갖고 있지 않는데, 이것은 템플릿 메소드에서는 없었던 일이다.
  - 템플릿 메소드에서 보면 IntBubbleSorter 가 직접적으로 BubbleSorter, 즉 버블 정렬 알고리즘을 포함한 클래스에 의존하고 있음을 볼 수 있다.

- 템플릿 메소드를 사용한 접근은 swap과 outOfOrder 메소드가 버블 정렬 알고리즘에 직접 의존하도록 구현함으로써 부분적으로 DIP를 위반한다.
  - 스트레터지를 사용한 접근은 이런 의존성을 포함하고 있지 않다.
  - IntSortHandle 은 BubbleSorter가 아니라 다른 Sorter 구현과 함께 사용할 수 있다.
  - 예를 들어, 배열을 한 번 훑었을 때 순서가 제대로 되어 있음을 확인하면 일찍 종료해버리는 버블 정렬의 변형을 만들 수 있다.
  - QuickBubbleSorter 는 IntSortHandle 이나 SortHandle 에서 파생된 다른 클래스도 사용할 수 있다.

```java
// QuickBubbleSorter.java
public class QuickBubbleSorter {
  private int operations = 0;
  private int length = 0;
  private SourHandle itsSortHandle = null;

  public QuickBubbleSorter(SortHandle handle) {
    itsSortHandle = handle;
  }

  public int sort(Object array) {
    for (int nextToLast = length - 2; nextToLast >= 0 && !thisPassInOrder; nextToLast--) {
      thisPassInOrder = true; // 잠재적으로
      for (int index = 0; index <= nextToLast; index++) {
        if(itsSOrtHandle.outOfOrder(index)) {
          itsSortHandle.swap(index);
          thisPassInOrder = false;
        }
        operations++;
      }
    }
  }

  return operations
}
```

- 스트래터지 패턴은 템플릿 메소드 패턴에 비해 한 가지 특별한 이점을 제공한다.
  - 템플릿 메소드 패턴이 일반적인 알고리즘으로 많은 구체적인 구현을 조작할 수 있게 해주는 반면,
  - DIP를 완전히 따르는 스트래터지 패턴은 각각의 구체적인 구현이 **다른 많이 일반적인 알고리즘에 의해 조작**될 수 있게 해준다.

## 결론

- 템플릿 메소드와 스트래터지 패턴 모두 상위 단계의 알고리즘을 하위 단계의 구체적인 부분으로부터 분리해주는 역할을 한다.
- 둘다 상위 단계의 알고리즘이 구체적인 부분과 독립적으로 재사용될 수 있게 해준다.
- 약간의 복잡성과 메모리, 실행 시간을 더 감내하면 스트래터지는 구체적인 부분이 상위 단계 알고리즘으로부터 독립적으로 재사용될 수 있게 까지 해준다.
