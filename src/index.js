import './time-clicker.scss';

import buildings from './modules/buildings.module';
import { domElements  } from './modules/dom-elements.module';
import { state } from './modules/state.module';

let modifier = 'ms';
let tickMultiplier = buildings.calculateTickMultiplier();
let tickModifier = 'ms';
let clickingModifier = 'ms';

// https://en.wikipedia.org/wiki/Unit_of_time
// https://en.wikipedia.org/wiki/Unit_of_time#/media/File:Units_of_Time_in_tabular_form.png

/*
  femtosecond   1
  picosecond    1 000
  nanosecond    1 000,000
  microsecond   1 000 000 000
  millisecond   1 000 000 000 000
  second        1 000 000 000 000 000
  minute        60 000 000 000 000 000
  hour          3 600 000 000 000 000 000
  day           86 400 000 000 000 000 000
  week          604 800 000 000 000 000 000
  month         2 629 800 000 000 000 000 000
  year          31 557 600 000 000 000 000 000
  decade        315 576 000 000 000 000 000 000
  century       3 155 760 000000 000 000 000 000
  millennium    31 557 600 000 000 000 000 000 000
  megannum      31 557 600 000 000 000 000 000 000 000
  aeon          31 557 600 000 000 000 000 000 000 000 000
*/

const aeon = 31557600000000000000000000000000;
// console.log(((aeon * 2.25) + 5022255) / aeon);

const updateScore = () => {
  domElements.scoreMod.innerHTML = modifier;
  domElements.score.innerHTML = state.game.score;
  domElements.earning.innerHTML = tickMultiplier;
  domElements.earningMod.innerHTML = tickModifier;
  domElements.click.innerHTML = state.game.clickingPower;
  domElements.clickMod.innerHTML = clickingModifier;
}

domElements.clock.addEventListener('click', () => {
  state.handleClick();

  updateScore();
}, false);

domElements.menuTabs.querySelector('.buildings').addEventListener('click', () => {
  domElements.buildingsWrapper.style.display = 'block';
  domElements.upgradesWrapper.style.display = 'none';
  
  domElements.menuTabs.querySelector('.buildings').setAttribute('class', 'buildings active');
  domElements.menuTabs.querySelector('.upgrades').setAttribute('class', 'upgrades');
});

domElements.menuTabs.querySelector('.upgrades').addEventListener('click', () => {
  domElements.buildingsWrapper.style.display = 'none';
  domElements.upgradesWrapper.style.display = 'block';

  domElements.menuTabs.querySelector('.buildings').setAttribute('class', 'buildings');
  domElements.menuTabs.querySelector('.upgrades').setAttribute('class', 'upgrades active');
});

const runTick = () => {
  const addValue = tickMultiplier / 2;
  
  state.game.score += addValue;
  state.game.sessionScore += addValue;

  buildings.checkUnlocks(state.game.sessionScore);
  updateScore(); 
}

runTick();
setInterval(() => runTick(), 500);