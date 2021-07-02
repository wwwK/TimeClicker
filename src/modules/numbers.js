import { enums } from './enums';
import { loggerFactory } from './logger';

const logger = loggerFactory.getInstance(enums.module.numbers);
const numberInfo = require('../assets/_numbers.json');

const api = {};

const internal = {
  lastScoreLength: 0,
  currentScoreDivider: 1
};

const currentInfo  = {
  abbreviation: undefined,
  name: undefined,
  multiplier: undefined,
  url: undefined,
  description: undefined
}


internal.findClosestMultiplier = (value) => {
  logger.traceMethod('findClosestMultiplier', value);

  for(let i = numberInfo.multipliers.length - 1; i >= 0; i--) {
    if(numberInfo.multipliers[i] <= value) {
      return i;
    }
  }

  return -1;
}

internal.getNumberLength = (value) => {
  return Math.ceil(Math.log(value + 1) / Math.LN10);
}

internal.setCurrentInfo = (idx) => {
  currentInfo.abbreviation = numberInfo.abbreviations[idx];
  currentInfo.name = numberInfo.names[idx];
  currentInfo.multiplier = numberInfo.multipliers[idx];
  currentInfo.url = numberInfo.urls[idx];
  currentInfo.description = numberInfo.descriptions[idx];
}

internal.setCurrentInfo(0);

/* **********************************************************************
* Define an external API
********************************************************************** */
api.info = currentInfo;

api.format = (value, append) => {
  logger.traceMethod('format', value);

  if(typeof value !== 'number') { 
    return 'NaN';
  }

  append = append ?? '';

  if(value < 1) {
    let rounded = Math.round((value + Number.EPSILON) * 100) / 100;
    return `${rounded} ${numberInfo.abbreviations[0]}${append}`;
  }

  const index = internal.findClosestMultiplier(value);

  if(index === -1) {
    return 'NaN';
  }

  let formatted = value / numberInfo.multipliers[index];
  let rounded = Math.round((formatted + Number.EPSILON) * 100) / 100;
  return `${rounded} ${numberInfo.abbreviations[index]}${append}`;
}

api.getMoreInfoUrl = () => {
  return currentInfo.url;
}

api.formatScore = (value) => {
  const length = internal.getNumberLength(value);

  if(internal.lastScoreLength !== length) {
    internal.lastScoreLength = length;
    internal.setCurrentInfo(internal.findClosestMultiplier(value));
  }

  let relativeValue = value / currentInfo.multiplier;
  return Math.round((relativeValue + Number.EPSILON) * 100) / 100;
}

export default api;
