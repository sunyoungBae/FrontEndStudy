# 공유할 수 있는 mock 모듈을 만들고 이를 사용해 테스트 하기

## Jest : `__mocks__` 디렉토리 사용

종종 하나의 파일에서 mock하려는 모듈을 여러 파일에서 공유하기를 원할 수 있다.
Jest를 사용하면 `__mocks__` 디렉토리를 사용하여 mock를 외부로 보낼 수 있다.

### 1. `__mocks__` 폴더를 생성해 공유할 mock 모듈 만들기

```js
// src/__mocks__/utils.js

module.exports = {
  getWinner: jest.fn((p1, p2) => p1),
};
```

### 2. 테스트 파일에서 `jest.mock`의 두번째 인수 제거

```js
// src/__tests__/external-mock-module.test.js

// 2. 두번째 인자를 제거
jest.mock('../utils');

test('returns winner', () => {
  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');

  expect(winner).toBe('Kent C. Dodds');
  expect(utils.getWinner.mock.calls).toEqual([
    ['Kent C. Dodds', 'Ken Wheeler'],
    ['Kent C. Dodds', 'Ken Wheeler'],
  ]);

  utils.getWinner.mockReset();
});
```

### 3. 테스트 성공

- Jest는 자동으로 1번의 파일을 선택한다.

## 테스트 함수 구현하기

### 1. `__no-framework-mocks__/utils.js` 생성

```js
// src/__no-framework-mocks__/utils.js

function fn(impl = () => {}) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args);
    return impl(...args);
  };
  mockFn.mock = { calls: [] };
  return mockFn;
}

// 1. 공유할 mock 객체 내보내기
module.exports = {
  getWinner: fn((p1, p2) => p1),
};
```

### 2. 1번 파일을 가져와서 캐쉬로 사용

```js
// src/external-mock-module.js

// 1. 캐쉬로 가져옴??
require('../__no-framework-mocks_/utils');

const utilsPath = require.resolve('../utils');
// 2.
const mockUtilsPath = require.resolve('../__no-framework-mocks_/utils');
// 3. 인라인 객체 대신 `require.cache[mockUtilsPath]`를 사용
// require.cache[utilsPath] = {
//   id: utilsPath,
//   filename: utilsPath,
//   loaded: true,
//   exports: {
//     getWinner: fn((p1, p2) => p1),
//   },
// };
require.cache[utilsPath] = require.cache[mockUtilsPath];

const assert = require('assert');
const thumbWar = require('../thumb-war');
const utils = require('../utils');

const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');
assert.strictEqual(winner, 'Kent C. Dodds');
assert.deepStrictEqual(utils.getWinner.mock.calls, [
  ['Kent C. Dodds', 'Ken Wheeler'],
  ['Kent C. Dodds', 'Ken Wheeler'],
]);

require.cache[utilsPath];
```

> 이 방법은 모듈 시스템을 완전히 제어하기 때문에 Jest가 하는 일은 아니다.
> 따라서 코드에 `utils` 모듈이 필요한 경우 테스트 파일이든 구현 파일이든 Jest는 적절한 mock을 제공한다.
