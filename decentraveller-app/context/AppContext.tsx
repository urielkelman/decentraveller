import React from 'react';
import { AppContextType, ConnectionContext, DeviceDimensions } from './types';
import { Dimensions } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = React.createContext<AppContextType | null>(null);

const DEFAULT_CHAIN_ID = 5;
const DEFAULT_RPC = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

interface UpdateSessionPayloadParams {
    accounts: string[];
    chainId: number;
}

const AppContextProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [connectionContext, setConnectionContext] = React.useState<ConnectionContext>(null);
    const [subscriptionsDone, setSubscriptionsDone] = React.useState<boolean>(false);

    const connector = useWalletConnect();

    const pushChangeUpdate = async () => {
        try {
            const r = await connector.sendCustomRequest({
                id: 1,
                jsonrpc: '2.0',
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x5' }],
            });
            console.log('custom request response', r);
        } catch (e) {
            console.log('Error updating', e);
        }
    };

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

    const updateConnectionContext = (address, chainId) => {
        const isWrongChain = chainId !== DEFAULT_CHAIN_ID;
        setConnectionContext({
            connectedAddress: address,
            connectedChainId: chainId,
            isWrongChain: isWrongChain,
        });
    };

    React.useEffect(() => {
        console.log('connected:', connector.connected);
        if (connector.connected) {
            updateConnectionContext(connector.accounts[0], connector.chainId);

            if (!subscriptionsDone) {
                setSubscriptionsDone(true);

                connector.on('disconnect', async (error, payload) => {
                    setSubscriptionsDone(false);
                    setConnectionContext(null);
                });

                connector.on('session_update', async (error, payload) => {
                    console.log('Full payload', payload);
                    const params: UpdateSessionPayloadParams = payload.params[0];
                    console.log(params);
                    console.log('sesion_update');
                    updateConnectionContext(params.accounts[0], params.chainId);
                });
            }
        }
    }, [connector.connected]);

    const cleanConnectionContext = () => setConnectionContext(null);

    return (
        <AppContext.Provider
            value={{
                connectionContext,
                deviceDimensions,
                setConnectionContext,
                pushChangeUpdate,
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
