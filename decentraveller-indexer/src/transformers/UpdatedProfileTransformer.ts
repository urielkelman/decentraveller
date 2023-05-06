import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../adapters/config";
import { EventRequest, NewProfileRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class UpdatedProfileTransformer extends EventTransformer<NewProfileRequestBody> {
    public transformEvent(event: any[]): EventRequest<NewProfileRequestBody> {
        return {
            endpoint: eventEndpoints.NEW_PROFILE_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                owner: event[0],
                nickname: event[1],
                name: event[2],
                country: event[3],
                gender: this.genderNumberToString(event[4]),
                interest: this.interestNumberToString(event[5])
            },
        };
    }

    private genderNumberToString(category: number): string {
        switch (category) {
            case 0:
                return "MALE";
            case 1:
                return "FEMALE";
            case 2:
                return "OTHER";
            default:
                return "UNKNOWN";
        }
    }

    private interestNumberToString(category: number): string {
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

const newReviewTransformer = new UpdatedProfileTransformer();

export { newReviewTransformer };
