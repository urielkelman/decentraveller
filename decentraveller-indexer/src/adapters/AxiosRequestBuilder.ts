import { AxiosRequestConfig } from "axios";

export enum HTTPMethod {
    GET = "get",
    POST = "post",
}

const API_ENDPOINT = process.env.API_ENDPOINT;

class AxiosRequestBuilder {
    private url: string | undefined;
    private method: string | undefined;
    private body: { [key: string]: string | number | string[] };
    private headers: { [key: string]: string };

    constructor() {
        this.url = undefined;
        this.method = undefined;
        this.body = {};
        this.headers = {};
    }

    withUrl(url: string): AxiosRequestBuilder {
        this.url = url;
        return this;
    }

    withMethod(method: HTTPMethod): AxiosRequestBuilder {
        this.method = method;
        return this;
    }

    withBody(body: {
        [key: string]: string | number | string[];
    }): AxiosRequestBuilder {
        this.body = body;
        return this;
    }

    withHeaders(headers: { [key: string]: string }): AxiosRequestBuilder {
        this.headers = headers;
        return this;
    }

    build(): AxiosRequestConfig {
        return {
            url: this.url,
            method: this.method,
            headers: this.headers,
            data: this.body,
            baseURL: API_ENDPOINT,
        };
    }
}

export default AxiosRequestBuilder;
