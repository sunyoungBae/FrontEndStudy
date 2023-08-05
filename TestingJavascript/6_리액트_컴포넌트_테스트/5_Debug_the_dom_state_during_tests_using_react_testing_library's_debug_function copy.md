# React Testing Library의 디버그 기능을 사용해 테스트 중에 DOM 상태 디버그하기

## 테스트 작성

파일 : `react-testing-library-course/__tests__/react-testing-library.js`

`render`함수의 반환 값 중 `debug`를 사용하면 테스트 실행시 특정 시점에 DOM 구조가 어떻게 나타나는 지 확인하는 기능이 있다.

- 특정 DOM 노드만 접근하고 싶으면 인수로 접근할 DOM 노드를 넘기면 된다.
- 이는 테스트 개발을 더 쉬워지게 한다.

```jsx
import * as React from 'react';
import { render } from '@testing-library/react';
import { FavoriteNumber } from '../favorite-number';

test('renders a number input with a label "Favorite Number"', () => {
  const { getByLabelText, debug } = render(<FavoriteNumber />);
  debug();
  const input = getByLabelText(/favorite number/i);
  debug(input); // input의 DOM 구조만 보기
  expect(input).toHaveAttribute('type', 'number');
});
```
