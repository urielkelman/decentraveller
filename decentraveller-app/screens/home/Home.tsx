import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';
import React from 'react';
import { Feather } from '@expo/vector-icons';

const Home = ({ navigation }) => {
    const connector = useWalletConnect();
    const appContext = useAppContext();

    const killSession = async () => {
        appContext.cleanConnectionContext();
        await connector.killSession();
        console.log('session killed');
    };

    return (
        <View style={{ flex: 1 }}>
            <Button title={'Disconnect wallet'} onPress={killSession} />
            <TouchableOpacity
                style={{ paddingTop: 35, flex: 1, flexDirection: 'row' }}
                onPress={() => navigation.navigate('CreatePlaceFirstScreen')}
            >
                <Feather name="plus-circle" size={24} color="black" style={{ paddingRight: 10 }} />
                <Text>Add a place</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;
