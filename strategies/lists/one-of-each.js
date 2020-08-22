// IMPORT STRATEGIES
let movingAvarageAlgo = require('../MovingAvarageAlgo');
let rsiAlgo = require('../RSIAlgo');
let stochasticOscillatorAlgo = require('../StochasticOscillatorAlgo');
let mergeAlgo = require('../MergeAlgo');

// INDICATORS
const Indicators = require('../../indicators');

let strategies = [
  new stochasticOscillatorAlgo(
    {
      name: 'StocasticOscillator',
      algorithm: {
        triggers: {long: 0.8, short: 0.2},
        so: {ksize: 40, dsize: 6},
      },
    }
  ),
  new rsiAlgo(
    {
      name: 'RSI',
      algorithm: {
        triggers: {long: 0.8, short: 0.2},
        rsi: {lookback: 20},
      },
    }
  ),
  new movingAvarageAlgo(
    {
      name: 'MovingAvarage',
      algorithm: {
          triggers: {long: 1, short: 0},
          ma: {sma: 30, ema: 60},
        },
    }),
    new mergeAlgo(
    {
      name: 'Merger',
      algorithm: {
        triggers: {
          long: 0.48,
          short: 0.2,
        },
        rsi: {
          weight: 1,
          lookback: 20,
        },
        ma: {
          weight: 1,
          sma: 30,
          ema: 60,
        },
        so: {
          weight: 1,
          ksize: 40,
          dsize: 6,
        }
      }
    }),
];

module.exports = strategies;
