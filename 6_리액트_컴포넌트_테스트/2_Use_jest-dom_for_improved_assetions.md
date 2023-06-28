# 향상된 어설션을 위해 jest-dom 사용하기

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/favorite-number.js`

`FavoriteNumber` 컴포넌트는 `<label htmlFor="forvorite-number">`와 `<input type="number">`를 렌더링한다.

## 테스트 작성

파일 : `react-testing-library-course/__tests__/jest-dom.js`

코드에 오류가 있을 때 무엇이 잘못되었는지를 정확히 파악하기 위해, 더 도움이 될 수 있는 어설션을 얻으면 더 좋을 것이다.
`jest-dom`라이브러리는 `expect`를 확장하여 사용할 수 있고, DOM node에 구체적인 어셜션을 추가할 수 있다.
또한 에러메시지가 구체적이여서 도움이 된다.

이때 `expect` 확장은 `eact-testing-library-course/tests/setup-env.js`에서 설정하여 각 테스트 파일마다 일일히 설정하지 않아도 된다.

```jsx
import * as React from 'react';
import ReactDOM from 'react-dom';
import { FavoriteNumber } from '../favorite-number';

test('renders a number input with a label "Favorite Number"', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FavoriteNumber />, div);
  expect(div.querySelector('input')).toHaveAttribute('type', 'number');
  expect(div.querySelector('label')).toHaveTextContent('Favorite Number');
});
```
