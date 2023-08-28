import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { placeReviewsBoxStyles } from '../../styles/placeDetailStyles';
import StarComponent from '../../commons/components/StarComponent';
import { ReviewShowProps } from '../../commons/components/DecentravellerReviewsList';

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
    avatarBase64,
    createdAt,
    summarized,
}) => {
    const lines = summarized ? 3 : undefined;

    return (
        <TouchableOpacity style={placeReviewsBoxStyles.reviewItem}>
            <View style={placeReviewsBoxStyles.reviewHeader}>
                <View style={placeReviewsBoxStyles.dataContainer}>
                    <Text style={placeReviewsBoxStyles.dateText}>{createdAt}</Text>
                    <StarComponent score={score} />
                </View>
                <View style={placeReviewsBoxStyles.userContainer}>
                    <Image
                        source={{
                            uri: `data:image/jpeg;base64,${avatarBase64}`,
                        }}
                        style={placeReviewsBoxStyles.avatarImage}
                    />
                    <Text style={placeReviewsBoxStyles.userNameText}>{ownerNickname}</Text>
                </View>
            </View>
            <View style={placeReviewsBoxStyles.commentContainer}>
                <Text style={placeReviewsBoxStyles.commentText} numberOfLines={lines} ellipsizeMode="tail">
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ReviewItem;
