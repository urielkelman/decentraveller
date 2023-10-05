import { ethers, getNamedAccounts } from "hardhat";
import {
    Decentraveller,
    DecentravellerGovernance,
    DecentravellerToken,
} from "../../typechain-types";
import { createAndFundUserWallets } from "./set_up_dao_participants";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { Wallet } from "ethers";

const WALLET_PRIVATE_KEY =
    "0x5787c71b828644eaf04241e5627f5cb58e197e2fd348f865c5cc25c4de2bdcb1";

const WALLET_ADDRESS = "0x968C99f227a5D5015d3c50501C91353096AD7931";

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

    const participantsAmount = 10;
    // Register users and fund their wallets.
    const wallets: Wallet[] = await createAndFundUserWallets(
        decentraveller,
        decentravellerToken,
        participantsAmount
    );
    const rule = await decentraveller.getRuleById(3);
    const proposalId = rule.proposalId;

    // Increase the evm time to start voting.
    const votingDelay = await decentravellerGovernance.votingDelay();
    await time.increase(votingDelay);

    // Make the users vote.
    for (let index = 0; index < participantsAmount; index++) {
        const wallet = wallets[index];
        const vote = index % 10 < 7 ? 1 : 0;
        const voteTx = await decentravellerGovernance
            .connect(wallet)
            .castVote(proposalId, vote);
        await voteTx.wait();
    }

    // Increase the evm time for the voting period.
    const votingPeriod = await decentravellerGovernance.votingPeriod();
    await time.increase(votingPeriod);

    // Queue approval rule transaction.
    const approveTxCalldata = (
        await decentraveller.populateTransaction.approveProposedRule(3)
    ).data!;
    const proposalHash = ethers.utils.id("New rule for Decentraveller!");

    const queueProposalTx = await decentravellerGovernance[
        "queue(address[],uint256[],bytes[],bytes32)"
    ]([decentraveller.address], [0], [approveTxCalldata], proposalHash);

    await queueProposalTx.wait();

    // Increase evm time and execute.
    await time.increase(1 * 24 * 60 * 60);

    await decentravellerGovernance[
        "execute(address[],uint256[],bytes[],bytes32)"
    ]([decentraveller.address], [0], [approveTxCalldata], proposalHash);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
