import {NavigationProp, RouteProp} from "@react-navigation/native";
import {HomeStackScreens} from "../HomeNavigator";

export interface PlaceDetailData {
    id: number;
    name: string;
    address: string;
    score: number;
    reviewCount: number;
}


type AddReviewImagesParams = {
    placeId: number;
};

export type AddReviewImagesScreenProp = NavigationProp<HomeStackScreens, 'AddReviewImages'> & {
    route: RouteProp<HomeStackScreens, 'AddReviewImages'> & {
        params: AddReviewImagesParams;
    };
};

export type CreatePlaceLocationScreenProp = NavigationProp<HomeStackScreens, 'CreatePlaceLocationScreen'>

type PlaceDetailParams = {
    placeItemData: PlaceDetailData;
}

export type PlaceDetailScreenProp = NavigationProp<HomeStackScreens, 'PlaceDetailScreen'> & {
    route: RouteProp<HomeStackScreens, 'PlaceDetailScreen'> & {
        params: PlaceDetailParams;
    };
};

type PlaceDetailScreenParams = {
    placeItemData: PlaceDetailData;
};

export type PlaceDetailScreenProps = {
    route: RouteProp<Record<string, PlaceDetailScreenParams>, string>;
};

