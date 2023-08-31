import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { placeReviewsBoxStyles } from '../../../styles/placeDetailStyles';
import { ReviewResponse, ReviewsResponse } from '../../../api/response/reviews';
import { renderReviewItem, ReviewShowProps } from '../../../commons/components/DecentravellerReviewsList';
import { useNavigation } from '@react-navigation/native';
import { apiAdapter } from '../../../api/apiAdapter';
import ReviewItem, { ReviewItemProps } from '../../reviews/ReviewItem';

const adapter = apiAdapter;

const UserReviewsBox = ({ walletId }) => {
    const [loadingReviews, setLoadingReviews] = React.useState<boolean>(false);
    const [reviews, setReviews] = React.useState<ReviewShowProps[]>(null);
    const [reviewCount, setReviewsCount] = React.useState<number>(0);

    useEffect(() => {
        (async () => {
            setLoadingReviews(true);
            const reviewsResponse: ReviewsResponse = await adapter.getProfileReviews(walletId, 0, 5);
            const avatar = await adapter.getUserProfileImage(walletId, () => {});
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
                    avatarBase64: avatar,
                    createdAt: r.createdAt,
                };
            });
            setReviews(reviewsToShow);
            setReviewsCount(reviewsResponse.total);
            setLoadingReviews(false);
        })();
    }, [walletId]);

    const hasReviews = () => {
        return reviews != null && reviews.length > 0;
    };

    const loadingReviewsComponent = () => (
        <View
            style={[
                placeReviewsBoxStyles.container,
                {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                },
            ]}
        >
            <View style={placeReviewsBoxStyles.reviewsHeader}>
                <View style={placeReviewsBoxStyles.titleContainer}>
                    <Text style={placeReviewsBoxStyles.titleText}>Reviews</Text>
                </View>
                <ActivityIndicator size={'large'} />
            </View>
        </View>
    );

    const headerComponent = () => {
        return (
            <View style={placeReviewsBoxStyles.reviewsHeader}>
                <View style={placeReviewsBoxStyles.titleContainer}>
                    <Text style={placeReviewsBoxStyles.titleText}>Reviews ({reviewCount})</Text>
                </View>
            </View>
        );
    };

    const loadMoreReviews = async () => {
        if (hasReviews() && reviewCount > reviews.length) {
            setLoadingReviews(true);
            const reviewsResponse: ReviewsResponse = await adapter.getPlaceReviews(
                walletId,
                (reviews.length / 5) | 0,
                5
            );
            const avatars = await Promise.all(
                reviewsResponse.reviews.map(async (r: ReviewResponse) => {
                    return await adapter.getUserProfileImage(r.owner.owner, () => {});
                })
            );
            const reviewsToShow: ReviewItemProps[] = reviewsResponse.reviews.map(function (r, i) {
                return {
                    id: r.id,
                    placeId: r.placeId,
                    score: r.score,
                    text: r.text,
                    imageCount: r.imageCount,
                    state: r.state,
                    ownerNickname: r.owner.nickname,
                    ownerWallet: r.owner.owner,
                    avatarBase64: avatars[i],
                    createdAt: r.createdAt,
                    summarized: false,
                };
            });
            reviews.push.apply(reviews, reviewsToShow);
            setLoadingReviews(false);
        }
    };

    const footerComponent = () => {
        return (
            <View style={placeReviewsBoxStyles.reviewsFooter}>
                {!hasReviews() ? <Text>Be the first to review!</Text> : null}
                {hasReviews() && reviewCount > reviews.length ? <ActivityIndicator size={'large'} /> : null}
            </View>
        );
    };

    const reviewsBoxComponent = () => {
        const internalRenderReviewItem = ({ item }: { item: ReviewShowProps }) =>
            renderReviewItem({ item: item, summarized: false });

        return (
            <FlatList
                data={reviews}
                onEndReached={loadMoreReviews}
                onEndReachedThreshold={0.1}
                style={[
                    placeReviewsBoxStyles.container,
                    {
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                    },
                ]}
                ListHeaderComponent={headerComponent}
                stickyHeaderIndices={[0]}
                ListFooterComponent={footerComponent}
                renderItem={internalRenderReviewItem}
                scrollEnabled={true}
            ></FlatList>
        );
    };

    const componentToRender = loadingReviews && !hasReviews() ? loadingReviewsComponent() : reviewsBoxComponent();

    return componentToRender;
};
export default UserReviewsBox;
