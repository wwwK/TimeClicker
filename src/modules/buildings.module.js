import { domElements } from './dom-elements.module';
import gameState from './game-state.module';
const buildings = require('./../assets/buildings.json');

// ensure that all the buildings are valid
buildings.names.forEach((name, index) => {
  buildings.refs[index] = null;
  buildings.counts[index] = 0;
  if(!buildings.enabled.hasOwnProperty(index)) {
    buildings.enabled[index] = false;
  }
});

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

const _buyBuilding = (index) => {
  if(gameState.score < buildings.costs[index]) {
    return;
  }

  gameState.score -= buildings.costs[index];
  buildings.costs[index] = Math.ceil(buildings.costs[index] * 1.7);
  buildings.counts[index]++;

  buildings.refs[index].querySelector('.cost').innerHTML = `${buildings.costs[index]} ms`;
  buildings.refs[index].querySelector('.count').innerHTML = buildings.counts[index];
  domElements.score.innerHTML = gameState.score;
  
  recalculateTickMultiplier();
  updateScore();
}

let nextUnlock = 1;
const api = {};

api.updateBuildings = () => {
  buildings.names.forEach((name, i) => {
    if(!buildings.refs[i] && buildings.enabled[i]) {
      _spawnBuilding(i);
    }
  });
}

api.checkUnlocks = (sessionScore) => {
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

api.calculateTickMultiplier = () => {
  return buildings.names.reduce((multiplier, name, index) => {
    multiplier += buildings.counts[index] * buildings.tickMultipliers[index];
    return multiplier;
  }, 0);
}

api.updateBuildings();
export default api;
