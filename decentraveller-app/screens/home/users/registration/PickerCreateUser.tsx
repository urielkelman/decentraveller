import DropDownPicker from 'react-native-dropdown-picker';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {PickerUserItem} from "./CreateUserContext";

const addUserIndicationTextStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    text: {
        fontFamily: 'Montserrat_500Medium',
        color: '#676666',
        display: 'flex',
        flexDirection: 'row',
    },
    inputField: {
        borderRadius: 20,
        borderColor: 'white',
    },
    pickerInputField: {
        fontFamily: 'Montserrat_500Medium',
    },
    textInputContainer: {
        width: '80%',
    },
    textInputField: {
        fontFamily: 'Montserrat_500Medium',
        backgroundColor: 'white',
        borderRadius: 20,
    },
});

export type PickerCreateUserProps = {
    titleText: string;
    dropdownPlaceholder: string;
    items: PickerUserItem[];
    setItems: React.Dispatch<React.SetStateAction<PickerUserItem[]>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpen: () => void;
    searchable: boolean;
    zIndex?: number;
    zIndexInverse?: number;
    onChangeSearchText?: (text: string) => void | undefined;
};


const PickerCreateUser: React.FC<PickerCreateUserProps> = ({
    titleText,
    dropdownPlaceholder,
    items,
    setItems,
    value,
    setValue,
    open,
    onOpen,
    setOpen,
    zIndex = 1000,
    zIndexInverse = 1000,
    searchable,
    onChangeSearchText = undefined,
}) => {
    return (
        <View style={addUserIndicationTextStyles.container}>
            <Text style={addUserIndicationTextStyles.text}>{titleText}</Text>
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                onOpen={onOpen}
                items={items}
                setItems={setItems}
                value={value}
                setValue={setValue}
                style={addUserIndicationTextStyles.inputField}
                placeholder={dropdownPlaceholder}
                textStyle={addUserIndicationTextStyles.pickerInputField}
                zIndex={zIndex}
                zIndexInverse={zIndexInverse}
                searchable={searchable}
                onChangeSearchText={onChangeSearchText}
            />
        </View>
    );
};

PickerCreateUser.defaultProps = {
    onChangeSearchText: undefined,
};

export default PickerCreateUser;