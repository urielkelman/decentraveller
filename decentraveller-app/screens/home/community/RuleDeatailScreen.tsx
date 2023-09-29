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
    const [actionExplanationLabel, setActionExplanationLabel] = useState('');
    const [statusExplanationLabel, setStatusExplanationLabel] = useState('')
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
        let buttonActionText = '';

        if (ruleSubStatus === BlockchainProposalStatus.EXECUTED) {
            action = rulesService.proposeRuleDeletion;
            buttonActionText = communityWording.PROPOSE_DELETE;
        } else if (ruleSubStatus === BlockchainProposalStatus.SUCCEEDED) {
            setActionExplanationLabel(communityWording.SUCCEDED_VOTATION_ACTION);
            setStatusExplanationLabel(communityWording.SUCCEDED_VOTATION_STATUS);
            action = rulesService.queueNewRule;
            buttonActionText = communityWording.ENQUEUE;
        } else if (ruleSubStatus === BlockchainProposalStatus.QUEUED) {
            setActionExplanationLabel(communityWording.QUEUED_VOTATION_ACTION);
            setStatusExplanationLabel(communityWording.QUEUED_VOTATION_STATUS);
            action = rulesService.executeNewRule;
            buttonActionText = communityWording.EXECUTE;
        } else if (ruleSubStatus === BlockchainProposalStatus.DEFEATED) {
            setActionExplanationLabel(communityWording.DEFEATED_VOTATION_ACTION);
            setStatusExplanationLabel(communityWording.DEFEATED_VOTATION_STATUS);
            action = navigation.goBack;
            buttonActionText = communityWording.GO_BACK;
        }

        return { action, label: buttonActionText };
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
        const actionLabel =
            rule.ruleSubStatus === BlockchainProposalStatus.PENDING
                ? communityWording.PENDING_VOTATION_ACTION
                : communityWording.ACTIVE_VOTATION_ACTION;

        const statusLabel =
            rule.ruleSubStatus === BlockchainProposalStatus.PENDING
                ? communityWording.PENDING_VOTATION_STATUS
                : communityWording.ACTIVE_VOTATION_STATUS;

        setActionExplanationLabel(actionLabel);
        setStatusExplanationLabel(statusLabel);

        return (
            <View style={ruleDetailStyles.buttonVoteContainer}>
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
                setActionExplanationLabel(communityWording.PROPOSE_DELETE_ACTION);
                setStatusExplanationLabel(communityWording.PROPOSE_DELETE_STATUS);
                setContentComponent(renderVoted());
                break;
            case RuleStatus.DELETED:
                setTitleLabel(communityWording.DELETED_STATUS);
                setActionExplanationLabel(communityWording.NO_ACTION_AVAILABLE);
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
        <View>
            <View style={ruleDetailStyles.cardContainer}>
                <View>
                    <Text style={ruleDetailStyles.label}>{titleLabel}</Text>
                </View>
            </View>

            <View style={ruleDetailStyles.cardContainer}>
                <View>
                    <Text style={ruleDetailStyles.headerText}>Statement rule is:</Text>
                    <View style={ruleDetailStyles.descriptionContainer}>
                        <Text style={ruleDetailStyles.description}>{rule.ruleStatement}</Text>
                    </View>
                </View>
            </View>

            <View style={ruleDetailStyles.cardContainer}>
                <View style={ruleDetailStyles.cardContent}>
                    <Image
                        source={require('../../../assets/images/info.png')}
                        style={ruleDetailStyles.icon}
                    />
                    <View style={ruleDetailStyles.textContainer}>
                        <Text style={ruleDetailStyles.headerText}>What's the meaning of the proposal status?</Text>
                        <View style={{ maxWidth: '95%' }}>
                            <Text style={ruleDetailStyles.explanationText}>
                                {statusExplanationLabel}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>


            <View style={ruleDetailStyles.cardContainer}>
                <View>
                    <Text style={ruleDetailStyles.subtitle}>{actionExplanationLabel}</Text>
                </View>
            </View>
            {contentComponent}
        </View>
    );

};

export default RuleDetailScreen;
