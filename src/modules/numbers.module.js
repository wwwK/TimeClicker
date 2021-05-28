import { domElements } from "./dom-elements.module";

let currentIndex = 0;

const numberInfo = {
  abbreviations: [
    'fs'
  ],
  names: [
    'femtosecond'
  ],
  multipliers: [
    1
  ],
  urls: [
    'https://en.wikipedia.org/wiki/Femtosecond'
  ],
  descriptions: [
    'A femtosecond is the SI unit of time equal to one quadrillionth, or one millionth of one billionth, of a second'
  ]
};

domElements.unitMoreInfo.addEventListener('click', () => {
  const url = numberInfo.urls[currentIndex];
  window.open(url, '_blank');
});

export const gameNumbers = {
  info: {
    abbreviation: numberInfo.abbreviations[currentIndex],
    name: numberInfo.names[currentIndex],
    multiplier: numberInfo.multipliers[currentIndex],
    url: numberInfo.urls[currentIndex],
    description: numberInfo.descriptions[currentIndex]
  }
};