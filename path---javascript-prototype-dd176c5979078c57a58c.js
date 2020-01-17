webpackJsonp([24443999554804],{502:function(s,n){s.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/javascript-prototype/index.md absPath of file >>> MarkdownRemark",html:'<h1>Prototype in JavaScript: it’s quirky, but here’s how it works</h1>\n<p>번역 : <a href="https://www.freecodecamp.org/news/prototype-in-js-busted-5547ec68872/">https://www.freecodecamp.org/news/prototype-in-js-busted-5547ec68872/</a></p>\n<p>다음 네 줄은 대부분의 JavaScript 개발자를 혼란스럽게합니다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Object&nbsp;instanceof&nbsp;Function//true</span></span></div></pre>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Object&nbsp;instanceof&nbsp;Object//true</span></span></div></pre>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Function&nbsp;instanceof&nbsp;Object//true</span></span></div></pre>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Function&nbsp;instanceof&nbsp;Function//true</span></span></div></pre>\n<p>자바 스크립트의 Prototype 은 가장 마음이 떨리는 개념 중 하나이지만이를 피할 수는 없습니다. 아무리 무시해도 JavaScript 가 실행되는 동안 prototype 퍼즐이 발생합니다.</p>\n<p>그럼 한번 직면해보자.</p>\n<p>기본 사항부터 JavaScript 에는 다음과 같은 데이터 유형이 있습니다.</p>\n<ol>\n<li>undefined</li>\n<li>null</li>\n<li>number</li>\n<li>string</li>\n<li>boolean</li>\n<li>object</li>\n</ol>\n<p>처음 5 가지는 기본 데이터 유형입니다. 이들은 boolean 과 같은 유형의 값을 저장하며 true 또는 false 가 될 수 있습니다.</p>\n<p>마지막 “객체”는 키 - 값 쌍의 집합으로 설명 할 수있는 참조 유형입니다 (그러나 훨씬 더 많습니다).</p>\n<p>자바 스크립트에서 새로운 객체들은 <code>toString ()</code> 및 <code>valueOf ()</code>와 같은 일반적인 메소드를 제공하는 <strong>Object constructor function</strong> (또는 객체 리터럴<code>{}</code>)을 사용하여 만들어집니다.</p>\n<p>JavaScript 의 함수는 <strong>“called” ** 을 할 수있는 특별한 객체입니다. 우리는 그것들을 만들고 **Function constructor function</strong> (또는 함수 리터럴)을 사용합니다. 이 ** 생성자 **가 함수뿐만 아니라 객체이기 때문에 닭이 먼저냐 달걀이 먼저냐 수수께끼가 같은 모든 사람들을 혼란스럽게하는 것과 같은 방식으로 항상 나를 혼란스럽게합니다.</p>\n<p>프로토 타입으로 시작하기 전에 JavaScript 에서 두 가지 프로토 타입이 있음을 분명히하고 싶습니다.</p>\n<ol>\n<li><strong>prototype :</strong> JavaScript 로 작성한 모든 기능의 속성으로 지정된 특수 객체입니다. 여기서는 분명히 설명 하겠지만, JavaScript 가 제공하는 내부 함수 (및<code>bind</code>에 의해 반환 된 함수)에는 필수 항목이 아닌 모든 함수에 대해 이미 존재합니다. 이<code>prototype</code>은 (<code>new</code> 키워드를 사용하여) 그 함수에서 새로 생성 된 객체의<code>[[Prototype]]</code>(아래 참조)이 가리키는 것과 동일한 객체입니다.</li>\n<li><strong>[[Prototype]] :</strong> 이것은 객체에서 읽혀지는 일부 속성을 사용할 수 없는 경우 실행중인 컨텍스트가 액세스하는 모든 객체의 숨겨진 속성입니다. 이 속성은 단순히 객체가 만들어진 함수의 <code>프로토 타입</code> 에 대한 참조입니다. 스크립트에는 <strong>getter-setter</strong> (다른 날 주제)라는 <strong>proto</strong>를 사용하여 액세스 할 수 있습니다.이 프로토 타입에 액세스하는 다른 새로운 방법이 있지만 간단히하기 위해 <code>[[Prototype]]</code> <code>__proto__</code>을 사용합니다.</li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>var&nbsp;obj&nbsp;=&nbsp;{}</span></span></div><div class="line"><span class="text plain null-grammar"><span>var&nbsp;obj1&nbsp;=&nbsp;new&nbsp;Object()</span></span></div></pre>\n<p>위의 두 문장은 새로운 객체를 만드는 데 사용될 때 equal 문이지만, 이 명령문 중 하나를 실행할 때 많은 일이 발생합니다.</p>\n<p>새로운 객체를 만들면 그것은 비어 있습니다. 사실 그것은<code>Object</code> 생성자의 인스턴스이기 때문에 비어 있지 않으며 새로 생성 된 객체의 <code>__proto__</code>가 가리키는 <code>Object</code>의<code>prototype</code> 참조를 가져옵니다.</p>\n<p><img src="https://cdn-media-1.freecodecamp.org/images/h04OjQTCA9CyQ5yXzbwg2-HYnz8RbCTUvtc6" alt="https://cdn-media-1.freecodecamp.org/images/h04OjQTCA9CyQ5yXzbwg2-HYnz8RbCTUvtc6"></p>\n<p><code>Object</code> 생성자 함수의 <code>prototype</code>을 살펴보면 <code>obj.</code> 의 <code>__proto__</code>와 똑같습니다. 실제로 그들은 같은 객체를 가리키는 두 포인터입니다.</p>\n<p><img src="https://cdn-media-1.freecodecamp.org/images/2hy0s7jdEw-W66w8dWxo-8Ck2nBIBMWixr9t"></p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>obj.__proto__&nbsp;===&nbsp;Object.prototype//true</span></span></div></pre>\n<p>함수의 모든 <code>프로토 타입 (prototype)</code> 은 함수 자체에 대한 포인터 인 <code>생성자 (constructor)</code> 라는 고유 한 속성을 가지고 있습니다. <code>Object</code> 함수 의 경우, <code>prototype</code> 은 <code>Object</code>를 가리키는 <code>constructor</code>을 가지고 있습니다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Object.prototype.constructor&nbsp;===&nbsp;Object//true</span></span></div></pre>\n<p><img src="https://cdn-media-1.freecodecamp.org/images/rnUjw1hZdqdTpcSW2y3ZX8ptZ3OUcCzuaKbO"></p>\n<p>위의 그림에서, 왼쪽은 <code>Object</code> 생성자의 확장 된 뷰입니다. 당신은 이 모든 다른 기능들이 무엇인지 궁금 할 것입니다. 함수는 <strong>object</strong> 이므로 다른 객체처럼 속성을 가질 수 있습니다.</p>\n<p>자세히 보면, <code>Object</code> <em>(왼쪽)</em> 자체는 <code>prototype</code> 을 가진 다른 생성자로부터<code>Object</code>가 만들어 졌음을 의미하는 <code>__proto__</code> 를 가지고 있습니다. <code>Object</code>는 함수 객체이기 때문에 , 그것은<code>Function</code> 생성자를 사용하여 만들어 졌음에 틀림 없습니다.</p>\n<p><img src="https://cdn-media-1.freecodecamp.org/images/we607uLIJLuCdG4P0metYMcjf9PpNHvh22tm"></p>\n<p><code>Object</code>의 <code>__proto__</code> 는 <code>Function</code> 의 <code>prototype</code> 과 같습니다. 두 함수의 동등성을 검사하면 같은 객체가됩니다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Object.__proto__&nbsp;===&nbsp;Function.prototype//true</span></span></div></pre>\n<p>자세히 살펴보면 <code>Function</code> 자체가 <code>__proto__</code> 을 가지고있는 것을 보게 될 것입니다. 즉, <code>Function</code> 생성자 함수는 <code>prototype</code> 을 가진 어떤 생성자 함수에서 만들어 졌음을 의미합니다. <code>Function</code> 자체는 <strong>function</strong> 이기 때문에 <code>Function</code> 생성자, 즉 그 자체로 만들어 져야합니다. 나는 그것이 이상하게 들린다는 것을 알고있다. 그러나 당신이 그것을 점검 할 때, 그것은 사실 인 것으로 판명됩니다.</p>\n<p>다시 정리하면, Function 생성자 함수에는 <code>__proto__</code> 프로퍼티가 있다. 이것이 의미하는건 <code>prototype</code> 속성을 지닌 어떤 생성자로 만들었다는걸 뜻하는 것이다.</p>\n<p>여기서 Function 은 사실 그 자체로 function(함수)이기 때문에 Function 생성자 함수는 Function 생성자를 이용해서 만들었을 것이다. 쉽게 이해하기 어렵지만 생각 해보면 우리가 함수를 만들면 그 함수는 Function 생성자를 이용해서 만들었을 것이다. 그렇다면 <code>Function.__proto__</code> 는 <code>Function.prototype</code> 과 같을 것이다. 실제로도 같다.</p>\n<p>아이러니 하지만 Function 생성자는 Function 생성자가 만들었다는 이야기가 된다.</p>\n<p>여기서 Function.prototype 은 빌트인 function 객체이다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="comment line double-slash js"><span class="punctuation definition comment js"><span>//</span></span><span>&nbsp;내부적으로&nbsp;Function&nbsp;생성자로&nbsp;person을&nbsp;만들게&nbsp;될&nbsp;것이다.</span></span></span></div><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>person</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span class="variable other object js"><span>person</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="variable other property js"><span>__proto__</span></span><span>&nbsp;</span><span class="keyword operator comparison js"><span>===</span></span><span>&nbsp;</span><span class="support class js"><span>Function</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property js"><span>prototype</span></span></span></div><div class="line"><span class="source js"><span class="variable other object js"><span>person</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="variable other object property js"><span>__proto__</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>name</span></span><span>&nbsp;</span><span class="keyword operator comparison js"><span>===</span></span><span>&nbsp;</span><span class="support class js"><span>Function</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property js"><span>prototype</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>name</span></span><span>&nbsp;</span><span class="comment line double-slash js"><span class="punctuation definition comment js"><span>//</span></span><span>&nbsp;(1)</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="support class js"><span>Function</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>name</span></span><span>&nbsp;</span><span class="keyword operator comparison js"><span>===</span></span><span>&nbsp;</span><span class="support class js"><span>Function</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property js"><span>prototype</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>name</span></span><span>&nbsp;</span><span class="comment line double-slash js"><span class="punctuation definition comment js"><span>//</span></span><span>&nbsp;(2)</span></span></span></div></pre>\n<p>위 처럼 우리는 함수 person 을 만들면 <code>__proto__</code> 로 Function.prototype 과 연결 되어서 Function.prototype 에 있는 속성과 메서드를 사용할 수 있게 된다.\n여기서 만약 Function 에 <code>__proto__</code> 가 없다면 (2) 번과 같이 Function 에서 바로 Function.prototype 을 사용 할 수 없을 것이다.</p>\n<p><img src="https://cdn-media-1.freecodecamp.org/images/gHONmm8YNyMAgQYD3MQ88WsYsathI0Nr-cp8"></p>\n<p>사실 <code>Function</code> 의 <code>__proto__</code> 와 <code>Function</code> 의 <code>prototype</code> 은 사실 동일한 객체를 가리키는 두 개의 포인터입니다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Function.prototype&nbsp;===&nbsp;Function.__proto__\\\\true</span></span></div></pre>\n<p>앞서 언급했듯이 <code>prototype</code> 의 <code>constructor</code> 은 <code>prototype</code> 을 소유 한 함수를 가리켜 야합니다.<code>Function</code> 의 <code>prototype</code> 의 <code>constructor</code> 은 <code>Function</code> 자체를 가리 킵니다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Function.prototype.constructor&nbsp;===&nbsp;Function\\\\true</span></span></div></pre>\n<p><img src="https://cdn-media-1.freecodecamp.org/images/ftvp4bDag11U4kaWjV3nG7UfkqQKjSQPA4i0"></p>\n<p>다시 말하지만, <strong>Function</strong> 의 <strong>prototype</strong> 은 <code>__proto__</code> 을 가지고 있습니다. 놀랍지도 않습니다 . <code>prototype</code> 은 객체입니다. 객체를 가질 수 있습니다. 그러나 객체의 <em>프로토 타입</em> 을 가리키고 있음을 주목하십시오.</p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Function.prototype.__proto__&nbsp;==&nbsp;Object.prototype\\\\true</span></span></div></pre>\n<p>그래서 우리는 여기에 마스터 맵을 가질 수 있습니다 :</p>\n<p><img src="https://cdn-media-1.freecodecamp.org/images/F86Ee6hanmaQuvSRBZ8S1rG6Cq1R-LVhA4Kl"></p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>instanceof&nbsp;Operator&nbsp;a&nbsp;instanceof&nbsp;b</span></span></div></pre>\n<p><code>instanceof</code> 연산자는 <code>a</code> 에서 <code>constructor</code> ( <em>of</em> chained <code>__proto__</code>) 중 하나가 가리키는 객체 <code>b</code> 를 찾습니다. 다시 읽어봅시다! 그러한 참조를 찾으면 <code>true</code>를 리턴하고 그렇지 않으면 <code>false</code>.</p>\n<p>이제 우리는 네 개의 <code>instanceof</code> 문장으로 돌아 간다. 나는 다음을 위해<code>instanceof</code> 가 <code>true</code> 를 리턴하도록 대응하는 문장을 작성했습니다 :</p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Object&nbsp;instanceof&nbsp;Function&nbsp;Object.__proto__.constructor&nbsp;===&nbsp;Function</span></span></div></pre>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Object&nbsp;instanceof&nbsp;Object&nbsp;Object.__proto__.__proto__.constructor&nbsp;===&nbsp;Object</span></span></div></pre>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Function&nbsp;instanceof&nbsp;Function&nbsp;Function.__proto__.constructor&nbsp;===&nbsp;Function</span></span></div></pre>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Function&nbsp;instanceof&nbsp;Object&nbsp;Function.__proto__.__proto__.constructor&nbsp;===&nbsp;Object</span></span></div></pre>\n<p>휴! 스파게티도 덜 엉키지 만, 나는 상황이 더 명확 해지기를 바랍니다.</p>\n<p>여기에 이전에 지적하지 않은 것이 있는데,<code>Object</code> 의 <code>prototype</code> 은 <code>__proto__</code> 을 가지고 있지 않습니다.</p>\n<p>사실 그것은 <code>__proto__</code>을 가지고 있지만 <code>null</code>과 같습니다. 체인은 어딘가에서 끝나야하고 여기서 끝납니다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Object.prototype.__proto__\\\\null</span></span></div></pre>\n<p>우리의 <code>Object</code> , <code>Function</code> , <code>Object.prototype</code> 과 <code>Function.prototype</code>도 <code>Object.assign</code> , <code>Object.prototype.hasOwnProperty</code> 와 <code>Function.prototype.call</code>. 이들은 프로토 타입이없고 <code>Function</code> 의 인스턴스이고<code>Function.prototype</code> 에 대한 포인터 인 <code>__proto__</code> 를 가진 내부 함수입니다.</p>\n<p><img src="https://cdn-media-1.freecodecamp.org/images/fs6Q6b4ewNiWTuSehUQAY1Cf2OJTV0WyzHAB"></p>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>Object.create.__proto__&nbsp;===&nbsp;Function.prototype\\\\true</span></span></div></pre>\n<p><code>Array</code> 와 <code>Date</code> 와 같은 다른 생성자 함수를 탐색하거나 객체를 가져 와서<code>prototype</code> 과 <code>__proto__</code>를 찾을 수 있습니다. 모든 것이 어떻게 연결되어 있는지 확인할 수있을 것입니다.</p>\n<h4>Extra queries:</h4>\n<p>잠시 동안 나를 괴롭혔던 질문이 하나 더 있습니다. 왜 ‘객체’의 프로토 타입이 <strong>객체</strong>이고 ‘함수’의 프로토 타입이 <strong>함수 객체</strong> 입니까?</p>\n<p><a href="https://stackoverflow.com/a/32929083/1934798"><strong>Here</strong></a> 같은 생각을하면 좋은 설명입니다.</p>\n<p>지금까지는 수수께끼일지도 모르는 또 다른 질문은 : 원시 데이터 타입이<code>toString ()</code>, <code>substr ()</code> 및 <code>toFixed ()</code> 와 같은 함수를 얻는 방법은 무엇입니까? 이것은 잘 설명되어 있습니다. (<a href="https://javascript.info/native-prototypes#primitives">https://javascript.info/native-prototypes#primitives</a>).</p>\n<p><code>prototype</code> 을 사용하여 자바 스크립트에서 커스텀 객체로 상속 작업을 할 수 있습니다. 그러나 그것은 다른 날을위한 주제입니다.</p>\n<p>읽어 주셔서 감사합니다!</p>',frontmatter:{title:"Prototype in JavaScript",date:"July 15, 2019"}}},pathContext:{slug:"/javascript-prototype/"}}}});
//# sourceMappingURL=path---javascript-prototype-dd176c5979078c57a58c.js.map