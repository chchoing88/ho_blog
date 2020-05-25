---
title: '[algorithms] binaryTree'
date: '2020-04-19T10:00:03.284Z'
---

## 트리 정의

- 트리는 에지로 연결된 노드의 집합입니다. 예를 들면 회사의 조직도를 들수 있습니다.
- 각각의 상자가 `노드`며 상자를 연결하는 선이 `에지`이다.
- 트리의 최상위 노드를 `루트(root)` 노드라고 한다.
- 한 노드가 아래 노드와 연결되어 있을때 위에 있는 노드를 `부모(parent)` 노드라 한다.
- 부모 노드 아래에 있는 모든 노드를 `자식(child)` 노드라고 한다.
- 한 노드는 0개 이상의 노드와 연결 될 수 있다.
- 자식 노드가 없는 노드를 `리프(leaf)` 노드라 부른다.
- 이진 트리는 모든 노드의 자식 노드 수가 2개 이하인 특수한 노드를 가리킨다.
- 한 노드에서 다른 노드로 도달하는데 사용한 `에지의 모음을 경로(path)`라 한다.
- 트리는 레벨로 구분할 수 있으며, 트리에 있는 `레벨의 수를 트리의 깊이(depth)` 라고 한다.
- 트리의 각 노드는 값을 갖는데, 노드의 값을 키 값이라고도 표현한다.

## 이진 검색 트리 (BST)

- 자식중에 작은 값은 왼쪽 노드에, 큰 값을 오른쪽 노드에 저장한다.
- 이진 검색트리는 단어, 문자열도 저장할 수 있다.

## 이진 검색 트리 탐색

- BST 클래스에서는 `중위(inorder)`, `전위(preorder)`, `후위(postorder)`라는 세 가지 탐색 방법을 사용한다.
- `중위 탐색`에서는 노드의 오름차순 키(수치가 점점 커지는) 값으로 BST 클래스의 모든 노드를 방문한다. (왼쪽 -> 부모 -> 오른쪽 순)
- `전위 탐색`에서는 먼저 루트 노드를 방문한 다음 루트 왼쪽 자식을 중심으로 하는 서브트리를 같은 방식으로 방문하며, 마지막으로 루트 노드의 오른쪽 자식을 중심으로 하는 서브트리를 방문한다. (부모 -> 왼쪽 -> 오른쪽)
- `후위 탐색`에서는 루트 노드의 왼쪽 자식을 중심으로 하는 서브트리를 먼저 방문한 다음, 루트 노드의 오른쪽 자식을 중심으로 하는 서브트리를 방문하며, 마지막으로 루트 노드를 방문한다. (왼쪽 -> 오른쪽 -> 부모)
- 재귀를 이용하면 깔끔하게 중위 탐색을 구현할 수 있다.

## BST 검색

- 특정값 검색 : 현재 노드와 검색 대상 노드의 값을 비교 검색 결과에 따라 왼쪽/오른쪽 탐색할지 결정할 수 있다.
- 최솟값 검색 : 더 이상 왼쪽 자식 노드가 없을 때까지 BST의 왼쪾 에지를 탐색하면 최솟값을 찾을 수 있다.
- 최댓값 검색 : 가장 오른쪽에 저장된 자식 노드에 저장된 값이 BST의 최댓값이다.

## 이진 검색 트리 구현

```typescript
class BSTNode<T> {
  data: T;
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;

  constructor(data: T, left: BSTNode<T> | null, right: BSTNode<T> | null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }

  show() {
    return this.data;
  }
}

class BST<T> {
  root: BSTNode<T> | null;

  constructor() {
    this.root = null;
  }

  insert(data: T) {
    // 루트 노드를 current 노드로 설정
    // 삽입할 노드의 값이 current 노드의 값보다 작으면 왼쪽 자식으로 크다면 오른쪽 자식으로 삽입
    // current 노드의 값 보다 작으면서 왼쪽 자식이 null이면 왼쪽 자식에 삽입 그렇지 않다면 왼쪽 자식을 current로 바꾼후 다시 루프
    // 반대로 current 노드의 값 보다 크면서 오른쪽 자식이 null이면 오른쪽 자식에 삽입 그렇지 않다면 오른쪽 자식을 current로 바꾼후 다시 루프
    const bstNode = new BSTNode<T>(data, null, null);
    if (this.root === null) {
      this.root = bstNode;
    } else {
      let current = this.root;

      while (true) {
        if (data < current.data) {
          // 삽입할 데이터가 작으면 왼쪽
          if (current.left === null) {
            current.left = bstNode;
            break;
          } else {
            current = current.left;
          }
        } else {
          // 삽입할 데이터가 크면 오른쪽
          if (current.right === null) {
            current.right = bstNode;
            break;
          } else {
            current = current.right;
          }
        }
      }
    }
  }

  inOrder(node: BSTNode<T> | null) {
    // 중위 탐색 (왼쪽 -> 부모 -> 오른쪽) 오름 차순 탐색
    // 부모 기준으로 왼쪽 시도후 부모 시도 그리고 나서 부모의 오른쪽 시도
    if (node !== null) {
      this.inOrder(node.left); // 부모 노드의 왼쪽 부터 출력 시도
      console.log(node.data + " "); // 부모 자신 출력
      this.inOrder(node.right); // 부모 노드의 오른쪽 출력 시도
    }
  }

  preOrder(node: BSTNode<T> | null) {
    // 전위 탐색 (부모 -> 왼쪽 -> 오른쪽) 부모를 기준으로 부모 먼저 시도 후 왼쪽 시도 그리고 다 끝났으면 오른쪽 시도
    if (node !== null) {
      console.log(node.data + " ");
      this.inOrder(node.left); // 부모 노드의 왼쪽부터 출력 시도
      this.inOrder(node.right); // 부모 노드의 오른쪽 출력 시도
    }
  }
  postOrder(node: BSTNode<T> | null) {
    // 후위 탐색 (왼쪽 -> 오른쪽 -> 부모) 부모를 기준으로 왼쪽 시도 그리고 다 끝났으면 오른쪽 시도 후 마지막으로 부모 시도
    if (node !== null) {
      this.inOrder(node.left); // 부모 노드의 왼쪽부터 출력 시도
      this.inOrder(node.right); // 부모 노드의 오른쪽 출력 시도
      console.log(node.data + " ");
    }
  }

  // 최솟값
  getMin() {
    let current = this.root;
    if (current === null) {
      return null;
    }

    while (!(current.left === null)) {
      current = current.left;
    }

    return current.data;
  }

  // 최댓값
  getMax() {
    let current = this.root;
    if (current === null) {
      return null;
    }

    while (!(current.right === null)) {
      current = current.right;
    }

    return current.data;
  }

  // 특정값 검색
  find(data: T) {
    let current = this.root;

    while (current && current.data !== data) {
      if (data < current.data) {
        current = current.left;
      } else if (data > current.data) {
        current = current.right;
      }
    }

    if (current === null) {
      return null;
    }

    return current;
  }

  getSmallest(node: BSTNode<T>) {
    let current = node;

    while (!(current.left === null)) {
      current = current.left;
    }

    return current;
  }

  remove(data: T) {
    this.root = this.removeNode(this.root, data);
  }

  // 삭제가 이뤄 진다면
  // 삭제가 이뤄지는 노드의 오른쪽 자식이 없다면 왼쪽 자식이 해당 노드 자리를 대체한다.
  // 삭제가 이뤄지는 노드의 왼쪽 자식이 없다면 오른쪽 자식이 해당 노드 자리를 대체한다.
  // 자식이 둘다 있다면 오른쪽 노드의 가장 작은 노드를 찾아서 해당 노드 자리를 대체하고 오른쪽 가장 작은 노드는 null 처리 한다.
  removeNode(node: BSTNode<T> | null, data: T) {
    if (node === null) {
      return null;
    }
    // 재귀
    if (data === node.data) {
      // 자식이 없는 노드
      if (node.left === null && node.right === null) {
        return null;
      }
      // 왼쪽 자식이 없는 노드
      if (node.left === null) {
        // 부모 노드의 왼쪽 또는 오른쪽 자식으로 들어갈 노드
        return node.right;
      }

      // 오른쪽 자식이 없는 노드
      if (node.right === null) {
        // 부모 노드의 왼쪽 또는 오른쪽 자식으로 들어갈 노드
        return node.left;
      }

      // 두 자식이 있는 노드
      // 삭제할 노드는 양쪽 자식의 사이 값이기 때문에
      // 가장 오른쪽에서 작은 노드를 찾아 바꿔 준다.
      const tempNode = this.getSmallest(node.right);
      // 찾은 노드의 데이터를 삭제하고자 하는 노드와 교체한다.
      node.data = tempNode.data;
      // 가장 오른쪽에서 작은 노드인 찾은 노드를 null 처리 한다.
      // node.right 가 그대로 리턴된다.
      node.right = this.removeNode(node.right, tempNode.data);
      // tempNode로 대체된 노드
      return node;
    } else if (data < node.data) {
      // 찾는 데이터가 작다면 왼쪽 노드로 이동해서 삭제를 진행해 본다.
      // 왼쪽 노드로 이동해서 삭제가 되기 때문에 새로운 왼쪽 노드를 할당 합니다.
      node.left = this.removeNode(node.left, data);
      return node;
    } else {
      // 찾는 데이터가 크다면 오른쪽 노드로 이동해서 삭제를 진행해 본다.
      node.right = this.removeNode(node.right, data);
      return node;
    }
  }
}
```
