import mainContractABI from '../abis/mainContractABI.json';
import { DecentravellerContract } from '../contractTypes';

const mainContractStringfiedABI = JSON.stringify(mainContractABI);

const decentravellerMainContract: DecentravellerContract = {
    addressesByBlockchain: {
        LOCALHOST: '0xb7f8bc63bbcad18155201308c8f3540b07f84f5e',
        GOERLI: '0x86D8E6Fa6A84C866a6b84C9f14F6339F49DfF6a2',
    },
    fullContractABI: mainContractStringfiedABI,
    functions: {
        addPlace: {
            functionName: 'addPlace',
            fullContractABI: mainContractStringfiedABI,
        },
        registerProfile: {
            functionName: 'registerProfile',
            fullContractABI: mainContractStringfiedABI,
        },
        getPlaceAddress: {
            functionName: 'getPlaceAddress',
            fullContractABI: mainContractStringfiedABI,
        },
        createNewRuleProposal: {
            functionName: 'createNewRuleProposal',
            fullContractABI: mainContractStringfiedABI,
        },
        createRuleDeletionProposal: {
            functionName: 'createRuleDeletionProposal',
            fullContractABI: mainContractStringfiedABI,
        },
        addReview: {
            functionName: 'addReview',
            fullContractABI: mainContractStringfiedABI,
        },
        getTokens: {
            functionName: 'getTokens',
            fullContractABI: mainContractStringfiedABI,
        },
        moderatorPromotionCost: {
            functionName: 'moderatorPromotionCost',
            fullContractABI: mainContractStringfiedABI,
        },
        promoteToModerator: {
            functionName: 'promoteToModerator',
            fullContractABI: mainContractStringfiedABI,
        },
        censorReview: {
            functionName: 'censorReview',
            fullContractABI: mainContractStringfiedABI,
        },
        getReviewAddress: {
            functionName: 'getReviewAddress',
            fullContractABI: mainContractStringfiedABI,
        },
        challengeReviewCensorship: {
            functionName: 'challengeReviewCensorship',
            fullContractABI: mainContractStringfiedABI,
        },
        executeReviewUncensorship: {
            functionName: 'executeReviewUncensorship',
            fullContractABI: mainContractStringfiedABI,
        },
    },
};

export { decentravellerMainContract };
