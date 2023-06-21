const thumbWar = require('../thumb-war');
const utils = require('../utils');

test('returns winner', () => {
  const originalGetWinner = utils.getWinner;
  utils.getWinner = jest.fn((p1, p2) => p1);

  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');
  expect(winner).toBe('Kent C. Dodds');
  // 두 번 호출했는지 검사
  expect(utils.getWinner).toHaveBeenCalledTimes(2);
  // 두 인자를 받았느지 검사
  expect(utils.getWinner).toHaveBeenCalledWith('Kent C. Dodds', 'Ken Wheeler');

  // 매 호출마다 받은 인자를 검사(여기서는 동일한 인수로 두 번 호출)
  expect(utils.getWinner).toHaveBeenNthCalledWith(
    1,
    'Kent C. Dodds',
    'Ken Wheeler'
  );
  expect(utils.getWinner).toHaveBeenNthCalledWith(
    2,
    'Kent C. Dodds',
    'Ken Wheeler'
  );

  // 함수의 mock 객체를 통해 호춢 인자를 검사할 수 있다.
  expect(utils.getWinner.mock.calls).toEqual([
    ['Kent C. Dodds', 'Ken Wheeler'],
    ['Kent C. Dodds', 'Ken Wheeler'],
  ]);

  // cleanup
  utils.getWinner = originalGetWinner;
});
