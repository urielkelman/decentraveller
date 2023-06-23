import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { bottomTabButtonStyle } from '../../styles/bottomTabScreensStyles';

export type CreatePlaceButtonProps = {
    text: string;
    onPress: () => void;
    loading: boolean;
};

const DecentravellerButton: React.FC<CreatePlaceButtonProps> = ({ text, onPress, loading }) => {
    return (
        <TouchableOpacity style={bottomTabButtonStyle.button} onPress={onPress}>
            <View style={bottomTabButtonStyle.buttonTextView}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={bottomTabButtonStyle.text}>{text}</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default DecentravellerButton;
