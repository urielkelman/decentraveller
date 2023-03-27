import { BigNumber } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../adapters/config";
import { EventRequest, NewPlaceRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class NewPlaceTransformer extends EventTransformer<NewPlaceRequestBody> {
    public transformEvent(event: any[]): EventRequest<NewPlaceRequestBody> {
        console.log(event);
        return {
            endpoint: eventEndpoints.NEW_PLACE_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                id: (event[0] as BigNumber).toNumber(),
                placeCreator: event[1],
                placeName: event[2],
                physicalAddress: event[3],
                category: this.categoryNumberToString(event[4]),
                latitude: event[5],
                longitude: event[6],
            },
        };
    }

    private categoryNumberToString(category: number): string {
        switch (category) {
            case 0:
                return "GASTRONOMY";
            case 1:
                return "ACCOMODATION";
            case 2:
                return "ENTERTAINMENT";
            default:
                return "UNKNOWN";
        }
    }
}

const newPlaceTransformer = new NewPlaceTransformer();

export { newPlaceTransformer };
