# React Testing Library의 wrapper 옵션을 사용한 리렌더링 단순화

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/error-boundary.js`

## 테스트 작성

react-testing-library의 wrapper 기능은 재렌더링 호출시 반복되는 부분을 정리해준다.
- 래핑한 컴포넌트는 리렌더링을 호출할 때마다 동일하며, 이때 받은 인자를 감싼다.

파일 : `react-testing-library-course/__tests__/error-boundary-04.js`

```js
import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {reportError as mockReportError} from '../api'
import {ErrorBoundary} from '../error-boundary'

jest.mock('../api')

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

afterEach(() => {
  jest.clearAllMocks()
})

function Bomb({shouldThrow}) {
  if (shouldThrow) {
    throw new Error('💣')
  } else {
    return null
  }
}

test('calls reportError and renders that there was a problem', () => {
  mockReportError.mockResolvedValueOnce({success: true})
  // 1. 두 번째 인자로 wrapper 속성이 ErrorBoundary인 객체를 넘긴다.
  // 기본적으로는 첫 번째 인수에서 제공하는 UI를 가져와서 ErrorBoundary 컴포넌트 내부에 래핑한다.
  // 따라서 첫번째 인수에 ErrorBoundary 컴포넌트를 제거한다.
  const {rerender} = render(<Bomb />, {wrapper: ErrorBoundary})

  // 2. ErrorBoundary 컴포넌트 내부에 추가할 부분만 인자로 넘긴다.
  rerender(<Bomb shouldThrow={true} />)

  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)

  expect(console.error).toHaveBeenCalledTimes(2)

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"There was a problem."`,
  )

  console.error.mockClear()
  mockReportError.mockClear()

  // 2. ErrorBoundary 컴포넌트 내부에 추가할 부분만 인자로 넘긴다.
  rerender(<Bomb />)

  userEvent.click(screen.getByText(/try again/i))

  expect(mockReportError).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.queryByText(/try again/i)).not.toBeInTheDocument()
})

```
