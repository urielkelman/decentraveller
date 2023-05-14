import React from 'react';

export interface PickerUserItem {
    label: string;
    value: string;
}

// TODO: Use this context to fill all pickers

export type PickerUserStateContextType = {
    items: PickerUserItem[];
    setItems: React.Dispatch<React.SetStateAction<PickerUserItem[]>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpen: () => void;
};

export type CreateUserContextType = {
    userPicker: PickerUserStateContextType;
    nickname: string;
    setUserNickname: (string) => void;
};

enum CREATE_USER_PICKER {
    INTEREST
}

const CreateUserContext = React.createContext<CreateUserContextType | null>(null);

const CreateUserProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [interestPickerItems, setInterestPickerItems] = React.useState<PickerUserItem[]>([
        { label: 'Gastronomy', value: '0' },
        { label: 'Accommodation', value: '1' },
        { label: 'Entertainment', value: '2' },
        { label: 'Others', value: '3' },
    ]);
    const [interestPickerValue, setInterestPickerValue] = React.useState<string>(null);
    const [interestPickerOpen, setInterestPickerOpen] = React.useState<boolean>(false);

    const onOpenPicker = (pickerOpened: CREATE_USER_PICKER) => {
        switch (pickerOpened) {
            case CREATE_USER_PICKER.INTEREST:
                setInterestPickerOpen(false);
                return;
            default:
                return;
        }
    };

    return (
        <CreateUserContext.Provider
            value={{
                userPicker: {
                    items: interestPickerItems,
                    setItems: setInterestPickerItems,
                    value: interestPickerValue,
                    setValue: setInterestPickerValue,
                    open: interestPickerOpen,
                    setOpen: setInterestPickerOpen,
                    onOpen: () => onOpenPicker(CREATE_USER_PICKER.INTEREST),
                },
                nickname: "",
                setUserNickname: (nickname) => {}
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
