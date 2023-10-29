import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../adapters/config";
import { EventRequest, NewProfileRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class RegisteredProfileTransformer extends EventTransformer<NewProfileRequestBody> {
    public transformEvent(event: any[]): EventRequest<NewProfileRequestBody> {
        return {
            endpoint: eventEndpoints.NEW_PROFILE_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                owner: event[0],
                nickname: event[1],
                country: event[2],
                interest: this.interestNumberToString(event[3]),
                role: this.roleNumberToString(event[4]),
            },
        };
    }

    private interestNumberToString(category: number): string {
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

    private roleNumberToString(role: number): string {
        switch (role) {
            case 0:
                return "NORMAL";
            case 1:
                return "MODERATOR";
            default:
                return "NORMAL";
        }
    }
}

const registeredProfileTransformer = new RegisteredProfileTransformer();

export { registeredProfileTransformer };
