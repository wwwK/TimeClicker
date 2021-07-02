import { enums } from "./enums";
import { loggerFactory } from "./logger";
import state from "./game-state";
import storage from './storage';
import { toaster } from "./toaster";

const logger = loggerFactory.getInstance(enums.module.gameSave);
const saveCheckMod = state.config.targetTicksPerSec * 2;
const SAVE_KEY = 'time_clicker.save';

// Internal API
const internal = {
    saveTickCounter: 0,
    nextSaveDate: new Date(new Date().getTime() + 30000)
}

internal.handleAutoSave = () => {
    if(!state.config.autoSave) { return; }

    if(internal.saveTickCounter % saveCheckMod === 0) {
        if(new Date() < internal.nextSaveDate) {
            let delayMs = state.config.autoSaveInt * 1000;
            internal.saveLocal();
            internal.nextSaveDate = new Date((new Date()).getTime() + delayMs);
        }
        internal.saveTickCounter = 0;
    }

    internal.saveTickCounter += 1;
}

internal.snapshotBuildings = () => {
  const buildings = state.buildings;

  const _buildings = {
    ach: [],
    cnt: [...state.buildings.counts],
    cst: [...state.buildings.costs],
    na: [...state.buildings.nextAchievement],
    tm: [...state.buildings.tickMultipliers]
  };

  _buildings.ach = buildings.achievements.reduce((memo, current, index) => {
    memo.push((current ?? []).reduce((memo2, current2) => {
      memo2.push(current2 ? 1 : 0);
      return memo2;
    }, []));
    return memo;
  }, []);

  return _buildings;
}

internal.saveLocal = () => {
    logger.traceMethod('_saveLocal');

    const save = {
      session: { ...state.session },
      config: { ...state.config },
      build: internal.snapshotBuildings()
    };

    // Basic save cleanup
    if(save.session?.clickPowerModifier) { delete save.session.clickPowerModifier;}
    if(save.session?.earningModifier) { delete save.session.earningModifier; }
    if(save.session?.scoreModifier) { delete save.session.scoreModifier; }
    if(save.config?.gameLoopSleepMs) { delete save.config.gameLoopSleepMs; }
    if(save.config?.targetTicksPerSec) { delete save.config.targetTicksPerSec; }

    console.log('saving...', JSON.stringify(save));
    storage.setItem(SAVE_KEY, save);
}


// External API
const api = {};

api.tick = () => {
  internal.handleAutoSave();
}

api.save = () => {
  internal.saveLocal();
}

api.loadState = () => {
  if(!storage.hasItem(SAVE_KEY)) { return; }
  const savedState = storage.getItem(SAVE_KEY);

  toaster.show({
    title: 'Loaded',
    body: 'Loaded saved state'
  });

  state.loadSave(savedState);
}

export default api;
