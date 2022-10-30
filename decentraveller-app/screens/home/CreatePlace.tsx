import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';

const CreatePlace = () => {
    const [placeName, setPlaceName] = React.useState<string>('');
    const tourismField = 0;
    const latitude = '-34.06';
    const longitude = '34.06';

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
            >
                <View>
                    <Text>Submit new place</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default CreatePlace;
