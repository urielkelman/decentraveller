import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreatePlaceNameScreen from './place/CreatePlaceNameScreen';
import CreatePlaceLocationScreen from './place/CreatePlaceLocationScreen';
import CreatePlaceProvider from './place/CreatePlaceContext';
import LeftSideBar from './LeftSideBar';
import UserProfileEditScreen from '../users/profile/UserProfileEditScreen';
import PlaceDetailScreen from './place/PlaceDetailScreen';
import UserProfileScreen from '../users/profile/UserProfileScreen';

export type HomeStackScreens = {
    LeftSideBar: undefined;
    UserProfileEditScreen: undefined;
    CreatePlaceNameScreen: undefined;
    CreatePlaceLocationScreen: undefined;
    PlaceDetailScreen: undefined;
    Profile: undefined;
};

const HomeStackNavigator = createStackNavigator<HomeStackScreens>();

const HomeNavigator = () => {
    return (
        <CreatePlaceProvider>
            <HomeStackNavigator.Navigator initialRouteName="LeftSideBar" screenOptions={{ headerShown: false }}>
                <HomeStackNavigator.Screen name="LeftSideBar" component={LeftSideBar} />
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
                <HomeStackNavigator.Screen
                    name="UserProfileEditScreen"
                    component={UserProfileEditScreen}
                    options={{
                        title: 'Edit Profile',
                        headerMode: 'screen',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="PlaceDetailScreen"
                    component={PlaceDetailScreen}
                    options={{
                        title: 'Select location',
                        headerMode: 'screen',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="Profile"
                    component={UserProfileScreen}
                    options={{ headerShown: true }}
                />
            </HomeStackNavigator.Navigator>
        </CreatePlaceProvider>
    );
};

export default HomeNavigator;
