import React from 'react';
import { View, Text } from 'react-native';
import { useCreateUserContext } from './CreateUserContext';
import { blockchainAdapter } from '../../../blockchain/blockhainAdapter';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import DecentravellerTextInput from '../../../commons/components/DecentravellerTextInput';
import DecentravellerPicker from '../../../commons/components/DecentravellerPicker';
import { registrationScreenStyles } from '../../../styles/registrationScreensStyles';
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';
import { registerUserScreenWordings } from './wording';
import { useAppContext } from '../../../context/AppContext';

const RegisterUserScreen = ({ navigation }) => {
    const { interestPicker, countryPicker, nickname, setNickname } = useCreateUserContext();
    const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
    const { web3Provider } = useAppContext();

    const handleSubmit = async () => {
        const adapter = blockchainAdapter;

        const transactionHash = await adapter.createRegisterUserTransaction(
            web3Provider,
            nickname,
            countryPicker.value,
            interestPicker.value,
            onError,
        );

        if (!transactionHash) return;

        console.log('Transaction confirmed with hash', transactionHash);
        navigation.navigate('SuccessRegisterUserScreen');
    };
    const onError = () => {
        setShowErrorModal(true);
    };

    const backgroundOpacity = showErrorModal ? 0.5 : 1;

    return (
        <View style={{ ...registrationScreenStyles.container, opacity: backgroundOpacity }}>
            <Text style={registrationScreenStyles.title}>Tell us about you!</Text>
            <DecentravellerPicker
                titleText={registerUserScreenWordings.REGISTER_USER_TITLE_COUNTRY}
                dropdownPlaceholder={registerUserScreenWordings.REGISTER_USER_COUNTRY_PLACEHOLDER}
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
                titleText={registerUserScreenWordings.REGISTER_USER_TITLE_INTEREST}
                dropdownPlaceholder={registerUserScreenWordings.REGISTER_USER_INTEREST_PLACEHOLDER}
                items={interestPicker.items}
                setItems={interestPicker.setItems}
                value={interestPicker.value}
                setValue={interestPicker.setValue}
                open={interestPicker.open}
                setOpen={interestPicker.setOpen}
                onOpen={interestPicker.onOpen}
                searchable={true}
                zIndex={1000}
                zIndexInverse={3000}
            />
            <DecentravellerTextInput text={nickname} placeholder="Nickname" setTextValue={setNickname} />
            <DecentravellerButton loading={false} text="Finish" onPress={handleSubmit} />
            <DecentravellerInformativeModal
                informativeText={registerUserScreenWordings.REGISTER_USER_ERROR_INFORMATIVE_TEXT}
                visible={showErrorModal}
                closeModalText={'Close'}
                handleCloseModal={() => {
                    setShowErrorModal(false);
                }}
            />
        </View>
    );
};

export default RegisterUserScreen;
