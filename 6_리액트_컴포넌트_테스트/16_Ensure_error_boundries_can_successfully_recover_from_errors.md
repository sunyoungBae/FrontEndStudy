# 오류 경계가 오류로부터 성공적으로 회복될 수 잇는 지 확인하기

오류 경계에는 지원하는 몇 가지 다른 사용 사례가 있다.
테스트가 이러한 모든 사용 사례를 다루도록 노력해야 하므로 **오류 경계의 복구 기능이 제대로 작동하는지 확인**하는 테스트를 추가하자.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/error-boundary.js`

## 테스트 작성

ErrorBoundary가 잘 동작하는 지 확인하기 위해 <u>다시 시도 기능</u>을 사용해보자.

1. 모의 함수에 대해 `mockClear()`함수를 사용한 후 다시 시도 기능을 사용한다.
2. 이후 이전에 발생한 오류가 모두 복구되었는지 확인한다.(즉, 오류가 발생하지 않는지 확인한다.)

파일 : `react-testing-library-course/__tests__/error-boundary-03.js`

```js
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { reportError as mockReportError } from '../api';
import { ErrorBoundary } from '../error-boundary';

jest.mock('../api');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

afterEach(() => {
  jest.clearAllMocks();
});

function Bomb({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('💣');
  } else {
    return null;
  }
}

test('calls reportError and renders that there was a problem', () => {
  mockReportError.mockResolvedValueOnce({ success: true });
  const { rerender } = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );

  rerender(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>
  );

  const error = expect.any(Error);
  const info = { componentStack: expect.stringContaining('Bomb') };
  expect(mockReportError).toHaveBeenCalledWith(error, info);
  expect(mockReportError).toHaveBeenCalledTimes(1);

  expect(console.error).toHaveBeenCalledTimes(2);

  // 5. role을 사용해 경고가 존재하는지 확인한다.
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"There was a problem."`
  );

  // 4. 3번에서 에러가 발생한다.(위에서 호출된 에러로 인해 1번 호출되었다라는 오류가 나오게 된다.)
  // `mockClear()` 함수를 사용해 초기화 시키면 해결된다.
  console.error.mockClear();
  mockReportError.mockClear();

  // 1. 모든 항목을 다시 렌더링한다.
  rerender(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );

  // 2. try again 버튼을 누르면 1번으로 인해 다시 렌더링된다.
  userEvent.click(screen.getByText(/try again/i));

  // 3. 이때 에러가 발생하지 않아야 한다.
  expect(mockReportError).not.toHaveBeenCalled();
  expect(console.error).not.toHaveBeenCalled();
  // 6. 5번과 반대로 에러 상황일 때의 나타나는 엘리먼트가 나타나지 않아야한다.
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.queryByText(/try again/i)).not.toBeInTheDocument();
});
```
