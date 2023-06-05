import {KeyboardAvoidingView, View} from 'react-native';
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
import {addPlaceScreenWordings} from "../place/wording";
import DecentravellerPicker from "../../../commons/components/DecentravellerPicker";
import {PickerItem} from "../../../commons/types";

const adapter = mockApiAdapter;

const ExplorePlacesScreen = ({ navigation }) => {
    const { userLocation } = useAppContext();
    const [currentSearchingLocation, setCurrentSearchingLocation] = React.useState<[string, string]>(undefined);
    const [places, setPlaces] = React.useState<PlaceResponse[]>([]);
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(false);

    const [locationPickerValue, setLocationPickerValue] = React.useState<string>(null);
    const [locationPickerOpen, setLocationPickerOpen] = React.useState<boolean>(false);
    const [locationPickerItems, setLocationPickerItems] = React.useState<PickerItem[]>([]);

    React.useEffect(() => {
        (async () => {
            const [latitude, longitude] = userLocation.value;
            if (latitude && longitude) {
                setLoadingPlaces(true);
                const places = await adapter.getRecommendedPlaces([latitude, longitude]);
                setPlaces(places.results);
                setLoadingPlaces(false);
                setCurrentSearchingLocation([latitude, longitude]);
            }
        })();
    }, []);

    console.log('Explore');

    return (
        <View style={{flex: 1}}>
            <DecentravellerPicker
                titleText={addPlaceScreenWordings.CREATE_PLACE_ADDRESS_PLACEHOLDER}
                dropdownPlaceholder={addPlaceScreenWordings.CREATE_PLACE_ADDRESS_PLACEHOLDER}
                items={addressPicker.items}
                setItems={addressPicker.setItems}
                value={addressPicker.value}
                setValue={addressPicker.setValue}
                open={addressPicker.open}
                setOpen={addressPicker.setOpen}
                onOpen={addressPicker.onOpen}
                searchable={true}
                onChangeSearchText={onChangeSearchAddressText}
                zIndex={1000}
                zIndexInverse={3000}
                loading={loadingGeocodingResponse}
                disableLocalSearch={true}
            />
            <DecentravellerPlacesItems places={places} />
        </View>
    );
};

export default ExplorePlacesScreen;
