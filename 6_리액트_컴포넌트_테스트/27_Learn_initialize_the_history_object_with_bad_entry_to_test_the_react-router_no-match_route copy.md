# React-router no-match route를 테스트하기 위해 잘못된 항목으로 `history` 개체 초기화하기

사용자가 지원하지 않는 URL로 접속하는 경우에 대해 테스트해보자.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/main.js`

## 테스트 작성

초기 경로를 정의하지 않은 경로를 지정하여 검사한다.

파일 : `react-testing-library-course/__tests__/react-router-02.js`

```js
import * as React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Main } from '../main';

...

test('landing on a bad page shows no match component', () => {
  // 1. 정의하지 않는 경로를 히스토리로 지정
  const history = createMemoryHistory({
    initialEntries: ['/something-that-does-not-match'],
  })
  render(
    <BrowserRouter>
      <Main />
    </BrowserRouter>,
  )
  // 2. 검사
  expect(screen.getByRole('heading')).toHaveTextContent(/404/i)
})
```
