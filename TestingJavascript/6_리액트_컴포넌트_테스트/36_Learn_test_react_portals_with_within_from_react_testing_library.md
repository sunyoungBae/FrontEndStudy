# 리액트 테스팅 라이브러리에서 리액트 포탈 테스트

특정 범위만 검사하고 싶다면 `within`을 사용해 검사 범위를 제한할 수 있다.
이 외에 `render`의 두번쩨 파라미터로 `baseElemet`를 지정할 수 도 있다.

## 테스트 대상 컴포넌트

간단한 `Modal`을 생성한다.

1. 마운트시 엘리먼트를 생성하여 `document`에 추가하고 언마운트시 제거한다.
2. `ReactDOM.createPortal`을 사용해 생성한 엘리먼트에 `children` 내용을 추가한다.

파일 : `react-testing-library-course/src/modal.js`

```js
import * as React from 'react';
import ReactDOM from 'react-dom';

let modalRoot = document.getElementById('modal-root');
if (!modalRoot) {
  modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
}

// don't use this for your modals.
// you need to think about accessibility and styling.
// Look into: https://ui.reach.tech/dialog
function Modal({ children }) {
  const el = React.useRef(document.createElement('div'));
  React.useLayoutEffect(() => {
    const currentEl = el.current;
    modalRoot.appendChild(currentEl);
    return () => modalRoot.removeChild(currentEl);
  }, []);
  return ReactDOM.createPortal(children, el.current);
}

export { Modal };
```

## 테스트 작성

`Modal`을 테스트 해보자. `within`을 사용해 검사 범위를 제한할 수 있다.

파일 : `react-testing-library-course/__tests__/portals.js`

```js
import * as React from 'react';
import { render, within } from '@testing-library/react';
import { Modal } from '../modal';

test('modal shows the children', () => {
  // 1. children이 존재하는 모달을 렌더링한다.
  render(
    <Modal>
      <div data-testid='test' />
    </Modal>
  );
  // 2. document 전체를 검사할 수도 있지만, Modal은 modal-root에서만 생성되므로 modal-root 내부만 확인하도록 `within`을 사용해 검사 범위를 제한한다.
  const { getByTestId } = within(document.getElementById('modal-root'));
  expect(getByTestId('test')).toBeInTheDocument();
});
```
