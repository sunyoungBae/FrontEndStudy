# 커스텀 리액트 훅 테스트의 중복을 줄이기 위한 설정 함수 작성

## 테스트 대상 컴포넌트

`initialCount`, `step`을 파라미터로 받아 현재 `count`와 증가/감소 함수를 반환하는 커스텀 훅이다.

파일 : `react-testing-library-course/src/use-conunter`

## 테스트 작성

테스트를 추가하면 중복된 로직이 생긴다. 이를 설정 함수로 작성해서 중복을 줄여보자.

파일 : `react-testing-library-course/__tests__/custom-hook-02.js`

1.테스트 추가

```js
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { useCounter } from '../use-counter';

test('exposes the count and increment/decrement functions', () => {
  let result;
  function TestComponent() {
    result = useCounter();
    return null;
  }
  render(<TestComponent />);
  expect(result.count).toBe(0);
  act(() => result.increment());
  expect(result.count).toBe(1);
  act(() => result.decrement());
  expect(result.count).toBe(0);
});

// new test
test('allows customization of the initial count', () => {
  let result;
  function TestComponent() {
    result = useCounter({ initialCount: 3 });
    return null;
  }
  render(<TestComponent />);
  expect(result.count).toBe(3);
});

// new test
test('allows customization of the step', () => {
  let result;
  function TestComponent() {
    result = useCounter({ step: 2 });
    return null;
  }
  render(<TestComponent />);
  expect(result.count).toBe(0);
  act(() => result.increment());
  expect(result.count).toBe(2);
  act(() => result.decrement());
  expect(result.count).toBe(0);
});
```

2.설정 함수 추가

```js
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { useCounter } from '../use-counter';

// 1. 설정 함수 생성하고 `initialProps`를 구조 분해할 옵션 객체를 받을 수 있게 한다.
function setup({ initialProps } = {}) {
  const result;
  // 2. `props`을 받을 수 있게 함
  function TestComponent(props) {
    // 3. 결과 객체가 ref 타입이 되도록 하여, 결과 개체가 동일하게 유지되고 현재 값이 증가 및 감소와 같은 재렌더링을 트리거하는 항목을 호출할 때 렌더 간에 변경될 수 있도록 참조 동등성을 유지한다.
    result.current = useCounter(props);
    return null;
  }
  // 2. `initialProps`를 적용
  render(<TestComponent {...initialProps} />);
  return result;
}

test('exposes the count and increment/decrement functions', () => {
  const result = setup();
  render(<TestComponent />);
  expect(result.current.count).toBe(0);
  act(() => result.increment());
  expect(result.current.count).toBe(1);
  act(() => result.decrement());
  expect(result.current.count).toBe(0);
});

test('allows customization of the initial count', () => {
  const result = setup({ initialProps: { initialCount: 3 } });
  render(<TestComponent />);
  expect(result.current.count).toBe(3);
});

test('allows customization of the step', () => {
  const result = setup({ initialProps: { step: 2 } });
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(2);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});
```
