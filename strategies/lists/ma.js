// IMPORT STRATEGIES
let movingAvarageAlgo = require('../MovingAvarageAlgo');
let rsiAlgo = require('../RSIAlgo');
let stochasticOscillatorAlgo = require('../StochasticOscillatorAlgo');
let mergeAlgo = require('../MergeAlgo');

// INDICATORS
const Indicators = require('../../indicators');

let strategies = [
    new movingAvarageAlgo({
        name: `MA2`,
        algorithm: {
            triggers: {long: 0.75, short: 0.25},
            ma: {sma: 10, ema: 200},
            padding: 5,
          },
      }),
];
//
// for(let i = 10; i <= 100; i+=10){
//   for (var j = 10; j <= 100; j+= 10) {
//     for (var k = 1; k <= 20; k+= 2) {
//       strategies.push(new movingAvarageAlgo({
//           name: `MA-(${i})(${j})(${k})`,
//           algorithm: {
//               triggers: {long: 0.75, short: 0.25},
//               ma: {sma: i, ema: j},
//               padding: k,
//             },
//         }));
//     }
//
//   }
// }

module.exports = strategies;
