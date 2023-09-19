import { BlockchainAdapter, blockchainAdapter } from './../blockhainAdapter';
import { apiAdapter, ApiAdapter } from '../../api/apiAdapter';
import { RuleResponse, RulesResponse, RuleStatus } from '../../api/response/rules';
import { ethers } from 'ethers';
import { BlockchainProposalStatus } from '../types';

class RulesService {
    private blockchainAdapter: BlockchainAdapter;
    private apiAdapter: ApiAdapter;
    constructor(blockchainAdapter: BlockchainAdapter, apiAdapter: ApiAdapter) {
        this.blockchainAdapter = blockchainAdapter;
        this.apiAdapter = apiAdapter;
    }

    async getAllPendingToVote(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const allPendingApproval = await this.apiAdapter.getRules(RuleStatus.PENDING_APPROVAL);
        let allPendingVote: RuleResponse[] = [];
        for (let rule of allPendingApproval.rules) {
            const proposalStatus = await blockchainAdapter.getProposalState(web3Provider, rule.proposalId);
            if (proposalStatus === BlockchainProposalStatus.PENDING) {
                allPendingVote.push(rule);
            }
        }
        return allPendingVote;
    }
}

const rulesService = new RulesService(blockchainAdapter, apiAdapter);

export { rulesService, RulesService };
