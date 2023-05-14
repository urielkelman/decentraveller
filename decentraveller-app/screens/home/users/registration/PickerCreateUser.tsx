import DropDownPicker from 'react-native-dropdown-picker';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {PickerUserItem} from "./CreateUserContext";
import {registrationIndicationTextStyles} from "../../../../styles/registrationScreensStyles";

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
        <View style={registrationIndicationTextStyles.container}>
            <Text style={registrationIndicationTextStyles.text}>{titleText}</Text>
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                onOpen={onOpen}
                items={items}
                setItems={setItems}
                value={value}
                setValue={setValue}
                style={registrationIndicationTextStyles.inputField}
                placeholder={dropdownPlaceholder}
                textStyle={registrationIndicationTextStyles.pickerInputField}
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