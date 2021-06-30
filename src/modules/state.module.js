import { gameNumbers } from './numbers.module';

const buildings = require('./../assets/buildings.json');
const achievements = require('./../assets/achievements.json');

buildings.names.forEach((_name, index) => {
  buildings.refs[index] = null;
  buildings.counts[index] = buildings.counts.hasOwnProperty(index) ? buildings.counts[index] : 0;
  buildings.tickMultiplierStrings[index] = gameNumbers.formatNumber(buildings.tickMultipliers[index]);
  buildings.classes[index] = ['building'];
  buildings.canAfford[index] = false;
  buildings.achievements[index] = [];
  buildings.nextAchievement[index] = 0;
  
  (achievements[buildings.ids[index]] ?? []).forEach(() => {
    buildings.achievements[index].push(false);
  });

  if(!buildings.enabled.hasOwnProperty(index)) {
    buildings.enabled[index] = false;
  }
});

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

const gameConfig = {
  targetTicksPerSec: 4,
  gameLoopSleepMs: 0
};

gameConfig.gameLoopSleepMs = 1000 / gameConfig.targetTicksPerSec;

const _handleClick = () => {
  gameState.score += gameState.clickingPower;
  gameState.sessionScore += gameState.clickingPower;
}

const _tick = () => {
  const addValue = gameState.earning / gameConfig.targetTicksPerSec;
  
  state.game.score += addValue;
  state.game.sessionScore += addValue;
}

export const state = {
  game: gameState,
  config: gameConfig,
  buildings: buildings,
  achievements: achievements,
  handleClick: _handleClick,
  tick: _tick
};