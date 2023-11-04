import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { communityScreenStyles } from '../../../styles/communityStyles';
import { useAppContext } from '../../../context/AppContext';

const CommunityScreen = ({ navigation }) => {
    const { web3Provider } = useAppContext();

    return (
        <View style={communityScreenStyles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('RulesScreen')}
                style={[communityScreenStyles.cardContainer, communityScreenStyles.halfScreenCard]}
            >
                <Text style={communityScreenStyles.title}>Rules</Text>
                <Text style={communityScreenStyles.subtitle}>See and manage Decentraveller rules.</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('ModerationsScreen')}
                style={[communityScreenStyles.cardContainer, communityScreenStyles.halfScreenCard]}>
                <Text style={communityScreenStyles.title}>Moderations</Text>
                <Text style={communityScreenStyles.subtitle}>My censored reviews and my disputes to vote.</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CommunityScreen;
