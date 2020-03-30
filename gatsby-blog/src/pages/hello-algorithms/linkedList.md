---
title: algorithm Linked List
date: '2020-03-29T10:00:03.284Z'
---

## 연결 리스트

- 배열로 작업했을때 느리다고 판단되면 대안으로 연결 리스트를 사용할 수 있다.
- 일차원 배열을 사용한 곳에서는 대부분 배열을 연결 리스트로 바꿀 수 있다.
- 임의의 요소에 접근해야 할 때는 연결 리스트보다 배열이 좋다.
- 노드(node) 라 불리는 객체가 모여 연결 리스트를 구성한다.
- 각 노드는 객체 레퍼런스를 통해 리스트의 다른 노드와 연결된다.
- 다른 노드를 참조하는 레퍼런스를 링크(link)라 한다.

## 동작

- 연결 리스트는 다른 요소와의 관계를 통해 원하는 요소를 참조할 수 있다.
- 헤더라 불리는 특별한 노드를 이용해 연결 리스트의 시작을 표현한다.
- 새 노드를 추가하려면 삽입하려는 노드의 이전 노드 링크가 새 노드를 가리키도록 바꿔야 하고 새 노드의 링크는 이전 노드가 가리키던 노드를 가리키도록 설정해야 한다.
- 노드를 삭제하는 일은 삭제하려는 노드의 이전에 있는 노드 링크를 삭제하려는 노드가 가리키는 노드로 바꾼 다음, 삭제하려는 노드의 링크를 Null로 설정하면 노드가 삭제된다.

## 설계

1. Node 클래스

Node 클래스는 노드의 데이터를 저장하는 element와 연결 리스트의 다음 노드 링크를 저장하는 next, 두 가지 프로퍼티를 포함한다.

```javascript
function Node(element) {
  this.element = element;
  this.next = null;
}
```

2. LinkedList 클래스

새 노드 삽입, 기존 노드 삭제, 리스트의 특정 데이터 검색 등의 기능 제공한다. 리스트의 헤드를 나타내는 노드에 해당하는 한개의 프로퍼티를 포함한다.

## 연결 리스트 코드 (단방향)

```typescript
// LinkedNode
class LinkedNode<T> {
  element: T;
  next: LinkedNode<T> | null;

  constructor(element: T) {
    this.element = element;
    this.next = null;
  }
}

// LinkedList
class LinkedList {
  head: LinkedNode<string>;

  constructor() {
    this.head = new LinkedNode("head");
  }

  find(item: string) {
    let currNode = this.head;
    //
    while (currNode.next && currNode.element !== item) {
      currNode = currNode.next;
    }

    if (currNode.element === item) {
      return currNode;
    }

    throw new Error("해당 노드를 찾을 수 없습니다.");
  }

  findPrevious(item: string) {
    let currNode = this.head;
    // 현재 노드 다음 element가 item과 일치할 때까지 링크를 타고 이동시킨다.
    while (currNode.next && currNode.next.element !== item) {
      currNode = currNode.next;
    }

    if (currNode.next?.element === item) {
      return currNode;
    }

    throw new Error("해당 이전 노드를 찾을 수 없습니다.");
  }

  // 어떤 노드를 추가할 것이고, 어느 노드 앞에 추가할지를 지정해야 한다.
  insert(newElement: string, item: string) {
    const newNode = new LinkedNode(newElement);
    const currentNode = this.find(item);
    newNode.next = currentNode.next;
    currentNode.next = newNode;
  }

  remove(item: string) {
    const removeNode = this.find(item);
    const previousRemoveNode = this.findPrevious(item);

    previousRemoveNode.next = removeNode.next;
  }

  // 전체 연결 리스트 보여주기
  display() {
    let currNode = this.head;
    console.log(currNode.element);

    while (currNode.next) {
      console.log(currNode.next.element);
      currNode = currNode.next;
    }
  }
}

```

## 연결 리스트 코드 (양방향)

연결 리스트를 양방향으로 구현한다면 역방향으로 노드 탐색과 삭제할때 편리하지만 노드를 추가할 때는 더 많은 작업을 수행 해야 한다.

```typescript
// LinkedNode
class LinkedNode<T> {
  element: T;
  next: LinkedNode<T> | null;
  previous: LinkedNode<T> | null;

  constructor(element: T) {
    this.element = element;
    this.next = null;
    this.previous = null // 양방향을 위한 이전 노드 가리키기
  }
}


class LinkedList {
  head: LinkedNode<string>;
  tail: LinkedNode<string>;

  constructor() {
    this.head = new LinkedNode("head");
    this.tail = this.head; // 꼬리 부분도 저장해 둔다.
  }

  // (...) 이전 코드

  // 어떤 노드를 추가할 것이고, 어느 노드 앞에 추가할지를 지정해야 한다.
  insert(newElement: string, item: string) {
    const newNode = new LinkedNode(newElement);
    const currentNode = this.find(item);
    newNode.next = currentNode.next;
    newNode.previous = currentNode; // 추가
    currentNode.next = newNode;
    this.tail = newNode;
  }

  remove(item: string) {
    const removeNode = this.find(item);
    const previousRemoveNode = removeNode.previous;
    const nextRemoveNode = removeNode.next;
    // const previousRemoveNode = this.findPrevious(item);
    // previousRemoveNode.next = removeNode.next;
    if (previousRemoveNode) {
      previousRemoveNode.next = removeNode.next;
    }

    if (nextRemoveNode) {
      nextRemoveNode.previous = previousRemoveNode;
    }

    if (!nextRemoveNode && previousRemoveNode) {
      this.tail = previousRemoveNode;
    }

    removeNode.next = null;
    removeNode.previous = null;
  }

  displayReverse() {
    let currNode = this.tail;
    console.log(currNode.element);

    while (currNode.previous) {
      console.log(currNode.previous.element);
      currNode = currNode.previous;
    }
  }
}
```

## 연결 리스트 코드 (순환형)

순환형 연결 리스트에서는 헤드의 next 프로퍼티가 자신을 가리킨다는 것입니다.
순환형 연결 리스트에서는 노드의 끝을 지나 계속 탐색하면 결국 역받향에 있는 노드로 이동 할 수 있습니다.

```typescript
// 순환과 양방향의 합성 

class LinkedList {
  head: LinkedNode<string>;
  tail: LinkedNode<string>;

  constructor() {
    this.head = new LinkedNode("head");
    this.tail = this.head;
    this.tail.next = this.head;
    this.head.previous = this.tail;
  }

  find(item: string) {
    let currNode = this.head;
    //
    while (currNode.next && currNode.element !== item) {
      currNode = currNode.next;
    }

    if (currNode.element === item) {
      return currNode;
    }

    throw new Error("해당 노드를 찾을 수 없습니다.");
  }

  findPrevious(item: string) {
    let currNode = this.head;
    // 현재 노드 다음 element가 item과 일치할 때까지 링크를 타고 이동시킨다.
    while (currNode.next && currNode.next.element !== item) {
      currNode = currNode.next;
    }

    if (currNode.next?.element === item) {
      return currNode;
    }

    throw new Error("해당 이전 노드를 찾을 수 없습니다.");
  }

  // 어떤 노드를 추가할 것이고, 어느 노드 앞에 추가할지를 지정해야 한다.
  insert(newElement: string, item: string) {
    const newNode = new LinkedNode(newElement);
    const currentNode = this.find(item);
    newNode.next = currentNode.next;
    newNode.previous = currentNode; // 추가
    currentNode.next = newNode;

    this.head.previous = newNode;
    this.tail = newNode;
  }

  remove(item: string) {
    const removeNode = this.find(item);
    const previousRemoveNode = removeNode.previous;
    const nextRemoveNode = removeNode.next;
    // const previousRemoveNode = this.findPrevious(item);
    // previousRemoveNode.next = removeNode.next;
    if (previousRemoveNode) {
      previousRemoveNode.next = removeNode.next;
    }

    if (nextRemoveNode) {
      nextRemoveNode.previous = previousRemoveNode;
    }

    if (!nextRemoveNode && previousRemoveNode) {
      this.head.previous = previousRemoveNode;
      this.tail = previousRemoveNode;
    }

    removeNode.next = null;
    removeNode.previous = null;
  }

  // 전체 연결 리스트 보여주기
  display() {
    let currNode = this.head;
    console.log(currNode.element);

    while (currNode.next && !(currNode.next.element === "head")) {
      console.log(currNode.next.element);
      currNode = currNode.next;
    }
  }

  displayReverse() {
    let currNode = this.tail;
    console.log(currNode.element);

    while (currNode.previous && !(currNode.previous === this.tail)) {
      console.log(currNode.previous.element);
      currNode = currNode.previous;
    }
  }
}

```
