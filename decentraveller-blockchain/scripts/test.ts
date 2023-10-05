import { ethers, deployments, getNamedAccounts } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
    Decentraveller,
    DecentravellerGovernance,
    DecentravellerToken,
} from "../typechain-types";
import { Wallet } from "ethers";
import { createAndFundUserWallets } from "./set_up_dao_participants";

const main = async () => {
    let decentraveller: Decentraveller;
    let decentravellerGovernance: DecentravellerGovernance;
    let decentravellerToken: DecentravellerToken;
    let userAddress: string;

    const { user, tokenOwner, tokenMinter } = await getNamedAccounts();
    userAddress = user;
    decentraveller = await ethers.getContract("Decentraveller", user);
    await decentraveller.registerProfile("Messi", "AR", 0);
    decentravellerToken = await ethers.getContract(
        "DecentravellerToken",
        tokenOwner
    );
    const setNewRewardTx = await decentravellerToken.setNewPlacewRewardAmount(
        11
    );
    await setNewRewardTx.wait();
    const tokenMinterSigner = await ethers.getSigner(tokenMinter);
    const rewardWithTokensTx = await decentravellerToken
        .connect(tokenMinterSigner)
        .rewardNewPlace(user);
    await rewardWithTokensTx.wait();
    const decentravellerGovernanceC: DecentravellerGovernance =
        await ethers.getContract("DecentravellerGovernance", user);
    decentravellerGovernance = decentravellerGovernanceC;

    const participantsAmount = 100;
    // Register users and fund their wallets.
    const wallets: Wallet[] = await createAndFundUserWallets(
        decentraveller,
        decentravellerToken,
        participantsAmount
    );
    // Register proposal.
    const newRuleTx = await decentraveller.createNewRuleProposal(
        "New rule for Decentraveller!"
    );
    await newRuleTx.wait();
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

    const txResult = await decentravellerGovernance.proposals(proposalId);
    console.log(txResult);

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

    decentravellerGovernance["execute(address[],uint256[],bytes[],bytes32)"](
        [decentraveller.address],
        [0],
        [approveTxCalldata],
        proposalHash
    );
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
