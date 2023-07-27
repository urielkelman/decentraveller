import axios from 'axios';
import {API_ENDPOINT} from '../api/config';

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
        if (axios.isAxiosError(error) && error.code !== 'ERR_NETWORK') {
            console.log('is axios error');
            console.log('Status', error)
            console.log(error.message);
            httpRequest.onStatusCodeError &&
                httpRequest.onStatusCodeError[error.response.status] &&
                httpRequest.onStatusCodeError[error.response.status]();
        } else {
            console.log('ahora en el else')
            httpRequest.onUnexpectedError(error);
        }
    }

    async get<T>(httpGetRequest: HttpGetRequest): Promise<T> {
        console.log(httpGetRequest)
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
            console.log('to post', httpPostRequest)
            const { data } = await axios.post<T>(httpPostRequest.url, httpPostRequest.body, {
                baseURL: this.baseURL,
            });

            return data;
        } catch (error) {
            HttpConnector.processError(httpPostRequest, error);
        }
    }

    async getBase64Bytes(httpRequest: HttpGetRequest): Promise<string> {
        try {
            return await axios
                .get(httpRequest.url, {
                    baseURL: this.baseURL,
                    params: httpRequest.queryParams,
                    responseType: 'arraybuffer',
                })
                .then((response) => Buffer.from(response.data, 'binary').toString('base64'));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.status);
                console.log(error.message);
            } else {
                console.log(error);
            }
            httpRequest.onUnexpectedError(error);
        }
    }
}

const httpAPIConnector = new HttpConnector(API_ENDPOINT);

export { httpAPIConnector, HttpConnector };
