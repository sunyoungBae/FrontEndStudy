# 테스트 데이터 봇으로 테스트에서 생성된 데이터를 사용하여 테스트 유지 관리 기능성 향상

test-data-bot 라이브러리를 사용해 값 생성을 자동화한다.

만약 특정한 값을 지정하고 싶다면, 아래와 같이 재정의할 수 있다.
ex) fakeUser

```js
const fakeUser = userBuilder({ id: 'foo' });
```

## 테스트 작성

파일 : `react-testing-library-course/__tests__/tdd-06-generate-data.js`

```js
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// 1. test-data-bot에서 필요한 것 가져오기
import { build, fake, sequence } from 'test-data-bot';
import { Redirect as MockRedirect } from 'react-router';
import { savePost as mockSavePost } from '../api';
import { Editor } from '../post-editor-06-generate-data';

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  };
});
jest.mock('../api');

afterEach(() => {
  jest.clearAllMocks();
});

// 2. 테스트용 가짜 데이터 구성 선연
const postBuilder = build('Post').fields({
  title: fake((f) => f.lorem.words()),
  // 6. replace 추가
  // `paragraphs`의 반환 값 내부는 실제 줌바꿈에 대해 두 개의 문자로 설정한다.
  // 이 값이 텍스트 영역에 삽입되면 그 중 하나가 제거된다.
  // 그래서 이를 `replace`를 사용해 빈 문자로 변경한다.
  content: fake((f) => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake((f) => [f.lorem.word(), f.lorem.word(), f.lorem.word()]),
});

const userBuilder = build('User').fields({
  // 3. 고유한 값인 id는 `sequence`를 사용해 시퀀스 번호를 생성한다.
  id: sequence((s) => `user-${s}`),
});

test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce();
  // 4. test-data-bot 라이브러리로 생성한 빌더로 교체. 데이터를 생성한다.
  const fakeUser = userBuilder();
  render(<Editor user={fakeUser} />);
  // 5. test-data-bot 라이브러리로 생성한 빌더로 교체
  const fakePost = postBuilder();
  const preDate = new Date().getTime();

  screen.getByLabelText(/title/i).value = fakePost.title;
  screen.getByLabelText(/content/i).value = fakePost.content;
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ');
  const submitButton = screen.getByText(/submit/i);

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
```

## 테스트 대상 컴포넌트

테스트 결과가 파란색이 되도록 코드를 수정하자.

파일 : `react-testing-library-course/src/post-editor-06-generate-data.js`
