import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { userProfileMainStyles } from '../../../styles/userProfileStyles';
import { useAppContext } from '../../../context/AppContext';
import { addReviewImagesStyles } from '../../../styles/addReviewStyles';
import * as ImagePicker from 'expo-image-picker';
import { apiAdapter } from '../../../api/apiAdapter';
import { PlaceResponse } from '../../../api/response/places';
import { DecentravellerPlacesList, PlaceShowProps } from '../../../commons/components/DecentravellerPlacesList';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { useNavigation } from '@react-navigation/native';
import { PlaceDetailScreenProp, PlaceDetailScreenProps } from '../../home/place/types';
import { UserProfileScreenProps } from './types';

export type UserProfileScreens = {
    UserProfileScreen: undefined;
};

export type UserShowProps = {
    profileImage: string;
    name: string;
    walletAddress: string;
    createdAt: string;
    interest: string;
    sharedLocation: string;
    tokens: number;
};

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ route }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<UserShowProps>(null);
    const { walletId } = route.params;
    const navigation = useNavigation<UserProfileScreenProps>();

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const userData = await apiAdapter.getUser(walletId, () => {});
            const user = {
                profileImage: await apiAdapter.getUserProfileImage(walletId, () => {}),
                name: userData.nickname,
                walletAddress: walletId,
                createdAt: userData.createdAt,
                interest: userData.interest,
                sharedLocation: 'Yes',
                tokens: 67,
            };
            setUser(user);
            setLoading(false);
        })();
    }, []);

    const componentToRender = loading ? (
        <LoadingComponent />
    ) : (
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

            <TouchableOpacity onPress={() => navigation.navigate('UserPlacesScreen', { walletId: user.walletAddress })}>
                <View style={userProfileMainStyles.informationContainer}>
                    <View style={userProfileMainStyles.spacedButtonBetweenView}>
                        <Text style={userProfileMainStyles.leftText}>Places</Text>
                        <Text style={userProfileMainStyles.rightBlueText}>More</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('UserReviewsScreen', { walletId: user.walletAddress })}
            >
                <View style={userProfileMainStyles.informationContainer}>
                    <View style={userProfileMainStyles.spacedButtonBetweenView}>
                        <Text style={userProfileMainStyles.leftText}>Reviews</Text>
                        <Text style={userProfileMainStyles.rightBlueText}>More </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return componentToRender;
};

export default UserProfileScreen;
