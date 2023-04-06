import { ethers, run, network } from "hardhat";
import { Decentraveller, DecentravellerPlace } from "../typechain-types";
import { readFileSync } from "fs";

const DEFAULT_MOCK_HASHES = ["0xhash1", "0xhash2", "0xhash3"];

const main = async () => {
    const signers = await ethers.getSigners();
    /*Contracts are connected to different signers */
    let decentravellerContracts: Decentraveller[] = await Promise.all(
        signers.map(
            async (signer) =>
                await ethers.getContractAt(
                    "Decentraveller",
                    "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
                    signer
                )
        )
    );

    console.log("Starting business load");
    console.log("aaaaaaaaaa");
    const businessFile = readFileSync("data/business_sample.json", "utf-8");
    var yelp2id = new Map<string, bigint>();
    for (const line of businessFile.split(/\r?\n/)) {
        const businessData = JSON.parse(line);
        const randomContract =
            decentravellerContracts[
                Math.floor(Math.random() * decentravellerContracts.length)
            ];
        console.log(randomContract);
        const placeId = await randomContract.getNextPlaceId();
        const result = await randomContract.addPlace(
            businessData["name"],
            businessData["latitude"].toString(),
            businessData["longitude"].toString(),
            businessData["address"],
            0
        );

        if (await result.wait(1)) {
            yelp2id.set(businessData["business_id"], placeId.toBigInt());
            console.log(
                `Place with id ${placeId} inserted with signer ${await randomContract.signer.getAddress()}`
            );
        } else {
            throw Error("Error inserting place");
        }
    }

    console.log("Starting review load");
    const reviewFile = readFileSync("data/reviews_sample.json", "utf-8");
    for (const line of reviewFile.split(/\r?\n/)) {
        const randomIndex = Math.floor(
            Math.random() * decentravellerContracts.length
        );
        const randomContract = decentravellerContracts[randomIndex];
        const signerConnectedToContract = signers[randomIndex];
        const reviewData = JSON.parse(line);
        const blockchainBusId = yelp2id.get(reviewData["business_id"])!;
        const placeContractAddress = await randomContract.getPlaceAddress(
            blockchainBusId
        );
        const placeContract: DecentravellerPlace = await ethers.getContractAt(
            "DecentravellerPlace",
            placeContractAddress,
            signerConnectedToContract
        );
        const result = await placeContract.addReview(
            reviewData["text"],
            DEFAULT_MOCK_HASHES,
            Math.round(parseFloat(reviewData["starts"]))
        );
        const resp = await result.wait(1);
        if (!resp) {
            throw Error("Error inserting review");
        }
        console.log(
            `Review inserted: ${
                resp.blockHash
            } with signer ${await randomContract.signer.getAddress()}`
        );
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
