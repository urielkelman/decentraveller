import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NextButton from './NextButton';
import {registrationScreenTextStyle, subTitleTextStyle, WelcomeStyles} from "../../../styles/registrationScreensStyles";

const WelcomeUserScreen = ({ navigation }) => {
    const onClickContinue = () => {
        navigation.navigate('RegisterUserScreen');
    };

    return (
        <View style={WelcomeStyles.container}>
            <Text style={WelcomeStyles.title}>We noticed that this is the first time you have joined. Welcome to:</Text>
            <View style={registrationScreenTextStyle.container}>
                <Text style={registrationScreenTextStyle.title} adjustsFontSizeToFit={true} numberOfLines={1}>
                    <Text style={registrationScreenTextStyle.blackText}>Decen</Text>
                    <Text style={registrationScreenTextStyle.redText}>Traveller</Text>
                </Text>
            </View>
            <Text style={subTitleTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                To manage you better we want to ask you for some data, but hey! They are completely optional
            </Text>
            <NextButton title="Next" onPress={onClickContinue} />
        </View>
    );
};

export default WelcomeUserScreen;
