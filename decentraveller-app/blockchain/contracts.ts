import mainContractABI from './abis/mainContractABI.json';
import { Blockchain } from './config';

interface AddressesByBlockchain {
    GOERLI: string;
    LOCALHOST: string;
}

export interface ContractFunction {
    functionName: string;
    functionABI: string;
}

export interface DecentravellerContract {
    addressesByBlockchain: { [key in Blockchain]: string };
    functions: { [key in string]: ContractFunction };
}

const decentravellerMainContract: DecentravellerContract = {
    addressesByBlockchain: {
        LOCALHOST: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
        GOERLI: '0x86D8E6Fa6A84C866a6b84C9f14F6339F49DfF6a2',
    },
    functions: {
        addPlace: {
            functionName: 'addPlace',
            functionABI: JSON.stringify(mainContractABI),
        },
    },
};

export { decentravellerMainContract };
