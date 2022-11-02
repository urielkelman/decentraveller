export enum Blockchain {
    LOCALHOST = 'LOCALHOST',
    GOERLI = 'GOERLI',
}

export const BlockchainByConnectorChainId: { [key in number]: Blockchain } = {
    5: Blockchain.GOERLI,
};
