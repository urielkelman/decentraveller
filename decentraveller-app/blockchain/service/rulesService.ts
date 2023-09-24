import { BlockchainAdapter, blockchainAdapter } from './../mockBlockchainAdapter';
import { apiAdapter } from '../../api/apiAdapter';
import { RuleResponse, RuleStatus } from '../../api/response/rules';
import { ethers } from 'ethers';
import { BlockchainProposalStatus } from '../types';
import { decentravellerMainContract } from '../contracts/decentravellerMainContract';
import { BlockchainByChainId } from '../config';
import { DEFAULT_CHAIN_ID } from '../../context/AppContext';
import { DecentravellerContract } from '../contractTypes';
import {mockApiAdapter, ApiAdapter} from "../../api/mockApiAdapter";

class RulesService {
    private blockchainAdapter: BlockchainAdapter;
    private apiAdapter: ApiAdapter;
    constructor(blockchainAdapter: BlockchainAdapter, apiAdapter: ApiAdapter) {
        this.blockchainAdapter = blockchainAdapter;
        this.apiAdapter = apiAdapter;
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
        return this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.QUEUED,
        );
    }

    async getAllNewToExecute(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rulesWithQueuedProposal = await this.getAllWithRuleStatusAndBlockchainProposalStatus(
            web3Provider,
            RuleStatus.PENDING_APPROVAL,
            BlockchainProposalStatus.QUEUED,
        );

        // const now = new Date("2023-09-25T11:23:54");
        const now = new Date();
        return rulesWithQueuedProposal.filter((queuedRule) => now > new Date(queuedRule.executionTimeAt));
    }

    async getFormerRules(): Promise<RuleResponse[]> {
        return (await this.apiAdapter.getRules(RuleStatus.APPROVED)).rules;
    }

    async hasVotedInProposal(
        web3Provider: ethers.providers.Web3Provider,
        proposalId: string,
        address: string,
    ): Promise<boolean> {
        return this.blockchainAdapter.hasVotedInProposal(web3Provider, proposalId, address);
    }

    async proposeNewRule(web3Provider: ethers.providers.Web3Provider, ruleStatement: string): Promise<string> {
        return this.blockchainAdapter.proposeNewRule(web3Provider, ruleStatement);
    }

    async voteAgainstProposal(web3Provider: ethers.providers.Web3Provider, proposalId: string): Promise<string> {
        return this.blockchainAdapter.voteInProposal(web3Provider, proposalId, 0);
    }

    async voteInFavorOfProposal(web3Provider: ethers.providers.Web3Provider, proposalId: string): Promise<string> {
        return this.blockchainAdapter.voteInProposal(web3Provider, proposalId, 1);
    }

    async queueNewRule(web3Provider: ethers.providers.Web3Provider, rule: RuleResponse): Promise<string> {
        return this.callRuleProposalAction(
            web3Provider,
            rule,
            async (contract) => (await contract.populateTransaction.approveProposedRule(rule.ruleId)).data!,
            (web3Provider, address, calldata, hash) =>
                this.blockchainAdapter.queueProposal(web3Provider, address, calldata, hash),
        );
    }

    async executeNewRule(web3Provider: ethers.providers.Web3Provider, rule: RuleResponse): Promise<string> {
        return this.callRuleProposalAction(
            web3Provider,
            rule,
            async (contract) => (await contract.populateTransaction.approveProposedRule(rule.ruleId)).data!,
            (web3Provider, address, calldata, hash) =>
                this.blockchainAdapter.executeProposal(web3Provider, address, calldata, hash),
        );
    }

    async proposeRuleDeletion(web3Provider: ethers.providers.Web3Provider, ruleId: number): Promise<string> {
        return this.blockchainAdapter.proposeRuleDeletion(web3Provider, ruleId);
    }

    async queueRuleDeletion(web3Provider: ethers.providers.Web3Provider, rule: RuleResponse): Promise<string> {
        return this.callRuleProposalAction(
            web3Provider,
            rule,
            async (contract) => (await contract.populateTransaction.deleteRule(rule.ruleId)).data!,
            (web3Provider, address, calldata, hash) =>
                this.blockchainAdapter.queueProposal(web3Provider, address, calldata, hash),
        );
    }

    async executeRuleDeletion(web3Provider: ethers.providers.Web3Provider, rule: RuleResponse): Promise<string> {
        return this.callRuleProposalAction(
            web3Provider,
            rule,
            async (contract) => (await contract.populateTransaction.deleteRule(rule.ruleId)).data!,
            (web3Provider, address, calldata, hash) =>
                this.blockchainAdapter.executeProposal(web3Provider, address, calldata, hash),
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
                    const proposalStatus = await this.blockchainAdapter.getProposalState(web3Provider, rule.proposalId);
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
        rule: RuleResponse,
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
}

const rulesService = new RulesService(blockchainAdapter, mockApiAdapter);

export { rulesService, RulesService };
