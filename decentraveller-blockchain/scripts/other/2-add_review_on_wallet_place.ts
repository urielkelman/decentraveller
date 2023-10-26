import { ethers, run, network } from "hardhat";
import { Decentraveller, DecentravellerPlace } from "../typechain-types";

const PLACE_CONTRACT_ADDRESS = "0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81";

const main = async () => {
    const hardhatSigner = (await ethers.getSigners())[0];

    const decentravellerPlace: DecentravellerPlace = await ethers.getContractAt(
        "DecentravellerPlace",
        PLACE_CONTRACT_ADDRESS,
        hardhatSigner
    );
    const addReviewTx = await decentravellerPlace.addReview(
        "Excellent place to eat israeli food",
        ["hash_1", "hash_2"],
        5
    );

    await addReviewTx.wait();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
