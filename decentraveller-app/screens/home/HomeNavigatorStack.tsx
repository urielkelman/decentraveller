import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RootNavigator from './RootNavigator';
import CreatePlaceNameScreen from "./place/CreatePlaceNameScreen";
import CreatePlaceLocationScreen from "./place/CreatePlaceLocationScreen";

export type HomeStackScreens = {
    RootTabNavigator: undefined;
    CreatePlaceNameScreen: undefined;
    CreatePlaceLocationScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeStackNavigatorStack = () => {
    return (
        <HomeStackNavigator.Navigator initialRouteName="RootTabNavigator">
            <HomeStackNavigator.Screen name="RootTabNavigator"  component={RootNavigator} />
            <HomeStackNavigator.Screen
                name="CreatePlaceNameScreen"
                component={CreatePlaceNameScreen}
                options={{
                    title: 'Add new place',
                    headerMode: 'screen',
                }}
            />
            <HomeStackNavigator.Screen
                name="CreatePlaceLocationScreen"
                component={CreatePlaceLocationScreen}
                options={{
                    title: 'Select location',
                    headerMode: 'screen',
                }}
            />
        </HomeStackNavigator.Navigator>
    );
};

export default HomeStackNavigatorStack;