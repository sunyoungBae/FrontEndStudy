# jest-axe로 렌더링된 리액트 컴포넌트의 접근성 테스트하기

웹 애플리케이션의 모든 접근성 테스트를 자동화할 수 있는 것은 아니지만 대부분은 `axe-core` 및 `jest-axe`를 사용하여 매우 쉽게 자동화할 수 있다.

## 테스트 작성

파일 : `react-testing-library-course/__tests__/ally.js`

`jest-axe`는 jest에서 axe를 위한 헬퍼 모듈이다.

```jsx
// expect.extend(toHaveNoViolations); 구문을 없애고 확장을 자동으로 하기 위해 추가
// toHaveNoViolations말고도 모든 테스트에 대해 커버 가능
import 'jest-axe/extend-expect';
import * as React from 'react';
import { render } from '@testing-library/react';
// 가져오기
import { axe } from 'jest-axe';

function Form() {
  return (
    <form>
      <label htmlFor='email'>Email</label>
      <input id='email' placeholder='email' />
    </form>
  );
}

test('the form is accessible', async () => {
  const { container } = render(<Form />);
  // 사용하기. 비동기이므로 주의.
  const result = await axe(container);
  // 이렇게 하면 구체적인 에러 메시지를 얻을 수 없다.
  // expect(results.violations).toHaveLength(0);
  // 구체적인 에러 메시지를 얻기 위해 toHaveNoViolations를 사용한다.
  expect(results).toHaveNoViolations();
});
```

To-do : `toHaveNoViolations` 더 찾아보기
