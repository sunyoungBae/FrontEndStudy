# React Testing Library를 사용해 리액트 폼 개발 테스트 드라이브

먼저 원하는 폼에 대한 테스트를 작성한 후, 작성한 테스트를 이용하여 구현한다.
이는 Test-driven development의 red-green refactor cycle이라고 한다.
1. 먼저 구현하려는 것에대한 테스트를 작성한다. 아직 구현되지 않았기 때문에 테스트가 빨간색으로 표시된다.
2. 테스트를 통과할 때까지 한 번에 한 단계식 구현한다. 테스트가 녹색이 될때까지 진행한다.
3. 보빨간색에서 녹색으로 전환 후 리팩토링한다.(보통은 그렇지만 여기서는 할 것이 없어서 넘어간다.)

## 테스트 작성

파일 : `react-testing-library-course/__tests__/tdd-01-markup.js`

```js
import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {Editor} from '../post-editor-01-markup'

test('renders a form with title, content, tags, and a submit button', () => {
  render(<Editor />)
  // 1. Form element 가져오기
  screen.getByLabelText(/title/i)
  screen.getByLabelText(/content/i)
  screen.getByLabelText(/tags/i)
  // 2. 버튼 가져오기
  screen.getByText(/submit/i)
})
```

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/post-editor-01-markup.js`

```jsx
import * as React from 'react'

function Editor() {
  return (
    <form>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" />

      <button type="submit">Submit</button>
    </form>
  )
}

export {Editor}
```