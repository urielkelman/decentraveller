import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RulesList = ({ rules, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
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
        padding: 16,
        marginVertical: 8,
        borderRadius: 10,
    },
    rulesContainer: {
        borderRadius: 10,
        overflow: 'hidden', // Esto recortará los elementos que estén fuera del contenedor
    },
    ruleContainer: {
        marginBottom: 4,
    },
    rule: {
        fontSize: 14,
    },
});

export default RulesList;
