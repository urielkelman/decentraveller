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
export const blockchainStatusOptions = ['PENDING', 'ACTIVE', 'DEFEATED', 'SUCCEEDED', 'QUEUED'];
