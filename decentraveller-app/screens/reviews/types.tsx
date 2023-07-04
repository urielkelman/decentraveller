import {NavigationProp, RouteProp} from "@react-navigation/native";
import {HomeStackScreens} from "../home/HomeNavigator";


type AddReviewImagesParams = {
    placeId: number;
};

export type AddReviewImagesProps = {
    route: RouteProp<Record<string, AddReviewImagesParams>, string>;
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