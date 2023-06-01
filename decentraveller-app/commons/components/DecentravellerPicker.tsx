import DropDownPicker from 'react-native-dropdown-picker';
import { Text, View } from 'react-native';
import React from 'react';
import { addPlaceIndicationTextStyles } from '../../styles/bottomTabScreensStyles';
import { PickerItem } from '../types';

export type PickerCreatePlaceProps = {
    titleText: string;
    dropdownPlaceholder: string;
    items: PickerItem[];
    setItems: React.Dispatch<React.SetStateAction<PickerItem[]>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpen: () => void;
    onClose?: () => void;
    searchable: boolean;
    zIndex?: number;
    zIndexInverse?: number;
    onChangeSearchText?: (text: string) => void | undefined;
    loading?: boolean;
    disableLocalSearch?: boolean;
};

const DecentravellerPicker: React.FC<PickerCreatePlaceProps> = ({
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
    loading = false,
    disableLocalSearch = false,
}) => {
    return (
        <View style={addPlaceIndicationTextStyles.container}>
            <Text style={addPlaceIndicationTextStyles.text}>{titleText}</Text>
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                onOpen={onOpen}
                items={items}
                setItems={setItems}
                value={value}
                setValue={setValue}
                style={addPlaceIndicationTextStyles.inputField}
                placeholder={dropdownPlaceholder}
                textStyle={addPlaceIndicationTextStyles.pickerInputField}
                dropDownDirection="BOTTOM"
                max={5}
                itemSeparator={true}
                zIndex={zIndex}
                zIndexInverse={zIndexInverse}
                searchable={searchable}
                onChangeSearchText={onChangeSearchText}
                loading={loading}
                disableLocalSearch={disableLocalSearch}
            />
        </View>
    );
};

DecentravellerPicker.defaultProps = {
    onChangeSearchText: undefined,
};

export default DecentravellerPicker;
