---
title: node stream 에 관하여
date: "2020-06-05T10:00:03.284Z"
---

gulp 플러그인을 만들기 위한 사전 작업으로 node의 stream 공부한걸 정리 해보았습니다. 잘못 된 부분이 있을시 피드백 부탁드립니다.

## Stream

스트리밍 데이터 작업을 위한 인터페이스 입니다. 즉, 한곳에서 다른 곳으로 데이터가 흐를 수 있게 만들어주는 통로라고 생각하면 됩니다.

node.js 에는 스트림 타입이 있습니다.

- `Writable`: streams to which data can be written (for example, fs.createWriteStream()).
- `Readable`: streams from which data can be read (for example, fs.createReadStream()).
- `Duplex`: streams that are both Readable and Writable (for example, net.Socket).
- `Transform`: Duplex streams that can modify or transform the data as it is written and read (for example, zlib.createDeflate()).

### Object mode

Node.js API로 작성된 모든 스트림은 문자열 및 버퍼 (또는 Uint8Array) 오브젝트에서만 독점적으로 작동합니다. 그러나 스트림 구현이 다른 유형의 JavaScript 값과 함께 작동 할 수 있습니다 (스트림을 특수 목적으로하는 null 제외). 이러한 스트림은 "개체 모드"에서 작동하는 것으로 간주됩니다.

스트림이 작성 될 때 objectMode 옵션을 사용하여 스트림 인스턴스가 오브젝트 모드로 전환됩니다. 기존 스트림을 객체 모드로 전환하는 것은 안전하지 않습니다.

## Readable Stream

readable 스트림은 2가지 작업 모드를 지원합니다. 기본적으로는 paused 모드를 default 모드로 하고 있습니다. 이 둘의 모드는 언제든 바뀔 수 있습니다.

- `flowing` : flowing 모드는 push 모드라고 합니다.
- `paused` : paused 모드는 pull 모드라고 합니다.

`flowing` 모드에서는 기본 시스템에서 데이터를 자동으로 읽고 EventEmitter 인터페이스를 통해 이벤트를 사용하여 가능한 한 빨리 응용 프로그램에 제공합니다.

`pause` 모드에서는 `stream.read()` 메소드를 명시 적으로 호출하여 스트림에서 데이터 청크를 읽습니다.

그리고 `writable` 스트림에 연결 됩니다.

`push` 모드의 장점은 `consumer` 가 데이터를 가져오는 코드를 컨트롤 하지 않고 데이터 소비하는 관점에서만 생각하면 된다는 것입니다. 단점은 `source` 측이 데이터 생산 속도가 `consumer` 데이터 처리 속도보다 빠를 때 문제가 생깁니다.

`paused` 모드의 장점은 `consumer` 의 데이터 처리 속도에 맞춰서 `source` 데이터를 가져올 수 있다는 것이지만 단점은 `consumer` 가 `source` 데이터 생산 동안 기다려야 하고 반대로 `consumer` 가 데이터를 처리 하고 있는 동안엔 `source` 데이터를 가져올 수 없으므로 `waiting` 시간이 많아 진다는 것입니다.

위 같은 장단점을 보완하기 위해선 버퍼가 필요합니다.

## Buffer

버퍼는 `consumer` 와 `source` 데이터의 처리 속도의 차이로 인해 생겨난 것입니다.
버퍼가 없는 상황에서 실제로 `consumer` 는 `source` 데이터 처리 속도 직접적으로 제어 하긴 힘듭니다.

따라서 스트림에 버퍼를 하나 두어 `source` 에 빠른 데이터 처리에 임시로 저장 해두는 공간을 마련해 둡니다.
`consumer` 쪽은 `source` 속도와 상관없이 버퍼에 있는 데이터를 가져다 쓰면 되는 것입니다.

이때, `soucre` 속도 보다 `consumer` 속도가 빠르게 되면 `buffering` ( 데이터 수집중.. ) 이라는 현상이 발생하는 것입니다.

**source — push (일단 던지고) —> buffer에 쌓이고 —> pull(내가 원할 때 받고) —> consumer**

`source` 데이터가 `push`를 지속적으로 하면 buffer는 무한정 늘어 날 가능성이 있다. 이때를 대비해서 `backpressure` 기법을 사용한다. ( `highWaterMark` 속성을 사용해서 버퍼의 데이터 양을 조절 )

`buffer`가 꽉 찼을 때는 `pause`를 통해 `source`가 데이터 생산을 잠시 중단하고, 버퍼가 `drain` 되었을 때( 다시 쓸 준비가 되었을 때 ) 는 `resume` 을 통해 `source`가 데이터 생산을 재개하게 만들어 준다.

nodejs는 외부 자원(http, fs) 에서 쏟아지는 데이터 양(push : 일방적으로 보내는)을 조절하기 위해 다음과 같은 일을 `pipe` 에서 진행 해줍니다.

- `consumer` 가 원할 때 `source` 데이터를 `push` 해준다. ( 즉, `consumer`가 데이터를 달라고 요청 )
- 쓰는 스트림의 버퍼 양에 따라서 `source` 데이터를 `pause/resume` 해준다.
- `resume` 되면 `flowing` 읽기 모드
- `pause` 되면 `pause` 읽기 모드

## 관련 스트림 이벤트

- `readable 이벤트` : 스트림에서 읽을 수 있는 데이터가 있을때 발생한다. 또한 이벤트 end 가 발생되기 전 스트림의 끝에 다 달았을 때도 한번 발생한다.

- `drain 이벤트` : 쓰기 스트림의 `stream.write(chunk)` 를 호출해서 `false` 가 리턴이 되면, 다시 스트림에 데이터를 쓸 적절한 시기 때 이벤트가 발생된다.

## 참고

- [https://iximiuz.com/en/posts/nodejs-readable-streams-distilled/](https://iximiuz.com/en/posts/nodejs-readable-streams-distilled/)
- [https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7](https://medium.com/@jayphelps/backpressure-explained-the-flow-of-data-through-software-2350b3e77ce7)
- [http://jeonghwan-kim.github.io/node/2017/08/12/node-stream-you-need-to-know-3.html#%EC%93%B0%EA%B8%B0-%EC%8A%A4%ED%8A%B8%EB%A6%BC-%EB%A7%8C%EB%93%A4%EA%B8%B0](http://jeonghwan-kim.github.io/node/2017/08/12/node-stream-you-need-to-know-3.html#%EC%93%B0%EA%B8%B0-%EC%8A%A4%ED%8A%B8%EB%A6%BC-%EB%A7%8C%EB%93%A4%EA%B8%B0)
