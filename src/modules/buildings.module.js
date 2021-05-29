import { domElements } from './dom-elements.module';
import { state } from './state.module';
import { gameUi } from './ui.module';
const buildings = require('./../assets/buildings.json');

// ensure that all the buildings are valid
buildings.names.forEach((name, index) => {
  buildings.refs[index] = null;
  buildings.counts[index] = 0;
  buildings.tickMultiplierStrings[index] = 'Hello';

  if(!buildings.enabled.hasOwnProperty(index)) {
    buildings.enabled[index] = false;
  }
});

console.log(buildings);

// Define the exported API
let nextUnlock = 1;

const _spawnBuilding = (index) => {
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

  wrapper.onclick = () => _buyBuilding(index);
  domElements.buildingsWrapper.appendChild(wrapper);
  buildings.refs[index] = wrapper;
}

const _handleBuildingCountMilestones = (index) => {
  if(buildings.counts[index] === 5) {
    console.log('5 eh');
  }
}

const _buyBuilding = (index) => {
  if(state.game.score < buildings.costs[index]) {
    return;
  }

  state.game.score -= buildings.costs[index];
  buildings.costs[index] = Math.ceil(buildings.costs[index] * 1.25);
  buildings.counts[index]++;

  _handleBuildingCountMilestones(index);

  buildings.refs[index].querySelector('.cost').innerHTML = `${buildings.costs[index]} ms`;
  buildings.refs[index].querySelector('.count').innerHTML = buildings.counts[index];
  domElements.score.innerHTML = state.game.score;

  state.game.earning = _calculateTickMultiplier();
  gameUi.updateScore();
}

const _checkUnlocks = (sessionScore) => {
  if(nextUnlock === -1) { return; }

  if(sessionScore < buildings.unlocks[nextUnlock]) {
    return;
  }

  buildings.enabled[nextUnlock] = true;

  if(buildings.names.length >= (nextUnlock + 1)) {
    nextUnlock += 1;
  } else {
    nextUnlock = -1;
  }

  api.updateBuildings();
}

const _calculateTickMultiplier = () => {
  return buildings.names.reduce((multiplier, name, index) => {
    multiplier += buildings.counts[index] * buildings.tickMultipliers[index];
    return multiplier;
  }, 0);
}


// Define the public API
const api = {};

api.updateBuildings = () => {
  buildings.names.forEach((name, i) => {
    if(!buildings.refs[i] && buildings.enabled[i]) {
      _spawnBuilding(i);
    }
  });
}

api.tick = () => {
  _checkUnlocks(state.game.sessionScore);
}

api.updateBuildings();
state.game.tickMultiplier = _calculateTickMultiplier();

export default api;
