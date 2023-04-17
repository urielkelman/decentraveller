import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { createAddNewPlaceTransaction } from '../../../blockchain/blockhainAdapter';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import HeadingTextCreatePlace from './HeadingTextCreatePlace';
import { addPlaceScreenStyles } from '../../../styles/addPlaceScreensStyles';
import DescriptionTextCreatePlace from './DescriptionTextCreatePlace';
import { addPlaceScreenWordings } from './wording';
import CreatePlaceProvider, {CreatePlaceContextType, useCreatePlaceContext} from "./CreatePlaceContext";
import PickerCreatePlace from "./PickerCreatePlace";
import CreatePlaceContext from "./CreatePlaceContext";
import CreatePlaceTextInput from "./CreatePlaceTextInput";

const CreatePlaceFirstScreen = () => {
    const connector = useWalletConnect();
    const [lastHash, setLastHash] = React.useState<string>(undefined);
    const tourismField = 'Gastronomic';
    const latitude = '-34.06';
    const longitude = '34.06';

    const { placeTypePicker, placeName, setPlaceName } = useCreatePlaceContext();

    const createNewPlaceTransaction = async () => {
        const hash = await createAddNewPlaceTransaction(connector, 'Mc Donalds');
        setLastHash(hash);
    };

    const lastHashComp = () => {
        if (lastHash) return <Text>{lastHash}</Text>;
        return <></>;
    };

    return (
        <View style={addPlaceScreenStyles.container}>
            <HeadingTextCreatePlace text={addPlaceScreenWordings.CREATE_PLACE_HEADING} />
            <DescriptionTextCreatePlace />
            <PickerCreatePlace
                titleText={addPlaceScreenWordings.CREATE_PLACE_PLACEHOLDER_PLACE_TYPE}
                dropdownPlaceholder={addPlaceScreenWordings.CREATE_PLACE_DROPDOWN_PLACEHOLDER}
                items={placeTypePicker.items}
                setItems={placeTypePicker.setItems}
                value={placeTypePicker.value}
                setValue={placeTypePicker.setValue}
                open={placeTypePicker.open}
                setOpen={placeTypePicker.setOpen}
            />
            <CreatePlaceTextInput text={placeName} setTextValue={setPlaceName} placeholder={addPlaceScreenWordings.CREATE_PLACE_PLACE_NAME_INPUT_PLACEHOLDER} />
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    backgroundColor: '#DDDDDD',
                    padding: 10,
                }}
                onPress={createNewPlaceTransaction}
            >
                <View>
                    <Text>Submit new place</Text>
                </View>
            </TouchableOpacity>
            {lastHashComp()}
        </View>

    );
};

export default CreatePlaceFirstScreen;
