import { View } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import React from 'react';
import { explorePlacesScreenWording } from './wording';
import { PlaceResponse } from '../../../api/response/places';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { apiAdapter } from '../../../api/apiAdapter';
import  DecentravellerPlacesItems  from '../../../commons/components/DecentravellerPlacesList';
import DecentravellerPicker from '../../../commons/components/DecentravellerPicker';
import { PickerItem } from '../../../commons/types';
import {
    DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    DECENTRAVELLER_DEFAULT_CONTRAST_COLOR,
    MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER,
} from '../../../commons/global';
import { getAndParseGeocoding } from '../../../commons/functions/geocoding';
import { Entypo, Ionicons } from '@expo/vector-icons';
import {AppContextStateArg} from "../../../context/types";

const adapter = mockApiAdapter;

const ExplorePlacesScreen = ({ navigation }) => {
    // const { userLocation } = useAppContext();
    const userLocation: AppContextStateArg<[string, string]> = undefined;

    const [currentSearchingLocation, setCurrentSearchingLocation] = React.useState<[string, string]>(undefined);
    const [places, setPlaces] = React.useState<PlaceResponse[]>([]);
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(false);
    const [lastSearchTextLength, setLastSearchTextLength] = React.useState<number>(0);
    const [loadingGeocodingResponse, setLoadingGeocodingResponse] = React.useState<boolean>(false);
    const [locationPickerPlaceholder, setLocationPickerPlaceholder] = React.useState<string>(explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_SEARCH_LOCATION)

    const [locationPickerValue, setLocationPickerValue] = React.useState<string>(null);
    const [locationPickerOpen, setLocationPickerOpen] = React.useState<boolean>(false);
    const [locationPickerItems, setLocationPickerItems] = React.useState<PickerItem[]>([]);


    React.useEffect(() => {
        if(userLocation) {
            setLocationPickerPlaceholder(explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION);
        }

        (async () => {
            if (userLocation) {
                const [latitude, longitude] = userLocation.value;
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
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
                alignContent: 'flex-start',
            }}
        >
            <View style={{ flex: 0.1, flexDirection: 'row', marginTop: 10 }}>
                <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                    <Entypo name="location-pin" size={25} color={DECENTRAVELLER_DEFAULT_CONTRAST_COLOR} />
                </View>
                <View style={{ flex: 0.85 }}>
                    <DecentravellerPicker
                        dropdownPlaceholder={locationPickerPlaceholder}
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
                        marginBottom={0}
                        marginLeft={0}
                        marginRight={0}
                        showTitle={false}
                    />
                </View>
                <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="funnel" size={25} color={DECENTRAVELLER_DEFAULT_CONTRAST_COLOR} />
                </View>
            </View>
            <View style={{ backgroundColor: 'black', height: 2, borderRadius: 2 }} />
            <View style={{ flex: 0.9 }}>
                <DecentravellerPlacesItems places={places} />
            </View>
        </View>
    );
};

export default ExplorePlacesScreen;
