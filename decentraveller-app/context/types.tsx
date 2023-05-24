export interface ConnectionContext {
    connectedAddress: string;
    connectedChainId: number;
    isWrongChain: boolean;
}

export interface DeviceDimensions {
    width: number;
    height: number;
}

export interface UserNickname {
    nickname: string;
    setUserNickname: (string) => void;
}

export interface UserWalletAddress {
    walletAddress: string;
    setUserWalletAddress: (string) => void;
}

export type AppContextType = {
    connectionContext: ConnectionContext | null;
    setConnectionContext: (newConnectionContext: ConnectionContext) => void;
    cleanConnectionContext: () => void;
    pushChangeUpdate: () => void;
    deviceDimensions: DeviceDimensions;
    userNickname: UserNickname;
    userWalletAddress: UserWalletAddress;
};
