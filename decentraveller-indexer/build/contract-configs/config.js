"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsToListen = exports.provider = void 0;
const ethers_1 = require("ethers");
const decentravellerPlaceCloneFactoryABI_json_1 = __importDefault(
    require("../contract-configs/abis/decentravellerPlaceCloneFactoryABI.json")
);
const NewPlaceTransformer_1 = require("./transformers/NewPlaceTransformer");
const CONTRACT_ADDRESSES = {
    DECENTRAVELLER_PLACE_CLONE_FACTORY:
        "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
};
exports.provider = new ethers_1.ethers.providers.WebSocketProvider(
    "http://127.0.0.1:8545"
);
const decentravellerPlaceCloneFactoryContract = new ethers_1.ethers.Contract(
    CONTRACT_ADDRESSES.DECENTRAVELLER_PLACE_CLONE_FACTORY,
    decentravellerPlaceCloneFactoryABI_json_1.default,
    exports.provider
);
exports.eventsToListen = [
    {
        contract: decentravellerPlaceCloneFactoryContract,
        eventName: "NewPlace",
        transformer: NewPlaceTransformer_1.newPlaceTransformer,
    },
];
