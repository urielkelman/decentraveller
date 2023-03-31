import { ethers, run, network, } from "hardhat";
import type {BigNumber} from "ethers";
import { Decentraveller } from "../typechain-types";
import { readFileSync } from 'fs'

const main = async () => {
    const signers = await ethers.getSigners();
    let decentravellerContracts: Decentraveller[] = await Promise.all(
        signers.map(async (s) => await ethers.getContractAt(
        "Decentraveller",
        "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0", s)
    ));

    console.log("Starting business load");

    let business_file = readFileSync('data/business_sample.json',  'utf-8');
    var yelp2id = new Map<string, bigint>();
    for (const line of business_file.split(/\r?\n/)) {
        let business_data = JSON.parse(line);
        let random_contract = decentravellerContracts[Math.floor(Math.random() * decentravellerContracts.length)]
        const place_id = await random_contract.getNextPlaceId();
        const result = await random_contract.addPlace(
            business_data['name'],
            business_data['latitude'].toString(),
            business_data['longitude'].toString(),
            business_data['address'],
            0
        );
        
        if(await result.wait(1)){
            yelp2id.set(business_data['business_id'], place_id.toBigInt());
            console.log(`Place with id ${place_id} inserted with signer ${await random_contract.signer.getAddress()}`);
        } else {
            throw Error("Error inserting place");
        }
    }

    console.log("Starting review load");
    let review_file = readFileSync('data/reviews_sample.json',  'utf-8');
    for (const line of review_file.split(/\r?\n/)) {
        let random_contract = decentravellerContracts[Math.floor(Math.random() * decentravellerContracts.length)]
        let review_data = JSON.parse(line);
        let blockchain_bus_id = yelp2id.get(review_data['business_id'])!
        const result = await random_contract.addReview(blockchain_bus_id, review_data['text'])
        const resp = await result.wait(1)
        if(!resp){
            throw Error("Error inserting review");
        }
        console.log(`Review inserted: ${resp.blockHash} with signer ${await random_contract.signer.getAddress()}`)
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
