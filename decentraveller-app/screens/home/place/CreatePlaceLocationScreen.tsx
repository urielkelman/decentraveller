import { KeyboardAvoidingView } from 'react-native';
import { bottomTabScreenStyles } from '../../../styles/bottomTabScreensStyles';
import DecentravellerHeadingText from '../../../commons/components/DecentravellerHeadingText';
import { addPlaceScreenWordings } from './wording';
import React from 'react';
import { GeocodingElement, useCreatePlaceContext } from './CreatePlaceContext';
import DecentravellerPicker from '../../../commons/components/DecentravellerPicker';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { blockchainAdapter } from '../../../blockchain/blockhainAdapter';
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';
import { getAndParseGeocoding } from '../../../commons/functions/geocoding';
import { MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER } from '../../../commons/global';
import { useAppContext } from '../../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { CreatePlaceLocationScreenProp } from './types';

const CreatePlaceLocationScreen = () => {
    const { placeName, placeTypePicker, countryPicker, addressPicker } = useCreatePlaceContext();
    const [lastSearchTextLength, setLastSearchTextLength] = React.useState<number>(0);
    const [loadingGeocodingResponse, setLoadingGeocodingResponse] = React.useState<boolean>(false);
    const [loadingAddPlaceResponse, setLoadingAddPlaceResponse] = React.useState<boolean>(false);
    const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
    const { web3Provider } = useAppContext();
    const [showSuccessAndBackToHomeModal, setShowSuccessAndBackToHomeModal] = React.useState<boolean>(false);
    const navigation = useNavigation<CreatePlaceLocationScreenProp>();
    const onChangeSearchAddressText = async (text: string) => {
        addressPicker.setValue(text);
        if (
            text.length > MINIMUM_ADDRESS_LENGTH_TO_SHOW_PICKER &&
            countryPicker.value &&
            text.length > lastSearchTextLength
        ) {
            await getAndParseGeocoding(text, addressPicker.setItems, setLoadingGeocodingResponse, countryPicker.value);
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
        const placeId = await blockchainAdapter.createAddNewPlaceTransaction(
            web3Provider,
            placeName,
            selectedGeocodingElement.latitude,
            selectedGeocodingElement.longitude,
            selectedGeocodingElement.address,
            parseInt(placeTypePicker.value),
            onErrorAddingPlace,
        );
        setLoadingAddPlaceResponse(false);
        console.log('Transaction confirmed with place Id', placeId);
        setShowSuccessAndBackToHomeModal(true);
    };

    const onGoBackHome = () => {
        setShowSuccessAndBackToHomeModal(false);
        navigation.popToTop();
    };

    const backgroundOpacity = showErrorModal || showSuccessAndBackToHomeModal ? 0.5 : 1;

    return (
        <KeyboardAvoidingView
            style={{ ...bottomTabScreenStyles.container, opacity: backgroundOpacity }}
            behavior="padding"
            keyboardVerticalOffset={40}
        >
            <DecentravellerHeadingText text={addPlaceScreenWordings.CREATE_PLACE_LOCATION_HEADING(placeName)} />
            <DecentravellerPicker
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
            <DecentravellerPicker
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
            <DecentravellerInformativeModal
                informativeText={`${placeName} was created successfully`}
                visible={showSuccessAndBackToHomeModal}
                closeModalText={'Go back to home'}
                handleCloseModal={() => onGoBackHome()}
            />
        </KeyboardAvoidingView>
    );
};

export default CreatePlaceLocationScreen;
