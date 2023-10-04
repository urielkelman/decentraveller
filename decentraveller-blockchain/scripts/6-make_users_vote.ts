import { ethers, getNamedAccounts } from "hardhat";
import {
    Decentraveller,
    DecentravellerGovernance,
    DecentravellerToken,
} from "../typechain-types";
import { createAndFundUserWallets } from "./set_up_dao_participants";
import { Wallet } from "ethers";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const main = async () => {
    const user = new ethers.Wallet(WALLET_PRIVATE_KEY, ethers.provider);
    const { tokenOwner } = await getNamedAccounts();

    const decentraveller: Decentraveller = await ethers.getContract(
        "Decentraveller",
        user
    );
    const decentravellerToken: DecentravellerToken = await ethers.getContract(
        "DecentravellerToken",
        tokenOwner
    );
    const decentravellerGovernanceC: DecentravellerGovernance =
        await ethers.getContract("DecentravellerGovernance", user);
    const decentravellerGovernance: DecentravellerGovernance =
        decentravellerGovernanceC;

    const participantsAmount = 50;
    // Register users and fund their wallets.
    const wallets: Wallet[] = await createAndFundUserWallets(
        decentraveller,
        decentravellerToken,
        participantsAmount,
        78
    );
    const rule = await decentraveller.getRuleById(3);
    const proposalId = rule.proposalId;

    // Make the users vote.
    for (let index = 0; index < participantsAmount; index++) {
        const wallet = wallets[index];
        const vote = index % 10 < 7 ? 1 : 0;
        const voteTx = await decentravellerGovernance
            .connect(wallet)
            .castVote(proposalId, vote);
        await voteTx.wait();
        if (index === 3) {
            const result = await decentravellerGovernance.proposals(proposalId);
            console.log(result);
        }
    }

    // ethers.BigNumber.from(event[3]).toString()
    console.log(`proposalId`, ethers.BigNumber.from(proposalId).toString());

    const result = await decentravellerGovernance.proposals(proposalId);
    console.log("result", result);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
