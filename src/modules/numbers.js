import { enums } from './enums';
import { devLogger, loggerFactory } from './logger';

const logger = loggerFactory.getInstance(enums.module.numbers);
const numberInfo = require('../assets/_numbers.json');


const scoreNumberInfo  = {
  abbreviation: undefined,
  name: undefined,
  multiplier: undefined,
  url: undefined,
  description: undefined
}

const clickNumberInfo = {
  abbreviation: undefined,
  name: undefined,
  multiplier: undefined,
  url: undefined,
  description: undefined
}

const earningNumberInfo = {
  abbreviation: undefined,
  name: undefined,
  multiplier: undefined,
  url: undefined,
  description: undefined
}


const internal = {
  lastScoreLength: 0,
  lastClickLength: 0,
  lastEarningLength: 0
}

internal.findClosestMultiplier = (value) => {
  logger.traceMethod('findClosestMultiplier', value);

  // Save hitting the loop if we can
  if(value > 0 && value < 1) {
    return 0;
  }

  // Try to find a match
  for(let i = numberInfo.multipliers.length - 1; i >= 0; i--) {
    if(numberInfo.multipliers[i] <= value) {
      return i;
    }
  }

  // No match found
  return -1;
}

internal.getNumberLength = (value) => {
  return Math.ceil(Math.log(value + 1) / Math.LN10);
}

internal.setScoreNumberInfo = (idx) => {
  logger.traceMethod('setScoreNumberInfo', idx);

  scoreNumberInfo.abbreviation = numberInfo.abbreviations[idx];
  scoreNumberInfo.name = numberInfo.names[idx];
  scoreNumberInfo.multiplier = numberInfo.multipliers[idx];
  scoreNumberInfo.url = numberInfo.urls[idx];
  scoreNumberInfo.description = numberInfo.descriptions[idx];
}

internal.setClickNumberInfo = (idx) => {
  logger.traceMethod('setClickNumberInfo', idx);

  clickNumberInfo.abbreviation = numberInfo.abbreviations[idx];
  clickNumberInfo.name = numberInfo.names[idx];
  clickNumberInfo.multiplier = numberInfo.multipliers[idx];
  clickNumberInfo.url = numberInfo.urls[idx];
  clickNumberInfo.description = numberInfo.descriptions[idx];
}

internal.setEarningNumberInfo = (idx) => {
  logger.traceMethod('setEarningNumberInfo', idx);

  earningNumberInfo.abbreviation = numberInfo.abbreviations[idx];
  earningNumberInfo.name = numberInfo.names[idx];
  earningNumberInfo.multiplier = numberInfo.multipliers[idx];
  earningNumberInfo.url = numberInfo.urls[idx];
  earningNumberInfo.description = numberInfo.descriptions[idx];
}

internal.setScoreNumberInfo(0);
internal.setClickNumberInfo(0);
internal.setEarningNumberInfo(0);

/* **********************************************************************
* Define an external API
********************************************************************** */
const api = {
  scoreInfo: scoreNumberInfo,
  clickInfo: clickNumberInfo,
  earningInfo: earningNumberInfo
};

api.format = (value, append) => {
  logger.traceMethod('format', value);

  if(typeof value !== 'number') { return 'NaN'; }
  append = append ?? '';

  if(value < 1) {
    let rounded = Math.round((value + Number.EPSILON) * 100) / 100;
    return `${rounded} ${numberInfo.abbreviations[0]}${append}`;
  }

  const index = internal.findClosestMultiplier(value);

  if(index === -1) { return 'NaN'; }
  let formatted = value / numberInfo.multipliers[index];
  let rounded = Math.round((formatted + Number.EPSILON) * 100) / 100;
  return `${rounded} ${numberInfo.abbreviations[index]}${append}`;
}

api.getMoreInfoUrl = () => {
  return scoreNumberInfo.url;
}

api.formatScore = (value) => {
  const length = internal.getNumberLength(value);

  if(internal.lastScoreLength !== length) {
    internal.lastScoreLength = length;
    internal.setScoreNumberInfo(internal.findClosestMultiplier(value));
  }

  let relativeValue = value / scoreNumberInfo.multiplier;
  return Math.round((relativeValue + Number.EPSILON) * 100) / 100;
}

api.formatClick = (value) => {
  const length = internal.getNumberLength(value);

  if(internal.lastClickLength !== length) {
    internal.lastClickLength = length;
    internal.setClickNumberInfo(internal.findClosestMultiplier(value));
  }

  let relativeValue = value / clickNumberInfo.multiplier;
  return Math.round((relativeValue + Number.EPSILON) * 100) / 100;
}

api.formatEarning = (value) => {
  const length = internal.getNumberLength(value);
  logger.traceMethod('formatEarning', value, length);

  if(internal.lastEarningLength !== length) {
    internal.lastEarningLength = length;
    internal.setEarningNumberInfo(internal.findClosestMultiplier(value));
  }

  let relativeValue = value / earningNumberInfo.multiplier;
  return Math.round((relativeValue + Number.EPSILON) * 100) / 100;
}

export default api;
