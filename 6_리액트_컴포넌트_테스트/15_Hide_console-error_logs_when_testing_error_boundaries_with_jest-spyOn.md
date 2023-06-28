# jest.spyOn으로 오류 경계 테스팅시 console.error 로그 숨기기

오류 경계를 테스트할 때 콘솔은 React의 console.error 호출로 채워진다.
테스트를 위한 나머지 출력에서 방해가 될 수 있으므로 jest.spyOn으로 정리해보자.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/error-boundary.js`

## 테스트 작성

파일 : `react-testing-library-course/__tests__/error-boundary-02.js`

```js
import * as React from 'react';
import { render } from '@testing-library/react';
import { reportError as mockReportError } from '../api';
import { ErrorBoundary } from '../error-boundary';

jest.mock('../api');

// 1. console.error가 호출돼도 아무것도 하지 않도록 모킹
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// 3. console.error 복구
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

  // 2. 중요한 에러를 놓치지 않는지 확인하기 위해 어설션 추가
  // 예상컨대 JSDOM, React DOM에서 각각 호출된다.
  expect(console.error).toHaveBeenCalledTimes(2);
});
```
