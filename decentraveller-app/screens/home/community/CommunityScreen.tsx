import { useAppContext } from '../../../context/AppContext';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import {apiAdapter} from "../../../api/apiAdapter";
import RulesList from './RulesList';
import DecentravellerButton from "../../../commons/components/DecentravellerButton";
const CommunityScreen = ({ navigation }) => {
    const adapter = apiAdapter;
    const { provider } = useWalletConnectModal();
    const appContext = useAppContext();
    const [communityRules, setCommunityRules] = useState([]);
    const [rulesInVotation, setRulesInVotation] = useState([]);

    const fetchCommunityRules = async () => {
        const communityRulesData = await adapter.getRules();
        setCommunityRules(communityRulesData.rules);
    };

    const fetchRulesInVotation = async () => {
        const rulesInVotationData = await adapter.getRulesInVotation();
        setRulesInVotation(rulesInVotationData.rules);
    };

    useEffect(() => {
        fetchCommunityRules();
        fetchRulesInVotation();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.title}>Community Rules</Text>
                    <Text style={styles.subtitle}>Those rules are accepted by the community and all members should keep them.</Text>
                </View>
                <RulesList
                    rules={communityRules.slice(0, 4)}
                    onPress={() => navigation.navigate('FullRulesList', { rules: communityRules, title: 'Community Rules' })}
                />
                <View style={styles.section}>
                    <Text style={styles.title}>Rules in Votation</Text>
                    <Text style={styles.subtitle}>Vote to agree or disagree with any of these rule proposals.</Text>
                </View>
                <RulesList
                    rules={rulesInVotation.slice(0, 4)}
                    onPress={() => navigation.navigate('FullRulesList', { rules: rulesInVotation, title: 'Rules in Votation' })}
                />
            </View>
            <View style={styles.buttonContainer}>
                <DecentravellerButton text="Propose a New Rule" onPress={() => navigation.navigate('NewProposal')} loading={false} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',
    },
    content: {
        flex: 1,
        paddingBottom: 100,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});

export default CommunityScreen;