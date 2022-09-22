import { ActivityIndicator, Button, Text, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useConnectionContext } from '../../context/AppContext';
import React from 'react';

const Home = () => {
    const connector = useWalletConnect();
    const appContext = useConnectionContext();

    const killSession = async () => {
        appContext.setConnectionContext({
            connectedAddress: null,
            connectedChainId: null,
        });
        await connector.killSession();
    };


    return (
        <View>
            <Button title={'Logout'} onPress={killSession} />
            <Text>{connector.accounts[0]}</Text>
        </View>
    );
};

export default Home;
