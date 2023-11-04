import React from 'react';
import { View } from 'react-native';
import {
    DecentravellerPlacesList,
    LoadPlaceResponse,
    PlaceShowProps,
} from '../../../commons/components/DecentravellerPlacesList';
import { PlaceResponse, PlacesResponse } from '../../../api/response/places';
import { apiAdapter } from '../../../api/apiAdapter';
import { WalletIdProps } from './types';

const adapter = apiAdapter;

const UserPlacesScreen: React.FC<WalletIdProps> = ({ route }) => {
    const { walletId } = route.params;

    const loadPlaces = async (offset, limit): Promise<LoadPlaceResponse> => {
        const placesResponse: PlacesResponse = await adapter.getPlacesByOwner(walletId, offset, limit, () => {});
        if (placesResponse == undefined) {
            return { total: 0, placesToShow: [] };
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
        return { total: placesResponse.total, placesToShow: placesToShow };
    };

    return (
        <View>
            <DecentravellerPlacesList loadPlaces={loadPlaces} minified={false} horizontal={false} />
        </View>
    );
};

export default UserPlacesScreen;
