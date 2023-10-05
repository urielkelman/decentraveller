import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RulesList from './RulesList';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { communityScreenStyles } from '../../../styles/communityStyles';
import { RuleResponse } from '../../../api/response/rules';
import { useAppContext } from '../../../context/AppContext';
import ModalDropdown from 'react-native-modal-dropdown';
import { Rule } from './types';
import {BlockchainProposalStatus, BlockchainProposalStatusNames, BlockchainUserStatus} from '../../../blockchain/types';
import { communityWording } from './wording';
import {rulesService} from "../../../blockchain/service/rulesService";
import { useFocusEffect } from '@react-navigation/native';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const CommunityScreen = ({ navigation }) => {
    const { web3Provider } = useAppContext();
    const { address } = useWalletConnectModal();
    const [communityRules, setCommunityRules] = useState([]);
    const [nonActiveRules, setNonActiveRules] = useState([]);
    const [selectedNonActiveRule, setSelectedNonActiveRule] = useState(BlockchainUserStatus.PENDING);

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
                    //await rulesService.proposeNewRule(web3Provider, 'La reglita del uri.');
                }
            };
            loadRules();
        }, []),
    );
    const handleOptionSelect = async (status) => {
        setSelectedNonActiveRule(status);
        let getRuleFunction;
        let getRuleDeletedFunction;
        let blockchainStatus;

        switch (status) {
            case BlockchainUserStatus.PENDING:
                getRuleFunction = () => {rulesService.getAllPendingToVote(web3Provider)};
                getRuleDeletedFunction = () =>{rulesService.getAllPendingDeleteToVote(web3Provider)};
                blockchainStatus = BlockchainProposalStatusNames.PENDING
                break;
            case BlockchainUserStatus.ACTIVE:
                getRuleFunction = () =>{rulesService.getAllInVotingProcess(web3Provider)};
                getRuleDeletedFunction = () =>{rulesService.getAllDeleteInVotingProcess(web3Provider)};
                blockchainStatus = BlockchainProposalStatusNames.ACTIVE

                break;
            case BlockchainUserStatus.DEFEATED:
                getRuleFunction = () =>{rulesService.getAllNewDefeated(web3Provider)};
                getRuleDeletedFunction = () =>{rulesService.getAllDeleteDefeated(web3Provider)};
                blockchainStatus = BlockchainProposalStatusNames.DEFEATED

                break;
            case BlockchainUserStatus.SUCCEEDED:
                getRuleFunction = () =>{rulesService.getAllNewToQueue(web3Provider)};
                getRuleDeletedFunction = () =>{rulesService.getAllDeleteToQueue(web3Provider)};
                blockchainStatus = BlockchainProposalStatusNames.SUCCEEDED

                break;
            case BlockchainUserStatus.QUEUED:
                getRuleFunction = () =>{rulesService.getAllQueued(web3Provider)};
                getRuleDeletedFunction = () =>{rulesService.getAllDeleteQueued(web3Provider)};
                blockchainStatus = BlockchainProposalStatusNames.QUEUED

                break;
        }

        await fetchNonActiveRules(getRuleFunction, getRuleDeletedFunction, blockchainStatus);
    };
    const fetchNonActiveRules = async (getRuleFunction, getRuleDeletedFunction,  status) => {
        try {
            const nonActiveNewRules: RuleResponse[] = await getRuleFunction(web3Provider);
            const nonActiveDeleteRules: RuleResponse[] = await getRuleDeletedFunction(web3Provider);
            //const nonActiveRules = nonActiveNewRules.concat(nonActiveDeleteRules)
            setNonActiveRules(mapRuleResponsesToRules(nonActiveRules, nonActiveNewRules));
        } catch (e) {
            console.error("Error fetching non-active rules:", e);
        }
    };

    const fetchCommunityRules = async () => {
        const communityRulesData = await rulesService.getFormerRules();
        setCommunityRules(mapRuleResponsesToRules(communityRulesData, BlockchainProposalStatusNames.EXECUTED));
    };

    function mapRulesToString(rules: Rule[]): string[] {
        return rules.map((rule) => rule.ruleStatement);
    }

    function mapRuleResponseToRule(ruleResponse: RuleResponse, status: string): Rule {
        const rule: Rule = {
            ruleId: ruleResponse.ruleId,
            proposalId: ruleResponse.proposalId,
            proposer: ruleResponse.proposer,
            ruleStatement: ruleResponse.ruleStatement,
            ruleStatus: ruleResponse.ruleStatus,
            ruleSubStatus: BlockchainProposalStatus[status],
        };

        return rule;
    }

    function mapRuleResponsesToRules(ruleResponses: RuleResponse[], status): Rule[] {
        return ruleResponses.map((ruleResponse) => mapRuleResponseToRule(ruleResponse, status));
    }

    useEffect(() => {
        fetchCommunityRules();
        handleOptionSelect(selectedNonActiveRule);
    }, []);

    return (
        <ScrollView style={communityScreenStyles.container}>
            <View style={communityScreenStyles.content}>
                <View style={communityScreenStyles.section}>
                    <Text style={communityScreenStyles.title}>Community Rules</Text>
                    <Text style={communityScreenStyles.subtitle}>{communityWording.ACCEPTED_RULES}</Text>
                </View>
                <RulesList
                    rules={mapRulesToString(communityRules).slice(0, 4)}
                    onPress={() =>
                        navigation.navigate('DecentravellerRulesList', {
                            ruleList: communityRules,
                            minified: false,
                            horizontal: false,
                        })
                    }
                />
                <View style={communityScreenStyles.section}>
                    <Text style={communityScreenStyles.title}>Rules in Votation</Text>
                    <Text style={communityScreenStyles.subtitle}>{communityWording.VOTATION_RULES}</Text>
                </View>
                <View style={communityScreenStyles.dropContainer}>
                    <Text style={communityScreenStyles.subtitle}>Select proposal status</Text>
                    <ModalDropdown
                        options={Object.values(BlockchainUserStatus)}
                        onSelect={(index, value) => handleOptionSelect(value)}
                        defaultValue={BlockchainUserStatus.PENDING}
                        style={communityScreenStyles.dropdown}
                        textStyle={communityScreenStyles.dropdownText}
                        dropdownStyle={communityScreenStyles.dropdownMenu}
                    />
                </View>
                <RulesList
                    rules={mapRulesToString(nonActiveRules).slice(0, 4)}
                    onPress={() =>
                        navigation.navigate('DecentravellerRulesList', {
                            ruleList: nonActiveRules,
                            minified: false,
                            horizontal: false,
                        })
                    }
                />
            </View>
            <View style={communityScreenStyles.buttonContainer}>
                <DecentravellerButton
                    text="Propose a New Rule"
                    onPress={() => navigation.navigate('ProposeRuleScreen')}
                    loading={false}
                />
            </View>
        </ScrollView>
    );
};

export default CommunityScreen;
