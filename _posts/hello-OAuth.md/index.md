---
title: OAuth 2.0
date: "2020-03-16T10:00:03.284Z"
---

## 동기

OAuth 2.0의 절차를 글로 정리해 두자.
다음 글은 생활코딩 에서 알려주신 OAuth 2.0 을 정리한 것입니다.

## 역할

- Resource Owner : User 사용자 - 우리의 서비스를 이용하는 사용자 및 구글,페이스북 등의 서비스도 함께 이용하는 사용자.
- Client : 우리의 서비스
- Resource Server(Authorization Server) : 우리의 서비스가 제어하고자 하는 자원, 우리의 서비스가 연동하려는 User의 서비스들 (ex. google, facebook)

## Resource Server 등록

- Client는 Resource Server에 우리 Client를 등록하게 됩니다. 이때 service 이름과 redirect_url을 입력 후 등록을 하면 Resource Server는 client_id, client_secret, redirect_url을 알려줍니다.

## Access Token의 발급

1. Resource Owner 는 Client 인 우리 서비스에 접속합니다. (이때, 우리 서비스는 Resource Server를 연동하는 서비스입니다.)
사용자가 나의 서비스에 와서 글을 남겼다. -> 구글 캘린더에 표시를 하던가 페이스북에 "글을 썼다" 또는 "글을 보았다" 등을 공유

2. Client 는 "Login with Facebook, Login with Google" 등의 버튼을 보여줍니다. 이때, Resource Server의 B,C 기능을 이용하겠다고 가정합니다. 이 버튼의 링크는 다음과 같습니다.
`https://resource.server/?client_id=1&scope=B,C&redirect_url=http://slient/callback` 여기서 redirect_url은 Client 에서 미리 구축해두고 있어야 합니다.

3. 위 버튼을 눌러 Resource Server에 접속이 되면 Resource Server은 Resource Owner에게 로그인 하라는 페이지를 보여주게 됩니다.

4. Resource Owner가 로그인을 하게 됩니다.

5. Resource Server는 이제 아까 url의 쿼리스트링과 Resource Server가 보유한 client_id와 redirect_url이 같은지 비교합니다.

6. 같다면 다시 Resource Server는 Resource Owner 에게 해당 Client 서비스에게 B,C 기능을 열어주겠냐는 페이지를 보여줍니다.

7. Resource Owner가 허용을 하게 되면 Resource Server는 authorization code(3 이라 칩시다)를 만들어 Resource Owner의 브라우저에게 다음과 같은 주소로 redirection 합니다.
`https://client/callback?code=3`

8. Client에서 `code=3` 이라는 정보를 받게 되면 authorization code = 3 을 생성하게 됩니다.

9. Client에서는 다음과 같은 url로 Resource Server에 Access Token 을 요청 하게 됩니다.
`https://resource.server/token?grant_type=authorization_code&code=3&redirect_url=https://client/callback&client_id=1&client_secret=2`

10. Resource Server는 임시 비밀번호인 authorization code 와 client_id, client_secret, redirect_url을 확인해서 accesss_token을 만들어서 Client에 발급시켜 줍니다.

## Refresh Token의 발급

- access_token 에게는 수명이 있습니다. 이때 손쉽게 access_token을 다시 발급 받을 수 있는 방법이 refresh_token 입니다.
- 보통은 access_token을 발급할때, refresh_token을 발급해 줍니다.
- 수명이 끝난 access_token으로 API를 호출하게 되면 invalid 한 응답을 주게 됩니다.
- access_token이 수명이 다하면 Authorization Server에 전달하면 access_token을 다시 발급해 주게 됩니다.
- 예를 들어 구글의 경우에는 구글 API의 post 방식으로 `client_id`,`client_secret`,`refresh_token`,`grant_type=refresh_token` 정보를 넘겨주면 다시 access_token을 발급 해 주게 됩니다.

## API 활용

- 쿼리 스트링 : <API주소>/?access_token=<access_token>
- request header : Authorization: Bearer <access_token>

## 참고

[https://www.youtube.com/playlist?list=PLuHgQVnccGMA4guyznDlykFJh28_R08Q-](https://www.youtube.com/playlist?list=PLuHgQVnccGMA4guyznDlykFJh28_R08Q-)