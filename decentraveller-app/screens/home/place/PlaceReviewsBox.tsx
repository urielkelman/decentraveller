import React, { useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { placeReviewsBoxStyles } from '../../../styles/placeDetailStyles';
import { ReviewResponse, ReviewsResponse } from '../../../api/response/reviews';
import { renderReviewItem } from '../../../commons/components/DecentravellerReviewsList';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AddReviewImagesScreenProp } from './types';
import { apiAdapter } from '../../../api/apiAdapter';
import ReviewItem, { ReviewItemProps } from '../../reviews/ReviewItem';

const adapter = apiAdapter;

const PlaceReviewsBox = ({ placeId, summarized }) => {
    const navigation = useNavigation<AddReviewImagesScreenProp>();
    const [loadingReviews, setLoadingReviews] = React.useState<boolean>(false);
    const [reviews, setReviews] = React.useState<ReviewItemProps[]>(null);
    const [reviewCount, setReviewsCount] = React.useState<number>(0);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setLoadingReviews(true);
                const reviewsResponse: ReviewsResponse = await adapter.getPlaceReviews(placeId, 0, 5);
                const avatars = await Promise.all(
                    reviewsResponse.reviews.map(async (r: ReviewResponse) => {
                        return await adapter.getUserProfileImage(r.owner.owner, () => {});
                    }),
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
                        summarized: summarized,
                    };
                });
                setReviews(reviewsToShow);
                setReviewsCount(reviewsResponse.total);
                setLoadingReviews(false);
            })();
        }, [placeId]),
    );

    const hasReviews = () => {
        return reviews != null && reviews.length > 0;
    };

    const onPressAddReview = () => {
        navigation.navigate('AddReviewImages', { placeId });
    };

    const onPressMoreReviews = () => {
        navigation.navigate('PlaceReviewsScreen', { placeId });
    };

    const loadingReviewsComponent = () => (
        <View
            style={[
                placeReviewsBoxStyles.container,
                !summarized && {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                },
            ]}
        >
            <View style={placeReviewsBoxStyles.reviewsHeader}>
                <View style={placeReviewsBoxStyles.titleContainer}>
                    <Text style={placeReviewsBoxStyles.titleText}>Reviews</Text>
                </View>
                {summarized ? (
                    <TouchableOpacity style={placeReviewsBoxStyles.button} onPress={onPressAddReview}>
                        <View style={placeReviewsBoxStyles.buttonTextView}>
                            {<Text style={placeReviewsBoxStyles.text}>{'Add review'}</Text>}
                        </View>
                    </TouchableOpacity>
                ) : null}
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
                {summarized ? (
                    <TouchableOpacity style={placeReviewsBoxStyles.button} onPress={onPressAddReview}>
                        <View style={placeReviewsBoxStyles.buttonTextView}>
                            {<Text style={placeReviewsBoxStyles.text}>{'Add review'}</Text>}
                        </View>
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    const loadMoreReviews = async () => {
        if (!summarized && hasReviews() && reviewCount > reviews.length) {
            setLoadingReviews(true);
            const reviewsResponse: ReviewsResponse = await adapter.getPlaceReviews(
                placeId,
                (reviews.length / 5) | 0,
                5,
            );
            const avatars = await Promise.all(
                reviewsResponse.reviews.map(async (r: ReviewResponse) => {
                    return await adapter.getUserProfileImage(r.owner.owner, () => {});
                }),
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
                    summarized: summarized,
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
                {summarized && reviewCount > 5 ? (
                    <TouchableOpacity onPress={onPressMoreReviews}>
                        <Text style={placeReviewsBoxStyles.moreText}>More</Text>
                    </TouchableOpacity>
                ) : null}
                {!summarized && hasReviews() && reviewCount > reviews.length ? (
                    <ActivityIndicator size={'large'} />
                ) : null}
            </View>
        );
    };

    const reviewsBoxComponent = () => {
        const internalRenderReviewItem = ({ item }: { item: ReviewItemProps }) =>
            renderReviewItem({ item: item, summarized: summarized });

        return (
            <FlatList
                data={reviews}
                onEndReached={loadMoreReviews}
                onEndReachedThreshold={0.1}
                style={[
                    placeReviewsBoxStyles.container,
                    !summarized && {
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
export default PlaceReviewsBox;
