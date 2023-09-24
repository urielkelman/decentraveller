import React, {useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import DecentravellerButton from "../../../commons/components/DecentravellerButton";
import {approvedStyles, deletedStyles, pendingApprovalStyles} from "../../../styles/communityStyles";
import {Rule} from "./types";
import {RouteProp} from "@react-navigation/native";
import {RuleStatus} from "../../../api/response/rules";

type RuleDetailParams = {
    rule: Rule | null | undefined;
    action: string;
    inFavor: string;
    against: string;
    label: string;
    a: number;
};

type RuleDetailProps = {
    route: RouteProp<Record<string, RuleDetailParams>, string>;
};
const RuleDetailScreen: React.FC<RuleDetailProps> = ({ route }) => {
    const [titleLabel, setTitleLabel] = useState("");
    const [contentComponent, setContentComponent] = useState<React.ReactNode | null>(null);
    const { rule,a  } = route.params;

    useEffect(() => {
        renderContentByRuleStatus(rule.ruleStatus);
    }, [rule.ruleStatus]);

    const renderContentByRuleStatus = (ruleStatus: RuleStatus) => {
        console.log(a)
        switch (ruleStatus) {
            case RuleStatus.APPROVED:
                setTitleLabel('The following rule is now part of the community');
                setContentComponent(
                    <React.Fragment>
                        <Text style={approvedStyles.subtitle}>
                            <Text style={approvedStyles.italic}>
                                If you don't agree, you can propose removing it.
                            </Text>
                        </Text>
                        <View style={approvedStyles.buttonContainer}>
                            <DecentravellerButton
                                text={'Propose remove'}
                                onPress={() => {
                                    // Manejar la acción aquí
                                }}
                                loading={false}
                            />
                        </View>
                    </React.Fragment>
                );
                break;
            case RuleStatus.DELETED:
                setTitleLabel('The following rule is not part of the community');
                setContentComponent(
                    <Text style={deletedStyles.subtitle}>
                        <Text style={deletedStyles.italic}>
                            There is no action possible to deleted rule
                        </Text>
                    </Text>
                );
                break;
            case RuleStatus.PENDING_APPROVAL:
            case RuleStatus.PENDING_DELETED:
                setTitleLabel('The following rule is pending approval');
                setContentComponent(
                    <View style={pendingApprovalStyles.buttonContainer}>
                        <TouchableOpacity onPress={() => {}}>
                            <Image
                                source={require('../../../assets/images/favor.png')}
                                style={pendingApprovalStyles.buttonImage}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {}}
                            style={pendingApprovalStyles.buttonMargin}
                        >
                            <Image
                                source={require('../../../assets/images/contra.png')}
                                style={pendingApprovalStyles.buttonImage}
                            />
                        </TouchableOpacity>
                    </View>
                );
                break;
            default:
                setTitleLabel('Unknown status');
                setContentComponent(null); // Puedes establecer esto en null o en cualquier otro valor por defecto.
                break;
        }
    };

    return (
        <View style={[approvedStyles.container]}>
            <Text style={approvedStyles.label}>{titleLabel}</Text>
            <View style={approvedStyles.header}>
                <Text style={approvedStyles.headerText}>Rule</Text>
            </View>
            <View style={approvedStyles.descriptionContainer}>
                <Text style={approvedStyles.description}>{rule.ruleStatement}</Text>
            </View>

            {contentComponent}
        </View>
    );
};

export default RuleDetailScreen;
