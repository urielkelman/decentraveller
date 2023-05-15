import React, {useContext, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NicknameTextInput from './NicknameTextInput';
import PickerCreateUser from './PickerCreateUser';
import NextButton from './NextButton';
import {addPlaceScreenWordings} from "../../place/wording";
import {PickerUserItem, useCreateUserContext} from './CreateUserContext';
import {useCreatePlaceContext} from "../../place/CreatePlaceContext";

const RegisterUserScreen = () => {

    const [interestPickerItems, setInterestPickerItems] = React.useState<PickerUserItem[]>([
        { label: 'Gastronomy', value: '0' },
        { label: 'Accommodation', value: '1' },
        { label: 'Entertainment', value: '2' },
        { label: 'Others', value: '3' },
    ]);

    const [interestPickerValue, setInterestPickerValue] = React.useState<string>(null);
    const [interestPickerOpen, setInterestPickerOpen] = React.useState<boolean>(false);

    const {countryPicker} = useCreatePlaceContext();


    const onOpenPicker = () => {
        setInterestPickerOpen(true);
    };

    const handleSubmit = () => {};
    const setNick = () => {};


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tell us about you!</Text>
            <NicknameTextInput
                text={""}
                placeholder="Nickname"
                setTextValue={(value) => setNick()}
            />
            <PickerCreateUser
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
            <PickerCreateUser
                titleText={"Interest"}
                dropdownPlaceholder={"Gastronomy"}
                items={interestPickerItems}
                setItems={setInterestPickerItems}
                value={interestPickerValue}
                setValue={setInterestPickerValue}
                open={interestPickerOpen}
                setOpen={setInterestPickerOpen}
                onOpen= {() => onOpenPicker}
                searchable={true}
                zIndex={3000}
                zIndexInverse={1000}
            />


            <NextButton title="Next" onPress={handleSubmit} />
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
