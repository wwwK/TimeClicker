import { enums } from "./enums";
import state from "./game-state";
import { loggerFactory } from './logger';

const logger = loggerFactory.getInstance(enums.module.storage);

const api = {};
let saveCounter = 0;
let nextSaveDate = new Date((new Date()).getTime() + 1000);
const targetTicksPerSec = state.config.targetTicksPerSec;


const _saveLocal = () => {
    nextSaveDate = new Date((new Date()).getTime() + 30000);
    console.log('saving...', state);
}


// Public API
api.tick = () => {
    console.log('tick');

    if(saveCounter % targetTicksPerSec === 0) {
        if(new Date() > nextSaveDate) { _saveLocal(); }
        saveCounter = 0;
    }
    
    saveCounter += 1;
}

export default api;