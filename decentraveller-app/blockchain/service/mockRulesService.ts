import { RuleResponse, RuleStatus } from '../../api/response/rules';
import { ethers } from 'ethers';
import { BlockchainProposalStatus } from '../types';
import { VotingResultsResponse } from '../../screens/home/community/VotingResultsScreen';

class RulesService {
    async getAllPendingToVote(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a PENDING ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_APPROVAL,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllInVotingProcess(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `ACTIVE ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_APPROVAL,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllNewDefeated(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a DEFEATED ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_APPROVAL,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllNewToQueue(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a SUCCEDED ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_APPROVAL,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllQueued(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a QUEUED ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_APPROVAL,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllNewToExecute(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a QUEUED ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_APPROVAL,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getFormerRules(): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a EXECUTED ${i}: Rule.`,
                ruleStatus: RuleStatus.APPROVED,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllPendingDeleteToVote(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a PENDING ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_DELETED,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllDeleteInVotingProcess(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a ACTIVE ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_DELETED,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllDeleteDefeated(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a DEFEATED ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_DELETED,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllDeleteToQueue(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a SUCCEDED ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_DELETED,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllDeleteQueued(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a QUEUED ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_DELETED,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async getAllDeleteToExecute(web3Provider: ethers.providers.Web3Provider): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is a QUEUED ${i}: Rule.`,
                ruleStatus: RuleStatus.PENDING_DELETED,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }

    async hasVotedInProposal(
        web3Provider: ethers.providers.Web3Provider,
        proposalId: string,
        address: string,
    ): Promise<boolean> {
        return true;
    }

    async proposeNewRule(web3Provider: ethers.providers.Web3Provider, ruleStatement: string): Promise<string> {
        return '';
    }

    async voteAgainstProposal(web3Provider: ethers.providers.Web3Provider, proposalId: string): Promise<string> {
        return '';
    }

    async voteInFavorOfProposal(web3Provider: ethers.providers.Web3Provider, proposalId: string): Promise<string> {
        return '';
    }

    async queueNewRule(web3Provider: ethers.providers.Web3Provider, rule: RuleResponse): Promise<string> {
        return '';
    }

    async executeNewRule(web3Provider: ethers.providers.Web3Provider, rule: RuleResponse): Promise<string> {
        return '';
    }

    async proposeRuleDeletion(web3Provider: ethers.providers.Web3Provider, ruleId: number): Promise<string> {
        return '';
    }

    async queueRuleDeletion(web3Provider: ethers.providers.Web3Provider, rule: RuleResponse): Promise<string> {
        return '';
    }

    async executeRuleDeletion(web3Provider: ethers.providers.Web3Provider, rule: RuleResponse): Promise<string> {
        return '';
    }

    async getResults(web3Provider: ethers.providers.Web3Provider, proposalId: string): Promise<VotingResultsResponse> {
        return {
            favor: 20,
            against: 10,
        };
    }

    async getVotingPower(web3Provider: ethers.providers.Web3Provider, wallet: string): Promise<number> {
        return 241;
    }

    private async getRulesWithStatus(ruleStatus: RuleStatus): Promise<RuleResponse[]> {
        const rules: RuleResponse[] = [];

        for (let i = 1; i <= 10; i++) {
            const statusIndex = Math.floor(Math.random() * 2);

            rules.push({
                ruleId: i,
                proposalId: 'proposalId',
                deletionExecutionTimeAt: '',
                executionTimeAt: '',
                proposer: '',
                ruleStatement: `this is an invented ${i}: Rule.`,
                ruleStatus: ruleStatus,
                isInitial: false,
                proposedAt: '2023-09-23',
                deletionProposer: '',
            });
        }

        return rules;
    }
}

const mockRulesService = new RulesService();

export { mockRulesService };
