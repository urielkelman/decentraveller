import { BigNumber } from "ethers";
import { eventEndpoints } from "../adapters/config";
import { NewPlaceRequest } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class NewPlaceTransformer extends EventTransformer {
    public transformEvent(event: any[]): NewPlaceRequest {
        console.log(event);
        return {
            endpoint: eventEndpoints.NEW_PLACE_ENDPOINT,
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
