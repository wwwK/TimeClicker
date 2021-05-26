import './time-clicker.scss';
const buildings = require('./assets/buildings.json');


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
let clickingPower = 1000;
let clickingModifier = 'ms';
let nextUnlock = 1;

const clockRef = document.getElementById('clock');
const scoreRef = document.getElementById('score');
const modifierRef = document.getElementById('scoreModifier');
const buildingsRef = document.getElementById('buildings');
const earningRef = document.getElementById('tickEarning');
const tickModifierRef = document.getElementById('tickModifier');
const clickPwrRef = document.getElementById('clickPower');
const clickModRef = document.getElementById('clickModifier');
const tabsRef = document.getElementById('tabs');
const upgradesRef = document.getElementById('upgrades');


const updateScore = () => {
  modifierRef.innerHTML = modifier;
  scoreRef.innerHTML = score;
  earningRef.innerHTML = tickMultiplier;
  tickModifierRef.innerHTML = tickModifier;
  clickPwrRef.innerHTML = clickingPower;
  clickModRef.innerHTML = clickingModifier;
}

clockRef.addEventListener('click', () => {
  score += clickingPower;
  totalScore += clickingPower;

  updateScore();
}, false);

tabsRef.querySelector('.buildings').addEventListener('click', () => {
  buildingsRef.style.display = 'block';
  upgradesRef.style.display = 'none';
  
  tabsRef.querySelector('.buildings').setAttribute('class', 'buildings active');
  tabsRef.querySelector('.upgrades').setAttribute('class', 'upgrades');
});

tabsRef.querySelector('.upgrades').addEventListener('click', () => {
  buildingsRef.style.display = 'none';
  upgradesRef.style.display = 'block';

  tabsRef.querySelector('.buildings').setAttribute('class', 'buildings');
  tabsRef.querySelector('.upgrades').setAttribute('class', 'upgrades active');
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
  scoreRef.innerHTML = score;
  
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
  buildingsRef.appendChild(wrapper);
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