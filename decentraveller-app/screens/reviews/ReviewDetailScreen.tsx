import { View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ReviewScreenProps } from './types';
import { apiAdapter } from '../../api/apiAdapter';
import LoadingComponent from '../../commons/components/DecentravellerLoading';
import { PlaceResponse } from '../../api/response/places';
import { PlaceShowProps } from '../../commons/components/DecentravellerPlacesList';
import { ReviewShowProps } from '../../commons/components/DecentravellerReviewsList';
import PlaceItem from '../home/place/PlaceItem';
import { reviewDetailStyles } from '../../styles/reviewDetailStyles';
import ReviewItem from './ReviewItem';
import { placeDetailStyles } from '../../styles/placeDetailStyles';
import ReviewImageContainer from './ReviewImageContainer';
import {useAppContext} from "../../context/AppContext";

const adapter = apiAdapter;

const ReviewDetailScreen: React.FC<ReviewScreenProps> = ({ route }) => {
    const { reviewId, placeId } = route.params;
    const [loading, setLoading] = React.useState<boolean>(true);
    const [review, setReview] = React.useState<ReviewShowProps>(null);
    const [place, setPlace] = React.useState<PlaceShowProps>(null);
    const { userRole} = useAppContext()

    const parsePlaceResponse = (placeResponse: PlaceResponse): PlaceShowProps => {
        return {
            id: placeResponse.id,
            name: placeResponse.name,
            address: placeResponse.address,
            latitude: placeResponse.latitude,
            longitude: placeResponse.longitude,
            score: placeResponse.score,
            category: placeResponse.category,
            reviewCount: placeResponse.reviews,
        };
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const placeData = await adapter.getPlace(placeId, () => {});
            const placeToShow = parsePlaceResponse(placeData);
            const reviewData = await adapter.getReview(placeId, reviewId, () => {});
            const avatarUrl = adapter.getProfileAvatarUrl(reviewData.owner.owner);
            const reviewToShow: ReviewShowProps = {
                id: reviewData.id,
                placeId: reviewData.placeId,
                score: reviewData.score,
                text: reviewData.text,
                imageCount: reviewData.imageCount,
                state: reviewData.state,
                ownerNickname: reviewData.owner.nickname,
                ownerWallet: reviewData.owner.owner,
                avatarUrl: avatarUrl,
                createdAt: reviewData.createdAt,
            };
            setPlace(placeToShow);
            setReview(reviewToShow);
            setLoading(false);
        })();
    }, []);

    const componentToRender = loading ? (
        <LoadingComponent />
    ) : (
        <View style={reviewDetailStyles.container}>
            <View style={reviewDetailStyles.placeDataContainer}>
                <Text style={reviewDetailStyles.title}>Review of:</Text>
                <PlaceItem
                    id={place.id}
                    name={place.name}
                    address={place.address}
                    latitude={place.latitude}
                    longitude={place.longitude}
                    score={place.score}
                    category={place.category}
                    reviewCount={place.reviewCount}
                    minified={true}
                />
            </View>
            <View style={reviewDetailStyles.reviewContainer}>
                <ReviewItem
                    id={review.id}
                    placeId={review.placeId}
                    score={review.score}
                    text={review.text}
                    imageCount={review.imageCount}
                    state={review.state}
                    ownerNickname={review.ownerNickname}
                    ownerWallet={review.ownerWallet}
                    avatarUrl={review.avatarUrl}
                    createdAt={review.createdAt}
                    summarized={false}
                />
            </View>
            <View style={reviewDetailStyles.optionsContainer}>
                <TouchableOpacity>
                    <View style={reviewDetailStyles.optionDenounce}>
                        <Text style={reviewDetailStyles.denounceIcon}>⚑ </Text>
                        <Text style={reviewDetailStyles.denounceText}>Report</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return componentToRender;
};

export default ReviewDetailScreen;
