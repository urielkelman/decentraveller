import { KeyboardAvoidingView, Text } from 'react-native';
import { addPlaceScreenStyles } from '../../../styles/addPlaceScreensStyles';
import HeadingTextCreatePlace from './HeadingTextCreatePlace';
import { addPlaceScreenWordings } from './wording';
import React from 'react';
import { PickerItem, useCreatePlaceContext } from './CreatePlaceContext';
import CreatePlacePicker from './PickerCreatePlace';
import { GeocodingElementResponse, GeocodingResponse } from '../../../api/response/geocoding';
import { apiAdapter } from '../../../api/apiAdapter';

const MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER = 3;

const getAndParseGeocoding = async (
    addressText: string,
    country: string,
    addressPickerSetItems: React.Dispatch<React.SetStateAction<PickerItem[]>>
) => {
    const geocodingResponse: GeocodingResponse = await apiAdapter.getGeocoding(addressText, country);
    addressPickerSetItems(
        geocodingResponse.results.map((element: GeocodingElementResponse) => ({
            label: element.fullAddress,
            value: {
                address: element.fullAddress,
                latitude: element.latitude,
                longitude: element.longitude,
            },
        }))
    );
};

const CreatePlaceLocationScreen = () => {
    const { placeName, countryPicker, addressPicker } = useCreatePlaceContext();

    console.log(addressPicker.value);

    const onChangeSearchAddressText = async (text: string) => {
        addressPicker.setValue(text);
        if (text.length > MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER && countryPicker.value) {
            console.log('Searching for text address: ', addressPicker.value);
            await getAndParseGeocoding(text, countryPicker.value, addressPicker.setItems);
        }
    };

    return (
        <KeyboardAvoidingView style={addPlaceScreenStyles.container} behavior="padding">
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
            />
        </KeyboardAvoidingView>
    );
};

export default CreatePlaceLocationScreen;
