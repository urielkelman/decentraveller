import DropDownPicker from 'react-native-dropdown-picker';
import { View } from 'react-native';
import React from "react";

export interface PickerItem {
    label: string;
    value: string;
}

export type PickerCreatePlaceProps = {
  items: PickerItem[];
  setItems: React.Dispatch<React.SetStateAction<PickerItem[]>>;
};

const PickerCreatePlace: React.FC<PickerCreatePlaceProps> = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [items, setItems] = React.useState<PickerItem[]>([]);

    return <View>
        <DropDownPicker
            open={open}
            setOpen={setOpen}
        />
    </View>;
};

export default PickerCreatePlace;
