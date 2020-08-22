'use strict';

let minDataBeforeTrade = 40;
// DATAPATH
let nameofdata = './output.json';
// let nameofdata = './data/18.json';

// ESSENTIALS
let fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
let chalk = require('chalk');
let Config = require('./Config')

let data = JSON.parse(fs.readFileSync(nameofdata));
let workeddata = [];



// SETUP STRATEGIES
let strategies = [];
try{
  strategies = require('./strategies/lists/'+process.argv[2]);
  console.log(`${chalk.white(`
    strategies loaded ${chalk.green.bold('succesfully')} from ${chalk.bold(process.argv[2])}.
  `)}`);
}
catch{
  console.log(`${chalk.white(`
    loading of strategies ${chalk.red.bold('failed')}
    ${chalk.gray.bold(process.argv[2])} does not exist.
    run > ${chalk.bold('node evaluate.js [name of list in ./strategies/lists/]')}
  `)}`);
  process.exit();
}
// SERVING LOGIC

function getWorkedData(){
  let data = JSON.parse(fs.readFileSync(nameofdata));
  let workeddata = [];

  for(let i = 0; i < data.length; i++){
    if(data[i] && workeddata[workeddata.length - 1] && data[i] == workeddata[workeddata.length -1]){

      continue;
    }
    workeddata.push(data[i]);
  }
  return workeddata;
}

function testStrategies(strategies, workeddata, evaluator){
  for(let strategy of strategies){
    let lastaction = '';
    let actions = [];
    for(let [index, data] of workeddata.entries()){
      let decisionNumber = strategy.getDecisionNumber(data);
      if(index < minDataBeforeTrade){
        continue;
      }

      if(decisionNumber >= strategy.getOptions().algorithm.triggers.long && lastaction !== 'long'){
        actions.push({askPrice: data, decision: 'LONG', index: index});
        lastaction = 'long';
      }
      if(decisionNumber <= strategy.getOptions().algorithm.triggers.short && lastaction !== 'short'){
        actions.push({askPrice: data, decision: 'SHORT', index: index});
        lastaction = 'short';
      }
    }
    evaluator.addEvaluation(actions, strategy.name, workeddata);
  }
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/data', (req, res) => {
  let workeddata = getWorkedData();
  workeddata = workeddata.map((data, index) => {return {askPrice: data, index: index}});
  res.json(workeddata);
});

app.get('/strategies', async (req, res) => {
  let workeddata = getWorkedData();
  let evaluator = new Evaluator();

  testStrategies(strategies, workeddata, evaluator);

  let sums = evaluator.getSums();
  res.json(sums);
});

app.get('/lowest', async (req, res) => {
  let workeddata = getWorkedData();
  let evaluator = new Evaluator();

  testStrategies(strategies, workeddata, evaluator);

  let sums = evaluator.getSums();
  res.json(sums.splice(-5).sort((a, b) => a.sum - b.sum));


});
app.get('/highest', async (req, res) => {
  let workeddata = getWorkedData();
  let evaluator = new Evaluator();

  testStrategies(strategies, workeddata, evaluator);

  let sums = evaluator.getSums();
  res.json(sums);

});

app.listen(port, () => {
  console.log(`${chalk.white(`
    Evaluation script is running.
    Open ${chalk.cyan.bold('visualize.html')} to view results!
  `)}`);
});

// EVALUATOR

class Evaluator {
  constructor(){
    this.sums = [];
  }

  addEvaluation(trades, strategy, totaldata){
    let sum = 0;
    let sumarray = [];
    sumarray.length = totaldata.length;

    for(let i = 0; i < trades.length; i++){
      let diff = 0;
      if(typeof(trades[i+1]) == 'undefined'){
        diff = trades[i].askPrice - totaldata[totaldata.length - 1];
      }else{
        diff = trades[i].askPrice - trades[i+1].askPrice;
      }
      if(trades[i].decision == 'SHORT'){
        sum += diff - 0.5;
      }
      else if(trades[i].decision == 'LONG'){
        sum -= diff + 0.5;
      }
      sumarray[trades[i].index] = sum;

    }

    let lastknownvalue = 0;
    for(let i = 0; i < sumarray.length; i++){
      if(typeof(sumarray[i]) == 'undefined' || sumarray[i] == null){
        sumarray[i] = lastknownvalue;
        continue;
      }
      lastknownvalue = sumarray[i];
    }
    this.sums.push({sum: sum, strategy: strategy, trades: trades.length, graph: sumarray});
  }

  getSums(){
    this.sums.sort((a, b) => (b.sum / b.trades) - (a.sum / a.trades));
    // this.sums.sort((a, b) => (b.sum ) - (a.sum));
    return this.sums;
  }

}
