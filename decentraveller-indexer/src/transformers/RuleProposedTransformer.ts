import { BigNumber } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { EventRequest, RuleProposedRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class RuleProposedTransformer extends EventTransformer<RuleProposedRequestBody> {
    public transformEvent(
        ...event: any[]
    ): EventRequest<RuleProposedRequestBody> {
        return {
            endpoint: "/rule",
            method: HTTPMethod.POST,
            body: {
                ruleId: (event[0] as BigNumber).toNumber(),
                proposer: event[1],
                ruleStatement: event[2],
                proposalId: (event[3] as BigNumber).toNumber(),
                timestamp: (event[4] as BigNumber).toNumber(),
            },
        };
    }
}

const ruleProposedTransformer = new RuleProposedTransformer();

export { ruleProposedTransformer };
