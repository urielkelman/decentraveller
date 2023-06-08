import mainContractABI from './abis/mainContractABI.json';
import { Blockchain } from './config';

interface AddressesByBlockchain {
    GOERLI: string;
    LOCALHOST: string;
}

export interface ContractFunction {
    functionName: string;
    fullContractABI: string;
}

export interface DecentravellerContract {
    addressesByBlockchain: { [key in Blockchain]: string };
    functions: { [key in string]: ContractFunction };
}

const mainContractStringfiedABI = JSON.stringify(mainContractABI);

const decentravellerMainContract: DecentravellerContract = {
    addressesByBlockchain: {
        LOCALHOST: '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9',
        GOERLI: '0x86D8E6Fa6A84C866a6b84C9f14F6339F49DfF6a2',
    },
    functions: {
        addPlace: {
            functionName: 'addPlace',
            fullContractABI: mainContractStringfiedABI,
        },
        registerUser: {
            functionName: 'registerProfile',
            fullContractABI: mainContractStringfiedABI,
        },
    },
};

export { decentravellerMainContract };
