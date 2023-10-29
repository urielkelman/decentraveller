import { BigNumber } from "ethers";
import { HTTPMethod } from "../../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../../adapters/config";
import {
    EventRequest,
    ReviewCensoredRequestBody,
    ReviewUncesoredRequestBody,
} from "../../adapters/types";
import EventTransformer from "../EventTransformer";

class ReviewUncensoredTransformer extends EventTransformer<ReviewUncesoredRequestBody> {
    public transformEvent(
        event: any[]
    ): EventRequest<ReviewUncesoredRequestBody> {
        return {
            endpoint: eventEndpoints.UNCENSORED_REVIEW_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                placeId: (event[0] as BigNumber).toNumber(),
                reviewId: (event[1] as BigNumber).toNumber(),
            },
        };
    }
}

const reviewUncensoredTransformer = new ReviewUncensoredTransformer();

export { reviewUncensoredTransformer };
