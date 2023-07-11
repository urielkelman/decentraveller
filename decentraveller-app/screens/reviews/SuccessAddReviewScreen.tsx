import React from 'react';
import { View, Text } from 'react-native';
import DecentravellerButton from '../../commons/components/DecentravellerButton';
import { addReviewsScreenWordings } from './wording';
import { successAddRegisterStyles, subTitleTextStyle } from '../../styles/addReviewStyles';

const SCREENS_TO_TOP = 3;

const SuccessAddReviewScreen = ({ navigation }) => {
    const onClickContinue = () => {
        navigation.pop(SCREENS_TO_TOP);
    };

    return (
        <View style={successAddRegisterStyles.container}>
            <Text style={successAddRegisterStyles.title}>{addReviewsScreenWordings.SUCCESS_ADD_REVIEW_TITLE}</Text>
            <Text style={subTitleTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                {addReviewsScreenWordings.SUCCESS_ADD_REVIEW_SUBTITLE}
            </Text>
            <DecentravellerButton loading={false} text="Go back to place" onPress={onClickContinue} />
        </View>
    );
};

export default SuccessAddReviewScreen;
