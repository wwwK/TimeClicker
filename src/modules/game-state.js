import numbers from './numbers.module';
import { loggerFactory } from './logger';

const logger = loggerFactory.getInstance('game-state');

const session = {
  score: 0,
  scoreModifier: 'fs',
  clickCount: 0,
  clickingPower: 1000,
  clickingPowerModifier: 'fs',
  earning: 0,
  earningModifier: 'fs',

  lifetimeScore: 0,
  lifetimeClickCount: 0,
};

const config = {
  targetTicksPerSec: 4,
  gameLoopSleepMs: 0
};

/* **********************************************************************
* Load buildings and achievements
********************************************************************** */
const buildings = require('../assets/_buildings.json');
const achievements = require('../assets/_achievements.json');

buildings.names.forEach((name, index) => {
  logger.traceMethod('processBuilding', `called for "${name}"`);
  buildings.refs[index] = null;
  buildings.counts[index] = buildings.counts.hasOwnProperty(index) ? buildings.counts[index] : 0;
  buildings.tickMultiplierStrings[index] = numbers.format(buildings.tickMultipliers[index]);
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


/* **********************************************************************
* Define an external API
********************************************************************** */
const api = {
  buildings: buildings,
  achievements: achievements,
  session: session,
  config: config
}

api.handleClick = () => {
  session.score += session.clickingPower;
  session.sessionScore += session.clickingPower;

  session.clickCount += 1;
  session.lifetimeClickCount += 1;
}

api.tick = () => {
  const addValue = session.earning / config.targetTicksPerSec;
  
  session.score += addValue;
  session.lifetimeScore += addValue;
}

/* **********************************************************************
* Bootstrap and return the public API
********************************************************************** */
config.gameLoopSleepMs = 1000 / config.targetTicksPerSec;

export default api;
