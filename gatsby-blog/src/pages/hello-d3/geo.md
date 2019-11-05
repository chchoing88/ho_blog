---
title: hello-geo
date: '2019-10-16T10:00:03.284Z'
---

# 지리 공간 정보 시각화

- 지리 공간 데이터는 흔히 접할 수 있는 데이터 범주로서, 도나 군 등 행정구역 형태나, 도시 혹은 사람이 트윗한 장소, 지표면 위성 사진 등의 형태로 제공할 수 있다.
- 구글 API 등 전용 라이브러리를 사용하는 이유는 주로 구글 스트리트 뷰나 퓨전 테이블등의 생태계 때문이다. 그러나 그런 생태계가 필요 없으면 D3로 지도를 만드는 편이 더 현명하다.
- 다른 구문이나 추상 계층을 공부할 필요도 없으면 D3 지도가 제공하는 엄청난 융통성을 누릴 수 있기 때문이다.

## 기본 지도 제작

- shapefile은 가장 널리 사용하는 복잡한 지리 데이터 포맷으로, 이즈리사가 개발했으며 데스크톱 GIS(Geographic Information System) 애플리케이션에서 볼 수 있다.
- GIS(Geographic Information System) 란 인간생활에 필요한 지리정보를 컴퓨터 데이터로 변환하여 효율적으로 활용하기 위한 정보시스템이다.
- 도형이나 선 등 복잡한 지리 데이터를 다룰 때는 복잡한 데이터 포맷도 다루어야 한다. 그럴때는 GeoJSON을 이용하게 되는데, GeoJSON은 웹 지도 데이터의 표준이다.
- GeoJSON은 이름에서도 알 수 있듯이 지리 데이터를 JSON 포멧으로 인코딩하는 방법이다.
- GeoJSON의 featureCollection은 feature라는 JSON 객체들을 담고 있으며, feature 객체는 지형의 경계를 `coordinates` 속성에 저장([경도, 위도])하고, 지형에 대한 메타데이터를 `properties` 속성에 저장한다.
- 데스트톱 GIS(Geographic Information System) 애플리케이션 [http://qgis.org](http://qgis.org)
- Postgres에서 실행되는 공간 데이터베이스 [http://postgis.net](http://postgis.net)
- 지리 공간 데이터를 조작하는 라이브러리 [http://gdal.org](http://gdal.org)

```javascript
// GeoJSON의 형태
const GeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'AFG',
      properties: {
        name: 'Afghanistan',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [61.210817, 35.650072],
            //...
          ],
        ],
      },
    },
  ],
}
```

### 투영법

- 지도 제작에서 기본은 투영법이다.
- GIS에서 투영법은 자구 상의 점을 평면에 렌더링하는 과정을 말한다.
- 도법(projection)은 구의 특별한 점을 평면에 투영하는 방법이다.
- 웹 지도에서 가장 널리 사용하는 도법인 메르카토르 도법을 사용한다.
- 메르카토르 도법을 사용하려면 D3 확장인 d3.geo.projection.js를 추가 해야한다. (v5 버젼에서는 기본 API이다.) 도법을 정의하면 `d3.geoPath`를 이용해서 선택한 도법(projection)에 기초해 지리 데이터를 화면에 그린다.
- 메르카토르 도법(projection)이 기본적으로 미국을 중심으로 한 일부 세계만 SVG 영역에 투영하도록 설정돼 있기 때문이다.
- 모든 projection은 SVG에서 사용하는 표준적인 translate()와 scale() 메서드를 지원하지만 도법에 따라 효과가 다르다.

```javascript
// projection 이 도법
d3.json('world.geojson').then(data => createMap(data))

function createMap(countries) {
  const aProjection = d3.geoMercator()
  const geoPath = d3.geoPath().projection(aProjection)
  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
}
```

### 축척

- 메르카토르 도법에서는 사용할 수 있는 공간의 너비를 2로 나눈 값의 몫을 Math.pi로 나누면 화면에 세계 전체를 보여준다.
- 일반적으로 지도와 도법에 맞는 축척을 알아내려면 여러 값으로 시험해봐야 하지만 확대 기능을 추가하면 더 쉬워진다.
- 도법에 따라 기본 축적이 다르다.
- `d3.geoMercator().scale()` 처럼 아무 인자도 전달하지 않고 메서드를 호출하면 기본값을 확인할 수 있다.
- 아래 코드 처럼 `scale`과 `translate`를 조정하면 우리가 사용하는 지리 데이터의 다른 부분도 투영할 수 있다. 하지만 그린랜드와 남극 등 극에 가까운 지역은 엄청나게 돼곡돼 있다.

```javascript
d3.json('world.geojson').then(data => createMap(data))
const width = 500
const height = 500

function createMap(countries) {
  const aProjection = d3
    .geoMercator()
    // scale값은 도법에 따라 다르지만, 여기에서는 80이 제대로 작동한다.
    .scale(80)
    // 투영 중심을 그림 영역의 중심으로 옮긴다.
    .translate([width / 2, height / 2])
  const geoPath = d3.geoPath().projection(aProjection)
  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
}
```

### 지도 위에 점 찍기

- 도시를 아주 크게 표현할 때는 도형으로 표현할 수도 있지만, 일반적으로 도시나 사람은 지도 위에 점으로 표현된다.
- 인구 수에 비례해 점의 크기를 설정할 수도 있다.
- D3의 projections은 geoPath()에 사용할 뿐만 아니라 그 자체를 하나의 함수로서 사용할 수도 있다. 경도와 위도 쌍을 담은 배열을 전달해 호출하면 점을 찍을 화면 좌표를 반환한다. 예를 들어 샌프란시스코 ( 대략 경도 37, 위도 -122) 를 찍을 화면 위치를 알고 싶으면 그 값을 projection에 전달해 호출한다.

```javascript
aProjection([37, -122])
```

```css
svg {
  height: 700px;
  width: 700px;
  border: 1px solid gray;
}
path.countries {
  stroke-width: 1;
  stroke: black;
  opacity: 0.5;
  fill: red;
}

circle.cities {
  stroke-width: 1;
  stroke: black;
  fill: white;
}

circle.centroid {
  fill: red;
  pointer-events: none;
}

rect.bbox {
  fill: none;
  stroke-dasharray: 5 5;
  stroke: black;
  stroke-width: 2;
  pointer-events: none;
}

path.graticule {
  fill: none;
  stroke-width: 1;
  stroke: black;
}
```

```javascript
// projection 이 도법
Promise.all([d3.json('world.geojson'), d3.csv('cities.csv')]).then(dataList => {
  const [countries, cities] = dataList
  createMap(countries, cities)
})

const width = 500
const height = 500

function createMap(countries, cities) {
  const aProjection = d3
    .geoMercator()
    .scale(80)
    .translate([width / 2, height / 2])
  const geoPath = d3.geoPath().projection(aProjection)

  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
    .style('fill', 'gray')

  d3.select('svg')
    .selectAll('circle')
    .data(cities)
    .enter()
    .append('circle')
    .style('fill', 'black')
    .style('stroke', 'white')
    .style('stroke-width', 1)
    .attr('r', 3)
    .attr('cx', function(d) {
      return aProjection([d.y, d.x])[0]
    })
    .attr('cy', function(d) {
      return aProjection([d.y, d.x])[1]
    })
}
```

### 도법과 영역

- 사용하는 도법에 따라 지리 객체의 화면 크기가 왜곡된다. 이런 문제는 구 위의 좌표를 평면위의 좌표로 완벽하게 표현할 수 없으므로 발생한다.
- 육지나 해양의 지리학적 영역, 측정 거리, 혹은 특정 도형을 시각적으로 표현하려 다양한 도법을 사용한다.
- 몰바이데(Mollweide) 도법을 이용하면 가장자리가 몰바이데 곡선에 맞게 휘어진다. 메르카토르 도법은 남극 대륙의 크기를 너무 왜곡해 가장 큰 크기로 만들지만 이와 대조적으로 몰바이데 도법은 지리 데이터에 있는 국가와 대륙의 실제 크기를 유지하지만, 모양과 각도를 왜곡한다.
- 전통적인 타일 매핑을 이용한 다면 메르카토르 도법을 사용, 전 세계 축척을 유지해야 한다면 일반적으로 지형의 면적을 왜곡하지 않는 몰바이데 도법을 이용하는 편이 좋다.
- `geoPath()` 는 화면 영역의 크기를 측정하지만 지형의 실제 물리적인 면적을 나타내지는 않는다.
- 많은 `projection` 을 이용하려면 js 파일을 하나 더 로드 해야 한다. `https://d3js.org/d3-geo-projection.v2.min.js`

```javascript
// projection 이 도법
Promise.all([d3.json('world.geojson'), d3.csv('cities.csv')]).then(dataList => {
  const [countries, cities] = dataList
  createMap(countries, cities)
})

const width = 500
const height = 500

function createMap(countries, cities) {
  const aProjection = d3
    .geoMercator()
    .scale(80)
    .translate([width / 2, height / 2])

  const mProjection = d3
    .geoMollweide()
    .scale(120)
    .translate([width / 2, height / 2])

  // const geoPath = d3.geoPath().projection(aProjection);
  const geoPath = d3.geoPath().projection(mProjection)
  // 영역의 최소값과 최대값을 구할 수 있다.
  const featureSize = d3.extent(countries.features, d => geoPath.area(d))
  // 지형을 측정해 색상 그레이디언트에 정의된 색상을 할당한다.
  // scaleQuantize : 연속적인 range 대신에 불연속적인걸 사용한다는걸 제외하고는 linear scales 와 유사
  // colorbrewer : 색상 배열로 정보 시각화에 지도 제작에 유용한 라이브러리
  // http://colorbrewer2.org/export/colorbrewer.js
  const countryColor = d3
    .scaleQuantize()
    .domain(featureSize)
    .range(colorbrewer.Reds[7])

  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
    // 면적에 따라 나라의 색상을 칠한다.
    .style('fill', d => countryColor(geoPath.area(d)))

  d3.select('svg')
    .selectAll('circle')
    .data(cities)
    .enter()
    .append('circle')
    .style('fill', 'black')
    .style('stroke', 'white')
    .style('stroke-width', 1)
    .attr('r', 3)
    .attr('cx', function(d) {
      return mProjection([d.y, d.x])[0]
    })
    .attr('cy', function(d) {
      return mProjection([d.y, d.x])[1]
    })
}
```

### 정보 시각화 용어 : 코로플레스 지도

- 코로플레스 지도는 색상으로 데이터를 인코딩하는 지도를 말한다. 예를 들어 색상으로 나라별 GDP, 인구, 주요 언어 등 통계 데이터를 보여줄 수 있다.
- D3 에서는 `properties` 필드에 정보를 가진 지리 데이터를 사용하거나 지리 데이터와 통계 데이터 테이블 두 개를 연결해 만들 수 있다.
- 코로플레스 지도 공간 단위 문제가 발생할 수 있으므로 주의해야 한다. 공간 단위 문제는 통계 데이터를 왜곡해서 보여주려 기존 지형에 경계를 그릴 때 발생한다. 자기 당에 유리하도록 선거구를 정하는 게리맨더링은 이런 문제의 대표적인 예다.

### 상호작용성

- D3는 지역을 색칠하려고 영역을 계산하는 것 외에도 유용한 기능이 많다.
- 지도를 제작할 때는 지리 영역의 중심(도심\_centroid 라고 한다.)을 계산하는 기능과 경계 샂아를 구하는 기능을 흔히 사용한다.
- 다음은 각 국가를 에워싼 사각형과 국가의 중심에 빨간 동그라미를 대화형으로 그렸다. 또한 경로에 마우스 오버 이벤트를 추가하고 각 지형의 중심에 원을, 주변에는 경계 상자를 그린다.
- D3는 가중치로 중심을 계산하므로 경계 상자가 아니라 지형의 중심을 계산한다.

```javascript
// projection 이 도법
Promise.all([d3.json('world.geojson'), d3.csv('cities.csv')]).then(dataList => {
  const [countries, cities] = dataList
  createMap(countries, cities)
})

const width = 500
const height = 500

function createMap(countries, cities) {
  const aProjection = d3
    .geoMercator()
    .scale(80)
    .translate([width / 2, height / 2])

  const mProjection = d3
    .geoMollweide()
    .scale(120)
    .translate([width / 2, height / 2])

  // const geoPath = d3.geoPath().projection(aProjection);
  const geoPath = d3.geoPath().projection(mProjection)
  // 영역의 최소값과 최대값을 구할 수 있다.
  const featureSize = d3.extent(countries.features, d => geoPath.area(d))
  // 지형을 측정해 색상 그레이디언트에 정의된 색상을 할당한다.
  // scaleQuantize : 연속적인 range 대신에 불연속적인걸 사용한다는걸 제외하고는 linear scales 와 유사
  // colorbrewer : 색상 배열로 정보 시각화에 지도 제작에 유용한 라이브러리

  const countryColor = d3
    .scaleQuantize()
    .domain(featureSize)
    .range(colorbrewer.Reds[7])

  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
    // 면적에 따라 나라의 색상을 칠한다.
    .style('fill', d => countryColor(geoPath.area(d)))

  d3.selectAll('path.countries')
    .on('mouseover', centerBounds)
    .on('mouseout', clearCenterBounds)

  function centerBounds(d, i) {
    const thisBounds = geoPath.bounds(d)
    const thisCenter = geoPath.centroid(d)

    d3.select('svg')
      .append('rect')
      .attr('class', 'bbox')
      .attr('x', thisBounds[0][0])
      .attr('y', thisBounds[0][1])
      .attr('width', thisBounds[1][0] - thisBounds[0][0])
      .attr('height', thisBounds[1][1] - thisBounds[0][1])

    d3.select('svg')
      .append('circle')
      .attr('class', 'centroid')
      .attr('r', 5)
      .attr('cx', thisCenter[0])
      .attr('cy', thisCenter[1])
  }

  function clearCenterBounds() {
    d3.selectAll('circle.centroid').remove()
    d3.selectAll('rect.bbox').remove()
  }
}
```

## 더 나은 지도 제작 기법

- 경위선망은 지도를 더 읽기 좋게 격자를 만든다.
- zoom 객체는 지도를 이동하거나 확대할 수 있게 해준다.
- 이 두 기능 모두 D3에서 제공하는 여타 작동이나 생성기와 같은 형식과 기능을 따르며 특히 지도에 도움이 된다.

### 경위선망

- 경위선망(graticule)은 지도 위에 나타난 격자선을 말한다. 선, 영역, 원호 생성기가 있듯이 경위선망도 생성기가 있다.
- 경위선망 생성기는 격자선(위치와 개수를 지정하거나 기본값을 사용할 수 있다.)을 만들 수 있으며 경계선으로 사용할 수 있는 윤곽선도 만들 수 있다.
- data() 대신 datum() 이라는 메서드를 사용하는데, datum()은 하나의 데이터점을 배열에 넣을 필요 없이 바로 바인딩하므로 더 편리하다. 즉, datum(yourDatapoint) 는 data([yourDatapoint]) 와 동일하다.
- 데이터점 하나로 많은 경위선망을 그릴 수 있는 이유는 `geoGraticule`은 다중 선 스트링(multilinestring)이라는 지형을 생성하기 때문이다. 이 다중 선 스트링은 좌표 배열의 배열로서, 배열 안에 있는 각각의 배열은 하나의 개별적인 지형을 나타낸다. 다중 선 스트링과 다중 폴리곤은 GIS에서 늘 사용된다.
- `d3.geoPath()`은 다중 선 스트링이나 다중 폴리곤을 입력 받으면 여러 개의 분리된 조각으로 구성된 <path> 요소를 그린다.
- `d3.geoGraticule()`의 리턴 값을 실행(`graticule()`)시키면 GeoJSON MultiLineString geometry 객체가 리턴된다. 이 객체 안에는 경위선망을 위한 모든 자오선과 그에 해당하는 평행선을 가지고 있다.

```javascript
// 경위선망 추가
// projection 이 도법
Promise.all([d3.json('world.geojson'), d3.csv('cities.csv')]).then(dataList => {
  const [countries, cities] = dataList
  createMap(countries, cities)
})

const width = 500
const height = 500

function createMap(countries, cities) {
  const aProjection = d3
    .geoMercator()
    .scale(80)
    .translate([width / 2, height / 2])

  const mProjection = d3
    .geoMollweide()
    .scale(120)
    .translate([width / 2, height / 2])

  // const geoPath = d3.geoPath().projection(aProjection);
  const geoPath = d3.geoPath().projection(mProjection)
  // 영역의 최소값과 최대값을 구할 수 있다.
  const featureSize = d3.extent(countries.features, d => geoPath.area(d))
  // 지형을 측정해 색상 그레이디언트에 정의된 색상을 할당한다.
  // scaleQuantize : 연속적인 range 대신에 불연속적인걸 사용한다는걸 제외하고는 linear scales 와 유사
  // colorbrewer : 색상 배열로 정보 시각화에 지도 제작에 유용한 라이브러리

  const countryColor = d3
    .scaleQuantize()
    .domain(featureSize)
    .range(colorbrewer.Reds[7])

  // 경위선망 추가
  const graticule = d3.geoGraticule()
  console.log(graticule)
  d3.select('svg')
    .append('path')
    .datum(graticule)
    // .datum({
    //   type:"MultiLineString",
    //   coordinates: [
    //     [
    //       [-180, -89.999999],
    //       [-180, 9.999999974752427e-7],
    //       [-180, 89.999999]
    //     ]
    //   ]
    // })
    .attr('class', 'graticule line')
    .attr('d', geoPath)
    .style('fill', 'none')
    .style('stroke', 'lightgray')
    .style('stroke-width', '1px')

  d3.select('svg')
    .append('path')
    .datum(graticule.outline)
    .attr('class', 'graticule outline')
    .attr('d', geoPath)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', '1px')

  // 경위선망 추가

  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
    // 면적에 따라 나라의 색상을 칠한다.
    .style('fill', d => countryColor(geoPath.area(d)))

  d3.selectAll('path.countries')
    .on('mouseover', centerBounds)
    .on('mouseout', clearCenterBounds)

  function centerBounds(d, i) {
    const thisBounds = geoPath.bounds(d)
    const thisCenter = geoPath.centroid(d)

    d3.select('svg')
      .append('rect')
      .attr('class', 'bbox')
      .attr('x', thisBounds[0][0])
      .attr('y', thisBounds[0][1])
      .attr('width', thisBounds[1][0] - thisBounds[0][0])
      .attr('height', thisBounds[1][1] - thisBounds[0][1])

    d3.select('svg')
      .append('circle')
      .attr('class', 'centroid')
      .attr('r', 5)
      .attr('cx', thisCenter[0])
      .attr('cy', thisCenter[1])
  }

  function clearCenterBounds() {
    d3.selectAll('circle.centroid').remove()
    d3.selectAll('rect.bbox').remove()
  }
}
```

### 확대

- 화면에서 zoom 객체로 차트를 이동 할 수 있음을 알았다. 이제 zoom 객체로 확대 기능을 사용해보자.
- 차트를 이동했을 경우에는 <g> 요소의 transfrom 속성을 조절했다. 이제 zoom 객체의 scale값과 translate값을 조절해 투영 설정을 변경함으로써 지도를 확대하고 패닝 시킨다.
- 이번에는 zoom.scale()로, 더블클릭이나 마우스 휠을 앞으로 이동한 경우에는 확대하고 마우스 횔을 뒤로 이동한 경우에는 축소하도록 설정한다.
- projection 객체에 zoom을 사용하는 경우에는 projection의 초기 scale 값을 zoom.sacle() 값으로 덮어써야 한다. translate도 이와 동일하게 처리한다. 그런 후 zoom을 발생하는 이벤트가 발생하면 언제든 새로운 값으로 projection 객체를 갱신한다.
- zoom 에서 선택된 엘리먼트란 zoom 이벤트 핸들러에서 this 값으로 참조하는 엘리먼트 이다.
- zoom 이벤트 핸들러에서 `d3.zoomTransform(this)` 리턴 값으로 translate와 scale 값을 알아 낼 수 있다.
- zoom의 translateBy(selection, x, y)는 선택된 엘리먼트의 현재 zoom transform 의 translate 값이 주어진 x, y로 셋팅 되는 것이고 tanslateTo(selection, x, y, [,p])는 선택된 엘리먼트의 현재 zoom transform 의 translate 값이 주어진 p 포인트에 x , y 값이 보여지도록 셋팅 하는 것이다.
- `d3.select('svg').call(d3.zoom())` 이 코드는 svg 엘리먼트에 scale, translate 변화에 따라서 `__zoom` 프로퍼티를 만들어서 업데이트 하겠다. 라는 뜻이 되겠다. 또한 `__on` 프로퍼티도 생성되어서 어떤 이벤트에 반응할 것인가도 정의해 둔다.
- zoom에서는 뷰포트 범위의 중심이 기본값이다. 이 중심을 기준으로 k 배수 만큼 늘어난다. 만약 기준점이 (350, 350) 좌표에 있는 뷰포트 라면 (0, 350) 좌표는 스케일이 2개인 상태에서는 (-350, 1050) 좌표에 가있는다.
- x축 계산식만 본다면 0(전 x축좌표) - 350(기준좌표) = -350(현재 떨어져있는 거리) 여기에 스케일이 2배 이므로 2를 곱해준다.
- 700 그럼 중간지점에서 부터 -700 거리에 떨어져 있는 좌표를 찍어주면 된다. 기준좌표 350에서 -700이 떨어져 있으므로 -350 인 x 좌표가 나온다. ( (전 x 좌표 - 기준좌표) \* 배수 + 기준좌표 = 새로운 x 좌표 )

```javascript
// projection 이 도법
Promise.all([d3.json('world.geojson'), d3.csv('cities.csv')]).then(dataList => {
  const [countries, cities] = dataList
  createMap(countries, cities)
})

const width = 700
const height = 700

function createMap(countries, cities) {
  const aProjection = d3
    .geoMercator()
    .scale(80)
    .translate([width / 2, height / 2])

  const mProjection = d3
    .geoMollweide()
    .scale(120)
    .translate([width / 2, height / 2])

  // const geoPath = d3.geoPath().projection(aProjection);
  const geoPath = d3.geoPath().projection(mProjection)
  // 영역의 최소값과 최대값을 구할 수 있다.
  const featureSize = d3.extent(countries.features, d => geoPath.area(d))
  // 지형을 측정해 색상 그레이디언트에 정의된 색상을 할당한다.
  // scaleQuantize : 연속적인 range 대신에 불연속적인걸 사용한다는걸 제외하고는 linear scales 와 유사
  // colorbrewer : 색상 배열로 정보 시각화에 지도 제작에 유용한 라이브러리

  const countryColor = d3
    .scaleQuantize()
    .domain(featureSize)
    .range(colorbrewer.Reds[7])

  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
    // 면적에 따라 나라의 색상을 칠한다.
    .style('fill', d => countryColor(geoPath.area(d)))

  // 경위선망 추가
  const graticule = d3.geoGraticule()

  d3.select('svg')
    .append('path')
    .datum(graticule)
    .attr('class', 'graticule line')
    .attr('d', geoPath)
    .style('fill', 'none')
    .style('stroke', 'lightgray')
    .style('stroke-width', '1px')

  d3.select('svg')
    .append('path')
    .datum(graticule.outline)
    .attr('class', 'graticule outline')
    .attr('d', geoPath)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', '1px')
  // 경위선망 추가

  // 인터렉션
  d3.selectAll('path.countries')
    .on('mouseover', centerBounds)
    .on('mouseout', clearCenterBounds)

  function centerBounds(d, i) {
    const thisBounds = geoPath.bounds(d)
    const thisCenter = geoPath.centroid(d)

    d3.select('svg')
      .append('rect')
      .attr('class', 'bbox')
      .attr('x', thisBounds[0][0])
      .attr('y', thisBounds[0][1])
      .attr('width', thisBounds[1][0] - thisBounds[0][0])
      .attr('height', thisBounds[1][1] - thisBounds[0][1])

    d3.select('svg')
      .append('circle')
      .attr('class', 'centroid')
      .attr('r', 5)
      .attr('cx', thisCenter[0])
      .attr('cy', thisCenter[1])
  }

  function clearCenterBounds() {
    d3.selectAll('circle.centroid').remove()
    d3.selectAll('rect.bbox').remove()
  }
  // 인터렉션

  // zoom
  const [translateX, translateY] = mProjection.translate()
  const scaleK = mProjection.scale()
  const mapZoom = d3.zoom().on('zoom', zoomed)

  // d3.selectAll("div").call(name, "John", "Snow");
  // name(d3.selectAll("div"), "John", "Snow");

  // zoom.transform(selection, transform[, point])
  // transfrom 설정시 선택된 요소의  current zoom transform 값이 셋팅되고, 시작 즉시 이벤트가 발생된다.
  // zoom 영역을 설정시에 d3.interpolateZoom 를 사용해서 지정된 transform을 설정한다.
  // zoom.transfrom 인자의 transfrom 은 Hb의 인스턴스인 transform 객체 또는 transfrom을 리턴하는 함수를 넣어준다.
  // zoom.transform 인자의 point 로는 두개의 엘리먼트를 갖는 [x,y] 배열 또는 그런 배열을 리턴하는 함수를 넣어준다.
  d3.select('svg')
    .call(mapZoom)
    .call(
      mapZoom.transform,
      d3.zoomIdentity.translate(translateX, translateY).scale(scaleK)
    )

  // zoom 이벤트 처리기를 호출할 때마다
  // projection translate와 scale() 값을 zoom 객체의 값으로 갱신한다.
  function zoomed() {
    // 선택된 엘리먼트의 zoom transform 객체가 리턴
    // x는 x축 변화량, y는 y축 변화량, k는 scale
    const { x, y, k } = d3.zoomTransform(this)
    console.log(d3.zoomTransform(this))

    mProjection.translate([x, y]).scale(k)

    d3.selectAll('path.countries').attr('d', geoPath)

    d3.selectAll('path.line').attr('d', geoPath)

    d3.selectAll('path.outline').attr('d', geoPath)
  }
}
```

### 시멘틱 줌

화면 위의 요소를 확대한다고 할 때는 크기를 확대하는 것이 자연스럽게 떠오른다. 그렇지만 지도로 작업하다 보면 화면을 확대할 때 크기나 해상도만 느는 것이 아니라 화면에 보여줄 데이터의 종류도 변경한다는 것을 알게 된다. 단순한 그래픽 줌과 대비되는 이런 작동 특성을 시멘틱 줌이라고 한다. 예를 들어 축소된 지도에서는 국경과 몇몇 주요 도시만 보이지만, 지도를 확대하면 도로, 중소 도시, 공원 등을 볼 수 있다. 축소됐을 때는 전략이나 전반적인 정보를 보여주고, 확대됐을 때는 상세한 데이터를 보여줄 수 있어야 한다.

지도에 수동 확대 컨트롤 추가

```javascript
Promise.all([d3.json('world.geojson'), d3.csv('cities.csv')]).then(dataList => {
  const [countries, cities] = dataList
  createMap(countries, cities)
})

const width = 700
const height = 700

function createMap(countries, cities) {
  const aProjection = d3
    .geoMercator()
    .scale(80)
    .translate([width / 2, height / 2])

  const mProjection = d3
    .geoMollweide()
    .scale(120)
    .translate([width / 2, height / 2])

  // const geoPath = d3.geoPath().projection(aProjection);
  const geoPath = d3.geoPath().projection(mProjection)
  // 영역의 최소값과 최대값을 구할 수 있다.
  const featureSize = d3.extent(countries.features, d => geoPath.area(d))
  // 지형을 측정해 색상 그레이디언트에 정의된 색상을 할당한다.
  // scaleQuantize : 연속적인 range 대신에 불연속적인걸 사용한다는걸 제외하고는 linear scales 와 유사
  // colorbrewer : 색상 배열로 정보 시각화에 지도 제작에 유용한 라이브러리

  const countryColor = d3
    .scaleQuantize()
    .domain(featureSize)
    .range(colorbrewer.Reds[7])

  d3.select('svg')
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'countries')
    // 면적에 따라 나라의 색상을 칠한다.
    .style('fill', d => countryColor(geoPath.area(d)))

  // 경위선망 추가
  const graticule = d3.geoGraticule()

  d3.select('svg')
    .append('path')
    .datum(graticule)
    .attr('class', 'graticule line')
    .attr('d', geoPath)
    .style('fill', 'none')
    .style('stroke', 'lightgray')
    .style('stroke-width', '1px')

  d3.select('svg')
    .append('path')
    .datum(graticule.outline)
    .attr('class', 'graticule outline')
    .attr('d', geoPath)
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', '1px')
  // 경위선망 추가

  // 인터렉션
  d3.selectAll('path.countries')
    .on('mouseover', centerBounds)
    .on('mouseout', clearCenterBounds)

  function centerBounds(d, i) {
    const thisBounds = geoPath.bounds(d)
    const thisCenter = geoPath.centroid(d)

    d3.select('svg')
      .append('rect')
      .attr('class', 'bbox')
      .attr('x', thisBounds[0][0])
      .attr('y', thisBounds[0][1])
      .attr('width', thisBounds[1][0] - thisBounds[0][0])
      .attr('height', thisBounds[1][1] - thisBounds[0][1])

    d3.select('svg')
      .append('circle')
      .attr('class', 'centroid')
      .attr('r', 5)
      .attr('cx', thisCenter[0])
      .attr('cy', thisCenter[1])
  }

  function clearCenterBounds() {
    d3.selectAll('circle.centroid').remove()
    d3.selectAll('rect.bbox').remove()
  }
  // 인터렉션

  // zoom
  const [translateX, translateY] = mProjection.translate()
  const scaleK = mProjection.scale()
  const mapZoom = d3.zoom().on('zoom', zoomed)

  // d3.selectAll("div").call(name, "John", "Snow");
  // name(d3.selectAll("div"), "John", "Snow");

  // zoom.transform(selection, transform[, point])
  // transfrom 설정시 선택된 요소의  current zoom transform 값이 셋팅되고, 시작 즉시 이벤트가 발생된다.
  // zoom 영역을 설정시에 d3.interpolateZoom 를 사용해서 지정된 transform을 설정한다.
  // zoom.transfrom 인자의 transfrom 은 Hb의 인스턴스인 transform 객체 또는 transfrom을 리턴하는 함수를 넣어준다.
  // zoom.transform 인자의 point 로는 두개의 엘리먼트를 갖는 [x,y] 배열 또는 그런 배열을 리턴하는 함수를 넣어준다.
  d3.select('svg')
    .call(mapZoom)
    .call(
      mapZoom.transform,
      d3.zoomIdentity.translate(translateX, translateY).scale(scaleK)
    )

  // zoom 이벤트 처리기를 호출할 때마다
  // projection translate와 scale() 값을 zoom 객체의 값으로 갱신한다.
  function zoomed() {
    // 선택된 엘리먼트의 zoom transform 객체가 리턴
    // x는 x축, y는 y축, k는 scale
    const { x, y, k } = d3.zoomTransform(this)
    console.log(d3.zoomTransform(this))

    mProjection.translate([x, y]).scale(k)

    d3.selectAll('path.countries').attr('d', geoPath)

    d3.selectAll('path.line').attr('d', geoPath)

    d3.selectAll('path.outline').attr('d', geoPath)
  }

  function zoomButton(zoomDirection) {
    if (zoomDirection === 'in') {
      d3.select('svg').call(mapZoom.scaleBy, 1.5)
    }

    if (zoomDirection === 'out') {
      d3.select('svg').call(mapZoom.scaleBy, 0.75)
    }
  }

  d3.select('#controls')
    .append('button')
    .on('click', () => zoomButton('in'))
    .html('Zoom In')
  d3.select('#controls')
    .append('button')
    .on('click', () => zoomButton('out'))
    .html('Zoom out')
}
```

## 고급 지도 제작

- 위 작성된 코드에서 인구에 기초해 <circle> 요소의 크기를 정하거나 <g> 요소로 레이블을 붙일 수도 있을 것이다.
- 지도를 만들고 있다면 폴리곤과 점으로 경계 상자나 중심을 이용하고 zoom 객체에 연동시킬 것이다.
- 만약 zoom의 행동을 가진 element가 뒤늣게 mousedown 이벤트를 등록한다면 mousedown 이벤트는 동작하지 않는다. 왜냐하면 zoom 이벤트에서 해당 이벤트를 소비하기 때문이다. 하지만 이벤트 propagation 룰에 의해 zoom 행동을 등록하기 전에 mousedown 이벤트를 등록하거나 이벤트 리스너에 capturing을 사용하거나 자손 element에 non-capturing 으로 등록한다면 mousedown 이벤트가 zoom 이벤트 발생 전에 볼수 있을 것이다. 그리고 `event.stopImmediatePropagation` 으로 zoom의 행동을 막을 수도 있다. 또한 `zoom.filter`를 사용해서 zoom의 행동을 컨트롤 할 수 있다.
- continuous scale에서 `clamp`는 enable, disable로 설정할 수 있는데 이를 false로 설정할 시 domain에 벗어난 값은 range에서도 벗어난 값을 리턴한다. 그 반대로 true 값을 설정하면 domain에 벗어난 값은 range의 최소 또는 최대 값으로 매핑이 된다.
- `projection` 객체의 `clipAngle` 속성은 중심에서 일정한 각도 이상을 벗어나는 경로를 `제거(clipping)` 한다.
- 지구본을 초기화 할 때 나라를 모두 그리지만 그들 중 상당수는 잘려나간다. 그러므로 도형을 그릴때 영역을 계산하는 `geoPath.area(d)` 메서드는 메르카토르 도법에서보다 문제가 더 심하다. 예를 들어 호주가 마다가스카르와 비슷한 크기인 것처럼 색상이 칠해져 있는걸 볼 수 있다.
- D3는 실제 지형 면적을 계산하는 `d3.geoArea()` 가 있다.

### geoOrthographic 도법으로 지구본 만들기

- `projection에 [longitude, latitude]` 값을 넣어서 실행하면 그려지는 `2D 좌표 값`(typically in pixels)을 리턴해준다.
- 반대로 `projection.invert` 메서드에 평면 x,y 좌표값 배열(typically in pixels)을 넣어서 실행시키면 도법에 적용된 좌표를 다시 리턴해준다. 예를 들어 `geoOrthographic` 에선 [longitude, latitude] in degress 값을 리턴해준다.
- Spherical Math 의 `d3.geoCentroid` 메서드는 한 국가의 GeoJSON 객체를 받으면 구 지형의 중심 좌표([경도 , 위도])값을 리턴해준다.
- 지구본을 회전에 대해 알아두어야 하는 것은 위치는 [경도, 위도]로 표현을 해낼 수 있고 방향은 [lambda, phi, gamma] 로 표현해야 한다는 것이다.
- 특히 이 방향 표현은 오일러를 사용해서 표현을 하고 있다. 오일러는 3개의 축에 대한 각도를 회전 정보로 사용한다. 예를 들어서 현재 지점의 좌표와 방향을 그리고 다음 지점의 좌표를 안다면 다음 지점의 방향을 구할 수있고 `projection.rotate`에 다음 지점의 방향을 넣어서 회전 시킬 수 있을 것이다.
- 오일러각은 직각좌표계(Cartesian coordinate system)에서 X, Y, Z 축을 따라 오른손 좌표계 방향으로 각을 정의하고 정해진 순서에 따라 3번 회전 운동을 수행하며 회전 운동을 표현한다. 따라서 미리 회전 순서를 정해주지 않으면 오일러각은 매우 다양하게 정의될 수 있다.
- 오일러는 직관적이라 사용자의 입력을 받을 수 있는 장점이 있지만 짐벌 락이라는 단점을 지니고 있다. 그래서 쿼터니온이라는 다른 표현을 사용한다. 이때, 사용자에게는 오일러 각을 입력받고 쿼터니온으로 연산을 진행해서 다시 오릴러 각으로 리턴을 받는 식으로 계산한다. 쿼터니온은 오일러 연산에서 발생하는 짐벌락 문제를 말끔히 해결하며 연산속도도 빠르다.


```html
<html>
  <head>
    <title>D3 in Action Chapter 5 - Example 7</title>
    <meta charset="utf-8" />
    <!-- <script src="d3.v3.min.js" type="text/JavaScript"></script>
<script src="colorbrewer.js" type="text/JavaScript"></script> -->
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://d3js.org/d3-geo-projection.v2.min.js"></script>
    <script src="http://colorbrewer2.org/export/colorbrewer.js"></script>
    <script src="https://unpkg.com/versor"></script>
  </head>
  <style>
    svg {
      height: 700px;
      width: 700px;
      border: 1px solid gray;
    }
    path.countries {
      stroke-width: 1;
      stroke: black;
      opacity: 0.5;
      fill: red;
    }

    circle.cities {
      stroke-width: 1;
      stroke: black;
      fill: blue;
    }

    circle.centroid {
      fill: red;
      pointer-events: none;
    }

    rect.bbox {
      fill: none;
      stroke-dasharray: 5 5;
      stroke: black;
      stroke-width: 2;
      pointer-events: none;
    }

    path.graticule {
      fill: none;
      stroke-width: 1;
      stroke: black;
    }
  </style>
  <body>
    <div id="viz">
      <svg></svg>
    </div>
    <div id="controls"></div>

    <footer></footer>

    <script>
      Promise.all([d3.json('world.geojson'), d3.csv('cities.csv')]).then(
        dataList => {
          const [countries, cities] = dataList
          createMap(countries, cities)
        }
      )

      const width = 700
      const height = 700

      function createMap(countries, cities) {
        // 정사 도법으로 설정하는 코드
        const oProjection = d3
          .geoOrthographic()
          .scale(200)
          .translate([width / 2, height / 2])
          //.center([46.72940870961725, -19.301666904193652]) // longitude(경도) and latitude(위도) in degrees
          // .angle(90);
          .clipAngle(90) // 둥근 구를 세로로 자르는데 경도 각도를 기준으로 자르는거 같다.
          // .clipExtent([0,0], [1700,1700])
          .rotate([0, -20, 0])
          .precision(0.1)
        // .fitExtent([[0, 0], [width, height]], countries);

        o = oProjection
        const geoPath = d3.geoPath().projection(oProjection)

        // 나라 그리는 코드
        d3.select('svg')
          .selectAll('path')
          .data(countries.features)
          .enter()
          .append('path')
          .attr('d', geoPath)
          .attr('class', 'countries')
        // // 면적에 따라 나라의 색상을 칠한다.
        // .style("fill", d => newFeatureColor(d3.geoArea(d)));

        // 나라 색상 칠하기
        const featureData = d3.selectAll('path.countries').data()
        const realFeatureSize = d3.extent(featureData, d => d3.geoArea(d))
        const newFeatureColor = d3
          .scaleQuantize()
          .domain(realFeatureSize)
          .range(colorbrewer.Reds[7])
        d3.selectAll('path.countries').style('fill', d =>
          newFeatureColor(d3.geoArea(d))
        )

        // 경위선망 추가
        const graticule = d3.geoGraticule()
        d3.select('svg')
          .append('path')
          .datum(graticule)
          .attr('class', 'graticule line')
          .attr('d', geoPath)
          .style('fill', 'none')
          .style('stroke', 'lightgray')
          .style('stroke-width', '1px')

        d3.select('svg')
          .append('path')
          .datum(graticule.outline)
          .attr('class', 'graticule outline')
          .attr('d', geoPath)
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', '1px')
        // 경위선망 추가

        // zoom
        const [translateX, translateY] = oProjection.translate()
        const scaleK = oProjection.scale()
        // let projectionXY = [null, null];
        // let interpolator = null;
        // let count = 0;
        let v0, q0, r0
        const mapZoom = d3
          .zoom()
          .on('start', () => {
            console.log('start')
            console.log(event)
            v0 = versor.cartesian(oProjection.invert([event.x, event.y]))
            q0 = versor((r0 = oProjection.rotate()))
          })
          .on('zoom', zoomed)
          .on('end', () => {
            console.log('end')
            projectionXY = [null, null]
            interpolator = null
            count = 0
          })

        d3.select('svg')
          .call(mapZoom)
          .call(
            mapZoom.transform,
            d3.zoomIdentity.translate(translateX, translateY).scale(scaleK)
          )

        // zoom 이벤트 처리기를 호출할 때마다
        // projection translate와 scale() 값을 zoom 객체의 값으로 갱신한다.
        function zoomed() {
          const v1 = versor.cartesian(
            oProjection.rotate(r0).invert([event.x, event.y])
          )
          const q1 = versor.multiply(q0, versor.delta(v0, v1))
          oProjection.rotate(versor.rotation(q1))

          reDrawSvg()
        }

        function reDrawSvg() {
          const currentRotate = oProjection.rotate()[0]
          d3.selectAll('path.countries').attr('d', geoPath)
          d3.selectAll('path.line').attr('d', geoPath)
          d3.selectAll('path.outline').attr('d', geoPath)

          d3.selectAll('circle.cities')
            .attr('cx', d => oProjection([d.x, d.y])[0])
            .attr('cy', d => oProjection([d.x, d.y])[1])
            .style('display', d => {
              return parseInt(d.y) + currentRotate < 90 &&
                parseInt(d.y) + currentRotate > -90
                ? 'block'
                : 'none'
            })
        }
      }
    </script>
  </body>
</html>
```

### 위성 도법

- 위성 도법의 각도를 지정하는데 tilt() 와 distance() 라는 새로운 설정이 있다. titl는 데이터를 바라보는 각도이며, distance는 지구 반지름에 대한 비율이다. (1.119는 지구 반지름의 11.9% 높이의 상공을 의미한다.)
- 정확한 설정 값을 알아내는 법은 2가지가 있다. 하나는 수학이나 지리학을 전공했다면 계산하는 방법을 설명한 참고서를 살펴보거나 두번째는 코드로 회전, 기울임, 거리 척도를 대화형으로 설정하는 방법이 있다. [참고](http://bl.ocks.org/emeeks/10173187)


```javascript
// 중동이 유럽을 바라보는 시각의 변화
Promise.all([d3.json("world.geojson"), d3.csv("cities.csv")]).then(
    dataList => {
      const [countries, cities] = dataList;
      createMap(countries, cities);
    }
  );

  const width = 700;
  const height = 700;

  function createMap(countries, cities) {
    projection = d3.geoSatellite()
      .translate([width / 2, height / 2])
      .scale(1330)
      .rotate([-30.24, -31, -56])
      .tilt(30) // 지형을 내려다보는 각도
      .distance(1.199) // 지구 반지름에 대한 비율이다.(1.119는 지구 반지름의 11.9% 높이의 상공을 의미한다.)
      .clipAngle(35) // 중심에서 일정한 각도 이상을 벗어나는 경로를 제거
      // .center([-2, -1])
      
    
    const geoPath = d3.geoPath().projection(projection);

    // 나라 그리는 코드
    d3.select("svg")
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("class", "countries");

    const featureData = d3.selectAll("path.countries").data();
    const realFeatureSize = d3.extent(featureData, d => d3.geoArea(d));
    const newFeatureColor = d3
      .scaleQuantize()
      .domain(realFeatureSize)
      .range(colorbrewer.Reds[7]);
    d3.selectAll("path.countries").style("fill", d =>
      newFeatureColor(d3.geoArea(d))
    );
  }
```



## TopoJSON 데이터와 기능

TopoJSON 이라는 용어는 다음과 같은 세 가지 형태를 말한다. 

- 지리 데이터에 대한 데이터 표준이며 GeoJSON의 확장 버전
- GeoJSON 파일에서 TopoJSON 포맷의 파일을 생성하려 node.js에서 돌아가는 라이브러리
- TopoJSON 포맷의 파일을 처리해 D3 등의 라이브러리로 렌더링하는데 필요한 객체를 생성하는 자바스크립트 라이브러리

GeoJSON 파일은 각 지형을 점, 선, 폴리곤을 나타내는 위도와 경도 좌표의 배열로 저장하는 반면, TopoJSON은 각 지형을 원호의 배열로 저장한다. 원호는 데이터 셋 안에 있는 하나 이상의 지형이 공유하는 선분이다. 미국과 멕시코가 공유하는 국경은 하나의 원호로서 미국 지형의 원호 배열에서 참조하고 멕시코 지형의 원호 배열에서 참조한다. 

TopoJSON 데이터 셋의 크기가 훨씬 더 작은 경우가 많고 어느 선분을 공유하는지 알고 있으면 이웃하는 지형이나 공유하는 국경을 쉽게 계산할 수 있고 지형을 쉽게 병합할 수 있다. 

D3가 도형을 생성하는데 읽고 생성할 수 있는 포맷으로 TopoJSON 포맷을 변경하려면 TopoJSON으로 지도를 만드는데 사용하는 웹사이트에 Topojson.js를 추가해야 한다. 

```javascript
Promise.all([d3.json("world.topojson"), d3.csv("cities.csv")]).then(
        dataList => {
          const [countries, cities] = dataList;
          createMap(countries, cities);
        }
      );

      const width = 700;
      const height = 700;

      function createMap(countries, cities) {
        // topo => geo 변환
        const topoCountries = topojson.feature(countries, countries.objects.countries)
        // console.log(topoCountries)
        
        const projection = d3.geoMollweide()
          .scale(120)
          .translate([width / 2, height / 2 ])
          .center([20,0])

        const geoPath = d3.geoPath().projection(projection);


        // 나라 그리는 코드
        d3.select("svg")
          .selectAll("path")
          .data(topoCountries.features)
          .enter()
          .append("path")
          .attr("d", geoPath)
          .attr("class", "countries")
          .style('stroke-width', 1)
          .style('stroke', 'black')
          .style('opacity', 0.5)

        
        const featureData = d3.selectAll("path.countries").data();
        const realFeatureSize = d3.extent(featureData, d => d3.geoArea(d));
        const newFeatureColor = d3
          .scaleQuantize()
          .domain(realFeatureSize)
          .range(colorbrewer.Reds[7]);
        d3.selectAll("path.countries").style("fill", d =>
          newFeatureColor(d3.geoArea(d))
        );

        // 병합
        mergetAt(0)

        function mergetAt(mergePoint) {
          const filteredCountries = countries.objects.countries.geometries
            .filter(d => {
              const thisCenter = d3.geoCentroid(topojson.feature(countries, d))
              return thisCenter[1] > mergePoint? true : null
            })

          d3.select('svg').insert('g')
            .datum(topojson.merge(countries, filteredCountries))
            .insert('path')
            .style('fill', 'gray')
            .style('stroke', 'black')
            .style('stroke-width', '2px')
            .attr('d', geoPath)

          console.log(topojson.merge(countries, filteredCountries))
        }   
      }
```

## d3.geo tile을 이용한 타일 맵핑

- 지금까지 그린것은 코로플레스 지도를 만든 것이다. 터레인(terrain), 즉 위성 사진을 사용하지는 않았다. 
- 래스터 데이터는 백터 데이터 만큼 가볍지 않다. 스마트폰에서 찍은 사진을 떠올려보자. 파일의 크기가 크다. 
- 엄청나게 큰 그림을 사용해야 하는 문제를 해결하려 웹 지도에서는 타일(tile)로 위성 사진을 보여준다. 예를 들어 도시의 고해상도 사진을 다양한 확대 수준에서 256px x 256px 크기로 나눈 후 서버에 확대 수준과 위치에 맞게 해당 사진들을 저장한다. 
- [Mapbox](http://mapbox.com) 같은 곳에서 타일을 제공하며, 이 타일을 커스터마이즈할 TileMill 같은 도구를 제공해준다. 
- 각 타일은 PNG 포맷인 래스터 이미지로서 지구 어딘가의 정사각형을 나타낸다. 파일명을 보면 그림 파일의 지리적 위치와 확대 수준을 알 수 있다. 
- d3.geoTile 객체가 파일명과 디렉터리 구조를 분석해주므로 지도에 해당 타일을 사용하기만 하면 된다. 

```html
 <html>
  <head>
    <title>D3 in Action Chapter 5 - Example 7</title>
    <meta charset="utf-8" />
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://d3js.org/d3-geo-projection.v2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/d3-tile@1"></script>
    <script src="http://colorbrewer2.org/export/colorbrewer.js"></script>
    <script src="https://unpkg.com/topojson@3"></script>
    <script src="https://unpkg.com/versor"></script>
  </head>
  <style>
    svg {
      height: 700px;
      width: 700px;
      border: 1px solid gray;
    }
    path.countries {
      stroke-width: 1;
      stroke: black;
      opacity: 0.5;
      fill: red;
    }

    circle.cities {
      stroke-width: 1;
      stroke: black;
      fill: blue;
    }

    circle.centroid {
      fill: red;
      pointer-events: none;
    }

    rect.bbox {
      fill: none;
      stroke-dasharray: 5 5;
      stroke: black;
      stroke-width: 2;
      pointer-events: none;
    }

    path.graticule {
      fill: none;
      stroke-width: 1;
      stroke: black;
    }
  </style>
  <body>
    <div id="viz">
      <svg></svg>
    </div>
    <div id="controls"></div>

    <footer></footer>

    <script>
      Promise.all([d3.json("world.topojson"), d3.csv("cities.csv")]).then(
        dataList => {
          const [countries, cities] = dataList;
          createMap(countries, cities);
        }
      );

      const width = 700;
      const height = 700;
      d3.select("svg")
        .append("g")
        .attr("id", "tiles");

      function createMap(countries, cities) {
        // topo => geo 변환
        const topoCountries = topojson.feature(
          countries,
          countries.objects.countries
        );

        const tile = d3.tile().size([width, height]);

        const projection = d3
          .geoMercator()
          .scale(120)
          .translate([width / 2, height / 2]);

        const center = projection([0, 0]);
        const geoPath = d3.geoPath().projection(projection);
        const zoom = d3.zoom().on("zoom", redraw);

        const translateX = width - center[0];
        const translateY = height - center[1];
        const scaleK = projection.scale() * 2 * Math.PI;

        d3.select("svg")
          .call(zoom)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(translateX, translateY).scale(scaleK)
          );

        d3.select("svg")
          .selectAll("path")
          .data(topoCountries.features)
          .enter()
          .append("path")
          .attr("d", geoPath)
          .attr("class", "countries");  

        function redraw() {
          
          const transform = d3.zoomTransform(this);
          const tiles = tile
            .scale(transform.k)
            .translate([transform.x, transform.y])();
          console.log("tiles", tiles);
          const image = d3
            .select("#tiles")
            .attr(
              "transform",
              `scale(${tiles.scale}) translate(${tiles.translate})`
            )
            .selectAll("image")
            .data(tile, d => d);

          image.exit().remove(); // 화면 밖으로 나간 것을 모두 제거한다.
          image
            .enter()
            .append("image") // 새로운 이미지를 추가한다.
            .attr("xlink:href", d => {
              return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/${
                d[2]
              }/${d[0]}/${
                d[1]
              }?access_token=pk.eyJ1IjoiY2hjaG9pbmciLCJhIjoiY2syazU1OWs0MHdqYzNtb2h6a2FtdXppZCJ9.nMTjqotAdJuGNYhCvLTOGA
`;
            })
            .attr("width", 1)
            .attr("height", 1)
            .attr("x", d => d[0])
            .attr("y", d => d[1]);

          // 현재의 메르카토르 도법에 맞게 스케일을 계산한다. 
          projection.scale(transform.k / 2 / Math.PI).translate([transform.x, transform.y])
          d3.selectAll('path.countries')
            .attr('d',geoPath)
            
        }
        
        // 나라 색상
        const featureData = d3.selectAll("path.countries").data();
        const realFeatureSize = d3.extent(featureData, d => d3.geoArea(d));
        const newFeatureColor = d3
          .scaleQuantize()
          .domain(realFeatureSize)
          .range(colorbrewer.Reds[7]);
        d3.selectAll("path.countries").style("fill", d =>
          newFeatureColor(d3.geoArea(d))
        );
       
      }
    </script>
  </body>
</html>
```

## 웹 지도 제작 관련 추가 자료

- 위에서 사용했던 확대하는데 사용한 기법은 투영 확대 (projection zoom) 라고 하며 scale 과 translate 의 변화에 따라 지형의 모습을 수학적으로 다시 계산한다. 메르카토르 도법처럼 수평 투영 (flat projection) 기법을 사용하는 경우에는 zoom 객체의 scale과 translate 변화를 SVG 변환 기능에 연결해 성능을 향상 시킬 수 있다. 이때 SVG 변환에 의해 폰트와 스트로크의 두께가 변하므로 이에 대한 설정은 직접 조정해야 한다. 

- `d3.geoPath`의 context() 메서드를 사용하면 <canvas> 요소에 벡터 데이터를 쉽게 그릴 수 있으며, 경우에 따라 속도가 향상된다. canvas의 `toDataURL()` 메서드를 사용하면 화면을 PNG 파일로 만들어 저장할 수 있다.

- `d3.hexbin` 플러그인을 사용하면 지도위에 헥스빈(hexbin)을 쉽게 만들 수 있다. [Hexbin](https://observablehq.com/@d3/hexbin-map)

- 헥스빈과 마찬가지로, 점 데이터만 갖는 데이터에서 영역을 생성하고 싶을 때는 보로노이 다이어그램인 `d3.voronoi()`로 해당 점에서 폴리곤을 생성할 수 있다. [voronoi](https://www.jasondavies.com/maps/voronoi/us-capitals/)

- 통계지도(cartogram)은 지리 객체의 영역이나 길이를 왜곡해 다른 정보를 준다. 예를 들어 주행 시간에 따라 도로의 길이를 왜곡하거나 인구에 기초해 나라의 크기를 크거나 작게 만들 수 있다. [제이슨 데이비스 예제](https://www.jasondavies.com/maps/dorling-world/), [마이크 보스톡 예제](https://bl.ocks.org/mbostock/4055908), [비용 통계 지도](http://orbis.stanford.edu/)