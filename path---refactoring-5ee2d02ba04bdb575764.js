webpackJsonp([0x6f49acd169c2],{503:function(e,o){e.exports={data:{site:{siteMetadata:{title:"Merlin Tec Blog",author:"merlin.ho"}},markdownRemark:{id:"/Users/merlin.ho/Documents/workspace/ho_blog/gatsby-blog/src/pages/refactoring/index.md absPath of file >>> MarkdownRemark",html:'<h2>중복 코드</h2>\n<p>중복 코드의 가장 단순한 예는 한 클래스의 두 메서드 안에 같은 코드가 들어 있는 경우 이다.\n이럴땐 <code>메서드 추출</code> 기법을 적용해서 겹치는 코드를 빼내어 별도의 메서드로 만들고 그 메서드를 두곳에서 호출하면 된다.</p>\n<p>또 다른 상황은 한 클래스의 두 하위클래스에 같은 코드가 들어있는 경우다.\n이럴 때는 <code>메서드 추출</code> 기법을 적용해서 중복을 없앤 후 <code>메서드 상향</code> 기법을 적용하면 된다.</p>\n<p>코드가 똑같지 않고 비슷하다면 <code>메서드 추출</code>기법을 적용해서 같은 부분과 다른 부분을 분리해야 한다.\n그런다음, 경우에 따라 템플릿 메서드 형성 기법을 적용해야 할 수도 있다.</p>\n<p>두 메서드가 알고리즘만 다르고 기능이 같다면 개발자는 그 두 알고리즘 중에서 더 간단한 것을 택해서 <code>알고리즘 전환</code>을 적용하면 된다.\n중복코드가 가운데에 있다면 주변 <code>메서드 추출</code>을 적용하면 된다.</p>\n<p>서로 상관없는 두 클래스 안에 중복 코드가 있을 때는 한 클래스 안의 중복코드를 <code>클래스 추출</code>이나 <code>모듈 추출</code>을 적용해제 3 의 클래스나 모듈로 떼어낸 후 그것을 다른 클래스에서 호출하는 방법이 있다. 아니면 중복 코드를 빼서 메서드로 만든 후 그 메서드를 두 클래스 중 하나에 넣고 다른 클래스에서 그 메서드를 호출하거나, 코드를 빼내어 만든 메서드를 제 3 의 클래스에 넣고 그걸 두 클래스에서 호출하는 방법도 있다.</p>\n<h2>장황한 메서드</h2>\n<p>최적의 상태로 장수하는 객체 프로그램을 보면 공통적으로 메서드 길이가 짧다.\n주석을 달아야 할 것 같은 부분에 주석을 넣는 대신 메서드를 작성한다. 메서드 안에 주석을 단 코드를 넣고, 그 메서드 명은 기능 수행 방식이 아니라 목적(즉, 기능자체)을 나타내는 이름으로 정한다.</p>\n<p>메서드를 줄이려면 십중팔구는 <code>메서드 추출</code> 기법을 적용해야 한다. 메서드에서 하나로 묶으면 좋을 만한 부분들을 찾아내어 메서드로 만드는 것이다.</p>\n<p>메서드에 매개변수와 임시변수가 많으면 <code>메서드 추출</code>을 실시하기가 까다롭다.\n메서드 추출을 하려면 수많은 매개변수와 임시변수를 새로 만든 메서드의 매개변수로 넘겨야 하는데, 그렇게 되면 가독성에서 원래의 코드와 별 다를게 없어진다. 웬만한 경우에는 <code>임시변수를 메서드 호출 전환</code>기법이나 <code>임시변수를 메서드 체인으로 전환</code> 기법을 적용하면 임시변수가 제거된다.\n길게 열거된 매개변수는 <code>매개변수 세트를 객체로 전환</code> 기법과 <code>객체를 통째로 전달</code> 기법을 적용하면 간결해진다.</p>\n<p>이런 노력에도 불구하고 임시변수와 매개변수가 너무 많을 때는 <code>메서드를 메서드 객체로 전환</code> 기법을 적용하면 된다.</p>\n<p>조건문을 추출하려면 <code>조건문 쪼개기</code> 기법을 사용해야 한다.\n루프를 <code>컬렉션 클로저 메서드로 전환</code>을 실시한 후 그 클로저 메서드 호출과 클로저 자체에 <code>메서드 추출</code>을 실시하면 된다.</p>\n<h2>방대한 클래스</h2>\n<p>기능이 지나치게 많은 클래스는 보통 엄청난 수의 인스턴스 변수가 들어 있다.\n클래스에 인스턴스 변수가 너무 많으면 중복 코드가 반드시 존재하게 마련이다.</p>\n<p><code>클래스 추출</code>을 실시하면 수 많은 인스턴스 변수를 하나로 묶을 수 있다. 쉽게 말해 한 클래스 안의 일부 변수가 접두어나 접미어가 같다면 하나의 클래스로 추출하는게 좋다. <code>하위클래스로 추출</code>하는 것이 적합할 것 같으면 <code>하위클래스 추출</code>을 실시하는 것이 더 간단하다.\n만약 추출할 클래스가 대리자로 부적절할 것 같으면 <code>모듈 추출</code>을 실시하면 된다.</p>\n<p>인스턴스 변수를 계속해서 모두 사용하지 않는 클래스도 간혹 있다. 그런 경우에는 <code>클래스 추출</code>, <code>모듈 추출</code>, <code>하위클래스 추출</code> 중 하나를 여러번 적용하는 방법도 있다.\n만약 100 줄짜리 메서드 5 개가 있다면 그것들을 원래 메서드에서 추출한 2 줄짜리 메서드 10 개가 들어있는 10 줄짜리 메서드 5 개로 바꾸는 방법도 있다.</p>\n<p>클라이언트가 그 클래스를 어떻게 사용하게 할지 결정하고, 그러한 각 사용방법마다 <code>인터페이스 추출</code>을 실시하는 편법도 자주 쓰인다.</p>\n<p>만약 방대한 클래스가 GUI 클래스라면 데이터와 기능을 서로 다른 도메인 객체로 옮겨야 할 수도 있다. 이를 위해 두 곳에 있는 일부 중복 데이터는 놔두고그 데이터와 싱크를 유지해야할 수도 있다. 이것은 <code>관측 데이터 복제</code> 기법을 실시하면 해결된다.</p>\n<h2>과다한 매개변수</h2>\n<p>초보 시절 루틴에 필요한 모든 걸 매개변수를 사용해 전달하라고 배웠지만, 객체의 등장으로 인해 상황은 달라졌다.\n필요한 데이터가 없을 때는 그것을 가져오도록 항상 다른 객체에 요청하면 되기 때문이다. 그래서 객체를 사용할 때는 메서드에 필요한 모든 데이터를 전달하는 게 아니라 <em>그 모든 데이터를 가져올 수 있는 메서드만 전달</em>하면 된다. 메서드가 필요로 하는 각종 데이터는 그 메서드가 속한 클래스에 들어 있다.</p>\n<p>매개변수 세트가 간결하다는 것은 장점이다.</p>\n<p>이미 알고 있는 객체에 요청하여 한 매개변수에 들어있는 데이터를 가져올 수 있을 때는 <code>매개변수 세트를 메서드로 전환</code>을 적용하면 된다. 이 객체는 인스턴스 변수일 수도 있고 다른 매개변수일 수도 있다.\n객체에 있는 데이터 세트를 가져온 후, 데이터 세트를 그 객체 자체로 전환하려면 <code>객체를 통째로 전달</code>을 적용하면 된다.\n여러 데이터항목에 논리적 객체가 없다면 <code>매개변수 세트를 객체로 전환</code>을 적용하면 된다.</p>\n<p>이 기법들이 적용할 때 예외가 하나 있는데, 그것은 바로 호출되는 객체가 호출 객체에 의존하면 안 될 때다. 이럴 때는 데이터를 개별적으로 빼서 매개변수로 전달하는 것이 바람직하지만, 그렇게 하려면 어려움이 따른다. 나열된 매개변수 세트가 너무 길거나 자주 바뀐다면 불가피하게 종속 구조를 유지하는 것도 생각해야 한다.</p>\n<h2>수정의 산발</h2>\n<p>어떤 클래스를 보던 중 ‘새 데이터베이스를 생성할 때마다 이 3 개의 메서드를 수정해야 하고, 새 금융 상품을 추가할 때마다 이 4 개의 메서드를 수정해야 하네!’ 하는 생각이 들면 그 하나의 클래스를 여러 개의 변형 객체로 분리하는 것이 좋다. 그러면 각 객체는 한 종류의 수정에 의해서만 변경된다.\n이렇게 변경할 때는 한 개의 클래스나 모듈만 변경해야 하며, 새 클래스나 모듈 안에는 반드시 그 변경사항을 표시해야 한다.\n이것을 정리하려면 특정 원인으로 인해 변하는 모든 부분을 찾은 후 <code>클래스 추출</code>을 적용해서 그 부분들을 합쳐 한 클래스로 빼내야 한다.</p>\n<h2>기능의 산재</h2>\n<p>기능의 산재는 수정의 산발과 비슷하지만 정 반대다. 수정할 때마다 여러 클래스에서 수많은 자잘한 부분을 고쳐야 한다면 이 문제를 의심할 수 있다. 수정할 부분이 여기저기에 있다면 찾기도 힘들 뿐더러 꼭 수정해야 하는 부분을 놓치기 쉽다.</p>\n<p>이럴 때는 <code>메서드 이동</code>과 <code>필드 이동</code>을 적용해서 수정할 부분들을 전부 하나의 클래스 안에 넣어야 한다.\n기존의 클래스 중 어느 것에 넣기에도 부적절해 보일 때는 새 클래스를 만들어야 한다. 대게는 <code>클래스 내용 직접 삽입</code>을 적용해서 별도 클래스에 분산되어 있던 모든 기능을 한 곳으로 가져와도 된다.</p>\n<h2>잘못된 소속</h2>\n<p>객체의 핵심은 데이터와 그 데이터에 사용되는 프로세스를 한 데 묶는 기술이라는 점이다. 전통적으로 어떤 메서드가 자신이 속하지 않은 클래스에 더 많이 접근한다면 잘못된 소속의 구린내가 풍길 것이다.</p>\n<p>소속이 잘못된 메서드는 더 많이 접근하는 클래스에 들어가는 것이 마땅하니, <code>메서드 이동</code>기법을 실시해서 더 자주 접근하는 클래스로 옮겨야 한다. 간혹 메서드의 일부분만 소속이 잘못된 경우도 있는데, 이럴 때는 그 부분에 <code>메서드 추출</code>을 적용한 후 <code>메서드 이동</code>을 적용해서 적절한 클래스로 옮기면 된다.</p>\n<p>이 규칙을 따르지 않는 복잡한 패턴도 일부 있다. <code>전략 패턴</code>과 <code>방문자 패턴</code>, <code>자가 위임 패턴</code>이 그렇다. 이 패턴들은 수정의 산발이 의심될 때 해결책으로 쓰인다. 기본 규칙은 함께 수정되는 것들을 하나로 뭉치는 것이다. 데이터와 그 데이터를 참조하는 기능은 대체로 함께 수정되지만 예외도 있다.\n그런 예외가 발생하는 기능은 옮겨서 한 곳에서 수정해야 한다. <code>전략 패턴</code>과 <code>방문자 패턴</code>은 재정의가 필요한 일부 기능을 따로 빼내기 때문에 기능을 수정하기는 쉬워지지만, 대신 인다이렉션이 늘어나는 단점이 있다.</p>\n<blockquote>\n<p>인다이렉션 (indirection, 간접접근) 은 코드에 있는 값을 바로 사용 하지 말고 그 값을 가리키는 포인터를 사용한라는 뜻의 단어.</p>\n</blockquote>\n<blockquote>\n<p>방문자 패턴은 각각의 Element 에 로직이 다른 visitor 가 들어가면(방문하면) Element 가 자기 자신을 넘기면서 visitor 가 공통으로 정해놓은 함수를 실행하게 된다. visitor.visit(this: Element), 자동차를 예를 들면 왼쪽 바퀴, 오른쪽 바퀴 하나 하나가 Element 로 생각하면 되고, visitor 는 만드는사람, 정비공 등등.. 이라고 생각하면 된다. 각각의 Element 들이 만드는 사람을 만나면 A 를 수행하게 될것이고 정비공을 만나면 B 를 수행하게 될것이다.</p>\n</blockquote>\n<h2>데이터 뭉치</h2>\n<p>두 클래스에 들어 있는 인스턴스 변수나 여러 메서드 시그니처에 들어 있는 매개변수처럼, 동일한 3~4 개의 데이터 항목이 여러 위치에 몰려 있는 경우가 많다. 이렇게 <em>몰려 있는 데이터 뭉치는 객체로 만들어야 한다.</em></p>\n<p>우선 데이터 뭉치가 필드처럼 보이는 부분을 찾아야 한다. 이 뭉치를 객체로 전환하려면 그 필드들을 대상으로 <code>클래스 추출</code> 기법을 사용해야 한다. 그러고 나서 메서드 시그니처를 대상으로 <code>매개변수 세트를 객체로 전환</code> 기법과 <code>객체를 통째로 전달</code> 기법을 적용하여 간결하게 만들어야 한다. 이렇게 하면 매개변수가 적어져서 부수적으로 메서드 호출 코드가 간결해지는 효과도 누릴 수 있다. 새로 생긴 객체의 속성들 중 일부만 이용하는 데이터 뭉치라 해도 이 방법으로 효과를 볼 수 있다. 둘 이상의 필드를 객체로 전환하면 코드가 개선된다.</p>\n<p>그러한 효과는 여러 데이터 값 중 하나를 삭제해보면 확실히 알 수 있다. 그렇게 했을 때 나머지 데이터 값들이 제대로 돌아가지 않는다면 그 객체를 없애고 새로 만들어야 한다.</p>\n<p>인스턴스 변수 세트와 매개변수 세트를 줄이면 분명히 의심되는 문제점도 없어지지만, 일단 객체로 전환하고 나면 전체적 성능이 개선될 여지도 있다. 이렇게 하고 나면 <code>잘못된 소속</code>의 구린내가 풍기는 부분들을 찾을 수 있는데, 이런 부분의 기능은 새 클래스로 빼내야 한다.</p>\n<h2>강박적 기본 타입 사용</h2>\n<p>대개의 프로그래밍 환경을 구성하는 데이터는 두 종류다. 하나는 레코드 타입인데, 이것을 사용해서 데이터를 의미 있는 그룹들로 묶어 구조화할 수 있다. 기본 타입은 한마디로 초석이라고 할 수 있다. 레코드에는 항상 일정 양의 오버헤드가 따른다. 여기서 레코드란 데이터베이스 테이블일 수도 있지만, 그 외의 것이라면 한두 가지 목적만을 위해 생성하기엔 어중간할 수도 있다.</p>\n<p>객체의 주요 장점 중 하나가 바로 기본 타입 클래스와 응용 클래스 간의 경계를 허문다는 점이다. 언어에 내장된 기본 타입과 구별하기 힘든 작은 클래스를 손쉽게 작성할 수 있다.</p>\n<p>객체를 처음 접하는 사람은 보통 숫자와 통화를 연동하는 돈 관련 클래스나 전화번호와 우편번호 같은 특수 문자열 클래스등의 사소한 작업에는 작은 객체를 잘 사용하지 않으려는 경향이 있다. 이러한 우물 안 개구리를 벗어나려면 <code>데이터 값을 객체로 전환(값 객체로 전환)</code>을 실시하면 된다. 데이터 값이 분류 부호일 땐 그 값이 기능에 영향을 주지 않는다면 <code>분류 부호를 클래스로 전환</code>을 실시하자. 그리고 조건문에 분류 부호가 사용될 땐 <code>분류 부호를 하위클래스로 전환</code> 기법이나 <code>분류 부호를 상태/전략 패턴</code>으로 전환 기법을 적용하자.</p>\n<p>뭉쳐 다녀야 할 여러 개의 필드가 있다면 <code>클래스 추출</code> 기법을 적용해야 한다. 이런 기본 타입이 매개변수 세트에 들어 있다면 <code>매개변수 세트를 객체로 전환</code> 기법을 적용하면 된다. 배열 때문에 불편하다면 <code>배열을 객체로 전환</code> 기법을 적용하면 된다.</p>\n<h2>switch 문</h2>\n<p>객체지향 코드의 확연한 특징 중 하나는 switch-case 문이 비교적 적게 사용된다는 점이다.\nswitch 문의 단점은 반드시 중복이 생긴다는 점이다. 같은 switch 문이 프로그램 곳곳에 있을 때가 많다.</p>\n<p>이 문제점을 해결할 수 있는 최상의 방법은 객체지향 개념 중 하나인 다형성, 즉 재정의를 이용하는 것이다.\n대부분의 switch 문은 고민할 필요 없이 재정의로 바꿔야 한다. 문제는 재정의를 넣을 위치다.</p>\n<p>switch 문에는 분류 부호가 흔히 사용되는데, 그럴 땐 분류 부호 값이 들어 있는 메서드나 클래스가 있어야 한다.\n이럴 때는 <code>메서드 추출</code>을 실시해서 swtich 문을 메서드로 빼낸 후 <code>메서드 이동</code>을 실시해서 그 메서드를 재정의해야 할 클래스에 옮겨 넣으면 된다.</p>\n<p>그와 동시에 <code>분류 부호를 하위클래스로 전환</code> 기법과 <code>분류 부호를 상태/전략 패턴으로 전환</code> 기법 중 어느 것을 적용할지 판단해야 한다. 상속 구조를 만들었다면 <code>조건문을 재정의로 전환</code> 기법을 적용하면 된다.</p>\n<p>하나의 메서드에 영향을 미치는 case 문이 2~3 개 밖에 없고 나중에 그 모든 case 문을 수정할 일이 없을 것 같으면, 재정의로 전환하는 것은 과하다. 그럴 때는 <code>매개변수를 메서드로 전환</code>을 적용하는 편이 낫다. 조건문이 들어 있는 여러 case 문 중 하나가 널일 때는 <code>Null 검사를 널 객체에 위임</code>을 실시하면 된다.</p>\n<h2>평행 상속 계층</h2>\n<p>평행 상속 계층은 사실 <code>기능의 산재</code>의 특수한 상황이다. 이 문제점이 있으면 한 클래스의 하위클래스를 만들 때마다 매번 다른 클래스의 하위클래스도 만들어야 한다. 서로 다른 두 상속 계층의 클래스명 접두어가 같으면 이 문제를 의심할 수 있다.</p>\n<p>중복 코드 부분을 제거하려면 보통은 한 상속 계층의 인스턴스가 다른 상속 계층의 인스턴스를 참조하게 만들면 된다.\n<code>메서드 이동</code>과 <code>필드 이동</code>을 실시하면 참조하는 클래스에 있는 계층이 제거된다.</p>\n<h2>직무유기 클래스</h2>\n<p>하나의 클래스를 작성할 때마다 유지관리와 이해하기 위한 비용이 추가된다. 따라서 비용만큼의 기능을 수행하지 못하는 비효율적 클래스는 없애야 한다. 기존에는 비용 대비 효율성이 좋았으나 리팩토링 실시로 인해 기능이 축소된 클래스, 또는 수정할 계획으로 작성했으나 수정을 실시하지 않아 쓸모없어진 클래스가 바로 이런 직무유기 클래스에 해당된다.</p>\n<p>비용 대비 효율이 떨어지는 하위클래스나 모듈이 있을 때는 <code>계층 병합</code>을 실시하면 된다. 거의 쓸모없는 구성요소에는 <code>클래스 내용 직접 삽입</code>이나 <code>모듈 내용 직접 삽입</code> 기법을 적용해야 한다.</p>\n<h2>막연한 범용 코드</h2>\n<p>‘그래, 조만간 이런 기능이 필요하겠구만’하는 막연한 생각에 아직은 필요 없는 기능을 수행하고자 온갖 호출과 case 문을 넣으려 하는 그 순간 막연한 범용 코드의 구린내가 풍긴다.</p>\n<p>별다른 기능이 없는 클래스나 모듈이 있다면 <code>계층 병합</code>을 실시해야하고 불필요한 위임을 제거하려면 <code>클래스 내용 직접 삽입을 실시</code>해야 한다. 메서드에 사용되지 않는 매개변수가 있으면 <code>매개변수 제거</code>를 실시해야 하며, 메서드명이 이상하다면 <code>메서드명 변경</code>을 실시해야 한다.</p>\n<h2>임시 필드</h2>\n<p>어떤 객체 안에 인스턴스 변수가 특정 상황에서만 할당되는 경우가 간혹 있다. 개발자는 객체가 그 안에 들어 있는 모든 변수를 이용하리라 생각하기 마련이므로 이런 코드는 파악하기 힘들다. 사용되지 않을 것 같은 변수가 어째서 거기 있는지 이해하려다 보면 스트레스를 받을 수 밖에 없다.</p>\n<p>이런 가엾은 떠돌이 변수들이 서식할 집을 마련해 주려면 <code>클래스 추출</code>을 실시해야 한다. 그렇게 작성한 클래스에 그 변수들과 관련된 코드를 전부 넣어야 한다. Null 검사를 <code>널 객체에 위임</code>을 실시해서 그 변수들의 값이 올바르지 않을 경우를 대비한 대체 컴포넌트를 작성하면 경우에 따라 조건문 코드를 없앨 수 있다.</p>\n<p>개발자는 수많은 매개변수를 전달하는 것을 꺼린 나머지, 매개변수를 필드에 대입한다. 그런데 이 인스턴스 변수는 해당 알고리즘이 실행되는 동안에만 효력이 있고 다른 때는 코드를 복잡하게 만들 뿐이다. 이럴 때는 인스턴스 변수와 그 변수를 사용하는 메서드 전부에 대해 <code>클래스 추출</code>을 적용하면 된다. 그러면 <code>메서드 객체</code>가 새로 생성된다.</p>\n<h2>메시지 체인</h2>\n<p>메시지 체인은 클라이언트가 한 객체에 제 2 의 객체를 요청하면, 제 2 의 객체가 제 3 의 객체를 요청하고, 제 3 의 객체가 제 4 의 객체를 요청하는 식으로 연쇄적 요청이 발생하는 문제점을 뜻한다. 이러한 메시지 체인은 수많은 코드 행이 든 getThis 메서드나 임시변수 세트라고 봐도 된다. 이런 요청의 왕래로 인해 클라이언트는 그 왕래 체제에 구속된다. 그 사이의 관계들에 수정이 발생할 때마다 클라이언트도 수정해야 한다.</p>\n<p>이럴 때는 대리 <code>객체 은폐</code>를 실시해야 한다. 이 기법은 원칙적으로 체인을 구성하는 모든 객체에 적용할 수 있지만, 그렇게 하면 모든 중간 객체가 중개 메서드로 변해서 <code>과잉중개 메서드</code>의 구린내를 풍기는 문제가 흔히 발생한다.\n그래서 차라리 결과 객체가 어느 대상에 사용되는지를 알아내는 방법이 더 낫다. 그렇게 알아낸 객체가 사용되는 코드 부분을 <code>메서드 추출</code>을 통해 별도의 메서드로 빼낸 후 <code>메서드 이동</code>을 실시해서 체인 아래로 밀어낼 수 있는지 여부를 검사해야 한다.\n만약 체인에 속한 객체 중 한 객체의 여러 클라이언트가 나머지 객체들에 왕래한다면 그 기능을 수행하는 메서드를 추가하면 된다.</p>\n<h2>과잉 중개 메서드</h2>\n<p>객체의 주요 특징 한가지는 바로 캡슐화다. 캑슐화란 내부의 세부적인 처리를 외부에서 볼 수 없게 은폐하는 작업을 뜻한다. 캡슐화할 때는 대게 위임이 수반된다. 직원이 부장에게 회의 참석이 가능한지 물어보면, 부장은 그 내용을 자신의 다이어리에 위임하고 직원에게 대답한다. 이 얼마나 깔끔한 절차인가! 부장이 다이어리를 사용하는지, PDA 를 이용하는지, 비서에게 챙기라고 지시하는지 알 필요도 없으니 말이다.</p>\n<p>그러나 이것도 지나치면 문제가 된다. 어떤 클래스의 인터페이스를 보니까 그 안의 절반도 넘는 메서드가 기능을 다른 클래스에 위임하고 있다면, 조만간 <code>과잉 중개 메서드 제거</code>를 실시해서 원리가 구현된 객체에 직접 접근하자. 일부 메서드에 별 기능이 없다면 <code>메서드 내용 직접 삽입</code>을 실시해서 그 메서드들의 내용을 호출 객체에 직접 삽입하게 하면 된다.\n부수적인 기능이 있다면 <code>위임을 상속으로 전환 기법</code>을 실시해서 중개 메서드를 실제 객체의 하위클래스로 전환하면 된다. 이렇게 하면 모든 위임을 추적하지 않고 기능을 확장할 수 있다.</p>\n<h2>지나친 관여</h2>\n<p>간혹 클래스끼리 관계가 지나치게 밀접한 나머지 서로의 은밀한 부분을 알아내느라 과도한 시간을 낭비하게 될 때가 있다.</p>\n<p>서로 지나치게 관여하는 클래스는 고전에 나오는 비운의 연인처럼 갈라놔야 한다. <code>메서드 이동</code>과 <code>필드 이동</code>을 실시해서 각 클래스를 분리해서 지나친 관여를 줄여야 한다. <code>클래스의 양방향 연결을 단방향으로 전환</code>기법을 적용할 수 있는지 판단해서 만약 해당 클래스들이 공통으로 필요로 하는 부분이 있다면, <code>클래스 추출</code>을 실시해서 공통 필요 부분을 별도의 안전한 클래스로 빼내면 된다. 아니면 <code>대리 객체 은폐</code>를 실시하여 다른 클래스가 중개 메서드 역할을 하게 만들어도 된다.</p>\n<p>상속으로 인해 지나친 관여가 발생하는 경우가 많다. 하위클래스는 항상 상위클래스가 공개하는 것보다 많은 데이터를 필요로 한다. 상위클래스에서 하위클래스를 빼내야 할 경우에는 <code>상속을 위임으로 전환 기법</code>을 적용해야 한다.</p>\n<h2>인터페이스가 다른 대용 클래스</h2>\n<p>기능은 같은데 시그니처가 다른메서드에는 <code>메서드 변경</code>을 실시해야 한다.\n클래스에 여전히 충분한 기능이 구현되어 있지 않기 때문에 대체로 이 기법만 적용해선 충분하지 않다.\n프로토콜이 같아질 때까지 <code>메서드 이동</code>을 실시해서 기능을 해당 클래스로 옮겨야 한다. 단, 코드를 너무 어려 번 옮겨야 한다면 <code>상위클래스 추출</code>을 실시하면 된다.</p>\n<blockquote>\n<p>시그니처란 함수의 원형에서 함수와 인자들의 이름을 제외한 나머지를 시그니처라고 부른다. (ex. sum2(int, int, double)) 시그니처는 다음을 포함한다. parameters 와 그들의 types , 반환값과 타입, 던져지거나 콜백으로 반환되는 exceptions, object-oriented 프로그램에서 메서드의 접근 권한에 대한 정보 (public, static, or prototypes) : <a href="https://developer.mozilla.org/ko/docs/Glossary/Signature/Function">https://developer.mozilla.org/ko/docs/Glossary/Signature/Function</a></p>\n</blockquote>\n<h2>미흡한 라이브러리 클래스</h2>\n<p>많은 이들이 재사용을 객체의 목적이라고 생각하는데, 그게 재사용을 과대평가해서 나온 생각인거 같다. 물론 프로그래머가 단순 정렬 알고리즘도 잊어버릴 정도로 라이브러리 클래스에 의존한다는 점은 부인할 수 없다.</p>\n<p>라이브러리 클래스 제작자라 해도 모든 걸 알 수는 없다. 자신이 직접 대부분의 라이브러리 클래스를 완성하지 않는 이상 설계를 파악한다는 것이 거의 불가능하다는 점에서, 라이브러리 제작자라는 직업은 그만큼 힘들다. 문제는 라이브러리 클래스를 원하는 기능을 수행하게 수정하는 것이 보통은 불가능하다는 것이다. 이 때문에 <code>메서드 이동</code> 같은 검증된 방법이 무용지물이 된다.</p>\n<p>이 문제를 해결하기 위한 특수 목적의 기법이 두 개 있다. 라이브러리 클래스에 넣어야 할 메서드가 두 개뿐이라면 <code>외래 클래스에 메서드 추가</code> 기법을 실시하고, 부가 기능이 많을 때는 <code>국소적 상속확장 클래스 사용</code> 기법을 실시하자.</p>\n<h2>데이터 클래스</h2>\n<p><em>데이터 클래스는 필드와 필드 읽기/쓰기 메서드만 들어 있는 클래스다.</em> 그런 클래스는 오로지 데이터 보관만 담당하며, 거의 대부분의 구체적 데이터 조작은 다른 클래스가 수행한다. 처음엔 이 클래스들은 어쩌면 public 필드였을 수도 있다. 만일 그렇다면 누군가가 제보하기 전에 즉시 <code>필드 캡슐화 기법</code>을 실시해야 한다. 컬렉션 필드가 있으면 그 필드가 적절히 캡슐화되어 있는지 확인해서 캡슐화되어 있지 않다면 <code>컬렉션 캡슐화 기법</code>을 적용하자. 변경되지 않아야 하는 필드에는 <code>쓰기 메서드 제거</code>를 적용하자.</p>\n<p>이런 읽기/쓰기 메서드가 다른 클래스에 의해 사용되는 부분을 찾아서, <code>메서드 이동</code>을 실시하여 기능을 그 데이터 클래스로 옮겨야 한다. 만약 메서드 전체를 옮길 수 없다면 <code>메서드 추출</code>을 실시해서 옮길 수 있는 메서드를 작성하면 된다. 그러고 나서 읽기/쓰기 메서드에 <code>메서드 은폐</code>를 적용하면 된다.</p>\n<p>데이터 클래스는 어린애 같아서 처음엔 괜찮지만, 성숙한 객체로서의 역할을 하려면 어느 정도의 책임을 감당해야 한다.</p>\n<h2>방치된 상속물</h2>\n<p>하위클래스는 부모 클래스의 메서드와 데이터를 상속받는다. 그런데 그렇게 상속받은 메서드나 데이터가 하위클래스에서 더 이상 쓰이지 않거나 필요 없을 땐 어떻게 될까? 그럴 경우 하위클래스는 상속물을 전부 받아 그 중에서 필요한 것 외엔 방치해버리는 문제가 생긴다.</p>\n<p>기존에는 이 문제의 원인이 잘못된 계층구조 때문이라고 설명했다. 이럴 경우, 새 대등 클래스를 작성하고 메서드 하향과 필드 하향 실시해서 사용되지 않는 모든 메서드를 그 형제 클래스에 몰아넣어야 한다. 이렇게 하면 상위클래스에는 공통 코드만 들어 있게 된다.</p>\n<p>위에서 ‘기존에는’이라는 한정적 표현을 사용했는데, 앞으로는 앞의 문제점을 최소한의 경우에만 지적할 것임을 암시한다.\n일부 기능을 언제든 재사용하고자 하위클래스로 몰아 넣는 작업을 하는데, 이 방법이 매우 효과적임을 깨닫곤 한다. 그래서 방치된 상속물로 인해 코드가 복잡해지거나 문제가 생길 때는 위에서 설명한 기존 방법을 따르길 권한다. 그러나 이 방법을 항상 반드시 적용해야 하는 것은 아니다. 이 문제는 심각하지 않은 경우가 대부분이기 때문에 리팩토링이 별로 필요하지 않다.</p>\n<p>방치된 상속물의 구린내는 하위클래스가 기능은 재사용하지만 상위클래스의 인터페이스를 지원하지 않을 때 훨씬 심하게 풍긴다. 상속구현을 거부하는 것은 상관없지만, 인터페이스를 거부하는 것은 심각한 문제다. 하지만 그렇다고 계층구조를 건드려서는 안 되고, <code>상속을 위임으로 전환</code> 기법을 적용해서 계층구조를 없애야 한다.</p>\n<h2>불필요한 주석</h2>\n<p>어떤 코드 구간의 기능을 설명할 주석이 필요할 때는 메서드 추출을 실시해야 한다.\n메서드가 이미 추출된 상태임에도 기능을 설명할 주석이 여전히 필요하다면, 메서드명 변경을 실시해야 한다. 시스템의 필수적인 상태에 관해 약간의 규칙을 설명해야 할 때는 어설션 넣기를 실시하면 된다.</p>\n<p><em>주석을 넣어야겠다는 생각이 들 땐 먼저 코드를 리팩토링해서 주석을 없앨 수 있게 만들어라</em></p>\n<p>주석은 무슨 작업을 해야 좋을지 모를 때만 넣는 것이 좋다. 주석을 넣으면 돌아가는 원리를 적어둘 수도 있고 확실치 않은 부분을 표시할 수도 있다. 어떤 코드를 넣은 이유를 메모해 놓을 경우에도 주석을 넣는 것이 적절하다. 이런 정보나 특히 잊기 쉬운 사항을 주석으로 작성해 놓으면 나중에 수정하게 될 사람들이 보고 쉽게 이해할 수 있다.</p>',frontmatter:{title:"(리팩토링) 리팩토링 요점 정리",date:"May 10, 2019"}}},pathContext:{slug:"/refactoring/"}}}});
//# sourceMappingURL=path---refactoring-5ee2d02ba04bdb575764.js.map