# React Testing Library의 fireEvent로 리액트 컴포넌트의 이벤트 핸들러 테스트하기

React Testing Library의 fireEvent 유틸리티는 웹에서 정기적으로 사용하는 모든 이벤트(변경, 클릭 등)를 지원한다. 입력으로 변경 이벤트 핸들러를 테스트하는 방법을 살펴보자.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/favorite-number.js`

입력된 값이 `min`, `max`를 넘기면 `The number is invalid`를 렌더링하는 기능이 있다.
이를 테스트 해보자

## 테스트 작성

파일 : `react-testing-library-course/__tests__/statㄷ.js`

```jsx
import * as React from 'react';
// 1. onChange 이벤트를 일으킬 수 있는 fireEvent 가져오기
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoriteNumber } from '../favorite-number';

test('entering an invalid value shows an error message', () => {
  // 렌더에서 필요한 접근 함수를 받을 수 있다.
  const { getByLabelText, getByRole } = render(<FavoriteNumber />);
  const input = getByLabelText(/favorite number/i);
  // 2. fireEvent를 사용해 `.change`로 설정하려는 값과 대상을 전달 -> 변경 이벤트 발생
  fireEvent.change(input, { target: { value: '10' } });
  // 3. the number is invalid 가 표시되는 지 확인
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i);
});
```
