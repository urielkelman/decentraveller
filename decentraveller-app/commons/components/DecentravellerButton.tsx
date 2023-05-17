import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { addPlaceButtonStyle } from '../../styles/addPlaceScreensStyles';

export type CreatePlaceButtonProps = {
    text: string;
    onPress: () => void;
    loading: boolean;
};

const DecentravellerButton: React.FC<CreatePlaceButtonProps> = ({ text, onPress, loading }) => {
    return (
        <TouchableOpacity style={addPlaceButtonStyle.button} onPress={onPress}>
            <View style={addPlaceButtonStyle.buttonTextView}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={addPlaceButtonStyle.text}>{text}</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default DecentravellerButton;
