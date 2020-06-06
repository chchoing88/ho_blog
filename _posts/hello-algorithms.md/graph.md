---
title: "[algorithms] graph"
date: "2020-04-20T10:00:03.284Z"
---

## 그래프 정의

- `그래프는 정점과 간선`으로 이루어져 있다. (지도로 치면 `각 마을은 정점이며 도로가 간선`이다.)
- `간선(Edge)`은 `(v1, v2)와 같은 쌍으로 정의`하며, 여기서 v1, v2는 그래프의 정점이다.
- `정점(Vertex)`은 `무게(weight)` 또는 `비용(cost)`을 포함할 수 있다.
- 간선에서 정점의 순서를 따지는 그래프를 `방향성 그래프(directed graph 또는 digraph)`라 한다.
- 방향성 그래프에서는 화살표로 간선을 표시하고 정점간 흐름을 의미한다.
- 방향성이 없는 그래프를 `무방향성 그래프(unordered graph)` 또는 그래프라고 한다.
- `경로의 길이`는 경로의 첫 번째 정점에서 마지막 정점까지의 `간선 수`를 의미한다.
- 경로는 정점 자신으로 향하는 경로 즉, 루프도 포함한다. 이때 루프의 길이는 0 이다.
- 첫 번째 정점에서 마지막 정점으로 도달하는 하나 이상의 간선으로 이루어졌으며 경로가 같은 상황을 `사이클(cycle)`이라 한다.
- 한 정점이 다른 정점과 연결되어 있고, 다른 정점도 한 정점과 연결되어 있으면 두 정점은 서로 `강하게(strongly`) 연결되어 있다고 말한다.

## 정점 표현 (Vertex 클래스)

- 정점을 식별할 수 있는 데이터 멤버와 정점을 방문했는지 여부를 확인할 수 있는 데이터 멤버가 필요. (label, wasVisited)
- Graph 클래스가 사용할 정점은 배열에 저장할 것이다.

```typescript
class Vertex<T> {
  label: T;
  wasVisited: boolean;

  constructor(label: T) {
    this.label = label; // 데이터 멤버
    this.wasVisited = false; // 정점을 방문했는지 여부
  }
}
```

## 간선 표현

- 그래프의 구조를 표현하는 것은 간선이다.
- 실제 정보는 간선에 저장된다.
- 그래프를 이진 트리 처럼 구현하는 것은 바람직하지 않다. 이진 트리에서 부모 노드는 오직 두 개 이하의 자식 노드를 가질 수 있으므로 대부분의 이진 트리 구현은 비슷한 편이다. 하지만 그래프는 이진트리에 비해 훨씬 유연한 구조를 가진다.
- `인접 리스트 (adjacency list)` 또는 `인접 리스트 배열(array of adjacency list)`이라 불리는 방법으로 그래프의 간선을 표현할 것이다.
- `인접 리스트에서는 인접한 각 정점의 배열 리스트에 정점을 인덱스로 이용해 간선을 저장`한다. 예를 들어 정점 2가 정점 0, 1, 3, 4로 연결되고 인덱스는 2에 저장되어 있다고 가정하면 인덱스 2에는 정점 0, 1, 3, 4의 정보가 들어있을 것이다.
- 간선을 구현하는 또 다른 방법으로 `인접 행렬(adjacency matrix)` 이라는 방식도 있다. 인접 행렬이란 `두 정점 간의 간선이 존재하는지 여부를 알려주는 요소를 포함하는 이차원 배열`이다.

### 인접행렬

![http://www.ktword.co.kr/img_data/2453_1.JPG](http://www.ktword.co.kr/img_data/2453_1.JPG)

```javascript
// 인접 행렬
const vertexList = ["A", "B", "C", "D", "E", "F"];
const adj = [...vertexList.map((_) => Array())];
adj[0][0] = 0; // A 에서 A 로 향하는 간선
adj[0][1] = 1; // A 에서 B 로 향하는 간선
```

### 인접 리스트

![http://www.ktword.co.kr/img_data/2453_3.JPG](http://www.ktword.co.kr/img_data/2453_3.JPG)

```javascript
// 인접 리스트
const adj = []
adj[0] = [2]
adj[1] = [2]
adj[2] = [0,1,3,4]
adj[3] = [2]
adj[4] = [2]
// 그래프 클래스에는 Vertex의 연결 리스트의 head를 지니고 있고,
// 각각의 Vertex에는 다음 Vertex 와 간선 연결 리스트의 head를 지니고 있어야 한다.
// 각각의 간선에는 다음 간선들을 지니고 있어야 한다.
class Graph {
  this.vertexHead = null;
}

class Vertex {
  this.nextVertex = null; // 다음 정점
  this.edgeHead = null; // 간선 연결 리스트
  this.wasVisited = false; // 방문 이력
  this.distance = null; // 단일 출발지에서 최단 거리 구할때 사용
  this.key = null;
}

class Edge {
  this.nextEdge = null; // 다음 간선
  this.destination = null; // 향하는 정점(Vertex 인스턴스) : A 정점의 간선 연결 리스트에 연결 되어있고 destination이 B 라고 하면 A->B
  this.data = null; // 간선의 weight
}
```

## 그래프 구현 (간단한)

- Graph 클래스는 그래프의 정점수를 나타내는 배열 길이를 이용해 `그래프의 간선 수, 정점 수 정보`를 유지한다.
- 배열의 각 요소를 for문으로 반복하면서 각 요소에 인접 정점을 저장할 서브 배열을 추가한 다음 각 요소를 빈 문자열로 초기화 함.

```typescript
// 정점 수를 인자로 받아서 인덱스에 매핑 시킨다.
class Graph {
  vertices: number;
  edges: number;
  adj: number[][];

  constructor(v: number) {
    this.vertices = v; // 총 정점 수
    this.edges = 0; // 총 간선 수

    this.adj = new Array(v);
    for (let i = 0; i < this.adj.length; i++) {
      this.adj[i] = [];
    }
  }

  // 정점 v 와 정점 w를 인접 리스트에 추가한다.
  addEdge(v: number, w: number) {
    this.adj[v].push(w);
    this.adj[w].push(v); // 순환 참조를 안시키려면 주석을 해야한다.
    this.edges++; // 간선의 수를 1만큼 증가 시킨다.
  }

  showGraph() {
    console.log("this.adj", this.adj);
    this.adj.forEach((verticeList, index) => {
      // verticeList : 정점 리스트
      console.log(`${index} -> `);
      verticeList.forEach((vertice) => {
        if (vertice !== undefined) {
          console.log(`${vertice}`);
        }
      });
      console.log("\n");
    });
  }
}

// const g = Graph(5);
// g.addEdge(0,1);
// g.addEdge(0,2);
// g.addEdge(1,3);
// g.addEdge(2,4);
// g.showGraph();
// 0 -> 1 2
// 1 -> 0 3
// 2 -> 0 4
// 3 -> 1
// 4 -> 2
```

### 프로그램 결과

- 정점 0에는 정점 1,2로 연결되는 간선이
- 정점 1에는 정점 0,3으로 연결되는 간선이
- 정점 2에는 정점 0,4로 연결되는 간선이
- 정점 3에는 정점 1로 연결되는 간선이
- 정점 4에는 정점 2로 연결되는 간선이 있다.

## 그래프 구현 (연결 리스트)

```typescript
// 연결 리스트를 사용한 그래프 구현
// 간선
class Edge<T> {
  data: number; // 간선의 weight
  nextEdge: Edge<T> | null;
  destination: Vertex<T>;

  constructor(data: number, des: Vertex<T>) {
    this.data = data;
    this.nextEdge = null;
    this.destination = des;
  }
}

// 정점
class Vertex<T> {
  label: T;
  wasVisited: boolean;
  edgeHead: Edge<T> | null;
  nextVertex: Vertex<T> | null;

  constructor(label: T) {
    this.label = label;
    this.wasVisited = false; // 탐색시 사용
    this.edgeHead = null;
    this.nextVertex = null;
  }
}

// 그래프
class Graph2<T> {
  vertexHead: Vertex<T> | null;
  count: number;

  constructor() {
    this.vertexHead = null;
    this.count = 0; // 총 정점 갯수
  }

  insertVertex(label: T) {
    const newVertex = new Vertex<T>(label);
    let lastVertex = this.vertexHead;
    if (lastVertex) {
      // 계속 순환 하면서 다음 vertex 가 없을 때까지
      while (lastVertex.nextVertex !== null) {
        lastVertex = lastVertex.nextVertex;
      }
      lastVertex.nextVertex = newVertex;
    } else {
      // vertexHead 가 없다면
      this.vertexHead = newVertex;
    }
    this.count = this.count + 1;
  }

  deleteVertex(label: T) {
    // 삭제 : 삭제 타겟의 다음 vertex를 삭제 타겟의 이전 vertex에 연결 시켜 주어야 한다.
    let targetVertex = this.vertexHead;
    let prevVertex = null;
    while (targetVertex && targetVertex.label !== label) {
      prevVertex = targetVertex;
      targetVertex = targetVertex.nextVertex;
    }
    if (!targetVertex) return false;

    if (prevVertex) {
      // 삭제 되는 이전 vertex 가 있다면 타겟 vertex의 다음 vertex를 넘긴다.
      prevVertex.nextVertex = targetVertex.nextVertex;
    } else {
      // 첫 vertext가 삭제 된다면
      this.vertexHead = targetVertex.nextVertex;
    }

    this.count = this.count - 1;
  }

  insertEdge(data: number, fromLabel: T, toLabel: T) {
    // fromLabel을 가지고 from Vertext를 찾자
    let fromVertex = this.vertexHead;
    let toVertex = this.vertexHead;

    while (fromVertex && fromVertex.label !== fromLabel) {
      fromVertex = fromVertex.nextVertex;
    }

    while (toVertex && toVertex.label !== toLabel) {
      toVertex = toVertex.nextVertex;
    }

    if (!fromVertex || !toVertex) return false;

    // 새로 만든 간선을 fromVertex의 마지막 edge에 추가한다.
    const newEdge = new Edge<T>(data, toVertex);

    let lastEdge = fromVertex.edgeHead;
    if (lastEdge) {
      while (lastEdge.nextEdge !== null) {
        lastEdge = lastEdge.nextEdge;
      }
      lastEdge.nextEdge = newEdge;
    } else {
      // fromVertex의 edgeHead가 없다면 처음에 넣어준다.
      fromVertex.edgeHead = newEdge;
    }
  }

  deleteEdge(fromLabel: T, toLabel: T) {
    let fromVertex = this.vertexHead;

    while (fromVertex && fromVertex.label !== fromLabel) {
      fromVertex = fromVertex.nextVertex;
    }

    if (!fromVertex) return false;
    let targetEdge = fromVertex.edgeHead;
    let preTargetEdge = null;

    while (targetEdge !== null) {
      if (targetEdge.destination.label === toLabel) break;
      preTargetEdge = targetEdge;
      targetEdge = targetEdge.nextEdge;
    }

    if (!targetEdge) return false;

    if (preTargetEdge) {
      preTargetEdge.nextEdge = targetEdge.nextEdge;
    } else {
      // 삭제될 타겟팅의 이전이 없다면 첫 엣지다.
      fromVertex.edgeHead = targetEdge.nextEdge;
    }
  }
}

// const graph = new Graph2();
// graph.insertVertex('A');
// graph.insertVertex('B');
// graph.insertVertex('C');
// graph.insertVertex('D');
// graph.insertVertex('E');
// graph.insertVertex('F');
// graph.insertEdge(1, 'A', 'B');
// graph.insertEdge(1, 'B', 'C');
// graph.insertEdge(1, 'B', 'E');
// graph.insertEdge(1, 'C', 'E');
// graph.insertEdge(1, 'C', 'D');
// graph.insertEdge(1, 'E', 'D');
// graph.insertEdge(1, 'E', 'F');
// graph.deleteVertex('B')
```

## 그래프 검색

- 깊이 우선 검색 (depth first search)
- 너비 우선 검색 (breadth first search)
- 그래프는 사실 child 노드라고 하기 보다 인접한 노드라고 하는게 정확합니다.

### 깊이 우선 검색 (DFS)

- 한 정점에서 시작해 마지막 정점이 나올 때까지 모든 경로를 탐색한 다음 다시 이전 경로로 거슬러 올라가 다음 경로를 찾기를 반복해 더 이상 방문할 경로가 없을 때까지 탐색 수행
- 이진 트리 검색중에 `inorder, preorder, postorder` 가 깊이 우선 검색에 해당됩니다.
- child 노드를 끝까지 파고난 다음에 (마지막 노드까지 갔다가 다시 올라와서 형제 노드들을 방문) 그 다음 줄기를 검색하고 또 다시 그 다음 줄기를 검색하는 방식입니다.
- 깊이 우선 검색은 `Stack`을 이용해서 구현합니다.
- **스택에 일단 루트 노드를 넣고 먼저 스택에서 노드를 하나 꺼내서 그 해당 child 노드를 전부 스택에 넣고 꺼낸 노드는 출력을 하는 것입니다.**
- 여기서 child 노드를 스택에 넣을 때는 한번 넣었던 child 노드는 넣지 않습니다.
- 특히 `DFS를 구현할때 재귀 호출`을 이용하면 코드가 간결해 집니다.

```typescript
class Graph {
  vertices: number;
  edges: number;
  adj: number[][];
  marked: boolean[];

  constructor(v: number) {
    this.vertices = v;
    this.edges = 0;

    this.adj = new Array(v);
    for (let i = 0; i < this.adj.length; i++) {
      this.adj[i] = [];
    }

    // 탐색을 했는지 안했는지 확인하기 위해서
    this.marked = [];
    for (let i = 0; i < this.adj.length; i++) {
      this.marked[i] = false;
    }
  }

  addEdge(v: number, w: number) {
    this.adj[v].push(w);
    this.adj[w].push(v); // 순환 참조를 안시키려면 주석을 해야한다.
    this.edges++;
  }

  showGraph() {
    console.log("this.adj", this.adj);
    this.adj.forEach((verticeList, index) => {
      console.log(`${index} -> `);
      verticeList.forEach((vertice) => {
        if (vertice !== undefined) {
          console.log(`${vertice}`);
        }
      });
      console.log("\n");
    });
  }

  // 재귀는 곧 돌아와서 다시 할일이 있기 때문에 사용한다.
  // 재귀는 곧 stack을 이용한다. browser 실행 stack을 이용한다.
  // 순서 0 -> true, this.adj[0] = 1, this.dfs(1), 1 -> true,...
  dfs(v: number) {
    // 이 실행 자체가 stack에 들어간다.
    this.marked[v] = true;
    if (this.marked[v] !== undefined) {
      console.log(`Visited vertex: ${v}`);
    }
    // 방문한 인접한 노드를 loop를 돈다.
    for (let w of this.adj[v]) {
      // 이미 방문 했던 vertex는 무시한다.
      // 인접한 노드를 방문한다.
      if (!this.marked[w]) {
        this.dfs(w);
      }
    }
  }
}
```

### 너비 우선 검색 (BFS)

- 첫 번째 정점에서 시작해 가능한 한 첫 번째 정점과 가까운 정점을 방문한다.
- 기본적으로 너비 우선 검색은 그래프를 계층(layer)별로 탐색한다. 즉, 첫 번째 정점에서 가장 가까운 계층을 먼저 탐색한 다음 시작 정점에서 점점 멀리 있는 계층을 검색하는 방식이다.
- 너비 우선 검색에서는 배열 대신 큐를 이용해 방문한 정점을 저장한다.
- 시작점에서 먼저 자신의 child 노드들을 다 방문 한 뒤에 그 다음의 자식의 자식을 방문을 해서 레벨 단위로 검색을 하는 것입니다.
- 넓이 우선 검색은 `Queue`를 이용해서 구현합니다.
- **일단 시작할 노드를 큐에 넣고 큐에서 하나 꺼내서 해당 노드의 child 노드를 큐에 넣고 꺼낸 노드는 출력하면 됩니다.**
- 여기서 child 노드를 큐에 넣을때 한번 넣었던 child 노드는 다시 큐에 넣지 않습니다.

```typescript
bfs(s: number) {
    const queue = [] as number[];
    this.marked[s] = true;
    queue.push(s);

  // 큐에 더이상 실행 시킬 노드가 없을 때 까지
    while (queue.length > 0) {
      const v = queue.shift(); // 큐에서 가져옴
      if (v !== undefined) {
        console.log(`Visited vertex: ${v}`);

        // 인접한 노드들에 대해서 순환을 돈다.
        for (let w of this.adj[v]) {
          if (!this.marked[w]) {
            // 이미 방문하지 않았던 w 정점에 대해서
            this.edgesTo[w] = v; // 최단 경로 찾을 때 이용 : 경로를 찾을때 간선 정보를 겹치지 않게 유지할 배열
            this.marked[w] = true; // 정점에 도달
            queue.push(w); // 방문한 정점에서 가장 인접한 레벨의 정점들을 큐에 넣어둔다.
          }
        }
      }
    }
  }
// 0 -> [1,2], 1 -> [0,3], 2 -> [0,4], 3 -> [1], 4 -> [2]
// 0,1,2,3,4
// this.edgesTo[1] = 0
// this.edgesTo[2] = 0
// this.edgesTo[3] = 1
// this.edgesTo[4] = 2
```

## 최단 경로 찾기

- 정점 간의 최단 경로를 찾는 것이다.
- `너비 우선 검색`을 수행하면 자동으로 `한 정점에서 연결된 다른 정점으로 도달하는 최단 경로`를 찾게 된다.
- 정점 A에서 정점 D로 도달하는 최단 경로를 찾는다고 할 때 1개의 간선 경로를 찾아보고 없으면 2개의 간선 경로를 찾아보는 식으로 반복 검색을 수행할 수 있다.
- 한 정점에서 다른 정점으로 연결하는 간선 정보를 유지할 배열이 필요 (`this.edgesTo`) : 겹치지 않게 간선 정보를 유지하는 것으로 보인다.

```typescript
pathTo(v: number) {
  const source = 0;
  // 너비 우선 검색을 우선 실행한다.
  // 간선 정보 수집 및 marked 수집.
  this.bfs(0);

  if (!this.hasPathTo(v)) {
    return undefined;
  }

  const path = [];
  for (let i = v; i !== source; i = this.edgesTo[i]) {
    // 여기서 this.edgesTo는 다음과 같다.
    // const g = new Graph(5)
    // g.addEdge(0, 1)
    // g.addEdge(0, 2)
    // g.addEdge(1, 3)
    // g.addEdge(2, 4)
    // 1 - 0, 2 - 0, 3 - 1, 4 - 2 간선 정보
    path.push(i);
  }
  path.push(source);
  return path;
}

hasPathTo(v: number) {
  return this.marked[v];
}

const paths = g.pathTo(4) // 정점 0에서 정점 4로 도달하는 최단 경로를 보여줌.
// 0, 2, 4
```

## 위상 정렬

- `위상 정렬(Topological sorting)`은 방향성 그래프의 모든 방향성 간선이 왼쪽에서 오른쪽 정점을 가리키도록 모든 정점을 배치하는 방법이다. 즉, 순서가 정해져 있는 작업을 차례대로 나열할때 사용한다.
- 이와 같은 구조는 `선수 제약 일정 관리`에서 찾아볼 수 있으며, 예를 들면 물리1을 이수하지 않은 학생은 물리2를 이수 할 수 없도록 하는것과 같다.
- 위상 정렬 알고리즘은 깊이 우선 검색 알고리즘과 비슷하다. 다만, 방문한 정점을 즉시 출력했던 깊이 우선 검색과 달리 `위상 정렬 알고리즘에서는 우선 현재 정점과 인접한 모든 정점을 방문한 다음 인접 리스트를 모두 확인하고 현재 정점을 스택으로 푸시`한다.
- `topSort()` 함수로 정렬 과정을 설정한 다음, 헬퍼 함수인 `topSortHelper()` 함수를 호출한다.
- 핵심 기능은 재귀 함수인 `topSortHelper()` 함수에서 수행한다.
- `topSortHelper()` 함수는 현재 방문한 정점으로 표시한 다음 현재 정점의 인접 리스트에 있는 각각의 인접 정점을 재귀적으로 방문하면서 방문한 것으로 표시한다.
- 위상 정렬은 `DAG(Directed Acyclic Graph: 사이클이 없는 방향성이 있는 그래프)` 에만 적용이 가능합니다. 즉, 사이클이 발생하면 위상정렬을 할 수 없습니다.
- 위상 정렬은 여러개의 답이 존재 할 수 있습니다.

```typescript
addEdge(v: number, w: number) {
  this.adj[v].push(w);
  // DAG에만 적용이 가능
  //this.adj[w].push(v); // 순환 참조를 안시키려면 주석을 해야한다.
  this.edges++;
}

topSort() {
  const stack: number[] = [];
  const visited = [];
  // visited 초기화
  // this.vertices : 총 정점 수
  for (let i = 0; i < this.vertices; i++) {
    visited[i] = false;
  }

  for (let i = 0; i < this.vertices; i++) {
    if (visited[i] == false) {
      // 연결되지 않은 정점 들도 파악한다.
      this.topSortHelper(i, visited, stack);
    }
  }
  // 출력
  let length = stack.length;
  for (let i = 0; i < length; i++) {
    console.log(stack.pop());
  }
}

topSortHelper(v: number, visited: boolean[], stack: number[]) {
  visited[v] = true;
  // 깊이 우선 탐색을 위한 재귀
  // dfs 와 다른 점은 browser의 stack 외에 다른 stack 에 그 결과물을 저장하는데 있다.
  for (var w of this.adj[v]) {
    if (!visited[w]) {
      this.topSortHelper(w, visited, stack);
    }
  }
  stack.push(v);
}

// const g = new Graph(6);
// g.addEdge(1,2);
// g.addEdge(2,5);
// g.addEdge(1,3);
// g.addEdge(1,4);
// g.addEdge(0,1);
// g.topSort()
// 0 -> 1 -> 4 -> 3 -> 2 -> 5
```

## 정리

- 그래프의 깊이를 먼저 탐색하기 위해선 `재귀(stack)`를 활용해서 가장 깊이 있는 뎁스 까지 내려갔다가 끝나면 남아있던 형제 정점에서 다시 탐색을 시작한다.
- 그래프의 너비를 먼저 탐색하기 위해선 현재 정점에 인접한(자식 뎁스)를 `큐`에 넣고 큐에서 하나씩 빼서 방문하게 만든다.
