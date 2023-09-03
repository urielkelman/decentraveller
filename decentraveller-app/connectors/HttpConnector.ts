import axios from 'axios';
import FormData from 'form-data';
import { API_ENDPOINT } from '../api/config';

interface HttpBaseRequest {
    url: string;
    onUnexpectedError: (e) => void;
    onStatusCodeError?: { [key: number]: () => void };
}

export interface HttpGetRequest extends HttpBaseRequest {
    queryParams: { [key: string]: string | number };
}

export interface HttpPostRequest extends HttpBaseRequest {
    body: { [key: string]: string | number } | FormData;
    headers: { [key: string]: string };
}

class HttpConnector {
    private readonly baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private static processError(httpRequest: HttpBaseRequest, error: any) {
        if (axios.isAxiosError(error) && error.code !== 'ERR_NETWORK') {
            console.log('is axios error');
            console.log('Status', error);
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
            const { data } = await axios.post<T>(httpPostRequest.url, httpPostRequest.body, {
                baseURL: this.baseURL,
                headers: httpPostRequest.headers,
            });

            return data;
        } catch (error) {
            HttpConnector.processError(httpPostRequest, error);
        }
    }
}

const httpAPIConnector = new HttpConnector(API_ENDPOINT);

export { httpAPIConnector, HttpConnector };
