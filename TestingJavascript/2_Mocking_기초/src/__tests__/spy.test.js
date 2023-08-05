const thumbWar = require('../thumb-war');
const utils = require('../utils');

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
