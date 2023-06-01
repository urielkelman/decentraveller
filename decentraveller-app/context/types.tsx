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

export interface UserCreatedAt {
    createdAt: string;
    setUserCreatedAt: (string) => void;
}
export interface UserInterest {
    interest: string;
    setUserInterest: (string) => void;
}

export interface UserLocation {
    location: [string, string];
    setLocation: ([latitude, longitude]) => void;
}

export interface AppContextStateArg<T> {
    value: T;
    setValue: (newValue: T) => void;
}

export type AppContextType = {
    connectionContext: ConnectionContext | null;
    setConnectionContext: (newConnectionContext: ConnectionContext) => void;
    cleanConnectionContext: () => void;
    pushChangeUpdate: () => void;
    deviceDimensions: DeviceDimensions;
    userNickname: AppContextStateArg<string>;
    userWalletAddress: AppContextStateArg<string>;
    userCreatedAt: AppContextStateArg<string>;
    userInterest: AppContextStateArg<string>;
    userLocation: AppContextStateArg<[string, string]>;
};

export type DecentravellerPlaceCategory = 'GASTRONOMY' | 'ENTERTAINMENT' | 'ACCOMMODATION' | 'OTHER';
