import { Text, View } from 'react-native';
import { addPlaceHeadingTextStyles } from '../../styles/bottomTabScreensStyles';
import React from 'react';

export type HeadingTextProps = {
    text: string;
};

const DecentravellerHeadingText: React.FC<HeadingTextProps> = ({ text }) => (
    <View>
        <Text style={addPlaceHeadingTextStyles.text}>{text}</Text>
    </View>
);

export default DecentravellerHeadingText;
