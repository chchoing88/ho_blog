webpackJsonp([0x7fbbdaeb8b3a],{405:function(n,e){n.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/docker-depolyment/index.md absPath of file >>> MarkdownRemark",html:'<h1>Docker Depolyment</h1>\n<hr>\n<h2>blue-green 배포 개념</h2>\n<p>로드발란서를 앞단에 하나를 두고 v1 버젼인 블루(가칭) 라는 앱을 띄운다. 그러다가 나는 v2 버젼인 그린(가칭)을 무중단 방식으로 업데이트를 진행하고 싶다. <br>\n그럴때 그린을 로드발란서에 등록을 시킨다. <br>\n그러면 블루와 그린을 로드발란싱을 할텐데 그린이 완전히 정상작동을 하였을때 v1 버젼인 블루를 죽이는 방식이다.</p>\n<h2>why needs?</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-8e53b.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.241032998565274%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAACXBIWXMAABYlAAAWJQFJUiTwAAABh0lEQVQoz5VSTUsCURT1r0Sr+gVthRbt6gfYKqK1lIuy6AsJwpSiQAja9EG2ScsaN1JBGWKitSgq1EZlGJtpxlT8mA9PvgcK0Sh24fAe95173rvnPlOxWIQRcrkcOI5DJpNBNpsFz/N0JSD5TnWmWq2GTqhWq4b7bjDhH7HjTcAy68O4PYB39suQ0xbUVAWNRuMPQVEUiKKIz3we1jU/+sx29A8vI/qUhCzLkCSJnpMO2oK3QQbnbhuYXRcq5TJ0Xac+kYIZJwP7VoheZnNfYWB0G4NjHjy+8sYvJEQhfgAtfYpy1INYPAGWZWE2m+FwOPAQfwYvlqhgpaagUKpSaM1LDQVFrYLIpgXK4giEySHcCxqdltfrRTgcpq20rLh7YbB/vYHDGzeEb66zh6RAliWoqkr39Xod+aZnxBuSa8EX2cPS8QRWTqbwkX+DIAgoFAqUR9ZfQ+klmNgRnH4rXGfT4CS2+5R7CV3XoGoqhdGPoIJzgSS6YeEyhfVQGqvBFOYvunMJfgBnaiJGKN99VAAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="구성"\n        title=""\n        src="/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-fb8a0.png"\n        srcset="/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-1a291.png 148w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-2bc4a.png 295w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-fb8a0.png 590w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-526de.png 885w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-fa2eb.png 1180w,\n/ho_blog/static/img_greenBlue-fb095609940c67b4165035ab4468af02-8e53b.png 1394w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<hr>\n<h2>BackEnd Environment</h2>\n<ul>\n<li>노트북 : 맥북</li>\n<li>도커 호스트 : virtual box ubuntu or mac</li>\n<li>도커 컨테이너 : node express server , nginx-proxy , mongodb</li>\n</ul>\n<hr>\n<h2>폴더 구조</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>├── dockerfile\n│   ├── Dockerfile_express      ## express 용 서버 이미지 소스파일\n├── template                    ## 템플릿 소스\n├── server                      ## 서버소스\n│   ├── server.js\n├── .dockerignore\n├── check.sh                    ## 배포용 sh\n├── docker-compose.yml          ## docker 컨테이너들의 환경설정을 모아둔곳 한번에 서버들을 손쉽게 실행시킬 수 있다.\n├── package.json                ## app server 컨테이너 안에 들어가 관련 패키지 설치\n  </code></pre>\n      </div>\n<hr>\n<h2>Summary</h2>\n<ol>\n<li>맥북 - virtual box 공유 폴더 구성</li>\n<li>폴더 구성 </li>\n<li>ubuntu 에서 nginx-proxy 이미지 다운</li>\n<li>ubuntu 에서 node 이미지를 기반으로 express Dockerfile_express 작성 및 빌드</li>\n<li>docker-compose.yml 작성</li>\n<li>/etc/hosts 파일 수정</li>\n<li>check.sh 현재 돌아가는 도커 확인하고 새로운 도커 띄우고 현재 돌아가는 도커 죽이는 쉘 스크립트 작성</li>\n<li>테스트</li>\n</ol>\n<p><strong>만약 mac 에서 테스트를 한다면 2번부터 보시면 됩니다.</strong></p>\n<hr>\n<h2>procedure</h2>\n<ol>\n<li>버츄어 박스에 공유 폴더 설정\n참고 : <a href="http://theniceguy.tistory.com/13">http://theniceguy.tistory.com/13</a></li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>## 우분투에 공유폴더 마운트 \n$ sudo mount --types vboxsf blog_project blog_project</code></pre>\n      </div>\n<ul>\n<li>로컬 blog<em>project 폴더를 버츄어박스의 blog\\</em>proect 폴더랑 연결</li>\n<li>버츄어 박스 내의 blog_proect 폴더안에는 도커에서 필요한 소스파일 및 설정파일들이 담겨져 있음.</li>\n</ul>\n<ol start="2">\n<li>로드밸런싱을 위한 nginx-proxy 이미지 다운 받기 </li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>## nginx-proxy 이미지 다운 받기 \n$ docker pull jwilder/nginx-proxy </code></pre>\n      </div>\n<ul>\n<li>\n<p>사실 여기서 받지 않아도  docker-compose.yml 파일에 설정이 되어있어서 docker-compose up 하면 자동으로 pull을 받게 된다.</p>\n</li>\n<li>\n<p>해당 이미지는 도커 젠을 기반으로 만들어진 nginx-proxy로 로드발란싱의 기능이 있는 nginx applicaion에 도커 젠 기능을 추가 해서 넣은 이미지</p>\n</li>\n<li>\n<p>해당 이미지를 사용하게 되면 도커 젠이 도커 데몬을 바라보고 있다가 컨테이너의 런 , 스탑 등의 이벤트를 감지, 해당 컨테이너 정보를 수집 해서 추가 작업을 할 수 있게 끔 도와준다. 여기서 추가작업은 nginx reverse proxy config 작업을 자동으로 수행할 수 있게 도와준다.</p>\n</li>\n<li>\n<p>여기서 호스트의 docker.sock을 nginx-proxy 내부로 들고가야 하는데 이유는 호스트와 통신을 해야하기 때문이다. 호스트 서버에서 발생되는 도커 데몬의 이벤트를 바라보고 있다가 정보를 잘 받을수 있도록 통신을 해야한다.</p>\n</li>\n<li>\n<p>여기서 nginx-proxy에 등록될 app 들은 VIRTUAL_HOST라는 환경변수를 등록 해야한다.</p>\n</li>\n<li>\n<p>nginx 의 가상 호스트 정보는 <a href="https://opentutorials.org/module/384/4529">https://opentutorials.org/module/384/4529</a> 여길 참조</p>\n</li>\n</ul>\n<ol start="3">\n<li>express 도커서버를 위한 도커파일 작성</li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-dockerfile"><code>## express 를 위한 도커파일\nFROM node:alpine\nMAINTAINER  merlin@merlin.com\n\nRUN mkdir -p /app\nWORKDIR /app\nCOPY package*.json ./\nRUN  npm install\n\nEXPOSE 3000</code></pre>\n      </div>\n<ol start="4">\n<li>도커파일을 express 이미지로 빌드.</li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>$ docker build -t blog_express:v1 -f ./dockerfile/Dockerfile_express .</code></pre>\n      </div>\n<ol start="5">\n<li>모아둔 이미지들을 실행할 수 있도록 docker compose 작성</li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-yml"><code>#docker-compose.yml\n\nversion: \'3.2\'\n\nservices:\n  app_blue:\n    image: blog_express:v1\n    depends_on:\n      - nginx-proxy\n      - mongo-db\n    working_dir: /app/\n    ports:\n      - 8888:3000\n    networks: \n      - dbconnection\n    environment:\n      - VIRTUAL_HOST=nodeapp.local\n    volumes:\n      - type: bind\n        source: ./template\n        target: /app/template\n      - type: bind\n        source: ./server\n        target: /app/server\n    command: npm start\n  \n  app_green:\n    image: blog_express:v1\n    depends_on:\n      - nginx-proxy\n      - mongo-db\n    working_dir: /app/\n    networks: \n      - dbconnection\n    environment:\n      - VIRTUAL_HOST=nodeapp.local\n    volumes:\n      - type: bind\n        source: ./template\n        target: /app/template\n      - type: bind\n        source: ./server\n        target: /app/server \n    command: npm start\n\n  nginx-proxy:\n    image: jwilder/nginx-proxy\n    ports:\n      - 8080:80\n    networks: \n      - dbconnection\n    volumes:\n      - /var/run/docker.sock:/tmp/docker.sock:ro\n  \n  mongo-db:\n    image: mongo\n    ports:\n      - 9999:27017\n    volumes:\n      - db-data:/data/db\n    networks: \n      - dbconnection\n    command: mongod --dbpath "/data/db" \n    \nvolumes:\n  db-data:\n\nnetworks: \n  dbconnection:</code></pre>\n      </div>\n<p>** 브라우저에서 접근할시 VIRTUAL_HOST 에 설정했던 이름으로 접근할 것 <br>\nnginx 설정에 server_name이 VIRTUAL_HOST 에 설정했던 값이 박혀있기에 nginx는 해당 이름으로 접근할때 반응하게 된다. <br>\n해서 /etc/hosts 설정은 필수</p>\n<ol start="6">\n<li>/etc/hosts 파일 수정</li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-vi"><code>0.0.0.0   nodeapp.local</code></pre>\n      </div>\n<ol start="7">\n<li>블루-그린 배포를 위한 쉘 스크립트 작성</li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code>#check.sh\n\n#!/bin/sh\n\nEXIST_BLUE=$(docker ps | grep app_blue)\n\nif [ -z "$EXIST_BLUE"]; then\n    docker-compose up -d app_blue\n    docker-compose stop app_green\n    echo "run app_blue!!"\nelse\n    docker-compose up -d app_green\n    docker-compose stop app_blue\n    echo "run app_green!!"\nfi</code></pre>\n      </div>\n<ul>\n<li>check.sh 를 작성해서 app_blue가 실행했을 경우에는 app_green이 실행 후 app_blue 를 중지.</li>\n<li>app_green 이 실행했을 경우에는 app_blue를 실행 후 app_green 를 중지.</li>\n</ul>\n<ol start="8">\n<li>test</li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-sh"><code># 처음에는 app_blue를 띄운다.\n$ docker-compose up -d app_blue\n\n# 그 다음부턴 무중단으로 .check.sh 를 실행\n$ sudo sh check.sh</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-915e1.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 590px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 41.46730462519936%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAICAYAAAD5nd/tAAAACXBIWXMAABYlAAAWJQFJUiTwAAABVElEQVQoz41S2W6CUBDla9wQlH3fLiDoRaqofWjf+v//cHpnbGwTk7YPk5CZuWfOgjZb2UiqDqno4YYFFkYAy8tQNhL17sgl2gGOnyMpdtjtTyjEHkL1g1ggq3r4UQl9E2CxdqHNTRfuZYQxSZiyg52fEMsPbPIr7FCo5QpOUPCj9TbkR7+VtjI9yPHGlw/HC9p+RC8nZkUswrRGlAuYfvAnGAMuDVcBnNF0I4aXG+KsgR9XCBPBFqxMH3YS/QvsIdmajnDeJuh9g6V/gF2/wypf4SUtM9y6CSw3RZQ2TwB0lOYPwJlus8mVCsG070wsL2XJZDQxpN7GidEdzjz7Cbh1EgbUv/a0ue5wUgRIxUuKzTBeUdaSgahnWhFqZQul76mA4qxFoGyhb2LpBPk3IPlHFSl5dxklh7QfJmZFQXkqbQpPqkOilTwjv3NFhn4fw7qr+wTZagsxklb6FgAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="테스트 결과 화면"\n        title=""\n        src="/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-fb8a0.png"\n        srcset="/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-1a291.png 148w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-2bc4a.png 295w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-fb8a0.png 590w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-526de.png 885w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-fa2eb.png 1180w,\n/ho_blog/static/img_developTest-52861d8be6168118711b8bb27f0629b8-915e1.png 1254w"\n        sizes="(max-width: 590px) 100vw, 590px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>',frontmatter:{title:"Docker Depolyment",date:"January 20, 2018"}}},pathContext:{slug:"/docker-depolyment/"}}}});
//# sourceMappingURL=path---docker-depolyment-ac8cf9ea302435b186f6.js.map