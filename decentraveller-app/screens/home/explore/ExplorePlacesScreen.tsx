import { KeyboardAvoidingView } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import React from 'react';
import { bottomTabScreenStyles } from '../../../styles/bottomTabScreensStyles';
import DecentravellerHeadingText from '../../../commons/components/DecentravellerHeadingText';
import { explorePlacesScreenWording } from './wording';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import DecentravellerDescriptionText from '../../../commons/components/DecentravellerDescriptionText';
import { PlaceResponse } from '../../../api/response/places';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { apiAdapter } from '../../../api/apiAdapter';
import { DecentravellerPlacesItems } from '../../../commons/components/DecentravellerPlacesList';

const adapter = mockApiAdapter;

const ExplorePlacesScreen = ({ navigation }) => {
    const { userLocation } = useAppContext();
    const [places, setPlaces] = React.useState<PlaceResponse[]>([]);
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(false);

    React.useEffect(() => {
        (async () => {
            const [latitude, longitude] = userLocation.value;
            if (latitude && longitude) {
                setLoadingPlaces(true);
                const places = await adapter.getRecommendedPlaces([latitude, longitude]);
                setPlaces(places.results);
                setLoadingPlaces(false);
            }
        })();
    }, []);

    console.log('Explore');

    return (
        <KeyboardAvoidingView style={bottomTabScreenStyles.container}>
            <DecentravellerPlacesItems places={places} shouldRenderAddNewPlace={false} />
        </KeyboardAvoidingView>
    );
};

export default ExplorePlacesScreen;
