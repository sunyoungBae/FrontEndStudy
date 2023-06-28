# react-testing-library를 사용해 렌더링 및 리액트 테스트 작성하기

## 테스트 작성

파일 : `react-testing-library-course/__tests__/react-testing-library.js`

### 1. `render` 함수로 분리하기

`render` 함수는 테스트할 ui를 렌더링 후 테스트에 필요한 기본적인 것(`container, quries`)들을 반환한다.
이 함수는 유용하며, 모든 테스트에서 사용될 수 있다.

```jsx
import * as React from 'react';
import ReactDOM from 'react-dom';
import { getQueriesForElement } from '@testing-library/dom';
import { FavoriteNumber } from '../favorite-number';

function render(ui) {
  const container = document.createElement('div');
  ReactDOM.render(ui, container);
  const queries = getQueriesForElement(container);
  return { container, ...quries };
}

test('renders a number input with a label "Favorite Number"', () => {
  const { getByLabelText } = render(<FavoriteNumber />);
  const input = getByLabelText(/favorite number/i);
  expect(input).toHaveAttribute('type', 'number');
});
```

### 2. `react-testing-library`의 `render` 사용하기

직접 만들어 본 `render`함수는 실제로 `react-testing-library`의 `render`와 동일하다. 이걸로 대체해보자.

```jsx
import * as React from 'react';
import { render } from '@testing-library/react';
import { FavoriteNumber } from '../favorite-number';

test('renders a number input with a label "Favorite Number"', () => {
  const { getByLabelText } = render(<FavoriteNumber />);
  const input = getByLabelText(/favorite number/i);
  expect(input).toHaveAttribute('type', 'number');
});
```
