import axios from 'axios';
import { API_ENDPOINT } from '../api/config';
import { is } from 'react-native-country-flag/dist/flags/flagsIndex';

interface HttpBaseRequest {
    url: string;
    onUnexpectedError: (e) => void;
    onStatusCodeError?: { [key: number]: () => void };
}

export interface HttpGetRequest extends HttpBaseRequest {
    queryParams: { [key: string]: string };
}

export interface HttpPostRequest extends HttpBaseRequest {
    body: { [key: string]: string | number };
}

class HttpConnector {
    private readonly baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private static processError(httpRequest: HttpBaseRequest, error: any) {
        if (axios.isAxiosError(error)) {
            console.log('Status', error.response.status);
            console.log(error.message);
            httpRequest.onStatusCodeError &&
                httpRequest.onStatusCodeError[error.response.status] &&
                httpRequest.onStatusCodeError[error.response.status]();
        } else {
            httpRequest.onUnexpectedError(error);
        }
    }

    async get<T>(httpGetRequest: HttpGetRequest): Promise<T> {
        try {
            const { data } = await axios.get<T>(httpGetRequest.url, {
                baseURL: this.baseURL,
                params: httpGetRequest.queryParams,
            });
            return data;
        } catch (error) {
            HttpConnector.processError(httpGetRequest, error);
        }
    }

    async post<T>(httpPostRequest: HttpPostRequest): Promise<T> {
        try {
            const { data } = await axios.post<T>(httpPostRequest.url, {
                baseURL: this.baseURL,
                data: httpPostRequest.body,
            });
            return data;
        } catch (error) {
            HttpConnector.processError(httpPostRequest, error);
        }
    }

    async getBase64Bytes(httpRequest: HttpGetRequest): Promise<string> {
        try {
            const base64String = await axios
                .get(httpRequest.url, {
                    baseURL: this.baseURL,
                    params: httpRequest.queryParams,
                    responseType: 'arraybuffer',
                })
                .then((response) => Buffer.from(response.data, 'binary').toString('base64'));
            return base64String;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.status);
                console.log(error.message);
            } else {
                console.log(error);
            }
            httpRequest.onError(error);
        }
    }
}

const httpAPIConnector = new HttpConnector(API_ENDPOINT);

export { httpAPIConnector, HttpConnector };
