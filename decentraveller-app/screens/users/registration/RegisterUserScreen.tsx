import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useCreateUserContext} from './CreateUserContext';
import {blockchainAdapter} from "../../../blockchain/blockhainAdapter";
import {useWalletConnect} from "@walletconnect/react-native-dapp";
import DecentravellerButton from "../../../commons/components/DecentravellerButton";
import DecentravellerTextInput from "../../../commons/components/DecentravellerTextInput";
import DecentravellerPicker from "../../../commons/components/DecentravellerPicker";
import {registrationScreenStyles} from "../../../styles/registrationScreensStyles";

const RegisterUserScreen = () => {

    const {interestPicker, countryPicker, nickname, setNickname}  = useCreateUserContext()
    const connector = useWalletConnect();


    const handleSubmit = async () => {
        const transactionHash = await blockchainAdapter.createRegisterUserTransaction(
            connector,
            nickname,
            countryPicker.value,
            interestPicker.value,
        );
        console.log('Transaction confirmed with hash', transactionHash);
    };

    return (
        <View style={registrationScreenStyles.container}>
            <Text style={registrationScreenStyles.title}>Tell us about you!</Text>
            <DecentravellerTextInput
                text={nickname}
                placeholder="Nickname"
                setTextValue={setNickname}
            />
            <DecentravellerPicker
                titleText={"Country"}
                dropdownPlaceholder={"Select Country"}
                items={countryPicker.items}
                setItems={countryPicker.setItems}
                value={countryPicker.value}
                setValue={countryPicker.setValue}
                open={countryPicker.open}
                setOpen={countryPicker.setOpen}
                onOpen= {countryPicker.onOpen}
                searchable={true}
                zIndex={3000}
                zIndexInverse={1000}
            />
            <DecentravellerPicker
                titleText={"Interest"}
                dropdownPlaceholder={"Gastronomy"}
                items={interestPicker.items}
                setItems={interestPicker.setItems}
                value={interestPicker.value}
                setValue={interestPicker.setValue}
                open={interestPicker.open}
                setOpen={interestPicker.setOpen}
                onOpen= {interestPicker.onOpen}
                searchable={true}
                zIndex={3000}
                zIndexInverse={1000}
            />


            <DecentravellerButton loading={false} text="Finish" onPress={handleSubmit} />
        </View>
    );
};

export default RegisterUserScreen;
