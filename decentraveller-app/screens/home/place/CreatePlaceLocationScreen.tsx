import { KeyboardAvoidingView, Text } from 'react-native';
import {addPlaceScreenStyles} from "../../../styles/addPlaceScreensStyles";
import HeadingTextCreatePlace from "./HeadingTextCreatePlace";
import {addPlaceScreenWordings} from "./wording";
import React from "react";
import {useCreatePlaceContext} from "./CreatePlaceContext";
import CreatePlacePicker from "./PickerCreatePlace";
import CreatePlaceTextInput from "./CreatePlaceTextInput";

const MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER = 3

const CreatePlaceLocationScreen = () => {
    const { placeName, countryPicker, addressPicker } = useCreatePlaceContext();

    console.log(addressPicker.value)

    const onChangeSearchAddressText = (text: string) => {
        addressPicker.setValue(text);
        if(text.length > MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER) {
            console.log("Searching for text address: ", addressPicker.value);
        }
    }


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
                searchable={true}
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
                searchable={true}
                onChangeSearchText={onChangeSearchAddressText}
            />

        </KeyboardAvoidingView>
        );
};

export default CreatePlaceLocationScreen;
