# React-router 컴포넌트의 테스트를 단순화하는 커스텀 렌더 함수 생성하기

히스토리 생성, 라우터내 `Main` 렌더링이 중복된다. 이러한 중복은 줄여서 테스트를 단순화하자.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/main.js`

## 테스트 작성

파일 : `react-testing-library-course/__tests__/react-router-02.js`

### 1. 공통 함수 생성

중복 로직에 대해 커스텀 함수를 만든다.

```js
import * as React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
// 2. 기존 렌더링 함수의 명명이 충돌나지 않도록 별칭 사용
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Main } from '../main';

// 1. 새 렌더링 함수 생성 및 공통 부분 옮기기
function render(ui, options = {}) {
  // 4. 경로는 파라미터로 받기
  const history = createMemoryHistory({
    initialEntries: [options.route || '/'],
  });
  // 3. Router 부분만 선언하고 내부는 파라미터로 받기
  return rtlRender(<Router history={history}>{ui}</Router>, options);
}

test('main renders about and home and I can navigate to those pages', () => {
  render(<Main />);
  expect(screen.getByRole('heading')).toHaveTextContent(/home/i);
  userEvent.click(screen.getByText(/about/i));
  expect(screen.getByRole('heading')).toHaveTextContent(/about/i);
});

test('landing on a bad page shows no match component', () => {
  render(<Main />), { route: '/something-that-does-not-match' };
  expect(screen.getByRole('heading')).toHaveTextContent(/404/i);
});
```

### 2. 유용한 기능을 추가해 다음 사람이 더 유연하게 쓸 수 있도록 수정

1. 중복 로직에 대해 react-testing-library의 렌더링 메서드와 유사한 API가 있는 커스텀 함수를 생성하여 테스트를 단순화 한다.
2. Wrapper 컴포넌트를 사용해 리렌더링시에도 라우터 내부에서 계속 래핑되도록 한다.
3. 그 후 `rtlRender`의 반환값과 history를 반환한다.

모든 테스트에 접근할 수 있는 코드 베이스로 `render` 유틸리티 타입을 넣을 수 있게 하고??, 해당 파일을 쉽게 import할 수 있도록 설정하는 것을 일반적으로 추천한다.

???? 해석이 어렵군요

> 원문
>
> 04:46 I would recommend that normally you put this type of utility render in a file somewhere in your project that's accessible to all of your tests in your code base and configure just to make it really easy to import that file anywhere you want using the module directory's configuration option.
>
> 05:01 Then you can actually have that file just re-export all the things that are coming from testing library react so people can import your file rather than testing library react and they'll have all of the set up for them automatically.

```js
import * as React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Main } from '../main';

// 2. spread 연산자를 사용해서 route와 그 나머지 옵션을 분리한다.
// 3. route의 기본값을 설정한다.
// 4. 히스토리도 커스텀할 수 있게 options으로 받게 한다.
function render(
  ui,
  {
    route = '/',
    history = createMemoryHistory({
      initialEntries: [route],
    }),
    ...renderOptions
  } = {}
) {
  // 1. 현재 상태로는 리렌더링하기 위해 라우터 및 히스토리에 액세스할 수 없다.
  // 이를 지원하기위해 `options`에 spread 연산자를 사용한다.
  // 또한 `Wrapper`를 생성해 사용한다. 이는 항상 래퍼를 내부에서 추가하므로 따로 전달할 필요가 없다는 것을 의미한다.
  // 리렌더링을 호출하여 다시 렌더링하는 모든 UI이도 항상 래퍼 내부에 존재하며, 이는 렌더 유틸리티를 더 유연하게 만들어준다.
  function Wrapper({ children }) {
    return <Router history={history}>{children}</Router>;
  }
  // 5. 생성한 history도 반환할 수 있게 한다.
  return {
    ...rtlRender(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
    history,
  };
}

test('main renders about and home and I can navigate to those pages', () => {
  render(<Main />);
  expect(screen.getByRole('heading')).toHaveTextContent(/home/i);
  userEvent.click(screen.getByText(/about/i));
  expect(screen.getByRole('heading')).toHaveTextContent(/about/i);
});

test('landing on a bad page shows no match component', () => {
  render(<Main />), { route: '/something-that-does-not-match' };
  expect(screen.getByRole('heading')).toHaveTextContent(/404/i);
});
```
