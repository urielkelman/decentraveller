export interface ConnectionContext {
    connectedAddress: string;
    connectedChainId: number;
    isWrongChain: boolean;
}

export interface DeviceDimensions {
    width: number;
    height: number;
}

export type AppContextType = {
    connectionContext: ConnectionContext | null;
    setConnectionContext: (newConnectionContext: ConnectionContext) => void;
    cleanConnectionContext: () => void;
    pushChangeUpdate: () => void;
    deviceDimensions: DeviceDimensions;
};

export type DecentravellerPlaceCategory = 'GASTRONOMY' | 'ENTERTAINMENT' | 'ACCOMMODATION' | 'OTHER';
