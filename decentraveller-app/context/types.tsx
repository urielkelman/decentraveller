export interface ConnectionContext {
    connectedAddress: string | null;
    connectedChainId: number | null;
}

export interface DeviceDimensions {
    width: number;
    height: number;
}

export type AppContextType = {
    connectionContext: ConnectionContext;
    deviceDimensions: DeviceDimensions;
    setConnectionContext: (newConnectionContext: ConnectionContext) => void;
    cleanConnectionContext: () => void;
};
