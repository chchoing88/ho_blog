---
title: hello-iScroll
date: "2020-04-04T10:00:03.284Z"
---

가로 스크롤 구현을 위해 react + typescript + iscroll 썼던 느낀점을 정리하고자 합니다.

## 1. iscroll + typescript

첫번째로 맞닥뜨린 문제는 iscroll의 type의 정의가 제대로 안되어 있다는 점이 였습니다.
[https://www.npmjs.com/package/@types/iscroll](https://www.npmjs.com/package/@types/iscroll) 과 같이 타입이 존재합니다.

하지만 그 타입이 제대로 정의 되어 있지 않습니다.

따라서 `import IScroll from "iscroll";` 로 모듈을 `import` 할 시에 모듈이 아니라는 에러가 나게 됩니다.

이는 `@types/iscroll` 에 `export` 구문이 보이지 않아서 모듈로 인식을 못하고 있는 것처럼 보였습니다.
(추측이지만 모듈로써 사용하기 보단 script 태그 방식으로 사용하도록 타입이 설계 되어 있는 거 같습니다.)

하여 폭풍 검색해보니 [https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18554](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18554) 이런 글을 만났었습니다.

해서 `/src/types/iscroll.d.ts` 파일에 해당 문구를 넣어주었습니다. 참고로 typescript config시 `"baseUrl": "./src"` 를 추가했었습니다.

그리고 실행하면 에러가 사라집니다.

## 2. iscroll 위치 조정

새로 고침시 url에 따른 처음 스크롤 위치 조정 또는 탭(메뉴)를 클릭시 클릭한 메뉴가 가운데 오도록 하게 스크롤의 위치를 움직일 필요가 있었다.

정리하면 다음과 같다.

1. 새로고침시 해당되는 메뉴가 가운데 오도록 해야한다.
2. 메뉴 클릭시 클릭당한 메뉴가 가운데 오도록 해야한다.

1번의 경우에는 iscroll 인스턴스를 생성하기 전에 미리 위치를 계산해서 option 값으로 `startX` 값을 넣는 방식이 가장 좋아 보였습니다.

2번의 경우에는 메뉴 클릭시 해당 위치 값을 계산해서 iscroll의 `scrollTo` 메서드를 사용하도록 했습니다.

여기서 중요한것은 어느 상황에서나 미리 움직여야 할 위치 값을 구하는것이 중요했습니다.

준비할 수 있는 값은 두가지 였습니다.

1. 가로 스크롤을 감싸고 있는 wrapper element
2. 타게팅이 되는 메뉴 리스트의 index 값

힌트가 되는 값들을 가지고 내가 움직여야 할 위치를 구하는 코드는 다음과 같습니다.

```typescript
export function scrollMoveTo(
  wrapperElement: HTMLDivElement,
  currentIndex: number
) {
  let startX = 0;

  if (currentIndex > -1) {
    const wrapperWidth = wrapperElement.offsetWidth;
    const wrapperMidPos = wrapperWidth / 2;
    const wrapperLeftOffset = wrapperElement.offsetLeft;

    const $elemCurrentMenu = wrapperElement.children[0].children[
      currentIndex
    ] as HTMLLIElement; // div > ul > li를 구하기 위해서...
    // 여기에 if 분기를 추가하면 더 좋을 듯 싶습니다.
    const $elemMenuWrapperWidth = (wrapperElement
      .children[0] as HTMLUListElement).offsetWidth;
    const currenttMidWidth = $elemCurrentMenu.offsetWidth / 2;
    const currentLeftOffset = $elemCurrentMenu.offsetLeft;
    const maxWidth = $elemMenuWrapperWidth - wrapperWidth;

    startX =
      wrapperLeftOffset - currentLeftOffset + wrapperMidPos - currenttMidWidth;

    if (startX > 0) {
      startX = 0;
    } else if (startX < -maxWidth) {
      startX = -maxWidth;
    }
  }

  return startX;
}
```

코드에서 계산하는 것은 다음과 같습니다.

1. wrapper element의 가운데 위치를 구합니다.
2. wrapper의 children에서 해당 index의 element를 구합니다. (target element)
3. wrapper element 의 offset left 값과 target element 의 offset left 의 차이를 구합니다. (wrapper element에서 부터 target element가 얼마만큼 떨어져 있는지 알기 위해서)
4. wrapper element의 중간 값에 target element left 값이 얼마만큼 다가가야 하는지 구합니다.
5. targetl element의 width의 반값 만큼 다시 이동을 시켜줍니다.

## 커스텀 훅

iscroll을 관리 하는 커스텀 훅을 만들어 보았습니다.

```typescript
import React, { useEffect, useRef } from "react";
import IScroll from "iscroll";
import { scrollMoveTo } from "utils";

function useIScroll(
  ref: React.RefObject<HTMLDivElement>,
  currentIndex: number
) {
  const iScroll = useRef<IScroll | null>(null);
  const initIndex = useRef<number>(currentIndex);

  useEffect(() => {
    if (!iScroll.current) {
      // wrapper width
      // console.dir(ref.current);
      if (ref.current) {
        const wrapperElement = ref.current;
        const wrapperId = wrapperElement.id;

        const startX = scrollMoveTo(wrapperElement, initIndex.current);

        iScroll.current = new IScroll(`#${wrapperId}`, {
          scrollX: true,
          startX,
          scrollY: false,
          disablePointer: true,
          disableTouch: false,
          disableMouse: false,
          preventDefault: false
        });
      }
    }

    return () => {
      if (iScroll.current) {
        iScroll.current.destroy();
        iScroll.current = null;
      }
    };
  }, [ref]);

  return iScroll.current;
}

export default useIScroll;
```

위 코드에서 주의 할 점은 `useEffect` 시에 `new IScroll` 가 마운트시에 한번만 호출 할 수 있도록 변하는 값 (여기서는 `currentIndex`) 을 useEffect의 디펜던시로 넣어 두면 안된다는 점이였습니다.

그래서 `currentIndex` 값을 받아서 `useRef` 로 초반 값으로 넣어두고 변하지 않도록 처리 했습니다.
