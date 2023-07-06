import {Modal, TouchableOpacity, View} from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import { Text, StyleSheet } from 'react-native';
import React, {useState} from 'react';
import { explorePlacesScreenWording } from './wording';
import { PlaceResponse } from '../../../api/response/places';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { apiAdapter } from '../../../api/apiAdapter';
import DecentravellerPlacesItems from '../../../commons/components/DecentravellerPlacesList';
import DecentravellerPicker from '../../../commons/components/DecentravellerPicker';
import { PickerItem } from '../../../commons/types';
import {
    DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    DECENTRAVELLER_DEFAULT_CONTRAST_COLOR,
    MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER,
} from '../../../commons/global';
import { getAndParseGeocoding } from '../../../commons/functions/geocoding';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { GeocodingElement } from '../place/CreatePlaceContext';
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import FilterModal from "./FilterModal";
import {FilterModalData} from "./types";

const adapter = mockApiAdapter;

const ExplorePlacesScreen = ({ navigation }) => {
    const { userLocation } = useAppContext();

    const [places, setPlaces] = React.useState<PlaceResponse[]>([]);
    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(false);
    const [lastSearchTextLength, setLastSearchTextLength] = React.useState<number>(0);
    const [loadingGeocodingResponse, setLoadingGeocodingResponse] = React.useState<boolean>(false);
    const [locationPickerPlaceholder, setLocationPickerPlaceholder] = React.useState<string>(
        explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_SEARCH_LOCATION
    );

    const [locationPickerValue, setLocationPickerValue] = React.useState<string>(null);
    const [locationPickerOpen, setLocationPickerOpen] = React.useState<boolean>(false);
    const [locationPickerItems, setLocationPickerItems] = React.useState<PickerItem[]>([]);
    const [lastLocationLabelSearched, setLastLocationLabelSearched] = React.useState<string>();

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [orderBy, setOrderBy] = useState<string>(null);
    const [minStars, setMinStars] = useState<number>(null);
    const [maxDistance, setMaxDistance] = useState<number>(null);

    const filterModalDataProps: FilterModalData = {
        orderBy: orderBy,
        setOrderBy: setOrderBy,
        minStars: minStars,
        setMinStars: setMinStars,
        maxDistance:  maxDistance,
        setMaxDistance: setMaxDistance,
    }


    const ownLocationPickerValue = userLocation
        ? JSON.stringify({
              address: explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION,
              latitude: userLocation.value[0],
              longitude: userLocation.value[1],
          })
        : undefined;

    const ownLocationPickerItem: PickerItem = ownLocationPickerValue
        ? {
              label: explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION,
              value: ownLocationPickerValue,
          }
        : undefined;

    const setLocationPickerItemsWrappedWithOwnLocation = (locationPickerItems: PickerItem[]) => {
        if (
            userLocation &&
            !locationPickerItems.some(
                (item) => item.label === explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION
            )
        ) {
            setLocationPickerItems([ownLocationPickerItem].concat(locationPickerItems));
        } else {
            setLocationPickerItems(locationPickerItems);
        }
    };

    React.useEffect(() => {
        if (userLocation) {
            setLocationPickerPlaceholder(explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION);
        }

        (async () => {
            if (userLocation) {
                const [latitude, longitude] = userLocation.value;
                setLoadingPlaces(true);
                const places = await adapter.getRecommendedPlaces([latitude, longitude]);
                setPlaces(places);
                setLoadingPlaces(false);
                setLocationPickerValue(ownLocationPickerValue);
                setLastLocationLabelSearched(explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION);
            }
        })();
    }, []);

    const onOpenPicker = () => {
        setLocationPickerItemsWrappedWithOwnLocation(
            locationPickerItems.filter((item) => item.value === locationPickerValue)
        );
    };

    const onChangeSearchAddressText = async (text: string) => {
        setLocationPickerValue(text);
        if (text.length > MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER && text.length > lastSearchTextLength) {
            await getAndParseGeocoding(text, setLocationPickerItemsWrappedWithOwnLocation, setLoadingGeocodingResponse);
        } else if (text.length <= MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER) {
            setLocationPickerItemsWrappedWithOwnLocation([]);
        }
        setLastSearchTextLength(text.length);
    };

    const onSelection = (item: PickerItem) => {
        (async () => {
            if (lastLocationLabelSearched !== item.label) {
                setLoadingPlaces(true);
                const geocodingElement: GeocodingElement = JSON.parse(item.value);
                const places = await adapter.getRecommendedPlaces([
                    geocodingElement.latitude,
                    geocodingElement.longitude,
                ]);
                setPlaces(places);
                setLoadingPlaces(false);
                setLastLocationLabelSearched(item.label);
            }
        })();
    };

    const toggleModal = () => {
        console.log(orderBy, maxDistance, minStars)
        setModalVisible(!modalVisible);
    };

    const componentToRender = loadingPlaces ? <LoadingComponent /> : <DecentravellerPlacesItems places={places} />;

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
                        onSelection={onSelection}
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
                <TouchableOpacity
                    style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}
                    onPress={toggleModal}
                >
                    <Ionicons name="funnel" size={25} color={DECENTRAVELLER_DEFAULT_CONTRAST_COLOR} />
                </TouchableOpacity>
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.filterModalContainer}>
                        <View style={styles.filterModal}>
                            <FilterModal route={{ params: { filterModalData: filterModalDataProps } }} />
                            <TouchableOpacity
                                style={styles.filterModalButton}
                                onPress={toggleModal}
                            >
                                <Text style={styles.filterModalButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
            <View style={{ backgroundColor: 'black', height: 2, borderRadius: 2 }} />
            <View style={{ flex: 0.9 }}>{componentToRender}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
        alignContent: 'flex-start',
    },
    header: {
        flex: 0.1,
        flexDirection: 'row',
        marginTop: 10,
    },
    headerIcon: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerPicker: {
        flex: 0.85,
    },
    separator: {
        backgroundColor: 'black',
        height: 2,
        borderRadius: 2,
    },
    content: {
        flex: 0.9,
    },
    filterModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 225, 225, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterModal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    filterModalButton: {
        backgroundColor: '#983B46',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    filterModalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ExplorePlacesScreen;
