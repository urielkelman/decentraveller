import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RulesList from './RulesList';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { communityScreenStyles } from '../../../styles/communityStyles';
import { RuleResponse } from '../../../api/response/rules';
import { useAppContext } from '../../../context/AppContext';
import { mockRulesService } from '../../../blockchain/service/mockRulesService';
import ModalDropdown from 'react-native-modal-dropdown';
import { Rule } from './types';
import {BlockchainProposalStatus, BlockchainProposalStatusNames, BlockchainUserStatus} from '../../../blockchain/types';
import { communityWording } from './wording';

const rulesService = mockRulesService;

const CommunityScreen = ({ navigation }) => {
    const { web3Provider } = useAppContext();
    const [communityRules, setCommunityRules] = useState([]);
    const [nonActiveRules, setNonActiveRules] = useState([]);
    const [selectedNonActiveRule, setSelectedNonActiveRule] = useState(BlockchainUserStatus.PENDING);

    const handleOptionSelect = async (status) => {
        setSelectedNonActiveRule(status);
        let getRuleFunction;
        let getRuleDeletedFunction;
        let blockchainStatus;

        switch (status) {
            case BlockchainUserStatus.PENDING:
                getRuleFunction = rulesService.getAllPendingToVote;
                getRuleDeletedFunction = rulesService.getAllPendingDeleteToVote;
                blockchainStatus = BlockchainProposalStatusNames.PENDING
                break;
            case BlockchainUserStatus.ACTIVE:
                getRuleFunction = rulesService.getAllInVotingProcess;
                getRuleDeletedFunction = rulesService.getAllDeleteInVotingProcess;
                blockchainStatus = BlockchainProposalStatusNames.ACTIVE

                break;
            case BlockchainUserStatus.DEFEATED:
                getRuleFunction = rulesService.getAllNewDefeated;
                getRuleDeletedFunction = rulesService.getAllDeleteDefeated;
                blockchainStatus = BlockchainProposalStatusNames.DEFEATED

                break;
            case BlockchainUserStatus.SUCCEEDED:
                getRuleFunction = rulesService.getAllNewToQueue;
                getRuleDeletedFunction = rulesService.getAllDeleteToQueue;
                blockchainStatus = BlockchainProposalStatusNames.SUCCEEDED

                break;
            case BlockchainUserStatus.QUEUED:
                getRuleFunction = rulesService.getAllQueued;
                getRuleDeletedFunction = rulesService.getAllDeleteQueued;
                blockchainStatus = BlockchainProposalStatusNames.QUEUED

                break;
        }

        await fetchNonActiveRules(getRuleFunction, getRuleDeletedFunction, blockchainStatus);
    };
    const fetchNonActiveRules = async (getRuleFunction, getRuleDeletedFunction,  status) => {
        const nonActiveNewRules: RuleResponse[] = await getRuleFunction(web3Provider);
        const nonActiveDeleteRules: RuleResponse[] = await getRuleDeletedFunction(web3Provider);
        const nonActiveRules = nonActiveNewRules.concat(nonActiveDeleteRules)
        setNonActiveRules(mapRuleResponsesToRules(nonActiveRules, status));
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
