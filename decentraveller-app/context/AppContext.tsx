import React from 'react';
import { AppContextType, ConnectionContext, DeviceDimensions } from './types';
import { Dimensions } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = React.createContext<AppContextType | null>(null);

const AppContextProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [connectionContext, setConnectionContext] = React.useState<ConnectionContext>(null);
    const [subscriptionsDone, setSubscriptionsDone] = React.useState<boolean>(false);

    const connector = useWalletConnect();

    const deviceDimensions: DeviceDimensions = React.useMemo<DeviceDimensions>(
        () => ({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        }),
        []
    );

    React.useEffect(() => {
        /* This effect allow us to clean sessions that the WalletConnect connector stores in the AsyncStorage */
        const wipeAsyncStorage = async () => {
            await AsyncStorage.clear();
        };

        wipeAsyncStorage().catch((e) => console.log('There was a problem wiping async storage', e));
    }, []);

    React.useEffect(() => {
        if (connector.connected) {
            setConnectionContext({
                connectedAddress: connector.accounts[0],
                connectedChainId: connector.chainId,
            });

            if (!subscriptionsDone) {
                setSubscriptionsDone(true);

                connector.on('disconnect', async (error, payload) => {
                    console.log('disconnected from wallet');
                    console.log('params', payload);
                });

                connector.on('session_update', async (error, payload) => {
                    console.log(`connector.on("session_update")`);
                    console.log(payload.params[0]);
                });
            }
        }
    }, [connector]);

    const cleanConnectionContext = () => setConnectionContext(null);

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

export const useAppContext = (): AppContextType => {
    return React.useContext(AppContext) as AppContextType;
};

export const useDeviceDimensions = (): DeviceDimensions => {
    return (React.useContext(AppContext) as AppContextType).deviceDimensions;
};

export default AppContextProvider;
