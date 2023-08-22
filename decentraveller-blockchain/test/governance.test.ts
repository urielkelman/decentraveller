import { ethers, deployments, getNamedAccounts } from "hardhat";
import { anyUint } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { mine, time } from "@nomicfoundation/hardhat-network-helpers";
import {
    Decentraveller,
    DecentravellerGovernance,
    DecentravellerToken,
} from "../typechain-types";
import { expect, assert } from "chai";

describe("Decentraveller governance", function () {
    let decentraveller: Decentraveller;
    let decentravellerTokenC: DecentravellerToken;
    let decentravellerGovernance: DecentravellerGovernance;
    let userAddress: string;

    beforeEach(async function () {
        await deployments.fixture(["all"]);
        const { user, tokenOwner, tokenMinter } = await getNamedAccounts();
        userAddress = user;
        decentraveller = await ethers.getContract("Decentraveller", user);
        await decentraveller.registerProfile("Messi", "AR", 0);
        const decentravellerToken: DecentravellerToken =
            await ethers.getContract("DecentravellerToken", tokenOwner);
        decentravellerTokenC = decentravellerToken;
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
});
