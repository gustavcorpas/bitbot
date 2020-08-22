// IMPORT STRATEGIES
let movingAvarageAlgo = require('../MovingAvarageAlgo');
let rsiAlgo = require('../RSIAlgo');
let stochasticOscillatorAlgo = require('../StochasticOscillatorAlgo');
let mergeAlgo = require('../MergeAlgo');

// INDICATORS
const Indicators = require('../../indicators');

let strategies = [
    new mergeAlgo(
    {
      name: 'Merger',
      algorithm: {
        triggers: {
          long: 0.8,
          short: 0.2,
        },
        rsi: {
          weight: 0.5,
          lookback: 81,
        },
        ma: {
          weight: 1,
          sma: 88,
          ema: 96,
        },
        so: {
          weight: 0,
          ksize: 40,
          dsize: 6,
        }
      }
    }),
];

module.exports = strategies;
