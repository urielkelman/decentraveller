import { BlockchainAdapter, blockchainAdapter } from './../blockhainAdapter';
import { apiAdapter, ApiAdapter } from '../../api/apiAdapter';
import { RuleResponse, RuleStatus } from '../../api/response/rules';
import { ethers } from 'ethers';
import { BlockchainProposalResult, BlockchainProposalStatus } from '../types';
import { decentravellerMainContract } from '../contracts/decentravellerMainContract';
import { BlockchainByChainId } from '../config';
import { DEFAULT_CHAIN_ID } from '../../context/AppContext';
import { Rule } from '../../screens/home/community/types';

class RulesService {
    private blockchainAdapter: BlockchainAdapter;
    private apiAdapter: ApiAdapter;
    constructor() {
        this.blockchainAdapter = blockchainAdapter;
        this.apiAdapter = apiAdapter;
    }

    async getRule(web3Provider: ethers.providers.Web3Provider, ruleId: number): Promise<RuleResponse> {
        return await apiAdapter.getRule(ruleId)
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

    async getAllQueued(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rulesWithQueuedProposal = await this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.QUEUED,
        );

        const now = await blockchainAdapter.blockchainDate(web3Provider)
        return rulesWithQueuedProposal.filter((queuedRule) => now < new Date(queuedRule.executionTimeAt));
    }

    async getAllNewToExecute(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rulesWithQueuedProposal = await this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.QUEUED,
        );

        const now = await blockchainAdapter.blockchainDate(web3Provider)
        return rulesWithQueuedProposal.filter((queuedRule) => now >= new Date(queuedRule.executionTimeAt));
    }

    async getAllPendingDeleteToVote(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_DELETED,
            BlockchainProposalStatus.PENDING,
        );
    }

    async getAllDeleteInVotingProcess(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_DELETED,
            BlockchainProposalStatus.ACTIVE,
        );
    }

    async getAllDeleteDefeated(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_DELETED,
            BlockchainProposalStatus.DEFEATED,
        );
    }

    async getAllDeleteToQueue(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_DELETED,
            BlockchainProposalStatus.SUCCEEDED,
        );
    }

    async getAllDeleteQueued(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rulesWithQueuedProposal = await this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_DELETED,
            BlockchainProposalStatus.QUEUED,
        );

        const now = await blockchainAdapter.blockchainDate(web3Provider)
        return rulesWithQueuedProposal.filter((queuedRule) => now < new Date(queuedRule.deletionExecutionTimeAt));
    }

    async getAllDeleteToExecute(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rulesWithQueuedProposal = await this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_DELETED,
            BlockchainProposalStatus.QUEUED,
        );

        const now = await blockchainAdapter.blockchainDate(web3Provider)
        return rulesWithQueuedProposal.filter((queuedRule) => now >= new Date(queuedRule.deletionExecutionTimeAt));
    }

    async getFormerRules(): Promise<RuleResponse[]> {
        return (await apiAdapter.getRules(RuleStatus.APPROVED)).rules.concat(
            (await apiAdapter.getRules(RuleStatus.PENDING_DELETED)).rules
        );
    }

    async getVotingPowerForProposal(web3Provider: ethers.providers.Web3Provider, address: string, proposedAt: string): Promise<number> {
        const proposalBlockTimePoint = Math.floor(new Date(proposedAt).getTime() / 1000)
        return blockchainAdapter.getVotesForTimePoint(web3Provider, address, proposalBlockTimePoint)
    }

    async getProposalResult(web3Provider: ethers.providers.Web3Provider, proposalId: string): Promise<BlockchainProposalResult> {
        return blockchainAdapter.getProposalResult(web3Provider, proposalId)
    }

    async getTimepointQuorum(web3Provider: ethers.providers.Web3Provider, proposedAt: string){
        const proposalBlockTimePoint = Math.floor(new Date(proposedAt).getTime() / 1000)
        return blockchainAdapter.getTimepointQuorum(web3Provider, proposalBlockTimePoint)
    }

    async hasVotedInProposal(
        web3Provider: ethers.providers.Web3Provider,
        proposalId: string,
        address: string,
    ): Promise<boolean> {
        return blockchainAdapter.hasVotedInProposal(web3Provider, proposalId, address);
    }

    async proposeNewRule(web3Provider: ethers.providers.Web3Provider, ruleStatement: string): Promise<string> {
        return blockchainAdapter.proposeNewRule(web3Provider, ruleStatement);
    }

    async voteAgainstProposal(web3Provider: ethers.providers.Web3Provider, proposalId: string): Promise<string> {
        return blockchainAdapter.voteInProposal(web3Provider, proposalId, 0);
    }

    async voteInFavorOfProposal(web3Provider: ethers.providers.Web3Provider, proposalId: string): Promise<string> {
        return blockchainAdapter.voteInProposal(web3Provider, proposalId, 1);
    }

    async queueNewRule(web3Provider: ethers.providers.Web3Provider, rule: Rule): Promise<string> {
        return this.callRuleProposalAction(
            web3Provider,
            rule,
            async (contract) => (await contract.populateTransaction.approveProposedRule(rule.ruleId)).data!,
            (web3Provider, address, calldata, hash) =>
                blockchainAdapter.queueProposal(web3Provider, address, calldata, hash),
        );
    }

    async executeNewRule(web3Provider: ethers.providers.Web3Provider, rule: Rule): Promise<string> {
        return this.callRuleProposalAction(
            web3Provider,
            rule,
            async (contract) => (await contract.populateTransaction.approveProposedRule(rule.ruleId)).data!,
            (web3Provider, address, calldata, hash) =>
                blockchainAdapter.executeProposal(web3Provider, address, calldata, hash),
        );
    }

    async proposeRuleDeletion(web3Provider: ethers.providers.Web3Provider, ruleId: number): Promise<string> {
        return blockchainAdapter.proposeRuleDeletion(web3Provider, ruleId);
    }

    async queueRuleDeletion(web3Provider: ethers.providers.Web3Provider, rule: Rule): Promise<string> {
        return this.callDeleteRuleProposalAction(
            web3Provider,
            rule,
            async (contract) => (await contract.populateTransaction.deleteRule(rule.ruleId)).data!,
            (web3Provider, address, calldata, hash) =>
                blockchainAdapter.queueProposal(web3Provider, address, calldata, hash),
        );
    }

    async executeRuleDeletion(web3Provider: ethers.providers.Web3Provider, rule: Rule): Promise<string> {
        return this.callDeleteRuleProposalAction(
            web3Provider,
            rule,
            async (contract) => (await contract.populateTransaction.deleteRule(rule.ruleId)).data!,
            (web3Provider, address, calldata, hash) =>
                blockchainAdapter.executeProposal(web3Provider, address, calldata, hash),
        );
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
        try {
            const allRulesWithProposals = await Promise.all(
                allRulesWithStatus.map(async (rule) => {
                    const proposalId = (ruleStatus == RuleStatus.PENDING_DELETED || ruleStatus == RuleStatus.DELETED) ?
                        rule.deletionProposalId : rule.proposalId
                    const proposalStatus = await blockchainAdapter.getProposalState(web3Provider, proposalId);
                    return { proposalStatus, rule };
                }),
            );

            return allRulesWithProposals
                .filter((ruleWithProposal) => ruleWithProposal.proposalStatus === blockchainProposalStatus)
                .map((ruleWithProposal) => ruleWithProposal.rule);
        } catch (e) {
            console.log(e);
        }
    }

    private async callRuleProposalAction(
        web3Provider: ethers.providers.Web3Provider,
        rule: Rule,
        generateCallData: (contract: ethers.Contract) => Promise<string>,
        ruleAction: (
            provider: ethers.providers.Web3Provider,
            contractAddress: string,
            calldata: string,
            proposalHash: string,
        ) => Promise<string>,
    ): Promise<string> {
        const decentravellerContractAddress =
            decentravellerMainContract.addressesByBlockchain[BlockchainByChainId[DEFAULT_CHAIN_ID]];
        const decentravellerContract: ethers.Contract = new ethers.Contract(
            decentravellerContractAddress,
            decentravellerMainContract.fullContractABI,
        );
        const txCalldata = await generateCallData(decentravellerContract);

        const proposalHash = ethers.utils.id(rule.ruleStatement);

        return ruleAction(web3Provider, decentravellerContractAddress, txCalldata, proposalHash);
    }

    private async callDeleteRuleProposalAction(
        web3Provider: ethers.providers.Web3Provider,
        rule: Rule,
        generateCallData: (contract: ethers.Contract) => Promise<string>,
        ruleAction: (
            provider: ethers.providers.Web3Provider,
            contractAddress: string,
            calldata: string,
            proposalHash: string,
        ) => Promise<string>,
    ): Promise<string> {
        const decentravellerContractAddress =
            decentravellerMainContract.addressesByBlockchain[BlockchainByChainId[DEFAULT_CHAIN_ID]];
        const decentravellerContract: ethers.Contract = new ethers.Contract(
            decentravellerContractAddress,
            decentravellerMainContract.fullContractABI,
        );
        const txCalldata = await generateCallData(decentravellerContract);

        const proposalHash = ethers.utils.id("Delete rule: " + rule.ruleStatement);

        return ruleAction(web3Provider, decentravellerContractAddress, txCalldata, proposalHash);
    }
}

const rulesService = new RulesService();

export { rulesService, RulesService };