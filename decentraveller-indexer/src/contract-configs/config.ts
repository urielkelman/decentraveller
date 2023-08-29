import { ethers } from "ethers";
import decentravellerABI from "../contract-configs/abis/decentravellerABI.json";
import decentravellerPlaceFactoryABI from "../contract-configs/abis/decentravellerPlaceCloneFactoryABI.json";
import decentravellerReviewFactoryABI from "../contract-configs/abis/decentravellerReviewCloneFactoryABI.json";
import EventTransformer from "../transformers/EventTransformer";
import { newPlaceTransformer } from "../transformers/NewPlaceTransformer";
import { EventRequestBody } from "../adapters/types";
import { newReviewTransformer } from "../transformers/NewReviewTransformer";
import { updatedProfileTransformer } from "../transformers/UpdatedProfileTransformer";
import { ruleProposedTransformer } from "../transformers/RuleProposedTransformer";
import { ruleApprovedTransformer } from "../transformers/RuleApprovedTransformer";
import { ruleDeletionProposedTransformer } from "../transformers/RuleDeletionProposedTransformer";
import { ruleDeletedTransformer } from "../transformers/RuleDeletedTransformer";

const blockchainUri = process.env.BLOCKCHAIN_URI || "http://127.0.0.1:8545";

export interface EventToListen<B extends EventRequestBody> {
    readonly contract: ethers.Contract;
    readonly eventName: string;
    readonly transformer: EventTransformer<B>;
}

const CONTRACT_ADDRESSES = {
    DECENTRAVELLER: "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e",
    DECENTRAVELLER_PLACE_CLONE_FACTORY:
        "0x610178da211fef7d417bc0e6fed39f05609ad788",
    DECENTRAVELLER_REVIEW_CLONE_FACTORY:
        "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6",
};

export const provider = new ethers.providers.WebSocketProvider(blockchainUri);

const decentraveller: ethers.Contract = new ethers.Contract(
    CONTRACT_ADDRESSES.DECENTRAVELLER,
    decentravellerABI,
    provider
);

const decentravellerPlaceCloneFactoryContract: ethers.Contract =
    new ethers.Contract(
        CONTRACT_ADDRESSES.DECENTRAVELLER_PLACE_CLONE_FACTORY,
        decentravellerPlaceFactoryABI,
        provider
    );

const decentravellerReviewCloneFactoryContract: ethers.Contract =
    new ethers.Contract(
        CONTRACT_ADDRESSES.DECENTRAVELLER_REVIEW_CLONE_FACTORY,
        decentravellerReviewFactoryABI,
        provider
    );

export const eventsToListen: Array<EventToListen<any>> = [
    {
        contract: decentravellerPlaceCloneFactoryContract,
        eventName: "NewPlace",
        transformer: newPlaceTransformer,
    },
    {
        contract: decentravellerReviewCloneFactoryContract,
        eventName: "NewReview",
        transformer: newReviewTransformer,
    },
    {
        contract: decentraveller,
        eventName: "UpdatedProfile",
        transformer: updatedProfileTransformer,
    },
    {
        contract: decentraveller,
        eventName: "DecentravellerRuleProposed",
        transformer: ruleProposedTransformer,
    },
    {
        contract: decentraveller,
        eventName: "DecentravellerRuleApproved",
        transformer: ruleApprovedTransformer,
    },
    {
        contract: decentraveller,
        eventName: "DecentravellerRuleDeletionProposed",
        transformer: ruleDeletionProposedTransformer,
    },
    {
        contract: decentraveller,
        eventName: "DecentravellerRuleDeleted",
        transformer: ruleDeletedTransformer,
    },
];
