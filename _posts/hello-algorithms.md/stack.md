---
title: '[algorithms] Stack'
date: '2020-03-27T10:00:03.284Z'
---

## 스택의 동작

- 스택은 리스트의 한쪽 긑으로만 요소에 접근할 수 있다.
- 구내식당에 쌓아놓은 쟁반을 스택에 비유할 수 있다.
- 스택은 후입선출(Last-in, First-out) 자료 구조로 알려져 있다.
- 스택의 탑에 있지 않은 요소에는 접근할 수 있다.
- 스택의 밑바닥에 있는 요소에 접근하려면 모든 요소를 제거하는 수밖에 없다.
- push 동작을 이용해 스택에 추가, pop 동작을 이용해 스택에서 요소를 꺼낼 수 있다.
- peak 을 이용하면 스택에 탑에 있는 요소를 제거하지 않고 내용만 확인할 수 있다.
- clear 는 스택에 모든 요소를 삭제한다.

## 재귀

- 재귀를 구현할 때는 스택을 사용합니다.
- 함수를 호출할 때마다 함수에 필요한 많은 변수의 사본이 메모리에 보관된다. 이 메모리가 스택이다.
- 함수를 재귀 적으로 호출하면 이러한 모든 변수의 다른 사본이 메모리에 저장되고 그 다음에 계속 저장된다.

```javascript
function factorial(N){
  return N<=1? 1 : N * factorial(N-1);
}
```

## 스택 구현

```typescript
class Stack<T> {
  dataStore: T[];
  top: number;

  constructor() {
    this.dataStore = [];
    this.top = 0;
  }

  push(element: T) {
    this.dataStore[class Stack<T> {
  dataStore: T[];
  top: number;

  constructor(dataStore?: T[]) {
    this.dataStore = dataStore || [];
    this.top = 0;
  }

  push(element: T) {
    this.dataStore[this.top] = element;
    this.top = this.top + 1;
  }

  // top을 변화시킴, 영구적으로 내보낸다.
  pop() {
    const topElement = this.dataStore.splice(this.top - 1, 1)[0];
    this.top = this.top - 1;
    return topElement;
  }

  peek() {
    return this.dataStore[this.top - 1];
  }

  clear() {
    this.dataStore = [];
    this.top = 0;
  }

  length() {
    return this.dataStore.length;
  }
}
```

## 예제

1. 수식을 인자로 받아 수식에 열거나 닫는 괄호가 없을 때 false를 반환하는 함수를 구현하시오 닫는 괄호가 다 정상적일땐 true 리턴하자. 예를 들어 '2.3 + 23 / 12 + (3.14159 * 0.24' 에는 닫는 괄호가 없다.

```typescript
function mathematicalLint(express: string) {
  // 문자열로 된 수식을 배열로 쪼갠다. (기준을 띄어쓰기로? 아니면 문자 하나하나로?)
  // 검증을 stack으로
  // 괄호가 있는지 없는지는 regexp로?
  // '(' 를 만나면 stack에 push ')' 를 만나면 스택확인, 쌍이 맞는지 확인, 그후 pop
  // 최종적으로 stack이 비어야 닫는 괄호가 정상이다.
  let result = true;
  const verificationStack = new Stack<string>();
  const splitExpress = express.split("");

  const length = splitExpress.length;

  // O(n)
  for (let i = 0; i < length; i++) {
    if (splitExpress[i] === "(") {
      verificationStack.push(splitExpress[i]); // 여는 괄호를 만나면 닫는 괄호를 만나야지 pop이 이뤄진다.
    }

    if (splitExpress[i] === ")") {
      // 스택이 비어 있다면
      if (verificationStack.length() === 0) {
        verificationStack.push(splitExpress[i]);
        break;
      }

      if (verificationStack.peek() === "(") {
        // 쌍이 맞는지 확인
        verificationStack.pop();
      }
    }
  }
  console.log("verificationStack", verificationStack);
  return verificationStack.length() === 0;
```

2. 우리 주변의 페즈 디스펜서(사탕을 한 알씩 배출해주는 장치)는 스택과 같은 방식으로 동작한다 페즈 디스펜서에 빨간색, 노란색, 흰색 사탕이 섞여 있는데 노란색 사탕은 우리가 싫어하는 맛이다. 스택(한개 이상의 스택을 사용할 수 있다) 을 이용해 디스펜서의 다른 사탕 순서는 바꾸지 말고 노란색 사탕만 제거하는 프로그램을 구현하시오.

```typescript
type CandyType = "red" | "white" | "yellow";
const PEZ_CANDY_DISPENSER: CandyType[] = [
  "red",
  "white",
  "yellow",
  "red",
  "yellow",
  "white",
  "red",
  "red"
];
const pezDispenserStack = new Stack<CandyType>(PEZ_CANDY_DISPENSER);

function removeCandy(dispenser: Stack<CandyType>, candy: CandyType) {
  const resultStack = new Stack<CandyType>();
  while (dispenser.length() !== 0) {
    const dispenserItem = dispenser.pop();
    if (dispenserItem !== "yellow") {
      resultStack.push(dispenserItem);
    }
  }

  return resultStack;
}

console.log(removeCandy(pezDispenserStack, "yellow"));
```
