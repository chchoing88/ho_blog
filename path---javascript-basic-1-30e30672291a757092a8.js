webpackJsonp([51191554927023],{416:function(n,s){n.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/javascript-basic1/index.md absPath of file >>> MarkdownRemark",html:'<h1>패턴 연습을 위한 기본 다지기</h1>\n<h2>일급 객체인 함수를 잘 다루자</h2>\n<ul>\n<li>함수를 인자로 받거나 함수를 리턴한다. 이것은 즉, 함수가 high order function 임을 인지한다.</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code> <span class="token comment">// d3.js example</span>\n\n <span class="token keyword">var</span> svg <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n svg<span class="token punctuation">.</span><span class="token function-variable function">line</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n\n     <span class="token keyword">var</span> <span class="token function-variable function">getX</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n     <span class="token keyword">var</span> <span class="token function-variable function">getY</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n     <span class="token keyword">var</span> <span class="token function-variable function">interpolate</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n     <span class="token keyword">function</span> <span class="token function">line</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">{</span>\n         <span class="token comment">//...</span>\n         <span class="token comment">// private 함수.</span>\n         <span class="token keyword">function</span> <span class="token function">segment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>\n         <span class="token keyword">var</span> d <span class="token operator">=</span> data\n         <span class="token comment">// getX 와 getY 로 필요한 데이터를 추출해서 사용.</span>\n         <span class="token comment">// call 로 함수를 호출 하는 까닭은~?</span>\n         getX<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span>d<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n         getY<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span>d<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n         <span class="token comment">// 추출 후 segment() 함수 사용.</span>\n     <span class="token punctuation">}</span>\n\n     line<span class="token punctuation">.</span><span class="token function-variable function">x</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span><span class="token punctuation">{</span> \n         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>argument<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token keyword">return</span> getX<span class="token punctuation">;</span>\n         getX <span class="token operator">=</span> fn<span class="token punctuation">;</span> \n         <span class="token keyword">return</span> line<span class="token punctuation">;</span>\n     <span class="token punctuation">}</span>\n     line<span class="token punctuation">.</span><span class="token function-variable function">y</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span><span class="token punctuation">{</span> \n         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>argument<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token keyword">return</span> getY<span class="token punctuation">;</span>\n         getY <span class="token operator">=</span> fn<span class="token punctuation">;</span> \n         <span class="token keyword">return</span> line<span class="token punctuation">;</span>\n     <span class="token punctuation">}</span>\n\n     <span class="token keyword">return</span> line<span class="token punctuation">;</span> <span class="token comment">// 함수를 리턴한다. </span>\n <span class="token punctuation">}</span>\n\n <span class="token comment">// usage</span>\n <span class="token keyword">var</span> lineGenerator <span class="token operator">=</span> svg<span class="token punctuation">.</span><span class="token function">line</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">lineGenerator</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n <span class="token comment">// 데이터가 달라질때 데이터 추출을 위한 함수 변경이 필요하다.</span>\n <span class="token keyword">var</span> lineGenerator <span class="token operator">=</span> svg<span class="token punctuation">.</span><span class="token function">line</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n     <span class="token punctuation">.</span><span class="token function">x</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n     <span class="token punctuation">.</span><span class="token function">y</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n <span class="token comment">// 내가 만든 객체에서 값을 얻게끔 라인 생성기를 확장.</span>\n <span class="token keyword">var</span> merlin <span class="token operator">=</span> <span class="token punctuation">{</span>\n     getValue<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n     lineGenerator<span class="token punctuation">:</span> svg<span class="token punctuation">.</span><span class="token function">line</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n         <span class="token punctuation">.</span><span class="token function">x</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token keyword">return</span> <span class="token number">10</span> <span class="token operator">-</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n         <span class="token punctuation">.</span><span class="token function">y</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token keyword">return</span> <span class="token number">10</span> <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n <span class="token punctuation">}</span>\n\n <span class="token keyword">var</span> path <span class="token operator">=</span> merlin<span class="token punctuation">.</span><span class="token function">lineGenerator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<ul>\n<li>위의 getX 와 getY를 그냥 getX() / getY() 처럼 호출 했다면 위 코드는 getValue는 정의되어있지 않은 method라고 에러가 날것이다.\n하지만 getX.call(this) / getY.call(this) 여기서 이 this 는 함수를 호출한 객체를 참조한다.</li>\n</ul>\n<h2>덕 타이핑</h2>\n<ul>\n<li>오리처럼 생겨서 오리처럼 걷고 오리처럼 꽥꽥 소리를 낸다면 그건 오리다.</li>\n</ul>\n<blockquote>\n<p>그게 오리인지 검사하지 말고, 당신이 오리의 무슨 행동이 필요한지에 따라서 오리처럼 우는지, 오리처럼 걷는지 등등 적절한 행동을 오리처럼 하는지 검사하세요</p>\n</blockquote>\n<ul>\n<li>\n<p>즉, 사람이라도 오리처럼 울고 오리처럼 뒤뚱거리면 그건 사람이 아니라 오리이다.</p>\n</li>\n<li>\n<p>덕 타이핑이란 형태를 판별하는 대신, 원하는 동작을 수행할수 있는지에 대한 여부만 가지고 검사를 한다. 이때문에 오류들이 잠재할 수 있는 소지들을 안고있다.</p>\n</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code> <span class="token comment">// 오리라면 먹이를 주자. 이런 주제가 있다고 하면</span>\n <span class="token comment">// 오리</span>\n <span class="token keyword">function</span> <span class="token function">Duck</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">return</span> <span class="token punctuation">{</span>\n         duckSound<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>\n     <span class="token punctuation">}</span>\n <span class="token punctuation">}</span>\n\n <span class="token comment">// 어떤새.</span>\n <span class="token keyword">function</span> <span class="token function">Bird</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">return</span> <span class="token punctuation">{</span>\n         duckSound<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>\n     <span class="token punctuation">}</span>\n <span class="token punctuation">}</span>\n\n <span class="token keyword">function</span> <span class="token function">Merlin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">return</span> <span class="token punctuation">{</span>\n         feed<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">{</span>\n             <span class="token comment">// if( obj instanceof Duck ) // 이것은 Duck로 객체를 생성했을 시.</span>\n             <span class="token comment">// if(\'duckSound\' in obj)</span>\n             <span class="token keyword">if</span><span class="token punctuation">(</span>obj<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span><span class="token string">\'duckSound\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token comment">// 이부분 오리인지 아닌지 확인하는 부분</span>\n                 <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n             <span class="token punctuation">}</span>\n             <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n         <span class="token punctuation">}</span>\n     <span class="token punctuation">}</span>\n <span class="token punctuation">}</span>\n <span class="token keyword">var</span> bird1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Bird</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token keyword">var</span> bird2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Duck</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token keyword">var</span> merlin <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Merlin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n \n <span class="token keyword">var</span> result1 <span class="token operator">=</span> merlin<span class="token punctuation">.</span><span class="token function">feed</span><span class="token punctuation">(</span>bird1<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// true</span>\n <span class="token keyword">var</span> result2 <span class="token operator">=</span> merlin<span class="token punctuation">.</span><span class="token function">feed</span><span class="token punctuation">(</span>bird2<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// true</span>\n\n <span class="token comment">// 판별 방법</span>\n <span class="token keyword">if</span><span class="token punctuation">(</span> something <span class="token keyword">instanceof</span> <span class="token class-name">Merlin</span><span class="token punctuation">)</span>\n <span class="token comment">// or</span>\n <span class="token keyword">if</span><span class="token punctuation">(</span> <span class="token string">\'x\'</span> <span class="token keyword">in</span> something<span class="token punctuation">)</span>\n <span class="token comment">// or</span>\n <span class="token keyword">if</span><span class="token punctuation">(</span> something<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span><span class="token string">\'x\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h2>함수 오버로딩</h2>\n<ul>\n<li>자바스크립트에서 함수 오버로딩을 사용할 수 있다.</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code> <span class="token comment">// ex 1) 인자 갯수에 따른 다른 처리 방법</span>\n <span class="token keyword">function</span> <span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n     <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>arguments<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n         <span class="token comment">// 인자가 하나도 없을 시 처리하는 로직</span>\n         <span class="token keyword">return</span> <span class="token punctuation">;</span>\n     <span class="token punctuation">}</span>\n\n     <span class="token comment">// 그외.. </span>\n <span class="token punctuation">}</span>\n\n <span class="token comment">// ex 2) 콜백함수</span>\n\n <span class="token keyword">function</span> <span class="token function">a</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n     <span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>\n     <span class="token keyword">var</span> d <span class="token operator">=</span> data<span class="token punctuation">;</span>\n\n     <span class="token keyword">while</span><span class="token punctuation">(</span>i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n         <span class="token function">fn</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n         i<span class="token operator">++</span><span class="token punctuation">;</span>\n     <span class="token punctuation">}</span>\n <span class="token punctuation">}</span>\n <span class="token comment">// a에 넘기는 콜백함수는 기본 인자를 2개 받기에 사용자가 선택적으로 사용해도 된다.</span>\n <span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span>index<span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token comment">// data 만 써두 되고..</span>\n     <span class="token comment">// 주는 index를 같이 써두 되고..</span>\n     <span class="token comment">// 사용자에게 선택의 폭을 넓혀준다.</span>\n <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h2>스코프는 중첩 함수로 다스린다.</h2>\n<ul>\n<li>함수를 중첩하여 코드를 계층화할 수 있다. </li>\n<li>프로그램에서 변수/함수의 스코프를 최소화할 수 있다.</li>\n<li>스코프를 최소화?</li>\n</ul>\n<blockquote>\n<p>즉, 자바스크립트 스코프는 함수 선언시에 결정되기 때문에 함수를 중첩화 해서 실행시키면 그 안에서만의 스코프가 생겨난다. 다른 스코프에 영향이 가지 않기에 범위를 최소화 시킨다고 한다.</p>\n</blockquote>\n<h2>단일 책임 원칙</h2>\n<ul>\n<li>모든 클래스 및 함수는 반드시 한가지 변경 사유가 있어야 한다.</li>\n<li>유일한 관심사만 확인하고, 어떻게 이행할지는 외부에서 제공하게끔 하면 도움이 된다.</li>\n</ul>\n<h2>개방/폐쇄 원칙</h2>\n<ul>\n<li>실행 코드를 변경하지말고 어떻게든 재사용하고 확장하라는 뜻.</li>\n<li>변경되지 않을 것과 변경 가능성이 있는 것을 내다보는 힘을 길러야 한다.</li>\n</ul>\n<h2>리스코프 치환 원칙</h2>\n<ul>\n<li>한 객체를 다른 객체에서 파생하더라도 그 기본 로직이 변경되어서는 안된다.</li>\n<li>내가 작성중인 함수가 기반 클래스로 하는 일과 서브 클래스로 하는일이 다르다면 이 원칙을 어긴 셈이다.</li>\n<li>자바스크립트에서는 어떤 함수의 인자가 숫자일 때, 문자열일 때, 아예 인자가 없는 undefined 탕입일 때를 각각 분기 처리하는 것이 대개 좋은 습관이다.</li>\n</ul>\n<h2>인터페이스 분리 원칙</h2>\n<ul>\n<li>함수가 기대하는 인자가 무엇인지 명확히 하고 그 기대치를 최소화 해야한다. </li>\n<li>특정 타입의 인자를 바라기보다는 이 타입에서 실제로 필요한 프로퍼티가 더러 있을 거라 기대하는 것이다.</li>\n</ul>\n<h2>의존성 연전 원칙</h2>\n<ul>\n<li>인터페이스 기반 언어에서는 대개 의존성 주입이라는 연관된 개념으로 표현한다.</li>\n<li>상위 수준 모듈은 하위 수준 모듈에 의존해서는 안 되며 이 둘은 추상화에 의존해야 한다.</li>\n<li>클래스 A 가 클래스 B 를 필요로 할때 A 에서 B 를 생성하는게 아닌 A 생성자 안에 B를 서술하는 인터페이스를 만들어 놓고 A 가 생성이 되면 구체화한 B를 넘겨받는다.</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code> <span class="token comment">// bad!!</span>\n <span class="token keyword">function</span> <span class="token function">A</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">var</span> b <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">B</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// b 에 의존.</span>\n     <span class="token keyword">return</span> <span class="token punctuation">{</span>\n         <span class="token comment">//..</span>\n     <span class="token punctuation">}</span>\n <span class="token punctuation">}</span>\n\n <span class="token keyword">function</span> <span class="token function">B</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token string">"merlin"</span>\n     <span class="token keyword">return</span> <span class="token punctuation">{</span>\n         id <span class="token punctuation">:</span> name\n     <span class="token punctuation">}</span>\n <span class="token punctuation">}</span>\n\n <span class="token comment">// good!!</span>\n <span class="token keyword">function</span> <span class="token function">A</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">var</span> b <span class="token operator">=</span> <span class="token punctuation">{</span> id<span class="token punctuation">:</span> <span class="token string">"none"</span> <span class="token punctuation">}</span> <span class="token comment">// 인터페이스</span>\n\n     <span class="token keyword">return</span> <span class="token punctuation">{</span>\n         setB<span class="token punctuation">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">{</span>\n             b <span class="token operator">=</span> obj<span class="token punctuation">;</span>\n         <span class="token punctuation">}</span>\n     <span class="token punctuation">}</span>\n\n <span class="token punctuation">}</span>\n \n <span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">A</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n a<span class="token punctuation">.</span><span class="token function">setB</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">B</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n \n</code></pre>\n      </div>\n<ul>\n<li>위 처럼 해야 B의 파생형 버전을 제공할수 있는 이점이 있고 B를 고쳐야 할 경우 하위 버전 호환성을 유지하려면 어떤 로직을 계속 갖고 있어야 하는지 일목요연하게 서술한다.</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code> <span class="token comment">// 어떠한 데이터로 라인을 그린다.</span>\n <span class="token keyword">function</span> <span class="token function">baseFn</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">return</span> data<span class="token punctuation">;</span>\n <span class="token punctuation">}</span>\n\n svg<span class="token punctuation">.</span><span class="token function-variable function">line</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">return</span> <span class="token function">svg_line</span><span class="token punctuation">(</span>baseFn<span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token punctuation">}</span>\n\n <span class="token keyword">function</span> <span class="token function">svg_line</span><span class="token punctuation">(</span>projection<span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">function</span> <span class="token function">line</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">{</span>\n         \n         <span class="token keyword">function</span> <span class="token function">segment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n             <span class="token comment">// 이 함수를 호출해서 여러가지 일을 한다...</span>\n             <span class="token function">projection</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n         <span class="token punctuation">}</span>\n     <span class="token punctuation">}</span>\n     <span class="token keyword">return</span> line<span class="token punctuation">;</span>\n <span class="token punctuation">}</span>\n\n <span class="token keyword">var</span> lineGenerator <span class="token operator">=</span> svg<span class="token punctuation">.</span><span class="token function">line</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">lineGenerator</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 이렇게 하면 데이터 그대로 라인을 그린다.</span>\n\n <span class="token comment">// 허나 난 이 데이터를 기반으로 다른 모양으로 그리겠다.</span>\n <span class="token comment">// 데이터를 어떻게 조작할지만 생각한다. 즉, baseFn 만 바꿔주면된다.</span>\n\n <span class="token keyword">function</span> <span class="token function">additionFn</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">return</span> data<span class="token operator">*</span><span class="token number">0.3</span><span class="token punctuation">;</span>\n <span class="token punctuation">}</span>\n svg<span class="token punctuation">.</span>line<span class="token punctuation">.</span><span class="token function-variable function">addition</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n     <span class="token keyword">return</span> <span class="token function">svg_line</span><span class="token punctuation">(</span>additionFn<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 의존성 주입.</span>\n <span class="token punctuation">}</span>\n <span class="token keyword">var</span> lineGenerator <span class="token operator">=</span> svg<span class="token punctuation">.</span>line<span class="token punctuation">.</span><span class="token function">addition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n <span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">lineGenerator</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h2>DRY 원칙</h2>\n<ul>\n<li>반복하지 마라!!</li>\n<li>재사용할 수 있어야 한다. </li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code> <span class="token comment">// bad</span>\n <span class="token keyword">while</span><span class="token punctuation">(</span> <span class="token operator">++</span>i <span class="token operator">&lt;</span> n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n     points<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token operator">+</span>getX<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> data<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">,</span>\n                  <span class="token operator">+</span>getY<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> data<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n <span class="token punctuation">}</span>\n\n <span class="token comment">// good</span>\n <span class="token keyword">var</span> d<span class="token punctuation">;</span>\n <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token operator">++</span>i <span class="token operator">&lt;</span> n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n     d <span class="token operator">=</span> data<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n     points<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token operator">+</span>getX<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> d<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">,</span>\n                  <span class="token operator">+</span>getY<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> d<span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n <span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h2>의존성 주입</h2>\n<h3>의존성 주입이란?</h3>\n<ul>\n<li>의존성을 품은, 하드 코딩한 모듈은 단위테스트를 진행하기 어렵다.</li>\n<li>의존성 품은 모듈의 한 메서드에서 의존성 모듈의 함수들을 호출한다 했을때, 해당 의존성을 품은 모듈은 단위테스트 하기가 까다로워 지고, 폭넓은 경우를 파악하기 힘들다.</li>\n<li>반면 의존성을 주입하게 되면 fake(모의체)를 주입해서 좀 더 넓은 범위의 가능성에 대해서 테스트를 진행해볼수 있다.</li>\n</ul>\n<h3>의존성 주입하여 믿음직한 코드 만들기</h3>\n<ul>\n<li>의존성 주입 코드는 재사용을 적극적으로 유도한다.</li>\n<li>하드 코딩한 모듈은 재사용하기가 어렵다. </li>\n<li>의존성 주입 코드로 바꾼 다음에는 주입 당한 코드에서 사용하는 주입된 인스턴스 메서드만 있다면 어떤 인스턴스라도 사용할수 있다는 장점이 있다.</li>\n</ul>\n<h3>의존성 주입의 모든것</h3>\n<ul>\n<li>객체 또는 의존성 중 어느 하나라도 DB, 설정파일, HTTP, 기타 인프라등의 외부 자원에 의존하는가/</li>\n<li>객체 내부에서 발생할지 모를 에러를 테스트에서 고려해야 하나?</li>\n<li>특정한 방향으로 객체를 작동시켜야 할 테스트가 있는가?</li>\n<li>이 서드파티 제공 객체가 아니라 온전히 내가 소유한 객체인가?</li>\n</ul>\n<h2>정리</h2>\n<ul>\n<li>관심사를 분리하는 일에 집중하고 단일 책임 원칙이나 의존성 주입같은 소프트웨어 공학 원칙을 잘 써먹는게 중요하다.</li>\n</ul>',
frontmatter:{title:"Javascript-Basic1",date:"April 05, 2018"}}},pathContext:{slug:"/javascript-basic1/"}}}});
//# sourceMappingURL=path---javascript-basic-1-30e30672291a757092a8.js.map