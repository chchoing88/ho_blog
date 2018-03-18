---
title: hello-webServer
date: "2018-03-15T10:00:03.284Z"
---

## web Server
---

- web server 는 요청 과 응답의 연속이다.
- web browser에 web page주소를 입력(요청) 하면 입력한 주소에 맞는 웹 페이지(응답) 을 제공한다. 
- 요청은 요청하는 url , 요청하는 방식 (ex. get,post..) , 요청하는 agent , 요청자가 받을 수 있는 형식이나 charter-set , encoding , language  등등을 함께 실어서 보낸다.
- 응답은 응답에 상태 ( ex. 200 , 404 error) , 응답하는 data를 전달한다.

여기서 nodeJs는 이 웹서버와 관련된 모든 기능들을 http 모듈에 담았다.

따라서 우리는 앞으로 http 모듈에 대해서 가볍게 다뤄 보겠다.



### http 모듈

- http 모듈은 createServer()로 server라는 객체를 생성한다.
- listen(port[, callback])은 서버를 실행한다.
- stop([callback])은 서버를 종료한다.

### server 객체

- server 객체는 EventEmitter 객체를 기반으로 만들어졌으므로 이벤트를 연결 시킬수 있다.
- server.on({eventName},{eventHandler})
- 예를 들면 내부적으로 connection이 발생하면 server.emit('connection'); 이라고 발생을 시키면 외부에서 우린 on 메서드로 그 이벤트를 감지해서 해당 후속 작업을 이어 나갈 수 있다.

```javascript
server.on('connection', (code) => console.log('Connection ON'))
```

- "request" 라는 이벤트도 존재하는데 이 이벤트는 예외적으로 on 메서드를 사용해서 지정할 필요가 없고 createServer시 매개변수로 콜백(request 가 발생 했을시 이벤트 핸들러 ) 함수를 넘겨 놓으면 이벤트 핸들러(이벤트 리스너) 처럼 사용 할 수 있다.

```javascript
http.createServer((request, response) => {
    // 응답헤더
    response.writeHead(200, {
        'Content-Type' : 'text/html',
        'Set-Cookie':['breakfase = toast';Expire = ' + date.toUTCString(),
        'dinner = chicken']
        });
    // 응답본문
    response.end('<h1>블라블라~</h1>');
});
```

### response 객체

- 클라이언트에 웹 페이지를 제공하려면 응답 메세지가 필요하다.
- request 이벤트가 발생되면 핸들러(리스너)의 두번째 매개변수로 전달되는 response 객체를 사용해서 사용자에게 응답을 전달한다.
- 응답 메시지의 'Content-Type' 는 전달할 데이터 속성을 뜻한다.
- response 객체를 사용하면 클라이언트에 쿠키를 할당할 수 있다. 응답헤더에 'Set-Cookie' 라는 키 값으로 셋팅 해준다.
- 쿠키를 출력할 때에는 request.headers.cookie 라는 값으로 참조 한다. 

### request 객체

- server의 request 이벤트가 발생했을 때 이벤트 리스너의 첫 번째 매개변수에는 request 객체가 들어갑니다.
- method , url , headers, trailers, httpVersion 등, 속성들이 존재한다.
- 이런 속성들을 사용하면 요청한 페이지를 적절하게 제공하는 것은 물론 요청 방식에 따라 페이지를 구분할 수 있다.

```javascript
http.createServer((request, response) => {
    // 그냥 요청자의 pathname을 구한다고 보면 된다.
    const pathname = url.arse(request.url).pathname; 

    if(pathname == '/'){
        
    }

    //or

    if(request.method == 'GET'){

    }

    //or ( GET 요청 방식에서의 매개변수 추출 )
    // http://localhost/?name=hoho&region=suwon
    const query = url.parse(request.url, ture).query;
    response.end(JSON.stringify(query))  // {"name":"hoho","region":"suwon"}

    //or ( POST 요청 방식에서의 매개변수 추출 )
    // request 이벤트가 발생한 후 request 객체의 data의 이벤트로 데이터가 전달 된다.
    request.on('data',(data) => {
        console.log('POST Data:', data);
    })

    //or 쿠키 추출
    const cookie1 = request.headers.cookie; // return 값은 문자열이다.
    const cookie2 = request.headers.cookie.split(';').map((cookieItem) => {
        let arrCookieItem = cookieItem.split('=');
        return {
            key: arrCookieItem[0],
            value: arrCookieItem[1]
        }
    }); // return 은 객체
})
```