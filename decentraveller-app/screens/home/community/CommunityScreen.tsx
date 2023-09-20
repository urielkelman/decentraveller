import { useAppContext } from '../../../context/AppContext';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import {apiAdapter} from "../../../api/apiAdapter";
import RulesList from './RulesList';
import DecentravellerButton from "../../../commons/components/DecentravellerButton";
import {Rule} from "./types";
import {mockApiAdapter} from "../../../api/mockApiAdapter";
import {communityScreenStyles} from "../../../styles/communityStyles";


const CommunityScreen = ({ navigation }) => {
    const adapter = mockApiAdapter;
    const [communityRules, setCommunityRules] = useState([]);
    const [rulesInVotation, setRulesInVotation] = useState([]);

    const fetchCommunityRules = async () => {
        const communityRulesData = await adapter.getRules();
        const rules = communityRulesData.rules;
        setCommunityRules(rules);
    };

    function mapRulesToString(rules: Rule[]): string[] {
        return rules.map((rule, index) => (
            rule.description
        ));
    }

    const fetchRulesInVotation = async () => {
        const rulesInVotationData = await adapter.getRulesInVotation();
        const rules = rulesInVotationData.rules;
        setRulesInVotation(rules);
    };

    useEffect(() => {
        fetchCommunityRules();
        fetchRulesInVotation();
    }, []);

    return (
        <ScrollView style={communityScreenStyles.container}>
            <View style={communityScreenStyles.content}>
                <View style={communityScreenStyles.section}>
                    <Text style={communityScreenStyles.title}>Community Rules</Text>
                    <Text style={communityScreenStyles.subtitle}>Those rules are accepted by the community and all members should keep them.</Text>
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
                    <Text style={communityScreenStyles.subtitle}>Vote to agree or disagree with any of these rule proposals.</Text>
                </View>
                <RulesList
                    rules={mapRulesToString(rulesInVotation).slice(0, 4)}
                    onPress={() => navigation.navigate('DecentravellerRulesList', { ruleList: rulesInVotation, minified: false, horizontal: false })}
                />
            </View>
            <View style={communityScreenStyles.buttonContainer}>
                <DecentravellerButton text="Propose a New Rule" onPress={() => navigation.navigate('NewProposal')} loading={false} />
            </View>
        </ScrollView>
    );
};

export default CommunityScreen;