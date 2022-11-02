import addPlaceABI from './abis/addPlaceABI.json';
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
        LOCALHOST: '',
        GOERLI: '0xD30D709b5B422A745ef38392539217BeE689F243',
    },
    functions: {
        addPlace: {
            functionName: 'addPlace',
            functionABI: JSON.stringify(addPlaceABI),
        },
    },
};

export { decentravellerMainContract };
