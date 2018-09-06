webpackJsonp([51191554927023],{525:function(n,e){n.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/javascript-basic1/index.md absPath of file >>> MarkdownRemark",html:'<h1>패턴 연습을 위한 기본 다지기</h1>\n<h2>일급 객체인 함수를 잘 다루자</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 함수를 인자로 받거나 함수를 리턴한다. 이것은 즉, 함수가 high order function 임을 인지한다.\n\n```javascript\n// d3.js example\n\nvar svg = {};\nsvg.line = function(){\n\n    var getX = function(){};\n    var getY = function(){};\n    var interpolate = function(){};\n\n    function line(data){\n        //...\n        // private 함수.\n        function segment(){}\n        var d = data\n        // getX 와 getY 로 필요한 데이터를 추출해서 사용.\n        // call 로 함수를 호출 하는 까닭은~?\n        getX.call(this,d,i);\n        getY.call(this,d,i);\n\n        // 추출 후 segment() 함수 사용.\n    }\n\n    line.x = function(fn){ \n        if(!argument.length) return getX;\n        getX = fn; \n        return line;\n    }\n    line.y = function(fn){ \n        if(!argument.length) return getY;\n        getY = fn; \n        return line;\n    }\n\n    return line; // 함수를 리턴한다. \n}\n\n// usage\nvar lineGenerator = svg.line();\nvar path = lineGenerator(data);\n\n// 데이터가 달라질때 데이터 추출을 위한 함수 변경이 필요하다.\nvar lineGenerator = svg.line()\n    .x(function(d){})\n    .y(function(d){})\n\n// 내가 만든 객체에서 값을 얻게끔 라인 생성기를 확장.\nvar merlin = {\n    getValue: function(){},\n    lineGenerator: svg.line()\n        .x(function(d){return 10 - this.getValue()})\n        .y(function(d){return 10 + this.getValue()})\n}\n\nvar path = merlin.lineGenerator();\n\n\n```\n\n- 위의 getX 와 getY를 그냥 getX() / getY() 처럼 호출 했다면 위 코드는 getValue는 정의되어있지 않은 method라고 에러가 날것이다.\n하지만 getX.call(this) / getY.call(this) 여기서 이 this 는 함수를 호출한 객체를 참조한다.</code></pre>\n      </div>\n<h2>덕 타이핑</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 오리처럼 생겨서 오리처럼 걷고 오리처럼 꽥꽥 소리를 낸다면 그건 오리다.\n\n> 그게 오리인지 검사하지 말고, 당신이 오리의 무슨 행동이 필요한지에 따라서 오리처럼 우는지, 오리처럼 걷는지 등등 적절한 행동을 오리처럼 하는지 검사하세요~\n\n- 즉, 사람이라도 오리처럼 울고 오리처럼 뒤뚱거리면 그건 사람이 아니라 오리이다.\n\n- 덕 타이핑이란 형태를 판별하는 대신, 원하는 동작을 수행할수 있는지에 대한 여부만 가지고 검사를 한다. 이때문에 오류들이 잠재할 수 있는 소지들을 안고있다.\n\n```javascript\n// 오리라면 먹이를 주자. 이런 주제가 있다고 하면\n// 오리\nfunction Duck(){\n    return {\n        duckSound: function(){}\n    }\n}\n\n// 어떤새.\nfunction Bird(){\n    return {\n        duckSound: function(){}\n    }\n}\n\nfunction Merlin(){\n    return {\n        feed: function(obj){\n            // if( obj instanceof Duck ) // 이것은 Duck로 객체를 생성했을 시.\n            // if(\'duckSound\' in obj)\n            if(obj.hasOwnProperty(\'duckSound\')){ // 이부분 오리인지 아닌지 확인하는 부분\n                return true;\n            }\n            return false;\n        }\n    }\n}\nvar bird1 = new Bird();\nvar bird2 = new Duck();\nvar merlin = new Merlin();\n\nvar result1 = merlin.feed(bird1); // true\nvar result2 = merlin.feed(bird2); // true\n\n// 판별 방법\nif( something instanceof Merlin)\n// or\nif( \'x\' in something)\n// or\nif( something.hasOwnProperty(\'x\'))\n\n```</code></pre>\n      </div>\n<h2>함수 오버로딩</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 자바스크립트에서 함수 오버로딩을 사용할 수 있다.\n\n```javascript\n// ex 1) 인자 갯수에 따른 다른 처리 방법\nfunction a() {\n    if(!arguments.length) {\n        // 인자가 하나도 없을 시 처리하는 로직\n        return ;\n    }\n\n    // 그외.. \n}\n\n// ex 2) 콜백함수\n\nfunction a(data,fn) {\n    var i = 0;\n    var d = data;\n\n    while(i < 10){\n        fn(data,i);\n        i++;\n    }\n}\n// a에 넘기는 콜백함수는 기본 인자를 2개 받기에 사용자가 선택적으로 사용해도 된다.\na({}, function(data,index){\n    // data 만 써두 되고..\n    // 주는 index를 같이 써두 되고..\n    // 사용자에게 선택의 폭을 넓혀준다.\n})\n\n```</code></pre>\n      </div>\n<h2>스코프는 중첩 함수로 다스린다.</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 함수를 중첩하여 코드를 계층화할 수 있다. \n- 프로그램에서 변수/함수의 스코프를 최소화할 수 있다.\n- 스코프를 최소화?\n\n> 즉, 자바스크립트 스코프는 함수 선언시에 결정되기 때문에 함수를 중첩화 해서 실행시키면 그 안에서만의 스코프가 생겨난다. 다른 스코프에 영향이 가지 않기에 범위를 최소화 시킨다고 한다.</code></pre>\n      </div>\n<h2>단일 책임 원칙</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 모든 클래스 및 함수는 반드시 한가지 변경 사유가 있어야 한다.\n- 유일한 관심사만 확인하고, 어떻게 이행할지는 외부에서 제공하게끔 하면 도움이 된다.</code></pre>\n      </div>\n<h2>개방/폐쇄 원칙</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 실행 코드를 변경하지말고 어떻게든 재사용하고 확장하라는 뜻.\n- 변경되지 않을 것과 변경 가능성이 있는 것을 내다보는 힘을 길러야 한다.</code></pre>\n      </div>\n<h2>리스코프 치환 원칙</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 한 객체를 다른 객체에서 파생하더라도 그 기본 로직이 변경되어서는 안된다.\n- </code></pre>\n      </div>\n<h2>인터페이스 분리 원칙</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 함수가 기대하는 인자가 무엇인지 명확히 하고 그 기대치를 최소화 해야한다. \n- 특정 타입의 인자를 바라기보다는 이 타입에서 실제로 필요한 프로퍼티가 더러 있을 거라 기대하는 것이다.</code></pre>\n      </div>\n<h2>의존성 연전 원칙</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 인터페이스 기반 언어에서는 대개 의존성 주입이라는 연관된 개념으로 표현한다.\n- 상위 수준 모듈은 하위 수준 모듈에 의존해서는 안 되며 이 둘은 추상화에 의존해야 한다.\n- 클래스 A 가 클래스 B 를 필요로 할때 A 에서 B 를 생성하는게 아닌 A 생성자 안에 B를 서술하는 인터페이스를 만들어 놓고 A 가 생성이 되면 구체화한 B를 넘겨받는다.\n\n```javascript\n// bad!!\nfunction A(){\n    var b = new B(); // b 에 의존.\n    return {\n        //..\n    }\n}\n\nfunction B(){\n    var name = "merlin"\n    return {\n        id : name\n    }\n}\n\n// good!!\nfunction A(){\n    var b = { id: "none" } // 인터페이스\n\n    return {\n        setB: function (obj){\n            b = obj;\n        }\n    }\n\n}\n\nvar a = new A();\na.setB(new B());\n\n```\n\n- 위 처럼 해야 B의 파생형 버전을 제공할수 있는 이점이 있고 B를 고쳐야 할 경우 하위 버전 호환성을 유지하려면 어떤 로직을 계속 갖고 있어야 하는지 일목요연하게 서술한다.\n\n```javascript\n// 어떠한 데이터로 라인을 그린다.\nfunction baseFn(data){\n    return data;\n}\n\nsvg.line = function(){\n    return svg_line(baseFn);\n}\n\nfunction svg_line(projection){\n    function line(data){\n        \n        function segment(){\n            // 이 함수를 호출해서 여러가지 일을 한다...\n            projection(data);\n        }\n    }\n    return line;\n}\n\nvar lineGenerator = svg.line();\nvar path = lineGenerator(data); // 이렇게 하면 데이터 그대로 라인을 그린다.\n\n// 허나 난 이 데이터를 기반으로 다른 모양으로 그리겠다.\n// 데이터를 어떻게 조작할지만 생각한다. 즉, baseFn 만 바꿔주면된다.\n\nfunction additionFn(data){\n    return data*0.3;\n}\nsvg.line.addition = function(){\n    return svg_line(additionFn); // 의존성 주입.\n}\nvar lineGenerator = svg.line.addition();\nvar path = lineGenerator(data);\n```</code></pre>\n      </div>\n<h2>DRY 원칙</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>- 반복하지 마라!!\n- 재사용할 수 있어야 한다. \n\n\n```javascript\n// bad\nwhile( ++i < n) {\n    points.push([+getX.call(this, data[i],i),\n                 +getY.call(this, data[i],i)])\n}\n\n// good\nvar d;\nwhile(++i < n) {\n    d = data[i]\n    points.push([+getX.call(this, d,i),\n                 +getY.call(this, d,i)])\n}\n```</code></pre>\n      </div>',frontmatter:{title:"Javascript-Basic1",date:"April 05, 2018"}}},pathContext:{slug:"/javascript-basic1/"}}}});
//# sourceMappingURL=path---javascript-basic-1-60830071c4fc7a6ae548.js.map