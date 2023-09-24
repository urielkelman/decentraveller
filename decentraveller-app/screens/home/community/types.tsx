import { NavigationProp, RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from '../../home/HomeNavigator';
import {RuleResponse, RuleStatus} from "../../../api/response/rules";
import {BlockchainProposalStatus} from "../../../blockchain/types";


export type Rule = {
    ruleId: number;
    proposalId: string;
    proposer: string;
    ruleStatement: string;
    ruleStatus: RuleStatus;
    ruleSubStatus: BlockchainProposalStatus
};

export type RuleScreenProps = NavigationProp<HomeStackScreens, 'RuleDetailScreen'> & {
    route: RouteProp<HomeStackScreens, 'RuleDetailScreen'> & {
        params: Rule;
    };
};


