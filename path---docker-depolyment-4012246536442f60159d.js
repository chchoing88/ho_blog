webpackJsonp([0x7fbbdaeb8b3a],{471:function(s,n){s.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/docker-depolyment/index.md absPath of file >>> MarkdownRemark",html:'<h1>Docker Depolyment</h1>\n<hr>\n<h2>blue-green 배포 개념</h2>\n<p>로드발란서를 앞단에 하나를 두고 v1 버젼인 블루(가칭) 라는 앱을 띄운다. 그러다가 나는 v2 버젼인 그린(가칭)을 무중단 방식으로 업데이트를 진행하고 싶다. <br>\n그럴때 그린을 로드발란서에 등록을 시킨다. <br>\n그러면 블루와 그린을 로드발란싱을 할텐데 그린이 완전히 정상작동을 하였을때 v1 버젼인 블루를 죽이는 방식이다.</p>\n<h2>why needs?</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-8e53b.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.241032998565274%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAACXBIWXMAABYlAAAWJQFJUiTwAAAB6UlEQVQoz42SW2sTURSF58m/4R8w+B/EZ0H66IuoVSj0oYIPiiAVGy/4Jm1R8EbrJaQKIiKF0qJYBK1SKzGmUKPNNDOazHSSmWQmc/ucc5pLLwbcsNj7zKy9zuy1R6nVanRgWVa3LpVKlMtlmVVVRdd1mQU0TdvD70DxPA8B13UlOmfbtnEcR+Z6u240ttBsNnb0bO9TkBHTjXhbvStuPvzAsfMvGErPUtls/pOjdIo/6gae22pr9kTFrbqm03Idjg7fZ9+BEfYfGmW1qNF0bKpVA8Mw8H2/J7i8MMfriQu8y9wm9lzCKKb4Y41fqs6l8XnSd+YlefjqLAcHJjk8OIWqW/KZ7wcEQdD9CMWKQ74tTsLqA8pvJ1j8vML3XI5UKsXYWJrl3Dr5NU2SjVqTjUod3bAJw2jPuEJUKRPwZfocXD7CzyunWPndwLZMstkZPi0t7WhY+PqMqTc3mHk/ju1a7PZfCsrK9TDXi1A327615DbFhsVIwkcRd+eucfbeAKOZ02jVEtZmDdM0qVQq8i+QIwdRhJ9cEgg/kuwn/kXinIwkvAyTW4MwlOSXH6e59epiInwd0zYkzw9C/OS94AdR3Nvy/4XwTWwz6MtQTjzO0w/HH+UZyhYYeV7gTCbP4NMCJ59soV/PX1aFHfZlVEZhAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="구성"\n        title=""\n        src="/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-fb8a0.png"\n        srcset="/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-1a291.png 148w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-2bc4a.png 295w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-fb8a0.png 590w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-526de.png 885w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-fa2eb.png 1180w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-8e53b.png 1394w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<hr>\n<h2>BackEnd Environment</h2>\n<ul>\n<li>노트북 : 맥북</li>\n<li>도커 호스트 : virtual box ubuntu or mac</li>\n<li>도커 컨테이너 : node express server , nginx-proxy , mongodb</li>\n</ul>\n<hr>\n<h2>폴더 구조</h2>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>├──&nbsp;dockerfile</span></span></div><div class="line"><span class="text plain null-grammar"><span>│&nbsp;&nbsp;&nbsp;├──&nbsp;Dockerfile_express&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;express&nbsp;용&nbsp;서버&nbsp;이미지&nbsp;소스파일</span></span></div><div class="line"><span class="text plain null-grammar"><span>├──&nbsp;template&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;템플릿&nbsp;소스</span></span></div><div class="line"><span class="text plain null-grammar"><span>├──&nbsp;server&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;서버소스</span></span></div><div class="line"><span class="text plain null-grammar"><span>│&nbsp;&nbsp;&nbsp;├──&nbsp;server.js</span></span></div><div class="line"><span class="text plain null-grammar"><span>├──&nbsp;.dockerignore</span></span></div><div class="line"><span class="text plain null-grammar"><span>├──&nbsp;check.sh&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;배포용&nbsp;sh</span></span></div><div class="line"><span class="text plain null-grammar"><span>├──&nbsp;docker-compose.yml&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;docker&nbsp;컨테이너들의&nbsp;환경설정을&nbsp;모아둔곳&nbsp;한번에&nbsp;서버들을&nbsp;손쉽게&nbsp;실행시킬&nbsp;수&nbsp;있다.</span></span></div><div class="line"><span class="text plain null-grammar"><span>├──&nbsp;package.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;##&nbsp;app&nbsp;server&nbsp;컨테이너&nbsp;안에&nbsp;들어가&nbsp;관련&nbsp;패키지&nbsp;설치</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;</span></span></div></pre>\n<hr>\n<h2>Summary</h2>\n<ol>\n<li>맥북 - virtual box 공유 폴더 구성</li>\n<li>폴더 구성 </li>\n<li>ubuntu 에서 nginx-proxy 이미지 다운</li>\n<li>ubuntu 에서 node 이미지를 기반으로 express Dockerfile_express 작성 및 빌드</li>\n<li>docker-compose.yml 작성</li>\n<li>/etc/hosts 파일 수정</li>\n<li>check.sh 현재 돌아가는 도커 확인하고 새로운 도커 띄우고 현재 돌아가는 도커 죽이는 쉘 스크립트 작성</li>\n<li>테스트</li>\n</ol>\n<p><strong>만약 mac 에서 테스트를 한다면 2번부터 보시면 됩니다.</strong></p>\n<hr>\n<h2>procedure</h2>\n<ol>\n<li>버츄어 박스에 공유 폴더 설정\n참고 : <a href="http://theniceguy.tistory.com/13">http://theniceguy.tistory.com/13</a></li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>##&nbsp;우분투에&nbsp;공유폴더&nbsp;마운트&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>$&nbsp;sudo&nbsp;mount&nbsp;--types&nbsp;vboxsf&nbsp;blog_project&nbsp;blog_project</span></span></div></pre>\n<ul>\n<li>로컬 blog<em>project 폴더를 버츄어박스의 blog\\</em>proect 폴더랑 연결</li>\n<li>버츄어 박스 내의 blog_proect 폴더안에는 도커에서 필요한 소스파일 및 설정파일들이 담겨져 있음.</li>\n</ul>\n<ol start="2">\n<li>로드밸런싱을 위한 nginx-proxy 이미지 다운 받기 </li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>##&nbsp;nginx-proxy&nbsp;이미지&nbsp;다운&nbsp;받기&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>$&nbsp;docker&nbsp;pull&nbsp;jwilder/nginx-proxy&nbsp;</span></span></div></pre>\n<ul>\n<li>\n<p>사실 여기서 받지 않아도  docker-compose.yml 파일에 설정이 되어있어서 docker-compose up 하면 자동으로 pull을 받게 된다.</p>\n</li>\n<li>\n<p>해당 이미지는 도커 젠을 기반으로 만들어진 nginx-proxy로 로드발란싱의 기능이 있는 nginx applicaion에 도커 젠 기능을 추가 해서 넣은 이미지</p>\n</li>\n<li>\n<p>해당 이미지를 사용하게 되면 도커 젠이 도커 데몬을 바라보고 있다가 컨테이너의 런 , 스탑 등의 이벤트를 감지, 해당 컨테이너 정보를 수집 해서 추가 작업을 할 수 있게 끔 도와준다. 여기서 추가작업은 nginx reverse proxy config 작업을 자동으로 수행할 수 있게 도와준다.</p>\n</li>\n<li>\n<p>여기서 호스트의 docker.sock을 nginx-proxy 내부로 들고가야 하는데 이유는 호스트와 통신을 해야하기 때문이다. 호스트 서버에서 발생되는 도커 데몬의 이벤트를 바라보고 있다가 정보를 잘 받을수 있도록 통신을 해야한다.</p>\n</li>\n<li>\n<p>여기서 nginx-proxy에 등록될 app 들은 VIRTUAL_HOST라는 환경변수를 등록 해야한다.</p>\n</li>\n<li>\n<p>nginx 의 가상 호스트 정보는 <a href="https://opentutorials.org/module/384/4529">https://opentutorials.org/module/384/4529</a> 여길 참조</p>\n</li>\n</ul>\n<ol start="3">\n<li>express 도커서버를 위한 도커파일 작성</li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>##&nbsp;express&nbsp;를&nbsp;위한&nbsp;도커파일</span></span></div><div class="line"><span class="text plain null-grammar"><span>FROM&nbsp;node:alpine</span></span></div><div class="line"><span class="text plain null-grammar"><span>MAINTAINER&nbsp;&nbsp;merlin@merlin.com</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>RUN&nbsp;mkdir&nbsp;-p&nbsp;/app</span></span></div><div class="line"><span class="text plain null-grammar"><span>WORKDIR&nbsp;/app</span></span></div><div class="line"><span class="text plain null-grammar"><span>COPY&nbsp;package*.json&nbsp;./</span></span></div><div class="line"><span class="text plain null-grammar"><span>RUN&nbsp;&nbsp;npm&nbsp;install</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>EXPOSE&nbsp;3000</span></span></div></pre>\n<ol start="4">\n<li>도커파일을 express 이미지로 빌드.</li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>$&nbsp;docker&nbsp;build&nbsp;-t&nbsp;blog_express:v1&nbsp;-f&nbsp;./dockerfile/Dockerfile_express&nbsp;.</span></span></div></pre>\n<ol start="5">\n<li>모아둔 이미지들을 실행할 수 있도록 docker compose 작성</li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>#docker-compose.yml</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>version:&nbsp;&#39;3.2&#39;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>services:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;app_blue:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;image:&nbsp;blog_express:v1</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;depends_on:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;nginx-proxy</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;mongo-db</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;working_dir:&nbsp;/app/</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;ports:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;8888:3000</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;networks:&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;dbconnection</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;environment:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;VIRTUAL_HOST=nodeapp.local</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;volumes:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;type:&nbsp;bind</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;source:&nbsp;./template</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target:&nbsp;/app/template</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;type:&nbsp;bind</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;source:&nbsp;./server</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target:&nbsp;/app/server</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;command:&nbsp;npm&nbsp;start</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;app_green:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;image:&nbsp;blog_express:v1</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;depends_on:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;nginx-proxy</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;mongo-db</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;working_dir:&nbsp;/app/</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;networks:&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;dbconnection</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;environment:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;VIRTUAL_HOST=nodeapp.local</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;volumes:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;type:&nbsp;bind</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;source:&nbsp;./template</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target:&nbsp;/app/template</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;type:&nbsp;bind</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;source:&nbsp;./server</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;target:&nbsp;/app/server&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;command:&nbsp;npm&nbsp;start</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;nginx-proxy:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;image:&nbsp;jwilder/nginx-proxy</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;ports:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;8080:80</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;networks:&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;dbconnection</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;volumes:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;/var/run/docker.sock:/tmp/docker.sock:ro</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;mongo-db:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;image:&nbsp;mongo</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;ports:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;9999:27017</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;volumes:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;db-data:/data/db</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;networks:&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;dbconnection</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;command:&nbsp;mongod&nbsp;--dbpath&nbsp;&quot;/data/db&quot;&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>volumes:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;db-data:</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>networks:&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;dbconnection:</span></span></div></pre>\n<p>** 브라우저에서 접근할시 VIRTUAL_HOST 에 설정했던 이름으로 접근할 것 <br>\nnginx 설정에 server_name이 VIRTUAL_HOST 에 설정했던 값이 박혀있기에 nginx는 해당 이름으로 접근할때 반응하게 된다. <br>\n해서 /etc/hosts 설정은 필수</p>\n<ol start="6">\n<li>/etc/hosts 파일 수정</li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>0.0.0.0&nbsp;&nbsp;&nbsp;nodeapp.local</span></span></div></pre>\n<ol start="7">\n<li>블루-그린 배포를 위한 쉘 스크립트 작성</li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>#check.sh</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>#!/bin/sh</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>EXIST_BLUE=$(docker&nbsp;ps&nbsp;|&nbsp;grep&nbsp;app_blue)</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>if&nbsp;[&nbsp;-z&nbsp;&quot;$EXIST_BLUE&quot;];&nbsp;then</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;docker-compose&nbsp;up&nbsp;-d&nbsp;app_blue</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;docker-compose&nbsp;stop&nbsp;app_green</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;echo&nbsp;&quot;run&nbsp;app_blue!!&quot;</span></span></div><div class="line"><span class="text plain null-grammar"><span>else</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;docker-compose&nbsp;up&nbsp;-d&nbsp;app_green</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;docker-compose&nbsp;stop&nbsp;app_blue</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;&nbsp;&nbsp;&nbsp;echo&nbsp;&quot;run&nbsp;app_green!!&quot;</span></span></div><div class="line"><span class="text plain null-grammar"><span>fi</span></span></div></pre>\n<ul>\n<li>check.sh 를 작성해서 app_blue가 실행했을 경우에는 app_green이 실행 후 app_blue 를 중지.</li>\n<li>app_green 이 실행했을 경우에는 app_blue를 실행 후 app_green 를 중지.</li>\n</ul>\n<ol start="8">\n<li>test</li>\n</ol>\n<pre class="editor editor-colors"><div class="line"><span class="text plain null-grammar"><span>#&nbsp;처음에는&nbsp;app_blue를&nbsp;띄운다.</span></span></div><div class="line"><span class="text plain null-grammar"><span>$&nbsp;docker-compose&nbsp;up&nbsp;-d&nbsp;app_blue</span></span></div><div class="line"><span class="text plain null-grammar"><span>&nbsp;</span></span></div><div class="line"><span class="text plain null-grammar"><span>#&nbsp;그&nbsp;다음부턴&nbsp;무중단으로&nbsp;.check.sh&nbsp;를&nbsp;실행</span></span></div><div class="line"><span class="text plain null-grammar"><span>$&nbsp;sudo&nbsp;sh&nbsp;check.sh</span></span></div></pre>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-915e1.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 41.46730462519936%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAICAYAAAD5nd/tAAAACXBIWXMAABYlAAAWJQFJUiTwAAABh0lEQVQoz2VS23KbMBT0vzRO7GAwCITFVdyJuBhIPW1e8/8fsT2S65mkfdgRQrs7uzraPVsMvGoRqxEsLfDDEnBFC9ltaNWK9m1B2YzgokBeKTT9FVnRQ9YKYVwilR0CIXG0OV4sH7sXlyPYZrjvE5y+hZ+vSMZPOMkCP6ogkgohrf5F4tUJDbRYwzrfv59fmTE7nALsTkRY519Q7YJ5/Ak1LJimFV0/Ii/fTLKLzGGxwIj+hTZ5wCQ8njmKaYEk9OsNcTGARQ2EVLgkNWwmwOKYBD72R+8/g6/p7pXJ0F8n8N8bTk2NvdeAVR/w8g1OkJuEp7OgyjnirPmWStfnEZ27whibygcilPWImuDQwf7oUrIKdTsaokUiTdbCfthgexGeKOnTwTUG+j8LM9jEvRtSFUl31XQzGQ8k9ihVjul6g6Spejw1RL1qQz1xQVehJ62nG0al2TOe/a1sB0i7AdV1gyg77K0QQdKjUTcM8808m8dw1PRuTKtuQkdPKs5aiLQ2CR/P5g+GpQrISKB2ywAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="테스트 결과 화면"\n        title=""\n        src="/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-fb8a0.png"\n        srcset="/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-1a291.png 148w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-2bc4a.png 295w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-fb8a0.png 590w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-526de.png 885w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-fa2eb.png 1180w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-915e1.png 1254w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>',frontmatter:{title:"Docker Depolyment",date:"January 20, 2018"}}},pathContext:{slug:"/docker-depolyment/"}}}});
//# sourceMappingURL=path---docker-depolyment-4012246536442f60159d.js.map