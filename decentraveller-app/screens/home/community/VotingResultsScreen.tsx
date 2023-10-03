import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { ruleDetailStyles } from '../../../styles/communityStyles';
import { Rule } from './types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RuleStatus } from '../../../api/response/rules';
import { useAppContext } from '../../../context/AppContext';
import { rulesService } from '../../../blockchain/service/rulesService';
import { BlockchainProposalStatus } from '../../../blockchain/types';
import { communityWording } from './wording';

type RuleDetailParams = {
    rule: Rule | null | undefined;
};

type RuleDetailProps = {
    route: RouteProp<Record<string, RuleDetailParams>, string>;
};

export type RuleAction = {
    action: () => {};
    label: string;
};

const VotingResultsScreen: React.FC<RuleDetailProps> = ({ route }) => {
    const { web3Provider, connectionContext } = useAppContext();
    const navigation = useNavigation();

    return (
        <View>
            <View style={ruleDetailStyles.cardContainer}>
                <View>
                    <Text style={ruleDetailStyles.label}>{"The partial results of voting"}</Text>
                </View>
            </View>

            <View style={ruleDetailStyles.cardContainer}>
                <View style={{flexDirection: 'column',}}>
                    <View style={{flexDirection: 'row',}}>
                            <Text style={ruleDetailStyles.description}>{"Favor"}</Text>
                            <Text style={[ruleDetailStyles.description, {marginLeft:150}]}>{"Against"}</Text>
                    </View>
                    <View style={{flexDirection: 'row',}}>
                        <Text style={ruleDetailStyles.description}>{"150"}</Text>
                        <Text style={[ruleDetailStyles.description, {marginLeft:220}]}>{"250"}</Text>
                    </View>
                </View>
            </View>

            <View style={ruleDetailStyles.cardContainer}>
                <View style={ruleDetailStyles.cardContent}>
                    <View style={ruleDetailStyles.textContainer}>
                        <Text style={ruleDetailStyles.headerText}>Voting power: 150</Text>
                        <View style={{ maxWidth: '95%' }}>
                            <Text style={ruleDetailStyles.explanationText}>
                                {"Tu voting power es la fuerza que tiene tu voto para inclinar la votación y depende de tus tokens"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>


            <View style={ruleDetailStyles.cardContainer}>
                <View>
                    <Text style={ruleDetailStyles.subtitle}>"Esta votacion sigue abierta, puedes votar en ella"</Text>
                </View>
            </View>

            <View style={ruleDetailStyles.buttonContainer}>
                <DecentravellerButton text={"Back"} onPress={async () => {navigation.goBack()}} loading={false} />
            </View>

        </View>
    );

};

export default VotingResultsScreen;
