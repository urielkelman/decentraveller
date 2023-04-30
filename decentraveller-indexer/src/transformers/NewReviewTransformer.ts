import { BigNumber } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../adapters/config";
import { EventRequest, NewReviewRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class NewReviewTransformer extends EventTransformer<NewReviewRequestBody> {
    public transformEvent(event: any[]): EventRequest<NewReviewRequestBody> {
        return {
            endpoint: eventEndpoints.NEW_REVIEW_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                id: (event[0] as BigNumber).toNumber(),
                placeId: (event[1] as BigNumber).toNumber(),
                owner: event[2],
                text: event[3],
                images: event[4],
                score: event[5],
                state: "asd",
            },
        };
    }
}

const newReviewTransformer = new NewReviewTransformer();

export { newReviewTransformer };
