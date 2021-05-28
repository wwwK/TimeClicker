const gameState = {
  score: 0,
  clickCount: 0,
  sessionScore: 0,
  clickingPower: 1000
};

const _handleClick = () => {
  gameState.score += gameState.clickingPower;
  gameState.sessionScore += gameState.clickingPower;
}

export const state = {
  game: gameState,
  handleClick: _handleClick
};