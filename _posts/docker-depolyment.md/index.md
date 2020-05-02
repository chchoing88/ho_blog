---
title: Docker Depolyment
date: "2018-01-20T10:00:03.284Z"
---


# Docker Depolyment

---
## blue-green 배포 개념
로드발란서를 앞단에 하나를 두고 v1 버젼인 블루(가칭) 라는 앱을 띄운다. 그러다가 나는 v2 버젼인 그린(가칭)을 무중단 방식으로 업데이트를 진행하고 싶다. <br>
그럴때 그린을 로드발란서에 등록을 시킨다. <br>
그러면 블루와 그린을 로드발란싱을 할텐데 그린이 완전히 정상작동을 하였을때 v1 버젼인 블루를 죽이는 방식이다.

## why needs?



![구성](./img_greenBlue.png)

---
## BackEnd Environment
- 노트북 : 맥북
- 도커 호스트 : virtual box ubuntu or mac
- 도커 컨테이너 : node express server , nginx-proxy , mongodb

---
## 폴더 구조

```
├── dockerfile
│   ├── Dockerfile_express      ## express 용 서버 이미지 소스파일
├── template                    ## 템플릿 소스
├── server                      ## 서버소스
│   ├── server.js
├── .dockerignore
├── check.sh                    ## 배포용 sh
├── docker-compose.yml          ## docker 컨테이너들의 환경설정을 모아둔곳 한번에 서버들을 손쉽게 실행시킬 수 있다.
├── package.json                ## app server 컨테이너 안에 들어가 관련 패키지 설치
  
```

---
## Summary

1. 맥북 - virtual box 공유 폴더 구성
2. 폴더 구성 
3. ubuntu 에서 nginx-proxy 이미지 다운
4. ubuntu 에서 node 이미지를 기반으로 express Dockerfile_express 작성 및 빌드
5. docker-compose.yml 작성
6. /etc/hosts 파일 수정
7. check.sh 현재 돌아가는 도커 확인하고 새로운 도커 띄우고 현재 돌아가는 도커 죽이는 쉘 스크립트 작성
8. 테스트

**만약 mac 에서 테스트를 한다면 2번부터 보시면 됩니다.**

---
## procedure

1. 버츄어 박스에 공유 폴더 설정
참고 : [http://theniceguy.tistory.com/13](http://theniceguy.tistory.com/13)

```sh
## 우분투에 공유폴더 마운트 
$ sudo mount --types vboxsf blog_project blog_project
```
- 로컬 blog_project 폴더를 버츄어박스의 blog\_proect 폴더랑 연결
- 버츄어 박스 내의 blog_proect 폴더안에는 도커에서 필요한 소스파일 및 설정파일들이 담겨져 있음.


2. 로드밸런싱을 위한 nginx-proxy 이미지 다운 받기 

```sh
## nginx-proxy 이미지 다운 받기 
$ docker pull jwilder/nginx-proxy 
```

- 사실 여기서 받지 않아도  docker-compose.yml 파일에 설정이 되어있어서 docker-compose up 하면 자동으로 pull을 받게 된다.

- 해당 이미지는 도커 젠을 기반으로 만들어진 nginx-proxy로 로드발란싱의 기능이 있는 nginx applicaion에 도커 젠 기능을 추가 해서 넣은 이미지

- 해당 이미지를 사용하게 되면 도커 젠이 도커 데몬을 바라보고 있다가 컨테이너의 런 , 스탑 등의 이벤트를 감지, 해당 컨테이너 정보를 수집 해서 추가 작업을 할 수 있게 끔 도와준다. 여기서 추가작업은 nginx reverse proxy config 작업을 자동으로 수행할 수 있게 도와준다.

- 여기서 호스트의 docker.sock을 nginx-proxy 내부로 들고가야 하는데 이유는 호스트와 통신을 해야하기 때문이다. 호스트 서버에서 발생되는 도커 데몬의 이벤트를 바라보고 있다가 정보를 잘 받을수 있도록 통신을 해야한다.

- 여기서 nginx-proxy에 등록될 app 들은 VIRTUAL_HOST라는 환경변수를 등록 해야한다.

- nginx 의 가상 호스트 정보는 [https://opentutorials.org/module/384/4529](https://opentutorials.org/module/384/4529) 여길 참조


3. express 도커서버를 위한 도커파일 작성

```dockerfile
## express 를 위한 도커파일
FROM node:alpine
MAINTAINER  merlin@merlin.com

RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN  npm install

EXPOSE 3000

```



4. 도커파일을 express 이미지로 빌드.

```sh

$ docker build -t blog_express:v1 -f ./dockerfile/Dockerfile_express .

```

5. 모아둔 이미지들을 실행할 수 있도록 docker compose 작성

```yml
#docker-compose.yml

version: '3.2'

services:
  app_blue:
    image: blog_express:v1
    depends_on:
      - nginx-proxy
      - mongo-db
    working_dir: /app/
    ports:
      - 8888:3000
    networks: 
      - dbconnection
    environment:
      - VIRTUAL_HOST=nodeapp.local
    volumes:
      - type: bind
        source: ./template
        target: /app/template
      - type: bind
        source: ./server
        target: /app/server
    command: npm start
  
  app_green:
    image: blog_express:v1
    depends_on:
      - nginx-proxy
      - mongo-db
    working_dir: /app/
    networks: 
      - dbconnection
    environment:
      - VIRTUAL_HOST=nodeapp.local
    volumes:
      - type: bind
        source: ./template
        target: /app/template
      - type: bind
        source: ./server
        target: /app/server 
    command: npm start

  nginx-proxy:
    image: jwilder/nginx-proxy
    ports:
      - 8080:80
    networks: 
      - dbconnection
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
  
  mongo-db:
    image: mongo
    ports:
      - 9999:27017
    volumes:
      - db-data:/data/db
    networks: 
      - dbconnection
    command: mongod --dbpath "/data/db" 
    
volumes:
  db-data:

networks: 
  dbconnection:


```

** 브라우저에서 접근할시 VIRTUAL&lowbar;HOST 에 설정했던 이름으로 접근할 것 <br>
nginx 설정에 server_name이 VIRTUAL&lowbar;HOST 에 설정했던 값이 박혀있기에 nginx는 해당 이름으로 접근할때 반응하게 된다. <br>
해서 /etc/hosts 설정은 필수

6. /etc/hosts 파일 수정

```bash
0.0.0.0   nodeapp.local
```


7. 블루-그린 배포를 위한 쉘 스크립트 작성

```sh
#check.sh

#!/bin/sh

EXIST_BLUE=$(docker ps | grep app_blue)

if [ -z "$EXIST_BLUE"]; then
    docker-compose up -d app_blue
    docker-compose stop app_green
    echo "run app_blue!!"
else
    docker-compose up -d app_green
    docker-compose stop app_blue
    echo "run app_green!!"
fi
```

- check.sh 를 작성해서 app&lowbar;blue가 실행했을 경우에는 app&lowbar;green이 실행 후 app&lowbar;blue 를 중지.
- app&lowbar;green 이 실행했을 경우에는 app&lowbar;blue를 실행 후 app&lowbar;green 를 중지.


8. test

```sh
# 처음에는 app_blue를 띄운다.
$ docker-compose up -d app_blue

# 그 다음부턴 무중단으로 .check.sh 를 실행
$ sudo sh check.sh

```


![테스트 결과 화면](./img_developTest.png)
