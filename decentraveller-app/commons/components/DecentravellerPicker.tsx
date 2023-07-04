import DropDownPicker from 'react-native-dropdown-picker';
import { Text, View } from 'react-native';
import React from 'react';
import { bottomTabIndicationTextStyles } from '../../styles/bottomTabScreensStyles';
import { PickerItem } from '../types';

export type PickerCreatePlaceProps = {
    titleText?: string;
    dropdownPlaceholder: string;
    items: PickerItem[];
    setItems: React.Dispatch<React.SetStateAction<PickerItem[]>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpen: () => void;
    onClose?: () => void;
    onSelection?: (PickerItem) => void;
    searchable: boolean;
    zIndex?: number;
    zIndexInverse?: number;
    onChangeSearchText?: (text: string) => void | undefined;
    loading?: boolean;
    disableLocalSearch?: boolean;
    marginBottom?: number;
    showTitle?: boolean;
    marginLeft?: number;
    marginRight?: number;
};

const DecentravellerPicker: React.FC<PickerCreatePlaceProps> = ({
    titleText = 'Title',
    dropdownPlaceholder,
    items,
    setItems,
    value,
    setValue,
    open,
    onOpen,
    onSelection,
    setOpen,
    zIndex = 1000,
    zIndexInverse = 1000,
    searchable,
    onChangeSearchText = undefined,
    loading = false,
    disableLocalSearch = false,
    marginBottom = bottomTabIndicationTextStyles.container.marginBottom,
    marginLeft = bottomTabIndicationTextStyles.container.marginLeft,
    marginRight = bottomTabIndicationTextStyles.container.marginRight,
    showTitle = true,
}) => {
    return (
        <View
            style={{
                ...bottomTabIndicationTextStyles.container,
                marginBottom: marginBottom,
                marginRight: marginRight,
                marginLeft: marginLeft,
            }}
        >
            {showTitle && <Text style={bottomTabIndicationTextStyles.text}>{titleText}</Text>}
            <DropDownPicker
                open={open}
                setOpen={setOpen}
                onOpen={onOpen}
                onSelectItem={onSelection}
                items={items}
                setItems={setItems}
                value={value}
                setValue={setValue}
                style={bottomTabIndicationTextStyles.inputField}
                placeholder={dropdownPlaceholder}
                textStyle={bottomTabIndicationTextStyles.pickerInputField}
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
