import { NavigationProp, RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from '../HomeNavigator';

export interface FilterModalData {
    orderBy: string;
    setOrderBy: (value: string) => void;
    minStars: number;
    setMinStars: (value: number) => void;
    maxDistance: number;
    setMaxDistance: (value: number) => void;
    interest: string;
    setInterest:  (value: string) => void;
}

type FilterModalParams = {
    filterModalData: FilterModalData;
};

export type FilterModalProps = {
    route: {
        params: FilterModalParams;
    };
    initialValues: {
        stars: number,
        distance: number
    }
};
