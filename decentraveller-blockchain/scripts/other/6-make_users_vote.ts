import { ethers } from "hardhat";
import { Decentraveller, DecentravellerGovernance } from "../typechain-types";
import { retrieveFundedWallets } from "./set_up_dao_participants";
import { Wallet } from "ethers";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const main = async () => {
    const user = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);

    const decentraveller: Decentraveller = await ethers.getContract(
        "Decentraveller",
        user
    );
    const decentravellerGovernance: DecentravellerGovernance =
        await ethers.getContract("DecentravellerGovernance", user);

    // Register users and fund their wallets.
    const wallets: Wallet[] = retrieveFundedWallets(20);

    const rule = await decentraveller.getRuleById(3);
    const proposalId = rule.proposalId;

    // Make the users vote.
    for (let index = 0; index < wallets.length; index++) {
        const wallet = wallets[index];
        const vote = index % 10 < 7 ? 1 : 0;
        const voteTx = await decentravellerGovernance
            .connect(wallet)
            .castVote(proposalId, vote);
        await voteTx.wait();
    }

    const result = await decentravellerGovernance.proposals(proposalId);
    console.log("result", result);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
