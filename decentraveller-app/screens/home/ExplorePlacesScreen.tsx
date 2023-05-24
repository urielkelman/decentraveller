import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';
import React from 'react';
import { Feather } from '@expo/vector-icons';

const ExplorePlacesScreen = ({ navigation }) => {
    const connector = useWalletConnect();
    const appContext = useAppContext();

    const killSession = async () => {
        appContext.cleanConnectionContext();
        await connector.killSession();
        console.log('session killed');
    };

    console.log('Explore');

    return (
        <View style={{ flex: 1 }}>
            <Button title={'Disconnect wallet'} onPress={killSession} />
            <Text>Explore places</Text>
        </View>
    );
};

export default ExplorePlacesScreen;
