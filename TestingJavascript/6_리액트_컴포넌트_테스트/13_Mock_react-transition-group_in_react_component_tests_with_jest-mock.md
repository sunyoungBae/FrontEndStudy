# 리액트 컴포넌트 테스트에서 jest.mock로 react-transition-group 모킹하기

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/hidden-message.js`

```jsx
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

function Fade(props) {
  return (
    <CSSTransition unmountOnExit timeout={1000} classNames='fade' {...props} />
  );
}

function HiddenMessage({ children }) {
  const [show, setShow] = React.useState(false);
  const toggle = () => setShow((s) => !s);
  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <Fade in={show}>
        <div>{children}</div>
      </Fade>
    </div>
  );
}

export { HiddenMessage };
```

## 테스트 작성

테스트에서 문서가 추가 또는 제거 되었는지 확인하기 전에 1초를 기다리기를 원하지 않는다.
따라서 `react-transition-group`을 모킹할 것이다. 이로 인해 **테스트 시간을 줄일 수 있다**.

파일 : `react-testing-library-course/__tests__/mock-component.js`

```jsx
import * as React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HiddenMessage } from '../hidden-message';

// 모킹
jest.mock('react-transition-group', () => {
  return {
    // HiddenMessage, Fade를 보면 `in`이 true일 때 children이 나타나고, false일 때 없어진다.
    // 이러한 동작을 모킹할 때도 간단히 구현한다.
    CSSTransition: (props) => (props.in ? props.children : null),
  };
});

test('shows hidden message when toggle is clicked', () => {
  const myMessage = 'hello world';
  const { getByText, queryByText } = render(
    <HiddenMessage>{myMessage}</HiddenMessage>
  );
  const toggleButton = getByText(/toggle/i);
  expect(queryByText(myMessage)).not.toBeInTheDocument();
  userEvent.click(toggleButton);
  expect(getByText(myMessage)).toBeInTheDocument();
  userEvent.click(toggleButton);
  expect(queryByText(myMessage)).not.toBeInTheDocument();
});
```
