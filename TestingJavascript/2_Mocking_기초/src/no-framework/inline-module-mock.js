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
