import { GeocodingResponse } from './response/geocoding';
import { httpAPIConnector, HttpConnector, HttpGetRequest } from '../connectors/HttpConnector';
import {
    FORWARD_GEOCODING_ENDPOINT,
    GET_USER_ENDPOINT,
    RECOMMENDED_PLACES_BY_LOCATION_ENDPOINT,
    OWNED_PLACES_ENDPOINT,
    RECOMMENDED_PLACES_BY_PROFILE_ENDPOINT,
    REVIEWS_PLACES_ENDPOINT,
} from './config';
import { UserResponse } from './response/user';
import { PlacesResponse } from './response/places';
import Adapter from './Adapter';
import { formatString } from '../commons/functions/utils';
import { ReviewsResponse } from './response/reviews';

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
            onError: (e) => {
                console.log('An error happened when trying to geocode.', e);
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getRecommendedPlaces([latitude, longitude]: [string, string]): Promise<PlacesResponse> {
        const httpRequest: HttpGetRequest = {
            url: RECOMMENDED_PLACES_BY_LOCATION_ENDPOINT,
            queryParams: {
                latitude: latitude,
                longitude: longitude,
            },
            onError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getRecommendedPlacesForAddress(
        walletAddress: string,
        [latitude, longitude]: [string?, string?]
    ): Promise<PlacesResponse> {
        const queryParams =
            latitude && longitude
                ? {
                      latitude: latitude,
                      longitude: longitude,
                  }
                : undefined;
        const httpRequest: HttpGetRequest = {
            url: formatString(RECOMMENDED_PLACES_BY_PROFILE_ENDPOINT, { owner: walletAddress }),
            queryParams: queryParams,
            onError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getUser(walletAddress: string, onFailed: () => void): Promise<UserResponse> {
        const httpRequest: HttpGetRequest = {
            url: `${GET_USER_ENDPOINT}/${walletAddress}`,
            queryParams: {},
            onError: (e) => {
                onFailed();
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getMyPlaces(walletAddress: string): Promise<PlacesResponse> {
        const httpRequest: HttpGetRequest = {
            url: `${OWNED_PLACES_ENDPOINT}/${walletAddress}`,
            queryParams: {},
            onError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getPlaceReviews(placeId: string): Promise<ReviewsResponse> {
        const httpRequest: HttpGetRequest = {
            url: formatString(REVIEWS_PLACES_ENDPOINT, { placeId: placeId }),
            queryParams: {},
            onError: (e) => console.log('Error'),
        };

        return await httpAPIConnector.get(httpRequest);
    }
}

const apiAdapter = new ApiAdapter(httpAPIConnector);

export { apiAdapter };
