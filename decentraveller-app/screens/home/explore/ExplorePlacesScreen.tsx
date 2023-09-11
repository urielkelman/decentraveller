import { Modal, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import { Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { explorePlacesScreenWording } from './wording';
import { PlaceResponse } from '../../../api/response/places';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { apiAdapter } from '../../../api/apiAdapter';
import {
    DecentravellerPlacesList,
    LoadPlaceResponse,
    PlaceShowProps,
    PlaceLoadFunction
} from '../../../commons/components/DecentravellerPlacesList';
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
import { useHeaderHeight } from '@react-navigation/elements';

const adapter = apiAdapter;

const ExplorePlacesScreen = ({ navigation }) => {
    const { userLocation } = useAppContext();

    const [loadingPlaces, setLoadingPlaces] = React.useState<boolean>(false);
    const [lastSearchTextLength, setLastSearchTextLength] = React.useState<number>(0);
    const [loadingGeocodingResponse, setLoadingGeocodingResponse] = React.useState<boolean>(false);
    const [locationPickerPlaceholder, setLocationPickerPlaceholder] = React.useState<string>(
        explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_SEARCH_LOCATION,
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
                (item) => item.label === explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION,
            )
        ) {
            setLocationPickerItems([ownLocationPickerItem].concat(locationPickerItems));
        } else {
            setLocationPickerItems(locationPickerItems);
        }
    };

    const loadPlaces = async (limit: number, offset: number):  Promise<LoadPlaceResponse> => {
        if(lastLocationSearched == null){
            return {total: 0, placesToShow: []};
        }
        const placesResponse = await adapter.getPlacesSearch(
            lastLocationSearched,
            () => {},
            limit, offset,
            interestPickerValue,
            sortBy,
            minStars !== 0 ? minStars : null,
            maxDistance !== 0 ? maxDistance : null,
        );
        if (placesResponse != null){
            const imageUris = placesResponse.places.map((p: PlaceResponse) => {
                return adapter.getPlaceImageUrl(p.id);
            });
            const placesToShow: PlaceShowProps[] = placesResponse.places.map(function (p, i) {
                return {
                    id: p.id,
                    name: p.name,
                    address: p.address,
                    latitude: p.latitude,
                    longitude: p.longitude,
                    score: p.score,
                    category: p.category,
                    reviewCount: p.reviews,
                    imageUri: imageUris[i],
                };
            });
            return {total: placesResponse.total, placesToShow: placesToShow}
        }
        return {total: 0, placesToShow: []};
    }

    const fetchPlaces = (
        latitude: string,
        longitude: string,
        lastLocationLabelSearched: string,
    ): void => {
        setLoadingPlaces(true);
        setLastLocationLabelSearched(lastLocationLabelSearched);
        setLastLocationSearched([latitude, longitude]);
        setLoadingPlaces(false);
    };

    React.useEffect(() => {
        if (userLocation.value) {
            (() => {
                const [latitude, longitude] = userLocation.value;
                fetchPlaces(
                    latitude,
                    longitude,
                    explorePlacesScreenWording.EXPLORE_PLACE_LOCATION_PICKER_CURRENT_LOCATION,
                );
            })();
        }
    }, []);

    const onOpenPicker = () => {
        setLocationPickerItemsWrappedWithOwnLocation(
            locationPickerItems.filter((item) => item.value === locationPickerValue),
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
            (() => {
                fetchPlaces(geocodingElement.latitude, geocodingElement.longitude, geocodingElement.address);
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

        (() => {
            fetchPlaces(lastLocationSearched[0], lastLocationSearched[1], lastLocationLabelSearched);
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

    const placesListKey = () => {
        var k = "";
        if(lastLocationSearched != null){
            k += lastLocationSearched[0]
            k += lastLocationSearched[1]
        }
        if(interestPickerValue != null){
            k += interestPickerValue
        }
        if(sortBy != null){
            k += sortBy
        }
        k += `minStars:${minStars}`
        k += `maxDistance:${maxDistance}`
        return k
    }

    const componentToRender = loadingPlaces ? (
        <LoadingComponent />
    ) : (
        <DecentravellerPlacesList key={placesListKey()} loadPlaces={loadPlaces} minified={false} horizontal={false} />
    )

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
                    <View style={ [styles.filterModalContainer, {marginTop: useHeaderHeight()}] }>
                        <View style={styles.filterModal}>
                            <TouchableOpacity
                                style={[styles.closeButton]}
                                onPress={toggleModal}
                            >
                                <Text style={styles.closeButtonText}>╳</Text>
                            </TouchableOpacity>
                            <FilterModal route={{ params: { filterModalData: filterModalDataProps } }} />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.filterModalButton} onPress={clearFilters}>
                                    <Text style={styles.filterModalButtonText}>Clear all filters</Text>
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
        flex: 0.75,
        flexDirection: "row",
        backgroundColor: 'rgba(255, 225, 225, 0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterModal: {
        backgroundColor: 'rgba(255, 225, 225, 1)',
        paddingVertical: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 100,
        elevation: 50,
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
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(100,100,100)',
        textAlign: 'right',
        padding: 5,
    },
    closeButton: {
        position: 'absolute',
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: null,
        margin: 0,
        justifyContent: "flex-end"
    },
});

export default ExplorePlacesScreen;
