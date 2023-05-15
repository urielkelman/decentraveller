import React from 'react';
import { AppContextType, ConnectionContext, DeviceDimensions } from './types';
import { Dimensions } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = React.createContext<AppContextType | null>(null);

const DEFAULT_CHAIN_ID = 31337;
const DEFAULT_RPC = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const UNRECOGNIZED_CHAIN_ID_MESSAGE = (chainId) =>
    `Unrecognized chain ID "${chainId}". Try adding the chain using wallet_addEthereumChain first.`;

interface UpdateSessionPayloadParams {
    accounts: string[];
    chainId: number;
}

const AppContextProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [connectionContext, setConnectionContext] = React.useState<ConnectionContext>(null);
    const [subscriptionsDone, setSubscriptionsDone] = React.useState<boolean>(false);
    const [wipedStorageDone, setWipedStorageDone] = React.useState<boolean>(false);

    const connector = useWalletConnect();

    const pushChangeUpdate = async () => {
        try {
            await connector.sendCustomRequest({
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
                                    name: 'Ethereum',
                                    symbol: 'ETH',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://10.0.2.2:8545/'],
                            },
                        ],
                    });
                } catch (e) {
                    console.log('An error happened when trying to add ethereum chain.', e);
                }
            }
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
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (error, stores) => {
                stores.map((result, i, store) => {
                    console.log({ [store[i][0]]: store[i][1] });
                    return true;
                });
            });
        });
        /* This effect allow us to clean sessions that the WalletConnect connector stores in the AsyncStorage */
        const wipeAsyncStorage = async () => {
            console.log('wiping async storage');
            await AsyncStorage.clear();
            console.log('wiped async storage');
            setWipedStorageDone(true);
            setConnectionContext(null);
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
        console.log('session:', connector.session);
        console.log(connector.chainId);

        if (connector.connected) {
            /*if(!wipedStorageDone) {
                console.log('Wait for async storage wipe done');
                return;
            }*/

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
                    console.log('session_update');
                    if (params.chainId !== connectionContext.connectedChainId) {
                        updateConnectionContext(params.accounts[0], params.chainId);
                    }
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
