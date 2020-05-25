---
title: XXS 와 CSRF
date: '2020-04-30T10:00:03.284Z'
---

## XXS(cross-site scripting)

OWASP라는 단체에서는 다음과 같이 정의를 하고 있습니다.

"Cross-Site Scripting (XSS) 공격은 주입타입의 공격으로 악의적인 스크립트가 다른 신뢰 받는 웹 사이트에 삽입되어 지면서 발생합니다.
공격자가 웹 응용 프로그램을 사용하여 악성 코드를 보낼 때 XSS 공격이 발생합니다. 일반적으로 브라우저 측 스크립트 형태로 다른 최종 사용자에게 제공됩니다.

이러한 공격이 성공할 수있는 결함은 매우 광범위하며 웹 응용 프로그램이 사용자의 입력을 유효성을 검사하지 않거나 인코딩하지 않고 생성 된 출력이 사용하는 모든 곳에서 발생합니다.

공격자는 XSS를 사용하여 의심없는 사용자에게 악의적인 스크립트를 보낼 수 있습니다. 최종 사용자의 브라우저는 스크립트를 신뢰할 수 없다는 것을 알 수 없으며 스크립트를 실행할 것입니다. 스크립트는 신뢰할 수 있는 소스에서 온 것으로 생각하기 때문에 악성 스크립트는 쿠키, 세션 토큰 또는 브라우저가 보유하고 해당 사이트에서 사용하는 기타 민감한 정보에 액세스 할 수 있습니다. 이 스크립트는 HTML 페이지의 내용을 다시 작성할 수도 있습니다."

XXS의 취약점은 애플리케이션이 신뢰할 수 없는 데이터를 가져와 적저한 검증이나 제한 없이 웹브라우저로 보낼 때 발생이 됩니다.

### 가장 일반적인 공격 패턴

1. 게시판에 특정 스크립트를 작성한 뒤 불특정 다수가 보도록 유도
2. 스크립트가 시작하여 열람자의 쿠키 값을 가로챔
3. 가로챈 쿠키 값을 웹 프록시 등을 이용하여 재전송
4. 공격자는 열람자의 정보로 로그인

### 저장 XSS 공격

- 웹 서버에 악성 스크립트를 영구적으로 저장해 놓는 방법입니다.
- 게시판, 사용자 프로필 및 코멘트 필드 등에 악성 스크립트를 심어 놓으면 사용자가 사이트를 방문했을때 사용자 스크립트가 실행되면서 공격합니다.

### 반사 XSS 공격

- 검색 결과, 에러 메시지 등 서버가 외부에서 입력받은 값을 받아 브라우저에게 응답할때 전송하는 과정에서 입력되는 변수의 위험한 문자를 사용자에게 그대로 돌려주면서 발생합니다.
- 사용자가 서버로 입력 한 값을, 서버는 요청한 사용자의 브라우저로 악성스크립트를 반사 시킵니다.
- 즉, 사용자가 악성 스크립트가 포함한 링크를 클릭한 순간 바로 악성 스크립트가 사용자의 브라우저에서 실행됩니다.

요청 URL

```http
http://www.server.com/search/?q<script>alert(document.cookie)</script>&x=0&y=0
```

응답 HTML

```html
<html>
  <body>
    <div>
      Search: "<script>alert(document.cookie)</script>"
    </div>
  </body>
</html>
```

위 응답을 브라우저에서 실행할 경우 alert가 실행이 됩니다.

### DOM 기반 XSS 공격

- W3C9에서는 DOM을 ‘프로그램 및 스크립트가 문서의 컨텐츠, 구조 및 형식을 동적으로 접근 및 업데이트할 수 있도록 하는 언어 중립적인 인터페이스이다’라고 정의되어 있습니다. 따라서 DOM은 HTML 문서를 계층적으로 보면서 컨텐츠를 동적으로 변경할 수 있다.
- 피해자의 브라우저가 HTML 페이지를 구문 분석할 때마다 공격 스크립트가 DOM 생성의 일부로 실행되면서 공격합니다.
- 페이지 자체는 변하지 않으나, 페이지에 포함되어 있는 브라우저측 코드가 DOM 환경에서 악성코드로 실행됩니다.
- 저장 XSS 및 반사 XSS 공격의 악성 페이로드가 서버 측 애플리케이션 취약점으로 인해, 응답 페이지에 악성 스크립트가 포함되면서 공격하는것인 반면, DOM 기반은 XSS는 서버와 관계없이 브라우저에서 발생하는 것이 차이점 입니다.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>

  <script>
    var pos = document.URL.indexOf("name=") + 5;
    document.write(document.URL.substring(pos, document.URL.length));
  </script>
</body>

</html>
```

위 페이지에서 name 변수에 다음과 같이 변수를 입력하면

```http
http://www.server.com/page.html?name=merlin
```

정상적으로 동작합니다. 하지만 DOM 기반 XSS 공격을 위해서 다음과 같이 입력하면 브라우저에서 script 의 내용이 실행되게 됩니다.

```http
http://www.server.com/page.html?name=<script>alert(document.cookie)</script>
```

모던 브라우저에서는 주소줄에 `<` `>` 는 인코딩되서 표현되기 때문에 실행이 되지 않습니다.

### 그 외 방법

- DOM의 이벤트 속성을 사용하는 방법

```html
<img src="#" onerror="alert('XSS')">
```

- 자바스크립트 링크 및 내용 난독화 (HTML 인코드한 태그를 삽입하여 자바스크립트 실행)

```html
<a href="javascript:alert('XSS')"> XSS </a>

<a href="&#x6A;&#x61;&#x76;&#x61;&#x73;&#xA;&#x63;&#x72;&#x69;&#x70;&#x74;&#xA;&#x3A;&#xA;&#x61;&#x6C;&#x65;&#x72;&#x74;&#xA;&#x28;&#x27;&#x58;&#x53;&#x53;&#x27;&#x29;">XSS</a>
```

## CSRF(Cross-Site Request Forgery)

CSRF (Cross-Site Request Forgery)는 최종 사용자가 현재 인증 된 웹 응용 프로그램에서 원치 않는 동작을 실행하도록 하는 공격입니다.
CSRF 공격은 공격자가 위조 된 요청에 대한 응답을 볼 수 있는 방법이 없기 때문에 데이터 도난이 아닌 상태 변경 요청을 대상으로 합니다.

공격자는 전자 메일이나 채팅을 통해 링크를 보내는 등의 사회 공학의 도움을 받아 웹 응용 프로그램 사용자가 자신이 선택한 작업을 실행하도록 속일 수 있습니다.
피해자가 일반 사용자 인 경우 CSRF 공격이 성공하면 사용자는 자금 이체, 전자 메일 주소 변경 등과 같은 상태 변경 요청을 수행 할 수 있습니다. 피해자가 관리 계정 인 경우 CSRF는 전체 웹 응용 프로그램을 손상시킬 수 있습니다.

즉, A 라는 사용자가 example.com에 로그인 된 채로 (유효한 session id를 쿠키로 가지고 있는) 있다면 B(악당) 이 `<img src=http://example.com/api/logout />` 이러한 페이지를 A 라는 사용자에게 넘겨서 A 사용자가 보게 된다면 example로 요청이 들어갈때 session id 쿠키와 함께 요청이 들어간다. 그러면 유효한 요청이 되어서 A 사용자도 모르게 로그아웃이 되는 것이다.  여기서는 단순 로그아웃 요청이지만 이 요청은 악의적인 데이터 수집, 수정, 삭제가 될 수 있습니다.

CSRF는 피해자가 악의적인 요청을 제출하도록 속이는 공격입니다. 피해자를 대신하여 원하지 않는 기능을 수행하기 위해 피해자의 신분과 특권을 상속합니다. 대부분의 사이트에서 브라우저 요청에는 사용자 세션 쿠키, IP 주소, Windows 도메인 자격 증명 등 사이트와 관련된 자격 증명이 자동으로 포함됩니다. 따라서 사용자가 현재 사이트에 인증 된 경우 사이트는 피해자가 보낸 위조 된 요청과 피해자가 보낸 합법적 인 요청을 구분할 방법이 없습니다.

CSRF 공격은 대상의 전자 메일 주소 또는 암호 변경 또는 무언가 구매와 같이 서버에서 상태를 변경하는 기능을 대상으로합니다. 공격자가 응답을받지 않기 때문에 피해자가 데이터를 검색하도록 강요해도 공격자에게 도움이되지 않습니다. 따라서 CSRF 공격은 상태 변경 요청을 대상으로합니다.

취약한 사이트 자체에 CSRF 공격을 저장하는 것이 때때로 가능합니다. 이러한 취약점을 "저장된 CSRF 결함"이라고합니다. HTML을 허용하는 필드에 IMG 또는 IFRAME 태그를 저장하거나보다 복잡한 사이트 간 스크립팅 공격을 수행하면됩니다. 공격이 사이트에 CSRF 공격을 저장할 수 있으면 공격의 심각성이 증폭됩니다. 특히, 피해자가 인터넷의 임의의 임의 페이지보다 공격이 포함 된 페이지를 볼 가능성이 높기 때문에 가능성이 높아집니다. 피해자가 이미 사이트에서 인증을 받았기 때문에 가능성도 높아집니다.

### GET 시나리오 예제

어플리케이션에서 주로 GET 요청을 사용하여 어떤 액션을 취하게끔 한다고 한다면 다음과 같은 요청으로 송금을 할 수 있습니다.

```http
GET http://bank.com/transfer.do?acct=BOB&amount=100 HTTP/1.1
```

이제 Maria(Attacker)가 Alice 계정에서 100,000원을 자신의 계정으로 이체할 URL을 구성할 수 있습니다.

```http
GET http://bank.com/transfer.do?acct=MARIA&amount=100000
```

이제 Alice가 은행 응용 프로그램에 로그인을 할 때 이 URL을 로드하도록 속여야 합니다.

- 원치 않는 HTML 컨텐츠가 담긴 이메일
- 온라인 뱅킹을하는 동안 피해자가 방문 할 가능성이있는 페이지에 익스플로잇 URL 또는 스크립트를 심기

익스플로잇 URL은 일반 링크로 위장하여 피해자가 클릭하도록 권장합니다.

```html
<a href="http://bank.com/transfer.do?acct=MARIA&amount=100000">View my Pictures!</a>
```

또는 0x0 가짜 이미지로 :

```html
<img src="http://bank.com/transfer.do?acct=MARIA&amount=100000" width="0" height="0" border="0">
```

이 이미지 태그가 이메일에 포함 된 경우 Alice는 아무것도 볼 수 없습니다. 
그러나 브라우저 는 전송이 이루어 졌음을 시각적으로 표시하지 않고 bank.com에 요청을 계속 제출합니다.

### POST 시나리오 예제

GET과 POST 공격의 유일한 차이점은 피해자가 공격을 실행하는 방법입니다. 은행에서 현재 POST를 사용하고 취약한 요청이 다음과 같이 가정합니다.

```http
POST http://bank.com/transfer.do HTTP/1.1

acct=BOB&amount=100
```

이러한 요청은 표준 A 또는 IMG 태그를 사용하여 전달할 수 없지만 FORM 태그를 사용하여 전달할 수 있습니다.

```html
<form action="http://bank.com/transfer.do" method="POST">

<input type="hidden" name="acct" value="MARIA"/>
<input type="hidden" name="amount" value="100000"/>
<input type="submit" value="View my pictures"/>

</form>
```

이 양식을 사용하려면 제출 버튼을 클릭해야하지만 JavaScript를 사용하여 자동으로 실행할 수도 있습니다.

```html
<body onload="document.forms[0].submit()">

<form></form>
```

### 다른 HTTP 메소드 시나리오

최신 웹 애플리케이션 API는 PUT 또는 DELETE와 같은 다른 HTTP 메소드를 자주 사용합니다. 취약한 은행이 JSON 블록을 인수로 취하는 PUT을 사용한다고 가정 해 봅시다.

```http
PUT http://bank.com/transfer.do HTTP/1.1

{ "acct":"BOB", "amount":100 }
```

이러한 요청은 익스플로잇 페이지에 임베드 된 JavaScript로 실행될 수 있습니다.

```html
<script>
function put() {
    var x = new XMLHttpRequest();
    x.open("PUT","http://bank.com/transfer.do",true);
    x.setRequestHeader("Content-Type", "application/json");
    x.send(JSON.stringify({"acct":"BOB", "amount":100})); 
}
</script>

<body onload="put()">
```

다행스럽게도이 요청은 동일한 출처 정책 제한으로 인해 최신 웹 브라우저에서 실행 되지 않습니다. 이 제한은 대상 웹 사이트가 다음 헤더와 함께 CORS 를 사용하여 공격자 (또는 모든 사람)의 출처에서 교차 출처 요청을 명시 적으로 열지 않는 한 기본적으로 사용됩니다.

### CSRF 보안 (JWT 토큰 사용시)

- 토큰을 쿠키에 심어 두고 httpOnly, secure 를 설정해 두면 XXS 취약에 대비 할 수 있습니다.
- 헤더에 허용한 referer 인지 확인 ( 요청한 쪽에서 referer 가 없을 경우 위험 )
- GET 메서드 등에서 데이터 위 변조 되지 않게 처리
- CSRF 방지 토큰 ( 로그인시 CSRF 토큰 받아서 요청 header 로 전송, CSRF 토큰은 javascript에서 접근 : localstorage 저장(?) )
- CSRF 토큰 유효 && 쿠키로 넘기는 accessToken 유효 시 허용

## 출처

- [https://owasp.org/www-community/attacks/csrf](https://owasp.org/www-community/attacks/csrf)
- [https://owasp.org/www-community/attacks/xss/](https://owasp.org/www-community/attacks/xss/)
