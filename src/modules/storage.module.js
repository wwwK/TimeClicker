import { state } from "./state.module";
import buildings from './buildings.module';

let saveCounter = 0;
let nextSaveDate = new Date((new Date()).getTime() + 1000);
const targetTicksPerSec = state.config.targetTicksPerSec;


const _saveLocal = () => {
    nextSaveDate = new Date((new Date()).getTime() + 30000);
    console.log('saving...', state, buildings.getBuildings());
}

const _tick = () => {
    console.log('tick');

    if(saveCounter % targetTicksPerSec === 0) {
        if(new Date() > nextSaveDate) { _saveLocal(); }
        saveCounter = 0;
    }
    
    saveCounter += 1;
}

export const storage = {
    tick: _tick
};