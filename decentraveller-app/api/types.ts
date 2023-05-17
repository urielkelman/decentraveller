export enum HTTPMethod {
    GET = 'get',
}

export type ApiRequestQueryParams = {};

export type ApiRequest = {
    url: string;
    method: string;
    apiRequestParams: ApiRequestQueryParams;
};
