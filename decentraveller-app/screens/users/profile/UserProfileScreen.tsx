import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { userProfileMainStyles } from '../../../styles/userProfileStyles';
import { useAppContext } from '../../../context/AppContext';

export type UserProfileScreens = {
    UserProfileScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<UserProfileScreens>();

const UserProfileScreen = ({ navigation }) => {
    const { userNickname, userWalletAddress, userCreatedAt, userInterest, userProfileImage } = useAppContext();

    const user = {
        profileImage: userProfileImage.profileImage,
        name: userNickname.nickname,
        walletAddress: '0x' + userWalletAddress.walletAddress,
        createdAt: userCreatedAt.createdAt,
        interest: userInterest.interest,
        tokens: 67,
        sharedLocation: 'Yes',
    };

    const onClickContinue = () => {
        navigation.navigate('UserProfileEditScreen');
    };

    return (
        <View style={userProfileMainStyles.background}>
            <View style={userProfileMainStyles.mainContainer}>
                <View style={userProfileMainStyles.imageContainer}>
                    <View style={userProfileMainStyles.imageCircle}>
                        <Image
                            source={{
                                uri: `data:image/jpeg;base64,${user.profileImage}`
                                }}
                            style={userProfileMainStyles.circleDimensions}
                        />
                    </View>
                </View>
                <View style={userProfileMainStyles.titleContainer}>
                    <Text style={userProfileMainStyles.nicknameTitle}>{user.name}</Text>
                    <Text style={userProfileMainStyles.walletSubtitle}>{user.walletAddress}</Text>
                </View>
                <View style={userProfileMainStyles.joinedAtContainer}>
                    <Text style={userProfileMainStyles.joinedAtText}>Joined Decentraveller on: {user.createdAt}</Text>
                </View>
            </View>

            <View style={userProfileMainStyles.informationContainer}>
                <View style={userProfileMainStyles.spacedBetweenView}>
                    <Text style={userProfileMainStyles.leftText}>Main interest</Text>
                    <Text style={userProfileMainStyles.rightText}>{user.interest}</Text>
                </View>
                <View style={userProfileMainStyles.spacedBetweenView}>
                    <Text style={userProfileMainStyles.leftText}>Shared Location</Text>
                    <Text style={userProfileMainStyles.rightText}>{user.sharedLocation}</Text>
                </View>
                <View style={userProfileMainStyles.spacedBetweenView}>
                    <Text style={userProfileMainStyles.leftText}>DT Tokens</Text>
                    <Text style={userProfileMainStyles.rightText}>{user.tokens}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('UserPlacesScreen')}>
                <View style={userProfileMainStyles.informationContainer}>
                    <View style={userProfileMainStyles.spacedButtonBetweenView}>
                        <Text style={userProfileMainStyles.leftText}>My Places</Text>
                        <Text style={userProfileMainStyles.rightBlueText}>More</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('UserReviewsScreen')}>
                <View style={userProfileMainStyles.informationContainer}>
                    <View style={userProfileMainStyles.spacedButtonBetweenView}>
                        <Text style={userProfileMainStyles.leftText}>My Reviews</Text>
                        <Text style={userProfileMainStyles.rightBlueText}>More </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const UserNavigator = () => {
    return (
        <HomeStackNavigator.Navigator initialRouteName="UserProfileScreen" screenOptions={{ headerShown: false }}>
            <HomeStackNavigator.Screen name="UserProfileScreen" component={UserProfileScreen} />
        </HomeStackNavigator.Navigator>
    );
};

export default UserNavigator;
