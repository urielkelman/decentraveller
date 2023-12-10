import { BigNumber } from "ethers";
import { HTTPMethod } from "../../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../../adapters/config";
import {
    EventRequest,
    ReviewCensorshipChallengedRequestBody,
} from "../../adapters/types";
import EventTransformer from "../EventTransformer";

class ReviewCensorshipChallengedTransformer extends EventTransformer<ReviewCensorshipChallengedRequestBody> {
    public transformEvent(
        event: any[]
    ): EventRequest<ReviewCensorshipChallengedRequestBody> {
        return {
            endpoint: eventEndpoints.CENSOR_REVIEW_CHALLENGED_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                placeId: (event[0] as BigNumber).toNumber(),
                reviewId: (event[1] as BigNumber).toNumber(),
                deadlineTimestamp: (event[2] as BigNumber).toNumber(),
                juries: event[3],
            },
        };
    }
}

const reviewCensorshipChallengedTransformer =
    new ReviewCensorshipChallengedTransformer();

export { reviewCensorshipChallengedTransformer };
