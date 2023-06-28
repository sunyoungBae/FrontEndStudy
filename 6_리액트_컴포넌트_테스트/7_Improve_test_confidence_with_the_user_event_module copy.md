# User Event 모듈로 테스트 신뢰도 향상하기

`@testing-library/user-event` 버전 14에서는 모든 API를 비동기임으로 이를 사용할 때는 모든 테스트를 비동기로 만들고 await를 사용해야 한다.

User Event 모듈은 테스트 라이브러리 도구 제품군의 일부이며 DOM 노드에서 fire event를 사용하는 것보다 사용자가 요소와 상호 작용하는 방식과 더 유사하다. fire event 사용을 리팩토링하여 대체해보자.

## 테스트 작성

사용자가 `input`을 변경할 때 실제로는 focus event -> keydown, keyup,.. 등의 이벤트가 순차적으로 발생된다.
이전 단원에서는 오직 `change`이벤트를 발생시켜도 테스트가 통과되었다. 이는 사용자가 컴포넌트와의 상호작용을 정확히 나타내지 않는것이다. 이는 대부분 잘 동작하지만 가끔 문제가 있을 수 있다.

사용자와의 상호작용과 더 유사하게 테스트하고 싶다면 `import user from '@testing-library/user-event'`를 사용하는 것을 추천한다.

파일 : `react-testing-library-course/__tests__/stat-user-event.js`

여기서 `user.type()`은 내부에서 `fireEvent`를 사용해 keydown, keyup, change 이벤트와 같이 사용자가 입력할 때 일반적으로 발생하는 모든 이벤트를 발생시킨다.

```jsx
import * as React from 'react';
// user 가져오기
import user from '@testing-library/user-event';
import { render, fireEvent } from '@testing-library/react';
import { FavoriteNumber } from '../favorite-number';

test('entering an invalid value shows an error message', () => {
  const { getByLabelText, getByRole } = render(<FavoriteNumber />);
  const input = getByLabelText(/favorite number/i);
  // fireEvent 대신 user를 사용해 input에 10 입력하기
  user.type(input, '10');
  // fireEvent.change(input, { target: { value: '10' } });
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i);
});
```
