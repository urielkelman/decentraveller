import { KeyboardAvoidingView, View } from 'react-native';
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
import { addPlaceScreenWordings } from '../place/wording';
import DecentravellerPicker from '../../../commons/components/DecentravellerPicker';
import { PickerItem } from '../../../commons/types';
import {
    DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER,
} from '../../../commons/global';
import { getAndParseGeocoding } from '../../../commons/functions/geocoding';

const adapter = mockApiAdapter;

const ExplorePlacesScreen = ({ navigation }) => {
    const { userLocation } = useAppContext();
    const [currentSearchingLocation, setCurrentSearchingLocation] = React.useState<[string, string]>(undefined);
    const [places, setPlaces] = React.useState<PlaceResponse[]>([]);
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(false);
    const [lastSearchTextLength, setLastSearchTextLength] = React.useState<number>(0);
    const [loadingGeocodingResponse, setLoadingGeocodingResponse] = React.useState<boolean>(false);

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

    const onOpenPicker = () => {
        setLocationPickerItems(locationPickerItems.filter((item) => item.value === locationPickerValue));
    };

    const onChangeSearchAddressText = async (text: string) => {
        setLocationPickerValue(text);
        if (text.length > MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER && text.length > lastSearchTextLength) {
            await getAndParseGeocoding(text, setLocationPickerItems, setLoadingGeocodingResponse);
        } else if (text.length <= MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER) {
            setLocationPickerItems([]);
        }
        setLastSearchTextLength(text.length);
    };

    return (
        <View style={{ flex: 1, backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR }}>
            <DecentravellerPicker
                titleText={explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_TITLE}
                dropdownPlaceholder={explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_CURRENT_LOCATION}
                items={locationPickerItems}
                setItems={setLocationPickerItems}
                value={locationPickerValue}
                setValue={setLocationPickerValue}
                open={locationPickerOpen}
                setOpen={setLocationPickerOpen}
                onOpen={onOpenPicker}
                searchable={true}
                onChangeSearchText={onChangeSearchAddressText}
                zIndex={1000}
                zIndexInverse={3000}
                loading={loadingGeocodingResponse}
                disableLocalSearch={true}
                marginBottom={false}
            />
            <DecentravellerPlacesItems places={places} />
        </View>
    );
};

export default ExplorePlacesScreen;
