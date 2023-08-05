# 리액트에서 날짜가 포함된 테스트 드라이브 단언

게시물에는 날짜가 필요하며, 이는 지금 기준으로 생성하면 된다.

## 테스트 대상 컴포넌트

`savePost` 함수 호출 시 Date도 추가하자.

파일 : `react-testing-library-course/src/post-editor-05-dates.js`

```jsx
import * as React from 'react';
import { Redirect } from 'react-router';
import { savePost } from './api';

function Editor({ user }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    const { title, content, tags } = e.target.elements;
    const newPost = {
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((t) => t.trim()),
      // 1. 현재 Date를 가져와 값을 설정한다.
      date: new Date().toISOString(),
      authorId: user.id,
    };
    setIsSaving(true);
    savePost(newPost).then(() => setRedirect(true));
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
    </form>
  );
}

export { Editor };
```

## 테스트 작성

컴포넌트에서 작성한 것처럼 `new Date().toISOString()`를 사용해 비교하면 테스트가 실패된다.

- 밀리초 차이로 인해 실패

테스트에서 fake 날짜를 만드는 데 도움이 되는 라이브러리들이 있지만, 실제로 이를 사용하지 않고 이 동작을 확인할 수 있는 매우 간단한 방법이 있다.

파일 : `react-testing-library-course/__tests__/tdd-05-dates.js`

```js
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Redirect as MockRedirect } from 'react-router';
import { savePost as mockSavePost } from '../api';
import { Editor } from '../post-editor-05-dates';

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  };
});

jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce();
  const fakeUser = { id: 'user-1' };
  render(<Editor user={fakeUser} />);
  const fakePost = {
    title: 'Test Title',
    content: 'Test content',
    tags: ['tag1', 'tag2'],
  };
  // 1. 게시물 작성 전 시간 저장
  const preDate = new Date().getTime();

  screen.getByLabelText(/title/i).value = fakePost.title;
  screen.getByLabelText(/content/i).value = fakePost.content;
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ');
  const submitButton = screen.getByText(/submit/i);

  userEvent.click(submitButton);

  expect(submitButton).toBeDisabled();

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    // 3. string이면 그냥 통과하도록 설정. 이후에 범위 체크 예정
    date: expect.any(String),
    authorId: fakeUser.id,
  });
  expect(mockSavePost).toHaveBeenCalledTimes(1);

  // 2. 저장 버튼을 클릭한 후 시간 저장
  const postDate = new Date().getTime();
  // 4. mockSavePost 호출 인자 중 date를 꺼내기
  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime();
  // 5. 게시글 저장 시간이 1번과 2번 사이에 존재하는 지만 확인한다. 이것으로도 충분하다.
  expect(date).toBeGreaterThanOrEqual(preDate);
  expect(date).toBeLessThanOrEqual(postDate);

  await waitFor(() =>
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/' }, {})
  );
});
```
