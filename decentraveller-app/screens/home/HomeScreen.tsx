import { Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import React, { useEffect } from 'react';
import { apiAdapter } from '../../api/apiAdapter';
import { mockApiAdapter } from '../../api/mockApiAdapter';
import { PlaceResponse, PlacesResponse } from '../../api/response/places';
import * as Location from 'expo-location';
import DecentravellerPlacesItems  from '../../commons/components/DecentravellerPlacesList';
import { addNewPlaceIconSize, homeStyle } from '../../styles/homeStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../../commons/global';

const adapter = mockApiAdapter;

const PERMISSION_GRANTED = 'granted';

const HomeScreen = ({ navigation }) => {
    const { userLocation, connectionContext } = useAppContext();
    const [loadingRecommendedPlaces, setLoadingRecommendedPlaces] = React.useState<boolean>(false);
    const [recommendedPlaces, setRecommendedPlaces] = React.useState<PlaceResponse[]>([]);

    useEffect(() => {
        (async () => {
            setLoadingRecommendedPlaces(true);
            const statusPermission = (await Location.getForegroundPermissionsAsync()).status;
            if (statusPermission !== PERMISSION_GRANTED) {
                const statusRequest = (await Location.requestForegroundPermissionsAsync()).status;
                if (statusRequest !== PERMISSION_GRANTED) {
                    console.log('Permission not granted');
                    const recommendedPlacesResponse: PlacesResponse = await adapter.getRecommendedPlacesForAddress(
                        //connectionContext.connectedAddress,
                        '',
                        []
                    );
                    setRecommendedPlaces(recommendedPlacesResponse.results);
                    setLoadingRecommendedPlaces(false);
                    return;
                }
            }
            console.log('Permission granted');
            const location = await Location.getCurrentPositionAsync();
            const latitude = location.coords.latitude.toString();
            const longitude = location.coords.longitude.toString();
            userLocation.setValue([latitude, longitude]);
            const recommendedPlacesResponse: PlacesResponse = await adapter.getRecommendedPlacesForAddress(
                //connectionContext.connectedAddress,
                '',
                [latitude, longitude]
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

    const componentToRender = loadingRecommendedPlaces ? (
        loadingRecommendedPlacesComponent()
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
