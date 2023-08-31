import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { placeSimilarsBoxStyles } from '../../../styles/placeDetailStyles';
import { useNavigation } from '@react-navigation/native';
import { AddReviewImagesScreenProp } from './types';
import { apiAdapter } from '../../../api/apiAdapter';
import ReviewItem, { ReviewItemProps } from '../../reviews/ReviewItem';
import PlaceItem, { PlaceItemProps } from './PlaceItem';
import { PlaceResponse } from '../../../api/response/places';
import { DecentravellerPlacesList, PlaceShowProps } from '../../../commons/components/DecentravellerPlacesList';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';

const adapter = apiAdapter;

const PlaceSimilarsBox = ({ placeId }) => {
    const navigation = useNavigation<AddReviewImagesScreenProp>();
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(false);
    const [places, setPlaces] = React.useState<PlaceShowProps[]>(null);
    const [showNotFound, setNotFound] = React.useState<boolean>(false);

    const onNotFoundRecommendations = () => {
        setNotFound(true);
        setLoadingPlaces(false);
    };

    useEffect(() => {
        (async () => {
            setLoadingPlaces(true);
            const placesResponse: PlaceResponse[] = await adapter.getRecommendedSimilarPlaces(
                placeId,
                onNotFoundRecommendations,
            );
            const images = await Promise.all(
                placesResponse.map(async (p: PlaceResponse) => {
                    return await adapter.getPlaceImage(p.id, () => {});
                }),
            );
            const placesToShow: PlaceShowProps[] = placesResponse.map(function (p, i) {
                return {
                    id: p.id,
                    name: p.name,
                    address: p.address,
                    latitude: p.latitude,
                    longitude: p.longitude,
                    score: p.score,
                    category: p.category,
                    reviewCount: p.reviews,
                    imageBase64: images[i],
                };
            });
            setPlaces(placesToShow);
            setLoadingPlaces(false);
        })();
    }, [placeId]);

    const hasRecommendations = () => {
        return places != null && places.length > 0;
    };

    const loadingReviewsComponent = () => (
        <View>
            <Text style={placeSimilarsBoxStyles.titleText}>You should also watch...</Text>
            <LoadingComponent />
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
    const componentToRender = loadingPlaces ? loadingReviewsComponent() : showNotFound ? null : reviewsBoxComponent();

    return componentToRender;
};
export default PlaceSimilarsBox;
