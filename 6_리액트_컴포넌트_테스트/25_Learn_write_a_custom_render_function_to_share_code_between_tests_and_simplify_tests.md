# 테스트 간 코드를 공유하고, 테스트를 단순화 하는 커스텀 렌더 함수 작성하기

테스트에 대한 마지막 리팩터링을 해보자.

테스트를 보는 사람 입장에서 두 테스트 간의 차이점을 신속하게 식별할 수 있게 중복 로직을 제거하면 좋다.

## 테스트 작성

리팩터링을 해보자.

파일 : `react-testing-library-course/__tests__/tdd-08-custom-render.js`

```js
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { build, fake, sequence } from 'test-data-bot';
import { Redirect as MockRedirect } from 'react-router';
import { savePost as mockSavePost } from '../api';
import { Editor } from '../post-editor-08-custom-render';

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

// 1. 중복된 것을 함수로 묶는다.
function renderEditor() {
  // 2. 중복된 부분을 가져온다.
  const fakeUser = userBuilder();
  const utils = render(<Editor user={fakeUser} />);
  const fakePost = postBuilder();

  screen.getByLabelText(/title/i).value = fakePost.title;
  screen.getByLabelText(/content/i).value = fakePost.content;
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ');
  const submitButton = screen.getByText(/submit/i);
  // 3. 객체를 객체를 사용해 각 기능을 반환한다.
  return {
    ...utils,
    submitButton,
    fakeUser,
    fakePost,
  };
}

test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce();
  // 4. 중복 로직을 사용하기 위해 호출한다.
  const { submitButton, fakePost, fakeUser } = renderEditor();
  const preDate = new Date().getTime();

  userEvent.click(submitButton);

  expect(submitButton).toBeDisabled();

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    date: expect.any(String),
    authorId: fakeUser.id,
  });
  expect(mockSavePost).toHaveBeenCalledTimes(1);

  const postDate = new Date().getTime();
  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime();
  expect(date).toBeGreaterThanOrEqual(preDate);
  expect(date).toBeLessThanOrEqual(postDate);

  await waitFor(() =>
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/' }, {})
  );
});

test('renders an error message from the server', async () => {
  const testError = 'test error';
  mockSavePost.mockRejectedValueOnce({ data: { error: testError } });
  // 5. 중복 로직을 사용하기 위해 호출한다.
  const { submitButton } = renderEditor();

  userEvent.click(submitButton);

  const postError = await screen.findByRole('alert');
  expect(postError).toHaveTextContent(testError);
  expect(submitButton).toBeEnabled();
});
```

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/post-editor-08-custom-render.js`
