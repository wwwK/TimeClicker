import './time-clicker.scss';

import { state } from './modules/state.module';
import game from './modules/game';

// https://en.wikipedia.org/wiki/Unit_of_time
// https://en.wikipedia.org/wiki/Unit_of_time#/media/File:Units_of_Time_in_tabular_form.png

setInterval(game.tick, state.config.gameLoopSleepMs);