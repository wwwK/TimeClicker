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

// Utils
const utils = {};

utils.handleClick = () => {
    logger.traceMethod('handleClick');
    state.handleClick();
    ui.updateScore();
}

utils.launchUnitInfo = () => {
    logger.traceMethod('launchUnitInfo');
    window.open(numbers.getMoreInfoUrl(), '_blank');
}


// Internal methods
const _tick = () => {
    buildings.tick();
    state.tick();
    ui.tick();
    storage.tick();
}

const _bindDomEventListeners = () => {
    if(bootstrapped) { return; }
    bootstrapped = true;

    gameDom.clock.addEventListener('click', utils.handleClick, true);
    gameDom.unitMoreInfo.addEventListener('click', utils.launchUnitInfo);
    gameDom.menuTabBuildings.addEventListener('click', ui.showBuildingsMenu);
    gameDom.menuTabUpgrades.addEventListener('click', ui.showUpgradesMenu);
}


// External API
const api = {};

api.bootstrap = () => {
    logger.traceMethod('bootstrapAndStart');

    _bindDomEventListeners();
    buildings.updateBuildings();
    state.session.tickMultiplier = buildings.calculateTickMultiplier();
    _tick();

    ui.updateClick();
    ui.updateEarning();
    ui.updateScore();
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
