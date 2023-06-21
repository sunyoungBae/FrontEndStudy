# `jest.spyOn`을 사용해 mock된 함수의 원래 구현을 복원

`originalGetWinner`를 추적하고 복원하는 것을 귀찮은 일이다.

## Jest : `jest.spyOn`

Jest는 이를 단순화하는데 사용할 수 있는 유틸리티를 제공한다.(`jest.spyOn`)

즉 `spyOn`은 object와 prop을 사용하여 호출할 수 있다.

- `originalValue`를 사용해 `mockRestore`(복원 함수)를 제공한다.
- `mockImplementation`을 사용해 mock 함수 `fn()`의 구현을 mock할 수 있다.

```js
// src/__test__/spy.test.js

test('returns winner', () => {
  jest.spyOn(utils, 'getWinner');
  // spyOn은 빈 mock 함수로 대체하기 때문에 특정 구현을 사용해야할 경우 `mockImplementation`을 사용할 수 있다.
  utils.getWinner.mockImplementation((p1, p2) => p1);

  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');

  expect(winner).toBe('Kent C. Dodds');
  expect(utils.getWinner.mock.calls).toEqual([
    ['Kent C. Dodds', 'Ken Wheeler'],
    ['Kent C. Dodds', 'Ken Wheeler'],
  ]);

  // cleanup
  utils.getWinner.mockRestore();
});
```

### 테스트 함수 구현하기

```js
// src/no-framework/spy.js

// 3. spyOn은 기본 값으로 빈 mock 함수 추가
function fn(impl = () => {}) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args);
    return impl(...args);
  };
  mockFn.mock = { calls: [] };
  // 5. mock 함수 구현을 받을 수 있는 함수 생성
  mockFn.mockImplementation = (newImpl) => (impl = newImpl);
  return mockFn;
}

function spyOn(obj, prop) {
  // 1. 원본값 저장
  const originalValue = obj[prop];
  // 2. obj[prop]에 mock 함수 저장
  obj[prop] = fn();
  // 4. 원본 값으로 복원하는 함수 생성
  obj[prop].mockRestore = () => (obj[prop] = originalValue);
}

spyOn(utils, 'getWinner');
utils.getWinner.mockImplementation((p1, p2) => p1);

const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');
assert.strictEqual(winner, 'Kent C. Dodds');
// console.log(utils.getWinner.mock.calls);
assert.deepStrictEqual(utils.getWinner.mock.calls, [
  ['Kent C. Dodds', 'Ken Wheeler'],
  ['Kent C. Dodds', 'Ken Wheeler'],
]);

utils.getWinner.mockRestore();
```
