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
    state: string;
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
    proposalId: number;
}

export interface RuleApprovedRequestBody extends EventRequestBody {
    ruleId: number;
}

export interface RuleDeletionProposedRequestBody extends EventRequestBody {
    ruleId: number;
    proposer: string;
}

export interface RuleDeletedRequestBody extends EventRequestBody {
    ruleId: number;
}
