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

    const killSession = React.useCallback(() => {
        return connector.killSession();
    }, [connector]);

    if (connector.connected) {
        appContext.setConnectionContext({
            connectedAddress: connector.accounts[0],
            connectedChainId: connector.chainId,
        });
    }

    return (
        <View>
            <Button title={'Login'} onPress={connectWallet} />
        </View>
    );
};

export default ConnectWalletScreen;
