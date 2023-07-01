import React from 'react';
import { AppContextStateArg, AppContextType, ConnectionContext, DeviceDimensions } from './types';
import { Dimensions } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = React.createContext<AppContextType | null>(null);

//const DEFAULT_CHAIN_ID = 31337;
//const DEFAULT_CHAIN_ID_HEX = '0x7a69';


const DEFAULT_CHAIN_ID = 5;
const DEFAULT_CHAIN_ID_HEX = '0x5';

const UNRECOGNIZED_CHAIN_ID_MESSAGE = (chainId) =>
    `Unrecognized chain ID "${chainId}". Try adding the chain using wallet_addEthereumChain first.`;

interface UpdateSessionPayloadParams {
    accounts: string[];
    chainId: number;
}

const AppContextProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [connectionContext, setConnectionContext] = React.useState<ConnectionContext>(null);
    const connectionContextRef = React.useRef<ConnectionContext>(null);
    const [subscriptionsDone, setSubscriptionsDone] = React.useState<boolean>(false);

    const [nickname, setUserNickname] = React.useState<string>('');
    const [createdAt, setUserCreatedAt] = React.useState<string>('');
    const [interest, setUserInterest] = React.useState<string>('');
    const [location, setLocation] = React.useState<[string, string] | undefined>(undefined);

    const connector = useWalletConnect();

    const pushChangeUpdate = async () => {
        console.log('Trying to update chain...');
        try {
            await connector.sendCustomRequest({
                id: 1,
                jsonrpc: '2.0',
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: DEFAULT_CHAIN_ID_HEX }],
            });
        } catch (e) {
            if (e.message === UNRECOGNIZED_CHAIN_ID_MESSAGE(DEFAULT_CHAIN_ID_HEX)) {
                try {
                    await connector.sendCustomRequest({
                        id: 2,
                        jsonrpc: '2.0',
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: DEFAULT_CHAIN_ID_HEX,
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
        }
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
        // This effect allow us to clean sessions that the WalletConnect connector stores in the AsyncStorage
        console.log(connector.connected, 'con con');
        const wipeAsyncStorage = async () => {
            if (!connector.connected) {
                await AsyncStorage.clear();
                setConnectionContext(null);
            }
        };

        wipeAsyncStorage().catch((e) => console.log('There was a problem wiping async storage', e));
    }, []);

    const updateConnectionContext = (address, chainId) => {
        console.log('Updating connection context', address, chainId);
        const isWrongChain = chainId !== DEFAULT_CHAIN_ID;
        const newConnectionContext = {
            connectedAddress: address,
            connectedChainId: chainId,
            isWrongChain: isWrongChain,
        };
        setConnectionContext(newConnectionContext);
        connectionContextRef.current = newConnectionContext;
    };

    const cleanConnectionContext = () => {
        setConnectionContext(null);
        connectionContextRef.current = null;
    };

    React.useEffect(() => {
        /*console.log('connected:', connector.connected);
        console.log('session:', connector.session);
        console.log(connector.chainId);*/

        if (connector.connected) {
            updateConnectionContext(connector.accounts[0], connector.chainId);

            if (!subscriptionsDone) {
                setSubscriptionsDone(true);

                connector.on('disconnect', async (error, payload) => {
                    setSubscriptionsDone(false);
                    setConnectionContext(null);
                });

                connector.on('session_update', async (error, payload) => {
                    const params: UpdateSessionPayloadParams = payload.params[0];
                    console.log(params);
                    console.log('session_update');
                    /*
                     * The session_update event is not received when the chain is switched to a custom network, so
                     * this callback does not work for changes to our local development blockchain. This has been
                     * tested and only happens for our hardhat network. The problem with this is that there are
                     * scenarios in which we ask the user to change the chain although the correct one is used.
                     * */
                    if (
                        connectionContextRef.current &&
                        params.chainId !== connectionContextRef.current.connectedChainId
                    ) {
                        updateConnectionContext(params.accounts[0], params.chainId);
                    }
                });
            }
        }
    }, [connector.connected]);

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
