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

export interface UserProfileImage {
    profileImage: string;
    setUserProfileImage: (ArrayBuffer) => void;
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

export type AppContextType = {
    connectionContext: ConnectionContext | null;
    setConnectionContext: (newConnectionContext: ConnectionContext) => void;
    cleanConnectionContext: () => void;
    pushChangeUpdate: () => void;
    deviceDimensions: DeviceDimensions;
    userNickname: UserNickname;
    userProfileImage: UserProfileImage;
    userWalletAddress: UserWalletAddress;
    userCreatedAt: UserCreatedAt;
    userInterest: UserInterest;
};

export type DecentravellerPlaceCategory = 'GASTRONOMY' | 'ENTERTAINMENT' | 'ACCOMMODATION' | 'OTHER';
