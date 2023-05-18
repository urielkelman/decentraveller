import { GeocodingResponse } from './response/geocoding';
import { httpAPIConnector, HttpConnector, HttpGetRequest } from '../connectors/HttpConnector';
import { FORWARD_GEOCODING_ENDPOINT, GET_USER_ENDPOINT } from './config';
import { UserResponse } from './response/user';

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
            onError: (e) => {
                console.log('An error happened when trying to geocode.', e);
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }

    async getUser(wallet: string, onFailed: () => void): Promise<UserResponse> {
        const httpRequest: HttpGetRequest = {
            url: GET_USER_ENDPOINT + '/' + wallet,
            queryParams: {},
            onError: (e) => {
                onFailed();
            },
        };

        return await httpAPIConnector.get(httpRequest);
    }
}

const apiAdapter = new ApiAdapter(httpAPIConnector);

export { apiAdapter };
