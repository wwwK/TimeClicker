import { domElements } from "./dom-elements.module";
import state from "./game-state";
import storage from "./storage";
import buildings from './buildings';
import ui from "./ui";


/* **********************************************************************
* Define an external API
********************************************************************** */
const api = {};

api.tick = () => {
    storage.tick();
    state.tick();
    buildings.tick();
    ui.tick();
}


/* **********************************************************************
* Bind all DOM event listeners
********************************************************************** */
domElements.clock.addEventListener('click', () => {
    state.handleClick();
    ui.updateScore();
}, true);

domElements.menuTabBuildings.addEventListener('click', ui.showBuildingsMenu);
domElements.menuTabUpgrades.addEventListener('click', ui.showUpgradesMenu);


/* **********************************************************************
* Bootstrap and return the external API
********************************************************************** */
ui.updateCurrentUnit();
buildings.updateBuildings();
state.session.tickMultiplier = buildings.calculateTickMultiplier();
api.tick();

export default api;
