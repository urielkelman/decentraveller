import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { placeSimilarsBoxStyles } from '../../../styles/placeDetailStyles';
import { useNavigation } from '@react-navigation/native';
import { AddReviewImagesScreenProp } from './types';
import { apiAdapter } from '../../../api/apiAdapter';
import ReviewItem, { ReviewItemProps } from '../../reviews/ReviewItem';
import PlaceItem, { PlaceItemProps } from './PlaceItem';
import { PlaceResponse } from '../../../api/response/places';
import { DecentravellerPlacesList } from '../../../commons/components/DecentravellerPlacesList';

const adapter = apiAdapter;

const PlaceSimilarsBox = ({ placeId }) => {
    const navigation = useNavigation<AddReviewImagesScreenProp>();
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(false);
    const [places, setPlaces] = React.useState<PlaceResponse[]>(null);

    useEffect(() => {
        (async () => {
            setLoadingPlaces(true);
            const recommendedPlacesResponse: PlaceResponse[] = await adapter.getRecommendedSimilarPlaces(
                placeId,
                () => {},
            );
            setPlaces(recommendedPlacesResponse);
            setLoadingPlaces(false);
        })();
    }, [placeId]);

    const hasRecommendations = () => {
        return places != null && places.length > 0;
    };

    const loadingReviewsComponent = () => (
        <View>
            <Text style={placeSimilarsBoxStyles.titleText}>You should also watch...</Text>
            <ActivityIndicator size={'large'} />
        </View>
    );

    const reviewsBoxComponent = () => {
        if (hasRecommendations()) {
            return (
                <View style={placeSimilarsBoxStyles.container}>
                    <Text style={placeSimilarsBoxStyles.titleText}>You should also watch...</Text>
                    <DecentravellerPlacesList places={places} minified={true} horizontal={true} />
                </View>
            );
        } else {
            return null;
        }
    };

    const componentToRender = loadingPlaces ? loadingReviewsComponent() : reviewsBoxComponent();

    return componentToRender;
};
export default PlaceSimilarsBox;
