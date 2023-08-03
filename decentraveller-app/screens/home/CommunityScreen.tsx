import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import React from 'react';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const CommunityScreen = ({ navigation }) => {
    const { provider } = useWalletConnectModal();
    const appContext = useAppContext();

    const killSession = async () => {
        appContext.cleanConnectionContext();
        await provider.disconnect();
        console.log('session killed');
    };

    return (
        <View style={{ flex: 1 }}>
            <Button title={'Disconnect wallet'} onPress={killSession} />
            <Text>Community</Text>
        </View>
    );
};

export default CommunityScreen;
