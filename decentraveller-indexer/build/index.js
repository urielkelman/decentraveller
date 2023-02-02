"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decentravellerPlaceCloneFactoryABI_json_1 = __importDefault(require("./contract-configs/abis/decentravellerPlaceCloneFactoryABI.json"));
const ethers_1 = require("ethers");
const config_1 = require("./contract-configs/config");
const provider = new ethers_1.ethers.providers.WebSocketProvider("http://127.0.0.1:8545");
const decentravellerPlaceCloneFactoryContract = new ethers_1.ethers.Contract(config_1.CONTRACT_ADDRESSES.DECENTRAVELLER_PLACE_CLONE_FACTORY, decentravellerPlaceCloneFactoryABI_json_1.default, provider);
decentravellerPlaceCloneFactoryContract.on("NewPlace", (placeCreator, id, placeName, tourismField, latitude, longitude, event) => {
    console.log("place creator listened", placeCreator);
    console.log("id listened", id);
    console.log("full event", event);
});
provider.on("block", () => console.log("new block listened"));
