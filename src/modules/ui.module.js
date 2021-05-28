import { domElements } from "./dom-elements.module";
import { state } from "./state.module";

const _updateScore = () => {
  domElements.scoreMod.innerHTML = state.game.scoreModifier;
  domElements.score.innerHTML = state.game.score;
  domElements.earning.innerHTML = state.game.earning;
  domElements.earningMod.innerHTML = state.game.earningModifier;
  domElements.click.innerHTML = state.game.clickingPower;
  domElements.clickMod.innerHTML = state.game.clickingPowerModifier;
}

export const gameUi = {
  updateScore: _updateScore
};