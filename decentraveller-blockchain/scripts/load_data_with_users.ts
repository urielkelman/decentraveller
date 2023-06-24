import { ethers } from "hardhat";
import { Decentraveller, DecentravellerPlace } from "../typechain-types";
import { readFileSync } from "fs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const DEFAULT_MOCK_HASHES = ["0xhash1", "0xhash2", "0xhash3"];

async function new_signer(): Promise<SignerWithAddress> {
    const address = ethers.Wallet.createRandom().address
    await ethers.provider.send("hardhat_impersonateAccount", [address]);
    await ethers.provider.send("hardhat_setBalance", [
        address,
        "0x1000000000",
      ]);      
    return ethers.getSigner(address)
}

const main = async () => {
    console.log("Registering profiles");

    const hardhatSigners = await ethers.getSigners();
    /*Contracts are connected to different signers */
    let hardhatDecentravellerContracts: Decentraveller[] = await Promise.all(
        hardhatSigners.map(
            async (signer) =>
                await ethers.getContractAt(
                    "Decentraveller",
                    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
                    signer
                )
        )
    );
    const usersFile = readFileSync("data/ba_users.json", "utf-8");
    var yelp2Signer = new Map<string, SignerWithAddress>();
    var yelp2Contract = new Map<string, Decentraveller>();
    var signerIndex = 0;
    for (const line of usersFile.split(/\r?\n/)) {
        const userData = JSON.parse(line);
        const signer = await new_signer();
        const contract: Decentraveller = await ethers.getContractAt(
            "Decentraveller",
            "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
            signer
        )
        yelp2Signer.set(userData["user_id"], signer);
        yelp2Contract.set(userData["user_id"], contract);
        signerIndex += 1;
        const result = await contract.registerProfile(userData['name'], 'AR', 0);
        if (await result.wait(1)) {
            console.log(
                `Profile registered for signer ${await signer.address}`
            );
        } else {
            throw Error("Error registering profile");
        }
    }

    console.log("Starting business load");
    const businessFile = readFileSync("data/ba_places.json", "utf-8");
    var yelp2id = new Map<string, bigint>();
    for (const line of businessFile.split(/\r?\n/)) {
        const businessData = JSON.parse(line);
        const userContract =
        hardhatDecentravellerContracts[
                Math.floor(Math.random() * hardhatDecentravellerContracts.length)
            ];
        const placeId =
            (await userContract.getCurrentPlaceId()).toBigInt() + BigInt(1);
        const result = await userContract.addPlace(
            businessData["name"],
            businessData["latitude"].toString(),
            businessData["longitude"].toString(),
            businessData["address"],
            3
        );

        if (await result.wait(1)) {
            yelp2id.set(businessData["business_id"], placeId);
            console.log(
                `Place with id ${placeId} inserted with signer ${await userContract.signer.getAddress()}`
            );
        } else {
            throw Error("Error inserting place");
        }
    }

    console.log("Starting review load");
    const reviewFile = readFileSync("data/ba_reviews.json", "utf-8");
    var yelp2owner = new Map<string, number>();
    var owner2yelp = new Set<number>();
    for (const line of reviewFile.split(/\r?\n/)) {
        const reviewData = JSON.parse(line);
        const signerContract = yelp2Signer.get(reviewData['user_id'])!;
        const signerConnectedToContract = yelp2Contract.get(reviewData['user_id'])!
        const blockchainBusId = yelp2id.get(reviewData["business_id"])!;
        const placeContractAddress = await signerConnectedToContract.getPlaceAddress(
            blockchainBusId
        );

        const placeContract: DecentravellerPlace = await ethers.getContractAt(
            "DecentravellerPlace",
            placeContractAddress,
            signerContract
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
            } with signer ${await signerContract.getAddress()}`
        );
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
