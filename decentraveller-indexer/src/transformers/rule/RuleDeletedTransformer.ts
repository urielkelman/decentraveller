import { BigNumber } from "ethers";
import { HTTPMethod } from "../../adapters/AxiosRequestBuilder";
import { EventRequest, RuleDeletedRequestBody } from "../../adapters/types";
import EventTransformer from "../EventTransformer";
import { eventEndpoints } from "../../adapters/config";

class RuleDeletedTransformer extends EventTransformer<RuleDeletedRequestBody> {
    public transformEvent(event: any[]): EventRequest<RuleDeletedRequestBody> {
        return {
            endpoint: eventEndpoints.RULE_DELETION_ENDPOINT,
            method: HTTPMethod.POST,
            body: {
                ruleId: (event[0] as BigNumber).toNumber(),
            },
        };
    }
}

const ruleDeletedTransformer = new RuleDeletedTransformer();

export { ruleDeletedTransformer };
