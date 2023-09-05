import { BigNumber } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import {
    EventRequest,
    RuleDeletedRequestBody,
    RuleProposedRequestBody,
} from "../adapters/types";
import EventTransformer from "./EventTransformer";

class RuleDeletedTransformer extends EventTransformer<RuleDeletedRequestBody> {
    public transformEvent(
        ...event: any[]
    ): EventRequest<RuleDeletedRequestBody> {
        return {
            endpoint: "/rule-deletion/delete",
            method: HTTPMethod.POST,
            body: {
                ruleId: (event[0] as BigNumber).toNumber(),
            },
        };
    }
}

const ruleDeletedTransformer = new RuleDeletedTransformer();

export { ruleDeletedTransformer };
