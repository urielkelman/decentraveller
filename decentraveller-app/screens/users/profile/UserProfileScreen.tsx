import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {userProfileMainStyles} from "../../../styles/userProfileStyles";

export type UserProfileScreens = {
    UserProfileScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<UserProfileScreens>();

const UserProfileScreen = ({ navigation }) => {
    const onClickContinue = () => {
        navigation.navigate('UserProfileEditScreen');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFE1E1' }}>
            {/*RECUADRO DE USER*/}
            <View style={userProfileMainStyles.mainContainer}>
                <View style={userProfileMainStyles.imageContainer}>
                    <View style={userProfileMainStyles.imageCircle}>
                        <Image source={require('../../../assets/mock_images/cryptochica.png')} style={userProfileMainStyles.circleDimensions} />
                    </View>
                </View>
                <View style={userProfileMainStyles.titleContainer}>
                    <Text style={userProfileMainStyles.nicknameTitle}>ElUriK</Text>
                    <Text style={userProfileMainStyles.walletSubtitle}>0x3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5</Text>
                </View>
                <View style={userProfileMainStyles.joinedAtContainer}>
                    <Text style={userProfileMainStyles.joinedAtText}>Joined Decentraveller on: 10/05/2023</Text>
                </View>
            </View>

            <View style={userProfileMainStyles.informationContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 10 }}>
                    <Text style={userProfileMainStyles.leftText}>Main interest</Text>
                    <Text style={userProfileMainStyles.rightText}>Gastronomy</Text>
                </View>
                <View style={userProfileMainStyles.spacedBetweenView}>
                    <Text style={userProfileMainStyles.leftText}>Shared Location</Text>
                    <Text style={userProfileMainStyles.rightText}>Yes</Text>
                </View>
                <View style={userProfileMainStyles.spacedBetweenView}   >
                    <Text style={userProfileMainStyles.leftText}>DT Tokens</Text>
                    <Text style={userProfileMainStyles.rightText}>67 </Text>
                </View>
            </View>

            <View style={userProfileMainStyles.informationContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 40 }}   >
                    <Text style={userProfileMainStyles.leftText}>My Places(3)</Text>
                    <Text style={userProfileMainStyles.rightBlueText}>More </Text>
                </View>
            </View>


            <View style={userProfileMainStyles.informationContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 40 }}   >
                    <Text style={userProfileMainStyles.leftText}>My Reviews(5)</Text>
                    <Text style={userProfileMainStyles.rightBlueText}>More </Text>
                </View>
            </View>

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

