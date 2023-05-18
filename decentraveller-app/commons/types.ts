import React from "react";

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