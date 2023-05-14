import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const FormInput = ({ placeholder, onChangeText }) => (
    <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.input}
    />
);

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: 'withe',
    },
});

export default FormInput;