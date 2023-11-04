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
    TO_QUEUE = 'To enqueue',
    TO_EXECUTE = 'To execute',
}

export enum BlockchainProposalStatusNames {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    QUEUED = 'QUEUED',
    EXECUTED = 'EXECUTED',
    SUCCEEDED = 'SUCCEEDED',
}

export type BlockchainProposalResult = {
    ForVotes: number;
    AgainstVotes: number;
};

export enum BlockchainReviewStatus {
    PUBLIC = 'PUBLIC',
    ON_DISPUTE = 'ON_DISPUTE',
    CENSORED = 'CENSORED',
    CHALLENGER_WON = 'CHALLENGER_WON',
    MODERATOR_WON = 'MODERATOR_WON',
    UNCENSORED_BY_DISPUTE = 'UNCENSORED_BY_DISPUTE',
}

export enum BackendReviewStatus {
    PUBLIC = 'PUBLIC',
    ON_DISPUTE = 'IN_DISPUTE',
    CENSORED = 'CENSORED',
    UNCENSORED = 'UNCENSORED',
}
