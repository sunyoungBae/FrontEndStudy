# React Testing Library로 렌더링 되지 않은 것을 단언하기(Assert)

`query*` API를 사용해 특정 요소가 렌더링 되지 않는 것을 단언할 수 있다.

## 테스트 작성

`get` prefix로 시작하는 API는 매칭 요소를 찾지 못하면 에러가 발생한다.
`query`는 오류를 발생시키는 대신 `null`를 반환하므로 이를 사용한다.

파일 : `react-testing-library-course/__tests__/prop-updates-02.js`

```jsx
import * as React from 'react';
// user 가져오기
import user from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import { FavoriteNumber } from '../favorite-number';

test('entering an invalid value shows an error message', () => {
  const { getByLabelText, getByRole, rerender } = render(<FavoriteNumber />);
  const input = getByLabelText(/favorite number/i);
  user.type(input, '10');
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i);
  rerender(<FavoriteNumber max={10} />);
  // query로 변경
  expect(queryByRole('alert')).toBeNull();
});
```

일반적으로는 `get`prefix API가 훨씬 더 나은 오류 메시지를 표시하므로 이것을 사용하는 것이 좋고, 만약 요소가 렌더링되지 않은 지를 확인하고 싶다면 `query`prefix API를 사용하자.
