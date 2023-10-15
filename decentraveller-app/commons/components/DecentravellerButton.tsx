import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { bottomTabButtonStyle } from '../../styles/bottomTabScreensStyles';

export type CreatePlaceButtonProps = {
    text: string;
    onPress: () => void;
    loading: boolean;
    enabled?: boolean;
};

const DecentravellerButton: React.FC<CreatePlaceButtonProps> = ({ text, onPress, loading ,
                                                                    enabled= true}) => {

    return (
        <TouchableOpacity style={[bottomTabButtonStyle.button,
            enabled ? {} : bottomTabButtonStyle.disabled]}
                          onPress={onPress} disabled={!enabled}>
            <View style={bottomTabButtonStyle.buttonTextView}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={bottomTabButtonStyle.text}>{text}</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default DecentravellerButton;
