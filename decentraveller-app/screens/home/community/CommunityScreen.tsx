import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import RulesList from './RulesList';
import DecentravellerButton from "../../../commons/components/DecentravellerButton";
import {communityScreenStyles} from "../../../styles/communityStyles";
import {RuleResponse} from "../../../api/response/rules";
import {useWalletConnectModal} from "@walletconnect/modal-react-native";
import {useAppContext} from "../../../context/AppContext";
import {mockRulesService} from "../../../blockchain/service/mockRulesService";
import ModalDropdown from 'react-native-modal-dropdown';
import {Rule} from "./types";
import {BlockchainProposalStatus, blockchainStatusOptions} from "../../../blockchain/types";
import {communityWording} from "./wording";

const rulesService = mockRulesService

const CommunityScreen = ({ navigation }) => {
    const { provider, address } = useWalletConnectModal();
    const { web3Provider } = useAppContext();
    const [communityRules, setCommunityRules] = useState([]);
    const [nonActiveRules, setNonActiveRules] = useState([]);
    const [selectedNonActiveRule, setSelectedNonActiveRule] = useState('PENDING');

    const handleOptionSelect = async (status) => {
        setSelectedNonActiveRule(status);
        let getRuleFunction;

        switch (status) {
            case 'PENDING':
                getRuleFunction = rulesService.getAllPendingToVote;
                break;
            case 'ACTIVE':
                getRuleFunction = rulesService.getAllInVotingProcess;
                break;
            case 'DEFEATED':
                getRuleFunction = rulesService.getAllNewDefeated;
                break;
            case 'SUCCEEDED':
                getRuleFunction = rulesService.getAllNewToQueue;
                break;
            case 'QUEUED':
                getRuleFunction = rulesService.getAllQueued;
                break;
        }

        await fetchNonActiveRules(getRuleFunction, status);

    };
    const fetchNonActiveRules = async (getRuleFunction, status) => {
        const nonActiveRules = await getRuleFunction(web3Provider);
        setNonActiveRules(mapRuleResponsesToRules(nonActiveRules, status));
    };

    const fetchCommunityRules = async () => {
        const communityRulesData = await rulesService.getFormerRules();
        setCommunityRules(mapRuleResponsesToRules(communityRulesData, 'EXECUTED'));
    };

    function mapRulesToString(rules: Rule[]): string[] {
        return rules.map((rule, index) => (
            rule.ruleStatement
        ));
    }

    function mapRuleResponseToRule(ruleResponse: RuleResponse, status: string): Rule {
        const rule: Rule = {
            ruleId: ruleResponse.ruleId,
            proposalId: ruleResponse.proposalId,
            proposer: ruleResponse.proposer,
            ruleStatement: ruleResponse.ruleStatement,
            ruleStatus: ruleResponse.ruleStatus,
            ruleSubStatus: BlockchainProposalStatus[status]
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
                    onPress={() => navigation.navigate('DecentravellerRulesList', {
                        ruleList: communityRules,
                        minified: false,
                        horizontal: false,
                    })}
                />
                <View style={communityScreenStyles.section}>
                    <Text style={communityScreenStyles.title}>Rules in Votation</Text>
                    <Text style={communityScreenStyles.subtitle}>{communityWording.VOTATION_RULES}</Text>
                </View>
                <View style={communityScreenStyles.dropContainer}>
                    <Text>Select proposal status</Text>
                    <ModalDropdown
                        options={blockchainStatusOptions}
                        onSelect={(index, value) => handleOptionSelect(value)}
                        defaultValue="PENDING"
                        style={communityScreenStyles.dropdown}
                        textStyle={communityScreenStyles.dropdownText}
                        dropdownStyle={communityScreenStyles.dropdownMenu}

                    />
                </View>
                <RulesList
                    rules={mapRulesToString(nonActiveRules).slice(0, 4)}
                    onPress={() => navigation.navigate('DecentravellerRulesList', { ruleList: nonActiveRules, minified: false, horizontal: false })}
                />
            </View>
            <View style={communityScreenStyles.buttonContainer}>
                <DecentravellerButton text="Propose a New Rule" onPress={() => navigation.navigate('NewProposal')} loading={false} />
            </View>
        </ScrollView>
    );
};

export default CommunityScreen;