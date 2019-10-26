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
- GeoJSON의 featureCollection은 feature라는 JSON 객체들을 담고 있으며, feature 객체는 지형의 경계를 coordinates 속성에 저장하고, 지형에 대한 메타데이터를 `properties` 속성에 저장한다.
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
- D3의 projections은 geoPath()에 사용할 뿐만 아니라 그 자체를 하나의 함수로서 사용할 수도 있다. 위도와 경도 쌍을 담은 배열을 전달해 호출하면 점을 찍을 화면 좌표를 반환한다.

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
- 공간 단위 문제가 발생할 수 있으므로 주의해야 한다. 공간 단위 문제는 통계 데이터를 왜곡해서 보여주려 기존 지형에 경계를 그릴 때 발생한다. 자기 당에 유리하도록 선거구를 정하는 게리맨더링은 이런 문제의 대표적인 예다.

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

    d3.selectAll('path.line')
      .datum(graticule)
      .attr('d', geoPath)

    d3.selectAll('path.outline')
      .datum(graticule.outline)
      .attr('d', geoPath)
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
  let test = 2
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

    d3.selectAll('path.line')
      .datum(graticule)
      .attr('d', geoPath)

    d3.selectAll('path.outline')
      .datum(graticule.outline)
      .attr('d', geoPath)
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
