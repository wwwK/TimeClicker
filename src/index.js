import './time-clicker.scss';

import buildingManager from './modules/buildings.module';
import { domElements  } from './modules/dom-elements.module';

const buildings = require('./assets/buildings.json');


console.log(buildingManager);




buildings.names.forEach((name, index) => {
  buildings.refs[index] = null;
  buildings.counts[index] = 0;
  if(!buildings.enabled.hasOwnProperty(index)) {
    buildings.enabled[index] = false;
  }
});

let score = 100;
let totalScore = score + 0;
let modifier = 'ms';
let tickMultiplier = 0;
let tickModifier = 'ms';
let clickingPower = 10000;
let clickingModifier = 'ms';
let nextUnlock = 1;

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

console.log(((aeon * 2.25) + 5022255) / aeon);

const updateScore = () => {
  domElements.scoreMod.innerHTML = modifier;
  domElements.score.innerHTML = score;
  domElements.earning.innerHTML = tickMultiplier;
  domElements.earningMod.innerHTML = tickModifier;
  domElements.click.innerHTML = clickingPower;
  domElements.clickMod.innerHTML = clickingModifier;
}

domElements.clock.addEventListener('click', () => {
  score += clickingPower;
  totalScore += clickingPower;

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

const recalculateTickMultiplier = () => {
  tickMultiplier = buildings.names.reduce((multiplier, name, index) => {
    multiplier += buildings.counts[index] * buildings.tickMultipliers[index];
    return multiplier;
  }, 0);
}

const buyBuilding = (index) => {
  if(score < buildings.costs[index]) {
    return;
  }

  score -= buildings.costs[index];
  buildings.costs[index] = Math.ceil(buildings.costs[index] * 1.7);
  buildings.counts[index]++;

  buildings.refs[index].querySelector('.cost').innerHTML = `${buildings.costs[index]} ms`;
  buildings.refs[index].querySelector('.count').innerHTML = buildings.counts[index];
  domElements.score.innerHTML = score;
  
  recalculateTickMultiplier();
  updateScore();
}

const spawnBuilding = (index) => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('class', 'building');

  const iconDiv = document.createElement('div');
  iconDiv.setAttribute('class', 'icon');

  const img = document.createElement('img');
  img.setAttribute('src', buildings.images[index]);
  iconDiv.appendChild(img);
  wrapper.appendChild(iconDiv);

  const infoDiv = document.createElement('div');
  infoDiv.setAttribute('class', 'info');

  const nameDiv = document.createElement('div');
  nameDiv.setAttribute('class', 'name');
  nameDiv.innerHTML = buildings.names[index];
  infoDiv.appendChild(nameDiv);

  const costDiv = document.createElement('div');
  costDiv.setAttribute('class', 'cost');
  costDiv.innerHTML = `${buildings.costs[index]} ms`;
  infoDiv.appendChild(costDiv);

  wrapper.appendChild(infoDiv);

  const countDiv = document.createElement('div');
  countDiv.setAttribute('class', 'count');
  countDiv.innerHTML = buildings.counts[index];
  wrapper.appendChild(countDiv);

  wrapper.onclick = () => buyBuilding(index);
  domElements.buildingsWrapper.appendChild(wrapper);
  buildings.refs[index] = wrapper;
}

const updateBuildings = () => {
  buildings.names.forEach((name, i) => {
    if(!buildings.refs[i] && buildings.enabled[i]) {
      spawnBuilding(i);
    }
  });
}

const checkUnlocks = () => {
  if(nextUnlock === -1) { return; }

  if(totalScore < buildings.unlocks[nextUnlock]) {
    return;
  }

  buildings.enabled[nextUnlock] = true;

  if(buildings.names.length >= (nextUnlock + 1)) {
    nextUnlock += 1;
  } else {
    nextUnlock = -1;
  }

  updateBuildings();
}

const runTick = () => {
  const addValue = tickMultiplier / 2;
  
  score += addValue;
  totalScore += addValue;

  checkUnlocks();
  updateScore(); 
}

updateScore();
recalculateTickMultiplier();
updateBuildings();

setInterval(() => runTick(), 500);