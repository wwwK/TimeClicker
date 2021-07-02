import gameDom from "./dom";
import numbers from "./numbers";
import state from "./game-state";
import { loggerFactory } from './logger';
import { enums } from "./enums";

const logger = loggerFactory.getInstance(enums.module.ui);

/* **********************************************************************
* Internal methods
********************************************************************** */
const internal = {};

internal.updateScoreModifier = () => {
  gameDom.scoreMod.innerHTML = state.session.scoreModifier;
}

internal.updateEarningModifier = () => {
  gameDom.earningMod.innerHTML = state.session.earningModifier;
}


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
  logger.traceMethod('updateCurrentUnit');
  gameDom.unitName.innerHTML = numbers.info.name;
  gameDom.unitAbbreviation.innerHTML = numbers.info.abbreviation;
  gameDom.unitDescription.innerHTML = numbers.info.description;
}

api.updateScore = () => {
  let roundedScore = Math.round((state.session.score + Number.EPSILON) * 100) / 100;
  gameDom.score.innerHTML = roundedScore;

  internal.updateScoreModifier();
}

api.updateClick = () => {
  logger.traceMethod('updateClick');
  gameDom.click.innerHTML = state.session.clickingPower;
  gameDom.clickMod.innerHTML = state.session.clickingPowerModifier;
}

api.updateEarning = () => {
  logger.traceMethod('updateEarning');
  let roundedEarning = Math.round((state.session.earning + Number.EPSILON) * 100) / 100;
  gameDom.earning.innerHTML = roundedEarning;
}

api.tick = () => {
  api.updateScore();
}

export default api;
