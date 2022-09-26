import { ActivityIndicator, Button, Text, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';
import React from 'react';

const Home = () => {
    const connector = useWalletConnect();
    const appContext = useAppContext();

    const killSession = async () => {
        appContext.cleanConnectionContext();
        await connector.killSession();
        console.log('session killed');
    };

    return (
        <View>
            <Button title={'Disconnect wallet'} onPress={killSession} />
            <Text>{connector.accounts[0]}</Text>
        </View>
    );
};

export default Home;
