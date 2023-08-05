# 리액트 테스팅 라이브러리로 에러 상태 테스트 드라이브

`savePost` 요청 실패 테스트를 작성하고, 에러 핸들러를 구현해보자.

## 테스트 작성

먼저 이에 대한 테스트를 작성하자.

파일 : `react-testing-library-course/__tests__/tdd-07-error-state.js`

```js
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { build, fake, sequence } from 'test-data-bot';
import { Redirect as MockRedirect } from 'react-router';
import { savePost as mockSavePost } from '../api';
import { Editor } from '../post-editor-07-error-state';

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  };
});
jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

const postBuilder = build('Post').fields({
  title: fake((f) => f.lorem.words()),
  content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake((f) => [f.lorem.word(), f.lorem.word(), f.lorem.word()]),
});

const userBuilder = build('User').fields({
  id: sequence((s) => `user-${s}`),
});

...

// 1. 서버를 활용하므로 비동기로 작성한다.
test('renders an error message from the server', async () => {
  // 3. reject 되었을 때의 반환할 데이터를 작성한다.
  // 8. 리팩터링 : 중복 데이터를 막기위해 변수 생성하여 사용
  const testError = 'test error';
  mockSavePost.mockRejectedValueOnce({ data: { error: testError } });
  // 2. 대부분의 로직은 앞 테스트에서 사용한 것을 기반으로 작성한다.
  const fakeUser = userBuilder();
  render(<Editor user={fakeUser} />);

  // 7. 리팩터링 : `fakePost`로 요소에 내용을 입력하는 부분은 필요없으므로 지운다.

  const submitButton = screen.getByText(/submit/i);

  userEvent.click(submitButton);

  // 4. 비동기로 `postError`가 나타날때 까지 기다린다. 이 때문에 `findByRole`을 사용한다.
  const postError = await screen.findByRole('alert');
  // 5. 테스트 에러 메시지가 존재하는 지 확인한다.
  expect(postError).toHaveTextContent(testError);
  // 6. 제출 버튼이 활성화되는 지 확인한다.
  expect(submitButton).toBeEnabled();
});
```

## 테스트 대상 컴포넌트

테스트 결과가 파란색이 되도록 코드를 수정하자.

- reject 핸들러를 구현하자.

파일 : `react-testing-library-course/src/post-editor-07-error-state.js`

```jsx
import * as React from 'react';
import { Redirect } from 'react-router';
import { savePost } from './api';

function Editor({ user }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  // 2. 에러 객체를 저장할 상태 생성
  const [error, setError] = React.useState(null);
  function handleSubmit(e) {
    e.preventDefault();
    const { title, content, tags } = e.target.elements;
    const newPost = {
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((t) => t.trim()),
      date: new Date().toISOString(),
      authorId: user.id,
    };
    setIsSaving(true);
    savePost(newPost).then(
      () => setRedirect(true),
      // 1. 오류 콜백을 추가
      (response) => {
        // 4. 제출 버튼이 활성화되도록 수정
        setIsSaving(false);
        // 3. 에러 상태 저장
        setError(response.data.error);
      }
    );
  }
  if (redirect) {
    return <Redirect to='/' />;
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='title-input'>Title</label>
      <input id='title-input' name='title' />
      <label htmlFor='content-input'>Content</label>
      <textarea id='content-input' name='content' />
      <label htmlFor='tags-input'>Tags</label>
      <input id='tags-input' name='tags' />
      <button type='submit' disabled={isSaving}>
        Submit
      </button>
      // 4. 에러시 출력할 요소 추가
      {error ? <div role='alert'>{error}</div> : null}
    </form>
  );
}

export { Editor };
```
