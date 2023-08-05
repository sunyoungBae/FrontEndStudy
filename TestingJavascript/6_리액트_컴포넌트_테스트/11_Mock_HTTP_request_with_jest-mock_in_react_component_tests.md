# 리액트 컴포넌트 테스트에서 jest.mock로 HTTP 요청 모킹하기

웹 애플리케이션의 모든 접근성 테스트를 자동화할 수 있는 것은 아니지만 대부분은 `axe-core` 및 `jest-axe`를 사용하여 매우 쉽게 자동화할 수 있다.

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/greeting-loader-01-mocking.js`

```jsx
import * as React from 'react';
import { loadGreeting } from './api';

function GreetingLoader() {
  const [greeting, setGreeting] = React.useState('');
  async function loadGreetingForInput(e) {
    e.preventDefault();
    const { data } = await loadGreeting(e.target.elements.name.value);
    setGreeting(data.greeting);
  }
  return (
    <form onSubmit={loadGreetingForInput}>
      <label htmlFor='name'>Name</label>
      <input id='name' />
      <button type='submit'>Load Greeting</button>
      <div aria-label='greeting'>{greeting}</div>
    </form>
  );
}

export { GreetingLoader };
```

## 테스트 작성

파일 : `react-testing-library-course/__tests__/http-jest-mock.js`

`loadGreeting`을 모킹해보자.

```jsx
import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// 2. 1번의 설정으로 모킹된 함수가 가져와짐. 이 함수는 `jest.fn`이 됨.
import { loadGreeting as mockLoadGreeting } from '../api';
import { GreetingLoader } from '../greeting-loader-01-mocking';

// 1. api 폴더에서 내보내지는 모든 함수를 모킹
jest.mock('../api');

test('loads greetings on click', async () => {
  const testGreeting = 'TEST_GREETING';
  // 3. 모킹 함수의 반환 값을 설정
  mockLoadGreeting.mockResolvedValueOnce({ data: { greeting: testGreeting } });
  const {getByLabelText, getByText}render(<GreetingLoader />);
  const nameInput = getByLabelText(/name/i);
  const loadButton = getByText(/load/i);
  userEvent.type(nameInput, 'Mary');
  userEvent.click(loadButton);
  expect(mockLoadGreeting).toHaveBeenCalledWith('Mary');
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1);

  // 4. 위 코드까지만 작성하면 오류가 발생
  // - 이유 : 테스트가 끝났음에도 mockLoadGreeting는 비동기 함수이므로 이후에 동작하며 렌더링도 추가로 발생한다는 내용
  // - 해결 방안 : 이를 기다렸다가 리렌더링 되는 것도 확인하는 테스트 코드 추가. 이는 비동기로 테스트를 진행해야 함!!
  await waitFor(() =>
    expect(getByLabelText(/greeting/i)).toHaveTextContent(testGreeting)
  );
});
```
