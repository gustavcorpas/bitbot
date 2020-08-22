const fs = require('fs');
const Indicators = require('../indicators');

class RSIAlgo{
  constructor(options){
    // EXAMPLE options = {
    // {
    //   name: 'RSIAlgo',
    //   algorithm: {
    //       triggers: {long: 0.8, short: 0.2},
    //       rsi: {lookback: 20},
    //     },
    // }

    this.algorithm = options.algorithm;
    this.name = options.name;

    // DEFINE INDICATORS
    this.rsi = new Indicators.RelativeStrengthIndex(
      new Indicators.SimpleMovingAvarage(this.algorithm.rsi.lookback),
      new Indicators.SimpleMovingAvarage(this.algorithm.rsi.lookback)
    );
  }

  getDecisionNumber(askPrice){

    let r = this.rsi.next(askPrice);
    let rsi_strat = (100 - r) / 100;
    let decisionNumber = rsi_strat;

    return decisionNumber;
  }

  getOptions(){
    return {name: this.name, algorithm: this.algorithm};
  }
}




module.exports = RSIAlgo;
