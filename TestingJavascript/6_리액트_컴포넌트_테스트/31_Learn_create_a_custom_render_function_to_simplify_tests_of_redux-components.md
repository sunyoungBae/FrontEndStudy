# Redux 컴포넌트의 테스트를 단순화하는 커스텀 렌더 함수 생성하기

Redux를 사용하는 앱을 실행하는 경우 모든 컴포넌트에 대한 store를 제공하는 이런 작업을 많이할 가능성이 높다.
따라서 이를 위한 유틸리티를 작성해보자.

- `Wrapper`를 사용해 리렌더링시 `Provider`를 추가 선언하지 않고 동일한 UI를 다시 렌더링할 수 있다.
- 반환 값을 객체로 만들어 `rtlRender`의 반환값과 `store`를 모두 반환할 수 있다.
  - 즉, `store`도 외부에서 단언할 수 있다. `store`는 구현 세부 사항이기 때문에 일반적으로 권장하지는 않지만 필요한 상황이 있을 수 있으므로 활성화한다.

이러한 유틸리티를 코드 베이스로 사용하면 `testing-library/react`대신 해당 모듈을 가져올 수 있고, Redux Provider가 추가되었는 지 여부에대해 걱정하지 않아도 된다. 따라서 테스트 코드 생성을 쉽게 만들어 준다.

- 특히 Provider가 무엇이던 추가할 수 있다.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src`

- `redux-store.js`
- `redux-reducer.js`
- `redux-counter.js` : 위에 선언된 리덕스를 사용하는 컴포넌트

## 테스트 작성

파일 : `react-testing-library-course/__tests__/redux-03.js`

```js
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
// 2. 커스텀 함수명과 중복되기 때문에 별칭을 사용한다.
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../redux-counter';
// 6. 스토어 초기값을 생성하는 로직이 있으므로 이는 제거한다.
// import { store as appStore } from '../redux-store';
import { reducer } from '../redux-reducer';

// 1. 커스텀 함수를 생성한다.
// 7. 두번째 파라미터를 spread하여 `rtlRender`에서 사용할 것과 아닌 것을 나눈다.
function render(
  ui,
  // 8. 5번 로직을 옵션으로 추가한다. 이에 대한 사용자의 커스텀 동작을 커버할 수 있다.
  {
    initialState,
    store = createStore(reducer, initialState),
    ...rtlOptions
  } = {}
) {
  // 5. 스토어 초기값이 필요한 곳이 있으므로 이를 처리할 로직을 추가한다.
  // const store = createStore(reducer, initialState);

  // 9. `Wrapper`를 생성해 children을 받게 한다.
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  // 3. 파라미터를 받아 렌더 동작을 수행한다.
  // 11. 반환 값을 객체로 만들어 `rtlRender`의 반환값과 `store`를 모두 반환할 수 있다.
  return {
    ...rtlRender(
      // 4. 공통 로직인 Provider를 래퍼로 두고 ui는 따로 받는다.
      // <Provider store={store}>{ui}</Provider>,
      ui,
      {
        // 10. 9번을 래퍼 옵션으로 지정한다.
        wrapper: Wrapper,
        ...rtlOptions,
      }
    ),
    store,
  };
}

test('can render with redux with defaults', () => {
  render(<Counter />);
  userEvent.click(screen.getByText('+'));
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('1');
});

test('can render with redux with custom initial state', () => {
  // 5. 스토어 초기값이 필요하므로 파라미터로 넣는다.
  render(<Counter />, { initialState: { count: 3 } });
  userEvent.click(screen.getByText('-'));
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('2');
});
```

결론적으로 아래의 코드와 같다.

```js
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../redux-counter';
import { reducer } from '../redux-reducer';

// this is a handy function that I normally make available for all my tests
// that deal with connected components.
// you can provide initialState or the entire store that the ui is rendered with
function render(
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return {
    ...rtlRender(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
}

test('can increment the value', () => {
  render(<Counter />);
  userEvent.click(screen.getByText('+'));
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('1');
});

test('can decrement the value', () => {
  render(<Counter />, {
    initialState: { count: 3 },
  });
  userEvent.click(screen.getByText('-'));
  expect(screen.getByLabelText(/count/i)).toHaveTextContent('2');
});
```
