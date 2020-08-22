const config = {
  // endpoint: 'https://www.bitmex.com',
  // apiKey: "API_KEY_HERE",
  // apiSecret: "API_SECRET_HERE",
  // testnet: false,

  endpoint: 'https://testnet.bitmex.com',
  apiKey: "API_KEY_HERE",
  apiSecret: "API_SECRET_HERE",
  testnet: true,

  positionQuantity: 20,
  minDataBeforeTrade: 90,
  batchTimeInSeconds: 3600,
  timeStepDecisionInSeconds: 43200,

  algorithm: {
    triggers: {
      long: 0.75,
      short: 0.25,
    },
    rsi: {
      weight: 1,
      lookback: 14,
    },
    ma: {
      weight: 1,
      triggers: {long: 0.75, short: 0.25},
      sma: 23,
      ema: 20,
      padding: 1,
    },
    so: {
      weight: 1,
      ksize: 14,
      dsize: 3,
    }
  },
}

module.exports = config;
