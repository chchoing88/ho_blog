webpackJsonp([0x65c54a553d41],{460:function(s,n){s.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/call-stack/index.md absPath of file >>> MarkdownRemark",html:'<h1>자바스크립트 콜스택의 이해</h1>\n<p>번역 : <a href="https://github.com/chchoing88">hocheol</a></p>\n<p>원문 출처 : <a href="https://medium.freecodecamp.org/understanding-the-javascript-call-stack-861e41ae61d4">https://medium.freecodecamp.org/understanding-the-javascript-call-stack-861e41ae61d4</a></p>\n<blockquote>\n<p>일부 의역이 들어간 경우도 있으므로 해당 원문의 내용과 조금 다를 수 있습니다. 문제가 될 소지가 있다거나 혹은 수정이 필요한 사항이 있다면 있다면 댓글 달아 주세요.</p>\n</blockquote>\n<p>자바스크립트 엔진은 힙과 단일 호출 스택으로 구성된 단일 스레드 인터프리터 이다. 브라우저는 DOM, AJAX 그리고 Timers 과 같은 웹 API 를 제공하고 있다.</p>\n<p>이글은 콜 스택이 무엇이고, 왜 필요한지에 대한 설명에 초점을 맞출것이다.\n콜 스택을 이해하는 것은 자바스크립트 엔진이 함수 계층과 실행 순서를 이해하는데 도움이 될것이다.</p>\n<p>콜 스택은 주로 함수의 실행을 위해 사용된다. 하지만 콜 스택은 하나이고, 함수 실행은 위에서부터 아래로 한번에 하나씩 실행이 된다. 이것은 콜 스택이 동기식이라는것을 뜻한다.</p>\n<p>콜 스택을 이해하는 것은 비동기 프로그래밍을 하는데 있어서 아주 중요합니다.</p>\n<p>비동기 적인 자바스크립트는 콜백 함수, 이벤트 루프, 그리고 task 큐가 있습니다. 콜백 함수는 이벤트 루프에 의해 콜백 함수가 스택에 푸시 된 후 실행 중 콜 스택에 의해 작동됩니다.</p>\n<p>먼저 이 질문의 답을 생각해보자 - 콜 스택은 무엇인가?</p>\n<p>가장 기본적인 레벨에서, 콜 스택은 임시 저장과 함수의 호출을 관리하기 위한 Last In, First Out(LIFO) 의 원리 데이터 구조이다.</p>\n<p>이 정의를 다시한번 파해쳐보자.</p>\n<p><strong>LIFO</strong>: 우리가 콜 스택을 이야기할때 Last In, First Out 의 원리로 작동한다고 알고있다. 이것은 스택에 마지막으로 들어간 함수가 리턴될때 처음으로 스택에서 튀어 나옴을 의미한다.</p>\n<p>다음 LIFO 를 증명하는 코드 샘플을 보자.</p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>firstFunction</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="keyword control js"><span>throw</span></span><span>&nbsp;</span><span class="meta class instance constructor js"><span class="keyword operator new js"><span>new</span></span><span>&nbsp;</span><span class="entity name type instance js"><span>Error</span></span></span><span class="meta brace round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>Stack&nbsp;Trace&nbsp;Error</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta brace round js"><span>)</span></span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>secondFunction</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta function-call js"><span class="entity name function js"><span>firstFunction</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>thirdFunction</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta function-call js"><span class="entity name function js"><span>secondFunction</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="entity name function js"><span>thirdFunction</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div></pre>\n<p>해당 코드가 동작할때, 우리는 error 를 만날 수 있다. 여기서 함수들이 어떻게 위에서부터 쌓였는지 스택이 출력이 된다. 다음 다이어 그램을 보자.</p>\n<p><img src="https://cdn-images-1.medium.com/max/1600/1*LIuELJ2RTtwWExRWGdu_Hw.png"></p>\n<p>우리는 <code>firstFunction()</code>부터 시작되어져 있는 스택 정렬을 볼수 있다. ( 이것은 가장 마지막에 스택에 들어갔음을 의미하고, 이 함수에서 에러가 방출되었다는 것을 알 수 있다. ) 다음 <code>secondFunct()</code>, 그리고 그다음<code>thirdFunction()</code> 이다. ( 이 thirdFunction()은 코드가 처음실행 될때 가장 먼저 스택에 들어간것이다. )</p>\n<p><strong>임시 저장소</strong>: 함수가 실행이 될때(호출할때), 함수와 , 그 함수의 파라미터, 그리고 변수들을 스택 프레임을 형성하기 위해 콜스택 안으로 집어 넣는다.\n이 스택 프레임은 스택안의 메모리 장소이다. 이 메모리는 함수가 스택에서 리턴 되었을때 비워지게 된다.</p>\n<p><img src="https://cdn-images-1.medium.com/max/1600/1*PPkrowy4n_Pyehb_NdhLrg.png"></p>\n<p><strong>함수 실행 관리</strong>: 콜 스택은 각 스택 프레임의 위치 레코드를 유지 관리 합니다. 그것은 곧 다음에 실행되어질 함수를 안다는 것이다. ( 그리고 실행 후에 지워질 것이다. ) 이것이 JavaScript 에서 코드를 동기식으로 만드는 이유입니다.</p>\n<p>식료품점 앞에 서있다고 생각해보자. 오직 다음 사람이 참석한 후에야 당신이 참석할 수 있는 것이다. 이것이 동기식이다.</p>\n<p>이것은 “함수 호출 관리”가 의미하는 것입니다.</p>\n<h2>호출 스택은 함수 호출을 어떻게 처리합니까?</h2>\n<p>위 질문에 답을 아래 샘플 코드를 통해 답을 찾을수 있다. 아래 코드를 보자.</p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>firstFunction</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="entity name type object console js"><span>console</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="support function console js"><span>log</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>Hello&nbsp;from&nbsp;firstFunction</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>secondFunction</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta function-call js"><span class="entity name function js"><span>firstFunction</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="entity name type object console js"><span>console</span></span><span class="meta method-call js"><span class="meta delimiter method period js"><span>.</span></span><span class="support function console js"><span>log</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>The&nbsp;end&nbsp;from&nbsp;secondFunction</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="entity name function js"><span>secondFunction</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div></pre>\n<p><img src="https://cdn-images-1.medium.com/max/1600/1*9iSkoJoXM0Ok8iQ5mOHl5Q.png"></p>\n<p>위 코드가 동작하면서 어떤일이 일어났는가:</p>\n<ol>\n<li><code>secondFunction()</code>이 실행이되면, 텅빈 스택프레임이 생성된다. 그것은 프로그램의 시작점인 (익명의) 메인이다.</li>\n<li>그런 다음 <code>secondFunction()</code>이 <code>firstFunction()</code>을 호출하고 그것은 스택에 밀어넣어지게 된다.</li>\n<li><code>firstFunction()</code>는 리턴되고 “Hello from firstFunction”을 콘솔에 프린트 한다.</li>\n<li><code>firstFunction()</code>가 스택에서 튀어 나온다.</li>\n<li>이후 실행 순서가 <code>secondFunction()</code> 로 이동한다.</li>\n<li><code>secondFunction()</code>는 리턴되고 “The end from secondFunction”이 콘솔에 프린트 된다.</li>\n<li><code>secondFunction()</code>가 스택에서 튀어나오고 메모리는 깨끗해진다.</li>\n</ol>\n<h2>스택 오버플로우의 원인은 무엇인가?</h2>\n<p>스택 오버플로우는 빠져나오지 못하는 재귀함수가 실행될때 발생하게 된다.\n브라우저는 스택 에러를 던지기 전에 최대치의 스택을 가지고 있다.</p>\n<p>아래 코드 예를 보자.</p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>callMyself</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta function-call js"><span class="entity name function js"><span>callMyself</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span class="meta function-call js"><span class="entity name function js"><span>callMyself</span></span><span class="meta arguments js"><span class="punctuation definition arguments begin bracket round js"><span>(</span></span><span class="punctuation definition arguments end bracket round js"><span>)</span></span></span></span></span></div></pre>\n<p><code>callMyself()</code> 는 브라우저가 “Maximun call size exceeded” 라는 에러가 날때까지 수행하게 된다. 그리고 스택 오버플로우가 발생하게 된다.</p>\n<p><img src="https://cdn-images-1.medium.com/max/800/1*JFRlgLp2uvbdVrh7WdmMrQ.png"></p>\n<h2>요약</h2>\n<p>콜 스택의 주요 특성들은 다음과 같다.</p>\n<ol>\n<li>싱글 스레드라는 것은 한번에 한가지 일만 수행할 수가 있다는 말이다.</li>\n<li>코드 실행은 동기적이다.</li>\n<li>함수 실행은 스택 프레임을 생성하고 그것들은 임시 메모리를 차지한다.</li>\n<li>콜 스택은 LIFO -  Last In, First Out 데이터 구조를 지닌다.</li>\n</ol>',frontmatter:{title:"call stack",date:"March 27, 2019"}}},pathContext:{slug:"/call-stack/"}}}});
//# sourceMappingURL=path---call-stack-ae217c5d96088f3ccd78.js.map