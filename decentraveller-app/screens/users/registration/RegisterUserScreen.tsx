import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NicknameTextInput from './NicknameTextInput';
import PickerCreateUser from './PickerCreateUser';
import NextButton from './NextButton';
import {useCreateUserContext} from './CreateUserContext';
import {blockchainAdapter} from "../../../blockchain/blockhainAdapter";
import {useWalletConnect} from "@walletconnect/react-native-dapp";

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
        <View style={styles.container}>
            <Text style={styles.title}>Tell us about you!</Text>
            <NicknameTextInput
                text={nickname}
                placeholder="Nickname"
                setTextValue={setNickname}
            />
            <PickerCreateUser
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
            <PickerCreateUser
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


            <NextButton title="Finish" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE1E1',
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
});

export default RegisterUserScreen;
