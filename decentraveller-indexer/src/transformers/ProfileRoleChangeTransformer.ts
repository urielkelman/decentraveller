import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../adapters/config";
import { EventRequest, RoleChangeBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class ProfileRoleChangeTransformer extends EventTransformer<RoleChangeBody> {
    public transformEvent(event: any[]): EventRequest<RoleChangeBody> {
        return {
            endpoint: eventEndpoints.UPDATE_ROLE_ENDPOINT,
            method: HTTPMethod.PATCH,
            body: {
                owner: event[0],
                role: this.roleNumberToString(event[1]),
            },
        };
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

const profileRoleChangeTransformer = new ProfileRoleChangeTransformer();

export { profileRoleChangeTransformer };
