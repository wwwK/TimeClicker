const gameState = {
  score: 0,
  scoreModifier: 'fs',
  clickCount: 0,
  sessionScore: 0,
  clickingPower: 1000,
  clickingPowerModifier: 'fs',
  earning: 0,
  earningModifier: 'fs'
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