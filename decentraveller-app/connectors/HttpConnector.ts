import axios from 'axios';
import { API_ENDPOINT } from '../api/config';

export type HttpGetRequest = {
    url: string;
    queryParams: { [key: string]: string };
    onUnexpectedError: (e) => void;
    onStatusCodeError?: { [key: number]: () => void };
};

class HttpConnector {
    private readonly baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async get<T>(httpRequest: HttpGetRequest): Promise<T> {
        try {
            const { data } = await axios.get<T>(httpRequest.url, {
                baseURL: this.baseURL,
                params: httpRequest.queryParams,
            });
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('Status', error.response.status);
                console.log(error.message);
                console.log('a', httpRequest.onStatusCodeError[error.response.status]);
                httpRequest.onStatusCodeError &&
                    httpRequest.onStatusCodeError[error.response.status] &&
                    httpRequest.onStatusCodeError[error.response.status]();
            } else {
                console.log(error);
            }
            httpRequest.onUnexpectedError(error);
        }
    }
}

const httpAPIConnector = new HttpConnector(API_ENDPOINT);

export { httpAPIConnector, HttpConnector };
