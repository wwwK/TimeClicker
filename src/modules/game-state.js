import numbers from './numbers';
import { loggerFactory } from './logger';
import { enums } from './enums';

const logger = loggerFactory.getInstance(enums.module.gameState);
const buildings = require('../assets/_buildings.json');
const achievements = require('../assets/_achievements.json');

const session = {
  // Saved
  score: 0,
  clickPower: 100000,
  earning: 0,
  clickCount: 0,
  lifetimeScore: 0,
  lifetimeClickCount: 0,

  // Auto-generated
  clickPowerModifier: enums.placeholder.undefined,
  scoreModifier: enums.placeholder.undefined,
  earningModifier: enums.placeholder.undefined,
}

const config = {
  targetTicksPerSec: 4,
  gameLoopSleepMs: 0,
  autoSave: false,
  autoSaveInt: 30
}

// Process buildings
buildings.names.forEach((name, index) => {
  logger.traceMethod('processBuilding', `called for "${name}"`);
  
  buildings.tickMultiplierStrings[index] = numbers.format(buildings.tickMultipliers[index]);
  buildings.classes[index] = ['building'];
  buildings.canAfford[index] = false;
  buildings.achievements[index] = [];
  buildings.nextAchievement[index] = 0;
  buildings.refs[index] = null;
  
  buildings.counts[index] = buildings.counts.hasOwnProperty(index) 
    ? buildings.counts[index]
    : 0;
  
  (achievements[buildings.ids[index]] ?? []).forEach(() => {
    buildings.achievements[index].push(false);
  });

  if(!buildings.enabled.hasOwnProperty(index)) {
    buildings.enabled[index] = index === 0;
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

  const _config = save?.config ?? {};
  config.autoSave = _config?.autoSave ?? config.autoSave;
  config.autoSaveInt = _config?.autoSaveInt ?? config.autoSaveInt;

  (save.build?.ach ?? []).forEach((achievements, index) => {
    (achievements ?? []).forEach((value, index2) => {
      buildings.achievements[index][index2] = (value === 1);
    });
  });

  (save.build?.cnt ?? []).forEach((value, index) => {
    buildings.counts[index] = value;
  });

  (save.build?.cst ?? []).forEach((value, index) => {
    buildings.costs[index] = value;
  });

  (save.build?.na ?? []).forEach((value, index) => {
    buildings.nextAchievement[index] = value;
  });

  (save.build?.tm ?? []).forEach((value, index) => {
    buildings.tickMultipliers[index] = value;
  });

  

  console.log(JSON.stringify(session, null, 2))
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
