import { Modal, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import { Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
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
import FilterModal from './FilterModal';
import { FilterModalData } from './types';
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';

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
    const [showNotLocationErrorModal, setShowLocationErrorModal] = React.useState<boolean>(false);

    const [locationPickerValue, setLocationPickerValue] = React.useState<string>(null);
    const [locationPickerOpen, setLocationPickerOpen] = React.useState<boolean>(false);
    const [locationPickerItems, setLocationPickerItems] = React.useState<PickerItem[]>([]);
    const [lastLocationLabelSearched, setLastLocationLabelSearched] = React.useState<string>();
    const [lastLocationSearched, setLastLocationSearched] = React.useState<[string, string]>(undefined);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>(null);
    const [minStars, setMinStars] = useState<number>(0);
    const [maxDistance, setMaxDistance] = useState<number>(0);
    const [interestPickerValue, setInterestPickerValue] = useState<string>(null);

    const filterModalDataProps: FilterModalData = {
        orderBy: sortBy,
        setOrderBy: setSortBy,
        minStars: minStars,
        setMinStars: setMinStars,
        maxDistance: maxDistance,
        setMaxDistance: setMaxDistance,
        interest: interestPickerValue,
        setInterest: setInterestPickerValue,
    };

    const ownLocationPickerValue = userLocation.value
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
            userLocation.value &&
            !locationPickerItems.some(
                (item) => item.label === explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION
            )
        ) {
            setLocationPickerItems([ownLocationPickerItem].concat(locationPickerItems));
        } else {
            setLocationPickerItems(locationPickerItems);
        }
    };

    const fetchPlaces = async (
        latitude: string,
        longitude: string,
        lastLocationLabelSearched: string
    ): Promise<void> => {
        setLoadingPlaces(true);
        console.log('to fetch places', latitude, longitude, lastLocationLabelSearched);
        const places = await adapter.getRecommendedPlaces(
            [latitude, longitude],
            interestPickerValue,
            sortBy,
            minStars !== 0 ? minStars : null,
            maxDistance !== 0 ? maxDistance : null
        );
        setPlaces(places);
        setLoadingPlaces(false);
        setLastLocationLabelSearched(lastLocationLabelSearched);
        setLastLocationSearched([latitude, longitude]);
    };

    React.useEffect(() => {
        if (userLocation.value) {
            (async () => {
                const [latitude, longitude] = userLocation.value;
                await fetchPlaces(
                    latitude,
                    longitude,
                    explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION
                );
            })();
        }
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
        if (lastLocationLabelSearched !== item.label) {
            clearFilters();
            const geocodingElement: GeocodingElement = JSON.parse(item.value);
            (async () => {
                await fetchPlaces(geocodingElement.latitude, geocodingElement.longitude, geocodingElement.address);
            })();
        }
    };

    const filterPlaces = () => {
        if (!lastLocationSearched) {
            /* This scenario only happens when a user does not have the location activated and try to apply filters
               without manually entering a location.
             */
            console.log('User did not activate the location. And also it did not select any location yet.');
            setShowLocationErrorModal(true);
            return;
        }

        (async () => {
            await fetchPlaces(lastLocationSearched[0], lastLocationSearched[1], lastLocationLabelSearched);
        })();

        setModalVisible(!modalVisible);
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const clearFilters = () => {
        setMinStars(0);
        setMaxDistance(0);
        setSortBy(null);
        setInterestPickerValue(null);
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
                <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <View style={styles.filterModalContainer}>
                        <View style={styles.filterModal}>
                            <FilterModal route={{ params: { filterModalData: filterModalDataProps } }} />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.filterModalButton, { marginRight: 10 }]}
                                    onPress={toggleModal}
                                >
                                    <Text style={styles.filterModalButtonText}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.filterModalButton, { marginRight: 10 }]}
                                    onPress={filterPlaces}
                                >
                                    <Text style={styles.filterModalButtonText}>Send</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.filterModalButton} onPress={clearFilters}>
                                    <Text style={styles.filterModalButtonText}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={{ backgroundColor: 'black', height: 2, borderRadius: 2 }} />
            <View style={{ flex: 0.9 }}>{componentToRender}</View>
            <DecentravellerInformativeModal
                informativeText={'You should pick a location before trying to filter places.'}
                visible={showNotLocationErrorModal}
                closeModalText={'OK!'}
                handleCloseModal={() => setShowLocationErrorModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0.1,
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
        flex: 0.825,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 100,
        elevation: 50,
    },
    filterModal: {
        backgroundColor: 'rgba(255, 225, 225, 0.5)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
    },
    filterModalButton: {
        backgroundColor: DECENTRAVELLER_DEFAULT_CONTRAST_COLOR,
        padding: 10,
        borderRadius: 10,
    },
    filterModalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ExplorePlacesScreen;
