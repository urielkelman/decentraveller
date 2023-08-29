import { EventRequest, RuleProposedRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";

class RuleProposedTransformer extends EventTransformer<RuleProposedRequestBody> {
    public transformEvent(
        ...event: any[]
    ): EventRequest<RuleProposedRequestBody> {
        throw new Error("Method not implemented.");
    }
}

const ruleProposedTransformer = new RuleProposedTransformer();

export { ruleProposedTransformer };
