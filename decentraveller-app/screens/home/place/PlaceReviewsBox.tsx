import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {placeReviewsBoxStyles} from "../../../styles/placeDetailStyles";
import {ReviewResponse, ReviewsResponse} from "../../../api/response/reviews";
import {mockApiAdapter} from "../../../api/mockApiAdapter";

const adapter = mockApiAdapter

const PlaceReviewsBox = ({placeId}) => {
    const [loadingReviews, setLoadingReviews] = React.useState<boolean>(false);
    const [firstReview, setFirstReview] = React.useState<ReviewResponse>(null);
    const [secondReview, setSecondReview] = React.useState<ReviewResponse>(null);

    useEffect(() => {
        (async () => {
            setLoadingReviews(true);
            const reviewsResponse: ReviewsResponse = await adapter.getPlaceReviews(
                // appContext.connectionContext.connectedAddress
                placeId
            );
            setLoadingReviews(false);
            setReviews(reviewsResponse.results)
        })();
    }, [placeId]);

    const hasOneReview = () => {
        return firstReview !== null
    };

    const hasTwoReviews = () => {
        return secondReview !== null;
    };

    const setReviews = (reviews: ReviewResponse[]) => {
        if (reviews.length === 0) {
            return;
        }

        setFirstReview(reviews[0]);
        if (reviews.length >= 2) {
            setSecondReview(reviews[1]);
        }
    };

    const loadingReviewsComponent = () => (
        <View>
            <Text>Loading</Text>
        </View>
    );

    const reviewsBoxComponent = () => {
        return <TouchableOpacity style={placeReviewsBoxStyles.container} onPress={() => {}}>
            <View style={placeReviewsBoxStyles.titleContainer}>
                <Text style={placeReviewsBoxStyles.titleText}>Reviews</Text>
                <Text style={placeReviewsBoxStyles.moreText}>More</Text>
            </View>
            <View style={placeReviewsBoxStyles.reviewItem}></View>

            {hasOneReview() ? (
                <View style={placeReviewsBoxStyles.reviewItem}>
                    <View style={placeReviewsBoxStyles.commentContainer}>
                        <Text style={placeReviewsBoxStyles.commentText}>
                            {firstReview.text} - {' '}
                            <Text style={placeReviewsBoxStyles.dateText}>{"10/02/2023"}</Text>
                        </Text>
                        <View style={placeReviewsBoxStyles.userContainer}>
                            <Image
                                source={require('../../../assets/mock_images/cryptochica.png')}
                                style={placeReviewsBoxStyles.avatarImage}
                            />
                            <Text style={placeReviewsBoxStyles.userNameText}>{firstReview.owner}</Text>
                        </View>
                    </View>
                </View>
            ) : null}
            {hasTwoReviews() ? (
                <View style={placeReviewsBoxStyles.reviewItem}>
                    <View style={placeReviewsBoxStyles.commentContainer}>
                        <Text style={placeReviewsBoxStyles.commentText}>
                            {secondReview.text} - {' '}
                            <Text style={placeReviewsBoxStyles.dateText}>{"03/01/2023"}</Text>
                        </Text>
                        <View style={placeReviewsBoxStyles.userContainer}>
                            <Image
                                source={require('../../../assets/mock_images/cryptochica2.png')}
                                style={placeReviewsBoxStyles.avatarImage}
                            />
                            <Text style={placeReviewsBoxStyles.userNameText}>{secondReview.owner}</Text>
                        </View>
                    </View>
                </View>
            ) : null}
            {!hasOneReview() && !hasTwoReviews() ? (
                <View style={placeReviewsBoxStyles.reviewItem}>
                    <View style={placeReviewsBoxStyles.commentContainer}>
                        <Text style={placeReviewsBoxStyles.commentText}>Be the first to comment</Text>
                    </View>
                </View>
            ) : null}

            <TouchableOpacity style={placeReviewsBoxStyles.button} onPress={() => {}}>
                <View style={placeReviewsBoxStyles.buttonTextView}>
                    {<Text style={placeReviewsBoxStyles.text}>{"Add review"}</Text>}
                </View>
            </TouchableOpacity>
        </TouchableOpacity>
    }

    const componentToRender = loadingReviews
        ? loadingReviewsComponent()
        : reviewsBoxComponent();

    return componentToRender;

};
export default PlaceReviewsBox;
