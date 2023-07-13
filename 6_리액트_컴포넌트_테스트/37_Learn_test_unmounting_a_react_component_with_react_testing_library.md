# 리액트 테스팅 라이브러리를 사용해 리액트 컴포넌트 마운트 해제 테스트

리액트 컴포넌트가 `useEffect` 또는 `useLayoutEffect`의 반환값을 통해 일부 정리 작업을 수행해야할 수도 있다.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/countdown.js`

```js
import * as React from 'react';

function Countdown() {
  const [remainingTime, setRemainingTime] = React.useState(10000);
  const end = React.useRef(new Date().getTime() + remainingTime);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = end.current - new Date().getTime();
      if (newRemainingTime <= 0) {
        clearInterval(interval);
        setRemainingTime(0);
      } else {
        setRemainingTime(newRemainingTime);
      }
    });
    return () => clearInterval(interval);
  }, []);
  return remainingTime;
}

export { Countdown };
```

## 테스트 작성

`Modal`을 테스트 해보자. `within`을 사용해 검사 범위를 제한할 수 있다.

파일 : `react-testing-library-course/__tests__/unmounting.js`

```js
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { Countdown } from '../countdown';

// 3. 2번에서 콘솔 에러를 사용해 체크하므로 이를 모킹한다.
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// 4. 테스트를 서로 격리시킨다.
afterAll(() => {
  console.error.mockRestore();
});

afterEach(() => {
  // 5. 매 테스트 마지막에 모킹 작업을 정리한다.
  jest.clearAllMocks();
  // 6. 가짜 타이머를 정리한다.
  jest.useRealTimers();
});

test('does not attempt to set state when unmounted (to prevent memory leaks)', () => {
  // 6. 실제 컴포넌트의 타이머는 10초 간격이기 때문에 테스트가 끝난 후에 트리거될 것이다. 이때문에 unmount에서  `clearInterval`를 주석처리해도 통과한다.
  // 이를 해결하기 위해 가짜 타이머를 사용한다.
  jest.useFakeTimers();
  // 1. `render` 함수로부터 `unmount`를 가져와서 실행한다.
  const { unmount } = render(<Countdown />);
  unmount();
  // 6. 그리고 `act`로 매핑하여 `runOnlyPendingTimers`를 실행한다.
  act(() => jest.runOnlyPendingTimers());
  // 2. `clearInterval`이 실행되지 않고 끝나면 에러가 발생하므로 이를 통해 단언을 작성한다.
  expect(console.error).not.toHaveBeenCalled();
});
```
