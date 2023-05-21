import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    registrationScreenTextStyle,
    subTitleTextStyle,
    WelcomeStyles,
} from '../../../styles/registrationScreensStyles';
import {registerUserScreenWordings} from "../registration/wording";

const UserProfileScreen = ({ navigation }) => {
    const onClickContinue = () => {
        navigation.navigate('RegisterUserScreen');
    };

    return (
        <View style={WelcomeStyles.container}>
            <Text style={WelcomeStyles.title}>{"[PLACE HOLDER OF]"}</Text>
            <View style={registrationScreenTextStyle.container}>
                <Text style={registrationScreenTextStyle.title} adjustsFontSizeToFit={true} numberOfLines={1}>
                    <Text style={registrationScreenTextStyle.blackText}>Decen</Text>
                    <Text style={registrationScreenTextStyle.redText}>Traveller</Text>
                </Text>
            </View>
            <Text style={subTitleTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                {"[PROFILE SCREEN IN PROGRESS...]"}
            </Text>
        </View>
    );
};

export default UserProfileScreen;
