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
        hasVoted: {
            functionName: 'hasVoted',
            fullContractABI: contractStringfiedABI,
        },
        voteForCensorship: {
            functionName: 'voteForCensorship',
            fullContractABI: contractStringfiedABI,
        },
        voteAgainstCensorship: {
            functionName: 'voteAgainstCensorship',
            fullContractABI: contractStringfiedABI,
        },
        getChallengeVotingResults: {
            functionName: 'getChallengeVotingResults',
            fullContractABI: contractStringfiedABI,
        },
        getJuries: {
            functionName: 'getJuries',
            fullContractABI: contractStringfiedABI,
        },
        executeUncensorship: {
            functionName: 'executeUncensorship',
            fullContractABI: contractStringfiedABI,
        },
    },
};

export { decentravellerReviewContract };
