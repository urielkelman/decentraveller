import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../../../commons/global';

const RulesList = ({ rules, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(rules)}>
            <View style={styles.rulesContainer}>
                {rules.map((rule, index) => (
                    <View
                        key={index}
                        style={[styles.ruleContainer, { backgroundColor: index % 2 === 0 ? '#efefef' : '#ffc3c3' }]}
                    >
                        <Text style={styles.rule}>{rule}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    rulesContainer: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    ruleContainer: {
        paddingVertical: 5,
        paddingHorizontal: 3,
    },
    rule: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
    },
});

export default RulesList;
