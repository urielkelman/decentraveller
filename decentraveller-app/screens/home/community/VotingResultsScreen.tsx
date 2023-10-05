import React, { useEffect, useState } from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { Rule } from './types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../../context/AppContext';
import {mockRulesService} from "../../../blockchain/service/mockRulesService";
import {votingResultsStyles} from "../../../styles/communityStyles";
import { PieChart } from 'react-native-chart-kit';
import {communityWording} from "./wording";


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

const rulesService = mockRulesService

const VotingResultsScreen: React.FC<RuleDetailProps> = ({ route }) => {
    const { web3Provider, connectionContext } = useAppContext();
    const [favorVotes, setFavorVotes] = useState<number>(0);
    const [againstVotes, setAgainstVotes] = useState<number>(0);
    const [votingPower, setVotingPower] = useState<number>(0);
    const { rule } = route.params

    const data = [
        {
            name: 'Favor',
            population: favorVotes,
            color: 'blue',
            legendFontColor: 'black',
            legendFontSize: 15,
        },
        {
            name: 'Against',
            population: againstVotes,
            color: 'red',
            legendFontColor: 'black',
            legendFontSize: 15,
        },
    ];

    const fetchVotingResults = async (rule: Rule) => {
        try {
            const {favor, against} = await rulesService.getResults(web3Provider, rule.proposalId)
            setFavorVotes(favor)
            setAgainstVotes(against)
        } catch (e) {

        }
    }

    const fetchVotingPower = async () => {
        try {
            const votingPowerResponse = await rulesService.getVotingPower(web3Provider, connectionContext.connectedAddress)
            setVotingPower(votingPowerResponse)
        } catch (e) {

        }
    }

    useEffect(() => {
        fetchVotingPower()
        fetchVotingResults(rule);
    }, [rule.ruleStatus]);

    const navigation = useNavigation();

    return (
        <View>
            <View style={votingResultsStyles.cardContainer}>
                <View>
                    <Text style={votingResultsStyles.label}>{"Proposal statement: " + rule.ruleStatement}</Text>
                </View>
            </View>

            <View style={votingResultsStyles.cardContainer}>
                <View style={{flexDirection: 'column',}}>
                    <View style={{flexDirection: 'row',}}>
                            <Text style={votingResultsStyles.description}>{"Voting results up to date"}</Text>
                    </View>
                </View>
                <View>
                    <PieChart
                        data={data}
                        width={300}
                        height={190}
                        chartConfig={{
                            backgroundColor: 'white',
                            backgroundGradientFrom: 'white',
                            backgroundGradientTo: 'white',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                    <View style={votingResultsStyles.legendContainer}>
                        {data.map((item, index) => (
                            <View key={index} style={votingResultsStyles.legendItem}>
                                <View style={[votingResultsStyles.legendColorBox, { backgroundColor: item.color }]} />
                                <Text>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={votingResultsStyles.cardContainer}>
                <View style={votingResultsStyles.cardContent}>
                    <View style={votingResultsStyles.textContainer}>
                        <Text style={votingResultsStyles.headerText}>{`Voting Power: ${votingPower}`}</Text>
                        <Text style={votingResultsStyles.explanationText}>
                            {communityWording.VOTING_POWER}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={votingResultsStyles.buttonContainer}>
                <DecentravellerButton text={"Back"} onPress={async () => {navigation.goBack()}} loading={false} />
            </View>

        </View>
    );

};


export default VotingResultsScreen;
