import React from 'react';
import { Button, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';

const ConnectWalletScreen = () => {
    const connector = useWalletConnect();

    const connectWallet = React.useCallback(() => {
        console.log('Trying to connect....');
        return connector.connect();
    }, [connector]);

    return (
        <View>
            <Button title={'Login'} onPress={connectWallet} />
        </View>
    );
};

export default ConnectWalletScreen;
