import placeFactoryABI from '../abis/placeFactoryABI.json';
import { DecentravellerContract } from '../contractTypes';

const placeFactoryStringifiedABI = JSON.stringify(placeFactoryABI);

const decentravellerPlaceFactoryContract: DecentravellerContract = {
    addressesByBlockchain: {
        LOCALHOST: '0x610178da211fef7d417bc0e6fed39f05609ad788',
        GOERLI: '0x86D8E6Fa6A84C866a6b84C9f14F6339F49DfF6a2',
    },
    fullContractABI: placeFactoryStringifiedABI,
};

export { decentravellerPlaceFactoryContract };
