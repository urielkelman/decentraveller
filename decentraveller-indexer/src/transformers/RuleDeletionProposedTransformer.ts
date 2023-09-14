import { BigNumber, ethers } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import {
    EventRequest,
    RuleDeletionProposedRequestBody,
} from "../adapters/types";
import EventTransformer from "./EventTransformer";

class RuleDeletionProposedTransformer extends EventTransformer<RuleDeletionProposedRequestBody> {
    public transformEvent(
        event: any[]
    ): EventRequest<RuleDeletionProposedRequestBody> {
        return {
            endpoint: "/rule-deletion",
            method: HTTPMethod.POST,
            body: {
                ruleId: (event[0] as BigNumber).toNumber(),
                deletionProposer: event[1],
                deleteProposalId: ethers.BigNumber.from(event[3]).toString(),
                timestamp: (event[3] as BigNumber).toNumber(),
            },
        };
    }
}

const ruleDeletionProposedTransformer = new RuleDeletionProposedTransformer();

export { ruleDeletionProposedTransformer };
