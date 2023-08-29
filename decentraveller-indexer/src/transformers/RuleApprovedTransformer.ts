import { EventRequest, RuleApprovedRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class RuleApprovedTransformer extends EventTransformer<RuleApprovedRequestBody> {
    public transformEvent(
        ...event: any[]
    ): EventRequest<RuleApprovedRequestBody> {
        throw new Error("Method not implemented.");
    }
}

const ruleApprovedTransformer = new RuleApprovedTransformer();

export { ruleApprovedTransformer };
