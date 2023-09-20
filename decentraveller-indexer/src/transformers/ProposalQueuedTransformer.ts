import { BigNumber, ethers } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { eventEndpoints } from "../adapters/config";
import { EventRequest, RuleProposalQueuedBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class ProposalQueuedTransformer extends EventTransformer<RuleProposalQueuedBody> {
    public transformEvent(event: any[]): EventRequest<RuleProposalQueuedBody> {
        return {
            endpoint: eventEndpoints.UPDATE_RULE_EXEC_TIMESTAMP_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                proposalId: ethers.BigNumber.from(event[0]).toString(),
                executionTimestamp: (event[2] as BigNumber).toNumber(),
            },
        };
    }
}
