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

internal.updateEarningModifier = () => {
  gameDom.earningMod.innerHTML = state.session.earningModifier;
}

internal.updateCurrentUnit = () => {
  logger.traceMethod('_updateCurrentUnit');
  gameDom.unitName.innerHTML = numbers.info.name;
  gameDom.unitAbbreviation.innerHTML = numbers.info.abbreviation;
  gameDom.unitDescription.innerHTML = numbers.info.description;
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

api.updateScore = () => {
  gameDom.score.innerHTML = numbers.formatScore(state.session.score);

  if(state.session.scoreModifier !== numbers.info.abbreviation) {
    state.session.scoreModifier = numbers.info.abbreviation;
    gameDom.scoreMod.innerHTML = numbers.info.abbreviation;
    internal.updateCurrentUnit();
  }
}

api.updateClick = () => {
  logger.traceMethod('updateClick');



  gameDom.click.innerHTML = state.session.clickPower;
  gameDom.clickMod.innerHTML = state.session.clickPowerModifier;
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
