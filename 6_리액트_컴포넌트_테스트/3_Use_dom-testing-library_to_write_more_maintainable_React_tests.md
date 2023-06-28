# dom-testing-library를 사용해 유지보수가 쉬운 리액트 테스트 작성하기

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/favorite-number.js`

`FavoriteNumber` 컴포넌트에서 `label`의 `htmlFor`를 오타로 변경하면, 실제로 코드는 깨진 상태이지만 앞선 테스트는 성공한다.

```jsx
import * as React from 'react';

function FavoriteNumber({ min = 1, max = 9 }) {
  const [number, setNumber] = React.useState(0);
  const [numberEntered, setNumberEntered] = React.useState(false);
  function handleChange(event) {
    setNumber(Number(event.target.value));
    setNumberEntered(true);
  }
  const isValid = !numberEntered || (number >= min && number <= max);
  return (
    <div>
      // 접근성 문제 생성 : 레이블을 클릭해도 input에 입력이 반영되지 않는다.
      <label htmlFor='favorie-number'>Favorite Number</label>
      <input
        id='favorite-number'
        type='number'
        value={number}
        onChange={handleChange}
      />
      {isValid ? null : <div role='alert'>The number is invalid</div>}
    </div>
  );
}

export { FavoriteNumber };
```

## 테스트 작성

파일 : `react-testing-library-course/__tests__/dom-testing-library.js`

### 1. `queries` 시용하기

올바른 레이블과 올바른 input을 쿼리하고 있는지 확인해보자.
`dom-testing-library`를 사용해 `favortie-number`인 레이블이 있는 `input`을 가져오는 동작을 구현할 수 있다.

```jsx
import * as React from 'react';
import ReactDOM from 'react-dom';
// 1. 가져오기
import { queries } from '@testing-library/dom';
import { FavoriteNumber } from '../favorite-number';

test('renders a number input with a label "Favorite Number"', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FavoriteNumber />, div);
  // 2. 레이블 텍스트로 input을 가져올 수 있다.
  const input = queries.getByLabelText(div, 'Favorite Number');
  expect(input).toHaveAttribute('type', 'number');
});
```

오류에 대해 자세한 메시지를 알려준다.

- 레이블이 input과 연결되어 잇는지를 확인할 수 있는 정보를 제공하며, DOM이 이 시점에 어떻게 보이는지도 출력해준다.

```cmd
TestingLibraryElementError: Found a label with the text of: /favorite number/i, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.

    <div>
      <div>
        <label
          for="favorie-number"
        >
          Favorite Number
        </label>
        <input
          id="favorite-number"
          type="number"
          value="0"
        />
      </div>
    </div>
```

### 2. 대/소문자 구분없이 테스트하기

대부분의 사용자들이 대/소문자를 신경쓰지 않지만, 테스트 대/소문자가 다르면 실패한다.
따라서 더 탄력적인 테스트를 만들기 위해 정규식을 통해 소문자 비교를 하여 대/소문자를 신경쓰지 않도록 한다.

```jsx
import * as React from 'react';
import ReactDOM from 'react-dom';
import { queries } from '@testing-library/dom';
import { FavoriteNumber } from '../favorite-number';

test('renders a number input with a label "Favorite Number"', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FavoriteNumber />, div);
  // 소문자 비교를 위해 정규식 사용
  const input = queries.getByLabelText(div, /favorite number/i);
  expect(input).toHaveAttribute('type', 'number');
});
```

### 3. `getQueriesForElement` 사용

```jsx
import * as React from 'react';
import ReactDOM from 'react-dom';
// 1.
import { getQueriesForElement } from '@testing-library/dom';
import { FavoriteNumber } from '../favorite-number';

test('renders a number input with a label "Favorite Number"', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FavoriteNumber />, div);
  // getQueriesForElement를 사용
  const { getByLabelText } = getQueriesForElement(div);
  // getByLabelText는 이미 div 범위만 탐색하므로 인자중 div는 제거
  const input = getByLabelText(/favorite number/i);
  expect(input).toHaveAttribute('type', 'number');
});
```
