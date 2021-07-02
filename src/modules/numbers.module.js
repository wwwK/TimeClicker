import { enums } from './enums';
import { loggerFactory } from './logger';

const logger = loggerFactory.getInstance(enums.module.numbers);
const numberInfo = require('../assets/_numbers.json');
let currentIndex = 0;
const api = {};

const currentInfo  = {
  abbreviation: numberInfo.abbreviations[currentIndex],
  name: numberInfo.names[currentIndex],
  multiplier: numberInfo.multipliers[currentIndex],
  url: numberInfo.urls[currentIndex],
  description: numberInfo.descriptions[currentIndex]
};

const _findClosestMultiplier = (value) => {
  for(let i = numberInfo.multipliers.length - 1; i >= 0; i--) {
    if(numberInfo.multipliers[i] <= value) {
      return i;
    }
  }

  return -1;
}


/* **********************************************************************
* Define an external API
********************************************************************** */
api.info = currentInfo;

api.format = (value, append) => {
  if(typeof value !== 'number') { 
    return 'NaN';
  }

  append = append ?? '';

  if(value < 1) {
    let rounded = Math.round((value + Number.EPSILON) * 100) / 100;
    return `${rounded} ${numberInfo.abbreviations[0]}${append}`;
  }

  const index = _findClosestMultiplier(value);

  if(index === -1) {
    return 'NaN';
  }

  let formatted = value / numberInfo.multipliers[index];
  let rounded = Math.round((formatted + Number.EPSILON) * 100) / 100;
  return `${rounded} ${numberInfo.abbreviations[index]}${append}`;
}

api.getMoreInfoUrl = () => {
  return numberInfo.urls[currentIndex];
}

export default api;
