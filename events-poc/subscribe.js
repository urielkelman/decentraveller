const Web3 = require("web3");

const web3 = new Web3(
  "wss://eth-goerli.g.alchemy.com/v2/NpEpzMo4yiyNfC_v2wP0dHhPAGWDdec4"
);

var options = {
  address: "0xD30D709b5B422A745ef38392539217BeE689F243",
  /*topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  ],*/
};

var subscription = web3.eth
  .subscribe("logs", options, function (error, result) {
    if (!error) console.log("got result");
    else console.log(error);
  })
  .on("data", function (log) {
    console.log("got data", log);
  })
  .on("changed", function (log) {
    console.log("changed");
  });

var options2 = {
  address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  ],
};

/*ar subscription2 = web3.eth.subscribe('logs', options2, function(error, result){
    if (!error) console.log('got result');
    else console.log(error);
}).on("data", function(log){
    console.log('got data wrapped btc', log);
}).on("changed", function(log){
    console.log('changed');
});*/
