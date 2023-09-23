import { Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import React, { useEffect } from 'react';
import { apiAdapter } from '../../api/apiAdapter';
import { PlaceResponse } from '../../api/response/places';
import * as Location from 'expo-location';
import { DecentravellerPlacesList, PlaceShowProps } from '../../commons/components/DecentravellerPlacesList';
import { addNewPlaceIconSize, homeStyle } from '../../styles/homeStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../../commons/global';
import LoadingComponent from '../../commons/components/DecentravellerLoading';
import { registerForPushNotificationsAsync } from '../../commons/notifications/notifications';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const adapter = apiAdapter;

const PERMISSION_GRANTED = 'granted';

const HomeScreen = ({ navigation }) => {
    const { address, provider } = useWalletConnectModal();
    const { userLocation, shouldUpdateHomeRecommendations } = useAppContext();
    const [loadingRecommendedPlaces, setLoadingRecommendedPlaces] = React.useState<boolean>(false);
    const [recommendedPlaces, setRecommendedPlaces] = React.useState<PlaceShowProps[]>([]);
    const [showPlacesNotFound, setShowPlacesNotFound] = React.useState<boolean>(false);

    const onNotFoundRecommendations = () => setShowPlacesNotFound(true);

    const parsePlaceResponse = (placeResponse: PlaceResponse, imageUri: string): PlaceShowProps => {
        return {
            id: placeResponse.id,
            name: placeResponse.name,
            address: placeResponse.address,
            latitude: placeResponse.latitude,
            longitude: placeResponse.longitude,
            score: placeResponse.score,
            category: placeResponse.category,
            reviewCount: placeResponse.reviews,
            imageUri: imageUri,
        };
    };

    const getWithLocation = async ([latitude, longitude]: [string?, string?]) => {
        const placesResponse: PlaceResponse[] = await adapter.getRecommendedPlacesForAddress(
            address,
            [latitude, longitude],
            onNotFoundRecommendations,
        );
        const imageUris = placesResponse.map((p: PlaceResponse) => {
            return adapter.getPlaceImageUrl(p.id);
        });
        const placesToShow: PlaceShowProps[] = placesResponse.map(function (p, i) {
            return parsePlaceResponse(p, imageUris[i]);
        });
        setRecommendedPlaces(placesToShow);
        setLoadingRecommendedPlaces(false);
    };

    const getAndSetRecommendedPlaces = async (): Promise<void> => {
        setLoadingRecommendedPlaces(true);
        const statusPermission = (await Location.getForegroundPermissionsAsync()).status;
        if (statusPermission !== PERMISSION_GRANTED) {
            const statusRequest = (await Location.requestForegroundPermissionsAsync()).status;
            if (statusRequest !== PERMISSION_GRANTED) {
                console.log('Permission not granted');
                await getWithLocation([]);
                return;
            }
        }
        console.log('Permission granted');
        const location = await Location.getLastKnownPositionAsync();

        if (!location) {
            console.log('Could not retrieve last location.');
            await getWithLocation([]);
            return;
        }

        console.log('Could retrieve location:', location);
        const latitude = location.coords.latitude.toString();
        const longitude = location.coords.longitude.toString();
        userLocation.setValue([latitude, longitude]);
        await getWithLocation([latitude, longitude]);
    };

    const obtainAndSetPushNotificationToken = async (): Promise<void> => {
        console.log('register');
        const pushNotificationToken = await registerForPushNotificationsAsync();
        console.log('push token');
        await apiAdapter.sendPushNotificationToken(address, pushNotificationToken);
    };

    useEffect(() => {
        (async () => {
            await getAndSetRecommendedPlaces();
            await obtainAndSetPushNotificationToken();
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (shouldUpdateHomeRecommendations.value) {
                await getAndSetRecommendedPlaces();
                shouldUpdateHomeRecommendations.setValue(false);
            }
        })();
    }, [shouldUpdateHomeRecommendations.value]);

    const componentToRender = loadingRecommendedPlaces ? (
        <LoadingComponent />
    ) : showPlacesNotFound ? (
        <Text>We couldn't find any place for you. Try in the Explore Tab.</Text>
    ) : (
        <DecentravellerPlacesList placeList={recommendedPlaces} minified={false} horizontal={false} />
    );

    return (
        <View style={{ flex: 1, backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR }}>
            {componentToRender}
            {!loadingRecommendedPlaces && (
                <View style={homeStyle.addNewPlaceReference}>
                    <TouchableOpacity onPress={() => navigation.navigate('CreatePlaceNameScreen')}>
                        <MaterialCommunityIcons name="book-plus-outline" size={addNewPlaceIconSize} color="black" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default HomeScreen;
