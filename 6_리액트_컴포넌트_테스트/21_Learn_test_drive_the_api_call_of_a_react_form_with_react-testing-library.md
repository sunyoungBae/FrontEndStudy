# 리액트 테스팅 라이브러리를 사용해 리액트 폼의 API 호출에 대한 테스트 드라이브 구성하기

폼 제출시 입력된 내용을 DB에 저장하려면 해당 데이터를 서버로 가져와야 한다.
이러한 단위 테스트 중 실제로 서버에 요청을 하고 싶지 않기 때문에 이를 담당하는 함수를 모킹하고, 올바른 데이터를 넘긴다고 단연할 것이다.

## 테스트 작성

먼저 이에 대한 테스트를 작성하자.

파일 : `react-testing-library-course/__tests__/tdd-03-api.js`

```js
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// 2. api에서 사용할 함수를 가져오고 별칭을 이용해 모킹됨을 표시
import { savePost as mockSavePost } from '../api';
import { Editor } from '../post-editor-03-api';

// 1. api 모킹 : api 모듈에 의해 노출되는 기능들에 대한 Jest 모킹 함수가 자동으로 생성됨
jest.mock('../api');

// 10. 마지막으로 Jest에 의해 자동으로 설정된 각 테스트 내부에서 호출되는 모든 모킹 객체가 모든 테스트 사이에서 지워지므로, 테스트가 격리된 상태로 유지되고 서로 모킹하지 않게 한다.
afterEach(() => {
  jest.clearAllMocks();
});

test('renders a form with title, content, tags, and a submit button', () => {
  // 3. mockSavePost 호출시 반환값 설정. 지금은 value를 검사하지않으므로, 파라미터를 비워둔다.
  mockSavePost.mockResolvedValueOnce();
  // 8. 실제로 작성자의 id도 필요하기 때문에 user 선언해서 넘김
  const fakeUser = { id: 'user-1' };
  render(<Editor user={fakeUser} />);
  // 5. 사용자가 입력한 데이터를 가정하여 테스트할 데이터를 생성
  // 7. 리팩터링 : 입력 텍스트와 테스트 텍스트의 중복 선언을 피하기 위해 공통으로 사용하는 변수를 생성해 활용
  const fakePost = {
    title: 'Test Title',
    content: 'Test content',
    tags: ['tag1', 'tag2'],
  };
  screen.getByLabelText(/title/i).value = fakePost.title;
  screen.getByLabelText(/content/i).value = fakePost.content;
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ');
  const submitButton = screen.getByText(/submit/i);

  userEvent.click(submitButton);

  expect(submitButton).toBeDisabled();

  // 4. 위 데이터를 바탕으로 호출시 파라미터를 검사
  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    // 9. user id도 추가
    authorId: fakeUser.id,
  });
  // 6. 한 번만 호출되는 것을 기대한다.
  expect(mockSavePost).toHaveBeenCalledTimes(1);
});
```

## 테스트 대상 컴포넌트

테스트 결과가 파란색이 되도록 코드를 수정하자.

파일 : `react-testing-library-course/src/post-editor-03-api.js`

```jsx
import * as React from 'react';
// 1. 게시글 저장 api 가져오기
import { savePost } from './api';

// 8. user정보를 받기위해 prop 추가
function Editor({ user }) {
  const [isSaving, setIsSaving] = React.useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    // 3. 2번에서 설정한 name을 통해 적절한 태그를 가지고 올 수 있다.
    const { title, content, tags } = e.target.elements;
    const newPost = {
      title: title.value,
      content: content.value,
      // 4. test에서 필요한 Data로 가공
      tags: tags.value.split(',').map((t) => t.trim()),
      // 9. user id도 넘기기
      authorId: user.id,
    };
    setIsSaving(true);

    savePost(newPost);
  }
  return (
    // 2. handleSubmit에서 입력한 정보를 name로 가져오기 위해 name 속성을 추가
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
