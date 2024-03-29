import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { userProfileMainStyles } from '../../../styles/userProfileStyles';
import { useAppContext } from '../../../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import { apiAdapter } from '../../../api/apiAdapter';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import { UserShowProps } from './UserProfileScreen';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { blockchainAdapter } from '../../../blockchain/blockhainAdapter';
import { UserRole } from './types';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';

export type UserProfileScreens = {
    UserProfileScreen: undefined;
};

const HomeStackNavigator = createStackNavigator<UserProfileScreens>();

const adapter = apiAdapter;
const contractAdapter = blockchainAdapter;

const MyProfileScreen = ({ navigation }) => {
    const { userNickname, connectionContext, userCreatedAt, userInterest, userRole } = useAppContext();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [moderatorCost, setModeratorCost] = React.useState<number>(0);
    const [user, setUser] = React.useState<UserShowProps>(null);
    const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
    const { web3Provider } = useAppContext();

    const openGallery = () => setIsOpen(true);
    const closeGallery = () => setIsOpen(false);

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
                    await apiAdapter.sendProfileImage(user.walletAddress, imageUri);
                    setIsModalVisible(!isModalVisible);
                } catch (error) {
                    console.error('Error on avatar updating:', error);
                }
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const makeModerator = async () => {
        const transactionHash = await contractAdapter.promoteToModerator(web3Provider, () => {});
        if (!transactionHash) {
            setShowErrorModal(true);
            return;
        }
        setLoading(true);
        await loadUserData();
        userRole.setValue(UserRole.MODERATOR);
        setLoading(false);
    };

    const loadUserData = async () => {
        const userData = await adapter.getUser(connectionContext.connectedAddress, () => {});
        userNickname.setValue(userData.nickname);
        userCreatedAt.setValue(userData.createdAt);
        userInterest.setValue(userData.interest);
        const user = {
            name: userData.nickname,
            walletAddress: connectionContext.connectedAddress,
            createdAt: userData.createdAt,
            interest: userData.interest,
            tokens: Number(await contractAdapter.getTokens(web3Provider, connectionContext.connectedAddress)),
            profileImageUrl: apiAdapter.getProfileAvatarUrl(connectionContext.connectedAddress, true),
            role: userData.role,
        };
        setUser(user);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            setModeratorCost(await contractAdapter.getModeratorCost(web3Provider));
            if (userNickname.value == '') {
                await loadUserData();
                setLoading(false);
                return;
            }
            const user = {
                name: userNickname.value,
                walletAddress: connectionContext.connectedAddress,
                createdAt: userCreatedAt.value,
                interest: userInterest.value,
                tokens: Number(await contractAdapter.getTokens(web3Provider, connectionContext.connectedAddress)),
                profileImageUrl: apiAdapter.getProfileAvatarUrl(connectionContext.connectedAddress, true),
                role: userRole.value,
            };
            setUser(user);
            setLoading(false);
        })();
    }, []);

    return loading ? (
        <LoadingComponent />
    ) : (
        <View style={userProfileMainStyles.background}>
            <View style={userProfileMainStyles.mainContainer}>
                <View style={userProfileMainStyles.imageContainer}>
                    <TouchableOpacity style={userProfileMainStyles.imageCircle} onPress={openGallery}>
                        <Image
                            key={Date.now()}
                            source={{
                                uri: user.profileImageUrl,
                            }}
                            style={userProfileMainStyles.circleDimensions}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={userProfileMainStyles.smallCircleButton} onPress={toggleModal}>
                        <Image
                            source={require('../../../assets/images/pencil.png')}
                            style={userProfileMainStyles.smallCircleImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={userProfileMainStyles.titleContainer}>
                    <Text style={userProfileMainStyles.nicknameTitle}>{user.name}</Text>
                    {user.role == UserRole.MODERATOR ? (
                        <Text style={userProfileMainStyles.moderatorBadge}>🛡️ Moderator</Text>
                    ) : null}
                    <Text style={userProfileMainStyles.walletSubtitle}>{user.walletAddress}</Text>
                </View>
                <View style={userProfileMainStyles.joinedAtContainer}>
                    <Text style={userProfileMainStyles.joinedAtText}>Joined Decentraveller on: {user.createdAt}</Text>
                </View>
                {user.role != UserRole.MODERATOR && user.tokens >= moderatorCost ? (
                    <DecentravellerButton
                        text={`Convert to moderator (${moderatorCost} DT)`}
                        onPress={makeModerator}
                        loading={false}
                        style={userProfileMainStyles.moderatorButton}
                    />
                ) : null}
            </View>

            <View style={userProfileMainStyles.informationContainer}>
                <View style={userProfileMainStyles.spacedBetweenView}>
                    <Text style={userProfileMainStyles.leftText}>Main interest</Text>
                    <Text style={userProfileMainStyles.rightText}>{user.interest}</Text>
                </View>
                <View style={userProfileMainStyles.spacedBetweenView}>
                    <Text style={userProfileMainStyles.leftText}>DT Tokens</Text>
                    <Text style={userProfileMainStyles.rightText}>{user.tokens}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('UserPlacesScreen', { walletId: user.walletAddress })}>
                <View style={userProfileMainStyles.informationContainer}>
                    <View style={userProfileMainStyles.spacedButtonBetweenView}>
                        <Text style={userProfileMainStyles.leftText}>My Places</Text>
                        <Text style={userProfileMainStyles.rightBlueText}>More</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('UserReviewsScreen', { walletId: user.walletAddress })}
            >
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
            <ImageGallery
                close={closeGallery}
                isOpen={isOpen}
                images={[{ id: 1, url: user.profileImageUrl }]}
                hideThumbs={true}
            />
            <DecentravellerInformativeModal
                informativeText={'Unexpected error'}
                visible={showErrorModal}
                closeModalText={'Go back'}
                handleCloseModal={() => setShowErrorModal(false)}
            />
        </View>
    );
};

const UserNavigator = () => {
    return (
        <HomeStackNavigator.Navigator initialRouteName="UserProfileScreen" screenOptions={{ headerShown: false }}>
            <HomeStackNavigator.Screen name="UserProfileScreen" component={MyProfileScreen} />
        </HomeStackNavigator.Navigator>
    );
};

export default UserNavigator;
