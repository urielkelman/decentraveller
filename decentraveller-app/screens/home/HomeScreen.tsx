import { Text, View } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../context/AppContext';
import React, { useEffect } from 'react';
import { apiAdapter } from '../../api/apiAdapter';
import { mockApiAdapter } from '../../api/mockApiAdapter';
import { PlaceResponse, PlacesResponse } from '../../api/response/places';
import * as Location from 'expo-location';
import { DecentravellerPlacesItems } from '../../commons/components/DecentravellerPlacesList';

const adapter = mockApiAdapter;

const PERMISSION_GRANTED = 'granted';

const HomeScreen = ({ navigation }) => {
    const connector = useWalletConnect();
    const appContext = useAppContext();
    const [loadingRecommendedPlaces, setLoadingRecommendedPlaces] = React.useState<boolean>(false);
    const [recommendedPlaces, setRecommendedPlaces] = React.useState<PlaceResponse[]>([]);
    const [location, setLocation] = React.useState(undefined);

    const killSession = async () => {
        appContext.cleanConnectionContext();
        await connector.killSession();
        console.log('session killed');
    };

    useEffect(() => {
        (async () => {
            setLoadingRecommendedPlaces(true);
            const statusPermission = (await Location.getForegroundPermissionsAsync()).status;
            if (statusPermission !== PERMISSION_GRANTED) {
                const statusRequest = (await Location.requestForegroundPermissionsAsync()).status;
                if (statusRequest !== PERMISSION_GRANTED) {
                    console.log('Permission not granted');
                    const recommendedPlacesResponse: PlacesResponse = await adapter.getRecommendedPlacesForAddress(
                        appContext.connectionContext.connectedAddress
                    );
                    setRecommendedPlaces(recommendedPlacesResponse.results);
                    setLoadingRecommendedPlaces(false);
                    return;
                }
            }
            console.log('Permission granted');
            const location = await Location.getCurrentPositionAsync();
            setLocation(location);
            const recommendedPlacesResponse: PlacesResponse = await adapter.getRecommendedPlacesByLocation(
                location.coords.latitude.toString(),
                location.coords.longitude.toString()
            );
            setLoadingRecommendedPlaces(false);
            setRecommendedPlaces(recommendedPlacesResponse.results);
        })();
    }, []);

    const loadingRecommendedPlacesComponent = () => (
        <View>
            <Text>Loading</Text>
        </View>
    );

    const recommendedPlaceItemsComponent = () =>
        DecentravellerPlacesItems({ places: recommendedPlaces, shouldRenderAddNewPlace: true });

    const componentToRender = loadingRecommendedPlaces
        ? loadingRecommendedPlacesComponent()
        : recommendedPlaceItemsComponent();

    return <View style={{ flex: 1 }}>{componentToRender}</View>;
};

export default HomeScreen;
