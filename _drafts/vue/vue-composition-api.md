## 동기

### 로직의 재활용 & 코드 구성

우리는 뷰를 쉽게 선택하고 중소 규모의 어플리케이션을 쉽게 만들 수 있는 점을 좋아한다. 하지만 뷰 선택이 늘어남에 따라 많은 유저들은 매우 큰 프로젝트에 뷰를 이용한다.
몇년동안 우리는 이런 프로젝트 중 일부가 현재 Vue의 API를 기반으로 하는 프로그래밍 모델의 한게점을 보았다. 이런 문제들은 2가지 카테고리로 정리 될 수 있다.

1. 복잡한 컴포넌트들의 코드는 시간이 지남에 따라 기능들을 추론하기가 어려워진다. 이런 경우는 특히 자신이 작성하지 않은 코드를 읽을때 발생한다. 이런 근간은 Vue의 기존 API가 옵션에 따라 조직하게 만들지만 몇몇 케이스들은 논리적 문제로 코드를 구성하는 편이 더 합리적이다.
2. 다양한 컴포넌트간에 로직을 추출하고 재사용하기 위한 깨끗하고 비용이 들지 않는 메커니즘이 없다.

이 RFC에서 제안하는 API들은 유저들이 컴포넌트 코드를 구성할때 유연해지는데에 있다. 옵션들로 코드를 강제로 구성하는 대신에, 코드는 각각의 특징 기능을 가진 함수로 구성이 될수 있다.
이 API는 또한 컴포넌트 간 심지어 외부 컴포넌트들까지도 추출과 재사용성이 간편해진다.

### 더 나은 타입 인터페이스

큰 프로젝트에서 일했던 개발자들로부터 공통적인 요청 사항은 더 나은 TypeScript 지원이다. Vue 의 현재 API는 TypeScript와의 통합과 관련해서 몇몇 과제를 부여받았는데, 대게 Vue가 프로퍼티들을 노출 시키기 위해서 하나의 `this` 컨텍스트에 의존하는 것과 Vue 컴포넌트안에서 `this` 사용이 일반 Javascript 보다 조금 더 마법같기 때문이다. (예를 들어 `methods` 안에 중첩된 `this`는 `methods`의 객체가 아닌 컴포넌트 인스턴스를 가리킨다.)
다른말로 하면, Vue가 지니고 있는 API는 타입을 위해 디자인되어 있지 않았고 TypeScript와 작동할때 많은 문제를 가지고 있다.

오늘날 TypeScript와 뷰를 함께 쓰는 유저는 `vue-class-component`를 사용하고, 이 라이브리러는 TypeScript 클래스들처럼 컴포넌트를 작성한다. 3.0을 디자인하는 동안 이러한 타입 이슈를 좀 더 나은 방향으로 해결하기 위해 내장된 클래스 API를 제공하려고 했다. 그러나 설계에 대해 논의하고 반복하면서 클래스 API가 타이핑 문제를 해결하기 위해 데코레이터에 의존을 해야만 했습니다. 이 데코레이터는 많은 확실하지않은 실행 규칙을 가진 안정되지 않은 스테이지 2 제안에 불과했다.

이에 비해이 RFC에서 제안한 API는 자연적으로 타입 친화적인 일반 변수와 함수를 대부분 활용한다. 제안 된 API로 작성된 코드는 수동 유형 힌트가 거의 필요없이 완전한 타입 추론을 즐길 수 있다. 이것은 또한 제안 된 API로 작성된 코드가 TypeScript와 일반 JavaScript에서 거의 동일하게 보일 것임을 의미하므로 TypeScript가 아닌 사용자도 더 나은 IDE 지원을 위해 타이핑의 이점을 누릴 수 있다.

## 디테일한 디자인

### API 소개

여기에서 제안하는 API는 독립형 함수로써 Vue의 핵심 기능을 노출하는 것에 관한 것이다. - 반응형 state를 생성하고 관찰하는 것에 대한 -
여기서는 기본적인 API 들만 소개할 것이고 어떻게 그것들이 2.x 로직에서 사용될 수 있는지에 대해서 살펴볼것이다.

#### Reactive State 과 Side Effects

반응형 상태를 선언하는 방법

```javascript
import { reactive } from 'vue'

// reactive state
const state = reactive({
  count: 0
})
```

reactive 는 2.x 에 있는 Vue.observable() API와 같다. RxJS와 혼란을 피하기 위해 다른이름을 사용했다. 여기 리턴된 state는 반응형 object이다.

Vue 안에 반응형 state 를 위한 필수 유스케이스는 render 동안 그것을 사용할수 있어야 하는 것이다. 종속성 트랙킹 덕분에 뷰에서는 자동으로 반응형 state가 변화가 생기면 업데이트가 이루어진다. 
몇몇 DOM 안에서 렌더링이 이뤄지는것은 "사이드 이펙트" 라고 간주된다. 우리 프로그램은 프로그램 자체의 외부 상태(DOM)를 수정하고 있습니다.
여기서는 반응형 상태값에 따라 적용되고 자동적으로 재 적용되는 사이트 이펙트를 위해 `watchEffect` API를 사용하고 있습니다.

```javascript
import { reactive, watchEffect } from 'vue'

const state = reactive({
  count: 0
})

watchEffect(() => {
  document.body.innerHTML = `count is ${state.count}`
})
```

`watchEffect` 는 사이드 이펙트를 일으킬 함수를 하나 받는다. 즉시 함수를 실행하고 실행 중에 사용 된 모든 반응 상태 속성을 종속성으로 추적한다. 여기서는 `state.count`가 관찰당해 집니다.
`state.count`가 변하게 되면 내부 함수는 다시 실행되게 됩니다.

이것은 Vue에 반응형 시스템에 필수 입니다. 컴포넌트 안에서 `data()` 로부터 리턴된 객체가 리턴되면, 그것은 내부적으로 `reactive()` 에 의해 반응형으로 만들어집니다. 템플릿은 이런 반응형 속성을 사용하는 render 함수로 컴파일 되어진다.

2.x 버젼의 `watch` 옵션과 `watchEffect` 는 유사하지만, `watchEffect`는 감시된 데이터 소스와 사이드 이펙트 콜백함수를 분리 할 필요가 없다. (역자 주. 콜백함수에 사용하는 observable 들을 알아서 감시한다는 뜻 같다.) Composition API 또한 2.x 옵션과 동일한 행동을 하는 `watch` 제공한다.

위 예제를 계속 이어나가면, 다음은 user input을 다루는 방법이다.

```javascript
function increment() {
  state.count++
}

document.body.addEventListener('click', increment)
```

하지만 Vue의 템플릿 시스템에서 우리는 `innerHTML` 와 이벤트 리스너를 수동으로 연결할 필요가 없다.
반응형에 집중할 수 있도록 가상의 `renderTemplate` 메서드로 예제를 단순화 해보자.

```javascript
import { reactive, watchEffect } from 'vue'

const state = reactive({
  count: 0
})

function increment() {
  state.count++
}

const renderContext = {
  state,
  increment
}

watchEffect(() => {
  // hypothetical internal code, NOT actual API
  renderTemplate(
    `<button @click="increment">{{ state.count }}</button>`,
    renderContext
  )
})
```

#### Computed State 와 Refs

가끔은 다른 state에 의존하는 state가 필요할 때가 있다. Vue에서는 computed 프로퍼티로 다뤘었다. computed 값을 직접 생성하려면 `computed` API를 사용하면 된다. 하지만

```javascript
import { reactive, computed } from 'vue'

const state = reactive({
  count: 0
})

const double = computed(() => state.count * 2)
```

`computed` 의 리턴 값은 무엇일까? 만약 내부적으로 `computed` 실행하는 방법을 추론한다면, 우리는 다음과 같은 결론에 이르게 될 것이다.

```javascript
// simplified pseudo code
function computed(getter) {
  let value
  watchEffect(() => {
    value = getter()
  })
  return value
}
```

하지만 이렇게 작동을 하지 않는 다는 것을 안다. 만약 `value`가 `number` 같은 원시 타입이라면, `computed` 내부의 업데이트 논리에 대한 연결은 일단 반환되면 손실됩니다.
이런 이유는 Javascript 원시 타입은 참조를 넘기는 것이 아닌 값을 넘기기 때문이다.

같은 문제로 value에 객체 프로퍼티 값을 할당할때도 발생한다. 만약 할당된 프로퍼티나 함수에서 리턴된 값이 반응형을 유지하지 못한다면 반응형 값은 쓸모가 없을 것이다.
항상 최신 계산된 값을 읽기 위해선, 실제 값을 객체로 wrap 하고, 그 객체를 반환해야 할 것이다.

```javascript
// simplified pseudo code
function computed(getter) {
  const ref = {
    value: null
  }
  watchEffect(() => {
    ref.value = getter()
  })
  return ref
}
```

추가적으로 종속성을 추적하고 변경알림을 위해서 객체의 `.value` 프로퍼티를 읽고/쓰는 작업을 가로채야 합니다.
이제 우리는 반응형을 읽지 않는것에 대한 걱정없이 계산 된 값을 참조로 전달할 수 있다. 단점은 가장 최신값을 가져오기 위해 `.value` 를 통해 값을 접근해야 한다는 것이다.

```javascript
const double = computed(() => state.count * 2)

watchEffect(() => {
  console.log(double.value)
}) // -> 0

state.count++ // -> 2
```

여기서 `double`은  내부 값을 보유하고있는 반응형 참조 역할을 하므로 "ref" 라고 부르는 객체다.

계산된 참조 외에도 우리는 직접적으로 일반 변경 가능한 refs를 `ref` API를 이용할 수 있다.

```javascript
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

#### Ref Unwrapping

우리는 ref를 render 컨텍스트의 프로퍼티로서 노출할 수 있다. Vue는 refs를 위해 특별하게 수행한다. 그래서 render 컨텍스트에서 ref를 마주치면, 컨텍스트는 직접적으로 그것의 안쪽 value를 노출시킨다.
템플릿 안에서 이것의 의미는 `{{count.value}}` 대신에 `{{count}}`로 사용할 수 있다는 것을 뜻한다. 객체를

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

const renderContext = {
  count,
  increment
}

watchEffect(() => {
  renderTemplate(
    `<button @click="increment">{{ count }}</button>`,
    renderContext
  )
})
```

게다가 반응형 객체에 중첩된 프로퍼티에 놓여있을때, 그것은 자동적으로 접근할때 unwrapped 된다.

```javascript
const state = reactive({
  count: 0,
  double: computed(() => state.count * 2)
})

// no need to use `state.double.value`
console.log(state.double)
```

#### Usage in Components

지금까지의 코드는 이미 사용자 입력을 기반으로 업데이트 할 수 있는 UI 작업을 제공하지만 코드는 한 번만 실행되며 재사용 할 수 없다.
로직을 재사용하려면 합리적인 다음 단계는 로직을 함수로 리팩토링하는 것 같습니다.

```javascript
import { reactive, computed, watchEffect } from 'vue'

function setup() {
  const state = reactive({
    count: 0,
    double: computed(() => state.count * 2)
  })

  function increment() {
    state.count++
  }

  return {
    state,
    increment
  }
}

const renderContext = setup()

watchEffect(() => {
  renderTemplate(
    `<button @click="increment">
      Count is: {{ state.count }}, double is: {{ state.double }}
    </button>`,
    renderContext
  )
})
```

이제 setup() 을 호출하고 watcher를 만들고 템플릿을 프레임 워크에 렌더링하는 작업을 그대로두면 setup() 함수와 템플릿만으로 compoenent를 정의 할 수 있다.

```vue
<template>
  <button @click="increment">
    Count is: {{ state.count }}, double is: {{ state.double }}
  </button>
</template>

<script>
import { reactive, computed } from 'vue'

export default {
  setup() {
    const state = reactive({
      count: 0,
      double: computed(() => state.count * 2)
    })

    function increment() {
      state.count++
    }

    return {
      state,
      increment
    }
  }
}
</script>
```

#### Lifecycle Hooks

지금까지 컴포넌트의 순수한 상태 측면 인 반응 상태, 계산 된 상태 및 사용자 입력에 대한 변경 상태를 다루었다.
그러나 컴포넌트는 콘솔에 로깅, ajax 요청 전송 또는 창에 이벤트 리스너 설정과 같은 부작용을 수행해야 할 수도 있다. 이러한 부작용은 일반적으로 다음시기에 수행된다.

- 몇몇 상태가 변경될때
- 컴포넌트가 마운트, 업데이트, 언마운트 될때(라이프사이클)

상태를 기반으로 사이드 이펙트를 적용하려면 `watchEffect` 와 `watch` API를 사용해야 한다는 것을 안다.

다른 라이프 사이클 훅에서 사이트 이펙트를 수행하려면, `onXXX` API를 사용할 수있다.

```javascript
import { onMounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('component is mounted!')
    })
  }
}
```

이러한 라이프 사이클 등록 메서드는 `setup` 훅을 호출하는 동안에만 사용할 수 있습니다. 라이프 사이클 등록 메서드는 자동적으로 내부 전역 상태를 이용해서 `setup` 훅을 호출한 현재 인스턴스를 알아챌수 있다.
그것은 로직을 외부 함수로 추출 할 때 마찰을 줄이기 위해 의도적으로 이러한 방식으로 설계되었다.

### Code Organization

이 시점에서 가져온 함수로 컴포넌트 API를 복제했다. 무엇 때문에 그랬을까? 옵션으로 컴포넌트를 정의하는 것은 큰 함수로 함께 믹싱하는 것보다 좀더 조직적으로 보여진다.
이것은 이해할 수 있는 첫 인상이다. 그러나 동기부여 섹션에서 언급한 바와 같이, 우리는 Composition API가 특히 복잡한 요소에서 더 잘 조직된 코드로 이어진다고 믿는다. 여기서 우리는 그 이유를 설명하려고 노력할 것이다.

#### What is "Organized Code"?

코드를 조직적으로 유지하는것의 목표는 코드를 읽기 가독성있게 만드는 것이다. 그러면 코드를 이해 한다는 것은 무엇일까? 우리는 정말 어떤 옵션을 포함하고 있다고 해서 컴포넌트를 이해한다고 할 수 있을까? 
다른 개발자가 작성한 큰 컴포넌트를 만나 애를 먹은적이 있는가?

당신은 대게 "이 컴포넌트가 X,Y 그리고 Z를 다룬다" 라고 보기 보다 "이 컴포넌트가 이러한 데이터와 computed 프로퍼티, 메서드를 지니고 있다" 라고 시작할 것이다. 컴포넌트를 이해하는데 있어서 "컴포넌트가 어떤 옵션을 사용하게 되는가" 보다 "컴포넌트가 무엇을 하려고하는가"를 더 신경 써야 한다. 옵션 기반 API로 작성된 코드는 후자에 자연스럽게 응답하지만, 그것은 전자를 표현하는 데 다소 서투른 역할을 한다.

#### Logical Concerns vs. Option Types

구성 요소가 논리적인 관심사로 다루고 있는 "X, Y, Z"를 정의해 봅시다. 전체 구성요소가 하나의 논리적 문제를 다루기 때문에 가독성 문제는 작은 단일 목적 구성요소에 일반적으로 존재하지 않는다.
그러나 이 문제는 고급 사용 사례에서 훨씬 더 두드러진다. [Vue CLI UI 파일 탐색기](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404)를 예로 들어 보십시오. 이 구성요소는 다음과 같은 여러 가지 논리적인 문제를 다루어야 한다.

- 현재 폴더 상태를 추적하고 그것의 컨텐츠를 보여준다.
- 폴더 탐색을 다룬다.(열림, 닫힘, 새로고침)
- 새로운 폴더를 생성한다.
- 즐겨찾는 폴더를 보이는 것을 전환한다.
- 폴더를 보여주고 감추는것을 전환한다.
- 현재 작업 디렉토리를 바꾼다.

옵션 기반 코드를 읽음으로써 이러한 논리적 우려를 즉시 인식하고 구분할 수 있는가? 그것은 확실히 어렵다. 특정 논리적인 문제와 관련된 코드가 종종 조각나고 사방으로 흩어진다는 것을 알게 될 것이다.
예를 들어, "새 폴더 만들기" 기능은 두 개의 데이터 속성, 하나의 computed 속성 및 메서드를 사용한다. 여기서 메서드는 데이터 속성에서 백 줄 이상 떨어진 위치에 정의된다.

그러한 단편화가 바로 복잡한 요소를 이해하고 유지하기 어렵게 만드는 것이다. 옵션을 통한 강제적인 분리는 근본적인 논리적 우려를 모호하게 한다. 또한, 하나의 논리적인 문제에 대해 작업할 때 우리는 그 문제와 관련된 부분을 찾기 위해 끊임없이 옵션 블록을 "점프"해야 한다.

우리가 같은 로직 관심사에 대해서 한데 뭉쳐지게 할 수 있다면 매우 좋을 것이다. 그리고 이것이 바로 컴포지션 API를 통해 우리가 할 수 있는 것이다. "새 폴더 만들기" 기능은 다음과 같이 작성 될 수 있다.

```javascript
function useCreateFolder (openFolder) {
  // originally data properties
  const showNewFolder = ref(false)
  const newFolderName = ref('')

  // originally computed property
  const newFolderValid = computed(() => isValidMultiName(newFolderName.value))

  // originally a method
  async function createFolder () {
    if (!newFolderValid.value) return
    const result = await mutate({
      mutation: FOLDER_CREATE,
      variables: {
        name: newFolderName.value
      }
    })
    openFolder(result.data.folderCreate.path)
    newFolderName.value = ''
    showNewFolder.value = false
  }

  return {
    showNewFolder,
    newFolderName,
    newFolderValid,
    createFolder
  }
}
```

새 폴더 생성 기능과 관련된 모든 논리가 이제 하나의 함수에 어떻게 결합되고 캡슐화되는지 주목하자. 기능도 서술적 이름 때문에 다소 자체 문서화 되어 있다.
이것은 우리가 **composition function** 부르는 것이다. 함수의 명칭을 '사용'으로 시작하여 구성함수임을 표시하는 것이 권장되는 관례다.
이러한 패턴은 구성요소의 다른 모든 논리적 우려에 적용될 수 있으며, 다음과 같은 많은 기능이 잘 분리된다.

Composition API를 사용해 재 구성한 풀 컴포넌트는 [여기서](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e) 확인할 수 있다.

각 논리적 관심사에 대한 코드는 이제 구성 함수에 함께 결합된다. 이는 큰 구성품을 작업할 때 지속적인 "점프"의 필요성을 크게 감소시킨다.
컴포넌트 스캔을 훨씬 쉽게 하기 위해 컴포넌트 기능을 편집기에서 접을 수도 있다.

```javascript
export default {
  setup() { // ...
  }
}

function useCurrentFolderData(networkState) { // ...
}

function useFolderNavigation({ networkState, currentFolderData }) { // ...
}

function useFavoriteFolder(currentFolderData) { // ...
}

function useHiddenFolders() { // ...
}

function useCreateFolder(openFolder) { // ...
}
```

setup() 함수는 현재 기본적으로 모든 구성 기능이 호출되는 진입점 역할을 한다.

```javascript
export default {
  setup () {
    // Network
    const { networkState } = useNetworkState()

    // Folder
    const { folders, currentFolderData } = useCurrentFolderData(networkState)
    const folderNavigation = useFolderNavigation({ networkState, currentFolderData })
    const { favoriteFolders, toggleFavorite } = useFavoriteFolders(currentFolderData)
    const { showHiddenFolders } = useHiddenFolders()
    const createFolder = useCreateFolder(folderNavigation.openFolder)

    // Current working directory
    resetCwdOnLeave()
    const { updateOnCwdChanged } = useCwdUtils()

    // Utils
    const { slicePath } = usePathUtils()

    return {
      networkState,
      folders,
      currentFolderData,
      folderNavigation,
      favoriteFolders,
      toggleFavorite,
      showHiddenFolders,
      createFolder,
      updateOnCwdChanged,
      slicePath
    }
  }
}
```

API 옵션을 사용할 때 쓰지 않아도 되는 코드 입니다. 그러나 `setup` 함수가 어떻게 구성 요소가 무엇을 하려고 하는지에 대한 구두 설명처럼 거의 읽히는지 주목하자.
이 정보는 옵션 기반 버전에서 완전히 누락된 정보였다. 또한 전달되는 인수에 근거한 구성함수 사이의 종속성 흐름을 명확하게 알 수 있다. 마지막으로 반환문은 템플릿에 노출되는 내용을 확인하는 단일 장소 역할을 한다.

동일한 기능성을 감안할 때 옵션을 통해 정의되는 구성 요소와 구성 기능을 통해 정의되는 구성 요소는 동일한 기본 논리를 표현하는 두 가지 다른 방법을 나타낸다.
옵션 기반 API는 옵션 유형에 따라 코드를 구성하도록 강요하고, 컴포지션 API는 논리적인 우려에 따라 코드를 구성할 수 있게 해준다.

### Logic Extraction and Reuse

컴포넌트 API는 여러 구성 요소에 걸쳐 로직을 추출하고 재사용할 때 매우 유연하다. composition 함수는 마법의 `this` 컨텍스트에 의존하는 대신 자신의 인자와 전역적으로 가져온 Vue API에만 의존한다. 
당신은 단순히 그것을 함수로 내보냄으로써 당신의 구성 요소 로직의 어떤 부분도 재사용할 수 있다. 구성 요소의 전체 `setup` 기능을 내보내면 `extends` 에 해당하는 기능도 얻을 수 있다.

마우스 포지션을 추적하는 예제를 보자.

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function update(e) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
```

다음은 컴포넌트가 함수를 사용하는 방법이다.

```javascript
import { useMousePosition } from './mouse'

export default {
  setup() {
    const { x, y } = useMousePosition()
    // other logic...
    return { x, y }
  }
}
```

파일 탐색의 Composition API 버젼에서 우리는 몇몇 유틸리티 코드를(`uesPathUtils` 와 `useCwdUtils`) 다른 컴포넌트에서 사용하기 유용한 것을 발견했기 때문에 외부 파일로 추출했다.
mixins, higher-order components or renderless components (scoped slots을 통해)와 같은 기존 패턴을 사용하여 유사한 논리 재사용을 달성할 수도 있다.
인터넷에는 이러한 패턴을 설명하는 많은 정보가 있으므로, 우리는 여기서 자세히 반복하지 않을 것이다. 높은 수준의 아이디어는 이러한 패턴 각각이 구성 함수와 비교했을 때 각각의 단점을 가지고 있다는 것이다.

- 렌더 컨텍스트에 노출된 속성의 출처가 분명하지 않음. 예를 들어, 다중 mixins을 사용하여 구성 요소의 템플릿을 읽을 때 특정 성질이 어떤 혼합물로부터 주입되었는지 구별하기가 어려울 수 있다.
- 네임스페이스 충돌. Mixins는 잠재적으로 속성 및 메서드 이름에서 충돌할 수 있으며, HOCs는 예상된 prop 이름에서 충돌할 수 있다.
- 퍼포먼스. HOC 및 렌더리스 구성요소는 성능 비용으로 제공되는 추가적인 상태 저장 구성요소 인스턴스가 필요하다.

Composition API를 사용하여 비교:

- 템플릿에 노출되는 특성은 구성 함수에서 반환되는 값이기 때문에 출처가 명확하다.
- 합성함수에서 반환된 값은 네임스페이스 충돌이 없도록 임의로 이름을 지정할 수 있다.
- 로직 재사용만을 위해 만들어진 불필요한 구성요소 인스턴스는 없다.
