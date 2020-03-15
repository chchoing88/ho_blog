webpackJsonp([78697077285144],{511:function(s,n){s.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/maintainable-javascript/user-error-throwing.md absPath of file >>> MarkdownRemark",html:'<h2>에러의 본질</h2>\n<p>프로그래밍 언어는 코드가 정해진 기본 규칙에서 벗어나면 개발자에게 코드를 수정하라는 의미로 에러를 발생합니다.\n만약 에러가 발생하지 않고 개발자에게 알려주지도 않으면 디버깅은 거의 불가능해지며 에러 수정은 고사하고 문제 발생을 알아차리기까지 한참이 걸릴 수 있습니다.</p>\n<h3>에러 던지기</h3>\n<p>throw 연산자에 에러로 던질 객체를 넣으면 에러를 발생시킬 수 있습니다. 어느 타입의 객체든 에러로 던질 수 있지만, 보통 Error 객체를 가장 많이 사용한다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="keyword control js"><span>throw</span></span><span>&nbsp;</span><span class="meta class instance constructor js"><span class="keyword operator new js"><span>new</span></span><span>&nbsp;</span><span class="entity name type instance js"><span>Error</span></span></span><span class="meta brace round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>에러예요</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta brace round js"><span>)</span></span></span></div></pre>\n<p>기본 내장된 Error 생성자는 에러 메시지를 인자로 받습니다.\n브라우저마다 에러 표시 방법이 다르지만 모든 브라우저에서 확실하게 사용자 에러 메시지를 보여주는 방법은 Error 객체를 사용하는 것이다.</p>\n<h3>에러는 언제 던져야 할까</h3>\n<p>자바스크립트는 타입이나 인자 값 검사가 없어 많은 개발자가 모든 함수에서 타입 검사를 해야 한다고 잘못 알고 있습니다. 이렇게 코드를 작성하면 실용적이지도 않고 스크립트의 전체적인 성능에 악영향을 줄 수 있습니다.</p>\n<p>물론 정적 프로그래밍 언어를 따라해 모든 함수의 인자 값 검사를 하는 것이 좋다고 생각할 수 있지만, 너무 지나칠 수 있다. 실행 중 실패하거나 에러가 발생할 여지가 있는 곳을 찾는 것이 핵심이다. 즉, 에러가 이미 발생한 곳에서만 에러를 던집니다. </p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="comment line double-slash js"><span class="punctuation definition comment js"><span>//</span></span><span>&nbsp;나쁜&nbsp;예</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>addClass</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="variable parameter function js"><span>element</span></span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="variable parameter function js"><span>className</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="keyword control js"><span>if</span></span><span class="meta brace round js"><span>(</span></span><span class="keyword operator logical js"><span>!</span></span><span>element&nbsp;</span><span class="keyword operator logical js"><span>||</span></span><span>&nbsp;</span><span class="keyword operator typeof js"><span>typeof</span></span><span>&nbsp;</span><span class="variable other object js"><span>element</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>className</span></span><span>&nbsp;</span><span class="keyword operator comparison js"><span>!==</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>string</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta brace round js"><span>)</span></span><span>&nbsp;</span><span class="meta brace curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="keyword control js"><span>throw</span></span><span>&nbsp;</span><span class="meta class instance constructor js"><span class="keyword operator new js"><span>new</span></span><span>&nbsp;</span><span class="entity name type instance js"><span>Error</span></span></span><span class="meta brace round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>addClass():&nbsp;First&nbsp;argument&nbsp;must&nbsp;be&nbsp;a&nbsp;DOM&nbsp;element</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta brace round js"><span>)</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta brace curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="keyword control js"><span>if</span></span><span class="meta brace round js"><span>(</span></span><span class="keyword operator typeof js"><span>typeof</span></span><span>&nbsp;className&nbsp;</span><span class="keyword operator comparison js"><span>!==</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>string</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta brace round js"><span>)</span></span><span>&nbsp;</span><span class="meta brace curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="keyword control js"><span>throw</span></span><span>&nbsp;</span><span class="meta class instance constructor js"><span class="keyword operator new js"><span>new</span></span><span>&nbsp;</span><span class="entity name type instance js"><span>Error</span></span></span><span class="meta brace round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>addClass():&nbsp;Second&nbsp;argument&nbsp;must&nbsp;be&nbsp;a&nbsp;string</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta brace round js"><span>)</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta brace curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;</span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="variable other object js"><span>element</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>className</span></span><span>&nbsp;</span><span class="keyword operator assignment compound js"><span>+=</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>&nbsp;</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span>&nbsp;</span><span class="keyword operator js"><span>+</span></span><span>&nbsp;className</span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div></pre>\n<p>두 번째 인자는 null, 숫자, 불린이 와도 이를 문자열로 반환하여 에러가 발생되지는 않는다. 하여 첫 번째 인자인 DOM 요소에 대한 값만 검사하면 된다.</p>\n<pre class="editor editor-colors"><div class="line"><span class="source js"><span class="meta function js"><span class="storage type function js"><span>function</span></span><span>&nbsp;</span><span class="entity name function js"><span>addClass</span></span><span class="meta parameters js"><span class="punctuation definition parameters begin bracket round js"><span>(</span></span><span class="variable parameter function js"><span>element</span></span><span class="meta delimiter object comma js"><span>,</span></span><span>&nbsp;</span><span class="variable parameter function js"><span>className</span></span><span class="punctuation definition parameters end bracket round js"><span>)</span></span></span></span><span>&nbsp;</span><span class="punctuation definition function body begin bracket curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="keyword control js"><span>if</span></span><span class="meta brace round js"><span>(</span></span><span class="keyword operator logical js"><span>!</span></span><span>element&nbsp;</span><span class="keyword operator logical js"><span>||</span></span><span>&nbsp;</span><span class="keyword operator typeof js"><span>typeof</span></span><span>&nbsp;</span><span class="variable other object js"><span>element</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>className</span></span><span>&nbsp;</span><span class="keyword operator comparison js"><span>!==</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>string</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta brace round js"><span>)</span></span><span>&nbsp;</span><span class="meta brace curly js"><span>{</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="keyword control js"><span>throw</span></span><span>&nbsp;</span><span class="meta class instance constructor js"><span class="keyword operator new js"><span>new</span></span><span>&nbsp;</span><span class="entity name type instance js"><span>Error</span></span></span><span class="meta brace round js"><span>(</span></span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>addClass():&nbsp;First&nbsp;argument&nbsp;must&nbsp;be&nbsp;a&nbsp;DOM&nbsp;element</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span class="meta brace round js"><span>)</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="meta brace curly js"><span>}</span></span></span></div><div class="line"><span class="source js"><span>&nbsp;&nbsp;</span><span class="variable other object js"><span>element</span></span><span class="meta delimiter property period js"><span>.</span></span><span class="support variable property dom js"><span>className</span></span><span>&nbsp;</span><span class="keyword operator assignment compound js"><span>+=</span></span><span>&nbsp;</span><span class="string quoted single js"><span class="punctuation definition string begin js"><span>&#39;</span></span><span>&nbsp;</span><span class="punctuation definition string end js"><span>&#39;</span></span></span><span>&nbsp;</span><span class="keyword operator js"><span>+</span></span><span>&nbsp;className</span></span></div><div class="line"><span class="source js"><span class="punctuation definition function body end bracket curly js"><span>}</span></span></span></div></pre>\n<p>물론 외부에서 접근할 수 없는 비공개 함수에서만 가능한 일이지만 함수에 어떤 html 엔티티가 들어올지 알고 있을때는 사실상 에러 검사가 필요 없다.\n하지만 어디서 함수를 호출할지 미리 알 수 없으면 에러 검사를 해서 에러를 던지도록 코드를 작성하면 여러모로 이점이 많습니다.\naddClass() 함수와 같은 유틸리티 성격의 함수는 자바스크립트 라이브러리처럼 보편적인 스크립트 환경에서 동작해야 하고 많은 곳에서 호출하는 함수이므로 에러를 던지기 적합하다.</p>\n<p>외부에서 접근 가능한 공개 인터페이스를 작성할 때, 예측할 수 있는 모든 에러 발생 상황에서 에러를 던지도록 코드를 작성해야 한다.\n큰 규모의 라이브러리에서는 우리가 언제, 어디서 함수를 호출할지 모든 경우의 수를 예측하는 건 불가능하다. 그래도 사용자가 무엇이 잘못되었는지 원인을 찾으러 라이브러리 코드까지 디버깅 하는 일은 없어야 하기에 우리가 ‘삽질’을 하고 있으면 라이브러리는 우리가 잘못하고 있다고 알려주어야 합니다.\n에러의 호출 스택은 라이브러리의 인터페이스에서 끝나야지 더 깊게 들어가서는 안된다. </p>\n<p>라이브러리의 목표는 개발자를 조금 더 편하게 해주는 것이며 이 목표는 지저분한 세부 구현 사항을 추상화시켜 개발자에게 제공하면 달성할 수 있다.\n이때, 지저분한 세부 구현사항을 개발자로부터 안전하게 숨기려면 에러를 던지도록 코드를 작성하면 된다. </p>\n<p>에러를 던질 때 추천하는 좋은 방법이 몇 가지 있다.</p>\n<ul>\n<li>디버깅하기 어려운 에러를 수정하면 거기에 사용자 정의 에러를 추가하자.문제가 다시 발생하면 해결하는데 큰 도움이 된다.</li>\n<li>코드를 작성할 때, 발생하면 안된다고 생각하는 일이 발생하면 에러를 던진다. ( 예를 들어 두 수를 나누는 함수가 있는데 분모의 값이 0으로 입력된 경우에 에러를 던진다.)</li>\n<li>모르는 사람이 사용할 코드를 작성할 때는 함수를 잘못 사용할 수 있는 경우를 생각해보고 그 경우에 에러를 던지도록 코드를 작성하자. </li>\n</ul>\n<h3>try…catch…finally</h3>\n<p>finally 절은 다루기에 살짝 까다로울 때가 있다. 예를 들어 try 절에 return 문이 있으면 finally 절이 실행된 후에야 return 문이 실행된다. </p>\n<h3>throw를 쓸 것인가 try…catch를 쓸 것인가.</h3>\n<p>에러는 애플리케이션 스택의 가장 깊은 곳인 자바스크립트 라이브러리에서 발생시켜야 한다. 애플리케이션 로직을 다루는 코드에서는 라이브러리에서 던진 에러를 잡아서 잘 처리할 수 있어야 하므로 에러 처리 기능을 잘 갖춰야 한다.\n<br />\n에러 처리를 잘하려면 애플리케이션 로직을 작성할 때 왜 이함수를 호출하는지 알아야 합니다.\ncatch 절이 비어있는 try…catch는 코드 상에 절대 있으면 안 되고 어떠한 방식으로든 에러 처리를 해야 합니다.\n에러가 발생하면 어떻게 에러를 복구할지도 생각해 두어야 한다.</p>',frontmatter:{title:"(읽기 쉬운 자바스크립트) 사용자 에러 던지기",date:"May 02, 2019"}}},pathContext:{slug:"/maintainable-javascript/user-error-throwing/"}}}});
//# sourceMappingURL=path---maintainable-javascript-user-error-throwing-2f9594d962f6c72f1e44.js.map