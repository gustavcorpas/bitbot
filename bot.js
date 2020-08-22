'use strict';

let config = require('./config');

let request = require('request');
let crypto = require('crypto');


let bot = {

  getHistoricalTrades: function(inp){
    return new Promise((resolve, reject) => {
      let inpDeault = {
        binSize: '1m',
        partial: 'false',
        symbol: 'XBTUSD',
        count: '100',
        reverse: 'true',
      };
      let data = Object.assign(inpDeault, inp);
      this.query({verb: 'GET', path: `/api/v1/trade/bucketed?binSize=${data.binSize}&partial=${data.partial}&symbol=${data.symbol}&count=${data.count}&reverse=${data.reverse}`}, (error, response, body) => {
        if(error) { reject(error); return; }
        resolve(JSON.parse(body));
      });
    });

  },

  // POST REQUEST TO SEND ORDER
  placeOrder: function(inp){
    return new Promise((resolve, reject) => {
      let inpDeault = {symbol:"XBTUSD",orderQty:10,price:590,ordType:"Limit"};
      let data = Object.assign(inpDeault, inp);
      this.query({verb: 'POST', path: '/api/v1/order', data: data }, (error, response, body) => {
        if (error) { reject(error); return; }
        resolve(JSON.parse(body));
      });
    });
  },

  // CANCEL ORDER(S)
  cancelOrders: function(inp){
    return new Promise((resolve, reject) => {
      let inpDeault = {orderID: ''}
      let data = Object.assign(inpDeault, inp);
      console.log(data);
      this.query({verb: 'DELETE', path: '/api/v1/order', data: JSON.stringify(data)}, (error, response, body) => {
        if(error) { reject(error); return; }
        resolve(JSON.parse(body));
      });
    });
  },

  // GET ORDERS
  getOrders: function(){
    return new Promise((resolve, reject) => {
      this.query({verb: 'GET', path: '/api/v1/order?symbol=XBT&filter=%7B%22open%22%3Atrue%7D'}, (error, response, body) => {
        if (error) { reject(error); return; }
        resolve(JSON.parse(body));
      });
    });
  },

  getOrderBook: function(amount = 20){
    return new Promise((resolve, reject) => {
      this.query({verb: 'GET', path: '/api/v1/order?reverse=true&count='+amount}, (error, response, body) => {
        if (error) { reject(error); return; }
        resolve(JSON.parse(body));
      });
    });
  },

  // GET POSITIONS
  getPositions: function(){
    return new Promise((resolve, reject) => {
      this.query({verb: 'GET', path: '/api/v1/position'}, (error, response, body) => {
        if (error) { reject(error); return; }
        resolve(JSON.parse(body));
      });
    });
  },





  // GENERIC QUERY HELPER FUNCTION
  query: function(inp, callback){
    let inpDeault = {
      verb: 'GET',
      path: '/api/v1/',
      data: '',
    };
    let master = Object.assign(inpDeault, inp);

    let expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
    if(master.verb == 'POST'){
      master.data = JSON.stringify(master.data);
    }

    let signature = crypto.createHmac('sha256', config.apiSecret).update(master.verb + master.path + expires + master.data).digest('hex');

    let headers = {
      'content-type' : 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'api-expires': expires,
      'api-key': config.apiKey,
      'api-signature': signature
    };

    const requestOptions = {
      headers: headers,
      url: config.endpoint+master.path,
      method: master.verb,
      body: master.data
    };

    request(requestOptions, callback);
  }

}

module.exports = bot;
