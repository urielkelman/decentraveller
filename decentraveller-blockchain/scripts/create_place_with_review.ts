import { ethers, run, network, getNamedAccounts } from "hardhat";
import { Decentraveller, DecentravellerPlace } from "../typechain-types";

const DEFAULT_MOCK_HASHES = ["0xhash1", "0xhash2", "0xhash3"];

const main = async () => {
    const decentravellerContract: Decentraveller = await ethers.getContractAt(
        "Decentraveller",
        "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
    );

    try {
        const result = await decentravellerContract.addPlace(
            "Shami shawarma",
            "25.3232",
            "23.321",
            "Sanfe Fe 3173",
            0
        );

        await result.wait(1);

        const placeId = await decentravellerContract.getCurrentPlaceId();
        const placeAddress = await decentravellerContract.getPlaceAddress(
            placeId
        );

        const { reviewer } = await getNamedAccounts();

        const placeContract: DecentravellerPlace = await ethers.getContractAt(
            "DecentravellerPlace",
            placeAddress,
            reviewer
        );

        const addReviewResponse = await placeContract.addReview(
            "Delicious shawarma",
            DEFAULT_MOCK_HASHES,
            5
        );

        await addReviewResponse.wait(1);
    } catch (e) {
        console.log(e);
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error();
        process.exit(1);
    });
