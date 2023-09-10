import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    DecentravellerPlacesList,
    LoadPlaceResponse,
    PlaceShowProps
} from '../../../commons/components/DecentravellerPlacesList';
import {PlaceResponse, PlacesResponse} from '../../../api/response/places';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { apiAdapter } from '../../../api/apiAdapter';
import { useAppContext } from '../../../context/AppContext';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../../../commons/global';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { WalletIdProps } from './types';
import { useNavigation } from '@react-navigation/native';
import {ReviewResponse, ReviewsResponse} from '../../../api/response/reviews';
import { ReviewItemProps } from '../../reviews/ReviewItem';
import {LoadReviewResponse, ReviewShowProps} from '../../../commons/components/DecentravellerReviewsList';
import { DecentravellerPlaceCategory } from '../../../context/types';

const adapter = apiAdapter;

const UserPlacesScreen: React.FC<WalletIdProps> = ({ route }) => {
    const { walletId } = route.params;

    const loadPlaces = async (offset, limit): Promise<LoadPlaceResponse> => {
        const placesResponse: PlacesResponse = await adapter.getPlacesByOwner(walletId, offset, limit, () => {});
        if (placesResponse == undefined) {
            return {total: 0, placesToShow: []}
        }
        const imageUris = placesResponse.places.map((p: PlaceResponse) => {
            return adapter.getPlaceImageUrl(p.id);
        });
        const placesToShow: PlaceShowProps[] = placesResponse.places.map(function (p, i) {
            return {
                id: p.id,
                name: p.name,
                address: p.address,
                latitude: p.latitude,
                longitude: p.longitude,
                score: p.score,
                category: p.category,
                reviewCount: p.reviews,
                imageUri: imageUris[i],
            };
        });
        return {total: placesResponse.total, placesToShow: placesToShow}
    };

    return (
        <View><DecentravellerPlacesList loadPlaces={loadPlaces} minified={false} horizontal={false} /></View>
    );
};

export default UserPlacesScreen;
