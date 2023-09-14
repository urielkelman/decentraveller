import { BigNumber, ethers } from "ethers";
import { HTTPMethod } from "../adapters/AxiosRequestBuilder";
import { EventRequest, RuleProposedRequestBody } from "../adapters/types";
import EventTransformer from "./EventTransformer";
import { eventEndpoints } from "../adapters/config";
import axios from "axios";

class RuleProposedTransformer extends EventTransformer<RuleProposedRequestBody> {
    public transformEvent(event: any[]): EventRequest<RuleProposedRequestBody> {
        console.log(event);
        try {
            return {
                endpoint: eventEndpoints.NEW_RULE_ENDPOINT,
                method: HTTPMethod.POST,
                body: {
                    ruleId: (event[0] as BigNumber).toNumber(),
                    proposer: event[1],
                    ruleStatement: event[2],
                    proposalId: ethers.BigNumber.from(event[3]).toString(),
                    timestamp: (event[4] as BigNumber).toNumber(),
                },
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.code !== "ERR_NETWORK") {
                console.log("is axios error");
                console.log("Status", error);
                console.log(JSON.stringify(error));
            }
            throw error;
        }
    }
}

const ruleProposedTransformer = new RuleProposedTransformer();

export { ruleProposedTransformer };
