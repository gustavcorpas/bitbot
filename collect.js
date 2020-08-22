'use strict';

let fs = require('fs');
const BitMEXClient = require('./index');


let output = [];
let workeddata = [];

const client = new BitMEXClient({testnet: false});
// handle errors here. If no 'error' callback is attached. errors will crash the client.
client.on('error', console.error);
client.on('open', () => console.log('Connection opened.'));
client.on('close', () => console.log('Connection closed.'));
client.on('initialize', () => console.log('Client initialized, data is flowing.'));

// stream in latest data
client.addStream('XBTUSD', 'quote', function(data, symbol, table) {

  // Secure that the askPrice is not identical
  if(data.length > 0 && workeddata.length > 0 && data[data.length-1].askPrice == workeddata[workeddata.length-1]){
    return;
  }
  workeddata.push(data[data.length-1].askPrice);

  if(workeddata.length%100 == 1){

    fs.writeFile('output.json', JSON.stringify(workeddata), 'utf8', (err) => {
      if(err){ console.log(err); return; }
      console.log("saved!");
    });
  }


  // if(current.decision == 'LONG'){
  //   bot.placeOrder({price: current.askPrice, orderQty: qty});
  //   console.log(`
  //     askPrice: ${chalk.gray(current.askPrice)}
  //     sma: ${chalk.gray(current.sma)}
  //     ema: ${chalk.gray(current.ema)}
  //     decision: ${chalk.black.bgGreen.bold(current.decision)}
  //   `);
  // }
  // else if(current.decision == 'SHORT'){
  //   bot.placeOrder({price: current.askPrice, side:'Sell', orderQty: qty});
  //   console.log(`
  //     askPrice: ${chalk.gray(current.askPrice)}
  //     sma: ${chalk.gray(current.sma)}
  //     ema: ${chalk.gray(current.ema)}
  //     decision: ${chalk.white.bgRed.bold(current.decision)}
  //   `);
  // }
  // else {
    // console.log(`
    //   askPrice: ${chalk.gray(current.askPrice)}
    //   sma: ${chalk.gray(current.sma)}
    //   ema: ${chalk.gray(current.ema)}
    //   decision: ${chalk.gray(current.decision)}
    // `);
  // }

//   output.push({askPrice: current.askPrice});
//
//
// if(output.length%100 == 1){
//
//   fs.writeFile('output5.json', JSON.stringify(output), 'utf8', (err) => {
//     if(err){ console.log(err); return; }
//     console.log("saved!");
//   });
// }


});
