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
import ReviewDetailScreen from '../reviews/ReviewDetailScreen';
import DecentravellerRulesList from './community/DecentravellerRulesList';
import { Rule } from './community/types';
import RuleDetailScreen from './community/RuleDetailScreen';
import ProposeRuleScreen from './community/ProposeRuleScreen';
import VotingResultsScreen from './community/VotingResultsScreen';
import { RuleResponse } from '../../api/response/rules';
import RulesScreen from './community/RulesScreen';
import { BlockchainProposalStatus } from '../../blockchain/types';

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
    ReviewDetailScreen: { reviewId: number; placeId: number };
    RulesScreen: undefined;
    DecentravellerRulesList: { ruleList: RuleResponse[]; minified: boolean; horizontal: boolean };
    RuleDetailScreen: { ruleId: number; blockchainStatus: BlockchainProposalStatus; rule?: Rule };
    ProposeRuleScreen: undefined;
    VotingResultsScreen: { rule: Rule };
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
                    name="ReviewDetailScreen"
                    component={ReviewDetailScreen}
                    options={{
                        title: 'Review',
                        headerShown: true,
                    }}
                />
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
                    name="RulesScreen"
                    component={RulesScreen}
                    options={{
                        title: 'Rules screen',
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
                <HomeStackNavigator.Screen
                    name="RuleDetailScreen"
                    component={RuleDetailScreen}
                    options={{
                        title: 'Rule',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="ProposeRuleScreen"
                    component={ProposeRuleScreen}
                    options={{
                        title: 'Propose rule',
                        headerShown: true,
                    }}
                />
                <HomeStackNavigator.Screen
                    name="VotingResultsScreen"
                    component={VotingResultsScreen}
                    options={{
                        title: 'Voting results',
                        headerShown: true,
                    }}
                />
            </HomeStackNavigator.Navigator>
        </CreatePlaceProvider>
    );
};

export default HomeNavigator;
