import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import React, { useEffect } from 'react';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { rulesService } from '../../blockchain/service/rulesService';
import { useFocusEffect } from '@react-navigation/native';

const CommunityScreen = ({ navigation }) => {
    const { provider, address } = useWalletConnectModal();
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

                for (const rule of inVotingProcess) {
                    const hasVotedInProposal = await rulesService.hasVotedInProposal(
                        web3Provider,
                        rule.proposalId,
                        address,
                    );
                    console.log('hasVotedInProposal', hasVotedInProposal);
                    const votingPower = await rulesService.getVotingPowerForProposal(web3Provider, address, rule.proposedAt)
                    console.log('votingPower for ' + rule.proposalId  , votingPower.toString())
                    const currentProposalResult = await rulesService.getProposalResult(web3Provider, rule.proposalId)
                    console.log('currentProposalResult', currentProposalResult)
                    if (!hasVotedInProposal) {
                        const voteTxHash = await rulesService.voteInFavorOfProposal(web3Provider, rule.proposalId);
                        console.log('voteTxHash', voteTxHash);
                    }
                }
                const allNewDefeated = await rulesService.getAllNewDefeated(web3Provider);
                console.log('allNewDefeated', JSON.stringify(allNewDefeated));

                for (const rule of allNewDefeated) {
                    const currentProposalResult = await rulesService.getProposalResult(web3Provider, rule.proposalId)
                    console.log('currentProposalResult', currentProposalResult)
                }

                const allNewToQueue = await rulesService.getAllNewToQueue(web3Provider);
                console.log('allNewToQueue', JSON.stringify(allNewToQueue));

                for (const rule of allNewToQueue) {
                    const queueTxHash = await rulesService.queueNewRule(web3Provider, rule);
                    console.log('queueTxHash', queueTxHash);
                }

                const allNewQueued = await rulesService.getAllQueued(web3Provider);
                console.log('allNewQueued', JSON.stringify(allNewQueued));

                const allNewToExecute = await rulesService.getAllNewToExecute(web3Provider);
                console.log('allNewToExecute', JSON.stringify(allNewToExecute));

                for (const rule of allNewToExecute) {
                    const executeTxHash = await rulesService.executeNewRule(web3Provider, rule);
                    console.log('executeTxHash', executeTxHash);
                }

                const formerRules = await rulesService.getFormerRules();
                console.log('formerRules', JSON.stringify(formerRules));

                if (formerRules.length < 4 && pendingToVote.length == 0) {
                    await rulesService.proposeNewRule(web3Provider, 'La reglita del uri.');
                }
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
