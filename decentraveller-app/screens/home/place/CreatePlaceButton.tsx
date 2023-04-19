import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { addPlaceButtonStyle } from '../../../styles/addPlaceScreensStyles';

export type CreatePlaceButtonProps = {
    text: string;
    onPress: () => void;
};

const CreatePlaceButton: React.FC<CreatePlaceButtonProps> = ({ text, onPress }) => {
    return (
        <TouchableOpacity style={addPlaceButtonStyle.button} onPress={onPress}>
            <View style={addPlaceButtonStyle.buttonTextView}>
                <Text style={addPlaceButtonStyle.text}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default CreatePlaceButton;
