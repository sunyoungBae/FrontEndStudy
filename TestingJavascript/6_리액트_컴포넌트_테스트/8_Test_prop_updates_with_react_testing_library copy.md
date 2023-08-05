# React Testing Library로 Prop 업데이트 테스트 하기

때로는 렌더링된 컴포넌트의 prop을 변경하고 해당 prop 변경이 발생한 후 렌더링되는 항목에 대한 어설션을 만드는 것이 유용할 수 있다. React Testing Library로 이 작업을 수행하는 방법을 살펴보자.

## 테스트 작성

하단에 `<FavoriteNumber max={10}/>`으로 리렌더링하고 싶다고 하자.

파일 : `react-testing-library-course/__tests__/prop-updates-01.js`

```jsx
import * as React from 'react';
// user 가져오기
import user from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import { FavoriteNumber } from '../favorite-number';

test('entering an invalid value shows an error message', () => {
  // 렌더의 반환 값으로 리렌더 함수를 얻을 수 있다.
  const { getByLabelText, getByRole, rerender, debug } = render(
    <FavoriteNumber />
  );
  const input = getByLabelText(/favorite number/i);
  // fireEvent 대신 user를 사용해 input에 10 입력하기
  user.type(input, '10');
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i);
  // 리렌더 전 후 DOM 차이를 확인하기 위해 `debug`를 사용한다.
  debug();
  // 리렌더
  rerender(<FavoriteNumber max={10} />);
  debug();
});
```

리렌더링은 기존 UI가 있던 컨테이너의 UI를 리렌더링하므로 prop이 업데이트 되었을 때의 상황을 테스트할 수 있다.
