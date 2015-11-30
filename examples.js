var AnxPro = require('anx');

// convert to unix time in milliseconds
var since1Minute = new Date().getTime() -  60 * 1000, // 60 seconds ago
    since1Day = new Date().getTime() - 60 * 60 * 24 * 1000, // 1 day ago
    since1Year = new Date().getTime() - 365 * 60 * 60 * 24 * 1000 // 1 year ago

// Test public data APIs
var publicClient = new AnxPro(null, null, 'BTCUSD');

//publicClient.ticker(console.log);

//publicClient.tickerFast(console.log);

//publicClient.fetchTrades(since1Day, console.log);

//publicClient.fetchDepth(console.log);

//publicClient.fullDepth(console.log);

// Either pass your API key and secret as the first and second parameters to examples.js. eg
// node examples.js your-api-key your-api-secret
//
// Or enter them below.
// WARNING never commit your API keys into a public repository.
var key = process.argv[2] || 'your-api-key';
var secret = process.argv[3] || 'your-api-secret';

var privateClient = new AnxPro(key, secret, 'BTCUSD');

// uncomment the API you want to test.
// Be sure to check the parameters so you don't do any unwanted live trades

//privateClient.info(console.log);

//privateClient.history('BTC', 1, since1Year, new Date().getTime(), console.log);

//privateClient.tradeHistory(since1Year, new Date().getTime(), console.log);
