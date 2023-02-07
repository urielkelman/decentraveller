import { BigNumber } from "ethers";

export interface EventRequestBody {}

export interface EventRequest {
    endpoint: string;
    body: EventRequestBody;
}

export interface NewPlaceRequest extends EventRequest {}

export interface NewPlaceRequestBody extends EventRequestBody {
    id: number;
    placeCreator: string;
    placeName: string;
    tourismField: string;
    latitude: string;
    longitude: string;
}
