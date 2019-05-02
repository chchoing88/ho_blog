---
title: (읽기 쉬운 자바스크립트) 이벤트 처리
date: "2019-05-02T10:00:03.284Z"
---

## 고전적인 방법

나쁜 예

```javascript
function handleClick(event) {
  var popup = document.getElementById('popup')
  popup.style.left = event.clientX + 'px'
  popup.style.top = event.clientY + 'px'
  popup.className = 'reveal'
}

addListener(element, 'click', handleClick)
```

위 예제는 이벤트 객체에서 clientX, clientY 프로퍼티만 사용한다. 이 코드만 으로는 간단하고 문제 없어 보이지만, 실제 활용하기에는 제한 사항이 많아서 사용하기 어려운 나쁜 패턴이다.

### 규칙 1. 애플리케이션 로직을 분리한다.

위 예제는 이벤트 핸들러가 애플리케이션 로직을 포함하는 문제가 있다. 
애플리케이션 로직은 사용자의 액션보다는 애플맄메이션 자체에 대한 기능을 다루어야 합니다. 그런데 위 코드의 애플리케이션 로직은 팝업창을 특정 위치에 보여주고 있다. 이 코드가 다른 곳에서도 필요할 수도 있다.
나중에 다른 사용자가 액션에서 이 로직이 필요하면 재사용할 수 있어야 하므로 이벤트 핸들러에서 애플리케이션 로직은 무조건 분리해야 한다.

예를 들면 나중에 클릭할 때뿐만 아니라 특정 요소 위에서 커서가 움직이거나 키보드의 특정 키를 눌렀을 때도 팝업창을 나타나게 해야하는데 이때 실수로 다른 이벤트에 마우스 클릭 이벤트에 맞춰 개발된 핸들러를 등록 하는 일이 생길 수도 있다.

또 이벤트 핸들러에 애플리케이션 로직이 있으면 테스트 하기 어려워 진다. 

```javascript
// 더 나은 방법
var Myapp = {
  handleClick: function(event) {
    this.showPopup(event)
  }

  showPopup: function (event) {
    var popup = document.getElementById('popup')
    popup.style.left = event.clientX + 'px'
    popup.style.top = event.clientY + 'px'
    popup.className = 'reveal'
  }
}

addListener(element, 'click', function(event) {
  Myapp.handleClick(event)
})
```

### 규칙 2. 이벤트 객체를 바로 전달하지 않는다.

이벤트 객체에는 수많은 이벤트 정보가 있지만 이 코드에서는 그중 단 두개만 사용합니다. 애플리케이션 로직은 다음과 같은 이유로 event 객체에 의존해서는 안됩니다.

- 메서드의 인터페이스만 봐서는 어떤 데이터가 필요한지 알기 어렵다. 좋은 API는 자신이 어떤 데이터가 필요한지 명확하게 나타낼 수 있어야 합니다. event 객체를 인자로 넘기는 방법으로는 이 메서드에서 필요한 데이터가 무엇인지 알 수 없습니다.
- 같은 맥락으로, 메서드를 테스트할 때 event 객체를 새로 만들어야 합니다. 테스트를 정확하게 하려면 메서드에서 필요한 데이터가 무엇인지 확실하게 알아야 합니다.

```javascript
var Myapp = {
  handleClick: function(event) {

    event.preventDefault()
    event.stopPropagation()
    
    this.showPopup(event.clientX, event.clientY)
  }
  // 어플리케이션 로직
  showPopup: function (x, y) {
    var popup = document.getElementById('popup')
    popup.style.left = x+ 'px'
    popup.style.top = y + 'px'
    popup.className = 'reveal'
  }
}

addListener(element, 'click', function(event) {
  Myapp.handleClick(event)
})
```
