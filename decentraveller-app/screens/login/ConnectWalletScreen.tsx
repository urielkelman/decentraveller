import React from 'react';
import { Button, Text, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useConnectionContext } from '../../context/AppContext';

const ConnectWalletScreen = () => {
    const connector = useWalletConnect();
    const appContext = useConnectionContext();

    const connectWallet = React.useCallback(() => {
        return connector.connect();
    }, [connector]);

    React.useEffect(() => {
        if (connector.connected) {
            appContext.setConnectionContext({
                connectedAddress: connector.accounts[0],
                connectedChainId: connector.chainId,
            });
        }
    }, [connector])


    return (
        <View>
            <Button title={'Login'} onPress={connectWallet} />
        </View>
    );
};

export default ConnectWalletScreen;
