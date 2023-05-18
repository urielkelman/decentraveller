import React from 'react';
import { ISOCodeByCountry } from './countriesConfig';
import {PickerItem, PickerStateContextType} from "../../../commons/types";
import {interestsItems} from "../../../commons/global";

export interface GeocodingElement {
    address: string;
    latitude: string;
    longitude: string;
}

export type CreatePlaceContextType = {
    placeTypePicker: PickerStateContextType;
    placeName: string;
    setPlaceName: (string) => void;
    countryPicker: PickerStateContextType;
    addressPicker: PickerStateContextType;
};

enum CREATE_PLACE_PICKER {
    PLACE_TYPE,
    COUNTRY,
    ADDRESS,
}

const CreatePlaceContext = React.createContext<CreatePlaceContextType | null>(null);

const CreatePlaceProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [placeTypePickerItems, setPlaceTypePickerItems] = React.useState<PickerItem[]>(interestsItems);
    const [placeTypePickerValue, setPlaceTypePickerValue] = React.useState<string>(null);
    const [placeTypePickerOpen, setPlaceTypePickerOpen] = React.useState<boolean>(false);
    const [placeName, setPlaceName] = React.useState<string>(null);

    const [countryPickerValue, setCountryPickerValue] = React.useState<string>(null);
    const [countryPickerOpen, setCountryPickerOpen] = React.useState<boolean>(false);
    const [countryPickerItems, setCountryPickerItems] = React.useState<PickerItem[]>(
        Object.keys(ISOCodeByCountry).map((country) => ({ label: country, value: ISOCodeByCountry[country] }))
    );

    const [addressPickerValue, setAddressPickerValue] = React.useState<string>(null);
    const [addressPickerOpen, setAddressPickerOpen] = React.useState<boolean>(false);
    const [addressPickerItems, setAddressPickerItems] = React.useState<PickerItem[]>([]);

    const onOpenPicker = (pickerOpened: CREATE_PLACE_PICKER) => {
        switch (pickerOpened) {
            case CREATE_PLACE_PICKER.COUNTRY:
                setAddressPickerOpen(false);
                setPlaceTypePickerOpen(false);
                return;
            case CREATE_PLACE_PICKER.PLACE_TYPE:
                setCountryPickerOpen(false);
                setAddressPickerOpen(false);
                return;
            case CREATE_PLACE_PICKER.ADDRESS:
                setCountryPickerOpen(false);
                setPlaceTypePickerOpen(false);
                setAddressPickerItems(addressPickerItems.filter((item) => item.value === addressPickerValue));
                return;
            default:
                return;
        }
    };

    return (
        <CreatePlaceContext.Provider
            value={{
                placeTypePicker: {
                    items: placeTypePickerItems,
                    setItems: setPlaceTypePickerItems,
                    value: placeTypePickerValue,
                    setValue: setPlaceTypePickerValue,
                    open: placeTypePickerOpen,
                    setOpen: setPlaceTypePickerOpen,
                    onOpen: () => onOpenPicker(CREATE_PLACE_PICKER.PLACE_TYPE),
                },
                placeName,
                setPlaceName,
                countryPicker: {
                    items: countryPickerItems,
                    setItems: setCountryPickerItems,
                    value: countryPickerValue,
                    setValue: setCountryPickerValue,
                    open: countryPickerOpen,
                    setOpen: setCountryPickerOpen,
                    onOpen: () => onOpenPicker(CREATE_PLACE_PICKER.COUNTRY),
                },
                addressPicker: {
                    items: addressPickerItems,
                    setItems: setAddressPickerItems,
                    value: addressPickerValue,
                    setValue: setAddressPickerValue,
                    open: addressPickerOpen,
                    setOpen: setAddressPickerOpen,
                    onOpen: () => onOpenPicker(CREATE_PLACE_PICKER.ADDRESS),
                },
            }}
        >
            {children}
        </CreatePlaceContext.Provider>
    );
};

export const useCreatePlaceContext = (): CreatePlaceContextType => {
    return React.useContext(CreatePlaceContext) as CreatePlaceContextType;
};

export default CreatePlaceProvider;
