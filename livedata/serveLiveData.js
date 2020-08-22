'use strict'

let fs = require('fs');
const express = require('express');
let cors = require('cors');
const app = express();
let router = express.Router();
const port = 3001;

app.use(cors());
app.use('/bitbot', router);


// IMPORT SCRIPTS
const Bot = require('../bot');
//
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

router.get('/alldata/:amount', async (req, res) => {
  let amount = parseInt(req.params.amount) + 1;
  let data = await get(amount);
  res.json(data);
});

router.get('/', (req, res) => {
  res.send('hello there ^.^');
});

app.listen(port, () => {
  console.log("listening on port: "+port);
});


async function get(amount = 10){
  let orders = await Bot.getOrderBook(amount);
  // orders.reverse();
  orders = orders.map(trade => {
    return {
      side: trade.side,
      orderQty: trade.orderQty,
      price: trade.price,
      timestamp: trade.timestamp,
    }
  });
  orders.reverse();
  let evaluated = addEvaluation(orders);
  return evaluated;
}


function addEvaluation(trades){
  let sum = 0;
  let sumarray = [];
  for(let i = 0; i < trades.length-1; i++){

    let diff = (trades[i].price) - (trades[i+1].price);

    if(trades[i].side == 'Sell'){
      sum += diff;
    }
    else if(trades[i].side == 'Buy'){
      sum -= diff;
    }
    sumarray.push({sum, trade: trades[i]});
  }
  // let lastknownvalue = 0;
  // for(let i = 0; i < sumarray.length; i++){
  //   if(typeof(sumarray[i]) == 'undefined'){
  //     sumarray[i] = lastknownvalue;
  //     continue;
  //   }
  //   lastknownvalue = sumarray[i];
  // }
  // sumarray.reverse();
  return {name: 'total', trades: trades.length, graph: sumarray};
}



let mytradeobj = {
  side: 'Sell',
  orderQty: 40,
  price: 6862.5,
  timestamp: '2020-04-12T12:11:33.450Z'
}
