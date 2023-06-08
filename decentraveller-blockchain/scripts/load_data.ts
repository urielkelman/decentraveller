import { ethers } from "hardhat";
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
                    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
                    signer
                )
        )
    );
    console.log("Registering profiles");
    for (const [i, c] of decentravellerContracts.entries()){
        const result = await c.registerProfile(`user${i}`, 'AR', 0);
        if (await result.wait(1)) {
            console.log(
                `Profile registered for signer ${await c.signer.getAddress()}`
            );
        } else {
            throw Error("Error registering profile");
        }
    }

    console.log("Starting business load");
    const businessFile = readFileSync("data/places_sample.json", "utf-8");
    var yelp2id = new Map<string, bigint>();
    for (const line of businessFile.split(/\r?\n/)) {
        const businessData = JSON.parse(line);
        const randomContract =
            decentravellerContracts[
                Math.floor(Math.random() * decentravellerContracts.length)
            ];
        const placeId =
            (await randomContract.getCurrentPlaceId()).toBigInt() + BigInt(1);
        const result = await randomContract.addPlace(
            businessData["name"],
            businessData["latitude"].toString(),
            businessData["longitude"].toString(),
            businessData["address"],
            3
        );

        if (await result.wait(1)) {
            yelp2id.set(businessData["business_id"], placeId);
            console.log(
                `Place with id ${placeId} inserted with signer ${await randomContract.signer.getAddress()}`
            );
        } else {
            throw Error("Error inserting place");
        }
    }

    console.log("Starting review load");
    const reviewFile = readFileSync("data/reviews_sample.json", "utf-8");
    var yelp2owner = new Map<string, number>();
    var owner2yelp = new Set<number>();
    var contractIndex = 0;
    for (const line of reviewFile.split(/\r?\n/)) {
        const reviewData = JSON.parse(line);
        contractIndex = Math.floor(
            Math.random() * decentravellerContracts.length
        );
        if (yelp2owner.has(reviewData['user_id'])){
            contractIndex = 0;
        } else {
            while(owner2yelp.has(contractIndex)){
                contractIndex = (contractIndex + 1) % decentravellerContracts.length
            }
            yelp2owner.set(reviewData['user_id'], contractIndex);
            owner2yelp.add(contractIndex);
        }
        const signerContract = decentravellerContracts[contractIndex];
        const signerConnectedToContract = signers[contractIndex];
        const blockchainBusId = yelp2id.get(reviewData["business_id"])!;
        const placeContractAddress = await signerContract.getPlaceAddress(
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
            Math.round(parseFloat(reviewData["stars"]))
        );

        const resp = await result.wait(1);

        if (!resp) {
            throw Error("Error inserting review");
        }
        console.log(
            `Review inserted: ${
                resp.blockHash
            } with signer ${await signerContract.signer.getAddress()}`
        );
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
