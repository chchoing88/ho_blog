---
title: hello-d3
date: '2019-10-01T10:00:03.284Z'
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
const test = d3
  .selectAll('circle.a')
  .style('fill', 'red')
  .attr('cx', 100)
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

데이터 시각화 절차 : 로딩 - 포맷 - 측정 - 생성 - 갱신

## 다양한 포멧의 외부 파일에서 데이터 로딩하기

- 포멧에 따른 로딩 메서드 : d3.text(), d3.xml(), d3.json(), d3.csv(), d3.html()

> d3.json()은 promise를 리턴한다. promise를 다루듯이 처리 하면 된다.

## 데이터 포맷팅

- 정략적 데이터
- 범주 데이터
- 위상 데이터
- 기하학적 데이터
- 날짜/시간 데이터
- 원시 데이터

## 데이터 변환

- 캐스팅(데이터 형변환) : 하나의 데이터형에서 다른 데이터형으로 변환하는 것
- 정규화(스케일과 규모 변경) : 데이터를 화면에 표기할 수 있도록 정규화
  - 스케일은 도메인(domain) 과 레인지(range)를 가졌다.

```javascript
const newRamp = d3.scale
  .linear()
  .domain([500000, 13000000])
  .range([0, 500])
newRamp(1000000) // 20
newRamp(9000000) // 340

newRamp.invert(313) // 8,325,000
```

- 비닝(데이터 분류) : 일련의 범위에 있는 값으로 그룹화함으로써 정량적 데이터를 범주로 분류하는 것도 유용하다.
  - 배열을 같은 크기의 부분으로 나누어 변윗값(quantile)을 사용할 수도 있다.

```javascript
const sampleArray = [423, 124, 66, 424, 58, 10, 900, 44, 1]
const qScale = d3.scale
  .quantile()
  .domain(sampleArray)
  .range([0, 1, 2])
qScale(423) // 2
qScale(20) // 0
qScale(10000) // 2
```

- 내포 : 데이터에 공통된 속성으로 데이터를 분연속적인 범주에 분류할 수 있다는 생각에서 출발한다.

```javascript
d3.json('tweets.json').then(data => {
  const tweetData = data.tweets
  const nestedTweets = d3
    .nest()
    .key(el => el.user)
    .entries(tweetData)

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

## 데이터 측정

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

### select(), selectAll()

- select() 의 경우에는 셀렉션 객체의 \_groups 프로퍼티에 요소로 HTMLElement나 SVGElement가 들어가 있는 배열이다. ([circle])
- selectAll() 의 경우에는 셀력센 객체의 \_groups 프로퍼티에 요소로 NodeList 객체가 들어간다. (NodeList)

```javascript
// 4개의 g 태그 자식으로 circle이 3개씩 있다고 가정해보자.
// 아래와 같이 셀렉션을 지정했을때
d3.selectAll('g').select('circle')

/*
_groups: Array(1)
  0: (4) [circle, circle, circle, circle] g태그(부모) 별로 의 첫번째 circle만 가져옴
*/

d3.selectAll('g').selectAll('circle')
/*
_groups: Array(4)
  0: NodeList(3) [circle, circle, circle] 0번 g태그
  1: NodeList(3) [circle, circle, circle] 1번 g태그
  2: NodeList(3) [circle, circle, circle] 2번 g태그
  3: NodeList(3) [circle, circle, circle] 3번 g태그
*/
```

### data()

- 데이터 셋에 들어있는 각 데이터를 DOM 요소와 연결한다. (DOM.**data** 프로퍼티로 조회 가능)
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

- `data()` 메서드가 데이터를 셀렉션에 어떻게 바인딩할지 지정해야 한다. 기본적으로 data()는 해당 데이터 값이 배열에서 어디에 위치하는가에 기초해 바인딩을 진행한다.
- 일반적으로 배열 위치보다는 데이터 객체 자체의 값 등 어떤 의미있는 것을 바인딩 키로 사용해야 한다.

```javascript
d3.select('svg')
  .selectAll('circle')
  .data(incomingData, function(d) {
    return d.key
  })
```

### enter(), exit(), update()

- 데이터를 셀렉션에 바인딩할 때 데이터의 값 개수가 DOM 요소 수보다 많거나 적을 수 있다. 많으면 enter() 메서드를 호출해 셀렉션에 해당 요소가 없는 값을 어떻게 처리 해야 할지 정의한다.
- `enter()` 메서드는 사용할 데이터에 기초해 새로운 요소를 생성하는 방법을 정의하고 `exit()` 메서드에서는 데이터를 갖지 못하는 기존 요소를 어떻게 삭제할지 정의한다.
- `enter()` 메서드를 사용하면 기존 셀렉션에 있는 `_enter` 속성에 있는 녀석을 참조해서 또다른 셀렉션을 반환한다.
- 데이터가 Dom 보다 많을때 `enter()` 이후 체이닝 메서드에는 추가될 DOM에만 추가 속성들이 적용이 된다.
- `exit()` 메서드에는 `remove()` 메서드를 사용할 수 있다.

```javascript
d3.selectAll('g')
  .data([1, 2, 3, 4])
  .exit()
  .remove()
```

- `update()` 는 다음 코드와 같이 <g> 그룹 안에 있는 각각의 <text> 요소를 새로 바인딩된 데이터로 갱신하면 화면 요소가 변경된다.

```javascript
// 자식 요소에 대한 데이터 바인딩을 다시 초기화 하려고 부모 요소에 대해 selectAll()한 후 자식 요소에 대한 하위 셀렉션 요소를 만들었다.
d3.selectAll('g')
  .select('text')
  .text(d => d)
```

- 부모 요소에서 자식 요소 셀렉션을 만들게 되면 자동으로 data가 할당되게 된다.
- 데이터를 다시 바인딩하는 방법은 부모 요소를 선택하고 나서 자식요소를 선택하면 데이터를 다시 바인딩한다. 그러나 부모 요소 밑에 아주 많은 자식 요소가 있고 `selectAll()` 메서드는 데이터를 다시 바인딩하지 않으므로 부모 요소의 데이터를 자식들에게 다시 바인딩 하려면 다음과 같이 한다.

```javascript
// d3.selectAll('g').data([1,2,3,4]).selectAll('path') 는 부모의 데이터를 받지 않는다.
// d3.selectAll('g').data([5,6,7,8]).select('path') 는 g의 데이터를 path로 내려 보낼 수 있다.
d3.selectAll('g').each(function(d) {
  // 데이터 [5,6,7,8] 이 있다고 가정하에
  d3.select(this)
    .selectAll('path')
    .datum(d) // 데이터 하나만을 요소에 바인딩할때 datum() 메서드 사용, 데이텀: 데이터의 단수형을 말한다.
})

// or
d3.select('svg')
  .selectAll('g')
  .data([5, 6, 7, 8])
  .each(function(d) {
    d3.select(this)
      .selectAll('circle')
      .each(function(p) {
        d3.select(this).data([d])
      })
  })
```

### append(), insert()

- append() 메서드로 요소를 정의하고 추가할 수 있다.
- insert() 메서드는 요소를 추가할 위치를 지정할 수 있다.

### attr()

- 스타일과 속성을 바꾼다. 이때, 요소 모두에 적용한다는 점에 주의 하자.

## 데이터 속성에 기초한 그래프 그리기

```javascript
d3.json('tweets.json').then(data => {
  const tweetData = data.tweets
  dataViz(tweetData)
})

function dataViz(incomingData) {
  const nestedTweets = d3
    .nest()
    .key(el => el.user)
    .entries(incomingData)
  nestedTweets.forEach(el => {
    el.numTweets = el.values.length
  })

  const maxTweets = d3.max(nestedTweets, el => el.numTweets)
  const yScale = d3
    .scaleLinear()
    .domain([0, maxTweets])
    .range([0, 100]) // 높이 값 스케일 정의

  d3.select('svg')
    .selectAll('rect')
    .data(nestedTweets)
    .enter()
    .append('rect')
    .attr('width', 50)
    .attr('height', d => yScale(d.numTweets))
    .attr('x', (d, i) => i * 60)
    .attr('y', d => 100 - yScale(d.numTweets))
    .style('fill', 'blue')
    .style('stroke', 'red')
    .style('stroke-width', '1px')
    .style('opacity', 0.25)
}
```

### '다변량' 데이터란?

- 각각의 데이터점이 여러 데이터 특성을 가졌음을 의미
- 예를 들어, 의료기록은 0에서 100까지의 점수 하나로 표현하지 않는 대신 건강한 정도를 나타내는 여러 척도로 구성한다.
- 하나의 도형으로 여러 데이터점을 표현 할 수 있는 기법을 개발해야 한다.
- 도형 하나가 데이터를 시각적으로 잘 표현하는 방법을 전문 용어로 '채널' 이라고 하며, 사용하는 데이터에 따라 시각적으로 잘 표현할 수 있는 채널이 따로 있다.

### 채널

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
  const timeRamp = d3
    .scaleTime()
    .domain(arrStartEnd)
    .range([20, 480]) // x축
  const yScale = d3
    .scaleLinear()
    .domain([0, maxImpact])
    .range([0, 460]) // y축
  const radiusScale = d3
    .scaleLinear()
    .domain([0, maxImpact])
    .range([1, 20]) // 반지름 (트윗 영향도)
  const colorScale = d3
    .scaleLinear()
    .domain([0, maxImpact])
    .range(['white', 'red']) // 컬러 (트윗 영향도)

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

# 데이터 주도 설계와 상호작용성

## 이벤트

- on() 메서드는 바인딩 된 데이터를 함수에 자동으로 전달할 수 있다.

```javascript
teamG.on('mouseover', highlightRegion) // selection.on
function highlightRegion(targetData) {
  d3.selectAll('g.overallG')
    .select('circle')
    .style('fill', d => (d.region === targetData.region ? 'red' : 'gray'))
}
```

## 그래프 전환

- 그래픽 요소가 많고 상호작용성이 높은 웹 페이지를 만들때 전환을 부드럽게 처리하자.
- 전환은 `delay()` 메서드로 일정 시간 후에 발생하도록 설정하거나 `duration()` 메서드로 일정 시간 발생하도록 설정할 수 있다.

```javascript
d3.selectAll('g.overallG')
  .select('circle')
  .transition()
  .duration(1000)
  .attr('r', d => radiusScale(d[datapoint]))
```

- delay() 메서드는 전환할 때의 시작 시각을 늦출 수 있다.

```javascript
// 원이 과장된 크기로 커졌다가 바인딩된 데이터 셋에 정의한 크기로 줄어들도록 전환효과 구현
teamG
  .append('circle')
  .attr('r', 0)
  .transition()
  .delay((d, i) => i * 100)
  .duration(500)
  .attr('r', 40)
  .transition()
  .duration(500)
  .attr('r', 20)
  .style('fill', 'pink')
  .style('stroke', 'black')
  .style('stroke-width', '1px')
```

## DOM 조작

셀렉션 안에 있는 DOM 요소에 직접 접근하려면 다음 다 방법 중 하나를 사용한다.

- 인라인 함수에서 this 이용

```javascript
d3.select('circle').each((d, i) => {
  console.log(d) // 원에 바인딩 데이터
  console.log(i) // 요소들을 생성하는데 사용한 객체의 배열 인덱스
  console.log(this) // <circle> DOM 요소 자체
})
```

- node() 메서드 이용

```javascript
d3.select('circle').node()
```

> SVG는 z-레벨이 없으므로 요소를 그리는 순서가 DOM 순서에 의해 결정된다.

아래 코드는 `text`와 `circle` DOM에 `active` 클래스를 붙여서 폰트 사이즈와 색상을 변경하는 코드이다.

```javascript
function highlightRegion2(targetData, i) {
  d3.select(this)
    .select('text')
    .classed('active', true)
    .attr('y', 10)
  d3.selectAll('g.overallG')
    .select('circle')
    .each(function(d, i) {
      // 안에서 this는 해당 DOM을 위해 사용해야 하니 화살표 함수를 지양하자.
      d.region === targetData.region
        ? d3.select(this).classed('active', true)
        : d3.select(this).classed('inactive', true)
    })
}
```

이렇게 코드를 짰을 경우 텍스트가 커지면서 다른 `circle` DOM 요소 밑으로 가려지는 현상이 발생된다.
따라서 해당 요소를 다시 부모에 append 시켜주어야 한다.

```javascript
function highlightRegion3(targetData, i) {
  d3.select(this)
    .select('text')
    .classed('highlight', true)
    .attr('y', 10)
  d3.selectAll('g.overallG')
    .select('circle')
    .each(function(d, i) {
      // 안에서 this는 해당 DOM을 위해 사용해야 하니 화살표 함수를 지양하자.
      d.region === targetData.region
        ? d3.select(this).classed('active', true)
        : d3.select(this).classed('inactive', true)
    })

  this.parentElement.appendChild(this) // 다시 부모의 마지막에 추가해준다.
}
```

## 색상 선택

- 일반적으로 웹에서 색상은 빨간색, 녹색, 파란색을 16진수, RGB, CSS 색상명 중 하나로 표현한다.
- D3는 색상을 이용할 수 있는 몇 가지 헬퍼 함수를 제공한다.
- D3 함수로 동적으로 색상이나 투명도를 변경하려면 인라인 스타일을 사용해야 한다.

```javascript
function highlightRegion3(targetData, i) {
  const teamColor = d3.rgb('pink') // pink 색상

  d3.select(this)
    .select('text')
    .classed('highlight', true)
    .attr('y', 10)
  d3.selectAll('g.overallG')
    .select('circle')
    .style('fill', d => {
      return d.region === targetData.region
        ? teamColor.darker(0.75)
        : teamColor.brighter(0.5) // 색상에서 밝기 조절
    })
  this.parentElement.appendChild(this) // 다시 부모의 마지막에 추가해준다.
}
```

### HSL 색상 모델

- 색상(hue), 채도(saturation), 밝기(lightness)
- d3.hsl() 메서드는 HSL 색상 객체를 생성한다.
- HSL을 이용하면 D3 함수로 분홍색을 진하게 만들 때나 색상 그레이디언트 또는 혼합 색상을 만들때, 우중충한 색상이 나오는 것을 피할 수 있다.

## 색상 혼합

보간은 두 점을 연결하는 방법을 의미한다. 여기서 말하는 연결은 궤적을 생성한다는 뜻이다. 보간이 필요한 이유는 정보를 압축한 것을 다시 복원하기 위함이다.

특징점이라 불리는 선의 모양 복원에 꼭 필요한 점듦나 취해서 저장하는데 이 과정을 sampling이라 부른다. 일반적으로 sampling은 일정 시간 주기로 선의 점을 취하는 방식을 사용하는데 녹음 기술에서 많이 쓴다.

```javascript
const ybRamp = d3
  .scaleLinear()
  .domain([0, 4])
  .range(['yellow', 'blue'])
const testData = [0, 1, 2, 3]

d3.select('svg')
  .selectAll('circle')
  .data(testData)
  .enter()
  .append('circle')
  .attr('r', 20)
  .attr('cy', 50)
  .attr('cx', (d, i) => 60 * i + 30)
  .style('fill', d => ybRamp(d))
```

여기서 노랑색에서 파란색으로 자연스럽게 색이 나오길 원하지만 위 처럼 코드를 작성하면 스케일의 기본 보간자는 빨간색, 녹색, 파란색 채널을 그저 숫자로 처리한다.

아래 코드는 HCL 에 기초해서 보간법을 적용한다.

```javascript
// 스케일의 기본 보간법이 마음에 들지 않을 때는 직접 지정한다.
// 특히 RGB값을 보간하는 방법 이외의 방법으로
// 색상 스케일을 생성하고자 할 때는 직접 지정해야 한다.
const ybRamp = d3
  .scaleLinear()
  .interpolate(d3.interpolateHsl)
  .domain([0, 4])
  .range(['yellow', 'blue'])
const testData = [0, 1, 2, 3]

d3.select('svg')
  .selectAll('circle')
  .data(testData)
  .enter()
  .append('circle')
  .attr('r', 20)
  .attr('cy', 50)
  .attr('cx', (d, i) => 60 * i + 30)
  .style('fill', d => ybRamp(d))
```

D3는 그밖에도 HCL과 LAB 색상 모델을 지원하는데, 파란색과 노란색의 중간 색상을 만들어 내는 방식이 다르다.
먼저 HCL 그레이디언트는 색상(hue), 농도(chroma), 휘도(luminance) 에 기초해 중간색을 보간한다.
LAB 그레이디언트는 L과 A,B에 기초해 중간색을 보간한다. LAB에서 L은 밝기 light를 의미하고 A, B는 색의 대응공간 (color opponent space)를 의미한다.

우리는 종종 색상 그레이디언트를 만들어 수치형 요소를 색상에 매핑시킨다. 이때, D3 이산 색상 스케일을 사용하는 편이 좋다.
이 스케일은 먼저 범줏값을 특정 색상에 매핑하는 `d3.schemeCategory10`(색상 팔레트-10가지 색상이 이미 정의되어 있는 팔레트) 이라는 새로운 스케일을 사용해야 한다.
이 스케일은 도메인이 이미 10가지 눈에 띄는 색상으로 정의돼 있으므로 도메인을 변경할 수 없는 정량화 스케일처럼 작동한다.
그 대신 이 색상들에 매핑하고자 하는 값들로 구성된 스케일을 만든다.

```javascript
// 문자형 team과 region을 제외한 모든 속성을 가져온다.
d3.select('#controls')
  .selectAll('button.teams')
  .data(dataKeys)
  .enter()
  .append('button')
  .on('click', buttonClick) // on 메서드는 바인딩 된 데이터를 함수에 자동으로 전달한다.
  .html(d => d)

function buttonClick(datapoint) {
  const maxValue = d3.max(incomingData, d => parseFloat(d[datapoint]))

  // const tenColorScale = d3.schemeCategory10(['UEFA', 'CONMEBOL', 'CAF', 'AFC']) //
  const tenColorScale = d3.scaleOrdinal(d3.schemeCategory10)
  const radiusScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([2, 20])

  d3.selectAll('g.overallG')
    .select('circle')
    .transition()
    .duration(1000)
    .style('fill', d => tenColorScale(d.region))
    .attr('r', d => radiusScale(d[datapoint]))
}
```

## 미리 생성한 콘텐츠

### 그림

```javascript
d3.selectAll('g.overallG')
  .insert('image', 'text') // 텍스트 요소 앞에 그림을 넣으라고 D3에 알려줌
  .attr('xlink:href', d => `images/${d.team}.png`)
  .attr('width', '45px')
  .attr('height', '20px')
  .attr('x', '-22')
  .attr('y', '-10')
```

### HTML

```javascript
// css에 정의된 ID를 갖는 <div> 요소를 새로 만들고
// modal.html에서 읽은 HTML 내용으로 채운다.
d3.text('resources/modal.html', data => {
  d3.select('body')
    .append('div')
    .attr('id', 'modal')
    .html(data)
})
teamG.on('click', teamClick)

function teamClick(d) {
  d3.selectAll('td.data')
    .data(d3.values(d))
    .html(p => p)
}
```

### 외부 SVG

```javascript
d3.html('resources/icon_1907.svg', loadSVG)

function loadSVG(svgData) {
  d3.selectAll('g.overallG').each(function(d) {
    const gParent = this
    d3.select(svgData)
      .selectAll('path')
      .each(function() {
        gParent.appendChild(this.cloneNode(true))
      })
    // selectAll 메서드는 데이터를 다시 바인딩 하지 않는다.
    d3.select(this)
      .selectAll('path')
      .datum(d) // 데이텀 : 단어의 단수형을 말한다. 데이터 하나만을 요소에 바인딩할때 사용.

    const tenColorScale = d3.scaleOrdinal(d3.schemeCategory10)
    d3.selectAll('path')
      .style('fill', p => tenColorScale(p.region))
      .style('stroke', 'black')
      .style('stroke-width', '2px')
  })
}
```


### 예제 

```javascript
d3.csv("worldcup.csv", data => data).then(arrData => overallTeamViz(arrData))
    
function overallTeamViz(incomingData) {
  d3.select("svg")
    .append("g")
    .attr("id", "teamsG")
    .attr("transform", "translate(50,300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", function (d,i) {return "translate(" + (i * 50) + ", 0)"});
      
  const teamG = d3.selectAll("g.overallG");
        
  teamG
    .append("circle")
    .attr('r', 0)
    .transition()
    .delay((d,i) => i * 100)
    .duration(500)
    .attr('r', 40)
    .transition()
    .duration(500)
    .attr("r", 20)
    // .style("fill", "pink") css 로 처리
    // .style("stroke", "black")
    // .style("stroke-width", "1px")
  
  teamG
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", 30)
    // .style("font-size", "10px") css 로 처리
    .text(function(d) {return d.team})

  // incomingData[0] 은 객체 
  const dataKeys = d3.keys(incomingData[0]).filter(el => el !== 'team' && el !== 'region')

  // 문자형 team과 region을 제외한 모든 속성을 가져온다.
  d3.select('#controls').selectAll('button.teams')
    .data(dataKeys).enter()
    .append('button')
    .on('click', buttonClick) // on 메서드는 바인딩 된 데이터를 함수에 자동으로 전달한다. 
    .html(d => d)

  function buttonClick(datapoint) {
    
    const maxValue = d3.max(incomingData, d => parseFloat(d[datapoint]))
    
    // const tenColorScale = d3.schemeCategory10(['UEFA', 'CONMEBOL', 'CAF', 'AFC']) //
    const tenColorScale = d3.scaleOrdinal(d3.schemeCategory10)
    const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2,20])

    d3.selectAll('g.overallG').select('circle').transition().duration(1000)
      .style('fill', d => tenColorScale(d.region))
      .attr('r', d => radiusScale(d[datapoint]))
  }



  teamG.on('mouseover', highlightRegion3) 
  teamG.on('mouseout', unHighlight) 
  function highlightRegion(targetData) {
    d3.selectAll('g.overallG').select('circle')
      .style('fill', d => d.region === targetData.region ? 'red' : 'gray' )
  }

  function highlightRegion2(targetData, i) {
    d3.select(this).select('text').classed('active', true).attr('y', 10)
    d3.selectAll('g.overallG').select('circle').each(function (d,i) { // 안에서 this는 해당 DOM을 위해 사용해야 하니 화살표 함수를 지양하자.
      d.region === targetData.region ? d3.select(this).classed('active', true) : d3.select(this).classed('inactive', true)
    })
  }

  function highlightRegion3(targetData, i) {
    const teamColor = d3.rgb('pink')

    d3.select(this).select('text').classed('highlight', true).attr('y', 10)
    // d3.selectAll('g.overallG').select('circle').each(function (d,i) { // 안에서 this는 해당 DOM을 위해 사용해야 하니 화살표 함수를 지양하자.
    //   d.region === targetData.region ? d3.select(this).classed('active', true) : d3.select(this).classed('inactive', true)
    // })
    d3.selectAll('g.overallG').select('circle')
      .style('fill', d => {
        return d.region === targetData.region ? teamColor.darker(.75) : teamColor.brighter(0.5)
      })
    this.parentElement.appendChild(this) // 다시 부모의 마지막에 추가해준다.
  }

  function unHighlight() {
    d3.selectAll('g.overallG').select('circle').attr('class', '')
    d3.selectAll('g.overallG').select('text').classed('highlight', false).attr('y', 30)
  }

}

// 색상 보간법
const ybRamp = d3.scaleLinear().interpolate(d3.interpolateHsl).domain([0,4]).range(['yellow', 'blue'])
const testData = [0,1,2,3]

d3.select('svg').selectAll('circle').data(testData).enter().append('circle')
  .attr('r', 20)
  .attr('cy', 50)
  .attr('cx', (d,i) => (60*i)+30)
  .style('fill', d => ybRamp(d))
```

# 차트

- 생성기 : 데이터를 입력받고 이 데이터에 기초한 화면 객체를 생성하는데 필요한 SVG 그림 코드를 반환한다.(SVG의 속성 문자열 값) 생성기들은 <path> 요소의 d 속성을 작성하는데 필요한 과정을 추상화함으로써 복잡한 <path> 요소의 생성 과정을 단순하게 만들어줍니다.
d3.line(), d3.area(), d3.arc() 와 같은게 있습니다.

- 컴포넌트 : 컴포넌트는 특정 차트 컴포넌트를 그리는데 필요한 일련의 화면 객체를 생성합니다. d3에서 가장 많이 사용하는 컴포넌트는 `d3.axisRight`와 같은 종류들입니다. 이것은 함수에 사용한 스케일과 설정에 기초해 축을 그리는데 필요한 수 많은 <line>, <path>, <g>, <text> 요소를 생성한다.

- 레이아웃 : 레이아웃은 일련의 데이터, 그리고 생성기로 구성된 배열을 입력받아 특정 위치와 크기로 그리는데 필요한 데이터 속성을 동적 혹은 정적으로 추가한다. 레이아웃을 생성하고 데이터를 넣어주면 해당 차트를 그리는데 필요한 값들을 자동으로 생성해준다. 

## 축 생성

- 축 생성에는 다음과 같은 메서드가 제공된다. x축 : d3.axisTop(), d3.axisBottom(), y축 : d3.axisLeft(), d3.axisRight()가 존재한다.
- x축에 해당하는 d3.axisTop(), d3.axisBottom()는 기본적으로 svg 영역의 상단에 x축이 생성이 되고 Top과 Bottom의 차이는 tick의 방향이라고 생각 하면 되겠다 Top은 tick이 아래에서 위로 향하고 Bottom은 위에서 아래로 향하게 된다. 
- x축을 d3.axisTop() 으로 생성하게 되면 레이블과 눈금을 볼 수 없다. 이 요소들이 그림 영역 밖에 그려지기 때문이다. 그래서 x축을 아래로 이동하려면 translate 를 사용해야한다.

```javascript
const yAxis = d3.axisRight().scale(yScale)
const xAxis = d3.axisBottom().scale(xScale)
d3.select('svg').append('g').attr('id', 'yAxisG').call(yAxis)
d3.select('svg').append('g').attr('id', 'xAxisG').call(xAxis)
```

x축을 바닥으로 옮기고 y축을 오른쪽으로 옮겼을 때의 코드는 아래와 같다.

```javascript
const scatterData = [{friends: 5, salary: 22000}, {friends: 3, salary: 18000}, {friends: 10, salary: 88000}, {friends: 0, salary: 180000}, {friends: 27, salary: 56000}, {friends: 8, salary: 74000}]

xExtent = d3.extent(scatterData, function(d) {return d.salary});
yExtent = d3.extent(scatterData, function(d) {return d.friends});
xScale = d3.scaleLinear().domain(xExtent).range([20,480]);
yScale = d3.scaleLinear().domain(yExtent).range([480,20]);

// 축 생성
// const yAxis = d3.svg.axis().scale(yScale).orient('right')// y축
const yAxis = d3.axisRight().scale(yScale).tickSize(-460).tickPadding(7)
const xAxis = d3.axisBottom().scale(xScale).tickSize(-460).tickPadding(7)
// const xAxis = d3.axisTop().scale(xScale)
d3.select('svg').append('g').attr('id', 'yAxisG').call(yAxis)
d3.select('svg').append('g').attr('id', 'xAxisG').call(xAxis)


d3.select('#xAxisG').attr('transform', 'translate(0, 480)')
d3.select('#yAxisG').attr('transform', 'translate(480, 0)')

d3.select("svg")
  .selectAll("circle")
  .data(scatterData)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("cx", function(d) {return xScale(d.salary)})
  .attr("cy", function(d) {return yScale(d.friends)})
```

## 점으로 선 그리기

- 기본적으로 선 생성기는 x값 배열과 y값 배열, 두개를 인자로 받는다.
- 선 생성기는 점 배열을 입력 받으므로 각 점의 좌표로 구성된 값을 생성기에 전달해야 한다.
- 선 생성기의 x() 접근자 메서드를 사용해서 x값을 셋팅할수 있고 y() 접근자 메서드를 사용해서 y값을 셋팅할 수 있다.

```javascript
const tweetLine = d3.line() // tweetLine 이 선 생성기
  // 데이터에 대한 접근자를 정의한다.
  // 여기에서는 날짜 속성을 가져와 xScale()에 전달한다.
  .x(d => xScale(d.day))
  .y(d => yScale(y.tweets))

// tweetdata로 로딩된 생성기가 추가한 경로를 그린다.
d3.select('svg')
  .append('path')
  .attr('d', tweetLine(data))
  .attr('fill', 'none')
  .attr('stroke', 'darkred')
  .attr('stroke-width', 2)
```

## 채워진 영역

- SVG에서 선(line)과 채워진 영역(filled areas)는 거의 동일합니다. 단지 그리는 코드 제일 뒤에 'Z'를 추가하거나 도형에 'fill' 스타일이 있으면 닫힌 도형이 됩니다. 
- D3는 d3.line() 생성기로 선을 그리고, d3.area() 생성기로 영역을 그립니다. 두 생성기 모두 <path> 요소를 생성하지만 d3.area()는 경로의 아래 영역을 막아 영역을 만드는 헬퍼 함수를 제공한다. 
- y() 접근자만 셋팅 했을 때 y0에 y를 넣고 y1은 null 셋팅(null을 셋팅한다는 것은 이전에 계산되었던 y0 값을 재사용하겠다는 뜻이다.)한다. 
- x축으로 채워지는 모양을 만들기 위해선 y0, y1 또는 y, y1을 셋팅해주어야 한다. 

```javascript
// y0 접근자 default
function y() {
  return 0
}

// y1 접근자 default
function y(d) {
  return d[1]
}
```

- `path` 의 경로를 닫든 닫지 않든, 영역을 채우든 채우지 않든, 도형과 선을 그릴 때는 대부분 `d3.line()` 을 사용한다. (d 속성의 끝에 Z를 넣거나, fill 속성을 채워준다.) 그러나 `다른 도형의 꼭대기를 바닥`으로 삼아 누적된 도형을 그릴 때는 `d3.area()` 를 사용해야 한다. `d3.area()`는 누적 영역 차트나 스트림 그래프처럼 데이터의 대역을 그리기에 적절하다.

```javascript
d3.csv("movies.csv", data => data).then(arrData => areaChart(arrData))
  
  function areaChart(data) {

    xScale = d3.scaleLinear().domain([1,10.5]).range([20,480]);
    yScale = d3.scaleLinear().domain([0,35]).range([240,20]);


    xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSize(480)
    .tickValues([1,2,3,4,5,6,7,8,9,10]);
    
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
        
    yAxis = d3.axisRight()
    .scale(yScale)
    .ticks(10)
    .tickSize(480)
    //.tickSubdivide(true);
      
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    
    // fillScale = d3.scaleLinear()
    //     .domain([0,5])
    //     .range(["lightgray","black"]);

    var n = 0;
    for (x in data[0]) {
      if (x != "day") {
        
        const movieArea = d3.area()
                      .x(function(d) {
                        return xScale(d.day)
                      })
                      .y0(function(d) {
                        
                        return yScale(-d[x])
                      })
                      .y1(function(d) {
                        // return yScale(simpleStacking(d,x) - d[x]);
                        return yScale(d[x])
                      })
                      .curve(d3.curveCardinal.tension(0))

        d3.select("svg")
          .append("path")
          .attr("id", x + "Area")
          .attr("d", movieArea(data))
          .attr("fill", 'darkgray')
          .attr("stroke", 'lightgray')
          .attr("stroke-width", 2)
          .style("opacity", .5)
          
        n++;
      }
    }    
  }
```

- 위 차트를 누적 차트로 만들면 다음과 같다. 각 영역의 높이는 영화 한 편이 그날 벌어들인 매출액을 나타내며, 각 영역의 밑은 그날 다른 영화들이 벌어들인 매출액의 합계를 나타낸다.

```javascript
d3.csv("movies.csv", data => data).then(arrData => areaChart(arrData))
  
  function areaChart(data) {
    xScale = d3.scaleLinear().domain([0,11]).range([20,480]);
    yScale = d3.scaleLinear().domain([-100,100]).range([480,20]);

    xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSize(480)
    .tickValues([1,2,3,4,5,6,7,8,9,10]);
    
    d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
        
    yAxis = d3.axisRight()
    .scale(yScale)
    .ticks(10)
    .tickSize(480)
          
    d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);
    
    fillScale = d3.scaleLinear()
        .domain([0,5])
        .range(["lightgray","black"]);

    var n = 0;
    for (x in data[0]) {
      if (x != "day") {
        
        const movieArea = d3.area()
                      .x(function(d) {
                        return xScale(d.day)
                      })
                      .y0(function(d) {
                        console.log(simpleStacking(d,x)) // 매번 다른 객체, movie1
                        return yScale(simpleStacking(d,x)-d[x])
                      })
                      .y1(function(d) {
                        // return yScale(simpleStacking(d,x) - d[x]);
                        return yScale(simpleStacking(d,x))
                      })
                      .curve(d3.curveCardinal.tension(0))

        d3.select("svg")
          .append("path")
          .attr("id", x + "Area")
          .attr("d", movieArea(data)) // data는 배열. 배열을 순회하면서 movie1 을 먼저 그리고
          .attr("fill", fillScale(n))
          .attr("stroke", 'lightgray')
          .attr("stroke-width", 2)
          .style("opacity", .5)
          
        n++;
      }
    }

    function simpleStacking(incomingData, incomingAttribute) {
      var newHeight = 0;
      for (x in incomingData) {
        if (x != "day") {
          newHeight += parseInt(incomingData[x]);
          if (x == incomingAttribute) {
            break;
          }
        }
      }
      return newHeight;
    }
    
  }
```

- 누적 차트를 스트림 그래프로 만들려면 누적된 영역이 교차 해야한다.

# 레이아웃

D3에는 일반적인 차트 기법으로 표현할 수 있도록 데이터 포맷 작업을 도와주는 레이아웃(layout) 함수가 여럿 있습니다.
또한 원호를 애니메이션 하는 트위닝(tweening) 이라는 기술도 있다.

- 레이아웃은 데이터를 출력할 수 있도록 포맷한다.
- 레이아웃의 도움을 받지 않고 원시 데이터에서 막대 그래프를 생성할 때 사용한 스케일과 컴포넌트는 레이아웃을 사용할 때도 필요하다.
- 히스토그램은 자연수뿐만 아니라 스케일에 들어가는 범윗값도 자동으로 저장한다.
- 다른 차원의 데이터로 차트를 동적으로 변경하더라도 원래 차트를 제가할 필요는 없다. 레이아웃으로 데이터를 다시 포맷하고 원래 요소에 다시 바인딩하면 된다.

레이아웃에 데이터 셋을 넣어주면 원래 데이터뿐만 아니라 그래프 요소나 생성기에 전달할 새로운 속성을 가진 데이터 셋을 반환한다.

## 파이 차트

```javascript
const pieChart = d3.pie().value(d => d.numTweets).sort(null) // 레이아웃
const newArc = d3.arc() // 생성기
                  .innerRadius(20)
                  .outerRadius(100)
const tenColorScale = d3.scaleOrdinal(d3.schemeCategory10)


d3.json('tweets.json').then(data => makeRingChart(data.tweets))

function makeRingChart(arrIncomingData) {
  const nestedTweets = d3.nest().key(el => el.user).entries(arrIncomingData)
  console.log('nestedTweets',nestedTweets)

  nestedTweets.forEach(el => {
    el.numTweets = el.values.length
    el.numFavorites = d3.sum(el.values, d => d.favorites.length)
    el.numRetweets = d3.sum(el.values, d => d.retweets.length)
  })

  const yourPie = pieChart(nestedTweets)
  
  d3.select('svg')
  .append('g')
  .attr('transform', 'translate(250,250)')
  .selectAll('path')
  .data(yourPie, d => d.data.key)
  .enter()
  .append('path')
  .attr('d', newArc)
  .style('fill', d => tenColorScale(d.data.key))
  .style('opacity', .5)
  .style('stroke', 'black')
  .style('stroke-width', '2px')
  .each(function(d) { this._current = d; });

  setTimeout(() => {
    pieChart.value(d => d.numFavorites)
    d3.selectAll('path').data(pieChart(nestedTweets), d => d.data.key)
    // transition 메서드가 원호를 잘 처리하지 못한다. 
    // 원호의 각을 전환하는 것이 아니라 각각의 부채꼴을 하나의 기하학적 도형으로 간주해 처리한다.
    .transition() 
    .duration(1000)
    .attrTween('d', arcTween) // attr('d', newArc)
    .style('fill', d => tenColorScale(d.data.key))
  },2000)
  


  setTimeout(() => {
    pieChart.value(d => d.numRetweets)
    d3.selectAll('path').data(pieChart(nestedTweets.filter(d => d.numRetweets > 0)), d => d.data.key)
      .exit()
      .remove()

    
    d3.selectAll('path').data(pieChart(nestedTweets.filter(d => d.numRetweets > 0)), d => d.data.key)
      .transition()
      .duration(1000)
      .attrTween('d', arcTween)
      .style('fill', d => tenColorScale(d.data.key))
      
  }, 4000)
  
  
  // 트위닝(tweening) 
  // 사전적 의미 ~사이에, ~중간에
  // 키 프레임 사이를 자동으로 채워주는 기능
  function arcTween(a) {
    const i = d3.interpolate(this._current, a) // 이전 그려졌던 데이터와 바뀌어야 하는 데이터를 보간한다.
    // this는 현재 DOM을 가리킨다.
    this._current = i(0) // 바뀌어야 할 데이터를 다시 _current에 셋팅한다.
    return function(t) {
      // 원호의 모양을 계산해 원호를 트위닝 하는 원호 생성기를 사용한다.
      // t 값이 0 에서 1로 세밀하게 증가한다.
      return newArc(i(t))
    }
  }

}
```

## 서클 팩

- 다른 모든 레이아웃과 마찬가지로 팩 레이아웃은 데이터가 어떤 기본적인 틀에 맞춰 구성돼 있다고 가정한다.
- 구체적으로 팩 레이아웃은 자식 요소들이 children 속성에 배열로 저장된 JSON 객체를 받는다.
- 레이아웃의 접근자 메서드를 우리 데이터에 맞춰 조정하는 방법에 익숙해지는 편이 좋다. 

```javascript
```

## 트리

## 스택

## 생키 레이아웃