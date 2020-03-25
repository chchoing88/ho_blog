---
title: 세션 로그인
date: "2020-03-25T10:00:03.284Z"
---


## 준비된 API

- /login → username, code

- /login/check → valid, username

- /logout

> 이때, HTTPS 통신을 하지 않을꺼라면 API 주소 도메인은 WEB 도메인과 일치 시켜야 크롬에서 same-site로 인식한다.  크롬은 기본으로 same-site=Lax로 설정되어있다. 그래서 도메인이 다르면 까다로울 수 있다.

## CSRF 란

A 라는 사용자가 example.com에 로그인 된 채로 (유효한 session id를 쿠키로 가지고 있는) 있다면 B(악당) 이 `<img src=http://example.com/api/logout />` 이러한 페이지를 A 라는 사용자에게 넘겨서 A 사용자가 보게 된다면 example로 요청이 들어갈때 session id 쿠키와 함께 요청이 들어간다. 그러면 유효한 요청이 되어서 A 사용자도 모르게 로그아웃이 되는 것이다.  여기서는 단순 로그아웃 요청이지만 이 요청은 악의적인 데이터 수집, 수정, 삭제가 될 수 있다.

## 로그인 프로세스

1. ID, PASSWORD, 로그인 유지 유무 값을 /login API로 전달
2. 전역 auth context에 USERNAME, AUTIFICATION 저장 ( 유일한 진실의 근원 )
3. 처음 URL 치고 들어온 곳으로 Redirect 또는 '/' 로 Redirect

## 로그인 유지 프로세스 ( URL 입력으로 유입 )

1. 전역 auth 컨텍스트 실행시 check api를 호출
2. 응답이 올때까지 null ( 화면에 아무것도 출력 안함 )
3. 응답이 오면 AUTIFICATION 에 true /  false 셋팅
4. true 시 privateRoute에서 해당 Component 보여줌.
5. false 시 /login 으로 Redirect

## 페이지 이동 프로세스 ( Link 이동 )

1. 페이지 이동 Link 누를시 check api 호출 후 세션 valid 확인
2. true 시 'to' props로 이동
3. false 시 세션 만료 모달창 띄움 ( 모달 확인 시 /login 페이지로 이동 )

    ㄴ 이때,  모달창은 이전에 보고 있던 화면에서 띄운다.

## 제공하는 API 호출시 ( 페이지 내 )

1. 응답으로 403 error 발생시 API 과 관련된 ErrorBoundary 에서 세션 만료 모달창 띄움
2. 모달 확인시 /login 페이지로 이동

## 로그아웃 프로세스

1. 로그아웃 버튼 누를 시 403 error 발생시 세션 만료 모달창 띄움
2. 모달 확인시 /login 페이지로 이동

## 서버 → 클라이언트

- Access-Control-Allow-Credentials: true 셋팅
- Access-Control-Allow-Origin: "*" 이 아닌 구체적인 도메인으로 셋팅
  - 요청 헤더의 Oringin, Referer를 참고해서 셋팅하면 되지 않을까 싶음.
- API 응답으로 Set-Cookie http only 쿠키로 SESSIONID를 받음

## 클라이언트 → 서버

- withCredentials true 설정

## 관련 코드

### Login API

```typescript
// login API

export const AuthAPi: IAuthApi = {
  login($elemForm) {
    const formData = new FormData($elemForm);
    formData.set("isKeep", formData.has("isKeep") ? "true" : "false");
    return request({
      url: `${DOMAIN}/login`,
      method: "POST",
      body: formData
    });
  },
  check() {
    return request({
      url: `${DOMAIN}/login/check`,
      method: "GET"
    });
  },
  logout() {
    return request({
      url: `${DOMAIN}/logout`,
      method: "GET"
    });
  }
};
```

### AuthContext

```typescript
// AuthContext.tsx
type AuthContextProviderProps = {
  children: React.ReactNode;
};
type Action =
  | {
      type: "LOGIN";
      username: string;
    }
  | { type: "LOGIN_CHECK"; username: string; isAuth: boolean }
  | { type: "LOGOUT" };
type AuthDispatch = Dispatch<Action>;

const AuthStateContext = createContext<AuthState>({
  username: "",
  isAuthenticated: false
});

const AuthDispatchContext = createContext<AuthDispatch | undefined>(undefined);

function AuthReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        username: action.username,
        isAuthenticated: true
      };
    case "LOGIN_CHECK":
      return {
        ...state,
        username: action.username,
        isAuthenticated: action.isAuth
      };
    case "LOGOUT":
      return {
        ...state,
        username: "",
        isAuthenticated: false
      };
    default:
      throw new Error("Unhandled action");
  }
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [checkState, subject$] = useApiObservable(AuthAPi.check, false);
  useEffect(() => {
    subject$.next();
  }, [subject$]);

  const [authState, dispatch] = useReducer(AuthReducer, {
    username: "",
    isAuthenticated: false
  });

  const loginCheckSuccess = checkState.success;
  const loginCheckError = checkState.error;
  const loginCheckLoading = checkState.isLoading;

  if (!loginCheckSuccess && !loginCheckError && !loginCheckLoading) return null;

  const loginCheckResponse = (loginCheckSuccess?.response || {
    valid: false
  }) as CheckResponse;

  if (loginCheckResponse.valid) {
    // dispatch({ type: "LOGIN_CHECK", username: "merlin.ho", isAuth: true });
    authState.isAuthenticated = true;
    authState.username = loginCheckResponse.name || "";
  }
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={authState}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
}

export function useAuthState() {
  const state = useContext(AuthStateContext);
  return state;
}

export function useAuthDispatch() {
  const dispatch = useContext(AuthDispatchContext);
  if (!dispatch) throw new Error("AuthDispatchContext value not found");
  return dispatch;
}
```

### Login

```typescript
// Login.tsx

const [loginState, subject$] = useApiObservable(AuthAPi.login, false);
const authDispatch = useAuthDispatch();

const onSubmit = (e: React.FormEvent) => {
  if (e.currentTarget !== null) {
    subject$.next(e.currentTarget as HTMLFormElement);
  }
};

const resultLoginStatus = loginStatus(loginState);
if (resultLoginStatus.isLoginSuccess) {
  authDispatch({
    type: "LOGIN",
    username: resultLoginStatus.username
  });
  // 리다이렉트
  const { from } = (location.state as { from: { pathname: string } }) || {
    from: { pathname: "/" }
  };
  return <Redirect to={from} />;
  // return <Redirect to={{ ...from, state: { isAuth: true } }} />;
}

```

### PrivateRoute

```typescript
// PrivateRoute.tsx

type PrivateRouteProps = {
  // isLoginCheck: boolean;
} & RouteProps;

function PrivateRoute({
  component: Component,
  // isLoginCheck,
  render,
  ...rest
}: PrivateRouteProps) {
  const { isAuthenticated } = useAuthState();
  return (
    <Route
      {...rest}
      render={({ ...rest }) => {
        if (isAuthenticated) {
          return render
            ? render({ ...rest })
            : Component && <Component {...rest}></Component>;
        }

        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: rest.location }
            }}
          ></Redirect>
        );
      }}
    />
  );
}

export default PrivateRoute;

```

### AuthLink

```typescript
// AuthLink.tsx

type AuthLinkProps = {
  children: React.ReactNode;
} & NavLinkProps &
  RouteComponentProps;

function AuthLink({
  children,
  history,
  to,
  staticContext,
  ...rest
}: AuthLinkProps) {
  const modalDispatch = useModalDispatch();
  // const authDispatch = useAuthDispatch();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();

    AuthAPi.check().subscribe(result => {
      const checkSuccess = result.success;
      const responseStatus = checkSuccess?.response as
        | CheckResponse
        | undefined;
      const isLoginSession = responseStatus || { valid: false };
      if (isLoginSession.valid) {
        return history.push(to as string);
      }
      // Todo: result.error가 나왔을 시에도 어떤 처리를 해놔야..
      modalDispatch({ type: "OPEN", modalType: "SESSION_EXPIRE" });
      // authDispatch({ type: "LOGOUT" });
    });
  };

  return (
    <NavLink to={to} {...rest} onClick={onClick}>
      {children}
    </NavLink>
  );
}

export default withRouter(AuthLink);

```

### Logout

```typescript
// logout 일부

const [logoutState, subject$] = useApiObservable(AuthAPi.logout);

const authDispatch = useAuthDispatch();
const modalDispatch = useModalDispatch();

const logout = (e: React.MouseEvent) => {
  e.preventDefault();
  subject$.next();
};

const logoutSuccess = logoutState.success?.status as number | undefined;
const logoutError = logoutState.error;
if (logoutSuccess === 200) {
  authDispatch({ type: "LOGOUT" });
  return <Redirect to={"/login"} />;
}

if (logoutError?.status === 403) {
  modalDispatch({ type: "OPEN", modalType: "SESSION_EXPIRE" });
}
```
