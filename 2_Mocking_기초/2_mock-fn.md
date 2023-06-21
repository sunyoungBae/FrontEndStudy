# Mock를 사용해 함수가 올바르게 호출되는 지 검사하기

`fn` 함수를 이용해 함수 호출시 사용되는 모든 인수를 추적하여 해당 함수가 호출되는 방식을 assertion 할 수 있다.

## Jest : `jest.fn`

현재 코드는 `player1`만 넣어도 테스트가 통과한다. 이는 버그임으로 `player2`도 함께 호출되는 지 확인해야한다.

```js
function thumbWar(player1, player2) {
  const numberToWin = 2;
  let player1Wins = 0;
  let player2Wins = 0;
  while (player1Wins < numberToWin && player2Wins < numberToWin) {
    const winner = utils.getWinner(player1); // 호출 인자에 player2 제거
    if (winner === player1) {
      player1Wins++;
    } else if (winner === player2) {
      player2Wins++;
    }
  }
  return player1Wins > player2Wins ? player1 : player2;
}
module.exports = thumbWar;
```

jest.fn에는 호출 인자를 검사를 제공하는 mock 함수가 있다.

```js
test('returns winner', () => {
  const originalGetWinner = utils.getWinner;
  utils.getWinner = jest.fn((p1, p2) => p1);

  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');
  expect(winner).toBe('Kent C. Dodds');
  expect(utils.getWinner).toHaveBeenCalledTimes(2);
  // 호출 인자 검사 : 실패 발생(위 코드에서 호출 인자에 다시 player2를 넣으면 성공한다.)
  expect(utils.getWinner).toHaveBeenCalledWith('Kent C. Dodds', 'Ken Wheeler');

  // 두 번 호출하기 때문에 호출마다 올바른 인수로 호출되는 지 확인할 수도 있다.
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

  // cleanup
  utils.getWinner = originalGetWinner;
});
```

`utils.getWinner`를 콘솔 로그로 출력하면 많은 속성을 가지는 함수라는 것을 알 수 있다.
`mock` 속성은 이 함수가 호출되는 모든 인수를 포함하는 배열인 `calls` 속성을 가진 객체이다.

```js
console.log(utils.getWinner.mock);
/**
 * {
 *    calls: [
 *       [ 'Kent C. Dodds', 'Ken Wheeler' ],
 *      [ 'Kent C. Dodds', 'Ken Wheeler' ]
 *    ],
 *    instances: [ { getWinner: [Function] }, { getWinner: [Function] } ],
 *    invocationCallOrder: [ 1, 2 ],
 *     results: [
 *      { type: 'return', value: 'Kent C. Dodds' },
 *      { type: 'return', value: 'Kent C. Dodds' }
 *    ]
 *  }
 */
```

위 결과를 사용해 테스트를 할 수 있다.

```js
expect(utils.getWinner.mock.calls).toEqual([
  ['Kent C. Dodds', 'Ken Wheeler'],
  ['Kent C. Dodds', 'Ken Wheeler'],
]);
```

### 테스트 함수 구현하기

위 assertion을 커버할 수 있도록 직접 구현해보자.

```js
// src/no-framework/mock-fn.js

function fn(impl) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args);
    return impl(...args);
  };
  mockFn.mock = { calls: [] };
  return mockFn;
}

const originaGetWinner = utils.getWinner;
utils.getWinner = fn((p1, p2) => p1);

const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');
assert.strictEqual(winner, 'Kent C. Dodds');

// 자체 `fn` 함수로 호출 인자를 검사할 수 있다.
// console.log(utils.getWinner.mock.calls);
assert.deepStrictEqual(utils.getWinner.mock.calls, [
  ['Kent C. Dodds', 'Ken Wheeler'],
  ['Kent C. Dodds', 'Ken Wheeler'],
]);

utils.getWinner = originaGetWinner;
```

추가로, `fn`함수에서 `mock.calls`를 이용해 인수를 검사하는 함수를 생성해 반환할 수 있다.
