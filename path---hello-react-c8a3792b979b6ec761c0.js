webpackJsonp([60702703624353],{516:function(n,s){n.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/hello-react/index.md absPath of file >>> MarkdownRemark",html:'<h2>intro React</h2>\n<p>리엑트를 처음 마주해보자.\n해당 정리 내용의 출처는\n<a href="https://www.youtube.com/watch?v=GEoNiUcVwjE&#x26;list=PL9FpF_z-xR_GMujql3S_XGV2SpdfDBkeC">https://www.youtube.com/watch?v=GEoNiUcVwjE&#x26;list=PL9FpF<em>z-xR</em>GMujql3S_XGV2SpdfDBkeC</a></p>\n<p>이곳을 참조 하였다.</p>\n<p>Babel : es6 작성된 코드를 이전 버젼인 es5로 변환하기 위한 도구\n여러가지 브라우저를 호환하기 위해 es5로 변환</p>\n<p>15버전 이상에서 </p>\n<p>react.min.js : 컴포넌트 담당</p>\n<p>react-dom.min.js : dom에 랜더링 담당</p>\n<p>컴포넌트는 자바스크립트 클래스 이다.\n리엑트 컴포넌트 클래스를 상속한다.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Coldelab</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span><span class="token punctuation">{</span>\n    <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">let</span> text <span class="token operator">=</span> <span class="token string">"Hi i am coldelab"</span><span class="token punctuation">;</span>\n        <span class="token keyword">let</span> style <span class="token operator">=</span> <span class="token punctuation">{</span>\n            baackgroundColor<span class="token punctuation">:</span><span class="token string">\'aqua\'</span>\n        <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span><span class="token punctuation">(</span>\n            <span class="token comment">// &lt;div>Codelab&lt;/div></span>\n            <span class="token operator">&lt;</span>div style<span class="token operator">=</span><span class="token punctuation">{</span>style<span class="token punctuation">}</span><span class="token operator">></span><span class="token punctuation">{</span>text<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n        <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 다른 컴포넌트에서 다시 사용할 수 있다.</span>\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span><span class="token punctuation">{</span>\n    <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token punctuation">(</span>\n            <span class="token operator">&lt;</span>Codelab<span class="token operator">/</span><span class="token operator">></span>\n        <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 페이지에 랜더링</span>\n<span class="token comment">// 실제 페이지에 jsx코드를 랜더링할때 사용합니다.</span>\nReactDom<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token operator">&lt;</span>App<span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">,</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"root"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h3>jsx</h3>\n<p>xml같은 문법을 네이티브 자바스크립트로 변환을 해줍니다. 괄호는 가독성을 위해 사용\n바벨이 jsx로더를 사용해서 jsx 형태코드를 변환해준다.</p>\n<div class="gatsby-highlight">\n      <pre class="language-jsx"><code><span class="token comment">// jsx</span>\n<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token punctuation">(</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>\n        Welcome to <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>b</span><span class="token punctuation">></span></span>React CodeLab<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>b</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// javascript</span>\n<span class="token keyword">var</span> a <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>\n    <span class="token string">"div"</span><span class="token punctuation">,</span>\n    <span class="token keyword">null</span><span class="token punctuation">,</span>\n    <span class="token string">"Welcome to"</span><span class="token punctuation">,</span>\n    React<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>\n        "b<span class="token punctuation">,</span>\n        <span class="token keyword">null</span><span class="token punctuation">,</span>\n        <span class="token string">"React.js CodeLab"</span>\n    <span class="token punctuation">)</span>\n<span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>모든 jsx 형태의 코드는 컨테이너 엘리먼트 안에 포함시켜 주어야 한다.\njsx안에서 javascript 를 표현할때는 {} 로 wrapping을 하면 된다.\nif Else 문은 jsx에서 사용 불가 이에 대한 대안은 tenary expression 을 사용한다.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>    condition<span class="token operator">?</span> <span class="token boolean">true</span> <span class="token punctuation">:</span> <span class="token boolean">false</span> <span class="token comment">// {1==1? \'true\':\'false\'}</span>\n</code></pre>\n      </div>\n<p>jsx안에 스타일을 선언할때 카멜케이스를 사용한다. ex) backgroundColor\njsx 안에서 class를 설정할때는 ‘class=’ 가 아닌 className을 사용한다.</p>\n<p>jsx 에서 주석을 작성할 때는 { /* … */ } 로 표현한다.</p>\n<h3>props</h3>\n<p>컴포넌트 내부의 immutable Data 를 처리할 때 사용한다.\njsx 내부에 {this.props.propsName} 라고 설정하고\n위에서 설정한 컴포넌트를 사용할때 propsName=“value” 라고 사용한다.\nthis.props.childrens은 기본적으로 가지고 있는 props로\n<Cpnt> 여기에 있는 값이 들어갑니다. <Cpnt></p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Coldelab</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span><span class="token punctuation">{</span>\n    <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n       <span class="token keyword">return</span><span class="token punctuation">(</span>\n           <span class="token operator">&lt;</span>div<span class="token operator">></span>\n                <span class="token operator">&lt;</span>h1<span class="token operator">></span>Hello <span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>name<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>h1<span class="token operator">></span>\n                <span class="token operator">&lt;</span>div<span class="token operator">></span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>children<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n           <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n        <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 다른 컴포넌트에서 다시 사용할 수 있다.</span>\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span><span class="token punctuation">{</span>\n    <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token punctuation">(</span>\n            <span class="token operator">&lt;</span>Codelab name<span class="token operator">=</span><span class="token string">"merlin"</span><span class="token operator">></span>이 사이에 있는거<span class="token operator">&lt;</span><span class="token operator">/</span>Codelab<span class="token operator">></span> <span class="token comment">// "이 사이에 있는거" 가 위의 children에 나타납니다.</span>\n        <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>props에 기본 값을 설정 할 수 있다.\nprops에 특정 타입이 아니거나 입력을 안했을때 개발자 콘솔에 뜨게 할 수 있다.\n참고 : js 넣을때 minifyed 버젼은 에러가 뜨지 않는다.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span><span class="token punctuation">{</span>\n    <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword">return</span> <span class="token punctuation">(</span>\n            <span class="token operator">&lt;</span>Codelab name<span class="token operator">=</span><span class="token string">"merlin"</span><span class="token operator">></span>이 사이에 있는거<span class="token operator">&lt;</span><span class="token operator">/</span>Codelab<span class="token operator">></span> <span class="token comment">// "이 사이에 있는거" 가 위의 children에 나타납니다.</span>\n        <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\nApp<span class="token punctuation">.</span>defaultProps <span class="token operator">=</span> <span class="token punctuation">{</span>\n    value<span class="token punctuation">:</span><span class="token number">0</span>\n<span class="token punctuation">}</span>\n\nApp<span class="token punctuation">.</span>propTypes <span class="token operator">=</span> <span class="token punctuation">{</span>\n    value<span class="token punctuation">:</span>React<span class="token punctuation">.</span>PropTypes<span class="token punctuation">.</span>string<span class="token punctuation">,</span>\n    secondValue<span class="token punctuation">:</span>React<span class="token punctuation">.</span>PropTypes<span class="token punctuation">.</span>number<span class="token punctuation">,</span>\n    thirdValue<span class="token punctuation">:</span>React<span class="token punctuation">.</span>PropTypes<span class="token punctuation">.</span>any<span class="token punctuation">.</span>isRequired <span class="token comment">// 어떤 타입이든 필수로 입력이 되도록</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h3>state</h3>\n<p>컴포넌트에서 유동적인 데이터를 보여줄 때 사용합니다.\n초기값 설정이 필수다.\n초기값은 constructor에서 this.state={} 로 설정\n값을 수정할때는 this.setState({…}), 렌더링 된 다음엔 this.state= 절대 사용하지 말것.</p>\n<p>렌더링이 되기 전에는 setState 메소드를 사용하지 못한다.즉, construct에서 사용 못함.</p>\n<p>렌더링이 된 후에는 this.state= 로 수정하면 안된다.\nsetState 메소드를 사용 state를 바로 수정하는게 아니라 리엑트 개발자가 지정한 안정된 프로세스를 거쳐 값이 변경된다.\n값이 변경된 다음에는 자동으로 리 랜더링 합니다.</p>\n<p>스테이트를 바로 수정하는게 아니라 리엑트 개발자가 지정한 안정된 프로세스로 통하여 값이 변경된다.\n값이 변경된 다음에는 랜더링이 다시 진행된다.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Counter</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span><span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">{</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token punctuation">{</span>\n      value<span class="token punctuation">:</span><span class="token number">0</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n    \n    <span class="token keyword">this</span><span class="token punctuation">.</span>handleClick <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>handleClick<span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">handleClick</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      value<span class="token punctuation">:</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>value <span class="token operator">+</span> <span class="token number">1</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  \n  \n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div<span class="token operator">></span>\n        <span class="token operator">&lt;</span>h2<span class="token operator">></span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>value<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>h2<span class="token operator">></span>\n        <span class="token operator">&lt;</span>button onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>handleClick<span class="token punctuation">}</span><span class="token operator">></span>Press me<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">></span>\n      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>Counter <span class="token operator">/</span><span class="token operator">></span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nReactDOM<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>\n  <span class="token operator">&lt;</span>App<span class="token operator">></span><span class="token operator">&lt;</span><span class="token operator">/</span>App<span class="token operator">></span><span class="token punctuation">,</span>\n  document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"root"</span><span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h3>컴포넌트 맵핑</h3>\n<p>데이터 배열을 리엑트에서 렌더링 할때 javascript 내장 함수인 map을 사용한다.</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">ContactInfo</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span><span class="token punctuation">{</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div<span class="token operator">></span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>contact<span class="token punctuation">.</span>name<span class="token punctuation">}</span> <span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>contact<span class="token punctuation">.</span>phone<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Contact</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span><span class="token punctuation">{</span>\n\n  <span class="token function">constructor</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">{</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token punctuation">{</span>\n      contactData<span class="token punctuation">:</span><span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>name<span class="token punctuation">:</span><span class="token string">\'Abet\'</span><span class="token punctuation">,</span>phone<span class="token punctuation">:</span><span class="token string">"010-0000-0001"</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>name<span class="token punctuation">:</span><span class="token string">\'Bbet\'</span><span class="token punctuation">,</span>phone<span class="token punctuation">:</span><span class="token string">"010-0000-0002"</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>name<span class="token punctuation">:</span><span class="token string">\'Cbet\'</span><span class="token punctuation">,</span>phone<span class="token punctuation">:</span><span class="token string">"010-0000-0003"</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>name<span class="token punctuation">:</span><span class="token string">\'Dbet\'</span><span class="token punctuation">,</span>phone<span class="token punctuation">:</span><span class="token string">"010-0000-0004"</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n    \n    <span class="token keyword">const</span> <span class="token function-variable function">mapToComponent</span> <span class="token operator">=</span> <span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n       <span class="token keyword">return</span> data<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>contact<span class="token punctuation">,</span>i<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n         <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token operator">&lt;</span>ContactInfo contact<span class="token operator">=</span><span class="token punctuation">{</span>contact<span class="token punctuation">}</span> key<span class="token operator">=</span><span class="token punctuation">{</span>i<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">)</span> <span class="token comment">// 각 데이터에 identity를 주기 위해서.</span>\n       <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n    \n    <span class="token keyword">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div<span class="token operator">></span>\n         <span class="token punctuation">{</span><span class="token function">mapToComponent</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>contactData<span class="token punctuation">)</span><span class="token punctuation">}</span> \n      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">(</span>\n        <span class="token operator">&lt;</span>Contact <span class="token operator">/</span><span class="token operator">></span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nReactDOM<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>\n  <span class="token operator">&lt;</span>App<span class="token operator">></span><span class="token operator">&lt;</span><span class="token operator">/</span>App<span class="token operator">></span><span class="token punctuation">,</span>\n  document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"root"</span><span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h3>번외_1 eslint를 함께 사용해보자.</h3>\n<ul>\n<li>airbnb의 eslint를 사용해 보자.</li>\n</ul>\n<p>IDE: vsCode ( eslint plugin )</p>\n<ol>\n<li>eslint , babel-eslint 를 설치 </li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>$ npm i -g eslint // eslint 명령어를 사용하기 위해..\n$ npm i -D eslint babel-eslint babel-preset-airbnb</code></pre>\n      </div>\n<p>babel-preset-airbnb : airbnb 의 javascript 스타일로 transform 해준다.\nbabel-eslint : eslint 의 parser를 babel-eslint로 사용. 이것은 Babel code를 lint에서 유효하게 만들어 준다.</p>\n<ol start="2">\n<li>\n<p>eslint 의 configuration file 을 만들기 위해 아래 명령어를 활용한다.</p>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>$ eslint --init </code></pre>\n      </div>\n</li>\n<li>\n<p>선택지가 몇개 나오는데 그중 “Use a popular style guide” 에서 “airbnb” 선택</p>\n</li>\n<li>\n<p>react 사용하냐 응답에 yes~</p>\n</li>\n<li>\n<p>javascript 선택</p>\n</li>\n<li>\n<p>.eslintrc.js 파일이 생성됨.</p>\n</li>\n<li>\n<p>.eslintrc.js 파일 수정</p>\n</li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"parser"</span><span class="token punctuation">:</span> <span class="token string">"babel-eslint"</span><span class="token punctuation">,</span>\n    <span class="token string">"env"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"browser"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n        <span class="token string">"node"</span><span class="token punctuation">:</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"extends"</span><span class="token punctuation">:</span> <span class="token string">"airbnb"</span><span class="token punctuation">,</span>\n    <span class="token string">"rules"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"strict"</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n        <span class="token string">"react/jsx-filename-extension"</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n        <span class="token string">"react/no-array-index-key"</span><span class="token punctuation">:</span> <span class="token number">0</span>\n\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p><strong>참고로 airbnb eslint는 state 가 없으면 pure function 으로 작성하게 되어있다.</strong></p>\n<p>관련 자료 : <a href="https://groundberry.github.io/development/2017/06/11/create-react-app-linting-all-the-things.html">https://groundberry.github.io/development/2017/06/11/create-react-app-linting-all-the-things.html</a></p>\n<p>우선 여기까지만 하면 기본적인 설정은 끝.. 나머지는 차차 하면서~</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token comment">// package.json </span>\n<span class="token punctuation">{</span>\n  <span class="token string">"name"</span><span class="token punctuation">:</span> <span class="token string">"reactTest"</span><span class="token punctuation">,</span>\n  <span class="token string">"version"</span><span class="token punctuation">:</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span>\n  <span class="token string">"description"</span><span class="token punctuation">:</span> <span class="token string">""</span><span class="token punctuation">,</span>\n  <span class="token string">"main"</span><span class="token punctuation">:</span> <span class="token string">"webpack.config.js"</span><span class="token punctuation">,</span>\n  <span class="token string">"dependencies"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"react"</span><span class="token punctuation">:</span> <span class="token string">"^16.2.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"react-dom"</span><span class="token punctuation">:</span> <span class="token string">"^16.2.0"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"devDependencies"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"babel-core"</span><span class="token punctuation">:</span> <span class="token string">"^6.26.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"babel-eslint"</span><span class="token punctuation">:</span> <span class="token string">"^8.2.1"</span><span class="token punctuation">,</span>\n    <span class="token string">"babel-preset-airbnb"</span><span class="token punctuation">:</span> <span class="token string">"^2.4.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"babel-preset-es2015"</span><span class="token punctuation">:</span> <span class="token string">"^6.24.1"</span><span class="token punctuation">,</span>\n    <span class="token string">"babel-preset-react"</span><span class="token punctuation">:</span> <span class="token string">"^6.24.1"</span><span class="token punctuation">,</span>\n    <span class="token string">"bable-loader"</span><span class="token punctuation">:</span> <span class="token string">"0.0.1-security"</span><span class="token punctuation">,</span>\n    <span class="token string">"eslint"</span><span class="token punctuation">:</span> <span class="token string">"^4.18.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"eslint-config-airbnb"</span><span class="token punctuation">:</span> <span class="token string">"^16.1.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"eslint-plugin-import"</span><span class="token punctuation">:</span> <span class="token string">"^2.8.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"eslint-plugin-jsx-a11y"</span><span class="token punctuation">:</span> <span class="token string">"^6.0.3"</span><span class="token punctuation">,</span>\n    <span class="token string">"eslint-plugin-react"</span><span class="token punctuation">:</span> <span class="token string">"^7.6.1"</span><span class="token punctuation">,</span>\n    <span class="token string">"react-hot-loader"</span><span class="token punctuation">:</span> <span class="token string">"^3.1.3"</span><span class="token punctuation">,</span>\n    <span class="token string">"webpack"</span><span class="token punctuation">:</span> <span class="token string">"^3.11.0"</span><span class="token punctuation">,</span>\n    <span class="token string">"webpack-dev-server"</span><span class="token punctuation">:</span> <span class="token string">"^2.11.1"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"scripts"</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"test"</span><span class="token punctuation">:</span> <span class="token string">"echo \\"Error: no test specified\\" &amp;&amp; exit 1"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token string">"author"</span><span class="token punctuation">:</span> <span class="token string">""</span><span class="token punctuation">,</span>\n  <span class="token string">"license"</span><span class="token punctuation">:</span> <span class="token string">"ISC"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h3>번외_2 react 와 flow 사용하기.</h3>\n<h3>앞으로 공부할 것</h3>\n<ul>\n<li>React 더 심화</li>\n<li>Redux </li>\n<li>Rxjs , redux-observable</li>\n<li>flow</li>\n<li>esLint &#x26; airbnb</li>\n</ul>',
frontmatter:{title:"Hello React",date:"January 31, 2018"}}},pathContext:{slug:"/hello-react/"}}}});
//# sourceMappingURL=path---hello-react-c8a3792b979b6ec761c0.js.map