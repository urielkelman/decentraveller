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
        throw new Error("Method not implemented.");
    }
}

const ruleDeletedTransformer = new RuleDeletedTransformer();

export { ruleDeletedTransformer };
