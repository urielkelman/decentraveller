const Web3 = require("web3");

const web3 = new Web3("http://127.0.0.1:8545/");

var options = {
  address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
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
