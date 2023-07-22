export enum Blockchain {
    LOCALHOST = 'LOCALHOST',
    GOERLI = 'GOERLI',
}

export const BlockchainByChainId: { [key in number]: Blockchain } = {
    31337: Blockchain.LOCALHOST,
    5: Blockchain.GOERLI,
};

    export const LOCAL_DEVELOPMENT_CHAIN_ID = 31337;
