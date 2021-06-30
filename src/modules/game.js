import { domElements } from "./dom-elements.module";
import { state } from "./state.module";
import { storage } from "./storage.module";
import buildings from './buildings';
import ui from "./ui";

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

// Bootstrap the game
ui.updateCurrentUnit();
buildings.updateBuildings();
state.game.tickMultiplier = buildings.calculateTickMultiplier();

_tick();

export default {
    domElements: domElements,
    tick: _tick
};
