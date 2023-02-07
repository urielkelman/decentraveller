import { BigNumber } from "ethers";
import { eventEndpoints } from "../adapters/config";
import { NewPlaceRequest } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class NewPlaceTransformer extends EventTransformer {
    public transformEvent(event: any[]): NewPlaceRequest {
        return {
            endpoint: eventEndpoints.NEW_PLACE_ENDPOINT,
            body: {
                id: (event[0] as BigNumber).toNumber(),
                placeCreator: event[1],
                placeName: event[2],
                tourismField: event[3],
                latitude: event[4],
                longitude: event[5],
            },
        };
    }
}

const newPlaceTransformer = new NewPlaceTransformer();

export { newPlaceTransformer };
