import { Text, TouchableOpacity, View, Image } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import React, { useEffect } from 'react';
import { apiAdapter } from '../../api/apiAdapter';
import { PlaceResponse } from '../../api/response/places';
import * as Location from 'expo-location';
import { DecentravellerPlacesList, PlaceShowProps } from '../../commons/components/DecentravellerPlacesList';
import { addNewPlaceIconSize, homeStyle } from '../../styles/homeStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingComponent from '../../commons/components/DecentravellerLoading';
import { registerForPushNotificationsAsync } from '../../commons/notifications/notifications';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import MapView, { Marker } from 'react-native-maps';
import {mockApiAdapter} from "../../api/mockApiAdapter";

const adapter = apiAdapter;

const PERMISSION_GRANTED = 'granted';

const HomeScreen = ({ navigation }) => {
    const { address, provider } = useWalletConnectModal();
    const { userLocation, shouldUpdateHomeRecommendations } = useAppContext();
    const [loadingRecommendedPlaces, setLoadingRecommendedPlaces] = React.useState<boolean>(true);
    const [recommendedPlaces, setRecommendedPlaces] = React.useState<PlaceShowProps[]>([]);
    const [showPlacesNotFound, setShowPlacesNotFound] = React.useState<boolean>(false);
    const [centroid, setCentroid] = React.useState<[number, number]>(null);

    const onNotFoundRecommendations = () => setShowPlacesNotFound(true);

    const parsePlaceResponse = (placeResponse: PlaceResponse): PlaceShowProps => {
        return {
            id: placeResponse.id,
            name: placeResponse.name,
            address: placeResponse.address,
            latitude: placeResponse.latitude,
            longitude: placeResponse.longitude,
            score: placeResponse.score,
            category: placeResponse.category,
            reviewCount: placeResponse.reviews,
        };
    };

    const getWithLocation = async ([latitude, longitude]: [string?, string?]) => {
        const placesResponse: PlaceResponse[] = await adapter.getRecommendedPlacesForAddress(
            address,
            [latitude, longitude],
            onNotFoundRecommendations,
        );
        if (placesResponse == null) {
            setMapCentroid([], [latitude, longitude]);
            setRecommendedPlaces([]);
            return;
        }
        const placesToShow: PlaceShowProps[] = placesResponse.map(function (p, i) {
            return parsePlaceResponse(p);
        });
        setRecommendedPlaces(placesToShow);
        setMapCentroid(placesToShow, [latitude, longitude]);
    };

    const setMapCentroid = (placesToShow: PlaceShowProps[], [latitude, longitude]: [string?, string?]) => {
        if (latitude != null && longitude != null) {
            setCentroid([Number(latitude), Number(longitude)]);
        } else {
            const sumLat = placesToShow.map((x) => Number(x.latitude)).reduce((a, b) => a + b, 0);
            const sumLon = placesToShow.map((x) => Number(x.longitude)).reduce((a, b) => a + b, 0);
            if (placesToShow.length > 0) {
                setCentroid([sumLat / placesToShow.length, sumLon / placesToShow.length]);
            } else {
                setCentroid([sumLat, sumLon]);
            }
        }
    };

    const getAndSetRecommendedPlaces = async (): Promise<void> => {
        setLoadingRecommendedPlaces(true);
        const statusPermission = (await Location.getForegroundPermissionsAsync()).status;
        if (statusPermission !== PERMISSION_GRANTED) {
            const statusRequest = (await Location.requestForegroundPermissionsAsync()).status;
            if (statusRequest !== PERMISSION_GRANTED) {
                console.log('Permission not granted');
                await getWithLocation([]);
                setLoadingRecommendedPlaces(false);
                return;
            }
        }
        console.log('Permission granted');
        const location = await Location.getLastKnownPositionAsync();

        if (!location) {
            console.log('Could not retrieve last location.');
            await getWithLocation([]);
            setLoadingRecommendedPlaces(false);
            return;
        }

        console.log('Could retrieve location:', location);
        const latitude = location.coords.latitude.toString();
        const longitude = location.coords.longitude.toString();
        userLocation.setValue([latitude, longitude]);
        setCentroid([Number(latitude), Number(longitude)]);
        console.log('to get');
        await getWithLocation([latitude, longitude]);
        console.log('geted');
        setLoadingRecommendedPlaces(false);
    };

    const obtainAndSetPushNotificationToken = async (): Promise<void> => {
        console.log('register');
        const pushNotificationToken = await registerForPushNotificationsAsync();
        console.log('push token');
        await adapter.sendPushNotificationToken(address, pushNotificationToken);
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

    const placesToRender = loadingRecommendedPlaces ? (
        <LoadingComponent />
    ) : showPlacesNotFound ? (
        <Text style={homeStyle.title}>We couldn't find any place for you. Try in the Explore Tab.</Text>
    ) : (
        <DecentravellerPlacesList placeList={recommendedPlaces} minified={false} horizontal={false} />
    );

    const mapToRender = !loadingRecommendedPlaces ? (
        <MapView
            initialRegion={{
                latitude: centroid[0],
                longitude: centroid[1],
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            }}
            style={homeStyle.map}
            rotateEnabled={false}
            showsBuildings={false}
            showsCompass={false}
            showsScale={false}
            showsTraffic={false}
            toolbarEnabled={false}
            zoomTapEnabled={false}
            customMapStyle={[
                {
                    featureType: 'administrative.land_parcel',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
                {
                    featureType: 'administrative.neighborhood',
                    stylers: [
                        {
                            visibility: 'off',
                        },
                    ],
                },
            ]}
        >
            {recommendedPlaces.map((item, index) => (
                <Marker
                    key={item.id}
                    coordinate={{ latitude: Number(item.latitude), longitude: Number(item.longitude) }}
                    image={null}
                    onPress={() =>
                        navigation.navigate('PlaceDetailScreen', {
                            id: item.id,
                            name: item.name,
                            address: item.address,
                            latitude: item.latitude,
                            longitude: item.longitude,
                            category: item.category,
                            score: item.score,
                            reviewCount: item.reviewCount,
                        })
                    }
                >
                    <View style={homeStyle.mapMarker}>
                        <Image source={require('../../assets/bubble.png')} style={homeStyle.bubbleImage} />
                        <Image source={{ uri: adapter.getPlaceThumbailUrl(item.id) }} style={homeStyle.mapImage} />
                    </View>
                </Marker>
            ))}
        </MapView>
    ) : null;

    return (
        <View style={homeStyle.homeContainer}>
            <Text style={homeStyle.title} numberOfLines={1} adjustsFontSizeToFit>
                Recommended for you:
            </Text>
            {mapToRender}
            {placesToRender}
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
