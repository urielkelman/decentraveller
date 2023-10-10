import decentravellerGovernanceABI from '../abis/governanceABI.json';
import { DecentravellerContract } from '../contractTypes';

const governanceStringifiedABI = JSON.stringify(decentravellerGovernanceABI);

const decentravellerGovernanceContract: DecentravellerContract = {
    addressesByBlockchain: {
        LOCALHOST: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        GOERLI: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    },
    fullContractABI: governanceStringifiedABI,
    functions: {
        castVote: {
            functionName: 'castVote',
            fullContractABI: governanceStringifiedABI,
        },
        state: {
            functionName: 'state',
            fullContractABI: governanceStringifiedABI,
        },
        queue: {
            functionName: 'queue',
            fullContractABI: governanceStringifiedABI,
        },
        execute: {
            functionName: 'execute',
            fullContractABI: governanceStringifiedABI,
        },
        proposalThreshold: {
            functionName: 'proposalThreshold',
            fullContractABI: governanceStringifiedABI,
        },
        getVotes: {
            functionName: 'getVotes',
            fullContractABI: governanceStringifiedABI,
        },
        proposalVotes: {
            functionName: 'proposalVotes',
            fullContractABI: governanceStringifiedABI
        },
        quorum: {
            functionName: 'quorum',
            fullContractABI: governanceStringifiedABI
        }
    },
};

export { decentravellerGovernanceContract };
