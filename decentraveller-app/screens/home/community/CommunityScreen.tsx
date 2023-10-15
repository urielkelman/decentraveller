import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RulesList from './RulesList';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { communityScreenStyles } from '../../../styles/communityStyles';
import { RuleResponse, RuleStatus } from '../../../api/response/rules';
import { useAppContext } from '../../../context/AppContext';
import { Rule } from './types';
import {BlockchainProposalStatus, BlockchainProposalStatusNames, BlockchainUserStatus} from '../../../blockchain/types';
import { communityWording } from './wording';
import {rulesService} from "../../../blockchain/service/rulesService";
import LoadingComponent from '../../../commons/components/DecentravellerLoading';
import { Picker } from '@react-native-picker/picker';

const CommunityScreen = ({ navigation }) => {
    const { web3Provider } = useAppContext();

    return (
        <View style={communityScreenStyles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('RulesScreen')}
            style={[communityScreenStyles.cardContainer,
                communityScreenStyles.halfScreenCard]}>
                <Text style={communityScreenStyles.title}>Rules</Text>
                <Text style={communityScreenStyles.subtitle}>See and manage Decentraveller rules.</Text>
            </TouchableOpacity>
            <TouchableOpacity
                              style={[communityScreenStyles.cardContainer,
                                  communityScreenStyles.halfScreenCard]}>
                <Text style={communityScreenStyles.title}>Moderations</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CommunityScreen;
