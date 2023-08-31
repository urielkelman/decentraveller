import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DecentravellerPlacesList, PlaceShowProps } from '../../../commons/components/DecentravellerPlacesList';
import {PlaceResponse, PlacesResponse} from '../../../api/response/places';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { apiAdapter } from '../../../api/apiAdapter';
import { useAppContext } from '../../../context/AppContext';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../../../commons/global';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { WalletIdProps } from './types';
import { useNavigation } from '@react-navigation/native';
import { ReviewResponse } from '../../../api/response/reviews';
import { ReviewItemProps } from '../../reviews/ReviewItem';
import { ReviewShowProps } from '../../../commons/components/DecentravellerReviewsList';
import { DecentravellerPlaceCategory } from '../../../context/types';

const adapter = apiAdapter;

const UserPlacesScreen: React.FC<WalletIdProps> = ({ route }) => {
    const { walletId } = route.params;
    const [userPlaces, setUserPlaces] = React.useState<PlaceShowProps[]>(null);
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(true);
    const [showNotFound, setNotFound] = React.useState<boolean>(false);
    const [reviewCount, setReviewsCount] = React.useState<number>(0);


    const onNotFound = () => {
        setNotFound(true);
        setLoadingPlaces(false);
    };

    useEffect(() => {
        (async () => {
            setLoadingPlaces(true);
            const placesResponse: PlacesResponse = await adapter.getPlacesByOwner(walletId, 0, 10, onNotFound);
            if (placesResponse!= null){
                const images = await Promise.all(
                    placesResponse.places.map(async (p: PlaceResponse) => {
                        return await adapter.getPlaceImage(p.id, () => {});
                    }),
                );
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
                        imageBase64: images[i],
                    };
                });
                setReviewsCount(placesResponse.total)
                setUserPlaces(placesToShow);
            }
            setLoadingPlaces(false);
        })();
    }, [walletId]);

    const componentToRender = loadingPlaces ? (
        <LoadingComponent />
    ) : !showNotFound ? (
        <DecentravellerPlacesList places={userPlaces} minified={false} horizontal={false} />
    ) : (
        <Text>This user has no places</Text>
    );

    return <View>{componentToRender}</View>;
};

export default UserPlacesScreen;
