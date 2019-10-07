---
title: hello-d3
date: "2019-10-01T10:00:03.284Z"
---

# Intro
D3는 데이터 주도 문서 (data-driven docuement)의 약자이다. 
D3.js는 웹으로 접근할 수 있고 데이터 시각화를 정교하게 하려는 요구를 만족하려 만들어졌다. 데이터 시각화라고 하면 지도, 대화형 다이어그램, 기타 도구와 콘텐츠가 뉴스, 데이터 대시보드, 보고서, 그 밖에 웹에서 보는 모든것과 통합된 것을 의미한다. 

D3의 장점은 전통적인 차트를 그리기 위한 벡터 그래픽은 물론 표, 리스트, 문단 등 전통적인 HTML 요소, 나아가 지리 공간과 네트워크도 시각화할 수 있다는 점이다. 

## D3는 셀렉션과 바인딩이다. 

- 셀렉션 : 셀렉션은 데이터셋과 해당 데이터셋을 텍스트, 혹은 크기와 색상으로 표현하고자 할 때 이 모든걸 담은 묶음이다. 이 묶음 단위로 이동, 색상 변경, 데이터 값 변경을 수행하게 된다. D3의 힘은 셀렉션으로 데이터와 웹 페이지 요소를 결합하는 능력에서 나온다. 

```javascript
// 데이터가 없는 셀렉션
// d3.select(), d3.selectAll() 셀렉션 코드 
// 부모 dom은 html이다.
const test = d3.selectAll('circle.a').style('fill', 'red').attr('cx', 100)
console.log(test)

// d3.select('div#ID').selectAll('span') 일떄 부모는 div#ID 이다.

// Pt를 생성자로 두고 있는 객체
/*
{
  _groups: Array(1)
    0: NodeList(1)
      0: circle,
  _parents: [html]
}
*/
```



- 바인딩 : 셀렉션에 데이터를 연결하는 작업을 바인딩이라고 한다. 

```javascript
const test = d3.selectAll('div').data([1,5,11,3]).style('background', 'red').attr('class', 'b')
console.log('test', test)
/*
{
  _enter: Array(1)
    0: Array(4)
      1: rt {ownerDocument: document, namespaceURI: "http://www.w3.org/1999/xhtml", _next: null, _parent: html, __data__: 5}
      2: rt {ownerDocument: document, namespaceURI: "http://www.w3.org/1999/xhtml", _next: null, _parent: html, __data__: 11}
      3: rt {ownerDocument: document, namespaceURI: "http://www.w3.org/1999/xhtml", _next: null, _parent: html, __data__: 3}
  _exit: [empty]
  _groups: Array(1)
    0: Array(4)
      0: div#borderdiv.b
  _parents: [html]
}
/*
```

## D3는 바인딩된 데이터로 웹 페이지 요소의 외형을 유도한다. 

HTML 요소의 D3 셀렉션을 이용하거나 선택적으로 데이터를 바인딩하고 페이지의 구조와 모습을 변경한다. 구조가 변경되면 사용자가 반응하게 되며, 사용자의 반응은 페이지의 콘텐츠를 더 많이 바뀌게 한다. 


# 정보 시각화 데이터 흐름

## 데이터를 가져와 적절한 형태로 변환

데이터 시각화 절차 : 로딩 - 포맷 - 측정 - 생성 - 갱신 

### 로딩

- 포멧에 따른 로딩 메서드 : d3.text(), d3.xml(), d3.json(), d3.csv(), d3.html()

> d3.json()은 promise를 리턴한다. promise를 다루듯이 처리 하면 된다. 

### 데이터 포맷팅

- 정략적 데이터
- 범주 데이터
- 위상 데이터
- 기하학적 데이터 
- 날짜/시간 데이터
- 원시 데이터

### 데이터 변환

- 캐스팅(데이터 형변환) : 하나의 데이터형에서 다른 데이터형으로 변환하는 것
- 정규화(스케일과 규모 변경) : 데이터를 화면에 표기할 수 있도록 정규화
  - 스케일은 도메인(domain) 과 레인지(range)를 가졌다.

```javascript
const newRamp = d3.scale.linear().domain([500000, 13000000]).range([0,500])
newRamp(1000000) // 20
newRamp(9000000) // 340

newRamp.invert(313) // 8,325,000
```

- 비닝(데이터 분류) : 일련의 범위에 있는 값으로 그룹화함으로써 정량적 데이터를 범주로 분류하는 것도 유용하다.
  - 배열을 같은 크기의 부분으로 나누어 변윗값(quantile)을 사용할 수도 있다.

```javascript
const sampleArray = [423, 124, 66, 424, 58, 10, 900, 44, 1]
const qScale = d3.scale.quantile().domain(sampleArray).range([0,1,2])
qScale(423) // 2
qScale(20) // 0
qScale(10000) // 2
```

- 내포 : 데이터에 공통된 속성으로 데이터를 분연속적인 범주에 분류할 수 있다는 생각에서 출발한다. 

```javascript
d3.json('tweets.json').then(data => {
    const tweetData = data.tweets
    const nestedTweets = d3.nest().key(el => el.user).entries(tweetData)

    console.log(nestedTweets)
  })

/*
[
  0: {key: "Al", values: Array(3)}
  1: {key: "Roy", values: Array(4)}
  2: {key: "Pris", values: Array(2)}
  3: {key: "Sam", values: Array(1)}
]
*/
```

### 데이터 측정

- 데이터를 로딩후엔 데이터를 측정하고 정렬을 해야한다. 
- 속성의 최솟값, 최댓값, 이름뿐만 아니라 특정 속성값의 분산을 알아내는 일은 중요하다. 
- D3에서는 일반적으로 배열에 들어 있는 데이터의 특정 속성의 상댓값에 따라 크기와 위치를 정한다. 

```javascript
const testArray = [88, 10000, 1, 75, 12, 35]
d3.min(testArray, el => el) // 배열에서 최솟값인 1을 반환한다. 
d3.max(testArray, el => el) // 최댓값 10000을 반환한다. 
d3.mean(testArray, el => el) // 평균값을 구한다. 

d3.extent(testArray, el => el) // [최솟값, 최댓값]
```

## 데이터 바인딩

- 셀렉션은 하나 이상의 DOM 요소로 구성되며 연관된 데이터를 가질 수도 있다.
- 데이터에 기초해 데이터를 생성하거나 삭제할 수 있다.

### data()

- 데이터 셋에 들어있는 각 데이터를 DOM 요소와 연결한다. (DOM.__data__ 프로퍼티로 조회 가능)
- `data()` 를 호출하면 셀렉션에 `_enter`와 `_exit` 프로퍼티가 생성된다.
- `_enter` 프로퍼티에는 DOM에 매칭 되지 못한 데이터들을 기반으로 `rt` 객체를 만들어 둔다. 

```javascript
_enter: Array(1)
  0: Array(4)
    1: rt {ownerDocument: document, namespaceURI: "http://www.w3.org/1999/xhtml", _next: null, _parent: html, __data__: 5}
    2: rt {ownerDocument: document, namespaceURI: "http://www.w3.org/1999/xhtml", _next: null, _parent: html, __data__: 11}
    3: rt {ownerDocument: document, namespaceURI: "http://www.w3.org/1999/xhtml", _next: null, _parent: html, __data__: 3}
    length: 4
```

### enter(), exit()

- 데이터를 셀렉션에 바인딩할 때 데이터의 값 개수가 DOM 요소 수보다 많거나 적을 수 있다. 많으면 enter() 메서드를 호출해 셀렉션에 해당 요소가 없는 값을 어떻게 처리 해야 할지 정의한다. 
- `enter()` 메서드는 사용할 데이터에 기초해 새로운 요소를 생성하는 방법을 정의하고 `exit()` 메서드에서는 데이터를 갖지 못하는 기존 요소를 어떻게 삭제할지 정의한다.
- `enter()` 메서드를 사용하면 기존 셀렉션에 있는 `_enter` 속성에 있는 녀석을 참조해서 또다른 셀렉션을 반환한다. 
- 데이터가 Dom 보다 많을때 `enter()` 이후 체이닝 메서드에는 추가될 DOM에만 추가 속성들이 적용이 된다. 

### append(), insert()

- append() 메서드로 요소를 정의하고 추가할 수 있다. 
- insert() 메서드는 요소를 추가할 위치를 지정할 수 있다.

### attr()

- 스타일과 속성을 바꾼다. 이때, 요소 모두에 적용한다는 점에 주의 하자. 


## 데이터 표현 스타일, 속성, 콘텐츠


### 간단한 시각화 예제

```javascript
d3.json('tweets.json').then(data => {
      const tweetData = data.tweets
      dataViz(tweetData)      
    })

function dataViz(incomingData) {
  const nestedTweets = d3.nest().key(el => el.user).entries(incomingData)
  nestedTweets.forEach(el => {
    el.numTweets = el.values.length
  })

  const maxTweets = d3.max(nestedTweets, el => el.numTweets)
  const yScale = d3.scaleLinear().domain([0, maxTweets]).range([0, 100])  // 높이 값 스케일 정의

  d3.select('svg')
    .selectAll('rect')
    .data(nestedTweets)
    .enter()
    .append('rect')
    .attr('width', 50)
    .attr('height', d => yScale(d.numTweets))
    .attr('x', (d,i) => i * 60)
    .attr('y', d => 100 - yScale(d.numTweets))
    .style('fill', 'blue')
    .style('stroke', 'red')
    .style('stroke-width', '1px')
    .style('opacity', .25)

}

```


### 채널 설정

#### '다변량' 데이터란?

- 각각의 데이터점이 여러 데이터 특성을 가졌음을 의미
- 예를 들어, 의료기록은 0에서 100까지의 점수 하나로 표현하지 않는 대신 건강한 정도를 나타내는 여러 척도로 구성한다.
- 하나의 도형으로 여러 데이터점을 표현 할 수 있는 기법을 개발해야 한다. 
- 도형 하나가 데이터를 시각적으로 잘 표현하는 방법을 전문 용어로 '채널' 이라고 하며, 사용하는 데이터에 따라 시각적으로 잘 표현할 수 있는 채널이 따로 있다. 

#### 채널

- 데이터를 표현할 때 가장 잘 표현하는 시각적 방법이 무엇인지 고민해야 한다. 
- 채널에는 높이, 너비, 면적, 색상(색상, 채도, 명도), 위치, 모양 등이 있어 다양한 정보를 표현하는데 잘 맞는다. 

### 산포도 예제 

```javascript
function dataViz(incomingData) {
      // 데이터 추가 
      incomingData.forEach(el => {
        el.impact = el.favorites.length + el.retweets.length
        el.tweetTime = new Date(el.timestamp)
      })

      // 데이터 측정
      const maxImpact = d3.max(incomingData, el => el.impact)
      const arrStartEnd = d3.extent(incomingData, el => el.tweetTime)

      // 스케일 설정
      const timeRamp = d3.scaleTime().domain(arrStartEnd).range([20,480]) // x축
      const yScale = d3.scaleLinear().domain([0, maxImpact]).range([0, 460]) // y축
      const radiusScale = d3.scaleLinear().domain([0, maxImpact]).range([1,20]) // 반지름 (트윗 영향도)
      const colorScale = d3.scaleLinear().domain([0, maxImpact]).range(['white', 'red']) // 컬러 (트윗 영향도)
      
      // 드로잉
      d3.select('svg')
        .selectAll('circle')
        .data(incomingData)
        .enter()
        .append('circle')
        // 크기, 색상, 수직 위치는 모두 영향력에 기반을 둔다.
        .attr('r', d => radiusScale(d.impact))
        .attr('cx', d => timeRamp(d.tweetTime))
        .attr('cy', d => 480 - yScale(d.impact) + 1)
        .style('fill', d => colorScale(d.impact))
        .style('stroke', 'black')
        .style('stroke-width', '1px')
    }
```


