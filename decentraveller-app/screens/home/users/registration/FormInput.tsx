import React from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {registrationIndicationTextStyles} from "../../../../styles/registrationScreensStyles";

const FormInput = ({ text, setTextValue, placeholder }) => (
    <View style={registrationIndicationTextStyles.textInputContainer}>
        <TextInput
            style={registrationIndicationTextStyles.textInputField}
            placeholder={placeholder}
            value={text}
            onChangeText={setTextValue}
        />
    </View>
);


export default FormInput;