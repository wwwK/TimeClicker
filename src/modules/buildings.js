import gameDom from './dom';
import numbers from './numbers.module';
import state from './game-state';
import { toast } from './toast.module';
import ui from './ui';

const api = {};
const buildings = state.buildings;
const achievements = state.achievements;
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
  costSpan.innerHTML = numbers.format(buildings.costs[index]);
  costRewardDiv.appendChild(costSpan);
  const spacerSpan = document.createElement('span');
  spacerSpan.setAttribute('class', 'spacer');
  spacerSpan.innerHTML = ' | ';
  costRewardDiv.appendChild(spacerSpan);
  const rewardSpan = document.createElement('span');
  rewardSpan.setAttribute('class', 'reward');
  rewardSpan.innerHTML = numbers.format(buildings.tickMultipliers[index], '/s');
  costRewardDiv.appendChild(rewardSpan);
  infoDiv.appendChild(costRewardDiv);

  wrapper.appendChild(infoDiv);

  const countDiv = document.createElement('div');
  countDiv.setAttribute('class', 'count');
  countDiv.innerHTML = buildings.counts[index];
  wrapper.appendChild(countDiv);

  wrapper.onclick = () => _buyBuilding(index);
  gameDom.buildingsWrapper.appendChild(wrapper);
  buildings.refs[index] = wrapper;
}

const _updateUiBuildingGeneratorValue = (index) => {
  const target = buildings.refs[index].querySelector('.cost-reward .reward');
  target.innerHTML = numbers.format(buildings.tickMultipliers[index], '/s');
}

const _applyBuildingSpecificAchievement = (index, achievement) => {
  if(achievement.type !== 'multiplier') { return; }

  let value = parseFloat(achievement.hasOwnProperty('value') ? `${achievement.value}` : '1.5');
  const epsOld = buildings.tickMultipliers[index];

  if(isNaN(value)) { value = 1.5; }
  buildings.tickMultipliers[index] *= value;
  _updateUiBuildingGeneratorValue(index);

  // Handle message replacements
  let formattedMessage = `${achievement.message}`
    .replace('{epsOld}', epsOld)
    .replace('{epsNew}', buildings.tickMultipliers[index])
    .replace('{epsModifier}', state.session.earningModifier);

  toast.show({
    title: achievement.name,
    body: formattedMessage
  });
}

const _handleBuildingSpecificAchievements = (index) => {
  if(buildings.nextAchievement[index] === -1) { return; }
  const buildingId = buildings.ids[index];
  const buildingAchievements = achievements[buildingId] ?? [];

  if(buildingAchievements.length === 0) {
    buildings.nextAchievement[index] = -1;
    return;
  }

  const achievementIdx = buildings.nextAchievement[index];
  const nextAchievement = buildingAchievements[achievementIdx];
  if(buildings.counts[index] < nextAchievement.count) { return; }

  buildings.achievements[index][achievementIdx] = true;
  buildings.nextAchievement[index] += 1;

  if(!achievements[buildingId].hasOwnProperty(buildings.nextAchievement[index])) {
    buildings.nextAchievement[index] = -1;
  }

  _applyBuildingSpecificAchievement(index, nextAchievement);
}

const _applyMilestoneMultiplier = (index, multiplier) => {
  const original = buildings.tickMultipliers[index];
  const buildingName = buildings.names[index];
  
  buildings.tickMultipliers[index] *= multiplier;
  let change = buildings.tickMultipliers[index] - original;
  let roundedChange = Math.round((change + Number.EPSILON) * 100) / 100;

  _updateUiBuildingGeneratorValue(index);
  toast.show({
    title: `"${buildingName}" upgraded`,
    body: `Generating additional ${roundedChange} ${state.session.earningModifier} / sec`
  });
}

const _handleBuildingCountMilestones = (index) => {
  if(buildings.counts[index] === 5) {
    _applyMilestoneMultiplier(index, 1.05);
    return;
  }

  if(buildings.counts[index] % 100 === 0) {
    _applyMilestoneMultiplier(index, 2);
    return;
  }

  if(buildings.counts[index] % 50 === 0) {
    _applyMilestoneMultiplier(index, 1.5);
    return;
  }

  if(buildings.counts[index] % 25 === 0) {
    _applyMilestoneMultiplier(index, 1.25);
    return;
  }

  if(buildings.counts[index] % 10 === 0) {
    _applyMilestoneMultiplier(index, 1.1);
    return;
  }
}

const _buyBuilding = (index) => {
  // Ensure that we can afford it
  if(state.session.score < buildings.costs[index]) { return; }

  state.session.score -= buildings.costs[index];
  buildings.costs[index] = Math.ceil(buildings.costs[index] * 1.25);
  buildings.counts[index]++;

  _handleBuildingCountMilestones(index);
  _handleBuildingSpecificAchievements(index);

  buildings.refs[index].querySelector('.cost').innerHTML = numbers.format(buildings.costs[index]);
  buildings.refs[index].querySelector('.count').innerHTML = buildings.counts[index];
  gameDom.score.innerHTML = state.session.score;

  state.session.earning = api.calculateTickMultiplier();
  ui.updateScore();
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

const _updateCanBuy = () => {
  buildings.refs.forEach((el, index) => {
    if(!el) { return; }

    // Do we need to change this status?
    const canAfford = buildings.costs[index] <= state.session.score;
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


/* **********************************************************************
* Define an external API
********************************************************************** */
api.updateBuildings = () => {
  buildings.names.forEach((name, i) => {
    if(!buildings.refs[i] && buildings.enabled[i]) {
      _spawnBuilding(i);
    }
  });
}

api.calculateTickMultiplier = () => {
  return buildings.names.reduce((multiplier, name, index) => {
    multiplier += buildings.counts[index] * buildings.tickMultipliers[index];
    return multiplier;
  }, 0);
}

api.tick = () => {
  _checkUnlocks(state.session.score);
  _updateCanBuy();
}

export default api;
