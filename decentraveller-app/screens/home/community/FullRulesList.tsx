import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const FullRulesList = ({ route }) => {
    const { rules, title } = route.params;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>{title}</Text>
                {rules.map((rule, index) => (
                    <Text key={index} style={styles.rule}>{rule}</Text>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    rule: {
        fontSize: 14,
        marginBottom: 4,
    },
});

export default FullRulesList;
