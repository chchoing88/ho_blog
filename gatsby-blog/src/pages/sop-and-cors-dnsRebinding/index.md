---
title: sop와 cors 그리고 DNS Rebinding
date: "2019-02-27T10:00:03.284Z"
---

# SOP와 cors 그리고 DNS Rebinding

## SOP

영어로 하면 same-origin policy 우리말로 하면 동일 출처 원칙 이라고 한다. 
모든 최신 브라우저는 이 정책을 지원하고있다. 웹 자원들은 같은 프로토콜과 같은 도메인 그리고 같은 포트를 사용한다면 다른 컨텐츠의 자원들에 즉, 속성이나 다른 값어치 있는 것들에 도달할수 있다. 만약 그렇지 않다면 document 속성에 도달하거나 변경하는 작업은 브라우저에 의해 막히게 된다. 

만약 우리가 http://www.example.com/dir/test.html 페이지를 호스팅했다고 상상해보자 이 안에는 다른 웹페이지가 로드된 iframe이 있다고도 생각해보자.
우리의 호스트는 www.example.com 으로 정의되어있다. 아래 테이블은 접근 가능한지 안가능한지를 나타내는 full URLs를 비교해놓았다.

| URL                                    | Result         | Reason                                                             |
|----------------------------------------|----------------|--------------------------------------------------------------------|
| http://www.example.com/dir/page.htm    | Accessible     | Protocol, host and port match                                      |
| http://www.example.com:81/dir/test.htm | Not Accessible | Same protocol and host, but port is different (81)                 |
| https://www.example.com/dir/test.htm   | Not Accessible | Same host, but schema/protocol (https) different                   |
| http://demo.example.com/dir/test.htm   | Not Accessible | Schema and port are same, but host is different (demo.example.com) |
| http://example.com/dir/test.htm        | Not Accessible | Host is different (example.com)                                    |


오늘날 Same-origin Policy는 대게 DOM에만 적용 되는지 알았지만 사실 그게 전부가 아니다 웹의 모든 자원에 대해서 Same-origin Policy의 체크 매커니즘이 적용된다.
쿠키가 그 한 예중에 하나일것이다. 쿠키 도메인, 경로 및 속성이 요청 된 도메인과 일치하는 이벤트에서만 쿠키가 전송되기 때문입니다.동일출처 원칙과의 차이가 있다면 포트와 스키마를 보내기 전에 체크하지는 않는다는 것이다. 

대부분이 알고 있는 Same-origin Policy는 브라우저가 다른 origin의 자원을 로드하는걸 금지한다는 것이다. 


## CORS


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
- 하지만 공격자의 DNS 응답은 새로운 IP를 응답해준다. 내가 탈취하고 싶은 IP가 되겠다. ( custom.com 의 IP ,localhost..등등 )
- 그 결과로 사용자는 원하지도 않게 attack.com/secret.html 대신에 custom.com/secret.html 의 자원을 로드하게 된다. 
- 이게 바로 Same-origin Policy가 bypass 당한것이다. 


이러한 문제를 막는 방법으로는 'Host' 헤더가 다른 허용하는 호스트 네임을 지니고 있는지 확인하는 것이다. 
서버는 'Host' 헤더에 예기치 않은 호스트 이름이 포함되어 있다면 서버는 요청을 거부해야한다. 다른말로 말하면 'Host'헤더에 대해 적절한 white-listing ('안전'이 증명된 것만을 허용)가 구현되어야합니다.


## 출처 

- [https://savni.tistory.com/entry/DNS-Rebinding%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-Transmission-%EC%B7%A8%EC%95%BD%EC%A0%90-%EB%B6%84%EC%84%9D](https://savni.tistory.com/entry/DNS-Rebinding%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-Transmission-%EC%B7%A8%EC%95%BD%EC%A0%90-%EB%B6%84%EC%84%9D)
- [https://www.netsparker.com/whitepaper-same-origin-policy/#SameOriginPolicyinDetail](https://www.netsparker.com/whitepaper-same-origin-policy/#SameOriginPolicyinDetail)
- [https://blog.gypsyengineer.com/en/security/examples-of-dns-rebinding-attacks.html](https://blog.gypsyengineer.com/en/security/examples-of-dns-rebinding-attacks.html)



