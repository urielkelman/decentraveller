import { BlockchainAdapter, blockchainAdapter } from './../blockhainAdapter';
import { apiAdapter, ApiAdapter } from '../../api/apiAdapter';
import { RuleResponse, RuleStatus } from '../../api/response/rules';
import { ethers } from 'ethers';
import { BlockchainProposalStatus } from '../types';

class RulesService {
    private blockchainAdapter: BlockchainAdapter;
    private apiAdapter: ApiAdapter;
    constructor(blockchainAdapter: BlockchainAdapter, apiAdapter: ApiAdapter) {
        this.blockchainAdapter = blockchainAdapter;
        this.apiAdapter = apiAdapter;
    }

    private async getRulesWithStatus(ruleStatus: RuleStatus): Promise<RuleResponse[]> {
        const allRulesWithStatus = await this.apiAdapter.getRules(ruleStatus);
        return allRulesWithStatus.rules;
    }

    private async getAllWithRuleStatusAndBlockchainProposalStatus(
        web3Provider: ethers.providers.Web3Provider,
        ruleStatus: RuleStatus,
        blockchainProposalStatus: BlockchainProposalStatus,
    ): Promise<RuleResponse[]> {
        const allRulesWithStatus = await this.getRulesWithStatus(ruleStatus);

        const allRulesWithProposals = await Promise.all(
            allRulesWithStatus.map(async (rule) => {
                const proposalStatus = await blockchainAdapter.getProposalState(web3Provider, rule.proposalId);
                return { proposalStatus, rule };
            }),
        );

        return allRulesWithProposals
            .filter((ruleWithProposal) => ruleWithProposal.proposalStatus === blockchainProposalStatus)
            .map((ruleWithProposal) => ruleWithProposal.rule);
    }

    async getAllPendingToVote(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.PENDING,
        );
    }

    async getAllInVotingProcess(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.ACTIVE,
        );
    }

    async getAllNewDefeated(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.DEFEATED,
        );
    }

    async getAllNewToQueue(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.SUCCEEDED,
        );
    }

    async getAllNewToExecute(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.QUEUED,
        );
    }

    async getCurrentCommunityRules(): Promise<RuleResponse[]> {
        return this.getRulesWithStatus(RuleStatus.APPROVED);
    }

    getAll;
}

const rulesService = new RulesService(blockchainAdapter, apiAdapter);

export { rulesService, RulesService };
