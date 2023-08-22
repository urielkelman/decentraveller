import { ethers, deployments, getNamedAccounts } from "hardhat";
import { anyUint } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { mine, time } from "@nomicfoundation/hardhat-network-helpers";
import {
    Decentraveller,
    DecentravellerGovernance,
    DecentravellerToken,
} from "../typechain-types";
import { expect, assert } from "chai";
import { stat } from "fs";

describe("Decentraveller governance", function () {
    let decentraveller: Decentraveller;
    let decentravellerGovernance: DecentravellerGovernance;
    let decentravellerToken: DecentravellerToken;
    let userAddress: string;

    beforeEach(async function () {
        await deployments.fixture(["all"]);
        const { user, tokenOwner, tokenMinter } = await getNamedAccounts();
        userAddress = user;
        decentraveller = await ethers.getContract("Decentraveller", user);
        await decentraveller.registerProfile("Messi", "AR", 0);
        decentravellerToken = await ethers.getContract(
            "DecentravellerToken",
            tokenOwner
        );
        const setNewRewardTx =
            await decentravellerToken.setNewPlacewRewardAmount(11);
        await setNewRewardTx.wait();
        const tokenMinterSigner = await ethers.getSigner(tokenMinter);
        const rewardWithTokensTx = await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(user);
        await rewardWithTokensTx.wait();
        const decentravellerGovernanceC: DecentravellerGovernance =
            await ethers.getContract("DecentravellerGovernance", user);
        decentravellerGovernance = decentravellerGovernanceC;
    });

    it("Should revert with error when non-registered address tries to create new rule", async function () {
        const { deployer } = await getNamedAccounts();
        const deployerSigner = await ethers.getSigner(deployer);
        await expect(
            decentraveller
                .connect(deployerSigner)
                .createNewRuleProposal("New rule for Decentraveller!")
        ).to.be.revertedWithCustomError(
            decentraveller,
            "Address__Unregistered"
        );
    });

    it("Should emit event on creating new rule proposal", async function () {
        await expect(
            decentraveller.createNewRuleProposal("New rule for Decentraveller!")
        )
            .to.emit(decentraveller, "DecentravellerRuleProposed")
            .withArgs(1, userAddress, "New rule for Decentraveller!", anyUint);
    });

    it("Should revert with error when trying to get non-existent rule", async function () {
        await expect(decentraveller.getRuleById(1))
            .to.be.revertedWithCustomError(decentraveller, "Rule__NonExistent")
            .withArgs(1);
    });

    it("Should return rule when it was previously proposed", async function () {
        const proposeRuleTx = await decentraveller.createNewRuleProposal(
            "New rule for Decentraveller!"
        );
        await proposeRuleTx.wait();
        const rule = await decentraveller.getRuleById(1);
        assert.equal(rule.statement, "New rule for Decentraveller!");
        assert.equal(rule.status, 0);
    });

    it("Should emit event when rule proposal is passed", async function () {
        // Register proposal.
        const newRuleTx = await decentraveller.createNewRuleProposal(
            "New rule for Decentraveller!"
        );
        await newRuleTx.wait();
        const rule = await decentraveller.getRuleById(1);
        const proposalId = rule.proposalId;

        // Increase the evm time to start voting.
        const votingDelay = await decentravellerGovernance.votingDelay();
        await time.increase(votingDelay);

        // Register users and make them vote on proposal to be approved.
        const participantsAmount = 100;
        const { faucet, tokenMinter } = await getNamedAccounts();
        const faucetSigner = await ethers.getSigner(faucet);
        const tokenMinterSigner = await ethers.getSigner(tokenMinter);
        await mine(2, { interval: 15 });
        for (let index = 0; index < participantsAmount; index++) {
            const wallet: ethers.Wallet = ethers.Wallet.createRandom().connect(
                ethers.provider
            );
            // Fund the wallet with some ETH.
            const fundTx = await faucetSigner.sendTransaction({
                to: wallet.address,
                value: ethers.utils.parseEther("1"),
            });
            await fundTx.wait();
            // Register a profile.
            const registerProfileTx = await decentraveller
                .connect(wallet)
                .registerProfile(`User ${index}`, "AR", 1);
            await registerProfileTx.wait();
            // Give some DECT tokens to participate in votation.
            const mintDectTx = await decentravellerToken
                .connect(tokenMinterSigner)
                .rewardNewPlace(wallet.address);
            await mintDectTx.wait();
            // Vote.
            const vote = index % 10 < 7 ? 1 : 0;
            const voteTx = await decentravellerGovernance
                .connect(wallet)
                .castVote(proposalId, vote);
            await voteTx.wait();
        }

        // Increase the evm time for the voting time.
        const votingPeriod = await decentravellerGovernance.votingPeriod();
        await time.increase(votingPeriod);

        const state = await decentravellerGovernance.state(proposalId);
        console.log("state", state);

        // Queue approval rule transaction.
        const approveTxCalldata = (
            await decentraveller.populateTransaction.approveProposedRule(1)
        ).data!;
        const proposalHash = ethers.utils.id("New rule for Decentraveller!");

        const queueProposalTx = await decentravellerGovernance[
            "queue(address[],uint256[],bytes[],bytes32)"
        ]([decentraveller.address], [0], [approveTxCalldata], proposalHash);

        await queueProposalTx.wait();
    });
});
