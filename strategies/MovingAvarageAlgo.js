const fs = require('fs');
const Indicators = require('../indicators');

class MovingAvarageAlgo{
  constructor(options){
    // EXAMPLE options = {
    // {
    //   name: 'MovingAvarageAlgo',
    //   algorithm: {
    //       triggers: {long: 1, short: 0},
    //       ma: {sma: 30, ema: 60},
    //       padding: 1,
    //     },
    // }

    this.algorithm = options.algorithm;
    this.name = options.name;

    // DEFINE INDICATORS
    this.sma = new Indicators.ExponentialMovingAvarage(this.algorithm.ma.sma);
    this.ema = new Indicators.ExponentialMovingAvarage(this.algorithm.ma.ema);

  }

  getDecisionNumber(askPrice){

    let current_sma = this.sma.next(askPrice);
    let current_ema = this.ema.next(askPrice);
    // let ma_strat = (current_ema > current_sma) ? 1 : 0;
    let x = current_ema - current_sma;
    let sigmoided = 1 / (1 + Math.exp(-(1/this.algorithm.padding)*x));

    let decisionNumber = sigmoided;
    return decisionNumber;
  }

  getOptions(){
    return {name: this.name, algorithm: this.algorithm};
  }
}




module.exports = MovingAvarageAlgo;
