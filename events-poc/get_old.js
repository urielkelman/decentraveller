const Web3 = require("web3");

const web3 = new Web3(
  "wss://eth-goerli.g.alchemy.com/v2/NpEpzMo4yiyNfC_v2wP0dHhPAGWDdec4"
);
let response = web3.eth
  .getPastLogs({
    fromBlock: 7876015,
    toBlock: 7876017,
    address: "0xD30D709b5B422A745ef38392539217BeE689F243",
  })
  .then((r) => console.log(r));

console.log(response);
