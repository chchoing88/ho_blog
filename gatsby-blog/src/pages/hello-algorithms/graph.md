---
title: graph Hashing
date: '2020-04-20T10:00:03.284Z'
---

## 그래프 정의

- 그래프는 정점과 간선으로 이루어져 있다. (지도로 치면 각 마을은 정점이며 도로가 간선이다.)
- 간선은 (v1, v2)와 같은 쌍으로 정의하며, 여기서 v1, v2는 그래프의 정점이다.
- 정점은 무게(weight) 또는 비용(cost)을 포함할 수 있다.
- 간선에서 정점의 순서를 따지는 그래프를 방향성 그래프(directed graph 또는 digraph)라 한다.
- 방향성 그래프에서는 화살표로 간선을 표시하고 정점간 흐름을 의미한다.
- 방향성이 없는 그래프를 무방향성 그래프(unordered graph) 또는 그래프라고 한다.
- 경로의 길이는 경로의 첫 번째 정점에서 마지막 정점까지의 간선 수를 의미한다.
- 경로는 정점 자신으로 향하는 경로 즉, 루프도 퍼함한다. 이때 루프의 길이는 0 이다.
- 첫 번째 정점에서 마지막 정점으로 도달하는 하나 이상의 간선으로 이루어졌으며 경로가 같은 상황을 사이클(cycle)이라 한다.
- 한 정점이 다른 정점과 연결되어 있고, 다른 정점도 한 정점과 연결되어 있으면 두 정점은 서로 강하게(strongly) 연결되어 있다고 말한다.

## 정점 표현 (Vertex 클래스)

- 정점을 식별할 수 있는 데이터 멤버와 정점을 방문했는지 여부를 확인할 수 있는 데이터 멤버가 필요. (label, wasVisited)
- Graph 클래스가 사용할 정점은 배열에 저장할 것이다.

## 간선 표현

- 그래프의 구조를 표현하는 것은 간선
- 실제 정보는 간선에 저장된다.
- 인접 리스트 (adjacency list) 또는 인접 리스트 배열(array of adjacency list)이라 불리는 방법으로 그래프의 간선을 표현할 것이다.
- 인접 리스트에서는 인접한 각 정점의 배열 리스트에 정점을 인덱스로 이용해 간선을 저장한다. 예를 들어 정점 2가 정점 0, 1, 3, 4로 연결되고 인덱스는 2에 저장되어 있다고 가정하면 인덱스 2에는 정점 0, 1, 3, 4의 정보가 들어있을 것이다.
- 간선을 구현하는 또 다른 방법으로 인접 행렬(adjacency matrix) 이라는 방식도 있다. 인접 행렬이란 두 정점 간의 간선이 존재하는지 여부를 알려주는 요소를 포함하는 이차원 배열이다.

## 그래프 구현

- Graph 클래스는 그래프의 정점수를 나타내는 배열 길이를 이용해 그래프의 간선 수, 정점 수 정보를 유지한다.
- 배열의 각 요소를 for문으로 반복하면서 각 요소에 인접 정점을 저장할 서브 배열을 추가한 다음 각 요소를 빈 문자열로 초기화 함.

```typescript
class Graph {
  vertices: number;
  edges: number;
  adj: number[][];

  constructor(v: number) {
    this.vertices = v;
    this.edges = 0;

    this.adj = new Array(v);
    for (let i = 0; i < this.adj.length; i++) {
      this.adj[i] = [];
    }
  }

  addEdge(v: number, w: number) {
    this.adj[v].push(w);
    this.adj[w].push(v);
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
}
```

### 프로그램 결과

- 정점 0에는 정점 1,2로 연결되는 간선이
- 정점 1에는 정점 0,3으로 연결되는 간선이
- 정점 2에는 정점 0,4로 연결되는 간선이
- 정점 3에는 정점 1로 연결되는 간선이
- 정점 4에는 정점 2로 연결되는 간선이 있다.

## 그래프 검색

- 깊이 우선 검색(depth first search)
- 너비 우선 검색(breadth first search)

### 깊이 우선 검색 (DFS)

- 한 정점에서 시작해 마지막 정점이 나올 때까지 모든 경로를 탐색한 다음 다시 이전 경로로 거슬로ㅓ 올라가 다음 경로를 찾기를 반복해 더 이상 방문할 경로가 없을 때까지 탐색 수행

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
    this.adj[w].push(v);
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
  // 순서 0 -> true, this.adj[0] = 1, this.dfs(1), 1 -> true,...
  dfs(v: number) {
    this.marked[v] = true;
    if (this.marked[v] !== undefined) {
      console.log(`Visited vertex: ${v}`);
    }

    for (let w of this.adj[v]) {
      // 이미 방문 했던 vertex는 무시한다.
      if (!this.marked[w]) {
        this.dfs(w);
      }
    }
  }
}

```