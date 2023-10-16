import { KeyboardAvoidingView, View } from 'react-native';
import React from 'react';
import DecentravellerHeadingText from '../../../commons/components/DecentravellerHeadingText';
import { bottomTabScreenStyles } from '../../../styles/bottomTabScreensStyles';
import DecentravellerDescriptionText from '../../../commons/components/DecentravellerDescriptionText';
import { addPlaceScreenWordings } from './wording';
import { useCreatePlaceContext } from './CreatePlaceContext';
import CreatePlacePicker from '../../../commons/components/DecentravellerPicker';
import DecentravellerTextInput from '../../../commons/components/DecentravellerTextInput';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { useNavigation } from '@react-navigation/native';
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';
import { AddReviewImagesScreenProp, CreatePlaceLocationScreenProp } from './types';

const CreatePlaceNameScreen = () => {
    const { placeTypePicker, placeName, setPlaceName } = useCreatePlaceContext();
    const navigation = useNavigation<CreatePlaceLocationScreenProp>();
    const [showInformativeModal, setShowInformativeModal] = React.useState<boolean>(false);

    const onClickContinue = () => {
        if (placeTypePicker.value && placeName) {
            navigation.navigate('CreatePlaceLocationScreen');
        } else {
            setShowInformativeModal(true);
        }
    };

    const backgroundOpacity = showInformativeModal ? 0.5 : 1;

    return (
        <KeyboardAvoidingView
            style={{ ...bottomTabScreenStyles.container, opacity: backgroundOpacity }}
            behavior="padding"
        >
            <DecentravellerHeadingText text={addPlaceScreenWordings.CREATE_PLACE_HEADING} />
            <DecentravellerDescriptionText text={addPlaceScreenWordings.CREATE_PLACE_DESC} />
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
            <DecentravellerButton loading={false} text={'Next'} onPress={onClickContinue} style={{ marginTop: 30 }} />
            <DecentravellerInformativeModal
                informativeText={'Please, provide both the place type and the name.'}
                visible={showInformativeModal}
                closeModalText={'Close'}
                handleCloseModal={() => setShowInformativeModal(false)}
            />
        </KeyboardAvoidingView>
    );
};

export default CreatePlaceNameScreen;
