import { NavigationProp, RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from '../HomeNavigator';
import { DecentravellerPlaceCategory } from '../../../context/types';
import { StackNavigationProp } from '@react-navigation/stack';

export interface PlaceDetailParams {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    score: number;
    category: DecentravellerPlaceCategory;
    reviewCount: number;
    imageUri: string | null;
}

type AddReviewImagesParams = {
    placeId: number;
};

export type AddReviewImagesScreenProp = NavigationProp<HomeStackScreens, 'AddReviewImages'> & {
    route: RouteProp<HomeStackScreens, 'AddReviewImages'> & {
        params: AddReviewImagesParams;
    };
};

export type CreatePlaceLocationScreenProp = StackNavigationProp<HomeStackScreens, 'CreatePlaceLocationScreen'>;

export type PlaceDetailScreenProp = NavigationProp<HomeStackScreens, 'PlaceDetailScreen'> & {
    route: RouteProp<HomeStackScreens, 'PlaceDetailScreen'> & {
        params: PlaceDetailParams;
    };
};

export type PlaceDetailScreenProps = {
    route: RouteProp<Record<string, PlaceDetailParams>, string>;
};
