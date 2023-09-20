import { NavigationProp, RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from '../../home/HomeNavigator';

export type Rule = {
    id: number;
    description: string;
    status: string;
};

export type RuleScreenProps = NavigationProp<HomeStackScreens, 'PendingApprovalRuleScreen' | 'ApprovedScreen' | 'PendingDeletedScreen'| 'DeletedScreen'> & {
    route: RouteProp<HomeStackScreens, 'PendingApprovalRuleScreen' | 'ApprovedScreen' | 'PendingDeletedScreen'| 'DeletedScreen'> & {
        params: Rule;
    };
};


