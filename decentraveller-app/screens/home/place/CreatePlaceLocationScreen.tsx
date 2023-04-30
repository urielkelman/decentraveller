import { KeyboardAvoidingView, Text } from 'react-native';
import {addPlaceScreenStyles} from "../../../styles/addPlaceScreensStyles";
import HeadingTextCreatePlace from "./HeadingTextCreatePlace";
import {addPlaceScreenWordings} from "./wording";
import React from "react";
import {useCreatePlaceContext} from "./CreatePlaceContext";
import CreatePlacePicker from "./PickerCreatePlace";
import {ISOCodeByCountry} from "./countriesConfig";

const CreatePlaceLocationScreen = () => {
    const { placeName, countryPicker } = useCreatePlaceContext();
    console.log(Object.keys(ISOCodeByCountry))
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
        </KeyboardAvoidingView>
        );
};

export default CreatePlaceLocationScreen;
