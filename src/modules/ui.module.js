import { domElements } from "./dom-elements.module";
import { gameNumbers } from "./numbers.module";
import { state } from "./state.module";

const _updateScore = () => {
  domElements.scoreMod.innerHTML = state.game.scoreModifier;
  domElements.score.innerHTML = state.game.score;
  domElements.earning.innerHTML = state.game.earning;
  domElements.earningMod.innerHTML = state.game.earningModifier;
  domElements.click.innerHTML = state.game.clickingPower;
  domElements.clickMod.innerHTML = state.game.clickingPowerModifier;
}

const _showBuildingsMenu = () => {
  domElements.buildingsWrapper.style.display = 'block';
  domElements.upgradesWrapper.style.display = 'none';
  
  domElements.menuTabBuildings.setAttribute('class', 'buildings active');
  domElements.menuTabUpgrades.setAttribute('class', 'upgrades');
}

const _showUpgradesMenu = () => {
  domElements.buildingsWrapper.style.display = 'none';
  domElements.upgradesWrapper.style.display = 'block';

  domElements.menuTabBuildings.setAttribute('class', 'buildings');
  domElements.menuTabUpgrades.setAttribute('class', 'upgrades active');
}

const _updateCurrentUnit = () => {
  domElements.unitName.innerHTML = gameNumbers.info.name;
  domElements.unitAbbreviation.innerHTML = gameNumbers.info.abbreviation;
  domElements.unitDescription.innerHTML = gameNumbers.info.description;
}

export const gameUi = {
  updateScore: _updateScore,
  showBuildingsMenu: _showBuildingsMenu,
  showUpgradesMenu: _showUpgradesMenu,
  updateCurrentUnit: _updateCurrentUnit
};