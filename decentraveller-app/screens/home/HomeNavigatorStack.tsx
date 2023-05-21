import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RootNavigator from './RootNavigator';
import CreatePlaceNameScreen from "./place/CreatePlaceNameScreen";
import CreatePlaceLocationScreen from "./place/CreatePlaceLocationScreen";
import CreatePlaceProvider from './place/CreatePlaceContext';
import HomeNavigatorDrawer from "./HomeNavigatorDrawer";

export type HomeStackScreens = {
    RootTabNavigator: undefined;
    HomeNavigatorDrawer: undefined;
    CreatePlaceNameScreen: undefined;
    CreatePlaceLocationScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeNavigatorStack = () => {
    return (
        <CreatePlaceProvider>
            <HomeStackNavigator.Navigator initialRouteName="RootTabNavigator" screenOptions={{headerShown: false}}>
                <HomeStackNavigator.Screen name="RootTabNavigator"  component={RootNavigator} />
                <HomeStackNavigator.Screen
                    name="CreatePlaceNameScreen"
                    component={CreatePlaceNameScreen}
                    options={{
                        title: 'Add new place',
                        headerMode: 'screen',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="CreatePlaceLocationScreen"
                    component={CreatePlaceLocationScreen}
                    options={{
                        title: 'Select location',
                        headerMode: 'screen',
                        headerShown: true,
                    }}
                />
            </HomeStackNavigator.Navigator>
        </CreatePlaceProvider>
        );
};

export default HomeNavigatorStack;