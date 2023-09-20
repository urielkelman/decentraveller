import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import DecentravellerButton from "../../../commons/components/DecentravellerButton";
import {deletedStyles} from "../../../styles/communityStyles";


const DeletedRuleScreen = ({ route }) => {
    const { rule } = route.params;

    return (
        <View style={[deletedStyles.container]}>
            <Text style={deletedStyles.label}>The following rule is not part of the community:</Text>
            <View style={deletedStyles.header}>
                <Text style={deletedStyles.headerText}>Rule</Text>
            </View>
            <View style={deletedStyles.descriptionContainer}>
                <Text style={deletedStyles.description}>{rule.description}</Text>
            </View>
            <Text style={deletedStyles.subtitle}>
                <Text style={deletedStyles.italic}>There is no action possible to deleted rule</Text>
            </Text>
        </View>
    );
};

export default DeletedRuleScreen;
