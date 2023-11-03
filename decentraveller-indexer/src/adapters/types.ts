import { ethers } from "ethers";
import { HTTPMethod } from "./AxiosRequestBuilder";

export type EventRequestBody = { [key: string]: string | number | string[] };

export interface EventRequest<T extends EventRequestBody> {
    endpoint: string;
    method: HTTPMethod;
    body: T;
}

export interface NewPlaceRequestBody extends EventRequestBody {
    id: number;
    owner: string;
    name: string;
    address: string;
    category: string;
    latitude: number;
    longitude: number;
}

export interface NewReviewRequestBody extends EventRequestBody {
    id: number;
    owner: string;
    placeId: number;
    score: number;
    text: string;
    images: string[];
}

export interface NewProfileRequestBody extends EventRequestBody {
    owner: string;
    nickname: string;
    country: string;
    interest: string;
}

export interface RuleProposedRequestBody extends EventRequestBody {
    ruleId: number;
    proposer: string;
    ruleStatement: string;
    proposalId: string;
    timestamp: number;
}

export interface RuleApprovedRequestBody extends EventRequestBody {
    ruleId: number;
}

export interface RuleDeletionProposedRequestBody extends EventRequestBody {
    ruleId: number;
    deletionProposer: string;
    deleteProposalId: string;
    timestamp: number;
}

export interface RuleDeletedRequestBody extends EventRequestBody {
    ruleId: number;
}

export interface RuleProposalQueuedBody extends EventRequestBody {
    proposalId: string;
    executionTimestamp: number;
}

export interface ReviewCensoredRequestBody extends EventRequestBody {
    placeId: number;
    reviewId: number;
    brokenRuleId: number;
    moderator: string;
}

export interface ReviewCensorshipChallengedRequestBody
    extends EventRequestBody {
    placeId: number;
    reviewId: number;
    deadlineTimestamp: number;
    juries: string[];
}

export interface ReviewUncesoredRequestBody extends EventRequestBody {
    placeId: number;
    reviewId: number;
}
