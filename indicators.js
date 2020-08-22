class MovingAvarage {

  constructor(size){
    this.size = size;
    this.queue = [];
    this.sum = 0;

  }

}

class SimpleMovingAvarage extends MovingAvarage {
  constructor(size){
    super(size);
  }

  next(inp){
    if(this.queue.length >= this.size){
      this.sum -= this.queue.shift();
    }
    this.sum += inp;
    this.queue.push(inp);
    return this.sum / this.queue.length;
  }

}

class ExponentialMovingAvarage extends MovingAvarage {


  constructor(size){
    super(size);
    this.prevEma = null;
  }

  next(inp){
    if(this.prevEma === null){ this.prevEma = inp; }

    if(this.queue.length >= this.size){
      this.queue.shift();
    }
    this.queue.push(inp);
    return this.calcEma(inp);
  }

  calcEma(price){
    if(!this.prevEma) { this.prevEma = price; }
    let k = 2/(this.queue.length +1);
    this.prevEma = (price * k) + (this.prevEma * (1 - k));
    return this.prevEma;
  }


}

class StocasticOscillator {

  constructor(ksize, dfunc){
    this.ksize = ksize;
    this.dfunc = dfunc;
    this.queue = [];
  }

  next(inp){

    if(this.queue.length >= this.ksize){
      this.queue.shift();
    }
    this.queue.push(inp);
    let sortedQueue = [...this.queue].sort((a, b) => b - a);
    let max = sortedQueue[0];
    let min = sortedQueue[sortedQueue.length -1];
    let k = ((inp - min) / (max - min)) * 100;
    let d = this.dfunc.next(k);

    return {k, d};


  }

}

class RelativeStrengthIndex {

  constructor(movingAvarageFunctionGain, movingAvarageFunctionLoss){
    this.lastInp = 0;
    this.MAgain = movingAvarageFunctionGain;
    this.MAloss = movingAvarageFunctionLoss;
  }

  next(inp){
    let change = inp - this.lastInp;
    this.lastInp = inp;
    let gain = (change > 0) ? this.MAgain.next(change) : this.MAgain.next(0);
    let loss = (change <= 0) ? this.MAloss.next(0  - change) : this.MAloss.next(0);

    let rs = gain / loss
    let rsi = 100 - (100 / (rs + 1));

    return rsi;
  }
}


class DecisionHelper {

  constructor(){
    this.lastTop;
    this.newTop;
  }

  checkChange(sma, ema){
    let resp = '';

    this.lastTop = this.lastTop || getTop(sma, ema);
    this.newTop = getTop(sma, ema);

    if(this.newTop == 'SMA' && this.lastTop == 'EMA'){
      resp = 'SHORT';
    }
    else if(this.newTop == 'EMA' && this.lastTop == 'SMA'){
      resp = 'LONG';
    }
    else{
      resp = 'NO CHANGE';
    }

    this.lastTop = this.newTop;
    return resp;


    function getTop(sma, ema){
      if(sma - ema > 0){
        return 'SMA';
      }else{
        return 'EMA';
      }
    }
  }
}



module.exports = {
  ExponentialMovingAvarage,
  SimpleMovingAvarage,
  StocasticOscillator,
  RelativeStrengthIndex,
  DecisionHelper,
}
