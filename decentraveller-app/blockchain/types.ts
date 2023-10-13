export enum BlockchainProposalStatus {
    PENDING = 0,
    ACTIVE = 1,
    CANCELED = 2,
    DEFEATED = 3,
    SUCCEEDED = 4,
    QUEUED = 5,
    EXPIRED = 6,
    EXECUTED = 7,
}

export enum BlockchainUserStatus {
    PENDING = 'Vote pending opening',
    ACTIVE = 'Active voting',
    QUEUED = 'Queued',
    TO_EXECUTE = 'To execute',
}

export enum BlockchainProposalStatusNames {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    QUEUED = "QUEUED",
    TO_EXECUTE = "TO_EXECUTE",
    EXECUTED = "EXECUTED",
}

export type BlockchainProposalResult = {
    ForVotes: number;
    AgainstVotes: number;
}
