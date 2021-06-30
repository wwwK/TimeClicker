const gameState = {
  score: 0,
  scoreModifier: 'fs',
  clickCount: 0,
  sessionScore: 0,
  clickingPower: 1000,
  clickingPowerModifier: 'fs',
  earning: 0,
  earningModifier: 'fs',
  gameLoopSleepMs: 0
};

const targetTicksPerSec = 4;
let nextSaveDate = new Date((new Date()).getTime() + 1000);
let saveCounter = 0;

gameState.gameLoopSleepMs = 1000 / targetTicksPerSec;

const _handleClick = () => {
  gameState.score += gameState.clickingPower;
  gameState.sessionScore += gameState.clickingPower;
}

const _saveLocal = () => {
  nextSaveDate = new Date((new Date()).getTime() + 30000);

  console.log('saving...', gameState);
}

const _tick = () => {
  const addValue = gameState.earning / targetTicksPerSec;
  
  state.game.score += addValue;
  state.game.sessionScore += addValue;

  if(saveCounter % targetTicksPerSec === 0) {
    if(new Date() > nextSaveDate) { _saveLocal(); }
    saveCounter = 0;
  }

  saveCounter += 1;
}

export const state = {
  game: gameState,
  handleClick: _handleClick,
  tick: _tick
};