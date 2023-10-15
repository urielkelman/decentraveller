import { NavigationProp, RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from '../../home/HomeNavigator';
import { RuleResponse, RuleStatus } from '../../../api/response/rules';
import { BlockchainProposalStatus } from '../../../blockchain/types';

export type Rule = {
    ruleId: number;
    proposalId: string;
    proposer: string;
    ruleStatement: string;
    ruleStatus: RuleStatus;
    ruleSubStatus: BlockchainProposalStatus;
    proposedAt: string;
    executionTimeAt: string | undefined;
};

type LoadRulesResponse = {
    total: number;
    rulesToShow: Rule[];
};

type RuleLoadFunction = (offset: number, limit: number) => Promise<LoadRulesResponse>;

type RulesListParams = {
    ruleList?: Rule[] | null | undefined;
    loadRules?: RuleLoadFunction | null | undefined;
    minified: boolean;
    horizontal: boolean;
    refreshCallback: () => void;
};

export type RuleListProps = {
    route: RouteProp<Record<string, RulesListParams>, string>;
};

export type RuleScreenProps = NavigationProp<HomeStackScreens, 'RuleDetailScreen'> & {
    route: RouteProp<HomeStackScreens, 'RuleDetailScreen'> & {
        params: Rule;
    };
};
