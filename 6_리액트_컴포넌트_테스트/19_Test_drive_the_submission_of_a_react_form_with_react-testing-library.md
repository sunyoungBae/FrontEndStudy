# React Testing Library를 사용해 리액트 폼 제출 테스트 드라이브

## 테스트 작성

새로운 테스트를 추가하면 테스트 결과가 다시 빨간색이 된다.

파일 : `react-testing-library-course/__tests__/tdd-02-state.js`

```js
import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Editor} from '../post-editor-02-state'

test('renders a form with title, content, tags, and a submit button', () => {
  render(<Editor />)
  screen.getByLabelText(/title/i)
  screen.getByLabelText(/content/i)
  screen.getByLabelText(/tags/i)
  // 1. 제출 버튼을 누르면 제출 버튼이 비활성화된다.
  const submitButton = screen.getByText(/submit/i)

  userEvent.click(submitButton)

  expect(submitButton).toBeDisabled()
})
```

## 테스트 대상 컴포넌트

테스트 결과가 파란색이 되도록 코드를 수정하자.

파일 : `react-testing-library-course/src/post-editor-02-state.js`

```jsx
import * as React from 'react'

function Editor() {
  // 2. 버튼을 비활성화 시키기위해 isSaving 상태 생성
  const [isSaving, setIsSaving] = React.useState(false)
  function handleSubmit(e) {
    e.preventDefault()
    // 3. 제출 버튼 클릭시 상태 변경
    setIsSaving(true)
  }
  return (
    // 1. onSubmit 핸들러 추가
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" />

      // 4. 버튼의 비활성화 prop에 isSaving 상태 연결
      <button type="submit" disabled={isSaving}>
        Submit
      </button>
    </form>
  )
}

export {Editor}
```