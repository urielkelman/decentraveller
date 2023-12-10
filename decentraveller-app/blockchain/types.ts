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

export type BlockchainCensorshipVotes = {
    ForCensorship: number;
    AgainstCensorship: number;
};

export enum BlockchainReviewStatus {
    PUBLIC = 0,
    CENSORED = 1,
    CENSORSHIP_CHALLENGED = 2,
    CHALLENGER_WON = 3,
    MODERATOR_WON = 4,
    UNCENSORED_BY_DISPUTE = 5,
}

export enum BackendReviewStatus {
    PUBLIC = 'PUBLIC',
    CENSORSHIP_CHALLENGED = 'CENSORSHIP_CHALLENGED',
    CENSORED = 'CENSORED',
    UNCENSORED_BY_CHALLENGE = 'UNCENSORED_BY_CHALLENGE',
}
