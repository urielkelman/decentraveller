import decentravellerPlaceABI from "./contract-configs/abis/decentravellerPlaceCloneFactoryABI.json";

import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "./contract-configs/config";

const provider = new ethers.providers.WebSocketProvider(
    "http://127.0.0.1:8545"
);

const decentravellerPlaceCloneFactoryContract: ethers.Contract =
    new ethers.Contract(
        CONTRACT_ADDRESSES.DECENTRAVELLER_PLACE_CLONE_FACTORY,
        decentravellerPlaceABI,
        provider
    );

decentravellerPlaceCloneFactoryContract.on(
    "NewPlace",
    (placeCreator, id, placeName, tourismField, latitude, longitude, event) => {
        console.log("place creator listened", placeCreator);
        console.log("id listened", id);
        console.log("full event", event);
    }
);

provider.on("block", () => console.log("new block listened"));
