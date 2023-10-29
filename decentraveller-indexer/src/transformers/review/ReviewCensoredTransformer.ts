import { BigNumber } from "ethers";
import { HTTPMethod } from "../../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../../adapters/config";
import { EventRequest, ReviewCensoredRequestBody } from "../../adapters/types";
import EventTransformer from "../EventTransformer";

class ReviewCensoredTransformer extends EventTransformer<ReviewCensoredRequestBody> {
    public transformEvent(
        event: any[]
    ): EventRequest<ReviewCensoredRequestBody> {
        return {
            endpoint: eventEndpoints.CENSOR_REVIEW_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                placeId: (event[0] as BigNumber).toNumber(),
                reviewId: (event[1] as BigNumber).toNumber(),
                brokenRuleId: (event[2] as BigNumber).toNumber(),
                moderator: event[3],
            },
        };
    }
}

const reviewCensoredTransformer = new ReviewCensoredTransformer();

export { reviewCensoredTransformer };
