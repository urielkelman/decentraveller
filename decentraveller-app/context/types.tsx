export interface ConnectionContext {
    connectedAddress: string;
    connectedChainId: number;
}

export interface DeviceDimensions {
    width: number;
    height: number;
}

export type AppContextType = {
    connectionContext: ConnectionContext | null;
    setConnectionContext: (newConnectionContext: ConnectionContext) => void;
    cleanConnectionContext: () => void;
    deviceDimensions: DeviceDimensions;
};
