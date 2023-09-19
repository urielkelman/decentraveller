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
        state: {
            functionName: 'state',
            fullContractABI: governanceStringifiedABI,
        },
    },
};

export { decentravellerGovernanceContract };
