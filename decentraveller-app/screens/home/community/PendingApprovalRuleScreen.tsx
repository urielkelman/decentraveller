import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {pendingApprovalStyles} from "../../../styles/communityStyles";

const PendingApprovalRuleScreen = ({ route }) => {
    const { rule } = route.params;

    return (
        <View style={[pendingApprovalStyles.container]}>
            <Text style={pendingApprovalStyles.label}>The following rule is pending approval:</Text>
            <View style={pendingApprovalStyles.header}>
                <Text style={pendingApprovalStyles.headerText}>Rule</Text>
            </View>
            <View style={pendingApprovalStyles.descriptionContainer}>
                <Text style={pendingApprovalStyles.description}>{rule.description}</Text>
            </View>
            <Text style={pendingApprovalStyles.subtitle}>
                <Text style={pendingApprovalStyles.italic}>Vote 'Yes' if you want this rule to be applied to the community.</Text>
                {' '}
                <Text style={pendingApprovalStyles.italic}>Vote 'No' to reject it.</Text>
            </Text>

            <View style={pendingApprovalStyles.buttonContainer}>
                <TouchableOpacity onPress={() => {} }>
                    <Image source={require('../../../assets/images/favor.png')} style={pendingApprovalStyles.buttonImage} />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => {} } style={pendingApprovalStyles.buttonMargin}>
                    <Image source={require('../../../assets/images/contra.png')} style={pendingApprovalStyles.buttonImage} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PendingApprovalRuleScreen;
