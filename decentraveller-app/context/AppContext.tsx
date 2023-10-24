import React from 'react';
import { AppContextStateArg, AppContextType, ConnectionContext, DeviceDimensions } from './types';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { ethers } from 'ethers';

export const AppContext = React.createContext<AppContextType | null>(null);

export const DEFAULT_CHAIN_ID = 31337;
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
    const [role, setUserRole] = React.useState<string>('');
    const [profileImageUrl, setProfileImageUrl] = React.useState<string>('');
    const [createdAt, setUserCreatedAt] = React.useState<string>('');
    const [interest, setUserInterest] = React.useState<string>('');
    const [location, setLocation] = React.useState<[string, string] | undefined>(undefined);
    const [shouldUpdateHomeRecs, setShouldUpdateHomeRecs] = React.useState<boolean>(false);

    const [web3Provider, setWeb3Provider] = React.useState<ethers.providers.Web3Provider | null>(null);

    const { provider, isConnected, address } = useWalletConnectModal();

    const pushChangeUpdate = async () => {
        try {
            console.log('Trying to request switch chain');
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexValue(DEFAULT_CHAIN_ID) }],
            });
        } catch (e) {
            console.log('error switching chain', e);
            /*if (e.message === UNRECOGNIZED_CHAIN_ID_MESSAGE('0x7a69')) {
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
            }*/
        }
    };

    const deviceDimensions: DeviceDimensions = React.useMemo<DeviceDimensions>(
        () => ({
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        }),
        [],
    );

    const memoFactory = <T extends unknown>(arg: T, setArg: (T) => void): AppContextStateArg<T> => {
        return React.useMemo(
            () => ({
                value: arg,
                setValue: setArg,
            }),
            [arg],
        );
    };

    const userNickname: AppContextStateArg<string> = memoFactory(nickname, setUserNickname);

    const userRole : AppContextStateArg<string> = memoFactory(role, setUserRole);

    const userCreatedAt: AppContextStateArg<string> = memoFactory(createdAt, setUserCreatedAt);

    const userInterest: AppContextStateArg<string> = memoFactory(interest, setUserInterest);

    const shouldUpdateHomeRecommendations: AppContextStateArg<boolean> = memoFactory(
        shouldUpdateHomeRecs,
        setShouldUpdateHomeRecs,
    );

    const userLocation: AppContextStateArg<[string, string]> = memoFactory(location, setLocation);

    React.useEffect(() => {
        /* This effect allow us to clean sessions that the WalletConnect connector stores in the AsyncStorage */
        const wipeAsyncStorage = async () => {
            await AsyncStorage.clear();
            setConnectionContext(null);
        };

        wipeAsyncStorage().catch((e) => console.log('There was a problem wiping async storage', e));
    }, []);

    const updateConnectionContext = async (address) => {
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const chainId = (await web3Provider.getNetwork()).chainId;
        console.log('Updating connection context', address, chainId);
        const isWrongChain = chainId !== DEFAULT_CHAIN_ID;
        const newConnectionContext = {
            connectedAddress: address.toLowerCase(),
            connectedChainId: chainId,
            isWrongChain: isWrongChain,
        };
        setConnectionContext(newConnectionContext);
        setWeb3Provider(web3Provider);
        connectionContextRef.current = newConnectionContext;
    };

    React.useEffect(() => {
        if (isConnected) {
            updateConnectionContext(address);
            if (!subscriptionsDone) {
                setSubscriptionsDone(true);

                provider.client.on('session_event', (event) => {
                    if (
                        connectionContext &&
                        event.params.event.name === 'chainChanged' &&
                        connectionContextRef.current.connectedChainId !== event.params.event.data
                    ) {
                        console.log('updating con context');
                        updateConnectionContext(address);
                    }
                });

                provider.client.on('session_delete', async (event) => {
                    console.log('session delete received: ', event);
                    setSubscriptionsDone(false);
                    setConnectionContext(null);
                });
            }
        }
    }, [isConnected, provider]);

    const cleanConnectionContext = () => {
        setConnectionContext(null);
        connectionContextRef.current = null;
    };

    return (
        <AppContext.Provider
            value={{
                connectionContext,
                web3Provider,
                deviceDimensions,
                userNickname,
                userRole,
                userCreatedAt,
                userInterest,
                userLocation,
                shouldUpdateHomeRecommendations,
                pushChangeUpdate,
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
