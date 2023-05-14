import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { registrationButtonStyle } from '../../../styles/registrationScreensStyles';

export type CreatePlaceButtonProps = {
    text: string;
    onPress: () => void;
};

const CreatePlaceButton: React.FC<CreatePlaceButtonProps> = ({ text, onPress }) => {
    return (
        <TouchableOpacity style={registrationButtonStyle.button} onPress={onPress}>
            <View style={registrationButtonStyle.buttonTextView}>
                <Text style={registrationButtonStyle.text}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default CreatePlaceButton;
