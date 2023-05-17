import { KeyboardAvoidingView, View } from 'react-native';
import React from 'react';
import DecentravellerHeadingText from '../../../commons/components/DecentravellerHeadingText';
import { addPlaceScreenStyles } from '../../../styles/addPlaceScreensStyles';
import DecentravellerDescriptionText from '../../../commons/components/DecentravellerDescriptionText';
import { addPlaceScreenWordings } from './wording';
import { useCreatePlaceContext } from './CreatePlaceContext';
import CreatePlacePicker from '../../../commons/components/DecentravellerPicker';
import DecentravellerTextInput from '../../../commons/components/DecentravellerTextInput';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';

const CreatePlaceNameScreen = ({ navigation }) => {
    const { placeTypePicker, placeName, setPlaceName } = useCreatePlaceContext();

    const onClickContinue = () => {
        if (placeTypePicker.value && placeName) {
            navigation.navigate('CreatePlaceLocationScreen');
        }
    };

    return (
        <KeyboardAvoidingView style={addPlaceScreenStyles.container} behavior="padding">
            <DecentravellerHeadingText text={addPlaceScreenWordings.CREATE_PLACE_HEADING} />
            <DecentravellerDescriptionText />
            <CreatePlacePicker
                titleText={addPlaceScreenWordings.CREATE_PLACE_PLACEHOLDER_PLACE_TYPE}
                dropdownPlaceholder={addPlaceScreenWordings.CREATE_PLACE_DROPDOWN_PLACEHOLDER}
                items={placeTypePicker.items}
                setItems={placeTypePicker.setItems}
                value={placeTypePicker.value}
                setValue={placeTypePicker.setValue}
                open={placeTypePicker.open}
                setOpen={placeTypePicker.setOpen}
                onOpen={placeTypePicker.onOpen}
                searchable={false}
            />
            <DecentravellerTextInput
                text={placeName}
                setTextValue={setPlaceName}
                placeholder={addPlaceScreenWordings.CREATE_PLACE_PLACE_NAME_INPUT_PLACEHOLDER}
            />
            <DecentravellerButton text={'Next'} onPress={onClickContinue} />
        </KeyboardAvoidingView>
    );
};

export default CreatePlaceNameScreen;
