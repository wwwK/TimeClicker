import { domElements } from "./dom-elements.module";
import { state } from "./state.module";
import { storage } from "./storage.module";
import buildings from './buildings.module';
import { gameUi } from "./ui.module";

const _tick = () => {
    storage.tick();
    state.tick();
    buildings.tick();
    gameUi.tick();
}

domElements.clock.addEventListener('click', () => {
    state.handleClick();
    gameUi.updateScore();
}, true);

domElements.menuTabBuildings.addEventListener('click', gameUi.showBuildingsMenu);
domElements.menuTabUpgrades.addEventListener('click', gameUi.showUpgradesMenu);

gameUi.updateCurrentUnit();
_tick();

export default {
    domElements: domElements,
    tick: _tick
};
