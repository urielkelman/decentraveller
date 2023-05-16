import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { registrationButtonStyle } from '../../../styles/registrationScreensStyles';

export type CreatePlaceButtonProps = {
    text: string;
    onPress: () => void;
    loading: boolean;
};

const CreatePlaceButton: React.FC<CreatePlaceButtonProps> = ({ text, onPress, loading }) => {
    return (
        <TouchableOpacity style={registrationButtonStyle.button} onPress={onPress}>
            <View style={registrationButtonStyle.buttonTextView}>
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={registrationButtonStyle.text}>{text}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default CreatePlaceButton;
