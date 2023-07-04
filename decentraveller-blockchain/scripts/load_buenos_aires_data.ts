import {ethers} from "hardhat";
import {Decentraveller, DecentravellerPlace} from "../typechain-types";
import {readFileSync} from "fs";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

const DEFAULT_MOCK_HASHES = ["0xhash1", "0xhash2", "0xhash3"];

async function new_signer(signer: SignerWithAddress): Promise<SignerWithAddress> {
    const address = ethers.Wallet.createRandom().address
    await ethers.provider.send("hardhat_impersonateAccount", [address]);
    const tx = await signer.sendTransaction({
        to: address,
        value: ethers.utils.parseEther("1"),
    });
    await tx.wait();
    return ethers.getSigner(address)
}

const main = async () => {
    const BATCH_SIZE = 5;
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

    const tqdm = require(`tqdm`);

    for (const [i, c] of hardhatDecentravellerContracts.entries()){
        const result = await c.registerProfile(`user${i}`, 'AR', 0);
        if (!await result.wait(1)) {
            throw Error("Error registering profile");
        }
    }

    console.log("Loading profiles");

    const usersFile = readFileSync("data/ba_users.json", "utf-8");
    var yelp2Signer = new Map<string, SignerWithAddress>();
    var yelp2Contract = new Map<string, Decentraveller>();
    var errors = 0;
    var lines = await usersFile.split(/\r?\n/)
    console.log("Registering profiles");
    for (const it of tqdm(Array.from({length: Math.floor(lines.length / BATCH_SIZE)}, (x, i) => i * BATCH_SIZE),
        {sameLine: false})) {
        await Promise.all(
            lines.slice(it, it + BATCH_SIZE).map(async (line) => {
                    try {
                        const userData = JSON.parse(line);
                        const signer = await new_signer(hardhatSigners[0]);
                        const contract: Decentraveller = await ethers.getContractAt(
                            "Decentraveller",
                            "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
                            signer
                        )
                        const username = `${userData['name'].lower}${signer.address.slice(5, 10)}`
                        const result = await contract.registerProfile(username, 'AR', 0);
                        if (!await result.wait(1)) {
                            throw Error("Error registering profile");
                        }
                        yelp2Signer.set(userData["user_id"], signer);
                        yelp2Contract.set(userData["user_id"], contract);
                    } catch (error) {
                        errors += 1
                    }
                }
            )
        );
        if (errors > 0){
            console.log(`There was ${(errors / BATCH_SIZE) * 100}% errors`);
        }
        errors = 0;
    }

    console.log("Starting business load");
    const businessFile = readFileSync("data/ba_places.json", "utf-8");
    var yelp2id = new Map<string, bigint>();
    lines = await businessFile.split(/\r?\n/)

    for (const it of tqdm(Array.from({length: Math.floor(lines.length / BATCH_SIZE)}, (x, i) => i * BATCH_SIZE),
        {sameLine: false})) {
        await Promise.all(
            lines.slice(it, it + BATCH_SIZE).map(async (line) => {
                    try {
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
                        }
                    } catch (error) {
                        errors += 1
                    }
                }
            )
        );
        if (errors > 0){
            console.log(`There was ${(errors / BATCH_SIZE) * 100}% errors`);
        }
        errors = 0;
    }

    console.log("Starting review load");
    const reviewFile = readFileSync("data/ba_reviews.json", "utf-8");
    lines = await reviewFile.split(/\r?\n/)

    for (const it of tqdm(Array.from({length: Math.floor(lines.length / BATCH_SIZE)}, (x, i) => i * BATCH_SIZE),
        {sameLine: false})) {
        await Promise.all(
            lines.slice(it, it + BATCH_SIZE).map(async (line) => {
                    try {
                        const reviewData = JSON.parse(line);
                        if (!yelp2Signer.has(reviewData['user_id']) || !yelp2id.has(reviewData["business_id"])) {
                            return
                        }
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
                    } catch (error) {
                        console.log(error)
                    }
                }
            )
        );
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
