import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { userProfileMainStyles } from '../../../styles/userProfileStyles';
import { apiAdapter } from '../../../api/apiAdapter';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { useNavigation } from '@react-navigation/native';
import { UserProfileScreenProps } from './types';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import { blockchainAdapter } from '../../../blockchain/blockhainAdapter';
import { useAppContext } from '../../../context/AppContext';

export type UserProfileScreens = {
    UserProfileScreen: undefined;
};

export type UserShowProps = {
    profileImageUrl: string;
    name: string;
    walletAddress: string;
    createdAt: string;
    interest: string;
    tokens: number;
};

const adapter = apiAdapter;
const contractAdapter = blockchainAdapter;

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ route }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<UserShowProps>(null);
    const { walletId } = route.params;
    const navigation = useNavigation<UserProfileScreenProps>();
    const [isOpen, setIsOpen] = useState(false);
    const { web3Provider } = useAppContext();

    const openGallery = () => setIsOpen(true);

    const closeGallery = () => setIsOpen(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const userData = await adapter.getUser(walletId, () => {});
            const user = {
                profileImageUrl: apiAdapter.getProfileAvatarUrl(walletId),
                name: userData.nickname,
                walletAddress: walletId,
                createdAt: userData.createdAt,
                interest: userData.interest,
                tokens: Number(await contractAdapter.getTokens(web3Provider, walletId)),
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
                            source={{
                                uri: user.profileImageUrl,
                            }}
                            style={userProfileMainStyles.circleDimensions}
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
            <ImageGallery
                close={closeGallery}
                isOpen={isOpen}
                images={[{ id: 1, url: user.profileImageUrl }]}
                hideThumbs={true}
            />
        </View>
    );
};

export default UserProfileScreen;
