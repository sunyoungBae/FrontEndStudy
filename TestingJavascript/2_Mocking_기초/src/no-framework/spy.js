const assert = require('assert');
const thumbWar = require('../thumb-war');
const utils = require('../utils');

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
assert.deepStrictEqual(utils.getWinner.mock.calls, [
  ['Kent C. Dodds', 'Ken Wheeler'],
  ['Kent C. Dodds', 'Ken Wheeler'],
]);

utils.getWinner.mockRestore();
