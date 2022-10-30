import addPlaceABI from './abis/addPlaceABI.json';

interface AddressesByBlockchain {
    GOERLI: string;
    LOCALHOST: string;
}

interface Contract {
    addressesByBlockchain: AddressesByBlockchain;
}

interface DecentravellerContract extends Contract {
    addPlaceFunctionABI: string;
}

const decentravellerContract: DecentravellerContract = {
    addressesByBlockchain: {
        GOERLI: '0x2037D009a0E170A6BdB506284b7d08A3f902F514',
        LOCALHOST: '',
    },
    addPlaceFunctionABI: JSON.stringify(addPlaceABI),
};

export { decentravellerContract };
