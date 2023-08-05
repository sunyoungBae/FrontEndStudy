# `createMemoryHistory`와 함께 리액트 라우터의 Router Provider를 사용해 리액트 컴포넌트 테스트하기

`Link`, `Switch`, `Route` 등이 있는 메인 컴포넌트를 테스트하자.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/main.js`

```js
import * as React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

const About = () => (
  <div>
    <h1>About</h1>
    <p>You are on the about page</p>
  </div>
);
const Home = () => (
  <div>
    <h1>Home</h1>
    <p>You are home</p>
  </div>
);
const NoMatch = () => (
  <div>
    <h1>404</h1>
    <p>No match</p>
  </div>
);

function Main() {
  return (
    <div>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
}

export { Main };
```

## 테스트 작성

중요한 점은 리액트 또는 링크, 스위치, 경로와 같은 외부 DOM 컴포넌트를 렌더링할 때 리액트 라우터 컴포넌트에 의해 노출된 컨텍스트에 액세스해야한다.

- 단순히 라우터 컨텍스트 외부에서 이 Main을 렌더링하려고 하면 작동하지 않는다.
- 따라서 라우터 내에서 기본 컴포넌트를 렌더링해야한다.
  - 이는 컨텍스트가 필요한 컴포넌트가 있을 때마다 컨텍스트 공급자를 사용해 해당 컴포넌트를 렌더링해야하는 일반적인 문제이다.

파일 : `react-testing-library-course/__tests__/react-router-01.js`

```js
import * as React from 'react';
// 2. 에러 발생으로 인해 라우터 추가. 일반적으로는 BrowserRouter를 사용하지만 자체 히스토리 개체를 제공하지 위해 Router를 사용
// Invariant failed: You should not use <Link> outside a <Router>
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Main } from '../main';

test('main renders about and home and I can navigate to those pages', () => {
  // 3. 자체 히스토리를 생성 : 홈화면부터 시작
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    // 2. 에러 발생으로 인해 라우터 추가
    <Router history={history}>
      // 1. Main 컴포넌트를 렌더링
      <Main />
    </Router>
  );
  // 4. 첫화면은 홈화면이어야한다.
  expect(screen.getByRole('heading')).toHaveTextContent(/home/i);
  // 5. about을 누르면 about화면으로 넘어가야한다.
  userEvent.click(screen.getByText(/about/i));
  expect(screen.getByRole('heading')).toHaveTextContent(/about/i);
});
```

TODO : 해당 코드는 현재 프로젝트에서 오류가 발생한다. histoy 버전을 4대로 낮춰서 확인 필요

- [testing-library/example-react-router](https://testing-library.com/docs/example-react-router/)
  - Note: React Router v5 only works with History v4, so make sure you have the correct version of history installed.
