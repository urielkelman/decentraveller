import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import DecentravellerButton from "../../../commons/components/DecentravellerButton";
import {approvedStyles} from "../../../styles/communityStyles";

const ApprovedRuleScreen = ({ route }) => {
    const { rule } = route.params;

    return (
        <View style={[approvedStyles.container]}>
            <Text style={approvedStyles.label}>The following rule is now part of the community:</Text>
            <View style={approvedStyles.header}>
                <Text style={approvedStyles.headerText}>Rule</Text>
            </View>
            <View style={approvedStyles.descriptionContainer}>
                <Text style={approvedStyles.description}>{rule.description}</Text>
            </View>
            <Text style={approvedStyles.subtitle}>
                <Text style={approvedStyles.italic}>If you don't agree, you can propose removing it..</Text>
            </Text>

            <View style={approvedStyles.buttonContainer}>
                <DecentravellerButton text={'Propose remove'} onPress={() => {}} loading={false}></DecentravellerButton>
            </View>
        </View>
    );
};

export default ApprovedRuleScreen;
