import numbers from './numbers';
import { loggerFactory } from './logger';
import { enums } from './enums';

const logger = loggerFactory.getInstance(enums.module.gameState);

const session = {
  // Saved
  score: 0,
  clickPower: 100000,
  earning: 0,
  clickCount: 0,
  lifetimeScore: 0,
  lifetimeClickCount: 0,

  // Auto-generated
  clickPowerModifier: undefined,
  scoreModifier: undefined,
  earningModifier: undefined,
}

const config = {
  targetTicksPerSec: 4,
  gameLoopSleepMs: 0
}

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
  session.score += session.clickPower;
  session.lifetimeScore += session.clickPower;

  session.clickCount += 1;
  session.lifetimeClickCount += 1;
}

api.loadSave = (save) => {
  logger.traceMethod('loadSave');

  const _session = save?.session ?? {};
  session.clickCount = _session?.clickCount ?? session.clickCount;
  session.clickPower = _session?.clickPower ?? session.clickPower;
  session.earning = _session?.earning ?? session.earning;
  session.lifetimeClickCount = _session?.lifetimeClickCount ?? session.lifetimeClickCount;
  session.lifetimeScore = _session?.lifetimeScore ?? session.lifetimeScore;
  session.score = _session?.score ?? session.score;
  session.tickMultiplier = _session?.tickMultiplier ?? session.tickMultiplier;
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
