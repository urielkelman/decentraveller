import React from 'react';
import { ISOCodeByCountry } from './countriesConfig';

export interface GeocodingElement {
    address: string;
    latitude: string;
    longitude: string;
}

export interface PickerItem {
    label: string;
    value: string;
}

export type PickerStateContextType = {
    items: PickerItem[];
    setItems: React.Dispatch<React.SetStateAction<PickerItem[]>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpen: () => void;
};

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
    const [placeTypePickerItems, setPlaceTypePickerItems] = React.useState<PickerItem[]>([
        { label: 'Gastronomy', value: '0' },
        { label: 'Accommodation', value: '1' },
        { label: 'Entertainment', value: '2' },
        { label: 'Others', value: '3' },
    ]);
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
