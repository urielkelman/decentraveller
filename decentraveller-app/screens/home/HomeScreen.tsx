import { Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import React, { useEffect } from 'react';
import { apiAdapter } from '../../api/apiAdapter';
import { mockApiAdapter } from '../../api/mockApiAdapter';
import { PlaceResponse } from '../../api/response/places';
import * as Location from 'expo-location';
import DecentravellerPlacesItems from '../../commons/components/DecentravellerPlacesList';
import { addNewPlaceIconSize, homeStyle } from '../../styles/homeStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../../commons/global';
import LoadingComponent from '../../commons/components/DecentravellerLoading';
import { registerForPushNotificationsAsync } from '../../commons/notifications/notifications';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const adapter = mockApiAdapter;

const PERMISSION_GRANTED = 'granted';

const HomeScreen = ({ navigation }) => {
    console.log(navigation.getState());
    const { address, provider } = useWalletConnectModal();
    const { userLocation } = useAppContext();
    const [loadingRecommendedPlaces, setLoadingRecommendedPlaces] = React.useState<boolean>(false);
    const [recommendedPlaces, setRecommendedPlaces] = React.useState<PlaceResponse[]>([]);
    const [showPlacesNotFound, setShowPlacesNotFound] = React.useState<boolean>(false);

    const onNotFoundRecommendations = () => setShowPlacesNotFound(true);

    const getWithLocation = async ([latitude, longitude]: [string?, string?]) => {
        const recommendedPlacesResponse: PlaceResponse[] = await adapter.getRecommendedPlacesForAddress(
            address,
            [],
            onNotFoundRecommendations
        );
        setRecommendedPlaces(recommendedPlacesResponse);
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
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        console.log('location', location);
        const latitude = location.coords.latitude.toString();
        const longitude = location.coords.longitude.toString();
        userLocation.setValue([latitude, longitude]);
        console.log('to get');
        await getWithLocation([latitude, longitude]);
        console.log('geted');
    };

    const obtainAndSetPushNotificationToken = async (): Promise<void> => {
        console.log('register');
        const pushNotificationToken = await registerForPushNotificationsAsync();
        console.log('push token');
        await apiAdapter.sendPushNotificationToken('0x968C99f227a5D5015d3c50501C91353096AD7931', pushNotificationToken);
        //        await apiAdapter.sendPushNotificationToken(address, pushNotificationToken);
    };

    useEffect(() => {
        (async () => {
            await getAndSetRecommendedPlaces();
            await obtainAndSetPushNotificationToken();
        })();
    }, []);

    const componentToRender = loadingRecommendedPlaces ? (
        <LoadingComponent />
    ) : showPlacesNotFound ? (
        <Text>We couldn't find any place for you. Try in the Explore Tab.</Text>
    ) : (
        <DecentravellerPlacesItems places={recommendedPlaces} />
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
