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
    nextSaveDate: new Date(new Date().getTime() + 30000),
    autoSaveEnabled: false
}

internal.handleAutoSave = () => {
    if(!internal.autoSaveEnabled) { return; }

    if(internal.saveTickCounter % saveCheckMod === 0) {
        if(new Date() < internal.nextSaveDate) {
            internal.saveLocal();
            internal.nextSaveDate = new Date((new Date()).getTime() + 30000);
        }
        internal.saveTickCounter = 0;
    }

    internal.saveTickCounter += 1;
}

internal.saveLocal = () => {
    logger.traceMethod('_saveLocal');

    const save = {
      session: { ...state.session }
    };

    // Basic save cleanup
    if(save.session?.clickPowerModifier) { delete save.session.clickPowerModifier;}
    if(save.session?.earningModifier) { delete save.session.earningModifier; }
    if(save.session?.scoreModifier) { delete save.session.scoreModifier; }

    console.log('saving...', JSON.stringify(save, null, 2));
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
