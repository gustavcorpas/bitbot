// IMPORT STRATEGIES
let movingAvarageAlgo = require('../MovingAvarageAlgo');
let rsiAlgo = require('../RSIAlgo');
let stochasticOscillatorAlgo = require('../StochasticOscillatorAlgo');
let mergeAlgo = require('../MergeAlgo');

// INDICATORS
const Indicators = require('../../indicators');

let strategies = [

  new stochasticOscillatorAlgo({
          name: `so`,
          algorithm: {
            triggers: {long: 0.75, short: 0.25},
            so: {ksize: 34, dsize: 3},
          },
        }
      ),
      new stochasticOscillatorAlgo({
              name: `so1`,
              algorithm: {
                triggers: {long: 0.65, short: 0.25},
                so: {ksize: 2450, dsize: 3},
              },
            }
          ),

];

// for(let i = 5; i < 40; i+=5){
//   for (var j = 3; j < 15; j+= 3) {
//     strategies.push(new stochasticOscillatorAlgo({
//         name: `so${i},${j}`,
//         algorithm: {
//           triggers: {long: 0.75, short: 0.25},
//           so: {ksize: i, dsize: j},
//         },
//       }
//     ));
//   }
// }

module.exports = strategies;
