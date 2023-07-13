# 초기화 상태로 Redux에 연결된 React 컴포넌트 테스트

`store`를 특정 상태로 만들어, 바로 초기화한 다음 테스트를 할 수 있다.
이는 모든 단계를 거치지 않고도 테스트에 필요한 상태를 얻는 데 정말 유용한 방법이다.

이때 주의할 점은 처음부터 이 상태에 들어갈 수 있는지 확인하는 테스트가 하나 이상 있어야한다는 것이다.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src`

- `redux-store.js`
- `redux-reducer.js`
- `redux-counter.js` : 위에 선언된 리덕스를 사용하는 컴포넌트

## 테스트 작성

파일 : `react-testing-library-course/__tests__/redux-02.js`

```js
import * as React from 'react';
// 1. `createStore` 가져오기
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../redux-counter';
// 4. 3번에서 생성한 `store`와 충돌나므로 별칭 사용
import { store as appStore } from '../redux-store';
// 2. `reducer` 가져오기
import { reducer } from '../redux-reducer';

test('can render with redux with defaults', () => {
  render(
    // 4. 별칭 사용
    <Provider store={appStore}>
      <Counter />
    </Provider>
  );
  userEvent.click(screen.getByText('+'));
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('1');
});

test('can render with redux with custom initial state', () => {
  // 3. `createStore`, `reducer`, 초기 값을 사용해 자체 store 생성
  const store = createStore(reducer, { count: 3 });
  // 5. 3번에서 생성한 `store`를 사용함
  render(
    <Provider store={store}>
      <Counter />
    </Provider>
  );
  // 6. - 버튼 클릭하면 값이 1만큼 감소해야한다.
  userEvent.click(screen.getByText('-'));
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('2');
});
```
