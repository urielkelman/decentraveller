import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {registrationButtonStyle} from "../../../styles/registrationScreensStyles";

const NextButton = ({ title, onPress }) => (
    <TouchableOpacity style={registrationButtonStyle.button} onPress={onPress}>
        <View style={registrationButtonStyle.buttonTextView}>
            <Text style={registrationButtonStyle.text}>{title}</Text>
        </View>
    </TouchableOpacity>
);

export default NextButton;
