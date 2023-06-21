const thumbWar = require('../thumb-war');
const utils = require('../utils');

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
