import gameDom from "./dom";
import numbers from "./numbers";
import state from "./game-state";
import { loggerFactory } from './logger';
import { enums } from "./enums";

const logger = loggerFactory.getInstance(enums.module.ui);


/* **********************************************************************
* Define an external API
********************************************************************** */
const api = {};

api.showBuildingsMenu = () => {
  gameDom.buildingsWrapper.style.display = 'block';
  gameDom.upgradesWrapper.style.display = 'none';
  
  gameDom.menuTabBuildings.setAttribute('class', 'buildings active');
  gameDom.menuTabUpgrades.setAttribute('class', 'upgrades');
}

api.showUpgradesMenu = () => {
  gameDom.buildingsWrapper.style.display = 'none';
  gameDom.upgradesWrapper.style.display = 'block';

  gameDom.menuTabBuildings.setAttribute('class', 'buildings');
  gameDom.menuTabUpgrades.setAttribute('class', 'upgrades active');
}

api.updateCurrentUnit = () => {
  gameDom.unitName.innerHTML = numbers.info.name;
  gameDom.unitAbbreviation.innerHTML = numbers.info.abbreviation;
  gameDom.unitDescription.innerHTML = numbers.info.description;
}

api.updateScore = () => {
  let roundedScore = Math.round((state.session.score + Number.EPSILON) * 100) / 100;
  let roundedEarning = Math.round((state.session.earning + Number.EPSILON) * 100) / 100;

  gameDom.scoreMod.innerHTML = state.session.scoreModifier;
  gameDom.score.innerHTML = roundedScore;
  gameDom.earning.innerHTML = roundedEarning;
  gameDom.earningMod.innerHTML = state.session.earningModifier;
  gameDom.click.innerHTML = state.session.clickingPower;
  gameDom.clickMod.innerHTML = state.session.clickingPowerModifier;
}

api.tick = () => {
  api.updateScore();
}

export default api;