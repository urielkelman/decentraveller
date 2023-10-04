import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import {useAppContext} from "../../../context/AppContext";
import {proposeRuleStyles} from "../../../styles/communityStyles";
import {communityWording} from "./wording";
import {rulesService} from "../../../blockchain/service/rulesService";
import {useNavigation} from "@react-navigation/native";
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';


const ProposeRuleScreen = () => {
    const [ruleStatement, setRuleStatement] = useState('');
    const { web3Provider } = useAppContext();
    const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);

    const handleProposeRule = async () => {
        rulesService.proposeNewRule(web3Provider, ruleStatement).then(
        (result) => {
            useNavigation().goBack();
        },
        (error) => {
            setShowErrorModal(true);
        });
    };

    return (
        <View style={proposeRuleStyles.container}>
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
            <DecentravellerInformativeModal
                informativeText={'Error ocurred: Check if you have the required tokens'}
                visible={showErrorModal}
                closeModalText={'Close'}
                handleCloseModal={() => setShowErrorModal(false)}
            />
        </View>

    );
};

export default ProposeRuleScreen;
