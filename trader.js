'use strict'

// IMPORT SCRIPTS
const Config = require('./config');
const MergeAlgo = require('./strategies/MergeAlgo');
const Bot = require('./bot');
const BitMEXClient = require('./index');

// DEFINE Trading Algo
let algorithm = new MergeAlgo(
  {
    name: 'TradingMergeAlgo',
    algorithm: Config.algorithm,
  }
);

// SET UP CLIENT
const client = new BitMEXClient({testnet: Config.testnet});
client.on('error', console.error);
client.on('open', () => console.log('Connection opened.'));
client.on('close', () => console.log('Connection closed.'));
client.on('initialize', () => console.log('Client initialized, data is flowing.'));

// stream in latest data
let current = {askPrice: null, askPriceAvarage: null, lastAction: '', time: null};
let decisionNumber = 0;
let finalWorkedData = [];
let workeddata = [];
let minutedata = [];
let nextDecisionTime = Date.now() + 1000 * Config.timeStepDecisionInSeconds;
let nextBatchTime = Date.now() + 1000 * Config.batchTimeInSeconds;
let avarage = 0;
let avarageForDecision = 0;

Bot.getHistoricalTrades({binSize: '1h', count: '1000'}).then(res => {
  for(let i = res.length-1; i >= 0; i--){
    workeddata.push({askPriceAvarage: res[i].close});
    if(workeddata.length >= 12){
      runDecider(workeddata);
    }
  }

});


return;

client.addStream('XBTUSD', 'quote', function(data, symbol, table) {

  current.askPrice = data[data.length - 1].askPrice;
  current.timestamp = new Date(data[data.length - 1].timestamp);
  // console.log(".");

  if(Date.now() < nextBatchTime){

    // Secure that the askPrice is not identical
    if(data.length > 0 && minutedata.length > 0 && current.askPrice == minutedata[minutedata.length-1].askPrice){
      return;
    }

    minutedata.push(data[data.length-1]);
    console.log("new data: " + minutedata[minutedata.length -1].askPrice);
    // FIND BEST TIME TO SHORT / LONG
    current.lastAction = decideAndOrder(decisionNumber, current.lastAction, minutedata[minutedata.length -1].askPrice, 0.5, current.askPriceAvarage);

    return;
  }

  // get minute avarage taking into account timestamp
  let sum = 0;
  for(let el of minutedata){
    sum += el.askPrice;
  }
  if(minutedata.length > 0){
    avarage = sum / minutedata.length;
  }

  workeddata.push({askPriceAvarage: avarage});

  nextBatchTime = Date.now() + 1000 * Config.batchTimeInSeconds;
  console.log("added avarage of: " + workeddata[workeddata.length -1].askPriceAvarage + " from " + minutedata.length + " values.");
  minutedata = [];

  if(Date.now < nextDecisionTime){
    return;
  }

  runDecider(workeddata);



});

function runDecider(decideData){
  // get decision time avarage
  let sumForDecision = 0;
  for(let el of decideData){
    sumForDecision += el.askPriceAvarage;
  }
  if(decideData.length > 0){
    avarageForDecision = sumForDecision / decideData.length;
  }else{
    console.log("no new data for decision!");
  }

  finalWorkedData.push({askPriceAvarage: avarageForDecision});
  nextDecisionTime = Date.now() + 1000 * Config.timeStepDecisionInSeconds;
  console.log("Making decision on value: " + finalWorkedData[finalWorkedData.length -1].askPriceAvarage + " from " + workeddata.length + " values.");
  workeddata = [];

  current.askPriceAvarage = finalWorkedData[finalWorkedData.length-1].askPriceAvarage;

  // Secure that enough finalWorkedData is collected
  if(finalWorkedData.length > Config.minDataBeforeTrade){
    decisionNumber = algorithm.getDecisionNumber(current.askPriceAvarage);
    console.log(decisionNumber + ' / ' + current.lastAction);
  }else{
    decisionNumber = algorithm.getDecisionNumber(current.askPriceAvarage);
    console.log('Gathering data: ' + finalWorkedData.length + ' / ' + Config.minDataBeforeTrade + ' / ' + decisionNumber);
  }
}


function placeOrder(price, decision){
  //check minDataBeforeTrade
  if(finalWorkedData.length < Config.minDataBeforeTrade){
    console.log("Failed placeOrder. Missing (" + (Config.minDataBeforeTrade - finalWorkedData.length) + ") datapoints.");
    return;
  }
  // get orders
  Bot.getOrders()
    .then(orders => {
      let orderIDs = orders.map(order => order.orderID);
      // cancel active orders
      Bot.cancelOrders({orderID: orderIDs})
        .then(() => {
          // Calculate amount based on current open position
          Bot.getPositions()
            .then(positions => {
              let qty = positions[0].currentQty;
              let purchaseAmount = Config.positionQuantity + Math.abs(qty);
              if(decision == 'short'){
                purchaseAmount *= -1;
              }
                // Place the order
              if(decision == 'short' && purchaseAmount < 0 || decision == 'long' && purchaseAmount > 0){
                Bot.placeOrder({orderQty: purchaseAmount, price: price})
                  .then(() => console.log('placed order for ' + purchaseAmount + ' / ' + decision))
                  .catch(e => console.log(e));
              }
              else{
                console.log('could not place order. Perhaps last order did not go through.');
              }
            });
        });
    });
}

function decideAndOrder(decisionNumber, lastaction, price, pricePadding, avarageprice){
  let action = '';
  if(decisionNumber >= Config.algorithm.triggers.long && lastaction !== 'long' && price <= avarageprice){
    placeOrder(price + pricePadding, 'long');
    action = 'long';
  }
  else if(decisionNumber <= Config.algorithm.triggers.short && lastaction !== 'short' && price >= avarageprice){
    placeOrder(price - pricePadding, 'short');
    action = 'short';
  }
  let result = action || lastaction;
  return result;
}
