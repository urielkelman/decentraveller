import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DecentravellerPlacesList } from '../../../commons/components/DecentravellerPlacesList';
import { PlaceResponse } from '../../../api/response/places';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { apiAdapter } from '../../../api/apiAdapter';
import { useAppContext } from '../../../context/AppContext';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../../../commons/global';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { WalletIdProps } from './types';
import { ReviewResponse } from '../../../api/response/reviews';
import { ReviewItemProps } from '../../reviews/ReviewItem';

const adapter = apiAdapter;

const UserPlacesScreen: React.FC<WalletIdProps> = ({ route }) => {
    const { walletId } = route.params;
    const [userPlaces, setUserPlaces] = React.useState<PlaceResponse[]>(null);
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setLoadingPlaces(true);
            const placesResponse: PlaceResponse[] = await adapter.getPlacesByOwner(walletId, () => {});
            const images = await Promise.all(
                placesResponse.map(async (p: PlaceResponse) => {
                    return await adapter.getPlaceImage(p.id, () => {});
                }),
            );
            setUserPlaces(placesResponse);
            setLoadingPlaces(false);
        })();
    }, []);

    const componentToRender = loadingPlaces ? (
        <LoadingComponent />
    ) : userPlaces != null && userPlaces.length > 0 ? (
        <DecentravellerPlacesList places={userPlaces} minified={false} horizontal={false} />
    ) : (
        <Text>This user has no places</Text>
    );

    return componentToRender;
};

export default UserPlacesScreen;
