const fs = require('fs');
const Indicators = require('../indicators');

class StocasticOscillatorAlgo{
  constructor(options){
    // EXAMPLE options = {
    // {
    //   name: 'StocasticOscillatorAlgo',
    //   algorithm: {
    //       triggers: {long: 0.8, short: 0.2},
    //       so: {ksize: 40, dsize: 6},
    //     },
    // }

    this.algorithm = options.algorithm;
    this.name = options.name;

    // DEFINE INDICATORS
    this.so = new Indicators.StocasticOscillator(
      this.algorithm.so.ksize,
      new Indicators.ExponentialMovingAvarage(this.algorithm.so.dsize)
    );
  }

  getDecisionNumber(askPrice){

    let s = this.so.next(askPrice);
    let so_strat = s.d + (((s.k / 100) - (s.d/100)) / 2);
    let decisionNumber = (100 - so_strat) / 100;

    return decisionNumber;
  }

  getOptions(){
    return {name: this.name, algorithm: this.algorithm};
  }
}




module.exports = StocasticOscillatorAlgo;
