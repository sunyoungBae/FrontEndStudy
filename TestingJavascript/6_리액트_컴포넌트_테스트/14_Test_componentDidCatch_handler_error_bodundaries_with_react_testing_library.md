# 리액트 테스팅 라이브러리를 사용해 componentDidCatch 핸들러 오류 경계 테스트하기

사용자가 응용 프로그램을 사용하는 동안 오류가 발생하면 모니터링 도구에 정보를 보내 오류를 인식하고 가능한 한 빨리 처리할 수 있도록 할 수 있다.
React Testing Library를 사용하여 이 `componentDidCatch` 오류 경계를 담당하는 컴포넌트를 테스트하는 방법을 살펴보겠습니다.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/error-boundary.js`

`componentDidCatch` 라이프 사이클 함수를 이용해 구현하였으며, 내부에서 `reportError` API를 호출해 서버에 오류를 보고한다.

```jsx
import * as React from 'react';
import { reportError } from './api';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    reportError(error, info);
  }
  tryAgain = () => this.setState({ hasError: false });
  render() {
    return this.state.hasError ? (
      <div>
        <div role='alert'>There was a problem.</div>{' '}
        <button onClick={this.tryAgain}>Try again?</button>
      </div>
    ) : (
      this.props.children
    );
  }
}

export { ErrorBoundary };
```

## 테스트 작성

파일 : `react-testing-library-course/__tests__/error-boundary-01.js`

```js
import * as React from 'react';
import { render } from '@testing-library/react';
// 2.jest.mock로 인해 모킹된 함수 가져오기
import { reportError as mockReportError } from '../api';
import { ErrorBoundary } from '../error-boundary';

// 1.reportError가 실제로 호출되지 않도록 모킹하기
// default : jest 함수로 대체
jest.mock('../api');

// 5. API 모듈에서 가져온 모든 mock가 모든 테스트 후 지운다.
// 다른 테스트에 영향을 끼치지 않기 위해 사용
afterEach(() => {
  jest.clearAllMocks();
});

// 0. 오류 던지기용 컴포넌트 생성
function Bomb({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('💣');
  } else {
    return null;
  }
}

test('calls reportError and renders that there was a problem', () => {
  // reportError는 비동기 함수이므로 프로미스를 반환할 것이다.
  // 3.resolved 값으로 모킹한다.
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

  // 4. 에러가 호출된지 확인. 호출될 정보를 정확히 모르면 null로 설정하고 오류 메시지를 확인 후 이를 이용한다.
  const error = expect.any(Error);
  const info = { componentStack: expect.stringContaining('Bomb') };
  expect(mockReportError).toHaveBeenCalledWith(error, info);
  expect(mockReportError).toHaveBeenCalledTimes(1);
});
```
