import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { placeReviewsBoxStyles } from '../../../styles/placeDetailStyles';
import { ReviewResponse, ReviewsResponse } from '../../../api/response/reviews';
import DecentravellerReviewsList from '../../../commons/components/DecentravellerReviewsList';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { HomeStackScreens } from '../HomeNavigator';
import { AddReviewImagesScreenProp } from './types';
import { apiAdapter } from '../../../api/apiAdapter';

const adapter = apiAdapter;

const PlaceReviewsBox = ({ placeId }) => {
    const navigation = useNavigation<AddReviewImagesScreenProp>();
    const [loadingReviews, setLoadingReviews] = React.useState<boolean>(false);
    const [reviews, setReviews] = React.useState<ReviewResponse[]>(null);

    useEffect(() => {
        (async () => {
            setLoadingReviews(true);
            const reviewsResponse: ReviewsResponse = await adapter.getPlaceReviews(placeId);
            setReviews(reviewsResponse.reviews);
            setLoadingReviews(false);
        })();
    }, [placeId]);

    const hasReviews = () => {
        return reviews !== null && reviews.length > 0;
    };

    const onPress = () => {
        navigation.navigate('AddReviewImages', { placeId });
    };

    const loadingReviewsComponent = () => (
        <View>
            <Text>Loading</Text>
        </View>
    );

    const reviewsBoxComponent = () => {
        return (
            <TouchableOpacity style={placeReviewsBoxStyles.container} onPress={() => {}}>
                <View style={placeReviewsBoxStyles.titleContainer}>
                    <Text style={placeReviewsBoxStyles.titleText}>Reviews</Text>
                    <Text style={placeReviewsBoxStyles.moreText}>More</Text>
                </View>
                <View style={placeReviewsBoxStyles.reviewItem}></View>

                <TouchableOpacity style={placeReviewsBoxStyles.button} onPress={onPress}>
                    <View style={placeReviewsBoxStyles.buttonTextView}>
                        {<Text style={placeReviewsBoxStyles.text}>{'Add review'}</Text>}
                    </View>
                </TouchableOpacity>

                {hasReviews() ? <DecentravellerReviewsList reviews={reviews} /> : null}
                {!hasReviews() ? (
                    <View style={placeReviewsBoxStyles.reviewItem}>
                        <View style={placeReviewsBoxStyles.commentContainer}>
                            <Text style={placeReviewsBoxStyles.commentText}>Be the first to comment</Text>
                        </View>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    };

    const componentToRender = loadingReviews ? loadingReviewsComponent() : reviewsBoxComponent();

    return componentToRender;
};
export default PlaceReviewsBox;
