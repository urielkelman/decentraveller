import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import React, { useEffect } from 'react';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { rulesService } from '../../blockchain/service/rulesService';
import { useFocusEffect } from '@react-navigation/native';

const CommunityScreen = ({ navigation }) => {
    const { provider } = useWalletConnectModal();
    const appContext = useAppContext();
    const { web3Provider } = useAppContext();

    const killSession = async () => {
        appContext.cleanConnectionContext();
        await provider.disconnect();
        console.log('session killed');
    };

    useFocusEffect(
        React.useCallback(() => {
            const loadRules = async () => {
                const rulesResponse = await rulesService.getAllPendingToVote(web3Provider);
                console.log(JSON.stringify(rulesResponse));
            };
            loadRules();
        }, []),
    );

    useEffect(() => {}, []);

    return (
        <View style={{ flex: 1 }}>
            <Button title={'Disconnect wallet'} onPress={killSession} />
            <Text>Community</Text>
        </View>
    );
};

export default CommunityScreen;
