import { BigNumber } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { EventRequest, RuleApprovedRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";
import { eventEndpoints } from "../adapters/config";

class RuleApprovedTransformer extends EventTransformer<RuleApprovedRequestBody> {
    public transformEvent(event: any[]): EventRequest<RuleApprovedRequestBody> {
        return {
            endpoint: eventEndpoints.RULE_APPROVED_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                ruleId: (event[0] as BigNumber).toNumber(),
            },
        };
    }
}

const ruleApprovedTransformer = new RuleApprovedTransformer();

export { ruleApprovedTransformer };
