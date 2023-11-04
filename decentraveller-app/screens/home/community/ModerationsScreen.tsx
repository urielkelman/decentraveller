import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { communityScreenStyles } from '../../../styles/communityStyles';
import { useAppContext } from '../../../context/AppContext';

const ModerationsScreen = ({ navigation }) => {
    const { web3Provider } = useAppContext();

    return (
        <View style={communityScreenStyles.container}>
            <TouchableOpacity
                onPress={() => {navigation.navigate('MyCensoredReviews')}}
                style={[communityScreenStyles.cardContainer, communityScreenStyles.thirdScreenCard]}
            >
                <Text style={communityScreenStyles.title}>My censored reviews</Text>
                <Text style={communityScreenStyles.subtitle}>See and manage your previously censored reviews.</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {}}
                style={[communityScreenStyles.cardContainer, communityScreenStyles.thirdScreenCard]}>
                <Text style={communityScreenStyles.title}>Disputes to vote</Text>
                <Text style={communityScreenStyles.subtitle}>The disputes in which you are allowed to vote.</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {navigation.navigate('CensoredReviews')}}
                style={[communityScreenStyles.cardContainer, communityScreenStyles.thirdScreenCard]}>
                <Text style={communityScreenStyles.title}>Censored reviews</Text>
                <Text style={communityScreenStyles.subtitle}>The latest reviews censored by the community.</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ModerationsScreen;
