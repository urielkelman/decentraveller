import React from 'react';
import {ISOCodeByCountry} from "./countriesConfig";

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
};

export type CreatePlaceContextType = {
    placeTypePicker: PickerStateContextType;
    placeName: string;
    setPlaceName: (string) => void;
    countryPicker: PickerStateContextType;
};

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
    const [countryPickerItems, setCountryPickerItems] = React.useState<PickerItem[]>(
        Object.keys(ISOCodeByCountry).map(country => (
            { label: country, value: ISOCodeByCountry[country]}
        ))
    );
    const [countryPickerValue, setCountryPickerValue] = React.useState<string>(null);
    const [countryPickerOpen, setCountryPickerOpen] = React.useState<boolean>(false);

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
                },
                placeName,
                setPlaceName,
                countryPicker: {
                    items: countryPickerItems,
                    setItems: setCountryPickerItems,
                    value: countryPickerValue,
                    setValue: setCountryPickerValue,
                    open: countryPickerOpen,
                    setOpen: setCountryPickerOpen

                }
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
