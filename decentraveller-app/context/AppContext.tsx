import React from 'react';
import { AppContextType, ConnectionContext, DeviceDimensions } from './types';
import { Dimensions } from 'react-native';

export const AppContext = React.createContext<AppContextType | null>(null);

const AppContextProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [connectionContext, setConnectionContext] = React.useState<ConnectionContext>({
        connectedAddress: null,
        connectedChainId: null,
    });

    const cleanConnectionContext = () =>
        setConnectionContext({
            connectedAddress: null,
            connectedChainId: null,
        });

    const deviceDimensions: DeviceDimensions = React.useMemo<DeviceDimensions>(
        () => ({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        }),
        []
    );

    return (
        <AppContext.Provider
            value={{
                connectionContext,
                deviceDimensions,
                setConnectionContext,
                cleanConnectionContext,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useConnectionContext = (): AppContextType => {
    return (React.useContext(AppContext) as AppContextType);
};

export const useDeviceDimensions = (): DeviceDimensions => {
    return (React.useContext(AppContext) as AppContextType).deviceDimensions;
};

export default AppContextProvider;
