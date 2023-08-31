import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { placeReviewsBoxStyles } from '../../styles/placeDetailStyles';
import StarComponent from '../../commons/components/StarComponent';
import { ReviewShowProps } from '../../commons/components/DecentravellerReviewsList';
import { PlaceDetailScreenProp } from '../home/place/types';
import { UserProfileScreenProps } from '../users/profile/types';

export type ReviewItemProps = ReviewShowProps & {
    summarized: boolean;
};

const ReviewItem: React.FC<ReviewItemProps> = ({
    id,
    placeId,
    score,
    text,
    imageCount,
    state,
    ownerNickname,
    ownerWallet,
    avatarBase64,
    createdAt,
    summarized,
}) => {
    const [showMore, setshowMore] = React.useState<boolean>(!summarized);
    const navigation = useNavigation<UserProfileScreenProps>();

    const onPress = () => {
        setshowMore(true);
    };

    const showCreatedAt = (createdAt) => {
        return createdAt.split('T')[0];
    };

    return (
        <TouchableOpacity style={placeReviewsBoxStyles.reviewItem} onPress={onPress}>
            <View style={placeReviewsBoxStyles.reviewHeader}>
                <View style={placeReviewsBoxStyles.dataContainer}>
                    <Text style={placeReviewsBoxStyles.dateText}>{showCreatedAt(createdAt)}</Text>
                    <StarComponent score={score} />
                </View>
                <TouchableOpacity
                    style={placeReviewsBoxStyles.userContainer}
                    onPress={() => navigation.navigate('UserProfileScreen', { walletId: ownerWallet })}
                >
                    <Image
                        source={{
                            uri: `data:image/jpeg;base64,${avatarBase64}`,
                        }}
                        style={placeReviewsBoxStyles.avatarImage}
                    />
                    <Text style={placeReviewsBoxStyles.userNameText}>{ownerNickname}</Text>
                </TouchableOpacity>
            </View>
            <View style={placeReviewsBoxStyles.commentContainer}>
                <Text
                    style={placeReviewsBoxStyles.commentText}
                    numberOfLines={showMore ? null : 3}
                    ellipsizeMode="tail"
                >
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ReviewItem;
