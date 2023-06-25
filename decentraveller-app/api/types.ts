export enum HTTPMethod {
    GET = 'get',
}

export enum HTTPStatusCode {
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
}

const a = HTTPStatusCode.BAD_REQUEST;

export type ApiRequestQueryParams = {};

export type ApiRequest = {
    url: string;
    method: string;
    apiRequestParams: ApiRequestQueryParams;
};
