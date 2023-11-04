import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import {
    DecentravellerReviewsItems,
    LoadReviewResponse,
    ReviewShowProps,
} from '../../../commons/components/DecentravellerReviewsList';
import { ReviewsResponse } from '../../../api/response/reviews';
import { apiAdapter } from '../../../api/apiAdapter';

const adapter = apiAdapter;

const MyCensoredReviews = ({ navigation }) => {
    const { web3Provider, connectionContext } = useAppContext();

    const loadReviews = async (offset, limit): Promise<LoadReviewResponse> => {
        const reviewsResponse: ReviewsResponse =
            await adapter.getProfileCensoredReviews(connectionContext.connectedAddress, offset, limit);
        const avatarUrl = adapter.getProfileAvatarUrl(connectionContext.connectedAddress);
        const reviewsToShow: ReviewShowProps[] = reviewsResponse.reviews.map(function (r, i) {
            return {
                id: r.id,
                placeId: r.placeId,
                score: r.score,
                text: r.text,
                imageCount: r.imageCount,
                status: r.status,
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

export default MyCensoredReviews;
