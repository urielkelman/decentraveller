import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { createAddNewPlaceTransaction } from '../../../blockchain/blockhainAdapter';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import HeadingTextCreatePlace from './HeadingTextCreatePlace';
import { addPlaceIndicationTextStyles, addPlaceScreenStyles } from '../../../styles/addPlaceScreensStyles';
import DescriptionTextCreatePlace from './DescriptionTextCreatePlace';
import { addPlaceScreenWordings } from './wording';
import CreatePlaceProvider from "./CreatePlaceContext";

const CreatePlaceFirstScreen = () => {
    const connector = useWalletConnect();
    const [lastHash, setLastHash] = React.useState<string>(undefined);
    const [placeName, setPlaceName] = React.useState<string>('');
    const tourismField = 'Gastronomic';
    const latitude = '-34.06';
    const longitude = '34.06';

    const createNewPlaceTransaction = async () => {
        const hash = await createAddNewPlaceTransaction(connector, 'Mc Donalds');
        setLastHash(hash);
    };

    const lastHashComp = () => {
        if (lastHash) return <Text>{lastHash}</Text>;
        return <></>;
    };

    return (
        <CreatePlaceProvider>
            <View style={addPlaceScreenStyles.container}>
                <HeadingTextCreatePlace text={addPlaceScreenWordings.CREATE_PLACE_HEADING} />
                <DescriptionTextCreatePlace />
                <TextInput style={{ borderWidth: 1, margin: 12, padding: 10 }} onChangeText={setPlaceName} />
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
        </CreatePlaceProvider>

    );
};

export default CreatePlaceFirstScreen;
