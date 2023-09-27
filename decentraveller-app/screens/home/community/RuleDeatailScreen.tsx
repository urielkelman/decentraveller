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
    action: () => void;
    inFavor: () => void;
    against: () => void;
};

type RuleDetailProps = {
    route: RouteProp<Record<string, RuleDetailParams>, string>;
};

export type RuleAction = {
    action: () => {};
    label: string;
};

const RuleDetailScreen: React.FC<RuleDetailProps> = ({ route }) => {
    const [titleLabel, setTitleLabel] = useState('');
    const [subTitleLabel, setSubTitleLabel] = useState('');
    const { web3Provider, connectionContext } = useAppContext();
    const [contentComponent, setContentComponent] = useState<React.ReactNode | null>(null);
    const navigation = useNavigation();
    const { rule, action } = route.params;

    useEffect(() => {
        renderContentByRuleStatus(rule.ruleStatus);
    }, [rule.ruleStatus]);

    const getActionByStatus = (): RuleAction => {
        const { ruleSubStatus } = rule;
        let action = null;
        let label = '';

        if (ruleSubStatus === BlockchainProposalStatus.EXECUTED) {
            action = rulesService.proposeRuleDeletion;
            label = communityWording.PROPOSE_DELETE;
        } else if (ruleSubStatus === BlockchainProposalStatus.SUCCEEDED) {
            setSubTitleLabel(communityWording.SUCCEDED_VOTATION);
            action = rulesService.queueNewRule;
            label = communityWording.ENQUEUE;
        } else if (ruleSubStatus === BlockchainProposalStatus.QUEUED) {
            setSubTitleLabel(communityWording.QUEUED_VOTATION);
            action = rulesService.executeNewRule;
            label = communityWording.EXECUTE;
        } else if (ruleSubStatus === BlockchainProposalStatus.DEFEATED) {
            setSubTitleLabel(communityWording.DEFEATED_VOTATION);
            action = navigation.goBack;
            label = communityWording.GO_BACK;
        }

        return { action, label };
    };

    const renderPending = () => {
        const { ruleSubStatus } = rule;
        if (ruleSubStatus == BlockchainProposalStatus.ACTIVE || ruleSubStatus == BlockchainProposalStatus.PENDING) {
            return renderVoting;
        } else {
            return renderVoted;
        }
    };

    const renderVoted = () => {
        const { ruleStatus } = rule;

        const { action, label }: RuleAction = getActionByStatus();

        return (
            <React.Fragment>
                {ruleStatus !== RuleStatus.DELETED && (
                    <View style={ruleDetailStyles.buttonContainer}>
                        <DecentravellerButton text={label} onPress={action} loading={false} />
                    </View>
                )}
            </React.Fragment>
        );
    };

    const voteForProposal = async (voteFunction) => {
        const hasVotedInProposal = await rulesService.hasVotedInProposal(
            web3Provider,
            rule.proposalId,
            connectionContext.connectedAddress,
        );
        console.log('hasVotedInProposal', hasVotedInProposal);
        if (!hasVotedInProposal) {
            const voteTxHash = await voteFunction(web3Provider, rule.proposalId);
            console.log('voteTxHash', voteTxHash);
        }
    };

    const renderVoting = () => {
        const subTitle =
            rule.ruleSubStatus === BlockchainProposalStatus.PENDING
                ? communityWording.PENDING_VOTATION
                : communityWording.ACTIVE_VOTATION;
        setSubTitleLabel(subTitle);

        return (
            <View style={ruleDetailStyles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => voteForProposal(rulesService.voteInFavorOfProposal)}
                    disabled={rule.ruleSubStatus === BlockchainProposalStatus.PENDING}
                    style={[rule.ruleSubStatus === BlockchainProposalStatus.PENDING && ruleDetailStyles.disabledButton]}
                >
                    <Image source={require('../../../assets/images/favor.png')} style={ruleDetailStyles.buttonImage} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => voteForProposal(rulesService.voteAgainstProposal)}
                    disabled={rule.ruleSubStatus === BlockchainProposalStatus.PENDING}
                    style={[
                        ruleDetailStyles.buttonMargin,
                        rule.ruleSubStatus === BlockchainProposalStatus.PENDING && ruleDetailStyles.disabledButton,
                    ]}
                >
                    <Image source={require('../../../assets/images/contra.png')} style={ruleDetailStyles.buttonImage} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderContentByRuleStatus = (ruleStatus: RuleStatus) => {
        switch (ruleStatus) {
            case RuleStatus.APPROVED:
                setTitleLabel(communityWording.APPROVED_STATUS);
                setSubTitleLabel(communityWording.PROPOSE_DELETE_ACTIONABLE);
                setContentComponent(renderVoted());
                break;
            case RuleStatus.DELETED:
                setTitleLabel(communityWording.DELETED_STATUS);
                setSubTitleLabel(communityWording.NO_ACTION_AVAILABLE);
                setContentComponent(renderVoted());
                break;
            case RuleStatus.PENDING_APPROVAL:
                setTitleLabel(communityWording.PENDING_APPROVAL_STATUS);
                setContentComponent(renderPending());
                break;
            case RuleStatus.PENDING_DELETED:
                setTitleLabel(communityWording.PENDING_DELETED_STATUS);
                setContentComponent(renderPending());
                break;
        }
    };

    return (
        <View style={[ruleDetailStyles.container]}>
            <Text style={ruleDetailStyles.label}>{titleLabel}</Text>
            <View style={ruleDetailStyles.header}>
                <Text style={ruleDetailStyles.headerText}>Rule</Text>
            </View>
            <View style={ruleDetailStyles.descriptionContainer}>
                <Text style={ruleDetailStyles.description}>{rule.ruleStatement}</Text>
            </View>
            <Text style={ruleDetailStyles.subtitle}>
                <Text style={ruleDetailStyles.italic}>{subTitleLabel}</Text>
            </Text>
            {contentComponent}
        </View>
    );
};

export default RuleDetailScreen;
