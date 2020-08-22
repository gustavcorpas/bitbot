// IMPORT STRATEGIES
let movingAvarageAlgo = require('../MovingAvarageAlgo');
let rsiAlgo = require('../RSIAlgo');
let stochasticOscillatorAlgo = require('../StochasticOscillatorAlgo');
let mergeAlgo = require('../MergeAlgo');

// INDICATORS
const Indicators = require('../../indicators');

let strategies = [
  new rsiAlgo(
    {
      name: `RSI)`,
      algorithm: {
        triggers: {long: 0.75, short: 0.25},
        rsi: {lookback: 11},
      },
    }
  ),
  new rsiAlgo(
    {
      name: `RSI 1)`,
      algorithm: {
        triggers: {long: 0.75, short: 0.25},
        rsi: {lookback: 100},
      },
    }
  ),
];
//
// for(let i = 1; i < 80; i+=5){
//   for (var j = 4; j < 5; j+= 1) {
//     strategies.push(new rsiAlgo(
//       {
//         name: `RSI-(${i})(${j})`,
//         algorithm: {
//           triggers: {long: 0.75, short: 0.25},
//           rsi: {lookback: i},
//         },
//       }
//     ));
//   }
// }

module.exports = strategies;
