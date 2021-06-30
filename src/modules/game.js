import { domElements } from "./dom-elements.module";
import { state } from "./state.module";
import { storage } from "./storage.module";
import buildings from './buildings.module';
import ui from "./ui.module";

const _tick = () => {
    storage.tick();
    state.tick();
    buildings.tick();
    ui.tick();
}

domElements.clock.addEventListener('click', () => {
    state.handleClick();
    ui.updateScore();
}, true);

domElements.menuTabBuildings.addEventListener('click', ui.showBuildingsMenu);
domElements.menuTabUpgrades.addEventListener('click', ui.showUpgradesMenu);

ui.updateCurrentUnit();
_tick();

export default {
    domElements: domElements,
    tick: _tick
};
