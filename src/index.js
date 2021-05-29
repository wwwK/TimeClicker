import './time-clicker.scss';

import buildings from './modules/buildings.module';
import { domElements  } from './modules/dom-elements.module';
import { state } from './modules/state.module';
import { gameUi } from './modules/ui.module';
import { gameNumbers } from './modules/numbers.module';

// https://en.wikipedia.org/wiki/Unit_of_time
// https://en.wikipedia.org/wiki/Unit_of_time#/media/File:Units_of_Time_in_tabular_form.png

/*
  fs    femtosecond   1
  ps    picosecond    1 000
  nsec  nanosecond    1 000,000
  μs    microsecond   1 000 000 000
  ms    millisecond   1 000 000 000 000
  s     second        1 000 000 000 000 000
  min   minute        60 000 000 000 000 000
  h     hour          3 600 000 000 000 000 000
  day   day           86 400 000 000 000 000 000
  week          604 800 000 000 000 000 000
  month         2 629 800 000 000 000 000 000
  year          31 557 600 000 000 000 000 000
  decade        315 576 000 000 000 000 000 000
  century       3 155 760 000000 000 000 000 000
  millennium    31 557 600 000 000 000 000 000 000
  megannum      31 557 600 000 000 000 000 000 000 000
  aeon          31 557 600 000 000 000 000 000 000 000 000
*/

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
setInterval(() => _runTick(), 500);


gameNumbers.formatNumber(1);
