import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    registrationScreenTextStyle,
    subTitleTextStyle,
    WelcomeStyles,
} from '../../../styles/registrationScreensStyles';
import { registerUserScreenWordings } from '../registration/wording';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackScreens } from '../../home/HomeNavigator';
import CreatePlaceProvider from '../../home/place/CreatePlaceContext';
import RootNavigator from '../../home/RootNavigator';
import CreatePlaceNameScreen from '../../home/place/CreatePlaceNameScreen';
import CreatePlaceLocationScreen from '../../home/place/CreatePlaceLocationScreen';

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
