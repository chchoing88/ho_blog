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


## 데이터 속성에 기초한 그래프 그리기

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


# 데이터 주도 설계와 상호작용성

## 이벤트 

- on() 메서드는 바인딩 된 데이터를 함수에 자동으로 전달할 수 있다.

```javascript
teamG.on('mouseover', highlightRegion) // selection.on
function highlightRegion(targetData) {
  d3.selectAll('g.overallG').select('circle')
    .style('fill', d => d.region === targetData.region ? 'red' : 'gray' )
}
```

## 그래프 전환

- 그래픽 요소가 많고 상호작용성이 높은 웹 페이지를 만들때 전환을 부드럽게 처리하자. 
- 전환은 delay() 메서드로 일정 시간 후에 발생하도록 설정하거나 duration() 메서드로 일정 시간 발생하도록 설정할 수 있다.

```javascript
 d3.selectAll('g.overallG').select('circle').transition().duration(1000)
        .attr('r', d => radiusScale(d[datapoint]))
```

- delay() 메서드는 전환할 때의 시작 시각을 늦출 수 있다. 

```javascript
// 원이 과장된 크기로 커졌다가 바인딩된 데이터 셋에 정의한 크기로 줄어들도록 전환효과 구현
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
      .style("fill", "pink")
      .style("stroke", "black")
      .style("stroke-width", "1px")
```


## DOM 조작

셀렉션 안에 있는 DOM 요소에 직접 접근하려면 다음 다 방법 중 하나를 사용한다.

- 인라인 함수에서 this 이용

```javascript
d3.select('circle').each((d,i) => {
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
      d3.select(this).select('text').classed('active', true).attr('y', 10)
      d3.selectAll('g.overallG').select('circle').each(function (d,i) { // 안에서 this는 해당 DOM을 위해 사용해야 하니 화살표 함수를 지양하자.
        d.region === targetData.region ? d3.select(this).classed('active', true) : d3.select(this).classed('inactive', true)
      })
    }
```

이렇게 코드를 짰을 경우 텍스트가 커지면서 다른 `circle` DOM 요소 밑으로 가려지는 현상이 발생된다. 
따라서 해당 요소를 다시 부모에 append 시켜주어야 한다. 

```javascript
function highlightRegion3(targetData, i) {
      d3.select(this).select('text').classed('highlight', true).attr('y', 10)
      d3.selectAll('g.overallG').select('circle').each(function (d,i) { // 안에서 this는 해당 DOM을 위해 사용해야 하니 화살표 함수를 지양하자.
        d.region === targetData.region ? d3.select(this).classed('active', true) : d3.select(this).classed('inactive', true)
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

      d3.select(this).select('text').classed('highlight', true).attr('y', 10)
      d3.selectAll('g.overallG').select('circle')
        .style('fill', d => {
          return d.region === targetData.region ? teamColor.darker(.75) : teamColor.brighter(0.5) // 색상에서 밝기 조절
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
const ybRamp = d3.scaleLinear().domain([0,4]).range(['yellow', 'blue'])
const testData = [0,1,2,3]

d3.select('svg').selectAll('circle').data(testData).enter().append('circle')
  .attr('r', 20)
  .attr('cy', 50)
  .attr('cx', (d,i) => (60*i)+30)
  .style('fill', d => ybRamp(d))

```
여기서 노랑색에서 파란색으로 자연스럽게 색이 나오길 원하지만 위 처럼 코드를 작성하면 스케일의 기본 보간자는 빨간색, 녹색, 파란색 채널을 그저 숫자로 처리한다.

아래 코드는 HCL 에 기초해서 보간법을 적용한다.

```javascript
// 스케일의 기본 보간법이 마음에 들지 않을 때는 직접 지정한다.
// 특히 RGB값을 보간하는 방법 이외의 방법으로 
// 색상 스케일을 생성하고자 할 때는 직접 지정해야 한다.
const ybRamp = d3.scaleLinear().interpolate(d3.interpolateHsl).domain([0,4]).range(['yellow', 'blue'])
const testData = [0,1,2,3]

d3.select('svg').selectAll('circle').data(testData).enter().append('circle')
  .attr('r', 20)
  .attr('cy', 50)
  .attr('cx', (d,i) => (60*i)+30)
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
```




