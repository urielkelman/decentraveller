import { NavigationProp, RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from '../../home/HomeNavigator';
import { PlaceDetailParams } from '../../home/place/types';

export type UserShowProps = {
    profileImage: string;
    name: string;
    walletAddress: string;
    createdAt: string;
    interest: string;
    sharedLocation: string;
    tokens: number;
};

type WalletIdParams = {
    walletId: string;
};

export type WalletIdProps = {
    route: RouteProp<Record<string, WalletIdParams>, string>;
};

export type UserProfileScreenProps = NavigationProp<HomeStackScreens, 'UserProfileScreen'> & {
    route: RouteProp<HomeStackScreens, 'UserProfileScreen'> & {
        params: WalletIdProps;
    };
};
