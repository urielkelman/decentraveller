import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import {useAppContext} from "../../../context/AppContext";
import {proposeRuleStyles} from "../../../styles/communityStyles";
import {communityWording} from "./wording";
import {rulesService} from "../../../blockchain/service/rulesService";
import {useNavigation} from "@react-navigation/native";
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';
import { blockchainAdapter } from '../../../blockchain/blockhainAdapter';
import { CreateProposeScreenProp } from '../place/types';

const contractAdapter = blockchainAdapter;


const ProposeRuleScreen = () => {
    const { connectionContext } = useAppContext();
    const [ruleStatement, setRuleStatement] = useState('');
    const { web3Provider } = useAppContext();
    const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
    const [errorMessage, seterrorMessage] = React.useState<string>('Unknown error ocurred');
    const navigation = useNavigation<CreateProposeScreenProp>();

    const handleProposeRule = async () => {
        await rulesService.proposeNewRule(web3Provider, ruleStatement).then(
        (result) => {
            navigation.goBack();
        },
        async (error) => {
            const actualTokens = Number(await blockchainAdapter.getTokens(web3Provider, connectionContext.connectedAddress))
            const proposalTreshold = Number(await blockchainAdapter.proposalTreshold(web3Provider))
            console.log(actualTokens)
            console.log(proposalTreshold)
            if(actualTokens < proposalTreshold){
                seterrorMessage(`Not enough tokens to propose, you have ${actualTokens} and need at least ${proposalTreshold}`)
            }
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
            <DecentravellerButton text="Propose Rule" onPress={handleProposeRule} loading={false} />
            <DecentravellerInformativeModal
                informativeText={errorMessage}
                visible={showErrorModal}
                closeModalText={'Close'}
                handleCloseModal={() => setShowErrorModal(false)}
            />
        </View>

    );
};

export default ProposeRuleScreen;
