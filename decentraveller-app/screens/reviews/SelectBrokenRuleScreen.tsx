import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DecentravellerButton from '../../commons/components/DecentravellerButton';
import { selectBrokenRuleScreenWordings } from './wording';
import { selectBrokenRuleScreenStyles } from '../../styles/addReviewStyles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackScreens } from '../home/HomeNavigator';
import { rulesService } from '../../blockchain/service/rulesService';
import { RuleResponse } from '../../api/response/rules';
import { Rule } from '../home/community/types';
import { BlockchainProposalStatus, BlockchainProposalStatusNames } from '../../blockchain/types';
import LoadingComponent from '../../commons/components/DecentravellerLoading';
import { moderationService } from '../../blockchain/service/moderationService';
import { SelectBrokenRuleScreenProps } from './types';
import { useAppContext } from '../../context/AppContext';

const SelectBrokenRuleScreen: React.FC<SelectBrokenRuleScreenProps> = ({ route }) => {
    const [ruleId, setRuleId] = React.useState<number>(0);
    const [ruleStatement, setRuleStatement] = React.useState<string>('');
    const [communityRules, setCommunityRules] = useState([]);
    const navigation = useNavigation<NavigationProp<HomeStackScreens>>();
    const [loadingRules, setLoadingRules] = useState(true);
    const { reviewId, placeId } = route.params;
    const { web3Provider } = useAppContext();
    const onClickCensor = async () => {
        await moderationService.censorReview(web3Provider, placeId, reviewId, ruleId);
        navigation.goBack(); // TODO: Improve this
    };
    const onTapStatement = async () => {
        navigation.navigate('DecentravellerRulesList', {
            ruleList: communityRules,
            minified: false,
            horizontal: false,
            selectionCallback: selectRuleCallback,
        });
    };

    const selectRuleCallback = (id: number, statement: string) => {
        setRuleId(id);
        setRuleStatement(statement);
        navigation.goBack();
    };

    useEffect(() => {
        fetchCommunityRules();
    }, []);
    const fetchCommunityRules = async () => {
        setLoadingRules(true);
        const communityRulesData = await rulesService.getFormerRules();
        setCommunityRules(mapRuleResponsesToRules(communityRulesData, BlockchainProposalStatusNames.EXECUTED));
        setLoadingRules(false);
    };

    function mapRuleResponsesToRules(ruleResponses: RuleResponse[], status): Rule[] {
        return ruleResponses.map((ruleResponse) => mapRuleResponseToRule(ruleResponse, status));
    }

    function mapRuleResponseToRule(ruleResponse: RuleResponse, status: string): Rule {
        const rule: Rule = {
            ruleId: ruleResponse.ruleId,
            proposalId: ruleResponse.proposalId,
            proposer: ruleResponse.proposer,
            ruleStatement: ruleResponse.ruleStatement,
            ruleStatus: ruleResponse.ruleStatus,
            ruleSubStatus: BlockchainProposalStatus[status],
            proposedAt: ruleResponse.proposedAt,
            executionTimeAt: ruleResponse.executionTimeAt,
        };

        return rule;
    }

    const statementOrDefault = () => {
        return ruleStatement != '' ? (
            <Text style={selectBrokenRuleScreenStyles.description}>{ruleStatement}</Text>
        ) : (
            <Text style={selectBrokenRuleScreenStyles.tapHereDescription}>{'Tap here to select rule'}</Text>
        );
    };

    return (
        <View style={selectBrokenRuleScreenStyles.container}>
            <Text style={selectBrokenRuleScreenStyles.title}>{selectBrokenRuleScreenWordings.TITLE}</Text>
            <Text style={selectBrokenRuleScreenStyles.subtitleText}> {selectBrokenRuleScreenWordings.SUBTITLE}</Text>
            <TouchableOpacity onPress={onTapStatement}>
                <View style={selectBrokenRuleScreenStyles.descriptionContainer}>
                    {loadingRules ? <LoadingComponent></LoadingComponent> : statementOrDefault()}
                </View>
            </TouchableOpacity>

            <View style={selectBrokenRuleScreenStyles.buttonContainer}>
                <DecentravellerButton
                    loading={false}
                    enabled={ruleStatement != ''}
                    text="Censor"
                    onPress={onClickCensor}
                />
            </View>
        </View>
    );
};

export default SelectBrokenRuleScreen;
