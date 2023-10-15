import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DecentravellerButton from '../../../commons/components/DecentravellerButton';
import { communityScreenStyles, ruleDetailStyles } from '../../../styles/communityStyles';
import { Rule } from './types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RuleStatus } from '../../../api/response/rules';
import { useAppContext } from '../../../context/AppContext';
import { BlockchainProposalStatus } from '../../../blockchain/types';
import { communityWording } from './wording';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackScreens } from '../HomeNavigator';
import DecentravellerInformativeModal from '../../../commons/components/DecentravellerInformativeModal';
import { rulesService } from '../../../blockchain/service/rulesService';
import { blockchainAdapter } from '../../../blockchain/blockhainAdapter';
import { Simulate } from 'react-dom/test-utils';
import load = Simulate.load;
import LoadingComponent from '../../../commons/components/DecentravellerLoading';

type RuleDetailScreenProp = StackNavigationProp<HomeStackScreens, 'VotingResultsScreen'>;

type RuleDetailParams = {
    rule: Rule | null | undefined;
    refreshCallback: () => void
};

type RuleDetailProps = {
    route: RouteProp<Record<string, RuleDetailParams>, string>;
};

type RuleAction = {
    action: () => {};
    label: string;
    precondition: any;
    preconditionFailedMessage: string;
};

const RuleDetailScreen: React.FC<RuleDetailProps> = ({ route }) => {
    const [titleLabel, setTitleLabel] = useState('');
    const [actionExplanationLabel, setActionExplanationLabel] = useState('');
    const [statusExplanationLabel, setStatusExplanationLabel] = useState('')
    const [showSuccessVotingModal, setShowSuccessVotingModal] = React.useState<boolean>(false);
    const [showAlreadyVotedModal, setShowAlreadyVotedModal] = React.useState<boolean>(false);
    const [loadingAction, setLoadingAction] = useState(true);
    const { web3Provider, connectionContext } = useAppContext();
    const [contentComponent, setContentComponent] = useState<React.ReactNode | null>(null);
    const navigation = useNavigation<RuleDetailScreenProp>();
    const { rule, refreshCallback } = route.params;

    useEffect(() => {
        renderContentByRule(rule)
    }, [rule.ruleStatus]);

    const onCloseModal = () => {
        setShowSuccessVotingModal(false);
        setShowAlreadyVotedModal(false);
    };

    const getActionByStatus = (): RuleAction => {
        const { ruleStatus, ruleSubStatus } = rule;

        const statusActionMap = {
            [BlockchainProposalStatus.EXECUTED]: {
                action: rulesService.proposeRuleDeletion,
                buttonActionText: communityWording.PROPOSE_DELETE,
                precondition: async (rule: Rule) => {
                    return rule.ruleStatus == RuleStatus.APPROVED
                },
                preconditionFailedMessage: "The rule is already being proposed to delete",
            },
            [BlockchainProposalStatus.SUCCEEDED]: {
                action: ruleStatus === RuleStatus.PENDING_APPROVAL ? () => rulesService.queueNewRule(web3Provider, rule) : () => rulesService.queueRuleDeletion(web3Provider, rule),
                buttonActionText: communityWording.ENQUEUE,
                precondition: undefined,
                preconditionFailedMessage: "",
                explanations: {
                    action: communityWording.SUCCEDED_VOTATION_ACTION,
                    status: communityWording.SUCCEDED_VOTATION_STATUS,
                },
            },
            [BlockchainProposalStatus.QUEUED]: {
                action: ruleStatus === RuleStatus.PENDING_APPROVAL ? () => rulesService.executeNewRule(web3Provider, rule)  : () => rulesService.executeRuleDeletion(web3Provider, rule),
                buttonActionText: communityWording.EXECUTE,
                precondition: async (rule: Rule) => {
                    const now = await blockchainAdapter.blockchainDate(web3Provider)
                    return now >= new Date(rule.executionTimeAt)
                },
                preconditionFailedMessage: communityWording.EXECUTE_NOT_READY,
                explanations: {
                    action: communityWording.QUEUED_VOTATION_ACTION,
                    status: communityWording.QUEUED_VOTATION_STATUS,
                }
            },
            [BlockchainProposalStatus.DEFEATED]: {
                action: navigation.goBack,
                buttonActionText: communityWording.GO_BACK,
                precondition: undefined,
                preconditionFailedMessage: "",
                explanations: {
                    action: communityWording.DEFEATED_VOTATION_ACTION,
                    status: communityWording.DEFEATED_VOTATION_STATUS,
                },
            },
        };

        const { action, buttonActionText, precondition,
            preconditionFailedMessage, explanations } = statusActionMap[ruleSubStatus] || {};

        if (explanations) {
            setActionExplanationLabel(explanations.action);
            setStatusExplanationLabel(explanations.status);
        }

        return { action, label: buttonActionText, precondition: precondition,
            preconditionFailedMessage: preconditionFailedMessage};
    };


    const renderPending = () => {
        const { ruleSubStatus } = rule;
        if (ruleSubStatus == BlockchainProposalStatus.ACTIVE || ruleSubStatus == BlockchainProposalStatus.PENDING) {
            return renderVoting;
        } else {
            return renderVoted;
        }
    };

    const execute = async (action) => {
        const { ruleSubStatus } = rule;
        const arg = ruleSubStatus === BlockchainProposalStatus.EXECUTED ? rule.ruleId : rule
        await action(web3Provider, arg)
    };

    const renderVoted = async () => {
        const { ruleStatus } = rule;

        const { action, label, precondition, preconditionFailedMessage }: RuleAction = getActionByStatus();

        const preconditionOk = !precondition || await precondition(rule);

        return (
            <React.Fragment>
                <Text style={ruleDetailStyles.subsubtitle}>{preconditionOk ? "" : preconditionFailedMessage}</Text>
                {ruleStatus !== RuleStatus.DELETED && (
                    <View style={ruleDetailStyles.buttonContainer}>
                        <DecentravellerButton text={label} onPress={async () => {
                            await execute(action)
                            refreshCallback()
                            navigation.pop(2)
                        }} loading={false} enabled={preconditionOk}/>
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
        } else {
            setShowAlreadyVotedModal(true)
            return
        }
        setShowSuccessVotingModal(true)
    };

    const renderVoting = async () => {
        const actionLabel =
            rule.ruleSubStatus === BlockchainProposalStatus.PENDING
                ? communityWording.PENDING_VOTATION_ACTION
                : (rule.ruleStatus == RuleStatus.PENDING_DELETED ? communityWording.ACTIVE_DELETION_ACTION :
                    communityWording.ACTIVE_VOTATION_ACTION);

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

                <TouchableOpacity
                    onPress={() => navigation.navigate("VotingResultsScreen", { rule: rule })}
                    disabled={rule.ruleSubStatus === BlockchainProposalStatus.PENDING}
                    style={[
                        ruleDetailStyles.buttonMargin,
                        rule.ruleSubStatus === BlockchainProposalStatus.PENDING && ruleDetailStyles.disabledButton,
                    ]}
                >
                    <Image source={require('../../../assets/images/results.png')} style={ruleDetailStyles.buttonImage} />
                </TouchableOpacity>
            </View>
        );
    };

    const renderContentByRule = async (rule: Rule) => {
        setLoadingAction(true)
        switch (rule.ruleStatus) {
            case RuleStatus.APPROVED:
                setTitleLabel(communityWording.APPROVED_STATUS);
                setActionExplanationLabel(communityWording.PROPOSE_DELETE_ACTION);
                setStatusExplanationLabel(communityWording.PROPOSE_DELETE_STATUS);
                setContentComponent(await renderVoted());
                break;
            case RuleStatus.DELETED:
                setTitleLabel(communityWording.DELETED_STATUS);
                setActionExplanationLabel(communityWording.NO_ACTION_AVAILABLE);
                setContentComponent(await renderVoted());
                break;
            case RuleStatus.PENDING_APPROVAL:
                setTitleLabel(communityWording.PENDING_APPROVAL_STATUS);
                setContentComponent(await renderPending()());
                break;
            case RuleStatus.PENDING_DELETED:
                if(rule.ruleSubStatus == BlockchainProposalStatus.EXECUTED){
                    setActionExplanationLabel(communityWording.PROPOSE_DELETE_ACTION);
                }
                setTitleLabel(communityWording.PENDING_DELETED_STATUS);
                setContentComponent(await renderPending()());
                break;
        }
        setLoadingAction(false)
    };

    return (
        <View style={ruleDetailStyles.main}>
            <View style={communityScreenStyles.cardContainer}>
                <Text style={ruleDetailStyles.title}>{titleLabel}</Text>
            </View>

            <View style={communityScreenStyles.cardContainer}>
                <View>
                    <Text style={ruleDetailStyles.headerText}>Statement rule is:</Text>
                    <View style={ruleDetailStyles.descriptionContainer}>
                        <Text style={ruleDetailStyles.description}>{rule.ruleStatement}</Text>
                    </View>
                </View>
            </View>

            <View style={communityScreenStyles.cardContainer}>
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


            <View style={communityScreenStyles.cardContainer}>
                <Text style={ruleDetailStyles.subtitle}>{actionExplanationLabel}</Text>
                {
                    loadingAction ? <LoadingComponent></LoadingComponent> : null
                }
                {contentComponent}
            </View>

            <DecentravellerInformativeModal
                informativeText={`Vote registered gracefully`}
                visible={showSuccessVotingModal}
                closeModalText={'Close'}
                handleCloseModal={() => onCloseModal()}
            />

            <DecentravellerInformativeModal
                informativeText={`You have already voted for this proposal`}
                visible={showAlreadyVotedModal}
                closeModalText={'Close'}
                handleCloseModal={() => onCloseModal()}
            />
        </View>
    );

};

export default RuleDetailScreen;
