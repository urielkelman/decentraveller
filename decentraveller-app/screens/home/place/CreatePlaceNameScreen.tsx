import {KeyboardAvoidingView, View} from 'react-native';
import React from 'react';
import HeadingTextCreatePlace from './HeadingTextCreatePlace';
import { addPlaceScreenStyles } from '../../../styles/addPlaceScreensStyles';
import DescriptionTextCreatePlace from './DescriptionTextCreatePlace';
import { addPlaceScreenWordings } from './wording';
import { useCreatePlaceContext } from './CreatePlaceContext';
import CreatePlacePicker from './PickerCreatePlace';
import CreatePlaceTextInput from './CreatePlaceTextInput';
import CreatePlaceButton from './CreatePlaceButton';

const CreatePlaceNameScreen = ({ navigation }) => {
    const { placeTypePicker, placeName, setPlaceName } = useCreatePlaceContext();

    const onClickContinue = () => {
        if (placeTypePicker.value && placeName) {
            navigation.navigate('CreatePlaceLocationScreen');
        }
    };

    return (
            <KeyboardAvoidingView style={addPlaceScreenStyles.container} behavior="padding">
                <HeadingTextCreatePlace text={addPlaceScreenWordings.CREATE_PLACE_HEADING} />
                <DescriptionTextCreatePlace />
                <CreatePlacePicker
                    titleText={addPlaceScreenWordings.CREATE_PLACE_PLACEHOLDER_PLACE_TYPE}
                    dropdownPlaceholder={addPlaceScreenWordings.CREATE_PLACE_DROPDOWN_PLACEHOLDER}
                    items={placeTypePicker.items}
                    setItems={placeTypePicker.setItems}
                    value={placeTypePicker.value}
                    setValue={placeTypePicker.setValue}
                    open={placeTypePicker.open}
                    setOpen={placeTypePicker.setOpen}
                />
                <CreatePlaceTextInput
                    text={placeName}
                    setTextValue={setPlaceName}
                    placeholder={addPlaceScreenWordings.CREATE_PLACE_PLACE_NAME_INPUT_PLACEHOLDER}
                />
                <CreatePlaceButton text={'Next'} onPress={onClickContinue} />
            </KeyboardAvoidingView>

    );
};

export default CreatePlaceNameScreen;
