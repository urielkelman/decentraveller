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
                const pendingToVote = await rulesService.getAllPendingToVote(web3Provider);
                console.log('pendingToVote', JSON.stringify(pendingToVote));

                const inVotingProcess = await rulesService.getAllInVotingProcess(web3Provider);
                console.log('inVotingProcess', JSON.stringify(inVotingProcess));

                const allNewDefeated = await rulesService.getAllNewDefeated(web3Provider);
                console.log('allNewDefeated', JSON.stringify(allNewDefeated));

                const allNewToQueue = await rulesService.getAllNewToQueue(web3Provider);
                console.log('allNewToQueue', JSON.stringify(allNewToQueue));

                const allNewToExecute = await rulesService.getAllNewToExecute(web3Provider);
                console.log('allNewToExecute', JSON.stringify(allNewToExecute));

                const formerRules = await rulesService.getFormerRules();
                console.log('formerRules', JSON.stringify(formerRules));
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
