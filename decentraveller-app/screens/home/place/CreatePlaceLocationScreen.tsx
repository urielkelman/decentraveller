import { KeyboardAvoidingView, Text } from 'react-native';
import { registrationScreenStyles } from '../../../styles/registrationScreensStyles';
import HeadingTextCreatePlace from './HeadingTextCreatePlace';
import { addPlaceScreenWordings } from './wording';
import React, { useState } from 'react';
import { GeocodingElement, PickerItem, useCreatePlaceContext } from './CreatePlaceContext';
import CreatePlacePicker from './PickerCreatePlace';
import { GeocodingElementResponse, GeocodingResponse } from '../../../api/response/geocoding';
import { apiAdapter } from '../../../api/apiAdapter';
import CreatePlaceButton from './CreatePlaceButton';
import { mockApiAdapter } from '../../../api/mockApiAdapter';
import { blockchainAdapter } from '../../../blockchain/blockhainAdapter';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER = 3;

const getAndParseGeocoding = async (
    addressText: string,
    country: string,
    addressPickerSetItems: React.Dispatch<React.SetStateAction<PickerItem[]>>
) => {
    // const geocodingResponse: GeocodingResponse = await apiAdapter.getGeocoding(addressText, country);ç
    const geocodingResponse: GeocodingResponse = await mockApiAdapter.getGeocoding(addressText, country);
    console.log(geocodingResponse);
    addressPickerSetItems(
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
};

const CreatePlaceLocationScreen = () => {
    const { placeName, placeTypePicker, countryPicker, addressPicker } = useCreatePlaceContext();
    const [lastSearchTextLength, setLastSearchTextLength] = React.useState<number>(0);
    const [loadingGeocodingResponse, setLoadingGeocodingResponse] = React.useState<boolean>(false);
    const connector = useWalletConnect();

    const onChangeSearchAddressText = async (text: string) => {
        addressPicker.setValue(text);
        if (
            text.length > MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER &&
            countryPicker.value &&
            text.length > lastSearchTextLength
        ) {
            console.log('Searching for text address: ', addressPicker.value);
            setLoadingGeocodingResponse(true);
            await getAndParseGeocoding(text, countryPicker.value, addressPicker.setItems);
            setLoadingGeocodingResponse(false);
        } else if (text.length <= MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER) {
            addressPicker.setItems([]);
        }
        setLastSearchTextLength(text.length);
    };

    const onFinish = async () => {
        const selectedGeocodingElement: GeocodingElement = JSON.parse(addressPicker.value);
        const transactionHash = await blockchainAdapter.createAddNewPlaceTransaction(
            connector,
            placeName,
            selectedGeocodingElement.latitude,
            selectedGeocodingElement.longitude,
            selectedGeocodingElement.address,
            parseInt(placeTypePicker.value)
        );
        console.log('Transaction confirmed with hash', transactionHash);
    };

    return (
        <KeyboardAvoidingView style={registrationScreenStyles.container} behavior="padding" keyboardVerticalOffset={40}>
            <HeadingTextCreatePlace text={addPlaceScreenWordings.CREATE_PLACE_LOCATION_HEADING(placeName)} />
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
            <CreatePlaceButton text={'Finish'} onPress={onFinish} />
        </KeyboardAvoidingView>
    );
};

export default CreatePlaceLocationScreen;
