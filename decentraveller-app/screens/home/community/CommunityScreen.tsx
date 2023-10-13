import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RulesList from './RulesList';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { communityScreenStyles } from '../../../styles/communityStyles';
import { RuleResponse, RuleStatus } from '../../../api/response/rules';
import { useAppContext } from '../../../context/AppContext';
import { Rule } from './types';
import {BlockchainProposalStatus, BlockchainProposalStatusNames, BlockchainUserStatus} from '../../../blockchain/types';
import { communityWording } from './wording';
import {rulesService} from "../../../blockchain/service/rulesService";
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { Picker } from '@react-native-picker/picker';

const CommunityScreen = ({ navigation }) => {
    const { web3Provider } = useAppContext();
    const [communityRules, setCommunityRules] = useState([]);
    const [nonActiveRules, setNonActiveRules] = useState([]);
    const [selectedNonActiveRule, setSelectedNonActiveRule] = useState(BlockchainUserStatus.PENDING);
    const [loadingProposals, setLoadingProposals] = useState(true);
    const [loadingRules, setLoadingRules] = useState(true);

    const handleOptionSelect = async (status) => {
        setSelectedNonActiveRule(status);
        setLoadingProposals(true);
        let getRuleFunction;
        let getRuleDeletedFunction;
        let blockchainStatus;

        switch (status) {
            case BlockchainUserStatus.PENDING:
                getRuleFunction = () => rulesService.getAllPendingToVote(web3Provider);
                getRuleDeletedFunction = () => rulesService.getAllPendingDeleteToVote(web3Provider);
                blockchainStatus = BlockchainProposalStatusNames.PENDING;
                break;
            case BlockchainUserStatus.ACTIVE:
                getRuleFunction = () => rulesService.getAllInVotingProcess(web3Provider);
                getRuleDeletedFunction = () => rulesService.getAllDeleteInVotingProcess(web3Provider);
                blockchainStatus = BlockchainProposalStatusNames.ACTIVE;
                break;
            case BlockchainUserStatus.QUEUED:
                getRuleFunction = () => rulesService.getAllQueued(web3Provider);
                getRuleDeletedFunction = () => rulesService.getAllDeleteQueued(web3Provider);
                blockchainStatus = BlockchainProposalStatusNames.QUEUED;
                break;
            case BlockchainUserStatus.TO_EXECUTE:
                getRuleFunction = () => rulesService.getAllNewToExecute(web3Provider);
                getRuleDeletedFunction = () => rulesService.getAllDeleteToExecute(web3Provider);
                blockchainStatus = BlockchainProposalStatusNames.TO_EXECUTE;
                break;
        }

        await fetchNonActiveRules(getRuleFunction, getRuleDeletedFunction, blockchainStatus);
        setLoadingProposals(false);
    };
    const fetchNonActiveRules = async (getRuleFunction, getRuleDeletedFunction,  status) => {
        try {
            const nonActiveNewRules: RuleResponse[] = await getRuleFunction();
            const nonActiveDeleteRules: RuleResponse[] = await getRuleDeletedFunction();
            const nonActiveRules = nonActiveNewRules.concat(nonActiveDeleteRules)
            setNonActiveRules(mapRuleResponsesToRules(nonActiveRules, status));
        } catch (e) {
            console.error("Error fetching non-active rules:", e);
        }
    };

    const fetchCommunityRules = async () => {
        setLoadingRules(true)
        const communityRulesData = await rulesService.getFormerRules();
        setCommunityRules(mapRuleResponsesToRules(communityRulesData, BlockchainProposalStatusNames.EXECUTED));
        setLoadingRules(false)
    };

    function mapRulesToString(rules: Rule[]): string[] {
        return rules.map((rule) => rule.ruleStatement);
    }

    function mapProposalsToString(rules: Rule[]): string[] {
        return rules.map((rule) => ((rule.ruleStatus == RuleStatus.PENDING_DELETED ||
                rule.ruleStatus  == RuleStatus.DELETED) ? "To delete: " : "") +
            rule.ruleStatement);
    }

    function mapRuleResponseToRule(ruleResponse: RuleResponse, status: string): Rule {
        const rule: Rule = {
            ruleId: ruleResponse.ruleId,
            proposalId: (ruleResponse.ruleStatus == RuleStatus.PENDING_DELETED ||
                ruleResponse.ruleStatus  == RuleStatus.DELETED) ?
                ruleResponse.deletionProposalId : ruleResponse.proposalId,
            proposer: ruleResponse.proposer,
            ruleStatement: ruleResponse.ruleStatement,
            ruleStatus: ruleResponse.ruleStatus,
            ruleSubStatus: BlockchainProposalStatus[status],
            proposedAt: ruleResponse.proposedAt
        };

        return rule;
    }

    function mapRuleResponsesToRules(ruleResponses: RuleResponse[], status): Rule[] {
        return ruleResponses.map((ruleResponse) => mapRuleResponseToRule(ruleResponse, status));
    }

    useEffect(() => {
        fetchCommunityRules()
        handleOptionSelect(selectedNonActiveRule)
    }, []);

    return (
        <View style={communityScreenStyles.container}>
            <ScrollView style={communityScreenStyles.scrollView}>
                <View style={communityScreenStyles.content}>
                    <View style={communityScreenStyles.section}>
                        <Text style={communityScreenStyles.title}>Community Rules</Text>
                        <Text style={communityScreenStyles.subtitle}>{communityWording.ACCEPTED_RULES}</Text>
                    </View>
                    <View style={communityScreenStyles.ruleContainer}>
                        {
                            loadingRules ? (<LoadingComponent></LoadingComponent>) : (<RulesList
                                rules={mapRulesToString(communityRules)}
                                onPress={() =>
                                    navigation.navigate('DecentravellerRulesList', {
                                        ruleList: communityRules,
                                        minified: false,
                                        horizontal: false,
                                    })
                                }
                            />)
                        }
                    </View>
                    <View style={communityScreenStyles.section}>
                        <Text style={communityScreenStyles.title}>Rules in pending voting</Text>
                        <Text style={communityScreenStyles.subtitle}>{communityWording.VOTATION_RULES}</Text>
                    </View>
                    <View style={communityScreenStyles.dropContainer}>
                        <Text style={communityScreenStyles.subtitle}>Select proposal status</Text>
                        <View style={communityScreenStyles.picker}>
                            <Picker
                                    onValueChange={(v, pos) => handleOptionSelect(v)}
                                    selectedValue={selectedNonActiveRule}>
                                <Picker.Item label={BlockchainUserStatus.PENDING} value={BlockchainUserStatus.PENDING} />
                                <Picker.Item label={BlockchainUserStatus.ACTIVE} value={BlockchainUserStatus.ACTIVE} />
                                <Picker.Item label={BlockchainUserStatus.QUEUED} value={BlockchainUserStatus.QUEUED} />
                                <Picker.Item label={BlockchainUserStatus.TO_EXECUTE} value={BlockchainUserStatus.TO_EXECUTE} />
                            </Picker>
                        </View>
                    </View>
                    <View style={communityScreenStyles.ruleContainer}>
                        {
                            loadingProposals ? (
                                <LoadingComponent />
                            ) : (
                                <RulesList
                                    rules={mapProposalsToString(nonActiveRules)}
                                    onPress={() =>
                                        navigation.navigate('DecentravellerRulesList', {
                                            ruleList: nonActiveRules,
                                            minified: false,
                                            horizontal: false,
                                        })
                                    }
                                />
                            )
                        }
                    </View>

                </View>
            </ScrollView>
            <View style={communityScreenStyles.buttonContainer}>
                <DecentravellerButton
                    text="Propose a New Rule"
                    onPress={() => navigation.navigate('ProposeRuleScreen')}
                    loading={false}
                />
            </View>
        </View>
    );
};

export default CommunityScreen;
