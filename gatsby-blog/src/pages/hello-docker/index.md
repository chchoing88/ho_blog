---
title: Hello Docker
date: "2018-01-09T10:00:03.284Z"
---
## Docker 용어
### What is Docker?

- 소프트웨어를 containerization(컨테이너화) 한 플랫폼. ( 웹서비스 컨테이너 , 디비 컨테이너 따로 담는다고 하면 서로 isolation 화 할수 있고 서로 독립적인 공간을 가질수 있다. 서로에게 영향을 주지 않을수 있다. )
- containerization 란 컨테이너를 매체로 한 수송체계, 즉. 컨테이너 규격을 맞춰 놓으면 차 , 배 , 비행기등 더 쉽고 빠르게 대량 수송과 시간을 단축 시킬수 있다. 라는 장점을 지니고 있음.
- 이걸로 유추해볼 때 도커는 다양한 SW들을 컨테이너에 담아 이동하기가 쉽게하고 포터블하게 만들수있는 플랫폼.
- 리눅스의 응용프로그램들을 소프트웨어 컨테이너 안에 배치시키는 일을 자동화 하는 오픈소스

### What is Container?

- 개발 , 배포 , 운용 등을 위해 표준화된 단위로 구성된 소프트웨어 패키지화 
- 호스트 pc의 커널을 공유하면서 SW가 돌아갈수 있는 모든 구성들이 들어가있다. 대신, 불필요한 것들은 들어있지 않다.
- 해당 도커 이미지를 run 시키면 해당 SW가 돌아가는데 그 상태를 컨테이너 라고 한다.
일종의 프로세스와 유사한 개념이다.
- 이 해당 컨테이너 내부 환경을 정의하는 파일은 dockerfile 이다.
- 나머지 시스템으로 부터 완전히 독립된 공간을 갖는다. 그래서 밖으로 통신하기 위해선 포트를 맵핑해야 한다.

### What is Service?

- 서비스는 app의 한 부분이다. 예를 들어 비디오를 공유하는 사이트는 데이타 베이스에 app data를 저장하는 서비스, 비디오 업로드 후 transcoding 하는 서비스 등등..
- 서비스들은 실제로 production의 컨테이너들로 구성된다.
- 하나의 서비스는 하나의 이미지만 실행하지만 그 이미지를 실행하는 방법을 쳬계화 할 수 있습니다. 그 체계화는 docker-compose.yml 파일에서 설정 할 수 있다. 
- docker-compose.yml 파일에서는 어떤 포트를 사용해야하는지, 서비스가 가져가야 할 필요한 용량에 따라 얼마나 많은 복제 컨테이너를 실행시켜야 하는지, 서비스를 위해 얼마나 컴퓨팅 리소스를 할당할지를 설정 할 수 있다.
- docker-compose.yml 을 이용 하면 이미지를 일일이 다 run 시키지 않아도 된다. 


### What is Image?

- 도커 이미지란 서비스의 필요한 프로그램 , 라이브러리, 소스등을 설치한 뒤에 이를 파일로 만든 것이다. 쉽게 실행파일이라고 생각하면 된다.
- 이미지를 만들기위해 dockerfile에 필요한 명령들을 설정해 놓는다.
- 이미지는 base image 와 parent image 로 나뉜다.
- base image 는 parent image가 없는 이미지를 말한다.
- parent image 는 사용하는 이미지의 Dockerfile 내에 FROM 으로 지시되는 이미지이다. 만약 Dockerfile 내에 FROM 이 지시되어있지 않다면 부모 이미지가 없는것이고 이는 곧 base image 가 된다.
- Dockerfile로 이미지를 만들때는 전에 만들었던 이미지 캐시를 잘 이용해야 한다. 기존 방식은 한줄 한줄 실행하면서 <br><b>임시 컨테이너 생성 > 명령어 수행 > 이미지 저장 > 임시 컨테이너 삭제 > 새로 만든 이미지 기반 임시 컨테이너 생성 > 명령어 수행 > 이미지로 저장 > 임시 컨테이너 삭제...</b> 이런식으로 수행....


----> {해쉬아이디} : 이미지 저장 <br>
----> Running in {해쉬아이디} : 명령어를 수행하기 위해 그 전 이미지 기반으로 임시 컨테이너 생성

< 처음 Dockerfile 돌렸을때 >

![처음 Dockerfile 돌렸을때](./img_build_init.png)

< 기존 Dockerfile을 2번째 돌렸을때 >

![기존 Dockerfile을 2번째 돌렸을때](./img_build_before.png)

< 기존 Dockerfile 에서 EXPOSE 80 에서 EXPOSE 81로 변경했을 때 >

![기존 Dockerfile 에서 EXPOSE 80 에서 EXPOSE 81로 변경했을 때](./img_build_after.png)

- 이미지 생성시 FROM에 적어둔 parent image기반으로 변경사항만 따로 저장되는게 장점. vm 처럼 용량을 많이 먹지 않음. <br>
따라서 parent image 기반으로 새로운 이미지를 만들고 parent image 를 삭제하려고 했을때 에러 뜸.

![error](./img_parent_error.png)

### What is Stack?

## Docker Structure
![Docker Structure](./img_structure.png)

*출처 : [http://www.leafcats.com/146](http://www.leafcats.com/146)*


## Docker Install

## Docker with nginx , express , mongo

## Docker build

## Docker distribute

## Docker network




