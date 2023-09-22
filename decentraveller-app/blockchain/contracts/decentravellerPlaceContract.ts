import placeContractABI from './../abis/placeContractABI.json';
import { DecentravellerContract } from '../contractTypes';

const placeContractStringifiedABI = JSON.stringify(placeContractABI);

const decentravellerPlaceContract: DecentravellerContract = {
    fullContractABI: placeContractStringifiedABI,
    functions: {
        addReview: {
            functionName: 'addReview',
            fullContractABI: placeContractStringifiedABI,
        },
    },
};

export { decentravellerPlaceContract };
