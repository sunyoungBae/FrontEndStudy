# 리액트 훅 테스팅 라이브러리에서 `rerender`를 사용해 커스텀 리액트 훅에 대한 업데이트를 테스트

## 테스트 대상 컴포넌트

`initialCount`, `step`을 파라미터로 받아 현재 `count`와 증가/감소 함수를 반환하는 커스텀 훅이다.

파일 : `react-testing-library-course/src/use-conunter`

## 테스트 작성

커스텀 훅에 대한 옵션이 변경되었을 때 어떤 일이 발생하는 지 테스트하려면 `rerender` 함수를 가져와 사용하면 된다.

파일 : `react-testing-library-course/__tests__/custom-hook-04.js`

```js
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from '../use-counter';

...

test('the step can be changed', () => {
  // 1. rerender 함수 가져오기
  const { result, rerender } = renderHook(useCounter, {
    initialProps: { step: 3 },
  });
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(3);
  // 2. step 옵션을 변경하기 위해 rerender 함수를 사용한다.
  rerender({ step: 2 });
  act(() => result.current.decrement());
  expect(result.current.count).toBe(1);
});
```
