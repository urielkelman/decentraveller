import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { createAddNewPlaceTransaction } from '../../blockchain/blockhainAdapter';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const CreatePlace = () => {
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
        <View>
            <Text>Place name</Text>
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
    );
};

export default CreatePlace;
