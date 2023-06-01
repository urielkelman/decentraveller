import { Button, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useAppContext } from '../../../context/AppContext';
import React from 'react';
import { bottomTabScreenStyles } from '../../../styles/bottomTabScreensStyles';
import DecentravellerHeadingText from '../../../commons/components/DecentravellerHeadingText';
import { explorePlacesScreenWording } from './wording';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import DecentravellerDescriptionText from '../../../commons/components/DecentravellerDescriptionText';

const ExplorePlacesScreen = ({ navigation }) => {
    const appContext = useAppContext();

    console.log('Explore');

    return (
        <KeyboardAvoidingView style={bottomTabScreenStyles.container}>
            <DecentravellerHeadingText text={explorePlacesScreenWording.EXPLORE_PLACE_HEADING} />
            <DecentravellerDescriptionText text={explorePlacesScreenWording.EXPLORE_PLACE_DESCRIPTION} />
            <DecentravellerButton
                text={explorePlacesScreenWording.EXPLORE_PLACE_VISIT_COUNTRY_BUTTON}
                onPress={() => {}}
                loading={false}
            />
            <DecentravellerButton
                text={explorePlacesScreenWording.EXPLORE_PLACE_CLOSE_PLACES_BUTTON}
                onPress={() => {}}
                loading={false}
            />
        </KeyboardAvoidingView>
    );
};

export default ExplorePlacesScreen;
