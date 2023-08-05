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
