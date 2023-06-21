# 객체 속성을 재정의하기 위한 몽키 패치

> 몽키 패치 ?
>
> 원래 소스코드를 변경하지 않고 런타임 환경에서 프로그램의 특정 기능을 수정하여 사용하는 기법이다. 쉽게 말해 어떤 기능을 위해 이미 있던 코드에 삽입하는 것이다.

## 테스트 타겟인 `thumbWar` 모듈을 생성해보자

두 플레이어가 게임 실행하며 여러 번 실행하여 최종적으로 게임에서 이긴 사람을 반환한다.

- 이는 `utils.getWinner`를 사용해 랜덤으로 승자를 결정한다.

```js
// src/thumb-war.js

const utils = require('./utils');

function thumbWar(player1, player2) {
  const numberToWin = 2;
  let player1Wins = 0;
  let player2Wins = 0;
  while (player1Wins < numberToWin && player2Wins < numberToWin) {
    const winner = utils.getWinner(player1, player2);
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

```js
// src/utils.js

function getWinner(player1, player2) {
  const winningNumber = Math.random();
  return winningNumber < 1 / 3
    ? player1
    : winningNumber < 2 / 3
    ? player2
    : null;
}

module.exports = { getWinner };
```

## `getWinner` 함수를 몽키 패치를 사용해 mock하여 테스트를 통과시켜보자

`getWinner` 함수는 `random`을 사용하기 때문에 값이 매번 다르다. 즉 테스트 결과가 매번 다르다.
이를 해결하기 위해 utils 함수의 **`getWinner` 함수를 테스트를 실행하는 파일(monckey-patching.js)에서 재정의를 사용해 mock하자**.

> Mocking시 중요한 점은 원하는 것을 mock하고 싶지 않거나 다른 방식으로 mock하려는 **다른 테스트에 영향을 미치지 않도록 스스로 정리해야하는 것이다**.(3번 참조)

```js
const assert = require('assert');
const thumbWar = require('../thumb-war');
const utils = require('../utils');

// 1. 원본 함수를 저장
const originaGetWinner = utils.getWinner;
// 2. 재정의를 사용해 mock
utils.getWinner = (p1, p2) => p1;

const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler');
assert.strictEqual(winner, 'Kent C. Dodds');

// 3. 테스트가 끝난 후 원래값으로 재할당
utils.getWinner = originaGetWinner;
```
