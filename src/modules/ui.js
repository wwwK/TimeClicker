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

api.updateScore = () => {
  gameDom.score.innerHTML = numbers.formatScore(state.session.score);

  if(state.session.scoreModifier !== numbers.scoreInfo.abbreviation) {
    state.session.scoreModifier = numbers.scoreInfo.abbreviation;
    gameDom.scoreMod.innerHTML = numbers.scoreInfo.abbreviation;

    gameDom.unitName.innerHTML = numbers.scoreInfo.name;
    gameDom.unitAbbreviation.innerHTML = numbers.scoreInfo.abbreviation;
    gameDom.unitDescription.innerHTML = numbers.scoreInfo.description;
  }
}

api.updateClick = () => {
  logger.traceMethod('updateClick', state.session.clickPower);
  gameDom.click.innerHTML = numbers.formatClick(state.session.clickPower);

  if(state.session.clickPowerModifier !== numbers.clickInfo.abbreviation) {
    state.session.clickPowerModifier = numbers.clickInfo.abbreviation;
    gameDom.clickMod.innerHTML = state.session.clickPowerModifier;
  }
}

api.updateEarning = () => {
  logger.traceMethod('updateEarning', state.session.earning);
  gameDom.earning.innerHTML = numbers.formatEarning(state.session.earning);

  if(state.session.earningModifier !== numbers.earningInfo.abbreviation) {
    state.session.earningModifier = numbers.earningInfo.abbreviation;
    gameDom.earningMod.innerHTML = state.session.earningModifier;
  }
}

api.tick = () => {
  api.updateScore();
}

export default api;
