webpackJsonp([0x6f54b477a77c],{487:function(s,n){s.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/think-highOrderFunction/index.md absPath of file >>> MarkdownRemark",html:'<h1>High Order Function에 대해서 생각을 적는다.</h1>\n<h2>서론</h2>\n<ul>\n<li>기본적인 high order function (고차함수) 특성을 이해한다.</li>\n<li>high order function 을 썼을때의 이점과 어느 상황에서 사용이 될 수 있을지 생각해 본다.</li>\n<li>Promise 와 react-thunk를 알아보면서 느꼈던 high order function(고차함수)에 대해서 생각해 본다. </li>\n</ul>\n<h2>high order function 정의</h2>\n<ul>\n<li>Taking Function as Arguments</li>\n<li>Returning Functions as Results</li>\n</ul>\n<h2>상황</h2>\n<h3>함수형 자바스크립트</h3>\n<ul>\n<li>미리 넣어두기 ( 느낌 )</li>\n</ul>\n<h3>동기식 로직에서 중간에 비동기 로직이 들어가야 할 경우.</h3>\n<ul>\n<li>내가 다음에 실행하는거 알고 있으니 나한테 인자로 함수를 넣어줘봐 내가 그 함수 인자로 그 다음에 실행해야하는거 넣어줄게 그러면 너는 그 인자를 비동기 후에 실행 시키면 되. ( 느낌 )</li>\n</ul>\n<h2>리엑트 미들웨어</h2>\n<ul>\n<li>어떤 특정한 기능을 하는 함수(A)를 다른 함수를 인자로 주입 한뒤 더 추가 기능을 수행할 수 있는 함수를 작성하고 주입된 함수(A)를 실행하는 코드 작성, 그 후에 그 특정한 기능을 하는 함수(A)를 대체 한다. 그러고 나면 처음에 주입한 함수(A)를 확장할 수 있다. </li>\n</ul>\n<h2>커링</h2>\n<ul>\n<li>어떤 연산을 수행할 때 필요한 값 중 일부를 저장하고 나중에 나머지 값을 전달 받는 기법, 이를 위해 다른 함수를 반환하는 함수를 사용하며, 이를 커링된 함수라 부른다.</li>\n</ul>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="storage type const js"><span>const</span></span><span>&nbsp;</span><span class="constant other js"><span>userLogs</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="meta function arrow js"><span class="meta parameters js"><span class="variable parameter function js"><span>userName</span></span></span><span>&nbsp;</span><span class="storage type function arrow js"><span>=&gt;</span></span></span><span>&nbsp;</span><span class="meta function arrow js"><span class="meta parameters js"><span class="variable parameter function js"><span>message</span></span></span><span>&nbsp;</span><span class="storage type function arrow js"><span>=&gt;</span></span></span><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="entity name type object console js"><span>console</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="support function console js"><span>log</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted template js"><span class="punctuation definition string begin js"><span>`</span></span><span class="source js embedded source"><span class="punctuation section embedded js"><span>${</span></span><span>userName</span><span class="punctuation section embedded js"><span>}</span></span></span><span>&nbsp;-&gt;&nbsp;</span><span class="source js embedded source"><span class="punctuation section embedded js"><span>${</span></span><span>message</span><span class="punctuation section embedded js"><span>}</span></span></span><span class="punctuation definition string end js"><span>`</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="storage type const js"><span>const</span></span><span>&nbsp;</span><span class="constant other js"><span>log</span></span><span>&nbsp;</span><span class="keyword operator assignment js"><span>=</span></span><span>&nbsp;</span><span class="meta function-call js"><span class="entity name function js"><span>userLogs</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>merlin</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span><span class="punctuation terminator statement js"><span>;</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="entity name function js"><span>log</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>hi&nbsp;merlin,&nbsp;i&nbsp;am&nbsp;ready&nbsp;message</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="entity name function js"><span>fetch</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>url</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="entity name function js"><span>then</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span></span></span></span></div><div class="line"><span class="source js"><span class="meta method-call js"><span class="meta arguments js"><span>&nbsp;&nbsp;</span><span class="meta function arrow js"><span class="meta parameters js"><span class="variable parameter function js"><span>data</span></span></span><span>&nbsp;</span><span class="storage type function arrow js"><span>=&gt;</span></span></span><span>&nbsp;</span><span class="meta function-call js"><span class="entity name function js"><span>log</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted template js"><span class="punctuation definition string begin js"><span>`</span></span><span>response&nbsp;</span><span class="source js embedded source"><span class="punctuation section embedded js"><span>${</span></span><span>data</span><span class="punctuation section embedded js"><span>}</span></span></span><span class="punctuation definition string end js"><span>`</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></span></span></div><div class="line"><span class="source js"><span class="meta method-call js"><span class="meta arguments js"><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div></pre>\n<h2>결론</h2>\n<ul>\n<li>다른 함수를 반환하는 고차 함수는 자바스크립트에서 비동기적인 실행 맥락을 처리할 때 유용하다.</li>\n<li>함수를 반환하는 고차 함수를 이용하면 필요할 때 재활용할 수 있는 함수를 만들 수 있다.</li>\n</ul>\n<h2>참조</h2>\n<ul>\n<li><a href="https://www.sitepoint.com/higher-order-functions-javascript/">https://www.sitepoint.com/higher-order-functions-javascript/</a></li>\n</ul>',frontmatter:{title:"thinking high order function",date:"November 05, 2018"}}},pathContext:{slug:"/think-highOrderFunction/"}}}});
//# sourceMappingURL=path---think-high-order-function-58f7199816abbe8ab707.js.map