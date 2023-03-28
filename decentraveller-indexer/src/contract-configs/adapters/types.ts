import { HTTPMethod } from "./AxiosRequestBuilder";

export type EventRequestBody = { [key: string]: string | number };

export interface EventRequest<T extends EventRequestBody> {
    endpoint: string;
    method: HTTPMethod;
    body: T;
}

export interface NewPlaceRequestBody extends EventRequestBody {
    id: number;
    owner: string;
    name: string;
    address: string;
    category: string;
    latitude: string;
    longitude: string;
}
