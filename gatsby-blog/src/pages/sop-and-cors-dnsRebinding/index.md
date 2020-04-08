---
title: sop와 cors 그리고 DNS Rebinding
date: "2019-02-27T10:00:03.284Z"
---

## cookie

쿠키는 사용자 속성을 기억하는 데 사용되는 작은 텍스트 파일이다.

서버에서 `Set-Cookie` 라고 헤더에 셋팅을 하게 되면 브라우저는 해당 쿠키를 `key=value`로 저장하게 된다. 

쿠키 중에는 2가지 쿠키가 존재한다.
- 웹브라우저를 끄면 사라지는 휘발성 쿠키를 `Session cookie`.
- 웹브라우저를 꺼도 사라지지 않는 쿠키를 `Permanent` 쿠키

`Permanent` 쿠키를 셋팅할 때는 `key=value; [expire | Max-Age]` 라고 셋팅을 해준다. expire는 만료되다 라는 뜻이고 쿠키가 언제 죽을것인가 즉, 절대적인것 이다. 
Max-Age는 현재 시점을 기준으로 상대적으로 얼마간 살아있을것인가 를 나타낸다. 예 `key=value; Max-Age=${60*60*24*30}` 30일 짜리 쿠키를 만드는 것이다.

또한 쿠키 옵션 중에는 Secure, HttpOnly, path, domain 이 존재한다.

- Secure는 웹브라우저와 웹서버가 `https`로 통신하는 경우만 웹브라우저가 쿠키를 서버로 전송하는 옵션이다. (`key=value; Secure`)
- `HttpOnly`는 자바스크립트의 document.cookie를 이용해서 쿠키에 접속하는 것을 막는 옵션이다. 웹브라우저와 통신할 때만 전송되는 쿠키 이다. 쿠키를 훔쳐가는 행위([XSS](https://www.kisa.or.kr/uploadfile/201312/201312161355109566.pdf))를 막기 위한 방법입니다. (`key=value; HttpOnly`)

path와 domina 옵션은 쿠키의 유효범위를 정의하는 옵션이다.
어떤 특정 디렉토리에서만 쿠키가 활성화 되도록 하고 싶을때 path 라는 옵션을 지정한다. `key=value; path=/cookie` path라는 옵션을 주어서 어떤 디렉토리를 지정하면 디렉토리 하위에서만 쿠키가 활성화 되서 웹 브라우저는 거기에만 해당하는 쿠키를 서버에 전송한다.

domain 옵션은 다음과 같이 사용하고  `key=value; Domain=o2.org` 어떤 서브 도메인에서도 살아있는 쿠키를 만드는 것이다. 즉, `test.o2.org` 에서는 해당 key, value 가 살아있는 것입니다.

특히 domain은 쿠키가 전송되게 될 호스트를 명시하는데 지정하지 않을 경우에는 서브 도메인은 포함되지 않는 현재 문서 위치의 호스트를 셋팅할 것이고, 명시적으로 설정하게 되면 서브도메인들은 항상 포함되게 됩니다.

쿠키는 사용자 정보를 수집할때도 이용 가능한데 만약에 내 블로그 `www.myBlog.com` 이 있다고 생각해보자. 
`myBlog` 에서 생성된 쿠키는 도메인 스코프를 지니기 때문에 `myBlog` 로만 전송이 될 수 있다. 

하지만 `myBlog`에 페이스북 공유하기 버튼을 심어놨다고 생각해보자.
페이스북 공유하기 버튼에 사용되는 이미지 또는 js 파일을 요청 할 것이다. 이때, 페이스북은 응답으로 여러 쿠키를 심을 것이다. 이후에 페이스북을 접속을 하게 되면 페이스북이 심어놨던 쿠키들을 다시 받을 수 있다. 이때 얻을 수 있는 정보는 아마 내가 `myBlog`에 들렀었고 좋아요 버튼을 눌렀다면 좋아요 버튼도 눌렀다는 사실까지 알 수 있을것이다.

## SOP

영어로 하면 same-origin policy 우리말로 하면 동일 출처 원칙 이라고 한다. 
모든 최신 브라우저에 의해 이 정책을 지원하고있다. 웹 자원들은 같은 프로토콜과 같은 도메인 그리고 같은 포트를 사용한다면 다른 컨텐츠의 자원들에 즉, 속성이나 다른 값어치 있는 것들에 도달할수 있다. 만약 그렇지 않다면 document 속성에 도달하거나 변경하는 작업은 **브라우저**에 의해 막히게 된다. 

만약 우리가 http://www.example.com/dir/test.html 페이지를 호스팅했다고 상상해보자 이 안에는 다른 웹페이지가 로드된 iframe이 있다고도 생각해보자.
우리의 호스트는 www.example.com 으로 정의되어있다. 아래 테이블은 접근 가능한지 안가능한지를 나타내는 full URLs를 비교해놓았다.

| URL                                    | Result         | Reason                                                             |
|----------------------------------------|----------------|--------------------------------------------------------------------|
| http://www.example.com/dir/page.htm    | Accessible     | Protocol, host and port match                                      |
| http://www.example.com:81/dir/test.htm | Not Accessible | Same protocol and host, but port is different (81)                 |
| https://www.example.com/dir/test.htm   | Not Accessible | Same host, but schema/protocol (https) different                   |
| http://demo.example.com/dir/test.htm   | Not Accessible | Schema and port are same, but host is different (demo.example.com) |
| http://example.com/dir/test.htm        | Not Accessible | Host is different (example.com)                                    |


모든 모던 브라우저에 의해 동일 출처 정책이 지원되기 때문에 웹 리소스는 동일한 프로토콜, 동일한 도메인, 동일한 포트를 사용하는 경우 서로의 콘텐츠, 속성에 도달할 수 있다.
만약 그렇지가 않다면 브라우저에 의해서 문서 속성에 도달하거나 변경이 막힙니다.

오늘날 Same-origin Policy는 대게 DOM에만 적용 되는지 알았지만 사실 그게 전부가 아니다 웹의 모든 자원에 대해서 Same-origin Policy의 체크 매커니즘이 적용된다.
쿠키가 그 한 예중에 하나일것이다. 쿠키는 쿠키속성의 도메인(domain), 경로(path) 및 속성이 요청 된 도메인과 일치하는 이벤트에서만 쿠키가 전송되기 때문에 Same-origin Policy 매커니즘이 적용되는 하나의 예가 될 수 있다. 만약 쿠키가 매칭되고 expired 되지 않았다면 쿠키는 보내질 것이다. 이전에 설명했던 Same-origin Policy와 다른점이 있다면 쿠키(secure-only cookies는 제외)는 포트와 스키마를 쿠키가 보내지기 전에 체크해야하는 대상이 아니라는 점이다.

대부분이 알고 있는 잘못된 사실은 Same-origin Policy는 브라우저가 다른 origin의 자원을 *로드*하는걸 금지한다는 것이다. 하지만 우리가 알고있는 CDN 생태계만 봐도 그것은 사실이 아니라는걸 알 수 있다. 

다른 잘못된 사실은 origin에서 다른 곳으로 자원을 *보낼수가 없다*는 사실이다. 이것또한 사실이 아니다. 

우리가 기억하고 있는 Same-origin Policy 정책의 정의를 보자.

1. 각 사이트는 자산의 리소스를 지니고있다. 쿠키, DOM 그리고 자바스크립트 네임스페이스
2. 각 페이지는 자신의 URL로 부터 origin을 갖는다. ( 대게 스키마, 도메인 그리고 포트 )
3. 스크립트는 자신이 load된 origin의 컨텍스트안에서 실행된다. 어디서 불러왔는지는 중요하지 않다. 오직 마지막에 실행된 장소가 중요하다.
4. 많은 미디어나 이미지 리소스들은 수동 리소스들이다. 그것들은 그들이 존재하는 컨텍스트의 자원이나 object에 접근 할 수가 없다.

이런 룰을 가지고 *Origin A* 라는 사이트가 있다고 가정해보자.

1. origin B 로 부터 온 스크립트를 load 할수있다. 하지만 그것은 A 컨텍스트 안에서 동작한다.
2. 스크립트의 원시 컨텐츠나 소스코드에 접근 할 수가 없다.
3. origin B 로 부터 온 css를 load 할수 있다. 
4. origin B 에 속해있는 css의 raw text에 접근 할 수 없다. 
5. iframe을 이용해서 origin B 페이지를 load 할 수 있다. 
6. iframe 안에 있는 origin B 페이지의 DOM에 접근 할 수 없다.
7. origin B의 이미지를 load 할 수 있다. 
8. origin B로 부터 로드된 이미지의 bits에 접근할 수 없다.
9. origin B로 부터 온 비디오를 재생할 수 있다.
10. origin B에서로드 한 비디오의 이미지를 캡처 할 수 없습니다.

이런 정책들이 브라우저마다 다르게 실행된다는 점이 개발자들이 주의를 해야할 부분이다. 다른 브라우져 사이에서 쿠키, 자바스크립트, DOM 접근에 관해서 Same-origin Policy의 정의가 다르게 되어있다. 

예를 들면 우리가 *http://www.example.com/test.html* 을 가지고 있다고 생각하고 이때 *http://www.example.com:81/contact.html* 에 접근하자고 생각해보자. IE의 경우 포트가 달라도 스키마와 도메인이 같기 때문에 접근이 가능하다 하지만 다른 모던 브라우저에서는 접근이 불가능 하다.

때때로 이 Same-origin Policy의 엄격한 룰 때문에 베이스 도메인이 같은 사이트 사이에서 쉐어링할때 문제가 발생할 수 있다. 예를 들면  *login.example.com*, *games.example.com*, 그리고 *calendar.example.com* 이런 사이트를 지니고 있다면 어떻게 전체 도메인이 매칭이 안된 상태에서 커뮤니케이션을 할수 있을까.
이럴때 javascript의 *document.domain* 이란 설정으로 조금 룰을 완화 시킬 수 있다.

```javascript
document.domain = "example.com";
```

이렇게 하면 브라우저에 모든것이 *login.example.com*, *games.example.com*, 그리고 *calendar.example.com* 을 포함하여 *example.com* 으로 같은 origin으로 고려된다고 말하는것과 같다. 

그러나 주의해야 할 것은 *login.example.com* 이 바로 *example.com* 의 DOM에 접근할수 있지 않다는 것이다. 이 접근을 허용하려면 *example.com* 안에
*document.domain* 을 *example.com* 으로 셋팅해주어야 한다. 

javascript에서 document.domain 셋팅하는 것은 Same-origin Policy의 호스트이름 정책을 완화시킬수 있다. 하지만 포트나 스키마 제한은 남아있다. 
아래 표로 예시를 나타낸다.

| URL                        | document.domain | iframe URL                  | document.domain | Result                            |
|----------------------------|-----------------|-----------------------------|-----------------|-----------------------------------|
| http://www.example.com     | example.com     | http://login.example.com    | example.com     | Accessible                        |
| http://www.example.com     | example.com     | https://payment.example.com | example.com     | Not Accessible, protocol mismatch |
| http://payment.example.com | example.com     | http://example.com          | Not Set         | Not accessible                    |
| http://www.example.com     | example.com     | http://www.example.com      | Not Set         | Not accessible                    |

여기서 중요한것은  *login.example.com* 을 *example2.com* 로 셋팅 할 수 없다는 것이다.

### XmlHTTPRequest

XmlHTTPRequest 도 동일하게 Same-origin Policy의 요구사항이 적용됩니다.

- XmlHTTPRequest 호출은 다른 출처의 사이트로 보낼 수는 있지만 읽을수는 없습니다.
- 요청 URL이 같은 출처라면 응답을 읽을 수 있습니다.
- 사용자 정의 헤더는 동일한 출처에 대한 요청에만 추가 할 수 있다.

조심해야하는 부분은 XmlHTTPRequest 의 호출은 다른 출처로 데이터를 보낼 수 있으므로 잠재적인 Cross Site Request Forgery 공격을 허용할 수 있다는 것이다.

분명히 XmlHTTPRequest의 Same-origin 정책은 다른 출처의 리소스를 사용할 때 문제가 된다. 

### JSON Padding (JSONP)

XmlHTTPRequest 객체를 사용해서 다른 출처에 있는 요청을 보낼수 있지만, 응답을 읽을수가 없다. 그래서 어떻게 해야할까? 어떻게 하면 비동기적으로 여러 다양한 데이터를 받을 수 있을까? 

Same-origin Policy 원리 하에 우리는 스크립트가 로드된 사이트의 컨텍스트 안에서 동작하는 것을 안다. 당연히 유효한 스크립트 파일이어야 한다는 것이다. 이런 기술을 이용해서 JSONP 가 사용됩니다.

이는 Same-origin Policy를 우회할 수 있습니다.


여기 다음과 같은 호출이 있다고 생각합시다. http://www.example.com/getAlbums?callback=foobarbaz
응답으로는 다음과 같은 결과를 볼수 있습니다.

```javascript
foobarbaz([{"artist": "Michael Jackson", "album": "Black or White"}{"artist": "Beatles, The", "album": "Revolution"}]);
```

잠시 분석해보자면 
1. 우리는 *http://www.example.com/getAlbums*의 리소스를 요청했고 그리고 callback 이름을 쿼리 스트링으로 *foobarbaz* 라고 지정했습니다.
2. 해당 리소스에서 JSON 결과가 리턴될때 그 결과를 함수 이름 *foobarbaz* 으로 감싸줘야 한다. 이는 쿼리 스트링으로 정의내린 이름이다.

물론 이런 방법은 보안의 위험이 있고 반환 된 모든것이 신뢰할 수 있다고 가정해야 한다. 요청을 받은 사이트에서 반환되는 모든 코드가 우리의 브라우저가 띄운 우리 웹사이트의 컨텍스트에서 실행된다는 점을 잊지 말아야 한다. 또  전송시 발생할 수있는 조작을 방지하기 위해 보안 HTTPS 채널을 통해 요청하는 것도 중요하다.

### XDomainRequest and JSONP vs. CORS

JSONP의 한계는 JSONP로 작성된 도메인간 요청은 읽기전용의 한방향만 사용할수 있다는 것이다. 여전히 쓰기 요청에 대한 기회는 여전히 JSONP에 적용되었던 Same-origin Policy에 막혀있다.

이때 MS는 독자적으로 IE8과 IE9에서 XDomainRequest 를 만들어냈고 Chrome, Firefox 등 기타 브라우저에서는 CORS(Cross-Origin Resource Sharing)이라는 인기있는 대체기능을 구현했다. MS도 나중에 IE10에선 CORS를 채택했다. 

CORS는 우리가 origin A 의 사이트가 origin B 사이트에 요청을 보내려고 할때 origin A 에는 *Origin* 이라는 사용자 정의 HTTP 헤더를 설정하여 요청에서 origin을 선언해야 한다. origin B의 사이트는 CORS 요청을 허용하는 출처를 정의하는 HTTP 헤더가 포함된 응답을 반환해야 한다. 이 헤더는 *Access-Control-Allow-Origin* 헤더 이다. 

이것을 사용하여 서브도메인도 허용할수 있다. 예를 들면 *sub.example.com*
```
Access-Control-Allow-Origin: www.example.com
```
인터넷에 있는 모든 도메인에게 허락할수도 있다.
```
Access-Control-Allow-Origin: *
```

## Cross-Origin Resource Sharing (CORS) in Detail

CORS 요청은 2가지 타입이 있다. Simple Request와 Preflight 이다. 대부분의 일반 CORS 요청은 일반적인 HTTP 헤더 및 작업으로 구성된 단순 요청 범주에 속합니다. 그러나 프리 플라이트 요청은 단순 요청의 일반적인 신뢰할 수있는 범위를 벗어나는 비정형 성으로 인해 서버에 대한 추가 유효성 검사가 필요하다.

### Simple Request

만약 요청 method가 GET, POST, or HEAD 그리고 *Content-Type*에 의해 셋팅된 message type이 *application/x-www-form-urlencoded,* *multipart/form-data*, *text/plain* 이라면, 이 요청은 CORS Simple 요청으로 간주된다. 그리고 다이렉트로 서버에 전송된다. 
서버는 반환 된 *Access-Control-Allow-Origin* HTTP 헤더에 의해 CORS 요청을 수락하는지 여부를 나타낸다. 
만약 서버가 승인하면, 응답이 클라이언트에 의해 처리 될것이다. 
또한 Accept (허용 할 내용 유형), Accept-Language (브라우저에서 허용하는 언어) 및 Content-Language (요청 언어)와 같이 CORS 요청에 직접 적용되는 요청에서 보낼 수있는 몇 가지 추가 HTTP 헤더가 있다.

우리 페이지 http://www.acceptmeplease.com 에서 core.example.com 으로 요청을 보내는 시도이다.
요청 헤더에 있는 Host는 요청의 대상이 되는 서버의 호스트 명과 포트를 준다.

요청
```
GET / HTTP/1.1
Host: cors.example.com
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en,en-US;q=0.5
Origin: http://www.acceptmeplease.com
Connection: keep-alive
```

서버응답
```
HTTP/1.1 200 OK
Date: Sun, 24 Apr 2016 12:43:39 GMT
Server: Apache
Access-Control-Allow-Origin: http://www.acceptmeplease.com
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: application/xml
Content-Length: 423

<?xml version="1.0" encoding="UTF-8"?>
...
```

요청시에 우리는 http://www.acceptmeplease.com 사이트에서 cors.example.com에 대한 우리의 CORS 단순 요청을 수행하며, 또한 이를(우리의 사이트 url을) 우리의 origin 지정한다. 서버는 우리의 origin을 승인하는 것에 응답한다. 따라서 브라우저는 Same-origin Policy의 도메인 제한을 완화한 채 요청을 계속할 수 있게 된다.

### Preflight Request

Simple Request에 해당되지 않는 것들에 대해서 Preflight Request를 진행한다. 이것이 의미하는 것은 *GET, POST, or HEAD* 메서드 요청이 아니고 또는 요청이 *POST* 이지만 *Content-type* 이 *application/x-www-form-urlencoded,* *multipart/form-data*, *text/plain* 이 중 하나가 아니고, 또는 만약 커스텀 HTTP 헤더에 추가가 되어있다면 이 요청은 서버에 처음으로 유효성을 받아봐야 한다. 
실제 CORS 전에 서버에게 보내지게 되며 브라우저는 *pre-flight check*을 *OPTIONS* 메서드로 요청을 보내게 된다. 이것은 Simple Request 보다 2번의 HTTP 호출을 하기 때문에 비용이 드는 행위이다. 하지만 필요한 작업이다.

이해를 돕기 위한 CORS Preflight Request and server response 예제이다. POST 메서드를 사용하지만 추가적인 *X-Token-ID* 와 *Content-Type*을 *application/xml* 로 지정했다. 그래서 CORS Preflight Request을 진행할 것이다.

< 요청 헤더 >
```
OPTIONS /resources/post-here/ HTTP/1.1
Host: cors.example.com
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Connection: keep-alive
* Origin: http://www.acceptmeplase.com *
* Access-Control-Request-Method: POST *
* Access-Control-Request-Headers: X-TOKEN-ID *
```

여기서 먼저 OPTIONS 메서드로 요청을 보내게 된다. 이것은 먼저 서버에게 보내진 HTTP Header가 수용가능한지 요청을 보내는 것이다. 
다음으로는 우리의 Origin 을 설정한다. 
그리고 2가지의 헤더를 더 정의내리는데 *Access-Control-Request-Method*, *Access-Control-Request-Headers* 이다. 이것들은 브라우저의 의도를 전달하는데 중요하다. POST 메서드와 추가적인 HTTP header 가 있음을 알린다.


< OPTIONS 메서드에 대한 서버 응답 >
```
HTTP/1.1 200 OKDate: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache
* Access-Control-Allow-Origin: http://www.acceptmeplease.com *
* Access-Control-Allow-Methods: POST, GET, OPTIONS *
* Access-Control-Allow-Headers: X-TOKEN-ID *
* Access-Control-Max-Age: 86400 *
Vary: Accept-Encoding, Origin
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

- Access-Control-Allow-Methods – 이것들은 브라우저가 보낼 수있는 허용 된 요청 방법입니다.
- Access-Control-Allow-Headers – 이것은 브라우저가 전송할 수있는 승인 된 추가 HTTP 헤더입니다.
- Access-Control-Max-Age – 이 HTTP 헤더가 응답에 설정되면 서버는 브라우저가 동일한 종류의 요청에 대해 이 OPTIONS 결과를 캐시하기를 원합니다. 이를 통해 브라우저는 각각의 요청 전에 OPTIONS 요청을하지 않고도이 최대 연령 설정 내의 리소스에 비슷한 요청을 할 수 있습니다.

주의 해야 할점은 *Access-Control-Max-Age* 이 값이 86400초 또는 24시간으로 설정되어있습니다. 하지만 각 브라우저는 이 필드의 최대 값을 정의하고 있기에
브라우저의 최대 보존 기간을 초과하면 이 값을 무시하고 최대 허용 값을 사용하게 됩니다. 예를 들어 크롬은 최대 10분 입니다.


### Cookies

우리는 지금까지 다양한 HTTP header와 함께 CORS를 보여주었다. 하지만 *Cookie* HTTP header는 공유할 수가 없다. 디폴트로 브라우저에서 사용되는 인증서 (including cookies, authentications, and certificates)들은 CORS 요청과 함께 전송되지 않는다. Simple 또는 Preflight 둘다. 
IE8 과 IE9 에서 사용하는 XDomainRequest도 마찬가지 이다. 어떤 상황에서도 이러한 자격 증명 데이터를 보낼 수 없습니다.

만약 우리가 접근 가능한 origin 한에서 쿠키 데이터를 전송하고 싶다면, 우리는 간단하게 *Cookie* HTTP header를 CORS 요청에 사용함으로써 쿠키 컨텐츠를 전송할수 있다. (도메인, 만료등의 추가정보 없이) 이것을 Preflight 요청인 OPTIONS 요청에 추가할수 있다. 하지만 필수는 아니다. 응답이 왔을때 서버는 반드시 이 인증의 요청에 대한 받아드리는것과 동의하는것을 *Access-Control-Allow-Credentials* HTTP header로 알려아 한다. 'true' 값으로. 
만약 HTTP header에 이 값을 못받았다면 브라우저는 전체 요청을 실패로 간주하게 된다.

### Implementations

클라이언트 사이드에서의 CORS 요청 실행 예제 이다.

```javascript
// Declare the XMLHttpRequest object
var invocation = new XMLHttpRequest();

// We wish to open a POST method request
invocation.open('POST', 'http://cors.example.com/sendData', true);

// If we set this option, then in-browser credentials (cookies,
// authentication, certificates) will be sent along with the
// request
invocation.withCredentials = true;

// If we set the following two headers, as described previously,
// this will automatically become a CORS Preflight Request, and
// an OPTIONS method pre-flight check request will be done in
// the background, unless a matching one has already been done
// and was within the site's (and browser's) maximum age setting
invocation.setRequestHeader('X-TOKEN-ID', 'aabbccddeeff00112233');
invocation.setRequestHeader('Content-Type', 'application/xml');

// When the response is returned from the server, we must
// process it via a callback function
invocation.onreadystatechange = function(){ … };

// Send the POST content and initiate the request
invocation.send('…');

```

## Final

동일 출신 정책은 월드 와이드 웹의 끊임없이 진화하는 구성입니다. 쿠키의 진화와 함께이를 볼 수 있습니다. 쿠키는 DOM과 JavaScript보다 먼저 만들어 졌으므로 나중에 동일한 동일 출처 정책이 적용되었습니다. 쿠키와 함께 스키마와 포트를 고려하지 않는 일반적인 Same-Origin Policy와는 대조적으로 볼 수 있습니다. JavaScript가 개발 된 후에는 쿠키가 HTTP 헤더를 통해서만 사용할 수 있고 JavaScript 네임 스페이스에서는 사용할 수 없다고 간주되는 httpOnly 플래그가 추가되었습니다. 나중에 TLS 전용 범위 내의 쿠키 문제를 해결하기 위해 추가 된 secureOnly 플래그가 있었습니다.

동일 출처 정책은 클라이언트 측 웹 보안의 중심에 있지만 광범위하고 매우 다양하며 브라우저에서 브라우저로, 기술 구현간에 중요한 세부 사항이 다릅니다. 이해하는 것이 중요한 개념이지만 더 중요한 것은 차이점과 함정을 똑같이 고려해야한다는 것입니다. 개발자 (실제로 보안 엔지니어)가 자신의 요구에 맞는 Same-Origin Policy를 이해하고 적절하게 구현할 때 실제로는 더 풍부한 웹을 만듭니다.

## DNS Rebinding

Same-origin Policy의 기법을 우회할수 있는 방법중 하나로 XMLHttpRequest를 통해서 localhost 또는 다른 도메인 주소의 요청을 전송할수 없으나 이 방법으로 우회할수 있다. 보통 공격해서 정보를 탈취하는데 쓰일수 있다.

간단한 설명은 다음과 같다.

- 공격자는 attack.com (ip: 1.1.1.1) 이라는 도메인을 등록해둔다. 그리고 그 사이트요청에 공격자가 컨트롤 가능한 DNS 서버가 응답하게 만든다.
- 공격자는 DNS 서버의 TTL(TIME TO LIVE) 설정을 짧게 설정한다. 이것은 응답 캐싱을 막기 위해서이다.
- 마지막으로 attack.com 서버를 시작한다.
- 이때 일반 사용자는 본인만 접속할수 있는 custom.com (ip 2.2.2.2) 사이트가 있다고 하자.
- 일반 사용자는 공격자가 만든 웹페이지 (attack.com)에 접속하게 된다. 해당 웹페이지에는 사용자 웹 브라우저에서 돌아가는 자바스크립트를 포함하고 있다.
- 이 스크립트 코드는 같은 도메인인 attack.com 의 attack.com/secret.html 자원을 추가로 다운로드 하도록 만든다.
- 이때, 브라우저는 다시 DNS에게 attack.com 도메인에 대한 요청을 보내게 된다. ( 이유는 TTL을 짧게 설정했기 때문에. )
- 하지만 공격자의 DNS 응답은 새로운 IP를 응답해준다. 여기서 IP는 내가 탈취하고 싶은 IP가 되겠다. ( custom.com 의 IP ,localhost..등등 )
- 그 결과로 사용자는 원하지도 않게 attack.com/secret.html 대신에 custom.com/secret.html 의 자원을 로드하게 된다.
- 로드 된 후에 응답된 데이터를 image.src 같은 곳에 쿼리 스트링으로 넣어서 필요한 데이터를 공격자 서버로 전송시켜 버린다.
- 이게 바로 Same-origin Policy가 bypass 당한것이다.

이러한 문제를 막는 방법으로는 'Host' 헤더가 다른 허용하는 호스트 네임을 지니고 있는지 확인하는 것이다.
서버는 'Host' 헤더에 예기치 않은 호스트 이름이 포함되어 있다면 서버는 요청을 거부해야한다. 다른말로 말하면 'Host'헤더에 대해 적절한 white-listing ('안전'이 증명된 것만을 허용)가 구현되어야합니다.


## 출처 

- [https://savni.tistory.com/entry/DNS-Rebinding%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-Transmission-%EC%B7%A8%EC%95%BD%EC%A0%90-%EB%B6%84%EC%84%9D](https://savni.tistory.com/entry/DNS-Rebinding%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-Transmission-%EC%B7%A8%EC%95%BD%EC%A0%90-%EB%B6%84%EC%84%9D)
- [https://www.netsparker.com/whitepaper-same-origin-policy/#SameOriginPolicyinDetail](https://www.netsparker.com/whitepaper-same-origin-policy/#SameOriginPolicyinDetail)
- [https://blog.gypsyengineer.com/en/security/examples-of-dns-rebinding-attacks.html](https://blog.gypsyengineer.com/en/security/examples-of-dns-rebinding-attacks.html)
- [https://github.com/mpgn/ByP-SOP](https://github.com/mpgn/ByP-SOP)
- [https://www.netsparker.com/blog/web-security/same-site-cookie-attribute-prevent-cross-site-request-forgery/](https://www.netsparker.com/blog/web-security/same-site-cookie-attribute-prevent-cross-site-request-forgery/)
- [https://opentutorials.org/course/3387/21744](https://opentutorials.org/course/3387/21744)
- [https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)

