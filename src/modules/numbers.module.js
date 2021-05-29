import { domElements } from "./dom-elements.module";

let currentIndex = 0;

const numberInfo = {
  abbreviations: [
    'fs',
    'ps',
    'nsec'
  ],
  names: [
    'femtosecond',
    'picosecond',
    'nanosecond'
  ],
  multipliers: [
    1,
    1000,
    1000000
  ],
  urls: [
    'https://en.wikipedia.org/wiki/Femtosecond',
    'https://en.wikipedia.org/wiki/Picosecond',
    'https://en.wikipedia.org/wiki/Nanosecond'
  ],
  descriptions: [
    'A femtosecond is the SI unit of time equal to one quadrillionth, or one millionth of one billionth, of a second',
    'A picosecond is an SI unit of time equal to one trillionth of a second.',
    'A nanosecond (ns) is an SI unit of time equal to one billionth of a second.'
  ]
};

/*
  https://en.wikipedia.org/wiki/Unit_of_time

  nsec  nanosecond    1 000,000
  μs    microsecond   1 000 000 000
  ms    millisecond   1 000 000 000 000
  s     second        1 000 000 000 000 000
  min   minute        60 000 000 000 000 000
  h     hour          3 600 000 000 000 000 000
  day   day           86 400 000 000 000 000 000
  week          604 800 000 000 000 000 000
  month         2 629 800 000 000 000 000 000
  year          31 557 600 000 000 000 000 000
  decade        315 576 000 000 000 000 000 000
  century       3 155 760 000000 000 000 000 000
  millennium    31 557 600 000 000 000 000 000 000
  megannum      31 557 600 000 000 000 000 000 000 000
  aeon          31 557 600 000 000 000 000 000 000 000 000
*/

domElements.unitMoreInfo.addEventListener('click', () => {
  const url = numberInfo.urls[currentIndex];
  window.open(url, '_blank');
});

const _findClosestMultiplier = (value) => {
  for(let i = numberInfo.multipliers.length - 1; i >= 0; i--) {
    if(numberInfo.multipliers[i] <= value) {
      return i;
    }
  }

  return -1;
}

const _formatNumber = (value) => {
  if(typeof value !== 'number') { 
    return 'NaN';
  }

  if(value < 1) {
    return `${value} ${numberInfo.abbreviations[0]}`;
  }

  const index = _findClosestMultiplier(value);

  if(index === -1) {
    return 'NaN';
  }

  let formatted = value / numberInfo.multipliers[index];
  let rounded = Math.round((formatted + Number.EPSILON) * 100) / 100;
  return `${rounded} ${numberInfo.abbreviations[index]}`;
}

export const gameNumbers = {
  info: {
    abbreviation: numberInfo.abbreviations[currentIndex],
    name: numberInfo.names[currentIndex],
    multiplier: numberInfo.multipliers[currentIndex],
    url: numberInfo.urls[currentIndex],
    description: numberInfo.descriptions[currentIndex]
  },
  formatNumber: _formatNumber
};