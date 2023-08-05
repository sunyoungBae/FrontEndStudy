# 리액트의 act 유틸리티와 테스트 컴포넌트를 사용해 커스텀 리액트 훅 테스트

커스텀 훅(`useCounter`)이 있고, 반환되는 증가/감소 함수를 통해 카운트 상태를 업데이트하는지 확인하려고한다.

훅은 컴포넌트의 렌더링 단계에서 실행되어야 하기 때문에 훅을 사용하고 컴포넌트를 렌더링하는 간단한 컴포넌트를 생성한다.

한 가지 주의할 점은 **테스트에서 상태 업데이트가 있을 때마다 `act` 호출로 감싸야한다**.

일반적으로는 `act`를 사용할 필요가 없다.

여기서 `act`를 사용해야하는 이유는 여기서 호출하는 증가 함수는 내부에서 자체적으로 상태 업데이터를 호출하기 때문이다.
이는 테스팅 라이브러리에서 자동으로 되지 않는 것 중 하나이기 때문에 수동으로 직접 해야한다.

## 테스트 대상 컴포넌트

`initialCount`, `step`을 파라미터로 받아 현재 `count`와 증가/감소 함수를 반환하는 커스텀 훅이다.

파일 : `react-testing-library-course/src/use-conunter`

## 테스트 작성

일반적으로 커스텀 훅을 하나의 컴포넌트에서 사용하는 경우, 훅을 직접 테스트하는 것이 아닌 해당 컴포넌트만 테스트하는 것이 좋다.

앱 전체에서 사용되는 라이브러리 또는 훅이 있는 경우, 이를 개별적으로 테스트하는 것이 유용하다.(현재 할 일)

파일 : `react-testing-library-course/__tests__/custom-hook-01.js`

```js
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { useCounter } from '../use-counter';

test('exposes the count and increment/decrement functions', () => {
  // 2. 외부에서 `useCounter`의 반환값에 접근할 수 있어야하기 때문에 결과용 변수를 생성한다.
  let result;
  // 1. 훅을 호출하기 위해 테스트 컴포넌트를 생성 후, 내부에서 `useCounter`를 호출한다.
  function TestComponent() {
    // 3. 2번의 변수에 결과를 넣는다.
    result = useCounter();
    // 4. 컴포넌트는 무조건 반환해야하므로 `null`를 넣는다.
    return null;
  }
  // 5. 테스트 컴포넌트를 렌더링한다.
  render(<TestComponent />);
  // 6. 단언을 추가한다.
  expect(result.count).toBe(0);
  // 7. 훅에서 반환한 함수는 `act`로 감싸서 실행한다. 그러지 않으면 아래와 같은 경고가 나타난다.
  // Warning: An update to null inside a test was not wrapped in act(...).
  // When testing, code that cases React state updates should be wrapped into act(...)
  act(() => result.increment());
  expect(result.count).toBe(1);
  act(() => result.decrement());
  expect(result.count).toBe(0);
});
```
