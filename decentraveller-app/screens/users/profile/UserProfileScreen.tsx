import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { userProfileMainStyles } from '../../../styles/userProfileStyles';
import { useAppContext } from '../../../context/AppContext';
import { addReviewImagesStyles } from '../../../styles/addReviewStyles';
import * as ImagePicker from 'expo-image-picker';
import { apiAdapter } from '../../../api/apiAdapter';

export type UserProfileScreens = {
    UserProfileScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<UserProfileScreens>();

const UserProfileScreen = ({ navigation }) => {
    const { userNickname, connectionContext, userCreatedAt, userInterest, userProfileImage } = useAppContext();

    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleImageUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                try {
                    //await apiAdapter.sendProfileImage(user.walletAddress, imageUri);
                    await apiAdapter.getUserProfileImage(user.walletAddress, ()=> {} )
                    console.log('Avatar success updated.');
                } catch (error) {
                    console.error('Error on avatar updating:', error);
                }
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const user = {
        profileImage: userProfileImage.value,
        name: userNickname.value,
        walletAddress: connectionContext.connectedAddress,
        createdAt: userCreatedAt.value,
        interest: userInterest.value,
        tokens: 67,
        sharedLocation: 'Yes',
    };

    return (
        <View style={userProfileMainStyles.background}>
            <View style={userProfileMainStyles.mainContainer}>
                <View style={userProfileMainStyles.imageContainer}>
                    <View style={userProfileMainStyles.imageCircle}>
                        <Image
                            source={{
                                uri: `data:image/jpeg;base64,${user.profileImage}`,
                            }}
                            style={userProfileMainStyles.circleDimensions}
                        />
                    </View>
                    <TouchableOpacity style={userProfileMainStyles.smallCircleButton} onPress={toggleModal}>
                        <Image
                            source={require('../../../assets/images/pencil.png')}
                            style={userProfileMainStyles.smallCircleImage}
                        />
                    </TouchableOpacity>
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
            <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
                <View style={userProfileMainStyles.modalContainer}>
                    <View style={userProfileMainStyles.modalContent}>
                        <TouchableOpacity onPress={handleImageUpload}>
                            <Text style={userProfileMainStyles.modalOption}>Select Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal}>
                            <Text style={userProfileMainStyles.modalOption}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
