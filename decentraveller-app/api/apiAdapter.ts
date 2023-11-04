import { GeocodingResponse } from './response/geocoding';
import { httpAPIConnector, HttpConnector, HttpGetRequest, HttpPostRequest } from '../connectors/HttpConnector';
import {
    API_ENDPOINT,
    FORWARD_GEOCODING_ENDPOINT,
    GET_USER_ENDPOINT,
    OWNED_PLACES_ENDPOINT,
    PLACE_IMAGE,
    PROFILE_IMAGE,
    PUSH_NOTIFICATION_TOKEN_ENDPOINT,
    PLACES_SEARCH,
    RECOMMENDED_PLACES_BY_PROFILE_ENDPOINT,
    RECOMMENDED_SIMILAR_PLACES,
    REVIEWS_PLACES_ENDPOINT,
    REVIEWS_PROFILE_ENDPOINT,
    UPLOAD_IMAGES,
    RULES_ENDPOINT,
    REVIEW_IMAGE,
    GET_PLACE_ENDPOINT,
    GET_REVIEW_ENDPOINT,
    PLACE_THUMBNAIL,
    RULE_ENDPOINT, CENSORED_REVIEWS_PROFILE_ENDPOINT, CENSORED_REVIEWS_ENDPOINT,
} from './config';
import { UserResponse } from './response/user';
import { formatString } from '../commons/functions/utils';
import { ReviewImageResponse, ReviewResponse, ReviewsResponse } from './response/reviews';
import { PlaceResponse, PlacesResponse } from './response/places';
import * as FileSystem from 'expo-file-system';
import FormData from 'form-data';
import { RuleResponse, RulesResponse, RuleStatus } from './response/rules';

enum HTTPStatusCode {
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
}

class ApiAdapter {
    private httpConnector: HttpConnector;

    constructor(httpConnector: HttpConnector) {
        this.httpConnector = httpConnector;
    }

    async getGeocoding(physicalAddress: string, country: string): Promise<GeocodingResponse> {
        const httpRequest: HttpGetRequest = {
            url: FORWARD_GEOCODING_ENDPOINT,
            queryParams: {
                address: physicalAddress,
                country,
            },
            onUnexpectedError: (e) => {
                console.log('An error happened when trying to geocode.', e);
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    getProfileAvatarUrl(owner: string, forceReload = false): string {
        return API_ENDPOINT + formatString(PROFILE_IMAGE, { owner: owner }) + `?${forceReload ? Date.now() : ''}`;
    }

    getPlaceImageUrl(placeId: number): string {
        return API_ENDPOINT + formatString(PLACE_IMAGE, { placeId: placeId });
    }

    getPlaceThumbailUrl(placeId: number, maxResolution?: number): string {
        return API_ENDPOINT + formatString(PLACE_THUMBNAIL, { placeId: placeId });
    }

    getReviewImageUrl(placeId: number, reviewId: number, imageNumber: number): string {
        return (
            API_ENDPOINT +
            formatString(REVIEW_IMAGE, { placeId: placeId, reviewId: reviewId, imageNumber: imageNumber })
        );
    }

    async getPlacesSearch(
        [latitude, longitude]: [string, string],
        onNotFound: () => void,
        page: number,
        perPage: number,
        interest?: string | null,
        sort_by?: string | null,
        at_least_stars?: number | null,
        maximum_distance?: number | null,
    ): Promise<PlacesResponse> {
        const queryParams: Record<string, string | number> = {
            latitude: latitude,
            longitude: longitude,
            page: page,
            per_page: perPage,
        };

        if (sort_by !== null && sort_by !== undefined) {
            queryParams.sort_by = sort_by;
        }

        if (interest !== null && interest !== undefined) {
            queryParams.place_category = interest;
        }

        if (at_least_stars !== null && at_least_stars !== undefined) {
            queryParams.at_least_stars = at_least_stars.toString();
        }

        if (maximum_distance !== null && maximum_distance !== undefined) {
            queryParams.maximum_distance = maximum_distance.toString();
        }
        console.log(queryParams);

        const httpRequest: HttpGetRequest = {
            url: PLACES_SEARCH,
            queryParams,
            onStatusCodeError: {
                [HTTPStatusCode.NOT_FOUND]: onNotFound,
            },
            onUnexpectedError: (e) => console.log('Error', e),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getRecommendedPlacesForAddress(
        walletAddress: string,
        [latitude, longitude]: [string?, string?],
        onNotFound: () => void,
    ): Promise<PlaceResponse[]> {
        const queryParams: Record<string, string> = {};

        if (latitude != null && longitude != null) {
            queryParams.latitude = latitude;
            queryParams.longitude = longitude;
        }

        const httpRequest: HttpGetRequest = {
            url: formatString(RECOMMENDED_PLACES_BY_PROFILE_ENDPOINT, { owner: walletAddress }),
            queryParams,
            onUnexpectedError: (e) => console.log('Error'),
            onStatusCodeError: {
                [HTTPStatusCode.NOT_FOUND]: onNotFound,
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getRecommendedSimilarPlaces(placeId: number, onNotFound: () => void): Promise<PlaceResponse[]> {
        const httpRequest: HttpGetRequest = {
            url: formatString(RECOMMENDED_SIMILAR_PLACES, { placeId: placeId }),
            onUnexpectedError: (e) => console.log('Error'),
            onStatusCodeError: {
                [HTTPStatusCode.NOT_FOUND]: onNotFound,
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getUser(walletAddress: string, onFailed: () => void): Promise<UserResponse> {
        const httpRequest: HttpGetRequest = {
            url: `${GET_USER_ENDPOINT}/${walletAddress}`,
            onUnexpectedError: (e) => {
                onFailed();
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getPlace(placeId: number, onFailed: () => void): Promise<PlaceResponse> {
        const httpRequest: HttpGetRequest = {
            url: `${GET_PLACE_ENDPOINT}/${placeId}`,
            onUnexpectedError: (e) => {
                onFailed();
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getReview(placeId: number, reviewId: number, onFailed: () => void): Promise<ReviewResponse> {
        const httpRequest: HttpGetRequest = {
            url: `${GET_REVIEW_ENDPOINT}`,
            queryParams: { id: reviewId, place_id: placeId },
            onUnexpectedError: (e) => {
                onFailed();
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getPlacesByOwner(
        walletId: string,
        page: number,
        perPage: number,
        onNotFound: () => void,
    ): Promise<PlacesResponse> {
        const httpRequest: HttpGetRequest = {
            url: formatString(OWNED_PLACES_ENDPOINT, { walletId: walletId }),
            queryParams: { page: page, per_page: perPage },
            onUnexpectedError: (e) => console.log('Error'),
            onStatusCodeError: {
                [HTTPStatusCode.NOT_FOUND]: onNotFound,
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getPlaceReviews(placeId: string, page: number, perPage: number): Promise<ReviewsResponse> {
        const httpRequest: HttpGetRequest = {
            url: formatString(REVIEWS_PLACES_ENDPOINT, { placeId: placeId }),
            queryParams: { page: page, per_page: perPage },
            onUnexpectedError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getProfileReviews(walletId: string, page: number, perPage: number): Promise<ReviewsResponse> {
        const httpRequest: HttpGetRequest = {
            url: formatString(REVIEWS_PROFILE_ENDPOINT, { walletId: walletId }),
            queryParams: { page: page, per_page: perPage },
            onUnexpectedError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getProfileCensoredReviews(walletId: string, page: number, perPage: number): Promise<ReviewsResponse> {
        const httpRequest: HttpGetRequest = {
            url: formatString(CENSORED_REVIEWS_PROFILE_ENDPOINT, { walletId: walletId }),
            queryParams: { page: page, per_page: perPage },
            onUnexpectedError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getCensoredReviews(page: number, perPage: number): Promise<ReviewsResponse> {
        const httpRequest: HttpGetRequest = {
            url: CENSORED_REVIEWS_ENDPOINT,
            queryParams: { page: page, per_page: perPage },
            onUnexpectedError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async sendPushNotificationToken(walletAddress: string, pushToken: string): Promise<void> {
        const httpPostRequest: HttpPostRequest = {
            url: PUSH_NOTIFICATION_TOKEN_ENDPOINT,
            body: {
                owner: walletAddress,
                pushToken: pushToken,
            },
            headers: {},
            onUnexpectedError: (e) => console.log('Error', e),
        };

        return await httpAPIConnector.post(httpPostRequest);
    }

    async sendProfileImage(walletAddress: string, imageUri: string): Promise<void> {
        try {
            const imageInfo = await FileSystem.getInfoAsync(imageUri);

            if (imageInfo.exists) {
                var formData = new FormData();
                formData.append('file', { uri: imageUri, name: 'image.jpg', type: 'image/jpeg' });

                const httpPostRequest: HttpPostRequest = {
                    url: formatString(PROFILE_IMAGE, { owner: walletAddress }),
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUnexpectedError: (e) => console.log('Error', e),
                };

                await httpAPIConnector.post(httpPostRequest);
            } else {
                console.log('Image file does not exist.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    async sendReviewImage(
        walletAddress: string,
        imagesUriList: string[],
        onFailed: () => void,
    ): Promise<ReviewImageResponse> {
        try {
            const formData = new FormData();

            for (const imageUri of imagesUriList) {
                const imageInfo = await FileSystem.getInfoAsync(imageUri);

                if (imageInfo.exists) {
                    formData.append('files', { uri: imageUri, name: 'image.jpg', type: 'image/jpeg' });
                }
            }

            const httpPostRequest: HttpPostRequest = {
                url: formatString(UPLOAD_IMAGES, { owner: walletAddress }),
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUnexpectedError: (e) => {
                    console.log(e);
                    onFailed();
                },
            };

            return await httpAPIConnector.post(httpPostRequest);
        } catch (error) {
            console.error(error);
        }
    }

    async getRules(ruleStatus: RuleStatus): Promise<RulesResponse> {
        const httpRequest: HttpGetRequest = {
            url: RULES_ENDPOINT,
            queryParams: { rule_status: ruleStatus },
            onUnexpectedError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getRule(ruleId: number): Promise<RuleResponse> {
        const httpRequest: HttpGetRequest = {
            url: formatString(RULE_ENDPOINT, { ruleId: ruleId }),
            onUnexpectedError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }


}

const apiAdapter = new ApiAdapter(httpAPIConnector);

export { apiAdapter, ApiAdapter };
