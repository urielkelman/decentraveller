import { ethers } from 'ethers';

export interface ConnectionContext {
    connectedAddress: string;
    connectedChainId: number;
    isWrongChain: boolean;
}

export interface DeviceDimensions {
    width: number;
    height: number;
}

export interface AppContextStateArg<T> {
    value: T;
    setValue: (newValue: T) => void;
}

export type AppContextType = {
    connectionContext: ConnectionContext | null;
    web3Provider: ethers.providers.Web3Provider | null;
    setConnectionContext: (newConnectionContext: ConnectionContext) => void;
    cleanConnectionContext: () => void;
    pushChangeUpdate: () => void;
    deviceDimensions: DeviceDimensions;
    userNickname: AppContextStateArg<string>;
    userCreatedAt: AppContextStateArg<string>;
    userInterest: AppContextStateArg<string>;
    userLocation: AppContextStateArg<[string, string]>;
    userProfileImage: AppContextStateArg<string>;
};

export type DecentravellerPlaceCategory = 'GASTRONOMY' | 'ENTERTAINMENT' | 'ACCOMMODATION' | 'OTHER';
