import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { placeReviewsBoxStyles } from '../../../styles/placeDetailStyles';
import { ReviewResponse, ReviewsResponse } from '../../../api/response/reviews';
import {
    DecentravellerReviewsItems,
    LoadReviewResponse,
    ReviewShowProps,
} from '../../../commons/components/DecentravellerReviewsList';
import { useNavigation } from '@react-navigation/native';
import { apiAdapter } from '../../../api/apiAdapter';
import ReviewItem, { ReviewItemProps } from '../../reviews/ReviewItem';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';

const adapter = apiAdapter;

const UserReviewsBox = ({ walletId }) => {
    const loadReviews = async (offset, limit): Promise<LoadReviewResponse> => {
        const reviewsResponse: ReviewsResponse = await adapter.getProfileReviews(walletId, offset, limit);
        const avatarUrl = await adapter.getProfileAvatarUrl(walletId);
        const reviewsToShow: ReviewShowProps[] = reviewsResponse.reviews.map(function (r, i) {
            return {
                id: r.id,
                placeId: r.placeId,
                score: r.score,
                text: r.text,
                imageCount: r.imageCount,
                state: r.state,
                ownerNickname: r.owner.nickname,
                ownerWallet: r.owner.owner,
                avatarUrl: avatarUrl,
                createdAt: r.createdAt,
            };
        });
        return { total: reviewsResponse.total, reviewsToShow: reviewsToShow };
    };

    return <DecentravellerReviewsItems loadReviews={loadReviews} summarized={false} />;
};
export default UserReviewsBox;
