import React, {useContext, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NicknameTextInput from './NicknameTextInput';
import PickerCreateUser from './PickerCreateUser';
import NextButton from './NextButton';
import {addPlaceScreenWordings} from "../../home/place/wording";
import {PickerUserItem, useCreateUserContext} from './CreateUserContext';
import {PickerItem, useCreatePlaceContext} from "../../home/place/CreatePlaceContext";
import {ISOCodeByCountry} from "../../home/place/countriesConfig";

const RegisterUserScreen = () => {

    // TODO: Improve this
    const [interestPickerItems, setInterestPickerItems] = React.useState<PickerUserItem[]>([
        { label: 'Gastronomy', value: '0' },
        { label: 'Accommodation', value: '1' },
        { label: 'Entertainment', value: '2' },
        { label: 'Others', value: '3' },
    ]);

    const [interestPickerValue, setInterestPickerValue] = React.useState<string>(null);
    const [interestPickerOpen, setInterestPickerOpen] = React.useState<boolean>(false);

    const [countryPickerValue, setCountryPickerValue] = React.useState<string>(null);
    const [countryPickerOpen, setCountryPickerOpen] = React.useState<boolean>(false);
    const [countryPickerItems, setCountryPickerItems] = React.useState<PickerItem[]>(
        Object.keys(ISOCodeByCountry).map((country) => ({ label: country, value: ISOCodeByCountry[country] }))
    );


    const onOpenPicker = () => {
        setInterestPickerOpen(true);
        setCountryPickerOpen(false);
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
                items={countryPickerItems}
                setItems={setCountryPickerItems}
                value={countryPickerValue}
                setValue={setCountryPickerValue}
                open={countryPickerOpen}
                setOpen={setCountryPickerOpen}
                onOpen={() => onOpenPicker}
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
