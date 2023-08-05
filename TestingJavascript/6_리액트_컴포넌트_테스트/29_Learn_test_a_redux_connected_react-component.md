# Redux에 연결된 React 컴포넌트 테스트

많은 사람들은 리듀서와 액션 생성자를 분리하여 테스트하려고 하는데, 이는 엣지 케이스 테스트에서는 괜찮다.
하지만 대부분의 경우, 이 **두 가지를 함께하여 통합 테스트하면 좋은 커버리지를 얻을 수 있다**.

여기서는 Counter 컴포넌트를 테스트할 때 Redux를 사용하지 않는 것 처럼 컴포넌트와 상호작용을 한다.

- Redux를 구현 세부사항으로만 여김
- 그래서 다른 상태 관리 솔루션으로 변경되더라도 최소한의 수정만 하면 된다.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src`

- `redux-store.js`
- `redux-reducer.js`
- `redux-counter.js` : 위에 선언된 리덕스를 사용하는 컴포넌트

## 테스트 작성

파일 : `react-testing-library-course/__tests__/redux-01.js`

```js
import * as React from 'react';
// 2.
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../redux-counter';
// 2.
import { store } from '../redux-store';

test('can render with redux with defaults', () => {
  render(
    // 2.에러 발생으로 인해 store가 연결된 Provider 추가
    // Invariant Violation: could not find react-redux context value; please ensure the component is wrapped in a <Provider>
    <Provider store={store}>
      // 1. Counter 렌더링
      <Counter />
    </Provider>
  );
  // 2. plus 버튼 클릭하면 count가 1만큼 증가한다.
  userEvent.click(screen.getByText('+'));
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('1');
});
```
