import { GeocodingResponse } from './response/geocoding';
import { httpAPIConnector, HttpConnector, HttpGetRequest, HttpPostRequest } from '../connectors/HttpConnector';
import {
    FORWARD_GEOCODING_ENDPOINT,
    GET_PLACE_ENDPOINT,
    GET_USER_ENDPOINT,
    OWNED_PLACES_ENDPOINT,
    PLACE_IMAGE,
    PROFILE_IMAGE,
    PUSH_NOTIFICATION_TOKEN_ENDPOINT,
    RECOMMENDED_PLACES_BY_LOCATION_ENDPOINT,
    RECOMMENDED_PLACES_BY_PROFILE_ENDPOINT,
    RECOMMENDED_SIMILAR_PLACES,
    REVIEWS_PLACES_ENDPOINT,
    REVIEWS_PROFILE_ENDPOINT,
    UPLOAD_IMAGES,
} from './config';
import { UserResponse } from './response/user';
import Adapter from './Adapter';
import { formatString } from '../commons/functions/utils';
import { ReviewImageResponse, ReviewsResponse } from './response/reviews';
import { PlaceResponse } from './response/places';
import * as FileSystem from 'expo-file-system';
import { EncodingType } from 'expo-file-system';
import FormData from 'form-data';

enum HTTPStatusCode {
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
}

class ApiAdapter extends Adapter {
    private httpConnector: HttpConnector;

    constructor(httpConnector: HttpConnector) {
        super();
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

    async getRecommendedPlaces(
        [latitude, longitude]: [string, string],
        interest?: string,
        sort_by?: string | null,
        at_least_stars?: number | null,
        maximum_distance?: number | null
    ): Promise<PlaceResponse[]> {
        const queryParams: Record<string, string> = {
            latitude: latitude,
            longitude: longitude,
            page: '1',
            per_page: '500',
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

        const httpRequest: HttpGetRequest = {
            url: RECOMMENDED_PLACES_BY_LOCATION_ENDPOINT,
            queryParams,
            onUnexpectedError: (e) => console.log('Error', e),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getRecommendedPlacesForAddress(
        walletAddress: string,
        [latitude, longitude]: [string?, string?],
        onNotFound: () => void
    ): Promise<PlaceResponse[]> {
        const httpRequest: HttpGetRequest = {
            url: formatString(RECOMMENDED_PLACES_BY_PROFILE_ENDPOINT, { owner: walletAddress }),
            queryParams: null,
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
            queryParams: undefined,
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
            queryParams: {},
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
        onNotFound: () => void
    ): Promise<PlaceResponse[]> {
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

    async getUserProfileImage(walletAddress: string, onFailed: () => void): Promise<string> {
        const httpRequest: HttpGetRequest = {
            url: formatString(PROFILE_IMAGE, { owner: walletAddress }),
            queryParams: {},
            onUnexpectedError: (e) => {
                onFailed();
            },
        };

        console.log('to get', httpRequest);
        return await httpAPIConnector.getBase64Bytes(httpRequest);
    }

    async getPlace(placeId: number, onFailed: () => void): Promise<PlaceResponse> {
        const httpRequest: HttpGetRequest = {
            url: formatString(GET_PLACE_ENDPOINT, { placeId: placeId }),
            queryParams: {},
            onUnexpectedError: (e) => {
                onFailed();
            },
        };

        console.log('to get', httpRequest);
        return httpAPIConnector.get(httpRequest);
    }

    async getPlaceImage(placeId: number, onFailed: () => void): Promise<string> {
        const httpRequest: HttpGetRequest = {
            url: formatString(PLACE_IMAGE, { placeId: placeId }),
            queryParams: {},
            onUnexpectedError: (e) => {
                onFailed();
            },
        };

        console.log('to get', httpRequest);
        return await httpAPIConnector.getBase64Bytes(httpRequest);
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
        onFailed: () => void
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
}

const apiAdapter = new ApiAdapter(httpAPIConnector);

export { apiAdapter };
