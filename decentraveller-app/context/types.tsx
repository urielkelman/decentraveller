export interface ConnectionContext {
    connectedAddress: string | null;
    connectedChainId: string | null;
}

export type AppContextType = {
    connectionContext: ConnectionContext;
    setConnectionContext: (connectionAddress, chainId) => void;
};
