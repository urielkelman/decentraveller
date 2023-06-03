import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {placeReviewsBoxStyles} from "../../../styles/placeDetailStyles";

const PlaceReviewsBox = () => {
    return (
        <TouchableOpacity style={placeReviewsBoxStyles.container} onPress={() => {}}>
            <View style={placeReviewsBoxStyles.titleContainer}>
                <Text style={placeReviewsBoxStyles.titleText}>Reviews</Text>
                <Text style={placeReviewsBoxStyles.moreText}>More</Text>
            </View>
            <View style={placeReviewsBoxStyles.reviewItem}>
                <View style={placeReviewsBoxStyles.commentContainer}>
                    <Text style={placeReviewsBoxStyles.commentText}>
                        {'Excelente la comida!! Me dieron ganas de viajar a medio Oriente!.'} - {' '}
                        <Text style={placeReviewsBoxStyles.dateText}>{"10/02/2023"}</Text>
                    </Text>
                    <View style={placeReviewsBoxStyles.userContainer}>
                        <Image
                            source={require('../../../assets/mock_images/cryptochica.png')}
                            style={placeReviewsBoxStyles.avatarImage}
                        />
                        <Text style={placeReviewsBoxStyles.userNameText}>Ana Cruz</Text>
                    </View>
                </View>
            </View>
            <View style={placeReviewsBoxStyles.reviewItem}>
                <View style={placeReviewsBoxStyles.commentContainer}>
                    <Text style={placeReviewsBoxStyles.commentText}>
                        {'Rica comida israelí'} - {' '}
                        <Text style={placeReviewsBoxStyles.dateText}>{"03/01/2023"}</Text>
                    </Text>
                    <View style={placeReviewsBoxStyles.userContainer}>
                        <Image
                            source={require('../../../assets/mock_images/cryptochica2.png')}
                            style={placeReviewsBoxStyles.avatarImage}
                        />
                        <Text style={placeReviewsBoxStyles.userNameText}>HamikimiGirl</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={placeReviewsBoxStyles.button} onPress={() => {}}>
                <View style={placeReviewsBoxStyles.buttonTextView}>
                    {<Text style={placeReviewsBoxStyles.text}>{"Add review"}</Text>}
                </View>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};
export default PlaceReviewsBox;
