import React from 'react';
import { AppContextStateArg, AppContextType, ConnectionContext, DeviceDimensions } from './types';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

export const AppContext = React.createContext<AppContextType | null>(null);

const DEFAULT_CHAIN_ID = 31337;
const UNRECOGNIZED_CHAIN_ID_MESSAGE = (chainId) =>
    `Unrecognized chain ID "${chainId}". Try adding the chain using wallet_addEthereumChain first.`;

interface UpdateSessionPayloadParams {
    accounts: string[];
    chainId: number;
}

const AppContextProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [connectionContext, setConnectionContext] = React.useState<ConnectionContext>(null);
    const [subscriptionsDone, setSubscriptionsDone] = React.useState<boolean>(false);

    const [nickname, setUserNickname] = React.useState<string>('');
    const [createdAt, setUserCreatedAt] = React.useState<string>('');
    const [interest, setUserInterest] = React.useState<string>('');
    const [location, setLocation] = React.useState<[string, string] | undefined>(undefined);

    const { provider, isConnected, address } = useWalletConnectModal();

    const pushChangeUpdate = async () => {
        /* try {
            await provider.sendCustomRequest({
                id: 1,
                jsonrpc: '2.0',
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x7a69' }],
            });
        } catch (e) {
            if (e.message === UNRECOGNIZED_CHAIN_ID_MESSAGE('0x7a69')) {
                try {
                    await connector.sendCustomRequest({
                        id: 2,
                        jsonrpc: '2.0',
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x7a69',
                                chainName: 'Local Hardhat',
                                nativeCurrency: {
                                    nameText: 'Ethereum',
                                    symbol: 'ETH',
                                    decimals: 18,
                                },
                                rpcUrls: ['http://10.0.2.2:8545/'],
                            },
                        ],
                    });
                } catch (e) {
                    console.log('An error happened when trying to add ethereum chain.', e);
                }
            }
        }*/
    };

    const deviceDimensions: DeviceDimensions = React.useMemo<DeviceDimensions>(
        () => ({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        }),
        []
    );

    const memoFactory = <T extends unknown>(arg: T, setArg: (T) => void): AppContextStateArg<T> => {
        return React.useMemo(
            () => ({
                value: arg,
                setValue: setArg,
            }),
            [arg]
        );
    };

    const userNickname: AppContextStateArg<string> = memoFactory(nickname, setUserNickname);

    const userCreatedAt: AppContextStateArg<string> = memoFactory(createdAt, setUserCreatedAt);

    const userInterest: AppContextStateArg<string> = memoFactory(interest, setUserInterest);

    const userLocation: AppContextStateArg<[string, string]> = memoFactory(location, setLocation);

    React.useEffect(() => {
        /* This effect allow us to clean sessions that the WalletConnect connector stores in the AsyncStorage */
        const wipeAsyncStorage = async () => {
            await AsyncStorage.clear();
            setConnectionContext(null);
        };

        wipeAsyncStorage().catch((e) => console.log('There was a problem wiping async storage', e));
    }, []);

    const updateConnectionContext = (address, chainId) => {
        const isWrongChain = chainId !== DEFAULT_CHAIN_ID;
        console.log('isWrongChain', isWrongChain);
        setConnectionContext({
            connectedAddress: address,
            connectedChainId: chainId,
            isWrongChain: isWrongChain,
        });
    };

    React.useEffect(() => {
        console.log('connected:', isConnected);
        // console.log('session:', provider?.session);
        // console.log('full provider', provider)
        console.log('con context', connectionContext);

        if (isConnected) {
            updateConnectionContext(address, 5);

            if (!subscriptionsDone) {
                setSubscriptionsDone(true);

                provider.client.on('session_event', (event) => {
                    console.log('session event received: ', event);
                    console.log('c1', connectionContext);
                    console.log('c2', event.params.event.name);
                    console.log('c3', event.params.event.data);

                    console.log(
                        'condition',
                        connectionContext &&
                            event.params.event.name === 'chainChanged' &&
                            connectionContext.connectedChainId !== event.params.event.data
                    );
                    if (
                        connectionContext &&
                        event.params.event.name === 'chainChanged' &&
                        connectionContext.connectedChainId !== event.params.event.data
                    ) {
                        console.log('updating con context');
                        updateConnectionContext(address, event.params.event.data);
                    }
                });

                provider.client.on('session_delete', async (event) => {
                    console.log('session delete received: ', event);
                    setSubscriptionsDone(false);
                    setConnectionContext(null);
                });

                provider.client.on('session_update', async (args) => {
                    console.log('session update received: ', args);
                    const params = args.params.namespaces[0];
                    /*if (connectionContext && params.chainId !== connectionContext.connectedChainId) {
                        updateConnectionContext(params.accounts[0], params.chainId);
                    }*/
                });
            }
        }
    }, [isConnected]);

    const cleanConnectionContext = () => setConnectionContext(null);

    return (
        <AppContext.Provider
            value={{
                connectionContext,
                deviceDimensions,
                setConnectionContext,
                pushChangeUpdate,
                cleanConnectionContext,
                userNickname,
                userCreatedAt,
                userInterest,
                userLocation,
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
