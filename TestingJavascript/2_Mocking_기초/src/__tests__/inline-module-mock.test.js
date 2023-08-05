const thumbWar = require('../thumb-war');
const utils = require('../utils');

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
