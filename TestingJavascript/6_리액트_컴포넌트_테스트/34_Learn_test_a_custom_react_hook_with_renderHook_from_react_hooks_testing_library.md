# 리액트 훅 테스팅 라이브러리의 renderHook을 사용하여 커스텀 리액트 훅 테스트

## 테스트 대상 컴포넌트

`initialCount`, `step`을 파라미터로 받아 현재 `count`와 증가/감소 함수를 반환하는 커스텀 훅이다.

파일 : `react-testing-library-course/src/use-conunter`

## 테스트 작성

앞서 생성한 `setup` 함수 등은 `@testing-library/react-hooks`로 이미 지원한다.
이를 사용해보자.

파일 : `react-testing-library-course/__tests__/custom-hook-03.js`

```js
// 1. 라이브러리 가져오기
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from '../use-counter';

test('exposes the count and increment/decrement functions', () => {
  // 2. setup을 제거하고 renderHook 사용하기
  // 매개 변수의 첫번째로 테스트할 훅을 설정하고, 두번째로 `initialProp`을 설정할 수 있다.
  const { result } = renderHook(useCounter);
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});

test('allows customization of the initial count', () => {
  const { result } = renderHook(useCounter, {
    initialProps: { initialCount: 3 },
  });
  expect(result.current.count).toBe(3);
});

test('allows customization of the step', () => {
  const { result } = renderHook(useCounter, { initialProps: { step: 2 } });
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(2);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});
```
