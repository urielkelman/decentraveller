import { NavigationProp, RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from '../HomeNavigator';
import { DecentravellerPlaceCategory } from '../../../context/types';

export interface PlaceDetailParams {
    id: number;
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    score: number;
    category: DecentravellerPlaceCategory;
    reviewCount: number;
    imageBase64: string | null;
}

type AddReviewImagesParams = {
    placeId: number;
};

export type AddReviewImagesScreenProp = NavigationProp<HomeStackScreens, 'AddReviewImages'> & {
    route: RouteProp<HomeStackScreens, 'AddReviewImages'> & {
        params: AddReviewImagesParams;
    };
};

export type CreatePlaceLocationScreenProp = NavigationProp<HomeStackScreens, 'CreatePlaceLocationScreen'>;

export type PlaceDetailScreenProp = NavigationProp<HomeStackScreens, 'PlaceDetailScreen'> & {
    route: RouteProp<HomeStackScreens, 'PlaceDetailScreen'> & {
        params: PlaceDetailParams;
    };
};

export type PlaceDetailScreenProps = {
    route: RouteProp<Record<string, PlaceDetailParams>, string>;
};
