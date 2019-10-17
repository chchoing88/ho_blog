---
title: webpack-understanding
date: "2019-10-17 T10:00:03.284Z"
---


[이글](https://medium.com/ag-grid/webpack-tutorial-understanding-how-it-works-f73dfa164f01)을 번역(의역)한 것입니다. 

# Webpack Tutorial: Understanding How it Works

## Introduction to Webpack Tutorial

Webpack은 모듈 번들러 입니다. 이것은 여러가지 디펜던시들을 받고 그것들의 모듈을 생성하고 전체 네트워크를 관리 가능한 번들 파일로 묶습니다.
특히 요즘 웹 어플리케이션의 기본이 되는 **Single Page Application**(SPAs) 에서 유용합니다.

이 글의 모든 코드들은 다음 [GitHub](https://github.com/seanlandsman/ag-grid-understanding-webpack)에 있습니다.


우리가 2개의 간단한 수학적 작업을 하는 어플리케이션이 있다고 가정해 봅시다.- sum 과 multiply. 우리는 이 2개의 함수를 유지보수를 위해 나눠서 관리 할 것입니다.

```html
<html>
<head>
    <script src="src/sum.js"></script>
    <script src="src/multiply.js"></script>
    <script src="src/index.js"></script>
</head>
</html>
```

```javascript
var totalMultiply = multiply(5, 3);
var totalSum = sum(5, 3);
console.log('Product of 5 and 3 = ' + totalMultiply);
console.log('Sum of 5 and 3 = ' + totalSum);
```

```javascript
var multiply = function (a, b) {
    var total = 0;
    for (var i = 0; i < b; i++) {
        total = sum(a, total);
    }
    return total;
};
```

```javascript
var sum = function (a, b) {
    return a + b;
};
```

해당 결과로는 다음과 같습니다.

```
Product of 5 and 3 = 15
index.js:17 Sum of 5 and 3 = 8

```

# How can Webpack help us?

## Dependencies — Modules To the Rescue!

위 코드를 살펴보면 multiply.js와 index.js는 sum.js에 의존성을 가지고 있습니다. 다음과 같은 간단한 다이어그램으로 표현할 수 있습니다.

![https://miro.medium.com/max/984/0*T6Cg8t5_4nr0QFRf.png](https://miro.medium.com/max/984/0*T6Cg8t5_4nr0QFRf.png)

만약에 index.html에서 js 파일의 순서를 잘못 넣었다면 어플리케이션은 작동하지 않았을 것입니다. 만약 index.js가 나머지 2개의 js 파일 이전에 실행이 되었거나 또는 sum.js가 multiply.js 이후에 실행이 되었다면 에러를 마주할 것입니다.

우리가 이 웹 어플리케이션을 확장했다고 상상해 봅시다.-수 많은 디펜던시 파일들이 있고 몇몇은 다른 모듈들에 디펜던시를 가지고 있습니다.
유지보수에 악몽이 시작될 것입니다.

마지막으로 전역변수를 사용했다고 생각해봅시다. 우리는 이 변수를 overwriting 할 위험을 가질 것이고 버그를 찾기가 힘들어 질 것입니다.

Webpack은 이런 디펜던시들을 모듈로 변환시킬 수 있습니다. - 이 모듈들은 매우 타이트한 스코프를 지닐것입니다. 게다가 이런 디펜던시를 모듈로 변환함으로써 Webpack은 우리 대신에 우리의 디펜던시들을 관리할 수 있습니다. - Webpack은 이런 디펜던트 모듈들을 제시간에 정확한 스포크를 가지고 밀어 넣어줄 것입니다. ( 나중에 더 자세하게 살펴 봅시다. )


## Death by a Thousand Cuts — Reducing Traffic

우리가 index.html 파일을 살펴볼때 3가지의 분리된 파일을 필요로 하다는것을 확인할 수 있습니다. 이것은 괜찮습니다. 하지만 많은 디펜던시 파일들이 있다고 상상해 보십시오. end 유저는 이 모든 디펜던시 파일들이 다운로드 할때까지 기다려야 할 것입니다.

Webpack의 제공되는 다른 특징으로는 번들링입니다. 즉, Webpack은 모든 디펜던시 파일들을 하나의 파일로 가져올 수 있습니다. 이말은 하나의 파일만 다운로드가 가능해진다는 것입니다.

![https://miro.medium.com/max/1264/0*h1oaGZlHh88jEEtv.png](https://miro.medium.com/max/1264/0*h1oaGZlHh88jEEtv.png)

번들과 모듈화는 Webpack의 메인 특징입니다. plugin들과 loader들로 확장이 가능하지만 이것이 Webpack의 주된 기능입니다.

## Making Dependencies Available, And Linking Them

처음 셋팅할때 우리는 CommonJS 모듈 문법을 사용할 것입니다. 이것에 대한 다른 옵션(AMD, ES2015)이 있습니다. 하지만 지금은 CommonJS 를 사용하고 추후에 ES2015 를 사용할 것입니다.

CommonJS 는 `module.exports`로 함수들과 변수들을 다른 코드에 노출 시키는데 사용합니다. `require`를 사용하면 노출된 값들을 가져올 수 있습니다. 

```html
<html>
<head>
    <script src="./dist/bundle.js""></script>
</head>
</html>
```

```javascript
var multiply = require('./multiply');
var sum = require('./sum');
var totalMultiply = multiply(5, 3);
var totalSum = sum(5, 3);
console.log('Product of 5 and 3 = ' + totalMultiply);
console.log('Sum of 5 and 3 = ' + totalSum);
```

```javascript
var sum = require('./sum');
var multiply = function (a, b) {
    var total = 0;
    for (var i = 0; i < b; i++) {
        total = sum(a, total);
    }
    return total;
};
module.exports = multiply;
```

```javascript
var sum = function (a, b) {
    return a + b;
};
module.exports = sum;
```

우리는 `sum`과 `multiply` 이 2개를 다른 코드에서 사용 가능하도록 만들었습닏다. 그리고 이 노출된 함수들을 multiple.js와 index.js에서 가져올 수 있습니다.

그리고 index.html에선 bundle.js 라는 하나의 파일만 가져왔습니다.

아주 훌륭합니다! 더 이상 디펜던시의 순서에 대해서 걱정할 필요가 없습니다. 우리가 원하는 것을 노출시켰고 다른 코드와 효율적으로 private 하게 유지 했습니다. 또한 3개의 파일(sum.js, multiply.js and index.js)을 불러오는 대신 하나의 파일만 불러와서 loading 속도도 개선했습니다.

## Webpack — Initial Configuration

위 코드를 수행하기 위해서 우리는 Webpack을 셋팅할 것입니다.

```javascript
var path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist/),
        filename: 'bundle.js
    }
}
```

우리는 Webpack에게 entry point와 어디에 결과물을 내보낼지에 대한 최소한의 셋팅을 하였습니다.

`entry` : 이것은 어플리케이션의 메인 시작 포인트 입니다. 어디서 초기 로딩과 어플리케이션 로직이 시작되는 지를 가리킵니다. Webpack은 이 시작점부터 디펜던시 파일 트리를 탐색합니다. 그리고 이 디펜던시 그래프를 만들고 필요한 모듈들을 만들게 됩니다.

`output.path` : 번들링 된 절대 경로 입니다. 크로스 플랫폼과 쉬운 사용을 위해 우리는 Node.js 에 내장되어있는 (path) 함수를 사용합니다. 이것은 동적으로 우리가 있는 위치에 따라서 절대 경로를 만들어주도록 도와줍니다. 

`output.filename` : 결과물의 파일 이름입니다. 아무거나 지정해도 되지만 보통 컨벤션에 의해서 'bundle.js' 라고 지칭 합니다.

Note: __dirname is a Node.js utility variable - it is the directory name of the current file.


## Looking at bundle.js

결과 bundle.js를 보는 것은 매우 지시적 일 수 있습니다.

```javascript
// the webpack bootstrap
(function (modules) {
    // The module cache
    var installedModules = {};
    // The require function
    function __webpack_require__(moduleId) {
        // Check if module is in cache
        // Create a new module (and put it into the cache)
        // Execute the module function
        // Flag the module as loaded
        // Return the exports of the module
    }


    // expose the modules object (__webpack_modules__)
    // expose the module cache
    // Load entry module and return exports
    return __webpack_require__(0);
})
/************************************************************************/
([
    // index.js - our application logic
    /* 0 */
    function (module, exports, __webpack_require__) {
        var multiply = __webpack_require__(1);
        var sum = __webpack_require__(2);
        var totalMultiply = multiply(5, 3);
        var totalSum = sum(5, 3);
        console.log('Product of 5 and 3 = ' + totalMultiply);
        console.log('Sum of 5 and 3 = ' + totalSum);
    },
    // multiply.js
    /* 1 */
    function (module, exports, __webpack_require__) {
        var sum = __webpack_require__(2);
        var multiply = function (a, b) {
            var total = 0;
            for (var i = 0; i < b; i++) {
                total = sum(a, total);
            }
            return total;
        };
        module.exports = multiply;
    },
    // sum.js
    /* 2 */
    function (module, exports) {
        var sum = function (a, b) {
            return a + b;
        };
        module.exports = sum;
    }
]);
```

Webpack이 각각의 파일들을 모듈로 감싸고 있고 그것들을 모듈의 배열로써 Webpack bootstrap에 넣습니다. 각각의 모듈들은 Webpack에 추가가 되고 이들을 실행하고 다른 모듈에서 사용할 수있게 합니다.

모듈 배열에서 index.js로 보이는 `__webpack_require__(0)`를 실행합니다. 결과는 우리가 처음에 했던 결과이지만 더 쉽게 디펜던시들을 관리할 수 있게 되었습니다.

## Loaders — Making Webpack Smarter

Webpack은 Javascript를 이해합니다. 그리고 모듈을 만들고 Javascript를 번들해서 내놓습니다. 하지만 Javascript 외에 무엇인가를 하기 원하고 또는 ES2015나 ES6로 무엇인가를 작성하기 원한다면 Webpack에게 이것들을 어떻게 진행해야 하는지 말해주어야 합니다.

좀 더 정확하게, 우리는 다른 언어와 버젼들을 Javascript ES5로 전처리를 해야할 필요가 있습니다.

우리는 Typescript의 광팬이지만, 이 예제에서는 예제 코드를 ES2015로 변환합니다. 그리고 Babel을 컨버팅으로 사용합니다.

Babel은 ES2015를 ES5로 트랜스파일링 하는 훌륭한 도구입니다. 하지만 여기서는 다루지 않겠습니다. 

처음으로 ES5 코드를 ES2015로 변환해 봅시다.

```javascript
import multiply from './multiply';
import sum from './sum';
const totalMultiply = multiply(5, 3);
const totalSum = sum(5, 3);
console.log(`Product of 5 and 3 = ${totalMultiply}`);
console.log(`Sum of 5 and 3 = ${totalSum}`);
```

```javascript
import sum from './sum';
const multiply = (a, b) => {
    let total = 0;
    for(let i=0;i<b;i++) {
        total = sum(a, total);
    }
    return total;
};
export default multiply;
```

```javascript
const sum = (a, b) => a + b;
export default sum;
```

화살표 함수와 const 키워드, 그리고 템플릿 리터럴, es2015의 import/export 모듈 포멧을 사용했습니다. 이 모든게 ES2015의 특징입니다.

Babel을 사용하기 위해서는 Babel Loader가 필요합니다. Loader는 Webpack에게 어떻게 Javascript 가 아닌 컨텐츠를 처리해야 하는지를 알려줍니다. Loader를 함께 사용하면 Webpack은 다양한 타입의 파일들을 처리할수 있습니다. - CSS, Image, Typescript, ES2015 코드 등등

다음과 같이 3가지의 Babel 디펜던시들을 웹팩에서 사용해야 합니다.

-   `babel-loader`: Babel과 Webpack 사이의 인터페이스
-   `babel-core`: 어떻게 코드를 읽고 분석할지를 이해하고 관련된 output을 생성해준다.
-   `babel-preset-es2015`: ES2015를 Babel이 어떻게 처리 할지에 대한 규칙과 그것을 ES5로 변환해준다. 

Babel Loader를 사용한 웹팩 구성은 다음과 같습니다.

```javascript
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
```

웹팩에는 많은 Loader들이 있기 때문에 값을 배열로 주입해주어야 합니다. - 우리의 경웅에는 하나의 로더만 주입했습니다.

- `test`: 우리는 Loader에게 JavaScript 파일 만 처리하기를 원한다고 알려야합니다. CSS, HTML, 이미지 등을 찾지 않고 JavaScript (.js) 파일 만 찾습니다. 이를 위해 .js 파일과 일치하는 정규식을 제공합니다.
- `loader`: 사용할 로더 - 이 경우 바벨 로더
- `exclude`: 우리는 Babel이 node_modules 아래의 파일을 처리하는 것을 원하지 않습니다
- `query.presets`: 적용하려는 Babel Preset (또는 규칙)-이 경우 ES2015 코드를 변환 할 Babel을 찾고 있습니다.

bundle.js를 다시 보면 ( 여기서는 sum.js만 보겠습니다. ) 다음과 같이 보입니다.

```javascript
/* 2 */
function(module, exports) {
    var sum = function sum(a, b) {
        return a + b;
    };
    module.exports = sum;
}
```

바벨 로더가 우리 ES2015 코드를 ES5 코드로 변환시켰습니다.

## Making Webpack Look Good — CSS & Styling

실제로 계산 결과를 출력하도록 예제를 확장 해 보겠습니다. 
페이지에서 본문을 만든 다음 제품 및 합계를 spans에 추가하여 본문에 추가합니다.

```javascript
import multiply from './multiply';
import sum from './sum';

const totalMultiply = multiply(5, 3);
const totalSum = sum(5, 3);

// create the body
const body = document.createElement("body");
document.documentElement.appendChild(body);

// calculate the product and add it to a span
const multiplyResultsSpan = document.createElement('span');
multiplyResultsSpan.appendChild(document.createTextNode(`Product of 5 and 3 = ${totalMultiply}`));

// calculate the sum and add it to a span
const sumResultSpan = document.createElement('span');
sumResultSpan.appendChild(document.createTextNode(`Sum of 5 and 3 = ${totalSum}`));

// add the results to the page
document.body.appendChild(multiplyResultsSpan);
document.body.appendChild(sumResultSpan);
```

출력은 이전과 동일하지만 페이지에 표시됩니다.

```
Product of 5 and 3 = 15 Sum of 5 and 3 = 8
```

CSS를 사용하여이를 개선 할 수 있습니다. 
각 결과가 새로운 줄에 있는지 확인하고 각 결과 주위에 테두리를 추가하겠습니다.

우리 CSS 는 다음과 같습니다.

```css
span {
    border: 5px solid brown;
    display: block;
}
```
이 CSS를 우리 어플리케이션으로 가져와야합니다. 물론 html에 링크 태그를 추가 할 수는 있지만, CSS를 import 하고 Webpack을 사용하여 처리하면 Webpack이 제공 할 수있는 혜택을 얻을 수 있습니다.

코드에서 CSS를 가져 오면 얻을 수있는 또 다른 이점은 개발자 (개발자)가 CSS와 그 사용처 사이의 연관성을 확인할 수 있다는 것입니다. CSS는 가져온 모듈에 국한되지 않지만 (전역 적으로) 개발자의 관점에서 보면 관계가 더 명확합니다.


```javascript
import multiply from './multiply';
import sum from './sum';

// import the CSS we want to use here
import './math_output.css';

const totalMultiply = multiply(5, 3);
const totalSum = sum(5, 3);

// create the body
const body = document.createElement("body");
document.documentElement.appendChild(body);

// calculate the product and add it to a span
const multiplyResultsSpan = document.createElement('span');
multiplyResultsSpan.appendChild(document.createTextNode(`Product of 5 and 3 = ${totalMultiply}`));

// calculate the sum and add it to a span
const sumResultSpan = document.createElement('span');
sumResultSpan.appendChild(document.createTextNode(`Sum of 5 and 3 = ${totalSum}`));

// add the results to the page
document.body.appendChild(multiplyResultsSpan);
document.body.appendChild(sumResultSpan);
```

이전과 달라진 것은 이제 CSS를 가져 오는 것입니다.

CSS를 처리하려면 두 개의 로더가 필요합니다 :

- `css-loader` : CSS 가져 오기 처리 방법을 알고 있습니다. 가져온 CSS를 가져 와서 파일 내용을로드합니다.
- `style-loader` : (가져 오기에서) CSS 데이터를 가져 와서 HTML 문서에 추가합니다

우리의 Webpack 설정은 다음과 같습니다 :

```javascript
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }
        ]
    }
};
```

- `test`: 이전과 마찬가지로, 로더에게 CSS 파일 만 처리하길 원한다고 알려야합니다.이 정규식은 .css 파일 만 처리합니다.
- `loaders`: 사용할 로더. 이번에는 로더 배열을 제공 할 때 복수입니다. 또한 Webpack은 **오른쪽에서 왼쪽** 으로 로더를 처리하므로`css-loader` (파일 내용)의 결과는`style-loader` (스타일을 HTML 문서에 추가)로 전달됩니다.

이제 Webpack을 실행하고 응용 프로그램을 다시로드하면 결과는 다음과 같습니다.

![https://miro.medium.com/max/3394/0*vv_pCY61tsoRlnzX.png](https://miro.medium.com/max/3394/0*vv_pCY61tsoRlnzX.png)

코드를 보면 두 로더는 HTML 문서에 스타일을 동적으로 추가했습니다. 
Chrome에서 결과 HTML을 검사하면 다음을 볼 수 있습니다.

CSS를 처리하는 다른 방법이 있습니다. 캐시 무효화 (고유 해시 파일)CSS를 파일로 분할 한 다음 이러한 파일을 결과 번들에 포함 할 수 있습니다.

지금은 CSS를 추출하여 가져올 수 있는 파일로 출력 해 봅시다. 이를 위해 Plugin : `ExtractTextPlugin`을 사용합니다.

로더는 번들로 출력되기 전에 데이터를 사전 처리하는 데 사용됩니다. 그러나 플러그인은 번들에 출력으로 나올 것들을 결과물로 내보낼 수 있습니다.

우리의 Webpack 설정은 다음과 같습니다 :

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css-loader')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
};
```

`ExtractTextPlugin` 을 최상단에서 import 했습니다. 그리고 CSS loader를 이 플러그인을 사용하도록 바꾸었습니다.

```javascript
{
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('css-loader')
}
```

이것은 Webpack에 css-loader 결과를 ExtractTextPlugin에 전달하라고 말하는 것과 같습니다. 아래는 플러그인 셋팅입니다. 

```javascript
plugins: [
    new ExtractTextPlugin('style.css')
]
```

이것이 하는 일은 플러그인에 전달 된 모든 데이터를 해당 파일에 전달 하는 것입니다. 여기서는 **style.css** 로 불리는 파일이 저장 됩니다.
지금은 당장 유용해 보이지 않지만 이전이 Javascript 파일이 많아졌던것 처럼 많은 CSS 파일이 있다고 상상해 보십시요. 위와 같이 하면 우리는 분리되어 있는 많은 CSS 파일들을 하나로 만들 수 있고 웹 호출의 횟수와 시간을 절약할 수 있습니다.

 **dist/style.css** 에서 다음과 같이 볼 수 있습니다.

```css
 span {
    border: 5px solid brown;
    display:block;
}
```

이를 사용하려면 다음 CSS를 가져 오기 위해 index.html을 수정해야합니다.

```html
<html>
<head>
    <link rel="stylesheet" href="dist/style.css"/>
    <script src="./dist/bundle.js""></script>
</head>
</html>
```

결과는 아까와 같을 것입니다.

## A Picture Is Worth A Thousand Words

![https://miro.medium.com/max/1800/1*xVUVUNHykoIlyHpPQn-VTw.jpeg](https://miro.medium.com/max/1800/1*xVUVUNHykoIlyHpPQn-VTw.jpeg)


우리 어플리케이션에 이미지를 추가 해 봅시다. 그리고 웹팩이 우리를 대신에 그것들을 처리하도록 해봅시다.

여기서 작은거 하나 큰거 하나 2개의 이미지를 사용해봅시다. 

이미지를 처리하기 위해선 다음과 같은 2가지의 Loader를 사용합니다:

- `image-webpack-loader`: 큰 이미지를 압축 해줍니다.
- `url-loader`: `image-webpack-loader`으로 나온 결과가 작다면 인라인으로 크다면 output 디렉토리에 이미지를 포함시킵니다다.

우리는 대략 32kb의 큰 이미지 multiply.png 와 대략 13kb 정도의 작은 sum.png 파일을 추가할 것입니다.

먼저 이미지를 추가하는 유틸 함수를 만듭시다. 

```javascript
// image_util.js
const addImageToPage = (imageSrc) => {
    const image = document.createElement('img');
    image.src = imageSrc;
    image.style.height = '100px';
    image.style.width = '100px';
    document.body.appendChild(image);
};
export default addImageToPage;
```

새로운 이미지 유틸리티와 응용 프로그램에 추가 할 이미지를 모두 가져옵니다.

```javascript
import multiply from './multiply';
import sum from './sum';

// import our image utility
import addImageToPage from './image_util';

// import the images we want to use
import multiplyImg from '../images/multiply.png';
import sumImg from '../images/sum.png';

// import the CSS we want to use here
import './math_output.css';

const totalMultiply = multiply(5, 3);
const totalSum = sum(5, 3);

// create the body
const body = document.createElement("body");
document.documentElement.appendChild(body);

// calculate the product and add it to a span
const multiplyResultsSpan = document.createElement('span');
multiplyResultsSpan.appendChild(document.createTextNode(`Product of 5 and 3 = ${totalMultiply}`));

// calculate the sum and add it to a span
const sumResultSpan = document.createElement('span');
sumResultSpan.appendChild(document.createTextNode(`Sum of 5 and 3 = ${totalSum}`));

// add the results to the page
addImageToPage(multiplyImg);
document.body.appendChild(multiplyResultsSpan);
addImageToPage(sumImg);
document.body.appendChild(sumResultSpan);
```


마지막으로 두 개의 새로운 로더로 이러한 이미지를 처리하도록 Webpack을 구성 해 보겠습니다.

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css-loader')
            },
            {
                test: /\.png$/,
                loaders: [
                    'url-loader?limit=5000',
                    'image-webpack-loader'
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
```

- `output.publicPath` : URL 로더가 디스크에 저장 될 파일에 추가 할 접두사를 알 수 있도록합니다. 예를 들어 위 결과로 img.src는 img.src='dist/output_file.png' 입니다.
- `test`: 이전과 같이 이미지 파일 만 처리하도록 로더에 알려 주어야합니다.이 정규식은 .png 파일 만 처리합니다. 우리는 다른 이미지 형식에 대한 지원을 추가함으로써 이것을 더욱 복잡하게 만들 수 있습니다.
- `loaders`: 사용할 로더 - Webpack은 **오른쪽에서 왼쪽**으로 로더를 처리하므로 `image-webpack-loader`의 결과는`url-loader`로 전달됩니다.

만약 웹팩을 동작하면 다음고 같은 것을 볼 수 있을 것입니다.

```
38ba485a2e2306d9ad96d479e36d2e7b.png
bundle.js
style.css
```

만약 우리가 **38ba485a2e2306d9ad96d479e36d2e7b.png** 이 파일을 열면 multiply.png의 큰 이미지를 확인 할 수 있습니다. 작은 sum.js 이미지의 경우에는 bundle.js에 다음과 같이 인라인으로 들어가 있습니다.

```
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAMAAAACDyzWAAAC6FBMVEUAuv8AgL...."
```

이것은 다음과 같습니다.

```
img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAMAAAACDyzWAAAC6FBMVEUAuv8AgL...'
```

어플리케이션을 동작시켜 보면 다음과 같이 나옵니다.

![https://miro.medium.com/max/3398/0*be1gKO7ulqWto3rP.png](https://miro.medium.com/max/3398/0*be1gKO7ulqWto3rP.png)


이 Webpack Tutorial에서 Webpack이 응용 프로그램 개발자로 제공 할 수있는 내용을 확인할 수 있습니다. 
상당히 적은 양의 구성으로 ES2015 코드를 처리하고, 번들로 묶고, CSS를 처리하고, 크고 작은 이미지를 모두 이해하기 쉬운 방법으로 처리 할 수 있었습니다.

우리는 이 모든 것을 달성했으며 Webpack 이 할 수있는 일의 아주 작은 부분만 살펴 보았습니다. 코드를 축소 및 축소하고, 코드를 캐시를 안태우는 파일 이름으로 분할하고, TypeScript 및 Angular를 처리 할 수 ​​있습니다. 옵션이 너무 많습니다!