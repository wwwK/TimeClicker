import { enums } from "./enums";
import state from "./game-state";
import { loggerFactory } from './logger';

const logger = loggerFactory.getInstance(enums.module.storage);
const saveCheckMod = state.config.targetTicksPerSec * 2;

const internal = {
    saveTickCounter: 0,
    nextSaveDate: new Date(new Date().getTime() + 30000),
    autoSaveEnabled: false
};

internal.handleAutoSave = () => {
    if(!internal.autoSaveEnabled) { return; }

    if(internal.saveTickCounter % saveCheckMod === 0) {
        if(new Date() < internal.nextSaveDate) {
            internal.saveLocal();
        }
        internal.saveTickCounter = 0;
    }

    internal.saveTickCounter += 1;
}

internal.saveLocal = () => {
    logger.traceMethod('_saveLocal');

    const saveFile = {
        state: { ...state.session }
    };

    internal.nextSaveDate = new Date((new Date()).getTime() + 30000);
    console.log('saving...', JSON.stringify(saveFile, null, 2));
}


// Public API
const api = {};

api.tick = () => {
    internal.handleAutoSave();
}

api.save = () => {
    internal.saveLocal();
}

export default api;