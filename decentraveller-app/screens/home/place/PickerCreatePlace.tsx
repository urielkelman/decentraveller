import DropDownPicker from 'react-native-dropdown-picker';
import { Text, View } from 'react-native';
import React from 'react';
import { addPlaceIndicationTextStyles } from '../../../styles/addPlaceScreensStyles';
import { PickerItem } from './CreatePlaceContext';

export type PickerCreatePlaceProps = {
    titleText: string;
    dropdownPlaceholder: string;
    items: PickerItem[];
    setItems: React.Dispatch<React.SetStateAction<PickerItem[]>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    searchable: boolean;
};

const PickerCreatePlace: React.FC<PickerCreatePlaceProps> = ({
    titleText,
    dropdownPlaceholder,
    items,
    setItems,
    value,
    setValue,
    open,
    setOpen,
    searchable,
}) => {
    return (
        <View style={addPlaceIndicationTextStyles.container}>
            <Text style={addPlaceIndicationTextStyles.text}>{titleText}</Text>
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                items={items}
                setItems={setItems}
                value={value}
                setValue={setValue}
                style={addPlaceIndicationTextStyles.inputField}
                placeholder={dropdownPlaceholder}
                textStyle={addPlaceIndicationTextStyles.pickerInputField}
                searchable={searchable}
            />
        </View>
    );
};

export default PickerCreatePlace;
