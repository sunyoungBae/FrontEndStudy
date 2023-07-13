# 폼 제출시 모킹된 리액트 라우터의 리다이렉트 컴포넌트 테스트 드라이브

게시물이 성공적으로 저장되면 홈페이지를 리다이렉트하고싶다.
React Router의 Redirect 컴포넌트를 사용해 사용자를 홈페이지로 보낸다.

## 테스트 작성

먼저 이에 대한 테스트를 작성하자.

파일 : `react-testing-library-course/__tests__/tdd-04-router-redirect.js`

```js
import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// 2. Redirect 컴포넌트를 가져오고, 이때 이 컴포넌트는 1번에 의해 모킹되므로 alias를 사용해 이를 표시한다.
import {Redirect as MockRedirect} from 'react-router'
import {savePost as mockSavePost} from '../api'
import {Editor} from '../post-editor-04-router-redirect'

// 1. jest.mock를 사용해 react-router를 모킹하고, Redirect의 모킹한 것을 반환한다.
jest.mock('react-router', () => {
  return {
    // Redirect 컴포넌트에 대한 단언을 생성할 수 있다는 것이 중요한 것임으로, 반환은 null로 해도 상관없다.
    Redirect: jest.fn(() => null),
  }
})

jest.mock('../api')

afterEach(() => {
  jest.clearAllMocks()
})

// 5. 비동기 테스트를 위해 `async`를 추가한다.
test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()
  const fakeUser = {id: 'user-1'}
  render(<Editor user={fakeUser} />)
  const fakePost = {
    title: 'Test Title',
    content: 'Test content',
    tags: ['tag1', 'tag2'],
  }
  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  const submitButton = screen.getByText(/submit/i)

  userEvent.click(submitButton)

  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    authorId: fakeUser.id,
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)

  // 3. 리다이렉션이 `/`로 호출되는지 확인한다.
  // `savePost`가 성공하면 리다이렉션이 실행되는 데, 이 콜백은 비동기적으로 발생한다.
  // 만약 동기적으로 테스트를 작성한 경우, 리다이렉션 렌더링은 테스트가 완료된 후에 발생한다.
  // 따라서 `savePost`가 완료될 때까지 기다려야하므로 `waitFor`을 사용한다.
  await waitFor(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
  // 4. 한 번만 호출되었는 지도 확인한다.
  await waitFor(() => expect(MockRedirect).toHaveBeenCalledTimes(1)
})
```

## 테스트 대상 컴포넌트

테스트 결과가 파란색이 되도록 코드를 수정하자.

파일 : `react-testing-library-course/src/post-editor-04-router-redirect.js`

```jsx
import * as React from 'react';
// 1. 리다이렉션 컴포넌트를 가져온다.
import { Redirect } from 'react-router';
import { savePost } from './api';

function Editor({ user }) {
  const [isSaving, setIsSaving] = React.useState(false);
  // 3. 상태로 리다이렉션 여부를 관리한다.
  const [redirect, setRedirect] = React.useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    const { title, content, tags } = e.target.elements;
    const newPost = {
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((t) => t.trim()),
      authorId: user.id,
    };
    setIsSaving(true);
    // 4. 게시물 저장이 성공하면 리다이렉션 상태를 true로 변경한다.
    savePost(newPost).then(() => setRedirect(true));
  }
  // 2. 리다이렉션이 true이면 리다이렉션을 실행한다.
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
    </form>
  );
}

export { Editor };
```
