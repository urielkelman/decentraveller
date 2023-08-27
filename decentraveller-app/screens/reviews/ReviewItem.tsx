import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { placeReviewsBoxStyles } from '../../styles/placeDetailStyles';

export type ReviewItemProps = {
    id: number;
    placeId: number;
    score: number;
    text: string;
    imageCount: number;
    state: string;
    ownerNickname: string;
    createdAt: string;
};

const ReviewItem: React.FC<ReviewItemProps> = ({
    id,
    placeId,
    score,
    text,
    imageCount,
    state,
    ownerNickname,
    createdAt,
}) => {
    return (
        <View style={placeReviewsBoxStyles.reviewItem}>
            <View style={placeReviewsBoxStyles.commentContainer}>
                <Text style={placeReviewsBoxStyles.commentText}>
                    {text} - <Text style={placeReviewsBoxStyles.dateText}>{createdAt}</Text>
                </Text>
                <View style={placeReviewsBoxStyles.userContainer}>
                    <Image
                        source={require('../../assets/mock_images/cryptochica.png')}
                        style={placeReviewsBoxStyles.avatarImage}
                    />
                    <Text style={placeReviewsBoxStyles.userNameText}>{ownerNickname}</Text>
                </View>
            </View>
        </View>
    );
};

export default ReviewItem;
