import React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import CreatePlaceNameScreen from './place/CreatePlaceNameScreen';
import CreatePlaceLocationScreen from './place/CreatePlaceLocationScreen';
import CreatePlaceProvider from './place/CreatePlaceContext';
import LeftSideBar from './LeftSideBar';
import UserPlacesScreen from '../users/profile/UserPlacesScreen';
import PlaceDetailScreen from './place/PlaceDetailScreen';
import PlaceReviewsScreen from './place/PlaceReviewsScreen';
import MyProfileScreen from '../users/profile/MyProfileScreen';
import UserProfileScreen from '../users/profile/UserProfileScreen';
import UserReviewsScreen from '../users/profile/UserReviewsScreen';
import AddReviewComment from '../reviews/AddReviewComment';
import SuccessAddReviewScreen from '../reviews/SuccessAddReviewScreen';
import AddReviewImages from '../reviews/AddReviewImages';
import * as Linking from 'expo-linking';
import FullRulesList from "./community/FullRulesList";
import DecentravellerRulesList from "./community/DecentravellerRulesList";

export type HomeStackScreens = {
    LeftSideBar: undefined;
    CreatePlaceNameScreen: undefined;
    CreatePlaceLocationScreen: undefined;
    PlaceDetailScreen: { id: number; name: string; address: string; score: number; reviewCount: number };
    PlaceReviewsScreen: { placeId: number };
    Profile: undefined;
    UserPlacesScreen: { walletId: string };
    UserReviewsScreen: { walletId: string };
    AddReviewImages: { placeId: number };
    AddReviewComment: { selectedImages: string[]; placeId: number };
    SuccessAddReviewScreen: undefined;
    UserProfileScreen: { walletId: string };
    DecentravellerRulesList: undefined;
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
                    name="PlaceReviewsScreen"
                    component={PlaceReviewsScreen}
                    options={{
                        title: 'Place reviews',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen name="Profile" component={MyProfileScreen} options={{ headerShown: true }} />
                <HomeStackNavigator.Screen
                    name="UserProfileScreen"
                    component={UserProfileScreen}
                    options={{
                        title: 'User',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="UserPlacesScreen"
                    component={UserPlacesScreen}
                    options={{
                        title: 'User places',
                        headerMode: 'screen',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="UserReviewsScreen"
                    component={UserReviewsScreen}
                    options={{
                        title: 'User Reviews',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="AddReviewImages"
                    component={AddReviewImages}
                    options={{
                        title: 'Add Review',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="AddReviewComment"
                    component={AddReviewComment}
                    options={{
                        title: 'Add Review',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="SuccessAddReviewScreen"
                    component={SuccessAddReviewScreen}
                    options={{
                        title: 'Thank you!',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="DecentravellerRulesList"
                    component={DecentravellerRulesList}
                    options={{
                        title: 'Rules list',
                        headerShown: true,
                    }}
                />
            </HomeStackNavigator.Navigator>
        </CreatePlaceProvider>
    );
};

export default HomeNavigator;
