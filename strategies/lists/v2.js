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
          long: 0.75,
          short: 0.25,
        },
        rsi: {
          weight: 0,
          lookback: 14,
        },
        ma: {
          weight: 1,
          triggers: {long: 0.75, short: 0.25},
          sma: 30,
          ema: 10,
          padding: 1,
        },
        so: {
          weight: 0,
          ksize: 14,
          dsize: 3,
        }
      }
    }),
];

// for(let i = 0; i < 1; i += 0.2){
//   for(let j = 0; j < 1; j += 0.2){
//     for(let k = 0; k < 1; k += 0.2){
//       strategies.push(new mergeAlgo(
//       {
//         name: `Merge(${i})(${j})(${k})`,
//         algorithm: {
//           triggers: {
//             long: 0.75,
//             short: 0.25,
//           },
//           rsi: {
//             weight: i,
//             lookback: 11,
//           },
//           ma: {
//             weight: j,
//             triggers: {long: 0.75, short: 0.25},
//             sma: 30,
//             ema: 40,
//             padding: 5,
//           },
//           so: {
//             weight: k,
//             ksize: 15,
//             dsize: 3,
//           }
//         }
//       }));
//     }
//   }
// }

module.exports = strategies;
