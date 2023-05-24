import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    registrationScreenTextStyle,
    subTitleTextStyle,
    WelcomeStyles,
} from '../../../styles/registrationScreensStyles';
import {registerUserScreenWordings} from "../registration/wording";
import {createStackNavigator} from "@react-navigation/stack";
import {HomeStackScreens} from "../../home/HomeNavigator";
import CreatePlaceProvider from "../../home/place/CreatePlaceContext";
import RootNavigator from "../../home/RootNavigator";
import CreatePlaceNameScreen from "../../home/place/CreatePlaceNameScreen";
import CreatePlaceLocationScreen from "../../home/place/CreatePlaceLocationScreen";
import DecentravellerButton from "../../../commons/components/DecentravellerButton";

export type UserProfileScreens = {
    UserProfileScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<UserProfileScreens>();


const UserProfileScreen = ({ navigation }) => {
    const onClickContinue = () => {
        navigation.navigate('UserProfileEditScreen');
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
            <DecentravellerButton loading={false} text="Continue to profile" onPress={onClickContinue} />
            <Text style={subTitleTextStyle} adjustsFontSizeToFit={true} numberOfLines={2}>
                {"[PROFILE SCREEN IN PROGRESS...]"}
            </Text>
        </View>
    );
};

const UserNavigator = () => {
    return (
        <HomeStackNavigator.Navigator initialRouteName="UserProfileScreen" screenOptions={{headerShown: false}}>
            <HomeStackNavigator.Screen name="UserProfileScreen"  component={UserProfileScreen} />
        </HomeStackNavigator.Navigator>
    );
};

export default UserNavigator;
