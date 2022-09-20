import React from 'react';
import { Button, Text, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const Home = () => {
    const connector = useWalletConnect();

    const connectWallet = React.useCallback(() => {
        return connector.connect();
    }, [connector]);

    const killSession = React.useCallback(() => {
        return connector.killSession();
    }, [connector]);

    return (
        <View>
            {!connector.connected && (
                <View>
                    <Button title={'Login'} onPress={connectWallet} />
                </View>
            )}
            {connector.connected && (
                <View>
                    <Button title={'Logout'} onPress={killSession} />
                    <Text>{connector.accounts[0]}</Text>
                </View>
            )}
        </View>
    );
};

export default Home;
