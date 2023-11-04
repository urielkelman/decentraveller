import { ethers } from "hardhat";

const PLACE_ID = 92; // La Alacena
const REVIEW_ID = 4; // Ultima review

const main = async () => {

    const moderator = (await ethers.getSigners())[0];

    const moderatorContract = (await ethers.getContractAt(
        "Decentraveller",
        "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e",
        moderator
    ));

    const ruleId = await moderatorContract.getCurrentRuleId();

    const censorTx = await moderatorContract.censorReview(PLACE_ID, REVIEW_ID, ruleId);
    await censorTx.wait();

};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
