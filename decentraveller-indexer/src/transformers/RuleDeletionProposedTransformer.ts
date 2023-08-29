import {
    EventRequest,
    RuleDeletionProposedRequestBody,
} from "../adapters/types";
import EventTransformer from "./EventTransformer";

class RuleDeletionProposedTransformer extends EventTransformer<RuleDeletionProposedRequestBody> {
    public transformEvent(
        ...event: any[]
    ): EventRequest<RuleDeletionProposedRequestBody> {
        throw new Error("Method not implemented.");
    }
}

const ruleDeletionProposedTransformer = new RuleDeletionProposedTransformer();

export { ruleDeletionProposedTransformer };
