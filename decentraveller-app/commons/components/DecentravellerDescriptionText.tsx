import { Text, View } from 'react-native';
import { addPlaceDescriptionTextStyles } from '../../styles/bottomTabScreensStyles';
import { addPlaceScreenWordings } from '../../screens/home/place/wording';
import React from 'react';

export type DescriptionTextProps = {
    text: string;
};

const DecentravellerDescriptionText: React.FC<DescriptionTextProps> = ({ text }) => (
    <View>
        <Text style={addPlaceDescriptionTextStyles.text}>{text}</Text>
    </View>
);

export default DecentravellerDescriptionText;
