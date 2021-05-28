const gameState = {
  score: 0,
  scoreModifier: 'ms',
  clickCount: 0,
  sessionScore: 0,
  clickingPower: 1000,
  clickingPowerModifier: 'ms',
  earning: 0,
  earningModifier: 'ms'
};

const _handleClick = () => {
  gameState.score += gameState.clickingPower;
  gameState.sessionScore += gameState.clickingPower;
}

const _tick = () => {
  const addValue = gameState.earning / 2;
  
  state.game.score += addValue;
  state.game.sessionScore += addValue;
}

export const state = {
  game: gameState,
  handleClick: _handleClick,
  tick: _tick
};