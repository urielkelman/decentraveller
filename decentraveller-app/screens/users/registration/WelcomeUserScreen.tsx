import React from 'react';
import { Text, View } from 'react-native';
import {
    registrationScreenTextStyle,
    subTitleTextStyle,
    WelcomeStyles,
} from '../../../styles/registrationScreensStyles';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { registerUserScreenWordings } from './wording';

const WelcomeUserScreen = ({ navigation }) => {
    const onClickContinue = () => {
        navigation.navigate('RegisterUserScreen');
    };

    return (
        <View style={WelcomeStyles.container}>
            <Text style={WelcomeStyles.title}>{registerUserScreenWordings.REGISTER_WELCOME_TITLE}</Text>
            <View style={registrationScreenTextStyle.container}>
                <Text style={registrationScreenTextStyle.title} adjustsFontSizeToFit={true} numberOfLines={1}>
                    <Text style={registrationScreenTextStyle.blackText}>Decen</Text>
                    <Text style={registrationScreenTextStyle.redText}>Traveller</Text>
                </Text>
            </View>
            <Text style={subTitleTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                {registerUserScreenWordings.REGISTER_WELCOME_SUB_TITLE}
            </Text>
            <DecentravellerButton loading={false} text="Next" onPress={onClickContinue} />
        </View>
    );
};

export default WelcomeUserScreen;
