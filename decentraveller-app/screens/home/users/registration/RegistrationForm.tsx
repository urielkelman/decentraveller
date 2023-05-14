import React, {useContext, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormInput from './FormInput';
import PickerCreateUser from './PickerCreateUser';
import NextButton from './NextButton';
import {addPlaceScreenWordings} from "../../place/wording";
import { useCreateUserContext } from './CreateUserContext';

const RegistrationForm = () => {

    //const { userPicker, nickname, setUserNickname } = useCreateUserContext();

    const handleSubmit = () => {};
    const setNick = () => {};


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tell us about you!</Text>
            <FormInput
                placeholder="Nickname"
                onChangeText={(value) => setNick()}
            />
            <PickerCreateUser
                titleText={addPlaceScreenWordings.CREATE_PLACE_PLACEHOLDER_COUNTRY}
                dropdownPlaceholder={addPlaceScreenWordings.CREATE_PLACE_COUNTRY_PLACEHOLDER}
                items={[
                    { label: 'United States', value: 'us' },
                    { label: 'Mexico', value: 'mx' },
                    { label: 'Canada', value: 'ca' },
                ]}
                setItems={null}
                value={null}
                setValue={null}
                open={null}
                setOpen={null}
                onOpen={null}
                searchable={true}
                zIndex={3000}
                zIndexInverse={1000}
            />
            <PickerCreateUser
                titleText={addPlaceScreenWordings.CREATE_PLACE_PLACEHOLDER_COUNTRY}
                dropdownPlaceholder={addPlaceScreenWordings.CREATE_PLACE_COUNTRY_PLACEHOLDER}
                items={[
                    { label: 'United States', value: 'us' },
                    { label: 'Mexico', value: 'mx' },
                    { label: 'Canada', value: 'ca' },
                ]}
                setItems={null}
                value={null}
                setValue={null}
                open={null}
                setOpen={null}
                onOpen={null}
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

export default RegistrationForm;
