import { View, Image, Text, ScrollView } from 'react-native';
import PlaceReviewsBox from './PlaceReviewsBox';
import { placeDetailStyles } from '../../../styles/placeDetailStyles';
import React, { useState } from 'react';
import { PlaceReviewsScreenProps } from '../../reviews/types';

const PlaceReviewsScreen: React.FC<PlaceReviewsScreenProps> = ({ route }) => {
    const { placeId } = route.params;

    return (
        <View style={placeDetailStyles.container}>
            <PlaceReviewsBox placeId={placeId} summarized={false} />
        </View>
    );
};

export default PlaceReviewsScreen;
