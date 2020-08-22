# Anna-BOT for Bitmex crypto trading (Version 1.1)

This project builds on top of existing bitmex setup.
Uses node.js.

To collect data:
Run > node collect.js

To evaluate data:
Run > node evaluate.js
Open > visualize.html

To start trading:
Run > trader.js

## Current trading setup (The Merging Algorithm)

The trading bot is using a Merging Algorithm designed to merge together different strategies into one single decision number.

Currently it is merging the strategies:
1) RSI (Relative Strength Index)
2) MACD (Moving Avarage Convergence Divergence )
3) SO (Stochastic Oscillator)

*Strategies have been modified to output decision numbers from [0;1]*

The merging algorithm is assigning dynamic weights based on output from individual strategies, using a reversed Gaussian function.
As such weights are biased towards high and low output from RSI, MACD and SO, and set to 0 for an output of 0.5.

## Files and what they do

##### bot.js

This file supplies the following wrapper methods for simple querying the bitmex api.
The methods can take optional objects to set one or more values. Otherwise default values are used.
Eg. placeOrder({orderQty: 10, price: 700});

1) getHistoricalTrades(options)
  defaultOptions = {
    binSize: '1m',
    partial: 'false',
    symbol: 'XBTUSD',
    count: '100',
    reverse: 'true',
  };

2) placeOrder(options)
  defaultOptions = {symbol:"XBTUSD",orderQty:10,price:590,ordType:"Limit"};

3) cancelOrders(options)
  defaultOptions = {orderID: ''};
  OBS: an orderID MUST be supplied. Can also be supplied as an array of orderIDs

4) getOrders()

5) getPositions()


#### collect.js

Starts collecting data from a data stream, and stores this information in an output.json file at certain intervals.

#### config.js

Setup, API-keys, etc., and parameters for the strategy.

#### data/

Just a folder for you to put data into. Remember that output.json will be overridden in ./ by collect.js

#### evaluate.js

Reads the output.json file and spins up a server on *port 3000*. This is used by *visualize.html* to show the data.
This file creates the following endpoints at port 3000

1) localhost:3000/data/
  All the data from output.json (ignoring identical values in a row), and wrapped in a graph array for visualization with *chart.js*
2) localhost:3000/strategies/
  Gets all evaluated strategies
3) localhost:3000/lowest/
  Gets the lowest scoring strategies
4) localhost:3000/highest/
  Gets the highest scoring strategies

#### index.js

Bitmex Client made by bitmex.
Part of the [official bitmex setup for node].

#### indicators.js

Indicators used in strategy-making.
Includes SMA, EMA, RSI and Stochastic Oscillator.

#### ./ lib

Used by index.js
Part of the [official bitmex setup for node]

#### output.json

Created by collect.js. A bunch of data to use for back-trading, i.e. adjusting the trading parameters and testing strategies. Used by evaluate.js

#### strategies/

Contains all strategies. Custom strategies can be added and loaded in lists

#### strategies/lists/

Can be loaded from evaluate.js. This folder is for containing lists of strategies with their parameter.
Strategies are exported, and can as such be built dynamically from these list files.

#### trader.js

This is the main file for setting up the actual data stream and making decisions based on that.

#### visualize.html

Used to visualize different strategies. Uses the *chart.js* liberary.
