import React from 'react';
import { TextInput, View } from 'react-native';
import { addPlaceIndicationTextStyles } from '../../styles/bottomTabScreensStyles';

export type CreatePlaceTextInputProps = {
    text: string | undefined;
    setTextValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
};

const DecentravellerTextInput: React.FC<CreatePlaceTextInputProps> = ({ text, setTextValue, placeholder }) => (
    <View style={addPlaceIndicationTextStyles.textInputContainer}>
        <TextInput
            style={addPlaceIndicationTextStyles.textInputField}
            placeholder={placeholder}
            value={text}
            onChangeText={setTextValue}
        />
    </View>
);

export default DecentravellerTextInput;
