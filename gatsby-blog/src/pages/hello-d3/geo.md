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
   "type":"FeatureCollection",
    "features":[ 
      { 
        "type":"Feature",
         "id":"AFG",
         "properties":{ 
            "name":"Afghanistan"
         },
         "geometry":{ 
            "type":"Polygon",
            "coordinates":[ 
               [ 
                 [61.210817, 35.650072],
                 //...
               ]
            ]
         }
      }
    ]
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
d3.json("world.geojson").then(data => createMap(data));

function createMap(countries) {
  const aProjection = d3.geoMercator();
  const geoPath = d3.geoPath().projection(aProjection);
  d3.select("svg").selectAll("path").data(countries.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .attr("class", "countries")
}
```

### 축척

- 메르카토르 도법에서는 사용할 수 있는 공간의 너비를 2로 나눈 값의 몫을 Math.pi로 나누면 화면에 세계 전체를 보여준다. 
- 일반적으로 지도와 도법에 맞는 축척을 알아내려면 여러 값으로 시험해봐야 하지만 확대 기능을 추가하면 더 쉬워진다. 
- 도법에 따라 기본 축적이 다르다.
- `d3.geoMercator().scale()` 처럼 아무 인자도 전달하지 않고 메서드를 호출하면 기본값을 확인할 수 있다.
- 아래 코드 처럼 `scale`과 `translate`를 조정하면 우리가 사용하는 지리 데이터의 다른 부분도 투영할 수 있다. 하지만 그린랜드와 남극 등 극에 가까운 지역은 엄청나게 돼곡돼 있다.


```javascript
d3.json("world.geojson").then(data => createMap(data));
const width = 500
const height = 500

function createMap(countries) {
  const aProjection = d3.geoMercator()
                        // scale값은 도법에 따라 다르지만, 여기에서는 80이 제대로 작동한다.
                        .scale(80)  
                        // 투영 중심을 그림 영역의 중심으로 옮긴다.
                        .translate([width / 2, height / 2]);
  const geoPath = d3.geoPath().projection(aProjection);
  d3.select("svg").selectAll("path").data(countries.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .attr("class", "countries")
}
```

### 지도 위에 점 찍기

- 도시를 아주 크게 표현할 때는 도형으로 표현할 수도 있지만, 일반적으로 도시나 사람은 지도 위에 점으로 표현된다.
- 인구 수에 비례해 점의 크기를 설정할 수도 있다.
- D3의 projections은 geoPath()에 사용할 뿐만 아니라 그 자체를 하나의 함수로서 사용할 수도 있다. 위도와 경도 쌍을 담은 배열을 전달해 호출하면 점을 찍을 화면 좌표를 반환한다. 

```javascript
// projection 이 도법
Promise.all([d3.json("world.geojson"), d3.csv('cities.csv')])
.then(dataList => {
  const [countries, cities] = dataList
  createMap(countries, cities)
});


const width = 500
const height = 500

function createMap(countries, cities) {
  const aProjection = d3.geoMercator()
                        .scale(80)
                        .translate([width / 2, height / 2]);
  const geoPath = d3.geoPath().projection(aProjection);


  d3.select("svg").selectAll("path").data(countries.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .attr("class", "countries")
    .style('fill', 'gray')
    

  d3.select("svg").selectAll("circle").data(cities)
    .enter()
    .append("circle")
    .style("fill", "black")
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("r", 3)
    .attr("cx", function(d) {return aProjection([d.y,d.x])[0]})
    .attr("cy", function(d) {return aProjection([d.y,d.x])[1]})
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
  Promise.all([d3.json("world.geojson"), d3.csv('cities.csv')])
  .then(dataList => {
    const [countries, cities] = dataList
    createMap(countries, cities)
  });


  const width = 500
  const height = 500
  
  function createMap(countries, cities) {
    const aProjection = d3.geoMercator()
                          .scale(80)
                          .translate([width / 2, height / 2]);

    const mProjection = d3.geoMollweide()
                          .scale(120)
                          .translate([width / 2, height / 2]);

    // const geoPath = d3.geoPath().projection(aProjection);
    const geoPath = d3.geoPath().projection(mProjection);
    // 영역의 최소값과 최대값을 구할 수 있다.
    const featureSize = d3.extent(countries.features, d => geoPath.area(d)) 
    // 지형을 측정해 색상 그레이디언트에 정의된 색상을 할당한다. 
    // scaleQuantize : 연속적인 range 대신에 불연속적인걸 사용한다는걸 제외하고는 linear scales 와 유사
    // colorbrewer : 색상 배열로 정보 시각화에 지도 제작에 유용한 라이브러리
    // http://colorbrewer2.org/export/colorbrewer.js
    const countryColor = d3.scaleQuantize().domain(featureSize).range(colorbrewer.Reds[7])

    d3.select("svg").selectAll("path").data(countries.features)
    	.enter()
      .append("path")
      .attr("d", geoPath)
      .attr("class", "countries")
      // 면적에 따라 나라의 색상을 칠한다.
      .style('fill', d => countryColor(geoPath.area(d)))
      

    d3.select("svg").selectAll("circle").data(cities)
      .enter()
      .append("circle")
      .style("fill", "black")
      .style("stroke", "white")
      .style("stroke-width", 1)
      .attr("r", 3)
      .attr("cx", function(d) {return mProjection([d.y,d.x])[0]})
      .attr("cy", function(d) {return mProjection([d.y,d.x])[1]})
}
```

### 정보 시각화 용어 : 코로플레스 지도

- 코로플레스 지도는 색상으로 데이터를 인코딩하는 지도를 말한다. 예를 들어 색상으로 나라별 GDP, 인구, 주요 언어 등 통계 데이터를 보여줄 수 있다. 
- D3 에서는 `properties` 필드에 정보를 가진 지리 데이터를 사용하거나 지리 데이터와 통계 데이터 테이블 두 개를 연결해 만들 수 있다. 
- 공간 단위 문제가 발생할 수 있으므로 주의해야 한다. 공간 단위 문제는 통계 데이터를 왜곡해서 보여주려 기존 지형에 경계를 그릴 때 발생한다. 자기 당에 유리하도록 선거구를 정하는 게리맨더링은 이런 문제의 대표적인 예다.




### 상호작용성

- D3는 지역을 색칠하려고 영역을 계산하는 것 외에도 유용한 기능이 많다. 
- 지도를 제작할 때는 지리 영역의 중심(도심_centroid 라고 한다.)을 계산하는 기능과 경계 샂아를 구하는 기능을 흔히 사용한다.
- 다음은 각 국가를 에워싼 사각형과 국가의 중심에 빨간 동그라미를 대화형으로 그렸다. 또한 경로에 마우스 오버 이벤트를 추가하고 각 지형의 중심에 원을, 주변에는 경계 상자를 그린다.
- D3는 가중치로 중심을 계산하므로 경계 상자가 아니라 지형의 중심을 계산한다. 

```javascript

```