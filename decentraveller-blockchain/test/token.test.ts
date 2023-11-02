import { expect, assert } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DecentravellerToken } from "../typechain-types";

describe("Decentraveller token", function () {
    let decentravellerToken: DecentravellerToken;
    let tokenOwnerAddress: string;
    let tokenMinterAddress: string;
    let userAddress: string;

    const rewardNewReviewTokensAmount = 1;
    const rewardNewPlaceTokensAmount = 2;

    beforeEach(async function () {
        await deployments.fixture(["token"]);
        const { user, tokenOwner, tokenMinter } = await getNamedAccounts();
        userAddress = user;
        tokenOwnerAddress = tokenOwner;
        tokenMinterAddress = tokenMinter;
        decentravellerToken = await ethers.getContract(
            "DecentravellerToken",
            tokenOwner
        );
        const setPlaceRewardAmountTx =
            await decentravellerToken.setNewPlacewRewardAmount(
                rewardNewPlaceTokensAmount
            );
        await setPlaceRewardAmountTx.wait();
        const setReviewRewardAmountTx =
            await decentravellerToken.setNewReviewRewardAmount(
                rewardNewReviewTokensAmount
            );
        await setReviewRewardAmountTx.wait();
    });
    it("Should not allow rewarding by an address that does not have the minter role", async function () {
        const minterRole = await decentravellerToken.getMinterRole();
        const userSigner = await ethers.getSigner(userAddress);
        await expect(
            decentravellerToken.connect(userSigner).rewardNewPlace(userAddress)
        ).to.be.revertedWith(
            `AccessControl: account ${userAddress.toLowerCase()} is missing role ${minterRole}`
        );
    });
    it("Should delegate the voting power when rewarding new place is invoked and balance should equal voting power", async function () {
        const tokenMinterSigner = await ethers.getSigner(tokenMinterAddress);
        const mintTxResponse = await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(userAddress);
        await mintTxResponse.wait();
        const userBalance = await decentravellerToken.balanceOf(userAddress);
        const userVotes = await decentravellerToken.getVotes(userAddress);
        assert.equal(
            userBalance.toString(),
            rewardNewPlaceTokensAmount.toString()
        );
        assert.equal(userBalance.toString(), userVotes.toString());
    });
    it("Should delegate the voting power when rewarding new review is invoked and balance should equal voting power", async function () {
        const tokenMinterSigner = await ethers.getSigner(tokenMinterAddress);
        const mintTxResponse = await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewReview(userAddress);
        await mintTxResponse.wait();
        const userBalance = await decentravellerToken.balanceOf(userAddress);
        const userVotes = await decentravellerToken.getVotes(userAddress);
        assert.equal(
            userBalance.toString(),
            rewardNewReviewTokensAmount.toString()
        );
        assert.equal(userBalance.toString(), userVotes.toString());
    });
    it("Should revert if user try to delegate voting power", async function () {
        await expect(
            decentravellerToken.delegate(userAddress)
        ).to.be.revertedWithCustomError(
            decentravellerToken,
            "Delegation__Fobidden"
        );
    });

    it("Should revert if user try to approve other user to spend some balance", async function () {
        await expect(
            decentravellerToken.approve(tokenOwnerAddress, 10000)
        ).to.be.revertedWithCustomError(
            decentravellerToken,
            "Transfer__Forbidden"
        );
    });

    it("Should revert if user try to make a transfer of it own balance", async function () {
        await expect(
            decentravellerToken.transfer(tokenOwnerAddress, 10000)
        ).to.be.revertedWithCustomError(
            decentravellerToken,
            "Transfer__Forbidden"
        );
    });

    it("Should revert if amount of token holders asked is less that current holders", async function () {
        const signers = await ethers.getSigners();
        const tokenMinterSigner = await ethers.getSigner(tokenMinterAddress);

        await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(signers[0].address);

        await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(signers[1].address);

        await expect(decentravellerToken.getRandomHolders(3))
            .to.be.revertedWithCustomError(
                decentravellerToken,
                "Holders__NotEnough"
            )
            .withArgs(2);
    });

    it("Should allow getting a random amount of token holders", async function () {
        const signers = await ethers.getSigners();
        const tokenMinterSigner = await ethers.getSigner(tokenMinterAddress);

        await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(signers[0].address);

        await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(signers[1].address);

        await decentravellerToken
            .connect(tokenMinterSigner)
            .rewardNewPlace(signers[2].address);

        const randomHolders = await decentravellerToken.getRandomHolders(2);

        assert.equal(randomHolders.length, 2);

        assert.isTrue(
            [
                signers[0].address,
                signers[1].address,
                signers[2].address,
            ].includes(randomHolders[0])
        );

        assert.isTrue(
            [
                signers[0].address,
                signers[1].address,
                signers[2].address,
            ].includes(randomHolders[1])
        );

        assert.notEqual(randomHolders[0], randomHolders[1]);
    });
});
