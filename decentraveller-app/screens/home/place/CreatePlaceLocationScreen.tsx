import { KeyboardAvoidingView, Text } from 'react-native';
import { addPlaceScreenStyles } from '../../../styles/addPlaceScreensStyles';
import DecentravellerHeadingText from '../../../commons/components/DecentravellerHeadingText';
import { addPlaceScreenWordings } from './wording';
import React, { useState } from 'react';
import { GeocodingElement, useCreatePlaceContext } from './CreatePlaceContext';
import CreatePlacePicker from '../../../commons/components/DecentravellerPicker';
import { GeocodingElementResponse, GeocodingResponse } from '../../../api/response/geocoding';
import { apiAdapter } from '../../../api/apiAdapter';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { blockchainAdapter } from '../../../blockchain/blockhainAdapter';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';

const MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER = 3;

const CreatePlaceLocationScreen = () => {
    const { placeName, placeTypePicker, countryPicker, addressPicker } = useCreatePlaceContext();
    const [lastSearchTextLength, setLastSearchTextLength] = React.useState<number>(0);
    const [loadingGeocodingResponse, setLoadingGeocodingResponse] = React.useState<boolean>(false);
    const [loadingAddPlaceResponse, setLoadingAddPlaceResponse] = React.useState<boolean>(false);
    const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
    const connector = useWalletConnect();

    const getAndParseGeocoding = async (addressText: string, country: string) => {
        try {
            // const geocodingResponse: GeocodingResponse = await apiAdapter.getGeocoding(addressText, country);
            const geocodingResponse: GeocodingResponse = await mockApiAdapter.getGeocoding(addressText, country);
            addressPicker.setItems(
                geocodingResponse.results.map((element: GeocodingElementResponse) => ({
                    label: element.fullAddress,
                    /* We stringify the object since and object type can't be the value type of a picker item. */
                    value: JSON.stringify({
                        address: element.fullAddress,
                        latitude: element.latitude,
                        longitude: element.longitude,
                    }),
                }))
            );
        } catch (e) {
            setLoadingGeocodingResponse(false);
        }
    };

    const onChangeSearchAddressText = async (text: string) => {
        addressPicker.setValue(text);
        if (
            text.length > MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER &&
            countryPicker.value &&
            text.length > lastSearchTextLength
        ) {
            setLoadingGeocodingResponse(true);
            await getAndParseGeocoding(text, countryPicker.value);
            setLoadingGeocodingResponse(false);
        } else if (text.length <= MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER) {
            addressPicker.setItems([]);
        }
        setLastSearchTextLength(text.length);
    };

    const onErrorAddingPlace = () => {
        setShowErrorModal(true);
    };

    const onFinish = async () => {
        setLoadingAddPlaceResponse(true);
        const selectedGeocodingElement: GeocodingElement = JSON.parse(addressPicker.value);
        const transactionHash = await blockchainAdapter.createAddNewPlaceTransaction(
            connector,
            placeName,
            selectedGeocodingElement.latitude,
            selectedGeocodingElement.longitude,
            selectedGeocodingElement.address,
            parseInt(placeTypePicker.value),
            onErrorAddingPlace
        );
        setLoadingAddPlaceResponse(false);
        console.log('Transaction confirmed with hash', transactionHash);
    };

    const backgroundOpacity = showErrorModal ? 0.5 : 1;

    return (
        <KeyboardAvoidingView
            style={{ ...addPlaceScreenStyles.container, opacity: backgroundOpacity }}
            behavior="padding"
            keyboardVerticalOffset={40}
        >
            <DecentravellerHeadingText text={addPlaceScreenWordings.CREATE_PLACE_LOCATION_HEADING(placeName)} />
            <CreatePlacePicker
                titleText={addPlaceScreenWordings.CREATE_PLACE_PLACEHOLDER_COUNTRY}
                dropdownPlaceholder={addPlaceScreenWordings.CREATE_PLACE_COUNTRY_PLACEHOLDER}
                items={countryPicker.items}
                setItems={countryPicker.setItems}
                value={countryPicker.value}
                setValue={countryPicker.setValue}
                open={countryPicker.open}
                setOpen={countryPicker.setOpen}
                onOpen={countryPicker.onOpen}
                searchable={true}
                zIndex={3000}
                zIndexInverse={1000}
            />
            <CreatePlacePicker
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
            <DecentravellerButton text={'Finish'} loading={loadingAddPlaceResponse} onPress={onFinish} />
            <DecentravellerInformativeModal
                informativeText={'Error ocurred'}
                visible={showErrorModal}
                closeModalText={'Close'}
                handleCloseModal={() => setShowErrorModal(false)}
            />
        </KeyboardAvoidingView>
    );
};

export default CreatePlaceLocationScreen;
