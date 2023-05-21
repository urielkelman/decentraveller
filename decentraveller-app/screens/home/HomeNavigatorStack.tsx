import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RootNavigator from './RootNavigator';
import CreatePlaceNameScreen from "./place/CreatePlaceNameScreen";
import CreatePlaceLocationScreen from "./place/CreatePlaceLocationScreen";
import CreatePlaceProvider from './place/CreatePlaceContext';
import HomeNavigatorDrawer from "./HomeNavigatorDrawer";
import Home from "./Home";

export type HomeStackScreens = {
    HomeNavigatorDrawer: undefined;
    Home: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeNavigatorStack = () => {
    return (
        <HomeStackNavigator.Navigator initialRouteName="HomeNavigatorDrawer" screenOptions={{headerShown: false}}>
            <HomeStackNavigator.Screen name="HomeNavigatorDrawer"  component={HomeNavigatorDrawer} />
        </HomeStackNavigator.Navigator>
    );
};

export default HomeNavigatorStack;
