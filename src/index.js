import './time-clicker.scss';

import buildings from './modules/buildings.module';
import { domElements  } from './modules/dom-elements.module';
import { state } from './modules/state.module';
import { gameUi } from './modules/ui.module';

// https://en.wikipedia.org/wiki/Unit_of_time
// https://en.wikipedia.org/wiki/Unit_of_time#/media/File:Units_of_Time_in_tabular_form.png


domElements.clock.addEventListener('click', () => {
  state.handleClick();
  gameUi.updateScore();
}, true);

domElements.menuTabBuildings.addEventListener('click', gameUi.showBuildingsMenu);
domElements.menuTabUpgrades.addEventListener('click', gameUi.showUpgradesMenu);

const _runTick = () => {
  state.tick();
  buildings.tick();
  gameUi.updateScore();
}

gameUi.updateCurrentUnit();

_runTick();
setInterval(() => _runTick(), state.game.gameLoopSleepMs);