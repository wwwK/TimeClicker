import gameDom from "./dom";
import state from "./game-state";
import storage from "./storage";
import buildings from './buildings';
import numbers from './numbers.module';
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
gameDom.clock.addEventListener('click', () => {
    state.handleClick();
    ui.updateScore();
}, true);

gameDom.unitMoreInfo.addEventListener('click', () => {
    window.open(numbers.getMoreInfoUrl(), '_blank');
});

gameDom.menuTabBuildings.addEventListener('click', ui.showBuildingsMenu);
gameDom.menuTabUpgrades.addEventListener('click', ui.showUpgradesMenu);


/* **********************************************************************
* Bootstrap and return the external API
********************************************************************** */
ui.updateCurrentUnit();
buildings.updateBuildings();
state.session.tickMultiplier = buildings.calculateTickMultiplier();
api.tick();

export default api;
