import { domElements } from "./dom-elements.module";
import { gameNumbers } from "./numbers.module";
import state from "./game-state";


/* **********************************************************************
* Define an external API
********************************************************************** */
const api = {};

api.showBuildingsMenu = () => {
  domElements.buildingsWrapper.style.display = 'block';
  domElements.upgradesWrapper.style.display = 'none';
  
  domElements.menuTabBuildings.setAttribute('class', 'buildings active');
  domElements.menuTabUpgrades.setAttribute('class', 'upgrades');
}

api.showUpgradesMenu = () => {
  domElements.buildingsWrapper.style.display = 'none';
  domElements.upgradesWrapper.style.display = 'block';

  domElements.menuTabBuildings.setAttribute('class', 'buildings');
  domElements.menuTabUpgrades.setAttribute('class', 'upgrades active');
}

api.updateCurrentUnit = () => {
  domElements.unitName.innerHTML = gameNumbers.info.name;
  domElements.unitAbbreviation.innerHTML = gameNumbers.info.abbreviation;
  domElements.unitDescription.innerHTML = gameNumbers.info.description;
}

api.updateScore = () => {
  let roundedScore = Math.round((state.session.score + Number.EPSILON) * 100) / 100;
  let roundedEarning = Math.round((state.session.earning + Number.EPSILON) * 100) / 100;

  domElements.scoreMod.innerHTML = state.session.scoreModifier;
  domElements.score.innerHTML = roundedScore;
  domElements.earning.innerHTML = roundedEarning;
  domElements.earningMod.innerHTML = state.session.earningModifier;
  domElements.click.innerHTML = state.session.clickingPower;
  domElements.clickMod.innerHTML = state.session.clickingPowerModifier;
}

api.tick = () => {
  api.updateScore();
}

export default api;