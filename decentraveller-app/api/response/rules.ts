export enum RuleStatus {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    PENDING_DELETED = 'PENDING_DELETED',
    DELETED = 'DELETED',
}

export type RuleResponse = {
    ruleId: number;
    proposalId: string;
    proposer: string;
    ruleStatement: string;
    ruleStatus: RuleStatus;
    isInitial: boolean;
    proposedAt: string;
    deletionProposalId?: string | undefined;
    deletionProposedAt?: string | undefined;
    deletionProposer: string;
};

export type RulesResponse = {
    rules: RuleResponse[];
};
