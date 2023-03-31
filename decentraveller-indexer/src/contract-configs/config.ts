import { ethers } from "ethers";
import * as dotenv from "dotenv";
import decentravellerPlaceABI from "../contract-configs/abis/decentravellerPlaceCloneFactoryABI.json";
import EventTransformer from "./transformers/EventTransformer";
import { newPlaceTransformer } from "./transformers/NewPlaceTransformer";
import { EventRequestBody } from "./adapters/types";

let blockchainUri = process.env.BLOCKCHAIN_URI || "http://127.0.0.1:8545";

export interface EventToListen<B extends EventRequestBody> {
    readonly contract: ethers.Contract;
    readonly eventName: string;
    readonly transformer: EventTransformer<B>;
}

const CONTRACT_ADDRESSES = {
    DECENTRAVELLER_PLACE_CLONE_FACTORY:
        "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
};

export const provider = new ethers.providers.WebSocketProvider(blockchainUri);

const decentravellerPlaceCloneFactoryContract: ethers.Contract =
    new ethers.Contract(
        CONTRACT_ADDRESSES.DECENTRAVELLER_PLACE_CLONE_FACTORY,
        decentravellerPlaceABI,
        provider
    );

export const eventsToListen: Array<EventToListen<any>> = [
    {
        contract: decentravellerPlaceCloneFactoryContract,
        eventName: "NewPlace",
        transformer: newPlaceTransformer,
    },
];
