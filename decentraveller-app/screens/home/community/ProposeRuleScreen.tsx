import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import {useAppContext} from "../../../context/AppContext";
import {proposeRuleStyles} from "../../../styles/communityStyles";
import {communityWording} from "./wording";
import {rulesService} from "../../../blockchain/service/rulesService";
import {useNavigation} from "@react-navigation/native";


const ProposeRuleScreen = () => {
    const [ruleStatement, setRuleStatement] = useState('');
    const { web3Provider } = useAppContext();

    const handleProposeRule = async () => {
        console.log("About to create a new rule")
        await rulesService.proposeNewRule(web3Provider, ruleStatement)
        useNavigation().goBack()
    };

    return (
        <ScrollView contentContainerStyle={proposeRuleStyles.container}>
            <Text style={proposeRuleStyles.title}>Propose a new Rule</Text>
            <Text style={proposeRuleStyles.subtitle}>{communityWording.PROPOSE_RULE}</Text>
            <TextInput
                style={proposeRuleStyles.textInput}
                placeholder="Enter your rule statement here"
                multiline
                numberOfLines={15}
                textAlignVertical="top"
                value={ruleStatement}
                onChangeText={(text) => setRuleStatement(text)}
            />
            <View style={proposeRuleStyles.buttonContainer}>
                <DecentravellerButton text="Propose Rule" onPress={handleProposeRule} loading={false} />
            </View>
        </ScrollView>
    );
};

export default ProposeRuleScreen;
