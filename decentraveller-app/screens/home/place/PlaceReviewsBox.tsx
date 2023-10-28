import React, {useCallback} from 'react';
import {ActivityIndicator, FlatList, Text, TouchableOpacity, View} from 'react-native';
import {placeReviewsBoxStyles} from '../../../styles/placeDetailStyles';
import {ReviewResponse, ReviewsResponse} from '../../../api/response/reviews';
import {renderReviewItem} from '../../../commons/components/DecentravellerReviewsList';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AddReviewImagesScreenProp} from './types';
import {apiAdapter} from '../../../api/apiAdapter';
import {ReviewItemProps} from '../../reviews/ReviewItem';
import {moderationService} from "../../../blockchain/service/moderationService";
import {useAppContext} from "../../../context/AppContext";
import {BlockchainReviewStatus} from "../../../blockchain/types";

const adapter = apiAdapter;

const PlaceReviewsBox = ({ placeId, summarized }) => {
    const navigation = useNavigation<AddReviewImagesScreenProp>();
    const { web3Provider, connectionContext } = useAppContext()
    const { connectedAddress } = connectionContext
    const [loadingReviews, setLoadingReviews] = React.useState<boolean>(false);
    const [reviews, setReviews] = React.useState<ReviewItemProps[]>(null);
    const [reviewCount, setReviewsCount] = React.useState<number>(0);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setLoadingReviews(true);
                const reviewsResponse: ReviewsResponse = await adapter.getPlaceReviews(placeId, 0, 5);
                const reviewsToShow = await mapReviews(reviewsResponse.reviews)
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

    const mapReviews = async (reviews: ReviewResponse[]): Promise<ReviewItemProps[]> => {
        const avatarUrls = reviews.map((r: ReviewResponse) => {
            return adapter.getProfileAvatarUrl(r.owner.owner);
        });

        const reviewStatusPromises = reviews.map(async (r, i) => {
            const address = await moderationService.getReviewAddress(web3Provider, r.placeId, r.id);
            const status = await moderationService.getReviewCensorStatus(web3Provider, address);

            return {
                id: r.id,
                placeId: r.placeId,
                score: r.score,
                text: r.text,
                imageCount: r.imageCount,
                state: r.state,
                ownerNickname: r.owner.nickname,
                ownerWallet: r.owner.owner,
                avatarUrl: avatarUrls[i],
                createdAt: r.createdAt,
                censorStatus: status,
                summarized: summarized,
            };
        });

        const reviewStatusResults: ReviewItemProps[] = await Promise.all(reviewStatusPromises);

        return  reviewStatusResults.filter((r) => (shouldReviewVisible(r)));

    }

    const shouldReviewVisible = (review: ReviewItemProps) => {
        return (review.censorStatus !== BlockchainReviewStatus.MODERATOR_WON && (
            [
                BlockchainReviewStatus.PUBLIC,
                BlockchainReviewStatus.ON_DISPUTE,
                BlockchainReviewStatus.UNCENSORED_BY_DISPUTE
            ].includes(review.censorStatus)) ||
            (review.ownerWallet === connectedAddress))
    }
    const loadMoreReviews = async () => {
        if (!summarized && hasReviews() && reviewCount > reviews.length) {
            setLoadingReviews(true);
            const reviewsResponse: ReviewsResponse = await adapter.getPlaceReviews(
                placeId,
                (reviews.length / 5) | 0,
                5,
            );
            const reviewsToShow = await mapReviews(reviewsResponse.reviews)
            reviews.push.apply(reviews, reviewsToShow);
            setLoadingReviews(false);
        }
    };

    const footerComponent = () => {
        return (
            <View>
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
                keyExtractor={(item, index) => String(index)}
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
