import { NavigationProp, RouteProp } from '@react-navigation/native';
import { HomeStackScreens } from '../home/HomeNavigator';

type PlaceIdParams = {
    placeId: number;
};

export type AddReviewImagesProps = {
    route: RouteProp<Record<string, PlaceIdParams>, string>;
};

export type PlaceReviewsScreenProps = {
    route: RouteProp<Record<string, PlaceIdParams>, string>;
};

type AddReviewCommentParams = {
    selectedImage: any;
    placeId: number;
};

export type AddReviewCommentScreenProp = NavigationProp<HomeStackScreens, 'AddReviewComment'> & {
    route: RouteProp<HomeStackScreens, 'AddReviewComment'> & {
        params: AddReviewCommentParams;
    };
};
