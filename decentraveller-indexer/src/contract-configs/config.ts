import { ethers } from "ethers";
import decentravellerABI from "../contract-configs/abis/decentravellerABI.json";
import decentravellerPlaceFactoryABI from "../contract-configs/abis/decentravellerPlaceCloneFactoryABI.json";
import decentravellerReviewFactoryABI from "../contract-configs/abis/decentravellerReviewCloneFactoryABI.json";
import EventTransformer from "../transformers/EventTransformer";
import { newPlaceTransformer } from "../transformers/NewPlaceTransformer";
import { EventRequestBody } from "../adapters/types";
import { newReviewTransformer } from "../transformers/NewReviewTransformer";
import { updatedProfileTransformer } from "../transformers/UpdatedProfileTransformer";

const blockchainUri = process.env.BLOCKCHAIN_URI || "http://127.0.0.1:8545";

export interface EventToListen<B extends EventRequestBody> {
    readonly contract: ethers.Contract;
    readonly eventName: string;
    readonly transformer: EventTransformer<B>;
}

const CONTRACT_ADDRESSES = {
    DECENTRAVELLER:
        "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    DECENTRAVELLER_PLACE_CLONE_FACTORY:
        "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9",
    DECENTRAVELLER_REVIEW_CLONE_FACTORY:
        "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
};

export const provider = new ethers.providers.WebSocketProvider(blockchainUri);

const decentraveller: ethers.Contract =
    new ethers.Contract(
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
];
