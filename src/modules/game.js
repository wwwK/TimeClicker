import gameDom from "./dom";
import state from "./game-state";
import storage from "./storage";
import buildings from './buildings';
import numbers from './numbers';
import ui from "./ui";
import { loggerFactory } from './logger';
import { enums } from "./enums";

const logger = loggerFactory.getInstance(enums.module.game);
let gameTickInterval = undefined;
let bootstrapped = false;


// Internal methods
const _tick = () => {
    storage.tick();
    state.tick();
    buildings.tick();
    ui.tick();
}

const _bindDomEventListeners = () => {
    if(bootstrapped) { return; }
    bootstrapped = true;

    gameDom.clock.addEventListener('click', () => {
        state.handleClick();
        ui.updateScore();
    }, true);

    gameDom.unitMoreInfo.addEventListener('click', () => {
        window.open(numbers.getMoreInfoUrl(), '_blank');
    });
    
    gameDom.menuTabBuildings.addEventListener('click', ui.showBuildingsMenu);
    gameDom.menuTabUpgrades.addEventListener('click', ui.showUpgradesMenu);
}


// External API
const api = {};

api.bootstrap = () => {
    logger.traceMethod('bootstrapAndStart');

    _bindDomEventListeners();
    ui.updateCurrentUnit();
    buildings.updateBuildings();
    state.session.tickMultiplier = buildings.calculateTickMultiplier();
    _tick();
}

api.start = () => {
    if(gameTickInterval) { return; }
    logger.traceMethod('start');

    gameTickInterval = setInterval(
        _tick,
        state.config.gameLoopSleepMs
    );
}

export default api;
