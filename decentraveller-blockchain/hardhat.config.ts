import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
import "./tasks/block_number";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/types/config";

dotenv.config();

const localhostHost = process.env.LOCALHOST_HOST_ADDRESS || "localhost";

const baseConfig: HardhatUserConfig = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        localhost: {
            url: `http://${localhostHost}:8545/`,
            chainId: 31337,
        },
        hardhat: {
            accounts: {
                count: 200
            },
        }
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
        reviewer: {
            default: 2,
        },
        tokenOwner: {
            default: 3,
        },
        tokenMinter: {
            default: 4,
        },
        faucet: {
            default: 5,
        },
    },
};

const getFullConfig = (): HardhatUserConfig => {
    const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string;
    const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;
    const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY as string;

    return {
        ...baseConfig,
        networks: {
            ...baseConfig.networks,
            goerli: {
                url: GOERLI_RPC_URL,
                accounts: [PRIVATE_KEY],
                chainId: 5,
            },
        },
        etherscan: {
            apiKey: ETHERSCAN_API_KEY,
        },
        gasReporter: {
            ...baseConfig.gasReporter,
            coinmarketcap: COINMARKETCAP_API_KEY,
        },
    };
};

const config: HardhatUserConfig = process.env.GOERLI_RPC_URL
    ? getFullConfig()
    : baseConfig;

export default config;
