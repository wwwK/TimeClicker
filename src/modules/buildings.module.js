import { domElements } from './dom-elements.module';
import { gameNumbers } from './numbers.module';
import { state } from './state.module';
import { toast } from './toast.module';
import { gameUi } from './ui.module';
const buildings = require('./../assets/buildings.json');

// ensure that all the buildings are valid
buildings.names.forEach((name, index) => {
  buildings.refs[index] = null;
  buildings.counts[index] = buildings.counts.hasOwnProperty(index) ? buildings.counts[index] : 0;
  buildings.tickMultiplierStrings[index] = gameNumbers.formatNumber(buildings.tickMultipliers[index]);
  buildings.classes[index] = ['building'];
  buildings.canAfford[index] = false;

  if(!buildings.enabled.hasOwnProperty(index)) {
    buildings.enabled[index] = false;
  }
});

// Define the exported API
let nextUnlock = 1;

const _spawnBuilding = (index) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add(...buildings.classes[index]);

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

  const costRewardDiv = document.createElement('div');
  costRewardDiv.setAttribute('class', 'cost-reward');
  const costSpan = document.createElement('span');
  costSpan.setAttribute('class', 'cost');
  costSpan.innerHTML = gameNumbers.formatNumber(buildings.costs[index]);
  costRewardDiv.appendChild(costSpan);
  const spacerSpan = document.createElement('span');
  spacerSpan.setAttribute('class', 'spacer');
  spacerSpan.innerHTML = ' | ';
  costRewardDiv.appendChild(spacerSpan);
  const rewardSpan = document.createElement('span');
  rewardSpan.setAttribute('class', 'reward');
  rewardSpan.innerHTML = gameNumbers.formatNumber(buildings.tickMultipliers[index], '/s');
  costRewardDiv.appendChild(rewardSpan);
  infoDiv.appendChild(costRewardDiv);

  wrapper.appendChild(infoDiv);

  const countDiv = document.createElement('div');
  countDiv.setAttribute('class', 'count');
  countDiv.innerHTML = buildings.counts[index];
  wrapper.appendChild(countDiv);

  wrapper.onclick = () => _buyBuilding(index);
  domElements.buildingsWrapper.appendChild(wrapper);
  buildings.refs[index] = wrapper;
}

const _updateUiBuildingGeneratorValue = (index) => {
  const target = buildings.refs[index].querySelector('.cost-reward .reward');
  target.innerHTML = gameNumbers.formatNumber(buildings.tickMultipliers[index], '/s');

  toast.show({
    title: 'Building Upgraded',
    body: 'Something here'
  });
}

const _handleBuildingCountMilestones = (index) => {
  if(buildings.counts[index] === 5) {
    buildings.tickMultipliers[index] *= 1.5;
    _updateUiBuildingGeneratorValue(index);
    return;
  }

  if(buildings.counts[index] % 100 === 0) {
    buildings.tickMultipliers[index] *= 2;
    _updateUiBuildingGeneratorValue(index);
    return;
  }

  if(buildings.counts[index] % 50 === 0) {
    buildings.tickMultipliers[index] *= 1.5;
    _updateUiBuildingGeneratorValue(index);
    return;
  }

  if(buildings.counts[index] % 25 === 0) {
    buildings.tickMultipliers[index] *= 1.35;
    _updateUiBuildingGeneratorValue(index);
    return;
  }

  if(buildings.counts[index] % 10 === 0) {
    buildings.tickMultipliers[index] *= 1.25;
    _updateUiBuildingGeneratorValue(index);
  }
}

const _buyBuilding = (index) => {
  // Ensure that we can afford it
  if(state.game.score < buildings.costs[index]) { return; }

  state.game.score -= buildings.costs[index];
  buildings.costs[index] = Math.ceil(buildings.costs[index] * 1.25);
  buildings.counts[index]++;

  _handleBuildingCountMilestones(index);

  buildings.refs[index].querySelector('.cost').innerHTML = gameNumbers.formatNumber(buildings.costs[index]);
  buildings.refs[index].querySelector('.count').innerHTML = buildings.counts[index];
  domElements.score.innerHTML = state.game.score;

  state.game.earning = _calculateTickMultiplier();
  gameUi.updateScore();
  _updateCanBuy();
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

const _updateCanBuy = () => {
  const score = state.game.score;
  buildings.refs.forEach((el, index) => {
    if(!el) { return; }

    // Do we need to change this status?
    const canAfford = buildings.costs[index] <= score;
    if(buildings.canAfford[index] === canAfford) { return; }

    // Sync the status
    buildings.canAfford[index] = canAfford;
    const hasBuyClass = buildings.refs[index].classList.contains('can-buy');

    // Ensure that the correct class is applied
    if(canAfford) {
      if(!hasBuyClass) { buildings.refs[index].classList.add('can-buy'); }
    } else {
      if(hasBuyClass) { buildings.refs[index].classList.remove('can-buy'); }
    }
  });
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
  _updateCanBuy();
}

api.updateBuildings();
state.game.tickMultiplier = _calculateTickMultiplier();

export default api;
