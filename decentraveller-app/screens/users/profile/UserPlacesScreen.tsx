import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    registrationScreenTextStyle,
    subTitleTextStyle,
    WelcomeStyles,
} from '../../../styles/registrationScreensStyles';
import { registerUserScreenWordings } from '../registration/wording';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackScreens } from '../../home/HomeNavigator';
import CreatePlaceProvider from '../../home/place/CreatePlaceContext';
import RootNavigator from '../../home/RootNavigator';
import CreatePlaceNameScreen from '../../home/place/CreatePlaceNameScreen';
import CreatePlaceLocationScreen from '../../home/place/CreatePlaceLocationScreen';
import { DecentravellerPlacesItems } from '../../../commons/components/DecentravellerPlacesList';
import { PlaceResponse, PlacesResponse } from '../../../api/response/places';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { useAppContext } from '../../../context/AppContext';

const adapter = mockApiAdapter;

const UserPlacesScreen = ({}) => {
    const appContext = useAppContext();
    const [userPlaces, setUserPlaces] = React.useState<PlaceResponse[]>([]);

    useEffect(() => {
        (async () => {
            const placesResponse: PlacesResponse = await adapter.getMyPlacesPlaces(
                // appContext.connectionContext.connectedAddress
                ''
            );
            setUserPlaces(placesResponse.results);
        })();
    }, []);

    const renderPlaces = DecentravellerPlacesItems({ places: userPlaces, shouldRenderAddNewPlace: false });

    return <View style={{ flex: 1 }}>{renderPlaces}</View>;
};

export default UserPlacesScreen;
