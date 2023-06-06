import React from 'react';
import { TextInput, View } from 'react-native';
import { bottomTabIndicationTextStyles } from '../../styles/bottomTabScreensStyles';

export type CreatePlaceTextInputProps = {
    text: string | undefined;
    setTextValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
};

const DecentravellerTextInput: React.FC<CreatePlaceTextInputProps> = ({ text, setTextValue, placeholder }) => (
    <View style={bottomTabIndicationTextStyles.textInputContainer}>
        <TextInput
            style={bottomTabIndicationTextStyles.textInputField}
            placeholder={placeholder}
            value={text}
            onChangeText={setTextValue}
        />
    </View>
);

export default DecentravellerTextInput;
