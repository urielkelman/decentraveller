import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import "./tasks/block_number";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";

dotenv.config();

var config: HardhatUserConfig;

if(process.env.GOERLI_RPC_URL) {
    const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string;
    const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;
    const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY as string;

    config = {
        solidity: "0.8.17",
        defaultNetwork: "hardhat",
        networks: {
            goerli: {
                url: GOERLI_RPC_URL,
                accounts: [PRIVATE_KEY],
                chainId: 5,
            },
            /* Localhost network, which is run by 'yarn hardhat node' is a different blockchain that the default one.
            The default only lives for a script execution, while the other one is a process that can run an arbitrary amount of time.  */
        },
        etherscan: {
            apiKey: ETHERSCAN_API_KEY,
        },
        gasReporter: {
            enabled: true,
            outputFile: "gas-report.txt",
            noColors: true,
            currency: "USD",
            coinmarketcap: COINMARKETCAP_API_KEY,
            token: "MATIC",
        },
        namedAccounts: {
            deployer: {
                default: 0,
            },
            user: {
                default: 1,
            },
        },
    };
} else {
    let localhost_host = "localhost"

    if(process.env.LOCALHOST_HOST_ADDRESS){
        localhost_host = process.env.LOCALHOST_HOST_ADDRESS
    }

    config = {
        solidity: "0.8.17",
        defaultNetwork: "hardhat",
        networks: {
            /* Localhost network, which is run by 'yarn hardhat node' is a different blockchain that the default one.
            The default only lives for a script execution, while the other one is a process that can run an arbitrary amount of time.  */
            localhost: {
                url: `http://${localhost_host}:8545/`,
                chainId: 31337,
            },
        },
        namedAccounts: {
            deployer: {
                default: 0,
            },
            user: {
                default: 1,
            },
        },
    };
}

export default config;
