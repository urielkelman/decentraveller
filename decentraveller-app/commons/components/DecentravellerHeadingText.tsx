import { Text, View } from 'react-native';
import { addPlaceHeadingTextStyles } from '../../styles/addPlaceScreensStyles';
import React from 'react';

export type HeadingTextCreatePlaceProps = {
    text: string;
};

const DecentravellerHeadingText: React.FC<HeadingTextCreatePlaceProps> = ({ text }) => (
    <View>
        <Text style={addPlaceHeadingTextStyles.text}>{text}</Text>
    </View>
);

export default DecentravellerHeadingText;
