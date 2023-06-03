import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreatePlaceNameScreen from './place/CreatePlaceNameScreen';
import CreatePlaceLocationScreen from './place/CreatePlaceLocationScreen';
import CreatePlaceProvider from './place/CreatePlaceContext';
import LeftSideBar from './LeftSideBar';
import UserPlacesScreen from '../users/profile/UserPlacesScreen';
import PlaceDetailScreen from './place/PlaceDetailScreen';
import UserProfileScreen from '../users/profile/UserProfileScreen';
import UserReviewsScreen from '../users/profile/UserReviewsScreen';

export type HomeStackScreens = {
    LeftSideBar: undefined;
    CreatePlaceNameScreen: undefined;
    CreatePlaceLocationScreen: undefined;
    PlaceDetailScreen: undefined;
    Profile: undefined;
    UserPlacesScreen: undefined;
    UserReviewsScreen: undefined;
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
                    name="PlaceDetailScreen"
                    component={PlaceDetailScreen}
                    options={{
                        title: 'Place',
                        headerMode: 'screen',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="Profile"
                    component={UserProfileScreen}
                    options={{ headerShown: true }}
                />
                <HomeStackNavigator.Screen
                    name="UserPlacesScreen"
                    component={UserPlacesScreen}
                    options={{
                        title: 'My places',
                        headerMode: 'screen',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="UserReviewsScreen"
                    component={UserReviewsScreen}
                    options={{
                        title: 'My Reviews',
                        headerShown: true,
                    }}
                />
            </HomeStackNavigator.Navigator>
        </CreatePlaceProvider>
    );
};

export default HomeNavigator;
