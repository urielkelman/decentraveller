import { BigNumber } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../adapters/config";
import { EventRequest, NewPlaceRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class NewPlaceTransformer extends EventTransformer<NewPlaceRequestBody> {
    public transformEvent(event: any[]): EventRequest<NewPlaceRequestBody> {
        // console.log(event);
        return {
            endpoint: eventEndpoints.NEW_PLACE_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                id: (event[0] as BigNumber).toNumber(),
                owner: event[1],
                name: event[2],
                address: event[3],
                category: this.categoryNumberToString(event[4]),
                latitude: parseFloat(event[5]),
                longitude: parseFloat(event[6]),
            },
        };
    }

    private categoryNumberToString(category: number): string {
        switch (category) {
            case 0:
                return "GASTRONOMY";
            case 1:
                return "ACCOMMODATION";
            case 2:
                return "ENTERTAINMENT";
            case 3:
                return "OTHER";
            default:
                return "UNKNOWN";
        }
    }
}

const newPlaceTransformer = new NewPlaceTransformer();

export { newPlaceTransformer };
