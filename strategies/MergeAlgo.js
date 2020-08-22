const fs = require('fs');
const Indicators = require('../indicators');

const StochasticOscillatorAlgo = require('./StochasticOscillatorAlgo');
const RSIAlgo = require('./RSIAlgo');
const MovingAvarageAlgo = require('./MovingAvarageAlgo');

class MergeAlgo{
  constructor(options){
    // EXAMPLE options = {
    //   name: 'MergeAlgo',
    //   algorithm: {
    //     triggers: {
    //       long: 0.80,
    //       short: 0.2,
    //     },
    //     rsi: {
    //       weight: 0,
    //       lookback: 20,
    //     },
    //     ma: {
    //       weight: 1,
    //       sma: 10,
    //       ema: 20,
      //      padding: 5
          // triggers: {}
    //     },
    //     so: {
    //       weight: 0,
    //       ksize: 40,
    //       dsize: 6,
    //     }
    //   }
    this.strategy = options.algorithm;
    this.name = options.name;

    // INCLUDE THE OTHER ALGORITHMS
    //RSI
    this.rsiAlgo = new RSIAlgo({
      name: 'RSIAlgo',
      algorithm: {
        triggers: {long: 0.8, short: 0.2},
        rsi: {lookback: this.strategy.rsi.lookback},
      },
    });
    // MOVING AVARAGE
    this.movingAvarageAlgo = new MovingAvarageAlgo({
      name: 'MovingAvarageAlgo',
      algorithm: {
        triggers: {long: 1, short: 0},
        ma: {sma: this.strategy.ma.sma, ema: this.strategy.ma.ema},
        padding: this.strategy.ma.padding,
      },
    });
    // STOCHASTIC OSCILATOR
    this.stochasticOscillatorAlgo = new StochasticOscillatorAlgo({
      name: 'StocasticOscillatorAlgo',
      algorithm: {
        triggers: {long: 0.8, short: 0.2},
        so: {ksize: this.strategy.so.ksize, dsize: this.strategy.so.dsize},
      },
    })
  }

  getDecisionNumber(askPrice){

    let rsi_strat = this.rsiAlgo.getDecisionNumber(askPrice);
    let ma_strat = this.movingAvarageAlgo.getDecisionNumber(askPrice);
    let so_strat = this.stochasticOscillatorAlgo.getDecisionNumber(askPrice);
    
    // HANDLE POSSIBLE DIVISION BY 0
    let decisionNumber =
      (
        this.strategy.rsi.weight * this.getDynamicWeight(rsi_strat) * rsi_strat +
        this.strategy.ma.weight * this.getDynamicWeight(ma_strat) * ma_strat +
        this.strategy.so.weight * this.getDynamicWeight(so_strat) * so_strat
      )  /
      (
        this.strategy.rsi.weight * this.getDynamicWeight(rsi_strat) +
        this.strategy.ma.weight * this.getDynamicWeight(ma_strat) +
        this.strategy.so.weight * this.getDynamicWeight(so_strat)
      );
    if(isNaN(decisionNumber)){
      decisionNumber = 0.5;
    }

    return decisionNumber;
  }

  getDynamicWeight(w){
    let a = 1;
    let b = 0.5;
    let c = 0.03;

    let res = -a * Math.exp(-1 * (Math.pow(w - b, 2) / c)) + 1;
    return res;
  }

  getOptions(){
    return {name: this.name, algorithm: this.strategy};
  }
}



module.exports = MergeAlgo;
