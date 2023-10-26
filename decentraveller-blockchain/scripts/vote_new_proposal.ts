import { ethers } from "hardhat";
import { Decentraveller, DecentravellerGovernance } from "../typechain-types";
import { Wallet } from "ethers";

const main = async () => {

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

    const ruleId = await decentravellerContracts[0].getCurrentRuleId();

    const rule = await decentravellerContracts[0].getRuleById(ruleId);
    const proposalId = rule.proposalId;

    console.log("Voting");
    for (const govUser of decentravellerGovContracts.slice(1)) {
        const voteTx = await govUser.castVote(proposalId, 1);
        await voteTx.wait();
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
