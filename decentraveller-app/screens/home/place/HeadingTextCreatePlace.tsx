import { Text, View } from 'react-native';
import { registrationHeadingTextStyles } from '../../../styles/registrationScreensStyles';
import React from 'react';

export type HeadingTextCreatePlaceProps = {
    text: string;
};

const HeadingTextCreatePlace: React.FC<HeadingTextCreatePlaceProps> = ({ text }) => (
    <View>
        <Text style={registrationHeadingTextStyles.text}>{text}</Text>
    </View>
);

export default HeadingTextCreatePlace;
