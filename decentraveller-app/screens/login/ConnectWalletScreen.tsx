import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';

const ConnectWalletScreen = () => {
    const connector = useWalletConnect();
    const appContext = useAppContext();

    const connectWallet = React.useCallback(() => {
        return connector.connect();
    }, [connector]);

    // console.log(appContext)

    return (
        <View>
            <Button title={'Login'} onPress={connectWallet} />
        </View>
    );
};

export default ConnectWalletScreen;
