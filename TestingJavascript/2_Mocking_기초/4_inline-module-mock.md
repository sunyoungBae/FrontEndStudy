# 모듈 mock하여 테스트하기

여기에서 `spyOn`으로 수행하는 작업은 여전히 몽키 패치의 형태이다.
이는 `thumb-war` 모듈이 `utils.getWinner`를 사용하기 때문에 동작하고, commonJS에서만 동작한다.
ES 모듈에서는 몽키 패치가 동작하지 않는다.

Jest의 `jest.mock` API를 사용해 전체 모듈을 mock 할 수 있다.

## Jest : `jest.mock`

```js
// src/__tests__/inline-module-mock.test.js

/**
 * 1. 첫번째 인수는 mock하려는 모듈의 경로(상대 경로)이다. 두번째 인수는 mock된 버전을 반환하는 모듈 팩토리 함수이다.
 *   - 여기서는 `jest.fn()`를 사용해 mock 함수를 구현한 `getWinner` 속성을 가진 객체를 반환한다.
 */
jest.mock('../utils', () => {
  return {
    getWinner: jest.fn((p1, p2) => p1),
  };
});

test('returns winner', () => {
  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');

  expect(winner).toBe('Kent C. Dodds');
  expect(utils.getWinner.mock.calls).toEqual([
    ['Kent C. Dodds', 'Ken Wheeler'],
    ['Kent C. Dodds', 'Ken Wheeler'],
  ]);

  // 2. cleanup을 위해 mockReset를 사용
  utils.getWinner.mockReset();
});
```

> 그 외 `jest.mock` 특징
>
> `jest.mock`는 **어디서든 호출할 수 있다**.
>
> - 흥미로운 점은 <u>Jest가 코드 실행 전 `jest.mock` 호출이 파일의 맨 위로 이동하도록 변환하여</u> 모듈이 로드되기 전에 mock이 제자리에 있는지 확인한다.
> - 또한 `jest.mock` 호출을 `require` 호출 아래로 이동 가능하고, 이는 import가 항상 파일의 맨위로 호이스팅되는 ES 모듈에서 특히 유용하다.

## 테스트 함수 구현하기

Jest는 모든 모듈 시스템을 컨트롤 하기 때문에 `jest.mock`가 동작한다.

우리는 `require.cache`를 사용해 비슷한 종류의 컨트롤을 실험해볼 수 있다.

- `require.cache`를 사용해 모듈 시스템을 제어할 수 있다.
- 콘솔 로그를 통해 `require.cache`를 보면 모듈에 대한 경로가 키로 존재하는 큰 객체를 볼 수 있고, 이에 대한 값은 모듈 객체이다.

여기에서는 모듈이 사용하기 전에, `utils` 모듈의 mock 버전을 가질 수 있도록 `require.cache`를 초기화하자.

```js
// src/no-framework/inline-module-mock.js

function fn(impl = () => {}) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args);
    return impl(...args);
  };
  mockFn.mock = { calls: [] };
  mockFn.mockImplementation = (newImpl) => (impl = newImpl);
  return mockFn;
}

// 1. `require.cache`에 항목을 만들어 `utils` 모듈을 추가
const utilsPath = require.resolve('../utils');
require.cache[utilsPath] = {
  id: utilsPath,
  filename: utilsPath,
  loaded: true,
  exports: {
    getWinner: fn((p1, p2) => p1),
  },
};

const assert = require('assert');
const thumbWar = require('../thumb-war');
const utils = require('../utils');

// 2. spyOn 구현 및 `getWinner.mockImplementation` 제거
// function spyOn(obj, prop) {
//   const originalValue = obj[prop];
//   obj[prop] = fn();
//   obj[prop].mockRestore = () => (obj[prop] = originalValue);
// }

// spyOn(utils, 'getWinner');
// utils.getWinner.mockImplementation((p1, p2) => p1);

const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');
assert.strictEqual(winner, 'Kent C. Dodds');
assert.deepStrictEqual(utils.getWinner.mock.calls, [
  ['Kent C. Dodds', 'Ken Wheeler'],
  ['Kent C. Dodds', 'Ken Wheeler'],
]);

// 3. cache에서 utilsPath를 제거하도록 cleanup 방법 변경
// utils.getWinner.mockRestore();
require.cache[utilsPath];
```
