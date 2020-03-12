---
title: react-vega
date: "2020-03-12T10:00:03.284Z"
---


## vega 란

공홈 : [https://vega.github.io/vega/](https://vega.github.io/vega/)

JSON 방식으로 시각화 문법을 작성하여 차트를 그리는 툴 입니다.

d3.js 의 복잡한 메서드나 로직을 가지고 그리는 것이 아니라 vega에서 정해진 rule대로 json 을 작성하면 해당 규칙대로 차트를 그려줍니다.

### 장점

- config 처럼 셋팅만으로도 차트를 그릴 수 있습니다.
- 온라인 툴을 제공하고 있어서 미리 셋팅된 config를 데이터 및 차트를 확인 할 수 있습니다.
- 다양한 example을 제공하고 있습니다.

### 단점

- d3.js를 다뤄 보지 않았다면 용어나 단어에 의해 러닝커브가 발생 됩니다.
- config json에 차트 관련 메서드들도 string 값으로 넘겨야 하고, 정확히 무슨 값을 넘겨야 하는지 모른다면 방대한 문서를 읽어야 합니다.
- 온라인 툴에서 미리 확인 할 수 있는 데이터가 너무 길어질 경우에는 온라인 툴에서 확인하기가 어렵습니다. ( 개인적으로 View 메서드를 이용해서 돌려보라고 안내해줍니다. )

## react-vega

github : [https://github.com/vega/react-vega/tree/master/packages/react-vega](https://github.com/vega/react-vega/tree/master/packages/react-vega)

vega로 그려지는 차트를 컴포넌트로 만들어주는 라이브러리

- 차트를 그리는 config 를 입력으로 받아 컴포넌트를 만든다.
- 해당 컴포넌트의 props API는 [https://github.com/vega/vega-embed](https://github.com/vega/vega-embed) API 를 참고하면 됩니다.
  - mode, theme, defaultStyle, renderer, logLovel, tooltip, loader, patch, width, height, padding, actions, scaleFactor, config, editorUrl, sourceHeader, sourceFooter, hover, i18n, downloadFileName

## 사용

example code : [https://github.com/vega/react-vega/tree/master/packages/react-vega#example-code](https://github.com/vega/react-vega/tree/master/packages/react-vega#example-code)

### 예시 ( 트리 차트 )

```ts
import { createClassFromSpec } from "react-vega";

export default createClassFromSpec({
  mode: "vega",
  spec: {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 1200,
    // height: 1500,
    padding: 5,
    background: "white",
    autosize: { type: "fit-x", contains: "padding" },
    signals: [
      // 대화 형 동작을 유도 할 수있는 동적 변수
      { name: "colorIn", value: "firebrick" },
      { name: "colorOut", value: "forestgreen" },
      {
        name: "active",
        value: null, // 마우스 오버에 따라서 active value에 동적으로 다른 값이 들어간다. 
        on: [
          { events: "text:mouseover", update: "datum.id" },
          { events: "mouseover[!event.item]", update: "null" }
        ]
      },
      {
        name: "activeNode",
        value: null, // 마우스 오버에 따라서 active value에 동적으로 다른 값이 들어간다. 
        on: [
          { events: "text:mouseover", update: "datum" },
          { events: "mouseover[!event.item]", update: "null" }
        ]
      },
      {
        name: "activeParent",
        value: null, // 마우스 오버에 따라서 active value에 동적으로 다른 값이 들어간다. 
        on: [
          { events: "text:mouseover", update: "datum.parent" },
          { events: "mouseover[!event.item]", update: "null" }
        ]
      }
    ],
    data: [ // 데이터 세트 정의 및 변환은 로드 할 데이터와 처리 방법을 정의합니다.
      {
        name: "tree",
        // values: [# 데이터가 들어갈 영역],
        transform: [
          {
            type: "stratify",
            key: "id",
            parentKey: "parent"
          },
          {
            type: "tree",
            method: "tidy",
            size: [{ signal: "height" }, { signal: "width" }],
            separation: true,
            as: ["y", "x", "depth", "children"]
          },
          {
            type: "formula",
            expr: "slice(datum.id, 0, 1)",
            as: "type"
          }
        ]
      },
      { 
        name: "links",
        source: "tree",
        transform: [
          { type: "treelinks" },
          {
            type: "linkpath",
            orient: "horizontal",
            shape: "diagonal"
          }
        ]
      },
      { 
        name: "ancestors", // 기존 tree 데이터를 기반으로 ancestor를 생성한 파생된 데이터를 만든다.
        source: "tree",
        transform: [
          {
            type: "formula",
            expr: "treeAncestors('tree', datum.id)", // 리턴 배열
            as: "ancestors",
            initonly: true
          }
        ]
      },
      {
        name: "treeAncestorsFlatten", // ancestors 데이터를 기반으로 배열값인 ancestors 열 값을 flatten 하게 만든다.
        source: "ancestors",
        transform: [{ type: "flatten", fields: ["ancestors"] }]
      },
      {
        name: "selected",
        source: "treeAncestorsFlatten",
        transform: [
          {
            type: "filter",
            expr:
              "datum.id === active || datum.parent === active || datum.id === activeParent || datum.ancestors.id === active"
          }
        ]
      }
    ],

    marks: [
      {
        type: "path",
        from: { data: "links" },
        encode: {
          update: {
            path: { field: "path" },
            stroke: [
              {
                test:
                  "indata('selected', 'id', datum.source.id) && indata('selected', 'id', datum.target.id)",
                signal: "colorIn"
              },
              {
                test:
                  "indata('selected', 'ancestors.id', datum.source.id) && indata('selected', 'ancestors.id', datum.target.id)",
                signal: "colorIn"
              },
              { value: "#ddd" }
            ]
          }
        }
      },
      {
        type: "symbol",
        from: { data: "tree" },
        encode: {
          enter: {
            size: { value: 100 },
            stroke: { value: "#fff" }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            fill: [
              { test: "datum.id === active", value: "red" },
              { test: "indata('selected', 'id', datum.id)", signal: "colorIn" },
              {
                test: "indata('selected', 'ancestors.id', datum.id)",
                signal: "colorIn"
              },
              { value: "#e4cccc" }
            ]
          }
        }
      },
      {
        type: "text",
        from: { data: "tree" },
        encode: {
          enter: {
            text: { signal: "datum.id + ' ' + datum.name" },
            fontSize: { value: 12 },
            baseline: { value: "middle" }
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            dx: { signal: "datum.children ? -7 : 7" },
            align: { signal: "datum.children ? 'right' : 'left'" },
            tooltip: { signal: "datum.name" },
            fill: [
              { test: "datum.id === active", value: "red" },
              { test: "indata('selected', 'id', datum.id)", signal: "colorIn" },
              {
                test: "indata('selected', 'ancestors.id', datum.id)",
                signal: "colorIn"
              },

              { value: "#333" }
            ]
          }
        }
      }
    ]
  }
});
```

```ts
// 사용법
<TagTreeChart
  data={tagChartData}
  actions={false}
  height={resultChartHeight}
  renderer={"svg"}
></TagTreeChart>
```