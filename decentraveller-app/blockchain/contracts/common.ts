import { Blockchain } from '../config';

interface AddressesByBlockchain {
    GOERLI: string;
    LOCALHOST: string;
}

export interface ContractFunction {
    functionName: string;
    fullContractABI: string;
}

export interface DecentravellerContract {
    addressesByBlockchain?: { [key in Blockchain]: string };
    functions: { [key in string]: ContractFunction };
}
