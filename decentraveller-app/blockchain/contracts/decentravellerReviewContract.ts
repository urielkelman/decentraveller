import reviewContractABI from '../abis/reviewContractABI.json';
import { DecentravellerContract } from '../contractTypes';

const contractStringfiedABI = JSON.stringify(reviewContractABI);

const decentravellerReviewContract: DecentravellerContract = {
    fullContractABI: contractStringfiedABI,
    functions: {
        getState: {
            functionName: 'getState',
            fullContractABI: contractStringfiedABI,
        },
    },
};

export { decentravellerReviewContract };
