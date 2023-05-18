import React from 'react';
import {ISOCodeByCountry} from "../../home/place/countriesConfig";
import {PickerItem, PickerStateContextType} from "../../../commons/types";
import {interestsItems} from "../../../commons/global";

export type CreateUserContextType = {
    interestPicker: PickerStateContextType;
    countryPicker: PickerStateContextType;
    nickname: string;
    setNickname: (string) => void;
};

enum CREATE_USER_PICKER {
    INTEREST,
    COUNTRY
}

const CreateUserContext = React.createContext<CreateUserContextType | null>(null);

const CreateUserProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [nickname, setNickname] = React.useState<string>(null);

    const [interestPickerItems, setInterestPickerItems] = React.useState<PickerItem[]>(interestsItems);

    const [interestPickerValue, setInterestPickerValue] = React.useState<string>(null);
    const [interestPickerOpen, setInterestPickerOpen] = React.useState<boolean>(false);

    const [countryPickerValue, setCountryPickerValue] = React.useState<string>(null);
    const [countryPickerOpen, setCountryPickerOpen] = React.useState<boolean>(false);
    const [countryPickerItems, setCountryPickerItems] = React.useState<PickerItem[]>(
        Object.keys(ISOCodeByCountry).map((country) => ({ label: country, value: ISOCodeByCountry[country] }))
    );
    const onOpenPicker = (pickerOpened: CREATE_USER_PICKER) => {
        switch (pickerOpened) {
            case CREATE_USER_PICKER.INTEREST:
                setInterestPickerOpen(true);
                setCountryPickerOpen(false);
                return;
            case CREATE_USER_PICKER.COUNTRY:
                setInterestPickerOpen(false);
                setCountryPickerOpen(true);
                return;
            default:
                return;
        }
    };

    return (
        <CreateUserContext.Provider
            value={{
                interestPicker: {
                    items: interestPickerItems,
                    setItems: setInterestPickerItems,
                    value: interestPickerValue,
                    setValue: setInterestPickerValue,
                    open: interestPickerOpen,
                    setOpen: setInterestPickerOpen,
                    onOpen: () => onOpenPicker(CREATE_USER_PICKER.INTEREST),
                },
                countryPicker: {
                    items: countryPickerItems,
                    setItems: setCountryPickerItems,
                    value: countryPickerValue,
                    setValue: setCountryPickerValue,
                    open: countryPickerOpen,
                    setOpen: setCountryPickerOpen,
                    onOpen: () => onOpenPicker(CREATE_USER_PICKER.COUNTRY),
                },
                nickname: nickname,
                setNickname: setNickname
            }}
        >
            {children}
        </CreateUserContext.Provider>
    );
};

export const useCreateUserContext = (): CreateUserContextType => {
    return React.useContext(CreateUserContext) as CreateUserContextType;
};
export default CreateUserProvider;
