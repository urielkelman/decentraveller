import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {pendingDeletedstyles} from "../../../styles/communityStyles";

const PendingDeletedRuleScreen = ({ route }) => {
    const { rule } = route.params;

    return (
        <View style={[pendingDeletedstyles.container]}>
            <Text style={pendingDeletedstyles.label}>The following rule is pending deleted:</Text>
            <View style={pendingDeletedstyles.header}>
                <Text style={pendingDeletedstyles.headerText}>Rule</Text>
            </View>
            <View style={pendingDeletedstyles.descriptionContainer}>
                <Text style={pendingDeletedstyles.description}>{rule.description}</Text>
            </View>
            <Text style={pendingDeletedstyles.subtitle}>
                <Text style={pendingDeletedstyles.italic}>Vote 'Yes' if you want this rule to be deleted from community.</Text>
                {' '}
                <Text style={pendingDeletedstyles.italic}>Vote 'No' to keep it.</Text>
            </Text>

            <View style={pendingDeletedstyles.buttonContainer}>
                <TouchableOpacity onPress={() => {} }>
                    <Image source={require('../../../assets/images/favor.png')} style={pendingDeletedstyles.buttonImage} />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => {} } style={pendingDeletedstyles.buttonMargin}>
                    <Image source={require('../../../assets/images/contra.png')} style={pendingDeletedstyles.buttonImage} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PendingDeletedRuleScreen;
