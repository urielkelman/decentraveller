import React from 'react';
import { AppContextStateArg, AppContextType, ConnectionContext, DeviceDimensions } from './types';
import { Dimensions } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [profileImage, setProfileImage] = React.useState<string>('');

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

    const userProfileImage: AppContextStateArg<string> = memoFactory(profileImage, setProfileImage);

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
                    if (connectionContext && params.chainId !== connectionContext.connectedChainId) {
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
                userNickname,
                userCreatedAt,
                userInterest,
                userLocation,
                userProfileImage,
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
