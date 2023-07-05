export interface DeviceDimensions {
    width: number;
    height: number;
}

export interface AppContextStateArg<T> {
    value: T;
    setValue: (newValue: T) => void;
}

export type AppContextType = {
    deviceDimensions: DeviceDimensions;
    userNickname: AppContextStateArg<string>;
    userCreatedAt: AppContextStateArg<string>;
    userInterest: AppContextStateArg<string>;
    userLocation: AppContextStateArg<[string, string]>;
};

export type DecentravellerPlaceCategory = 'GASTRONOMY' | 'ENTERTAINMENT' | 'ACCOMMODATION' | 'OTHER';
