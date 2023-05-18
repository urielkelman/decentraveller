import React from 'react';
import { View, Text } from 'react-native';
import {
    subTitleTextStyle,
    WelcomeStyles,
} from '../../../styles/registrationScreensStyles';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';

type SuccessRegisterUserScreenProps = {
    onSuccess: () => void;
};
const SuccessRegisterUserScreen: React.FC<SuccessRegisterUserScreenProps> = (props) => {
    const { onSuccess } = props;

    const onClickContinue = () => {
        onSuccess()
    };

    return (
        <View style={WelcomeStyles.container}>
            <Text style={WelcomeStyles.title}>
                Congratulations, you have successfully registered! You are ready to start your decentralized adventure
            </Text>
            <Text style={subTitleTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                Browse between different sites, rate them and get tokens to moderate the discussions, your participation
                has no limits
            </Text>
            <DecentravellerButton loading={false} text="Next" onPress={onClickContinue} />
        </View>
    );
};

export default SuccessRegisterUserScreen;
