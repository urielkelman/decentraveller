import placeContractABI from './../abis/placeContractABI.json';
import { DecentravellerContract } from './common';

const placeContractStringifiedABI = JSON.stringify(placeContractABI);

const decentravellerPlaceContract: DecentravellerContract = {
    functions: {
        addReview: {
            functionName: 'addReview',
            fullContractABI: placeContractStringifiedABI,
        },
    },
};

export { decentravellerPlaceContract };
