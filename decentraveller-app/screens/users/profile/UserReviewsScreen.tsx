import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    registrationScreenTextStyle,
    subTitleTextStyle,
    WelcomeStyles,
} from '../../../styles/registrationScreensStyles';

const UserReviewsScreen = ({}) => {
    return (
        <View style={WelcomeStyles.container}>
            <Text style={WelcomeStyles.title}>{'[PLACE HOLDER OF]'}</Text>
            <Text style={subTitleTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                {'[THIS IS AN EXAMPLE OF STACK SCREEN OF REVIEWS. NOW IN PROGRESS TOO...]'}
            </Text>
        </View>
    );
};

export default UserReviewsScreen;
