import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {registrationScreenTextStyle, subTitleTextStyle, WelcomeStyles} from "../../../styles/registrationScreensStyles";
import DecentravellerButton from "../../../commons/components/DecentravellerButton";
import { useNavigation } from '@react-navigation/native';



const SuccessRegisterUserScreen = ({navigation}) => {
    const onClickContinue = () => {
        navigation.navigate('HomeNavigator');
    };

    return (
        <View style={WelcomeStyles.container}>
            <Text style={WelcomeStyles.title}>Congratulations, you have successfully registered! You are ready to start your decentralized adventure</Text>
            <Text style={subTitleTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                Browse between different sites, rate them and get tokens to moderate the discussions, your participation has no limits
            </Text>
            <DecentravellerButton loading={false} text="Next" onPress={onClickContinue} />
        </View>
    );
};

export default SuccessRegisterUserScreen;
