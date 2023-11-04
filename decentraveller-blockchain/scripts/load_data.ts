import { ethers, getNamedAccounts } from "hardhat";
import { Decentraveller, DecentravellerGovernance, DecentravellerToken } from "../typechain-types";
import { readFileSync, createReadStream } from "fs";
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const main = async () => {
    const httpClient = axios.create();
    httpClient.defaults.timeout = 30000;

    console.log("Registering profiles");

    const signers = await ethers.getSigners();

    let decentravellerContracts: Decentraveller[] = await Promise.all(
        signers.map(
            async (signer) =>
                await ethers.getContractAt(
                    "Decentraveller",
                    "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e",
                    signer
                )
        )
    );

    const usersData = readFileSync("data/ba_users.json", "utf-8").split(/\r?\n/);
    var userId2Contract = new Map<string, Decentraveller>();
    var userId2Signer = new Map<string, SignerWithAddress>();
    var registeredContracts = [];
    for(let i=0; i<usersData.length; i++){
        const userData = JSON.parse(usersData[i]);
        const c = decentravellerContracts[i];
        const result = await c.registerProfile(userData['name'], "AR", 0);
        if (await result.wait(1)) {
            console.log(
                `Profile registered for signer ${await c.signer.getAddress()}`
            );
            userId2Contract.set(userData['user_id'], c);
            userId2Signer.set(userData['user_id'], signers[i]);
            registeredContracts.push(c)
        } else {
            throw Error("Error registering profile");
        }
    }

    const { tokenOwner, tokenMinter } = await getNamedAccounts();

    let decentravellerGovContracts: DecentravellerGovernance[] = await Promise.all(
        signers.map(
            async (signer) =>
                await ethers.getContractAt(
                    "DecentravellerGovernance",
                    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
                    signer
                )
        )
    );
    const decentravellerToken: DecentravellerToken = await ethers.getContractAt(
        "DecentravellerToken",
        "0x057ef64e23666f000b34ae31332854acbd1c8544",
        tokenOwner
    );
    const setNewRewardTx = await decentravellerToken.setNewReviewRewardAmount(
        11
    );
    await setNewRewardTx.wait();

    console.log("Uploading business images");
    const files = fs.readdirSync('data/place_images/')
    const formData = new FormData();
    files.forEach(file => {
        formData.append("files", createReadStream("data/place_images/"+file));
    });
    const imageHashes = await httpClient.post('http://api:8000/uploads', formData, 
    {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(
        function (response) {
            var imageHashes = new Map<string, string[]>();
            for(let i=0; i<files.length; i++){
                const fileHeader = files[i].split(".")[0];
                const filePlace = fileHeader.split("_").slice(1).join("_");
                if(imageHashes.has(filePlace)){
                    imageHashes.set(filePlace, imageHashes.get(filePlace)!.concat([response.data['hashes'][i]]));
                } else {
                    imageHashes.set(filePlace, [response.data['hashes'][i]]);
                }
            }
            return imageHashes;
    }).catch(function (error) {
        console.log(`Error uploading place images: ${error}`)
        return new Map<string, string[]>();;
    });

    console.log("Starting business load");
    const businessFile = readFileSync("data/ba_places.json", "utf-8");
    var yelp2id = new Map<string, bigint>();
    for (const line of businessFile.split(/\r?\n/)) {
        const businessData = JSON.parse(line);
        const randomContract =
            registeredContracts[
                Math.floor(Math.random() * registeredContracts.length)
            ];
        const placeId =
            (await randomContract.getCurrentPlaceId()).toBigInt() + BigInt(1);
        const result = await randomContract.addPlace(
            businessData["name"],
            businessData["latitude"].toString(),
            businessData["longitude"].toString(),
            businessData["address"] + ", Argentina",
            0
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
    const reviewFile = readFileSync("data/ba_reviews.json", "utf-8");
    for (const line of reviewFile.split(/\r?\n/)) {
        const reviewData = JSON.parse(line);
        const signerContract = userId2Contract.get(reviewData["user_id"])!;
        const blockchainBusId = yelp2id.get(reviewData["business_id"])!;

        let reviewImages: string[] = [];
        if (imageHashes.has(reviewData['business_id'])){
            reviewImages = imageHashes.get(reviewData['business_id'])!;
            imageHashes.delete(reviewData['business_id']);
        }
        const result = await signerContract.addReview(
            blockchainBusId,
            reviewData["text"],
            reviewImages,
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

    console.log("Uploading avatars");
    const avatarFiles = fs.readdirSync('data/user_images/')
    for (const file of avatarFiles) {
        const userId = file.split(".")[0];
        const c = userId2Contract.get(userId)!
        const address = await c.signer.getAddress();
        await axios.post(`http://api:8000/profile/${address}/avatar.jpg`, axios.toFormData({"file": createReadStream("data/user_images/"+file)}), {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).catch(function (error) {
            console.log(`Error uploading ${file}`)
        });
    }

    console.log("Creating site rules");

    var tx;

    tx = await decentravellerContracts[0].createNewRuleProposal(
        "No se habla de Decentraveller."
    )
    tx = await tx.wait();

    const ruleId = await decentravellerContracts[0].getCurrentRuleId();

    const rule = await decentravellerContracts[0].getRuleById(ruleId);
    const proposalId = rule.proposalId;

    console.log(`Rule id is ${ruleId} and proposal id is ${proposalId}`);

    const votingDelay = await decentravellerGovContracts[0].votingDelay();
    console.log(`Voting delay is: ${votingDelay}`);
    await time.increase(votingDelay.toBigInt());

    console.log("Voting");
    for (const govUser of decentravellerGovContracts.slice(1)) {
        const voteTx = await govUser.castVote(proposalId, 1);
        await voteTx.wait();
    }

    const votingPeriod = await decentravellerGovContracts[0].votingPeriod();
    console.log(`Voting period is: ${votingPeriod}`);
    await time.increase(votingPeriod);

    const approveTxCalldata = (
        await decentravellerContracts[0].populateTransaction.approveProposedRule(ruleId)
    ).data!;

    const proposalHash = ethers.utils.id("No se habla de Decentraveller.");
    tx = await decentravellerGovContracts[0][
        "queue(address[],uint256[],bytes[],bytes32)"
    ]([decentravellerContracts[0].address], [0], [approveTxCalldata], proposalHash);
    await tx.wait();
    await time.increase(1 * 24 * 60 * 60);
    tx = await decentravellerGovContracts[0][
        "execute(address[],uint256[],bytes[],bytes32)"
    ]([decentravellerContracts[0].address], [0], [approveTxCalldata], proposalHash);
    await tx.wait();
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
