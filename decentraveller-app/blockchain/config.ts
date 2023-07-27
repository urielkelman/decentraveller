export enum Blockchain {
    LOCALHOST = 'LOCALHOST',
    GOERLI = 'GOERLI',
}

<<<<<<< HEAD
export const BlockchainByConnectorChainId: { [key in number]: Blockchain } = {
    0: Blockchain.LOCALHOST,
=======
export const BlockchainByChainId: { [key in number]: Blockchain } = {
>>>>>>> main
    31337: Blockchain.LOCALHOST,
    5: Blockchain.GOERLI,
};

export const LOCAL_DEVELOPMENT_CHAIN_ID = 31337;
