import React, { useEffect, useState } from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { Rule } from './types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RuleStatus } from '../../../api/response/rules';
import { useAppContext } from '../../../context/AppContext';
import { rulesService } from '../../../blockchain/service/rulesService';
import { BlockchainProposalStatus } from '../../../blockchain/types';
import { communityWording } from './wording';
import {mockRulesService} from "../../../blockchain/service/mockRulesService";
import {DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR} from "../../../commons/global";
import {votingResultsStyles} from "../../../styles/communityStyles";

type VotingResultsParams = {
    rule: Rule | null | undefined;
};

type RuleDetailProps = {
    route: RouteProp<Record<string, VotingResultsParams>, string>;
};

export type VotingResultsResponse = {
    favor: number;
    against: number;
};

const ruleService = mockRulesService

const VotingResultsScreen: React.FC<RuleDetailProps> = ({ route }) => {
    const { web3Provider, connectionContext } = useAppContext();
    const [favorVotes, setFavorVotes] = useState<number>(0);
    const [againstVotes, setAgainstVotes] = useState<number>(0);
    const { rule } = route.params

    const fetchVotingResults = async (rule: Rule) => {
        try {
            const {favor, against} = await ruleService.getResults(web3Provider, rule.proposalId)
            setFavorVotes(favor)
            setAgainstVotes(against)
        } catch (e) {

        }
    }

    useEffect(() => {
        fetchVotingResults(rule);
    }, [rule.ruleStatus]);

    const navigation = useNavigation();

    return (
        <View>
            <View style={votingResultsStyles.cardContainer}>
                <View>
                    <Text style={votingResultsStyles.label}>{"The partial results of voting"}</Text>
                </View>
            </View>

            <View style={votingResultsStyles.cardContainer}>
                <View style={{flexDirection: 'column',}}>
                    <View style={{flexDirection: 'row',}}>
                            <Text style={votingResultsStyles.description}>{"Favor"}</Text>
                            <Text style={[votingResultsStyles.description, {marginLeft:150}]}>{"Against"}</Text>
                    </View>
                    <View style={{flexDirection: 'row',}}>
                        <Text style={votingResultsStyles.description}>{favorVotes}</Text>
                        <Text style={[votingResultsStyles.description, {marginLeft:220}]}>{againstVotes}</Text>
                    </View>
                </View>
            </View>

            <View style={votingResultsStyles.cardContainer}>
                <View style={votingResultsStyles.cardContent}>
                    <View style={votingResultsStyles.textContainer}>
                        <Text style={votingResultsStyles.headerText}>Voting power: 150</Text>
                        <Text style={votingResultsStyles.explanationText}>
                            {"Tu voting power es la fuerza que tiene tu voto para inclinar la votación y depende de tus tokens"}
                        </Text>
                    </View>
                </View>
            </View>



            <View style={votingResultsStyles.cardContainer}>
                <View>
                    <Text style={votingResultsStyles.subtitle}>{"Esta votacion sigue abierta, puedes votar en ella"}</Text>
                </View>
            </View>

            <View style={votingResultsStyles.buttonContainer}>
                <DecentravellerButton text={"Back"} onPress={async () => {navigation.goBack()}} loading={false} />
            </View>

        </View>
    );

};

export default VotingResultsScreen;
