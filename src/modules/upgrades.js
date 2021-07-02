import { enums } from "./enums";
import { loggerFactory } from "./logger";
import state from './game-state';
import ui from './ui';


console.log(state.upgrades);

const logger = loggerFactory.getInstance(enums.module.upgrades);

const api = {};

api.initialize = () => {
  ui.showUpgradesMenu();
  
}

export default api;
