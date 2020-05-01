webpackJsonp([0xda7e65771a1e],{539:function(s,n){s.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/maintainable-javascript/event-handling.md absPath of file >>> MarkdownRemark",html:'<h2>고전적인 방법</h2>\n<p>나쁜 예</p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>handleClick</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="storage type var js"><span>var</span></span><span>&nbsp;popup&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="support variable dom js"><span>document</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="support function dom js"><span>getElementById</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>popup</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>style</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>left</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="support variable dom js"><span>event</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="variable other property js"><span>clientX</span></span><span>&nbsp;</span><span class="keyword operator js"><span>+</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>px</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>style</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>top</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="support variable dom js"><span>event</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="variable other property js"><span>clientY</span></span><span>&nbsp;</span><span class="keyword operator js"><span>+</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>px</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>className</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>reveal</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="entity name function js"><span>addListener</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span>element</span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>click</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;handleClick</span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div></pre>\n<p>위 예제는 이벤트 객체에서 clientX, clientY 프로퍼티만 사용한다. 이 코드만 으로는 간단하고 문제 없어 보이지만, 실제 활용하기에는 제한 사항이 많아서 사용하기 어려운 나쁜 패턴이다.</p>\n<h3>규칙 1. 애플리케이션 로직을 분리한다.</h3>\n<p>위 예제는 이벤트 핸들러가 애플리케이션 로직을 포함하는 문제가 있다.\n애플리케이션 로직은 사용자의 액션보다는 애플맄메이션 자체에 대한 기능을 다루어야 합니다. 그런데 위 코드의 애플리케이션 로직은 팝업창을 특정 위치에 보여주고 있다. 이 코드가 다른 곳에서도 필요할 수도 있다.\n나중에 다른 사용자가 액션에서 이 로직이 필요하면 재사용할 수 있어야 하므로 이벤트 핸들러에서 애플리케이션 로직은 무조건 분리해야 한다.</p>\n<p>예를 들면 나중에 클릭할 때뿐만 아니라 특정 요소 위에서 커서가 움직이거나 키보드의 특정 키를 눌렀을 때도 팝업창을 나타나게 해야하는데 이때 실수로 다른 이벤트에 마우스 클릭 이벤트에 맞춰 개발된 핸들러를 등록 하는 일이 생길 수도 있다.</p>\n<p>또 이벤트 핸들러에 애플리케이션 로직이 있으면 테스트 하기 어려워 진다. </p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="comment line double-slash js"><span class="punctuation definition comment js"><span>//</span></span><span>&nbsp;더&nbsp;나은&nbsp;방법</span></span></span></div><div class="line"><span class="source js"><span class="storage type var js"><span>var</span></span><span>&nbsp;Myapp&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="meta brace curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta function json js"><span class="entity name function js"><span>handleClick</span></span><span class="keyword operator assignment js"><span>:</span></span><span>&nbsp;</span><span class="storage type function js"><span>function</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="variable language js"><span>this</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="entity name function js"><span>showPopup</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta function json js"><span class="entity name function js"><span>showPopup</span></span><span class="keyword operator assignment js"><span>:</span></span><span>&nbsp;</span><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="storage type var js"><span>var</span></span><span>&nbsp;popup&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="support variable dom js"><span>document</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="support function dom js"><span>getElementById</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>popup</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>style</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>left</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="support variable dom js"><span>event</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="variable other property js"><span>clientX</span></span><span>&nbsp;</span><span class="keyword operator js"><span>+</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>px</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>style</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>top</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="support variable dom js"><span>event</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="variable other property js"><span>clientY</span></span><span>&nbsp;</span><span class="keyword operator js"><span>+</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>px</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>className</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>reveal</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span class="meta brace curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="entity name function js"><span>addListener</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span>element</span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>click</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="meta function js"><span class="storage type function js"><span>function</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="meta arguments js"><span>&nbsp;&nbsp;</span><span class="variable other object js"><span>Myapp</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="entity name function js"><span>handleClick</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="meta arguments js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div></pre>\n<h3>규칙 2. 이벤트 객체를 바로 전달하지 않는다.</h3>\n<p>이벤트 객체에는 수많은 이벤트 정보가 있지만 이 코드에서는 그중 단 두개만 사용합니다. 애플리케이션 로직은 다음과 같은 이유로 event 객체에 의존해서는 안됩니다.</p>\n<ul>\n<li>메서드의 인터페이스만 봐서는 어떤 데이터가 필요한지 알기 어렵다. 좋은 API는 자신이 어떤 데이터가 필요한지 명확하게 나타낼 수 있어야 합니다. event 객체를 인자로 넘기는 방법으로는 이 메서드에서 필요한 데이터가 무엇인지 알 수 없습니다.</li>\n<li>같은 맥락으로, 메서드를 테스트할 때 event 객체를 새로 만들어야 합니다. 테스트를 정확하게 하려면 메서드에서 필요한 데이터가 무엇인지 확실하게 알아야 합니다.</li>\n</ul>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="storage type var js"><span>var</span></span><span>&nbsp;Myapp&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="meta brace curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta function json js"><span class="entity name function js"><span>handleClick</span></span><span class="keyword operator assignment js"><span>:</span></span><span>&nbsp;</span><span class="storage type function js"><span>function</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="support variable dom js"><span>event</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="support function dom js"><span>preventDefault</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="support variable dom js"><span>event</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="support function dom js"><span>stopPropagation</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="variable language js"><span>this</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="entity name function js"><span>showPopup</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="variable other property js"><span>clientX</span></span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="support variable dom js"><span>event</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="variable other property js"><span>clientY</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="comment line double-slash js"><span class="punctuation definition comment js"><span>//</span></span><span>&nbsp;어플리케이션&nbsp;로직</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta function json js"><span class="entity name function js"><span>showPopup</span></span><span class="keyword operator assignment js"><span>:</span></span><span>&nbsp;</span><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="variable parameter function js"><span>x</span></span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="variable parameter function js"><span>y</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="storage type var js"><span>var</span></span><span>&nbsp;popup&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="support variable dom js"><span>document</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="support function dom js"><span>getElementById</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>popup</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>style</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>left</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;x</span><span class="keyword operator js"><span>+</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>px</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>style</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>top</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;y&nbsp;</span><span class="keyword operator js"><span>+</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>px</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="variable other object js"><span>popup</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>className</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>reveal</span><span class="punctuation definition string end js"><span>&#39;</span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span class="meta brace curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="entity name function js"><span>addListener</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span>element</span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>click</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="meta function js"><span class="storage type function js"><span>function</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="meta arguments js"><span>&nbsp;&nbsp;</span><span class="variable other object js"><span>Myapp</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="entity name function js"><span>handleClick</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="support variable dom js"><span>event</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="meta arguments js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div></pre>',frontmatter:{title:"(읽기 쉬운 자바스크립트) 이벤트 처리",date:"May 02, 2019"}}},pathContext:{slug:"/maintainable-javascript/event-handling/"}}}});
//# sourceMappingURL=path---maintainable-javascript-event-handling-08483da9a7c1874195de.js.map