import React from 'react';
import { TextInput, View } from 'react-native';
import { registrationIndicationTextStyles } from '../../../styles/registrationScreensStyles';

export type CreatePlaceTextInputProps = {
    text: string | undefined;
    setTextValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
};

const CreatePlaceTextInput: React.FC<CreatePlaceTextInputProps> = ({ text, setTextValue, placeholder }) => (
    <View style={registrationIndicationTextStyles.textInputContainer}>
        <TextInput
            style={registrationIndicationTextStyles.textInputField}
            placeholder={placeholder}
            value={text}
            onChangeText={setTextValue}
        />
    </View>
);

export default CreatePlaceTextInput;
